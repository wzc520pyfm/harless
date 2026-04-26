import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, unlinkSync, chmodSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => { cwd = mkdtempSync(path.join(tmpdir(), "h07-")); process.chdir(cwd); process.exitCode = undefined; });
afterEach(() => { process.chdir(orig); process.exitCode = undefined; rmSync(cwd, { recursive: true, force: true }); });

describe("scenario 07: doctor checks", () => {
  it("all pass on fresh install", async () => {
    await run(["init", "--yes"]);
    process.exitCode = undefined;
    await run(["doctor"]);
    expect(process.exitCode).toBeUndefined();
  });

  it("fails when config missing", async () => {
    await run(["doctor"]);
    expect(process.exitCode).toBeGreaterThanOrEqual(10);
  });

  it("fails when AGENTS.md marker missing", async () => {
    await run(["init", "--yes"]);
    writeFileSync(path.join(cwd, "AGENTS.md"), "# no markers\n");
    process.exitCode = undefined;
    await run(["doctor"]);
    expect(process.exitCode).toBeGreaterThanOrEqual(10);
  });

  it("fails when a module file is missing", async () => {
    await run(["init", "--yes", "--modules=skills"]);
    unlinkSync(path.join(cwd, ".agents/skills/brainstorming/SKILL.md"));
    process.exitCode = undefined;
    await run(["doctor"]);
    expect(process.exitCode).toBeGreaterThanOrEqual(10);
  });

  it("fails when script not executable", async () => {
    await run(["init", "--yes"]);
    const scripts = path.join(cwd, ".agents/scripts");
    if (existsSync(scripts)) {
      const { readdirSync } = require("node:fs");
      for (const f of readdirSync(scripts).filter((f: string) => f.endsWith(".sh"))) {
        chmodSync(path.join(scripts, f), 0o644);
      }
    }
    process.exitCode = undefined;
    await run(["doctor"]);
    expect(process.exitCode).toBeGreaterThanOrEqual(10);
  });
});
