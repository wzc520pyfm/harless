import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => { cwd = mkdtempSync(path.join(tmpdir(), "h02-")); process.chdir(cwd); });
afterEach(() => { process.chdir(orig); rmSync(cwd, { recursive: true, force: true }); });

describe("scenario 02: init over existing project with AGENTS.md / CLAUDE.md", () => {
  it("preserves user AGENTS.md content and appends harless block", async () => {
    writeFileSync(path.join(cwd, "AGENTS.md"), "# My Project\n\nDo not remove this.\n");
    await run(["init", "--yes", "--modules=skills"]);
    const md = readFileSync(path.join(cwd, "AGENTS.md"), "utf8");
    expect(md).toContain("Do not remove this.");
    expect(md).toContain("<!-- BEGIN harless v0.1 -->");
  });

  it("does not modify CLAUDE.md", async () => {
    const original = "Be concise.\n";
    writeFileSync(path.join(cwd, "CLAUDE.md"), original);
    await run(["init", "--yes", "--modules=skills"]);
    expect(readFileSync(path.join(cwd, "CLAUDE.md"), "utf8")).toBe(original);
  });

  it("does not modify .cursorrules", async () => {
    const original = "rules here\n";
    writeFileSync(path.join(cwd, ".cursorrules"), original);
    await run(["init", "--yes", "--modules=skills"]);
    expect(readFileSync(path.join(cwd, ".cursorrules"), "utf8")).toBe(original);
  });

  it("preserves existing .mcp.json user servers", async () => {
    writeFileSync(path.join(cwd, ".mcp.json"), JSON.stringify({
      mcpServers: { "my-server": { command: "my-cmd" } },
    }));
    await run(["init", "--yes", "--modules=browser-debug"]);
    const mcp = JSON.parse(readFileSync(path.join(cwd, ".mcp.json"), "utf8"));
    expect(mcp.mcpServers["my-server"]).toEqual({ command: "my-cmd" });
    expect(mcp.mcpServers["chrome-devtools"]).toBeDefined();
  });
});
