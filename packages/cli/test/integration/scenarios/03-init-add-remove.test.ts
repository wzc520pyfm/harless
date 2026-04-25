import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => { cwd = mkdtempSync(path.join(tmpdir(), "h03-")); process.chdir(cwd); });
afterEach(() => { process.chdir(orig); rmSync(cwd, { recursive: true, force: true }); });

describe("scenario 03: init → add → remove lifecycle", () => {
  it("full lifecycle: init with subset, add module, remove module", async () => {
    await run(["init", "--yes", "--modules=skills"]);
    expect(existsSync(path.join(cwd, ".harness/skills/brainstorming/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(cwd, ".harness/orchestrate/SKILL.md"))).toBe(false);

    await run(["add", "orchestrate"]);
    expect(existsSync(path.join(cwd, ".harness/orchestrate/SKILL.md"))).toBe(true);
    let cfg = JSON.parse(readFileSync(path.join(cwd, ".harness/config.json"), "utf8"));
    expect(cfg.modules.orchestrate.enabled).toBe(true);

    await run(["remove", "orchestrate"]);
    expect(existsSync(path.join(cwd, ".harness/orchestrate/SKILL.md"))).toBe(false);
    cfg = JSON.parse(readFileSync(path.join(cwd, ".harness/config.json"), "utf8"));
    expect(cfg.modules.orchestrate.enabled).toBe(false);

    const md = readFileSync(path.join(cwd, "AGENTS.md"), "utf8");
    expect(md).not.toContain("orchestrate/SKILL.md");
    expect(md).toContain("brainstorming/SKILL.md");
  });
});
