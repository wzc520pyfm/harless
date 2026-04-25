export interface HarlessConfig {
  version: string;
  installedAt: string;
  stack: { detected: string; packageManager: string };
  agents: string[];
  defaultAgentCmd: string;
  modules: Record<string, ModuleConfig>;
}

export interface ModuleConfig {
  enabled: boolean;
  files?: Array<{ path: string; hash: string }>;
  mcp?: string[];
}

export function parseConfig(raw: string): HarlessConfig {
  const o = JSON.parse(raw);
  for (const k of ["version", "installedAt", "defaultAgentCmd"] as const) {
    if (typeof o[k] !== "string") throw new Error(`config: missing or non-string ${k}`);
  }
  if (typeof o.stack !== "object" || o.stack == null) throw new Error("config: missing stack");
  if (!Array.isArray(o.agents)) throw new Error("config: agents must be array");
  if (typeof o.modules !== "object" || o.modules == null) throw new Error("config: missing modules");
  for (const [k, v] of Object.entries(o.modules as Record<string, any>)) {
    if (typeof v?.enabled !== "boolean") throw new Error(`config: modules.${k}.enabled must be boolean`);
    if (v.files != null && !Array.isArray(v.files)) throw new Error(`config: modules.${k}.files must be array`);
  }
  return o as HarlessConfig;
}

export function stringifyConfig(c: HarlessConfig): string {
  return JSON.stringify(c, null, 2) + "\n";
}
