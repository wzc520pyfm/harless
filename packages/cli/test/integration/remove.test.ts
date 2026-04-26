import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => {
  cwd = mkdtempSync(path.join(tmpdir(), "harless-rm-"));
  process.chdir(cwd);
});
afterEach(() => {
  process.chdir(orig);
  rmSync(cwd, { recursive: true, force: true });
});

describe("harless remove", () => {
  it("removes a pristine module (files deleted)", async () => {
    await run(["init", "--yes", "--modules=skills,loop", "--agents=claude-code"]);
    expect(existsSync(path.join(cwd, ".agents/loop/SKILL.md"))).toBe(true);
    await run(["remove", "loop"]);
    expect(existsSync(path.join(cwd, ".agents/loop/SKILL.md"))).toBe(false);
    const cfg = JSON.parse(readFileSync(path.join(cwd, ".agents/config.json"), "utf8"));
    expect(cfg.modules.loop.enabled).toBe(false);
  });

  it("trashes modified files with --yes", async () => {
    await run(["init", "--yes", "--modules=skills,loop", "--agents=claude-code"]);
    const skillPath = path.join(cwd, ".agents/loop/SKILL.md");
    writeFileSync(skillPath, "user modified content\n");
    await run(["remove", "loop", "--yes"]);
    expect(existsSync(skillPath)).toBe(false);
    const trashFiles = rmSync; // just check .trash exists
    expect(existsSync(path.join(cwd, ".agents/.trash"))).toBe(true);
  });

  it("removes AGENTS.md rows for the module", async () => {
    await run(["init", "--yes", "--modules=skills,loop", "--agents=claude-code"]);
    let content = readFileSync(path.join(cwd, "AGENTS.md"), "utf8");
    expect(content).toContain("loop/SKILL.md");
    await run(["remove", "loop"]);
    content = readFileSync(path.join(cwd, "AGENTS.md"), "utf8");
    expect(content).not.toContain("loop/SKILL.md");
  });
});
