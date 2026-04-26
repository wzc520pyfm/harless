import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, existsSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => {
  cwd = mkdtempSync(path.join(tmpdir(), "harless-upd-"));
  process.chdir(cwd);
});
afterEach(() => {
  process.chdir(orig);
  rmSync(cwd, { recursive: true, force: true });
});

describe("harless update", () => {
  it("keeps files when neither disk nor template changed", async () => {
    await run(["init", "--yes", "--modules=skills", "--agents=claude-code"]);
    const before = readFileSync(path.join(cwd, ".agents/skills/brainstorming/SKILL.md"), "utf8");
    await run(["update"]);
    const after = readFileSync(path.join(cwd, ".agents/skills/brainstorming/SKILL.md"), "utf8");
    expect(after).toBe(before);
  });

  it("recreates missing files", async () => {
    await run(["init", "--yes", "--modules=skills", "--agents=claude-code"]);
    const p = path.join(cwd, ".agents/skills/brainstorming/SKILL.md");
    unlinkSync(p);
    expect(existsSync(p)).toBe(false);
    await run(["update"]);
    expect(existsSync(p)).toBe(true);
  });

  it("detects user-modified + template-unchanged as keep", async () => {
    await run(["init", "--yes", "--modules=skills", "--agents=claude-code"]);
    const p = path.join(cwd, ".agents/skills/brainstorming/SKILL.md");
    writeFileSync(p, "user changes\n");
    await run(["update"]);
    expect(readFileSync(p, "utf8")).toBe("user changes\n");
  });
});
