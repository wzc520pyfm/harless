import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { run } from "../../src/cli.js";

let cwd: string;
const orig = process.cwd();

beforeEach(() => {
  cwd = mkdtempSync(path.join(tmpdir(), "harless-doc-"));
  process.chdir(cwd);
  process.exitCode = undefined;
});
afterEach(() => {
  process.chdir(orig);
  process.exitCode = undefined;
  rmSync(cwd, { recursive: true, force: true });
});

describe("harless doctor", () => {
  it("passes on a fresh valid install", async () => {
    await run(["init", "--yes", "--modules=skills", "--agents=claude-code"]);
    process.exitCode = undefined;
    await run(["doctor"]);
    expect(process.exitCode).toBeUndefined();
  });

  it("fails when no config exists", async () => {
    await run(["doctor"]);
    expect(process.exitCode).toBeGreaterThanOrEqual(10);
  });
});
