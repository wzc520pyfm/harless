import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { latestVersion } from "../../src/lib/version-check.js";

const tmpDir = path.join(os.tmpdir(), "harless-vc-test-" + process.pid);
const cachePath = path.join(tmpDir, "version-check.json");

beforeEach(() => { fs.mkdirSync(tmpDir, { recursive: true }); });
afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

function mockFetch(body: object, status = 200): typeof fetch {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }) as any;
}

describe("latestVersion", () => {
  it("returns null when offline=true (no fetch made)", async () => {
    const f = vi.fn();
    const r = await latestVersion({ offline: true, fetchImpl: f as any, cachePath });
    expect(r).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });

  it("returns version on 200", async () => {
    const f = mockFetch({ version: "1.2.3" });
    const r = await latestVersion({ offline: false, fetchImpl: f, cachePath });
    expect(r).toBe("1.2.3");
  });

  it("returns cached value if age < 24h", async () => {
    const now = Date.now();
    fs.writeFileSync(cachePath, JSON.stringify({ checkedAt: now - 1000, version: "9.9.9" }));
    const f = vi.fn();
    const r = await latestVersion({ offline: false, now, fetchImpl: f as any, cachePath });
    expect(r).toBe("9.9.9");
    expect(f).not.toHaveBeenCalled();
  });

  it("refetches if cache expired", async () => {
    const now = Date.now();
    const expired = now - 25 * 60 * 60 * 1000;
    fs.writeFileSync(cachePath, JSON.stringify({ checkedAt: expired, version: "0.0.1" }));
    const f = mockFetch({ version: "2.0.0" });
    const r = await latestVersion({ offline: false, now, fetchImpl: f, cachePath });
    expect(r).toBe("2.0.0");
  });

  it("returns null on 404/503", async () => {
    const f = mockFetch({}, 404);
    const r = await latestVersion({ offline: false, fetchImpl: f, cachePath });
    expect(r).toBeNull();
  });

  it("returns null on fetch error (timeout-like)", async () => {
    const f = vi.fn().mockRejectedValue(new Error("aborted")) as any;
    const r = await latestVersion({ offline: false, fetchImpl: f, cachePath });
    expect(r).toBeNull();
  });
});
