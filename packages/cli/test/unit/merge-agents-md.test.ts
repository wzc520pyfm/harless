import { describe, it, expect } from "vitest";
import { mergeAgentsMd, removeRowsFromAgentsBlock } from "../../src/lib/merge-agents-md.js";
import fs from "node:fs";
import path from "node:path";

const BLOCK = `## harless block`;
const AGENTS_TPL = fs.readFileSync(
  path.resolve(import.meta.dirname, "../../src/templates/AGENTS.md.tpl"), "utf8",
);

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

describe("removeRowsFromAgentsBlock", () => {
  const full = mergeAgentsMd(null, AGENTS_TPL);

  it("removes loop row, others untouched", () => {
    const out = removeRowsFromAgentsBlock(full, "loop");
    expect(out).not.toContain("loop/SKILL.md");
    expect(out).toContain("spec/SKILL.md");
    expect(out).toContain("brainstorming/SKILL.md");
  });

  it("removes all 5 discipline rows for skills bundle", () => {
    const out = removeRowsFromAgentsBlock(full, "skills");
    expect(out).not.toContain("brainstorming/SKILL.md");
    expect(out).not.toContain("tdd/SKILL.md");
    expect(out).not.toContain("systematic-debugging/SKILL.md");
    expect(out).not.toContain("verification-before-completion/SKILL.md");
    expect(out).not.toContain("receiving-review/SKILL.md");
    expect(out).toContain("spec/SKILL.md");
  });

  it("is idempotent (remove loop twice)", () => {
    const once = removeRowsFromAgentsBlock(full, "loop");
    const twice = removeRowsFromAgentsBlock(once, "loop");
    expect(twice).toBe(once);
  });

  it("unknown module is a no-op", () => {
    const out = removeRowsFromAgentsBlock(full, "nonexistent");
    expect(out).toBe(full);
  });
});
