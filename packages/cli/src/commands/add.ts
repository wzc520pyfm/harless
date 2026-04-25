import fs from "node:fs";
import path from "node:path";
import { parseConfig, stringifyConfig } from "../lib/config.js";
import { installModule, loadManifest, loadAgentsMdBlock, rewriteAgentsMd, distTemplateRoot } from "../lib/installer.js";
import { log } from "../lib/logger.js";
import { precondition } from "../lib/errors.js";
import type { Flags } from "../cli.js";

export async function addCmd(moduleName: string | undefined, flags: Flags) {
  if (!moduleName) throw precondition("usage: harless add <module>");
  const cwd = process.cwd();
  const configPath = path.join(cwd, ".harness/config.json");
  if (!fs.existsSync(configPath)) {
    throw precondition("no .harness/config.json found — run `harless init` first");
  }

  const config = parseConfig(fs.readFileSync(configPath, "utf8"));
  if (config.modules[moduleName]?.enabled) {
    log.info(`module "${moduleName}" is already installed — no-op`);
    return;
  }

  const tplRoot = distTemplateRoot();
  const manifest = loadManifest(tplRoot);
  if (!manifest[moduleName]) {
    throw precondition(`unknown module: "${moduleName}". Available: ${Object.keys(manifest).join(", ")}`);
  }

  installModule({ module: moduleName, templateRoot: tplRoot, cwd, manifest, config });
  rewriteAgentsMd(cwd, loadAgentsMdBlock(tplRoot));
  fs.writeFileSync(configPath, stringifyConfig(config));
  log.ok(`added module "${moduleName}"`);
}
