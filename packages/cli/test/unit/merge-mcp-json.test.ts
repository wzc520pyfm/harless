import { describe, it, expect } from "vitest";
import { mergeMcpJson } from "../../src/lib/merge-mcp-json.js";

const cdt = { command: "npx", args: ["chrome-devtools-mcp@latest"] };

describe("mergeMcpJson", () => {
  it("creates fresh file when none exists", () => {
    const out = mergeMcpJson(null, { "chrome-devtools": cdt });
    expect(out.mcpServers["chrome-devtools"]).toEqual(cdt);
  });
  it("preserves user's other servers", () => {
    const existing = { mcpServers: { "user-a": { command: "x" } } };
    const out = mergeMcpJson(existing, { "chrome-devtools": cdt });
    expect(out.mcpServers["user-a"]).toEqual({ command: "x" });
    expect(out.mcpServers["chrome-devtools"]).toEqual(cdt);
  });
  it("is idempotent", () => {
    const existing = { mcpServers: { "chrome-devtools": cdt } };
    const out = mergeMcpJson(existing, { "chrome-devtools": cdt });
    expect(Object.keys(out.mcpServers).length).toBe(1);
  });
  it("does not overwrite user-modified server with same key", () => {
    const existing = { mcpServers: { "chrome-devtools": { command: "user-overridden" } } };
    const out = mergeMcpJson(existing, { "chrome-devtools": cdt });
    expect(out.mcpServers["chrome-devtools"]).toEqual({ command: "user-overridden" });
  });
});
