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

export function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
