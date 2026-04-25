import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../../src/cli.js";
import { sha256 } from "../../../src/lib/hash.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => { cwd = mkdtempSync(path.join(tmpdir(), "h05-")); process.chdir(cwd); process.exitCode = undefined; });
afterEach(() => { process.chdir(orig); process.exitCode = undefined; rmSync(cwd, { recursive: true, force: true }); });

describe("scenario 05: update conflict with --yes exits 2", () => {
  it("exits with code 2 when user-modified + template changed with --yes", async () => {
    await run(["init", "--yes", "--modules=skills"]);

    const p = path.join(cwd, ".harness/skills/brainstorming/SKILL.md");
    writeFileSync(p, "user customized content\n");

    const cfgPath = path.join(cwd, ".harness/config.json");
    const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
    const entry = cfg.modules.skills.files.find((f: any) => f.path.includes("brainstorming"));
    if (entry) entry.hash = sha256("fake-old-template-content");
    writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));

    await run(["update", "--yes"]);
    expect(process.exitCode).toBe(2);
  });
});
