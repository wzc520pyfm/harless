const BEGIN = "<!-- BEGIN harless v0.1 -->";
const END = "<!-- END harless v0.1 -->";

export { BEGIN, END };

export function mergeAgentsMd(existing: string | null, blockBody: string): string {
  const block = `${BEGIN}\n${blockBody.trim()}\n${END}`;
  if (existing == null) return block + "\n";
  if (existing.includes(BEGIN) && existing.includes(END)) {
    const re = new RegExp(`${escapeRe(BEGIN)}[\\s\\S]*?${escapeRe(END)}`);
    return existing.replace(re, block);
  }
  const sep = existing.endsWith("\n") ? "\n" : "\n\n";
  return existing + sep + block + "\n";
}

const SKILLS_BUNDLE_PATHS = [
  "skills/brainstorming",
  "skills/tdd",
  "skills/systematic-debugging",
  "skills/verification-before-completion",
  "skills/receiving-review",
];

export function removeRowsFromAgentsBlock(existing: string, moduleName: string): string {
  if (!existing.includes(BEGIN) || !existing.includes(END)) return existing;
  const targets = moduleName === "skills" ? SKILLS_BUNDLE_PATHS : [`${moduleName}/`];
  const beginIdx = existing.indexOf(BEGIN);
  const endIdx = existing.indexOf(END);
  let block = existing.slice(beginIdx, endIdx);
  for (const t of targets) {
    const re = new RegExp(`^.*\`\\.harness/${escapeRe(t)}[^\`]*\`.*\\n`, "gm");
    block = block.replace(re, "");
  }
  return existing.slice(0, beginIdx) + block + existing.slice(endIdx);
}

export function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
