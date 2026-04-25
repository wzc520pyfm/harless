import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => { cwd = mkdtempSync(path.join(tmpdir(), "h06-")); process.chdir(cwd); });
afterEach(() => { process.chdir(orig); rmSync(cwd, { recursive: true, force: true }); });

describe("scenario 06: reinit idempotency", () => {
  it("running init twice produces identical output", async () => {
    await run(["init", "--yes", "--modules=skills,loop"]);
    const cfg1 = readFileSync(path.join(cwd, ".harness/config.json"), "utf8");
    const md1 = readFileSync(path.join(cwd, "AGENTS.md"), "utf8");

    await run(["init", "--yes"]);
    const cfg2 = readFileSync(path.join(cwd, ".harness/config.json"), "utf8");
    const md2 = readFileSync(path.join(cwd, "AGENTS.md"), "utf8");

    const c1 = JSON.parse(cfg1);
    const c2 = JSON.parse(cfg2);
    expect(Object.keys(c2.modules).sort()).toEqual(Object.keys(c1.modules).sort());
    for (const m of Object.keys(c1.modules)) {
      expect(c2.modules[m].enabled).toBe(c1.modules[m].enabled);
    }
    expect(md2).toBe(md1);
  });
});
