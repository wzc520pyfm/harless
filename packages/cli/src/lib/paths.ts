import path from "node:path";

/**
 * Project-local root for harless-managed files.
 * Uses `.agents/` so skills live under `.agents/skills/` (Agent Skills standard, cross-tool).
 */
export const HARLESS_ROOT = ".agents";

/** Absolute path to the harless root directory inside a project. */
export function harlessRootAbs(cwd: string): string {
  return path.join(cwd, HARLESS_ROOT);
}

/** Absolute path to harless `config.json`. */
export function harlessConfigPath(cwd: string): string {
  return path.join(cwd, HARLESS_ROOT, "config.json");
}

/**
 * Absolute path to a file under the harless root.
 * @param rel — path relative to `.agents/` using `/` (matches manifest entries)
 */
export function harlessFileAbs(cwd: string, rel: string): string {
  return path.join(cwd, HARLESS_ROOT, rel);
}

/**
 * POSIX path as stored in `config.json` `files[].path` (e.g. `.agents/skills/foo/SKILL.md`).
 */
export function harlessStoredPath(rel: string): string {
  const norm = rel.replace(/\\/g, "/");
  return path.posix.join(HARLESS_ROOT, norm);
}

/** `.agents/.trash` for remove --yes */
export function harlessTrashRootAbs(cwd: string): string {
  return path.join(cwd, HARLESS_ROOT, ".trash");
}

/** MCP config files we keep in sync (Claude Code + Cursor). */
export function mcpConfigPaths(cwd: string): string[] {
  return [path.join(cwd, ".mcp.json"), path.join(cwd, ".cursor", "mcp.json")];
}

/** Match a `config.json` `files[].path` to a manifest-relative path (supports pre-v0.1 `.harness/` prefix). */
export function isStoredPathForRel(storedPath: string, rel: string): boolean {
  return storedPath === harlessStoredPath(rel) || storedPath === `.harness/${rel.replace(/\\/g, "/")}`;
}
