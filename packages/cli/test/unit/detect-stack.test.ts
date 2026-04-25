import { describe, it, expect } from "vitest";
import { detectStack } from "../../src/lib/detect-stack.js";
import path from "node:path";

const fx = (n: string) => path.resolve(import.meta.dirname, "../fixtures/stacks", n);

describe("detectStack", () => {
  it("detects next + pnpm", () => {
    const r = detectStack(fx("next"));
    expect(r.framework).toBe("next");
    expect(r.packageManager).toBe("pnpm");
    expect(r.kind).toBe("web");
  });
  it("detects vite + npm", () => {
    const r = detectStack(fx("vite"));
    expect(r.framework).toBe("vite");
    expect(r.packageManager).toBe("npm");
  });
  it("detects remix", () => {
    expect(detectStack(fx("remix")).framework).toBe("remix");
  });
  it("plain → generic", () => {
    expect(detectStack(fx("plain")).kind).toBe("generic");
  });
  it("detects pnpm workspace as monorepo", () => {
    expect(detectStack(fx("monorepo-pnpm")).workspace).toBe(true);
  });
});
