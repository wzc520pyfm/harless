export interface McpJson {
  mcpServers: Record<string, unknown>;
  [k: string]: unknown;
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
