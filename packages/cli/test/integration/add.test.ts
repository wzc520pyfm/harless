import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => {
  cwd = mkdtempSync(path.join(tmpdir(), "harless-add-"));
  process.chdir(cwd);
});
afterEach(() => {
  process.chdir(orig);
  rmSync(cwd, { recursive: true, force: true });
});

describe("harless add", () => {
  it("adds a module to an existing install", async () => {
    await run(["init", "--yes", "--modules=skills", "--agents=claude-code"]);
    expect(existsSync(path.join(cwd, ".agents/orchestrate/SKILL.md"))).toBe(false);
    await run(["add", "orchestrate"]);
    expect(existsSync(path.join(cwd, ".agents/orchestrate/SKILL.md"))).toBe(true);
    const cfg = JSON.parse(readFileSync(path.join(cwd, ".agents/config.json"), "utf8"));
    expect(cfg.modules.orchestrate.enabled).toBe(true);
  });

  it("is idempotent for already-installed module", async () => {
    await run(["init", "--yes", "--modules=skills", "--agents=claude-code"]);
    await run(["add", "skills"]);
    const cfg = JSON.parse(readFileSync(path.join(cwd, ".agents/config.json"), "utf8"));
    expect(cfg.modules.skills.enabled).toBe(true);
  });

  it("creates .mcp.json and .cursor/mcp.json for browser-debug module", async () => {
    await run(["init", "--yes", "--modules=skills", "--agents=claude-code"]);
    await run(["add", "browser-debug"]);
    expect(existsSync(path.join(cwd, ".mcp.json"))).toBe(true);
    expect(existsSync(path.join(cwd, ".cursor", "mcp.json"))).toBe(true);
    const mcp = JSON.parse(readFileSync(path.join(cwd, ".mcp.json"), "utf8"));
    const cur = JSON.parse(readFileSync(path.join(cwd, ".cursor", "mcp.json"), "utf8"));
    expect(mcp.mcpServers["chrome-devtools"]).toBeDefined();
    expect(cur.mcpServers["chrome-devtools"]).toBeDefined();
  });
});
