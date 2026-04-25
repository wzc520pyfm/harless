import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => { cwd = mkdtempSync(path.join(tmpdir(), "h08-")); process.chdir(cwd); });
afterEach(() => { process.chdir(orig); rmSync(cwd, { recursive: true, force: true }); });

describe("scenario 08: .mcp.json merge with user servers", () => {
  it("preserves user MCP servers when adding browser-debug", async () => {
    writeFileSync(path.join(cwd, ".mcp.json"), JSON.stringify({
      mcpServers: {
        "postgres": { command: "pg-mcp", args: ["--host", "localhost"] },
        "custom-tool": { command: "my-tool" },
      },
    }, null, 2));

    await run(["init", "--yes", "--modules=browser-debug"]);

    const mcp = JSON.parse(readFileSync(path.join(cwd, ".mcp.json"), "utf8"));
    expect(mcp.mcpServers.postgres).toEqual({ command: "pg-mcp", args: ["--host", "localhost"] });
    expect(mcp.mcpServers["custom-tool"]).toEqual({ command: "my-tool" });
    expect(mcp.mcpServers["chrome-devtools"]).toBeDefined();
    expect(Object.keys(mcp.mcpServers)).toHaveLength(3);
  });

  it("does not overwrite user-customized chrome-devtools entry", async () => {
    writeFileSync(path.join(cwd, ".mcp.json"), JSON.stringify({
      mcpServers: {
        "chrome-devtools": { command: "my-custom-cdp", args: ["--port", "9222"] },
      },
    }, null, 2));

    await run(["init", "--yes", "--modules=browser-debug"]);

    const mcp = JSON.parse(readFileSync(path.join(cwd, ".mcp.json"), "utf8"));
    expect(mcp.mcpServers["chrome-devtools"].command).toBe("my-custom-cdp");
  });
});
