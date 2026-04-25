import { describe, it, expect } from "vitest";
import { mergeAgentsMd } from "../../src/lib/merge-agents-md.js";

const BLOCK = `## harless block`;

describe("mergeAgentsMd", () => {
  it("creates file when AGENTS.md missing", () => {
    const out = mergeAgentsMd(null, BLOCK);
    expect(out).toContain("<!-- BEGIN harless v0.1 -->");
    expect(out).toContain(BLOCK);
    expect(out).toContain("<!-- END harless v0.1 -->");
  });
  it("appends block when no markers exist", () => {
    const out = mergeAgentsMd("# existing\n\nuser content\n", BLOCK);
    expect(out).toMatch(/user content[\s\S]+<!-- BEGIN harless v0.1 -->/);
    expect(out).not.toMatch(
      /<!-- BEGIN harless v0.1 -->[\s\S]+<!-- BEGIN harless v0.1 -->/,
    );
  });
  it("replaces only the marked block, preserves user content outside", () => {
    const before =
      "# title\n\nuser stuff\n\n" +
      "<!-- BEGIN harless v0.1 -->\nold harless\n<!-- END harless v0.1 -->\n\n" +
      "trailing user content\n";
    const out = mergeAgentsMd(before, "new harless");
    expect(out).toContain("user stuff");
    expect(out).toContain("trailing user content");
    expect(out).toContain("new harless");
    expect(out).not.toContain("old harless");
  });
  it("is idempotent when block content unchanged", () => {
    const once = mergeAgentsMd(null, BLOCK);
    const twice = mergeAgentsMd(once, BLOCK);
    expect(twice).toBe(once);
  });
});
