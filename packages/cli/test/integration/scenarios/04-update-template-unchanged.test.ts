import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => { cwd = mkdtempSync(path.join(tmpdir(), "h04-")); process.chdir(cwd); });
afterEach(() => { process.chdir(orig); rmSync(cwd, { recursive: true, force: true }); });

describe("scenario 04: update when template unchanged", () => {
  it("keeps all files untouched when no template change", async () => {
    await run(["init", "--yes", "--modules=skills"]);
    const p = path.join(cwd, ".agents/skills/tdd/SKILL.md");
    const before = readFileSync(p, "utf8");
    await run(["update"]);
    expect(readFileSync(p, "utf8")).toBe(before);
  });

  it("keeps user-modified files when template unchanged", async () => {
    await run(["init", "--yes", "--modules=skills"]);
    const p = path.join(cwd, ".agents/skills/tdd/SKILL.md");
    writeFileSync(p, "my custom TDD workflow\n");
    await run(["update"]);
    expect(readFileSync(p, "utf8")).toBe("my custom TDD workflow\n");
  });
});
