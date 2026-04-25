import { describe, it, expect } from "vitest";
import { run } from "../src/cli.js";

describe("cli skeleton", () => {
  it("--version prints something", async () => {
    const log: string[] = [];
    const orig = console.log;
    console.log = (s: string) => log.push(String(s));
    try {
      await run(["--version"]);
    } finally {
      console.log = orig;
    }
    expect(log[0]).toMatch(/^\d+\.\d+\.\d+/);
  });
});
