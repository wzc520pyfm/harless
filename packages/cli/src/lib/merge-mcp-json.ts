import fs from "node:fs";
import path from "node:path";
import { mcpConfigPaths } from "./paths.js";

export interface McpJson {
  mcpServers: Record<string, unknown>;
  [k: string]: unknown;
}

/**
 * Merge MCP patch into every project MCP file harless manages.
 * Reads all existing files first (first-listed path wins on duplicate server keys),
 * applies `toAdd` only for missing keys, then writes the same merged JSON to each path.
 */
export function mergeMcpIntoAllProjectFiles(cwd: string, toAdd: Record<string, unknown>): void {
  const paths = mcpConfigPaths(cwd);
  const aggregatedServers: Record<string, unknown> = {};
  const extraTopLevel: Record<string, unknown> = {};
  for (const mcpPath of paths) {
    if (!fs.existsSync(mcpPath)) continue;
    try {
      const j = JSON.parse(fs.readFileSync(mcpPath, "utf8")) as Record<string, unknown>;
      const servers = (j.mcpServers ?? {}) as Record<string, unknown>;
      for (const [k, v] of Object.entries(servers)) {
        if (!(k in aggregatedServers)) aggregatedServers[k] = v;
      }
      for (const [k, v] of Object.entries(j)) {
        if (k === "mcpServers") continue;
        if (!(k in extraTopLevel)) extraTopLevel[k] = v;
      }
    } catch {
      /* skip corrupt */
    }
  }
  const merged = mergeMcpJson({ ...extraTopLevel, mcpServers: aggregatedServers } as McpJson, toAdd);
  for (const mcpPath of paths) {
    fs.mkdirSync(path.dirname(mcpPath), { recursive: true });
    fs.writeFileSync(mcpPath, JSON.stringify(merged, null, 2) + "\n");
  }
}

/** Remove named MCP servers from every project MCP file harless manages. */
export function removeMcpServersFromAllProjectFiles(cwd: string, keys: string[]): void {
  for (const mcpPath of mcpConfigPaths(cwd)) {
    if (!fs.existsSync(mcpPath)) continue;
    try {
      const mcpJson = JSON.parse(fs.readFileSync(mcpPath, "utf8"));
      for (const key of keys) delete mcpJson.mcpServers?.[key];
      fs.writeFileSync(mcpPath, JSON.stringify(mcpJson, null, 2) + "\n");
    } catch {
      /* leave corrupt file alone */
    }
  }
}

export function mergeMcpJson(
  existing: Partial<McpJson> | null,
  toAdd: Record<string, unknown>,
): McpJson {
  const base = existing ?? {};
  const servers = { ...((base.mcpServers as Record<string, unknown>) ?? {}) };
  for (const [k, v] of Object.entries(toAdd)) {
    if (!(k in servers)) servers[k] = v;
  }
  return { ...base, mcpServers: servers };
}
