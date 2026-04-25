import fs from "node:fs";
import path from "node:path";
import { parseConfig } from "./config.js";

export const CHECKS = [
  { bit: 0, id: "node-version", label: "Node.js >= 18" },
  { bit: 1, id: "config-exists", label: ".harness/config.json present + parseable" },
  { bit: 2, id: "agents-md-marker", label: "AGENTS.md contains harless marker block" },
  { bit: 3, id: "scripts-executable", label: "all .harness/scripts/*.sh have +x" },
  { bit: 4, id: "mcp-entry", label: ".mcp.json has chrome-devtools (if browser-debug enabled)" },
  { bit: 5, id: "module-files-intact", label: "every config-listed file exists on disk" },
] as const;

export interface CheckResult {
  id: string;
  label: string;
  ok: boolean;
  hint?: string;
}

export function bitmaskOf(results: CheckResult[]): number {
  let m = 0;
  for (const r of results) {
    if (!r.ok) {
      const c = CHECKS.find(c => c.id === r.id);
      if (c) m |= 1 << c.bit;
    }
  }
  return m;
}

export function runChecks(cwd: string): CheckResult[] {
  const results: CheckResult[] = [];

  // node-version
  const [major] = process.versions.node.split(".").map(Number);
  results.push({
    id: "node-version", label: CHECKS[0].label,
    ok: major >= 18,
    hint: major < 18 ? `current: ${process.versions.node}` : undefined,
  });

  // config-exists
  const cfgPath = path.join(cwd, ".harness/config.json");
  let config: ReturnType<typeof parseConfig> | null = null;
  let cfgOk = false;
  try {
    config = parseConfig(fs.readFileSync(cfgPath, "utf8"));
    cfgOk = true;
  } catch { /* */ }
  results.push({
    id: "config-exists", label: CHECKS[1].label,
    ok: cfgOk,
    hint: !cfgOk ? "run `harless init`" : undefined,
  });

  // agents-md-marker
  const agentsPath = path.join(cwd, "AGENTS.md");
  const hasMarker = fs.existsSync(agentsPath) &&
    fs.readFileSync(agentsPath, "utf8").includes("<!-- BEGIN harless v0.1 -->");
  results.push({
    id: "agents-md-marker", label: CHECKS[2].label,
    ok: hasMarker,
    hint: !hasMarker ? "run `harless init` or check AGENTS.md" : undefined,
  });

  // scripts-executable
  const scriptsDir = path.join(cwd, ".harness/scripts");
  let scriptsOk = true;
  let scriptHint: string | undefined;
  if (fs.existsSync(scriptsDir)) {
    for (const f of fs.readdirSync(scriptsDir).filter(f => f.endsWith(".sh"))) {
      try {
        fs.accessSync(path.join(scriptsDir, f), fs.constants.X_OK);
      } catch {
        scriptsOk = false;
        scriptHint = `chmod +x .harness/scripts/${f}`;
        break;
      }
    }
  }
  results.push({
    id: "scripts-executable", label: CHECKS[3].label,
    ok: scriptsOk, hint: scriptHint,
  });

  // mcp-entry
  let mcpOk = true;
  if (config?.modules["browser-debug"]?.enabled) {
    const mcpPath = path.join(cwd, ".mcp.json");
    try {
      const mcp = JSON.parse(fs.readFileSync(mcpPath, "utf8"));
      mcpOk = "chrome-devtools" in (mcp.mcpServers ?? {});
    } catch {
      mcpOk = false;
    }
  }
  results.push({
    id: "mcp-entry", label: CHECKS[4].label,
    ok: mcpOk,
    hint: !mcpOk ? "re-run `harless add browser-debug`" : undefined,
  });

  // module-files-intact
  let filesOk = true;
  let missingFile: string | undefined;
  if (config) {
    for (const mc of Object.values(config.modules)) {
      if (!mc.enabled || !mc.files) continue;
      for (const f of mc.files) {
        if (!fs.existsSync(path.join(cwd, f.path))) {
          filesOk = false;
          missingFile = f.path;
          break;
        }
      }
      if (!filesOk) break;
    }
  }
  results.push({
    id: "module-files-intact", label: CHECKS[5].label,
    ok: filesOk,
    hint: missingFile ? `missing: ${missingFile} — run \`harless init\` to repair` : undefined,
  });

  return results;
}
