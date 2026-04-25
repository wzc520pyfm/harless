import { describe, it, expect } from "vitest";
import { parseConfig, stringifyConfig, type HarlessConfig } from "../../src/lib/config.js";

describe("config", () => {
  it("round-trips a minimal config", () => {
    const c: HarlessConfig = {
      version: "0.1.0",
      installedAt: "2026-04-20T00:00:00Z",
      stack: { detected: "next", packageManager: "pnpm" },
      agents: ["claude-code"],
      defaultAgentCmd: "claude -p",
      modules: { skills: { enabled: true, files: [{ path: "x", hash: "y" }] } },
    };
    expect(parseConfig(stringifyConfig(c))).toEqual(c);
  });
  it("rejects malformed JSON", () => {
    expect(() => parseConfig("{invalid")).toThrow();
  });
  it("rejects missing version", () => {
    expect(() => parseConfig(JSON.stringify({}))).toThrow(/version/);
  });
  it("rejects modules with non-boolean enabled", () => {
    const bad = {
      version: "0.1.0",
      installedAt: "x",
      stack: { detected: "x", packageManager: "x" },
      agents: [],
      defaultAgentCmd: "x",
      modules: { foo: { enabled: "yes" } },
    };
    expect(() => parseConfig(JSON.stringify(bad))).toThrow(/modules\.foo\.enabled/);
  });
  it("rejects modules with non-array files", () => {
    const bad = {
      version: "0.1.0",
      installedAt: "x",
      stack: { detected: "x", packageManager: "x" },
      agents: [],
      defaultAgentCmd: "x",
      modules: { foo: { enabled: true, files: "nope" } },
    };
    expect(() => parseConfig(JSON.stringify(bad))).toThrow(/modules\.foo\.files/);
  });
});
