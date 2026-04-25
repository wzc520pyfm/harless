import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => { cwd = mkdtempSync(path.join(tmpdir(), "h09-")); process.chdir(cwd); });
afterEach(() => { process.chdir(orig); rmSync(cwd, { recursive: true, force: true }); });

describe("scenario 09: --offline flag", () => {
  it("init completes with --offline --yes", async () => {
    await run(["init", "--yes", "--offline", "--modules=skills"]);
    expect(existsSync(path.join(cwd, ".harness/config.json"))).toBe(true);
    expect(existsSync(path.join(cwd, "AGENTS.md"))).toBe(true);
  });

  it("doctor completes with --offline", async () => {
    await run(["init", "--yes", "--offline"]);
    process.exitCode = undefined;
    await run(["doctor", "--offline"]);
    expect(process.exitCode).toBeUndefined();
  });

  it("update completes with --offline", async () => {
    await run(["init", "--yes", "--offline", "--modules=skills"]);
    await run(["update", "--offline"]);
  });
});
