import path from "node:path";
import fs from "node:fs";
import { detectStack } from "../lib/detect-stack.js";
import { stringifyConfig, parseConfig, type HarlessConfig } from "../lib/config.js";
import { sha256 } from "../lib/hash.js";
import {
  installModule, loadManifest, loadAgentsMdBlock,
  rewriteAgentsMd, distTemplateRoot,
} from "../lib/installer.js";
import { log } from "../lib/logger.js";
import { prompts } from "../lib/prompts.js";
import { precondition } from "../lib/errors.js";
import type { Flags } from "../cli.js";

const ALL_MODULES = ["skills", "spec", "loop", "memory", "browser-debug", "orchestrate", "review", "simplify"];
const DEFAULT_ON = ["skills", "spec", "loop", "memory", "browser-debug", "review"];
const ALL_AGENTS = ["claude-code", "cursor", "codex", "other"];
const DEFAULT_AGENTS = ["claude-code"];
const COEXIST_FILES = ["CLAUDE.md", ".cursorrules", ".github/copilot-instructions.md", "GEMINI.md"];

export async function initCmd(flags: Flags) {
  const cwd = process.cwd();
  const configPath = path.join(cwd, ".harness/config.json");

  if (fs.existsSync(configPath)) {
    return repairInit(cwd, configPath, flags);
  }

  const stack = detectStack(cwd);
  if (stack.workspace && !flags.here && !isWorkspaceRoot(cwd)) {
    throw precondition(
      "monorepo sub-package detected. Run harless from the workspace root, " +
      "or pass --here if you really want a per-package install.",
    );
  }

  let modules: string[];
  let agents: string[];
  if (flags.yes) {
    modules = flags.modules ? String(flags.modules).split(",") : DEFAULT_ON;
    agents = flags.agents ? String(flags.agents).split(",") : DEFAULT_AGENTS;
  } else {
    modules = await prompts.checkbox({ message: "Modules to install:", choices: ALL_MODULES.map(v => ({ value: v, checked: DEFAULT_ON.includes(v) })) });
    agents = await prompts.checkbox({ message: "Smoke-tested agents:", choices: ALL_AGENTS.map(v => ({ value: v, checked: DEFAULT_AGENTS.includes(v) })) });
  }

  const tplRoot = distTemplateRoot();
  const manifest = loadManifest(tplRoot);
  const config: HarlessConfig = {
    version: "0.1.0",
    installedAt: new Date().toISOString(),
    stack: { detected: stack.framework, packageManager: stack.packageManager },
    agents,
    defaultAgentCmd: defaultAgentFor(agents),
    modules: {},
  };

  for (const m of modules) {
    installModule({ module: m, templateRoot: tplRoot, cwd, manifest, config });
  }

  detectCoexistence(cwd);
  rewriteAgentsMd(cwd, loadAgentsMdBlock(tplRoot));
  fs.mkdirSync(path.join(cwd, ".harness"), { recursive: true });
  fs.writeFileSync(configPath, stringifyConfig(config));

  log.ok(`harless v${config.version} installed at ${cwd}`);
  log.info("Next steps: review AGENTS.md and commit.");
  printGitignoreSnippet();
}

async function repairInit(cwd: string, configPath: string, _flags: Flags) {
  const config = parseConfig(fs.readFileSync(configPath, "utf8"));
  const tplRoot = distTemplateRoot();
  const manifest = loadManifest(tplRoot);
  let repaired = 0;

  for (const [mod, mc] of Object.entries(config.modules)) {
    if (!mc.enabled || !mc.files) continue;
    const mDef = manifest[mod];
    if (!mDef) continue;
    for (const rel of mDef.files) {
      const dst = path.join(cwd, ".harness", rel);
      if (!fs.existsSync(dst)) {
        const src = path.join(tplRoot, "modules", mod, rel);
        fs.mkdirSync(path.dirname(dst), { recursive: true });
        fs.copyFileSync(src, dst);
        if (rel.endsWith(".sh")) fs.chmodSync(dst, 0o755);
        const newHash = sha256(fs.readFileSync(dst, "utf8"));
        const entry = mc.files.find(f => f.path === `.harness/${rel}`);
        if (entry) entry.hash = newHash;
        else mc.files.push({ path: `.harness/${rel}`, hash: newHash });
        log.info(`repair: re-created .harness/${rel}`);
        repaired++;
      }
    }
  }

  fs.writeFileSync(configPath, stringifyConfig(config));
  if (repaired) log.ok(`repaired ${repaired} file(s)`);
  else log.ok("all files intact, nothing to repair");
}

function detectCoexistence(cwd: string) {
  for (const f of COEXIST_FILES) {
    if (fs.existsSync(path.join(cwd, f))) {
      log.info(`found existing ${f} — harless uses AGENTS.md; consider adding "@AGENTS.md" inside ${f}`);
    }
  }
}

function isWorkspaceRoot(cwd: string): boolean {
  return fs.existsSync(path.join(cwd, "pnpm-workspace.yaml"))
    || fs.existsSync(path.join(cwd, "lerna.json"))
    || (fs.existsSync(path.join(cwd, "package.json"))
      && Array.isArray(JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf8")).workspaces));
}

function defaultAgentFor(agents: string[]): string {
  if (agents.includes("claude-code")) return "claude -p";
  if (agents.includes("cursor")) return "cursor-agent -p";
  if (agents.includes("codex")) return "codex exec";
  return "claude -p";
}

function printGitignoreSnippet() {
  log.info("Suggested .gitignore additions:");
  log.dim([
    "  # harless",
    "  .harness/.trash/",
    "  .harness/memory/sessions/",
    "  .harness/orchestrate/",
    "  .harness/review/",
    "  .harness/simplify/",
  ].join("\n"));
}
