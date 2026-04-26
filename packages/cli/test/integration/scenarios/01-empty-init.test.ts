import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => { cwd = mkdtempSync(path.join(tmpdir(), "h01-")); process.chdir(cwd); });
afterEach(() => { process.chdir(orig); rmSync(cwd, { recursive: true, force: true }); });

describe("scenario 01: empty dir init", () => {
  it("creates full harness with all default modules", async () => {
    await run(["init", "--yes"]);
    expect(existsSync(path.join(cwd, "AGENTS.md"))).toBe(true);
    expect(existsSync(path.join(cwd, ".agents/config.json"))).toBe(true);
    const cfg = JSON.parse(readFileSync(path.join(cwd, ".agents/config.json"), "utf8"));
    for (const m of ["skills", "spec", "loop", "memory", "browser-debug", "review"]) {
      expect(cfg.modules[m]?.enabled).toBe(true);
    }
    expect(cfg.modules.orchestrate).toBeUndefined();
    expect(cfg.modules.simplify).toBeUndefined();
  });

  it("AGENTS.md has both discipline and capability tables", async () => {
    await run(["init", "--yes"]);
    const md = readFileSync(path.join(cwd, "AGENTS.md"), "utf8");
    expect(md).toContain("Disciplines");
    expect(md).toContain("Capability Modules");
    expect(md).toContain("brainstorming/SKILL.md");
    expect(md).toContain("loop/SKILL.md");
  });

  it("all installed scripts are executable", async () => {
    await run(["init", "--yes"]);
    const scriptsDir = path.join(cwd, ".agents/scripts");
    if (existsSync(scriptsDir)) {
      for (const f of readdirSync(scriptsDir).filter(f => f.endsWith(".sh"))) {
        const { mode } = require("node:fs").statSync(path.join(scriptsDir, f));
        expect(mode & 0o111).toBeGreaterThan(0);
      }
    }
  });

  it(".mcp.json created for browser-debug", async () => {
    await run(["init", "--yes"]);
    expect(existsSync(path.join(cwd, ".mcp.json"))).toBe(true);
    const mcp = JSON.parse(readFileSync(path.join(cwd, ".mcp.json"), "utf8"));
    expect(mcp.mcpServers["chrome-devtools"]).toBeDefined();
  });
});
