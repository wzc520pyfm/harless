import fs from "node:fs";
import path from "node:path";
import { parseConfig, stringifyConfig } from "../lib/config.js";
import { sha256 } from "../lib/hash.js";
import { removeRowsFromAgentsBlock } from "../lib/merge-agents-md.js";
import { log } from "../lib/logger.js";
import { precondition } from "../lib/errors.js";
import { removeMcpServersFromAllProjectFiles } from "../lib/merge-mcp-json.js";
import { harlessConfigPath, harlessRootAbs, harlessTrashRootAbs, HARLESS_ROOT } from "../lib/paths.js";
import type { Flags } from "../cli.js";

export async function removeCmd(moduleName: string | undefined, flags: Flags) {
  if (!moduleName) throw precondition("usage: harless remove <module>");
  const cwd = process.cwd();
  const configPath = harlessConfigPath(cwd);
  if (!fs.existsSync(configPath)) {
    throw precondition("no .agents/config.json found — run `harless init` first");
  }

  const config = parseConfig(fs.readFileSync(configPath, "utf8"));
  const mc = config.modules[moduleName];
  if (!mc?.enabled) {
    throw precondition(`module "${moduleName}" is not enabled`);
  }

  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const summary: { file: string; action: string }[] = [];

  for (const entry of mc.files ?? []) {
    const abs = path.join(cwd, entry.path);
    if (!fs.existsSync(abs)) {
      summary.push({ file: entry.path, action: "missing" });
      continue;
    }
    const diskHash = sha256(fs.readFileSync(abs, "utf8"));
    const pristine = diskHash === entry.hash;

    if (pristine) {
      fs.unlinkSync(abs);
      summary.push({ file: entry.path, action: "deleted" });
    } else if (flags.yes) {
      const trashDst = path.join(harlessTrashRootAbs(cwd), ts, path.relative(harlessRootAbs(cwd), abs));
      fs.mkdirSync(path.dirname(trashDst), { recursive: true });
      fs.renameSync(abs, trashDst);
      summary.push({ file: entry.path, action: `trashed → ${HARLESS_ROOT}/.trash/${ts}/...` });
    } else {
      log.warn(`${entry.path} was modified. Keeping (use --yes to trash).`);
      summary.push({ file: entry.path, action: "kept (modified)" });
    }
  }

  if (mc.mcp) {
    removeMcpServersFromAllProjectFiles(cwd, mc.mcp);
  }

  const agentsMdPath = path.join(cwd, "AGENTS.md");
  if (fs.existsSync(agentsMdPath)) {
    const content = fs.readFileSync(agentsMdPath, "utf8");
    fs.writeFileSync(agentsMdPath, removeRowsFromAgentsBlock(content, moduleName));
  }

  mc.enabled = false;
  fs.writeFileSync(configPath, stringifyConfig(config));

  log.ok(`removed module "${moduleName}"`);
  for (const s of summary) log.dim(`  ${s.action.padEnd(30)} ${s.file}`);
}
