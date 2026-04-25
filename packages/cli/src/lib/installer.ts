import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "./hash.js";
import { mergeAgentsMd } from "./merge-agents-md.js";
import { mergeMcpJson } from "./merge-mcp-json.js";
import type { HarlessConfig, ModuleConfig } from "./config.js";

export interface Manifest {
  [module: string]: { files: string[]; mcp?: Record<string, unknown> };
}

export function loadManifest(templateRoot: string): Manifest {
  return JSON.parse(fs.readFileSync(path.join(templateRoot, "manifest.json"), "utf8"));
}

export function loadAgentsMdBlock(templateRoot: string): string {
  return fs.readFileSync(path.join(templateRoot, "AGENTS.md.tpl"), "utf8");
}

export function installModule(opts: {
  module: string;
  templateRoot: string;
  cwd: string;
  manifest: Manifest;
  config: HarlessConfig;
}): ModuleConfig {
  const { module, templateRoot, cwd, manifest, config } = opts;
  const m = manifest[module];
  if (!m) throw new Error(`unknown module: ${module}`);
  const files: { path: string; hash: string }[] = [];
  for (const rel of m.files) {
    const src = path.join(templateRoot, "modules", module, rel);
    const dst = path.join(cwd, ".harness", rel);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    if (fs.existsSync(dst)) {
      files.push({ path: `.harness/${rel}`, hash: sha256(fs.readFileSync(dst, "utf8")) });
      continue;
    }
    fs.copyFileSync(src, dst);
    if (rel.endsWith(".sh")) fs.chmodSync(dst, 0o755);
    files.push({ path: `.harness/${rel}`, hash: sha256(fs.readFileSync(dst, "utf8")) });
  }
  if (m.mcp) {
    const mcpPath = path.join(cwd, ".mcp.json");
    const existing = fs.existsSync(mcpPath) ? JSON.parse(fs.readFileSync(mcpPath, "utf8")) : null;
    fs.writeFileSync(mcpPath, JSON.stringify(mergeMcpJson(existing, m.mcp), null, 2) + "\n");
  }
  config.modules[module] = { enabled: true, files, ...(m.mcp ? { mcp: Object.keys(m.mcp) } : {}) };
  return config.modules[module];
}

export function rewriteAgentsMd(cwd: string, blockBody: string) {
  const p = path.join(cwd, "AGENTS.md");
  const existing = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
  fs.writeFileSync(p, mergeAgentsMd(existing, blockBody));
}

export function distTemplateRoot(): string {
  const here = fileURLToPath(new URL("../templates", import.meta.url));
  return here;
}
