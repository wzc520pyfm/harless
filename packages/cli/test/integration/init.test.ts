import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => {
  cwd = mkdtempSync(path.join(tmpdir(), "harless-init-"));
  process.chdir(cwd);
});
afterEach(() => {
  process.chdir(orig);
  rmSync(cwd, { recursive: true, force: true });
});

describe("harless init (non-interactive)", () => {
  it("creates .agents/, AGENTS.md, config.json", async () => {
    await run(["init", "--yes", "--modules=skills,spec", "--agents=claude-code"]);
    expect(existsSync(path.join(cwd, "AGENTS.md"))).toBe(true);
    expect(existsSync(path.join(cwd, ".agents/config.json"))).toBe(true);
    expect(existsSync(path.join(cwd, ".agents/skills/brainstorming/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(cwd, ".agents/spec/SKILL.md"))).toBe(true);
    const cfg = JSON.parse(readFileSync(path.join(cwd, ".agents/config.json"), "utf8"));
    expect(cfg.modules.skills.enabled).toBe(true);
    expect(cfg.modules.spec.enabled).toBe(true);
    expect(cfg.modules.loop).toBeUndefined();
  });

  it("AGENTS.md contains harless marker block", async () => {
    await run(["init", "--yes", "--modules=skills"]);
    const content = readFileSync(path.join(cwd, "AGENTS.md"), "utf8");
    expect(content).toContain("<!-- BEGIN harless v0.1 -->");
    expect(content).toContain("<!-- END harless v0.1 -->");
  });

  it("preserves existing AGENTS.md user content", async () => {
    writeFileSync(path.join(cwd, "AGENTS.md"), "# My project\n\nCustom instructions.\n");
    await run(["init", "--yes", "--modules=skills"]);
    const content = readFileSync(path.join(cwd, "AGENTS.md"), "utf8");
    expect(content).toContain("Custom instructions.");
    expect(content).toContain("<!-- BEGIN harless v0.1 -->");
  });

  it("does not modify pre-existing CLAUDE.md", async () => {
    writeFileSync(path.join(cwd, "CLAUDE.md"), "my claude config");
    await run(["init", "--yes", "--modules=skills"]);
    expect(readFileSync(path.join(cwd, "CLAUDE.md"), "utf8")).toBe("my claude config");
  });

  it("self-repair re-creates missing file", async () => {
    await run(["init", "--yes", "--modules=skills"]);
    const skillPath = path.join(cwd, ".agents/skills/brainstorming/SKILL.md");
    expect(existsSync(skillPath)).toBe(true);
    rmSync(skillPath);
    expect(existsSync(skillPath)).toBe(false);
    await run(["init", "--yes"]);
    expect(existsSync(skillPath)).toBe(true);
  });
});
