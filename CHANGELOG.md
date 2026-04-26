# Changelog

All notable changes to this project will be documented in this file. The
format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] — 2026-04-26

### Added

- Root `pnpm release` script (`scripts/release.sh`): frozen install, build, test, annotated tag, push branch + tag

### Changed

- **Release CI:** tag workflow always runs verify + creates a **GitHub Release**; npm publish in Actions runs only when `NPM_TOKEN` is configured (local `pnpm -F harless publish` otherwise)

### Fixed

- `scripts/release.sh`: if semver tag exists locally on an old commit but the tag is **not** on `origin`, drop and recreate the tag at `HEAD` instead of failing; clearer error when `origin` already has the tag at a different commit; print `git status --short` when the tree is dirty

## [0.1.1] — 2026-04-26

### Fixed

- npm tarball: ship `README.md` (it was listed in `files` but missing from the package)
- New installs: `.agents/config.json` `version` now matches the published CLI semver (read from `package.json`)

### Changed

- `package.json`: add `repository` (git URL + `directory: packages/cli`) for npm registry metadata

## [0.1.0] — 2026-04-26

### Added

- CLI with 5 commands: `init`, `add`, `remove`, `update`, `doctor`
- 8 capability modules: skills, spec, loop, memory, browser-debug, orchestrate, review, simplify
- 12 SKILL.md files (5 disciplines + 7 capability modules)
- 5 shell scripts (loop.sh, compact.sh, review.sh, dispatch.sh, simplify.sh)
- AGENTS.md managed block with marker-delimited merge
- MCP merge for `chrome-devtools-mcp` (browser-debug): writes **both** `.mcp.json` (Claude Code) and `.cursor/mcp.json` (Cursor) with the same merged `mcpServers` (first-seen server definitions win across files)

### Changed

- **BREAKING:** Injected files live under **`.agents/`** (not `.harness/`), with skills under **`.agents/skills/`** for Agent Skills–compatible discovery across Claude Code, Cursor, Codex CLI, and Gemini CLI. `config.json` paths and `AGENTS.md` links use `.agents/...`. Existing installs: re-run `harless init` or move `.harness/` → `.agents/` and update paths in `config.json` + `AGENTS.md`.
- Hash-based file tracking for safe update/remove
- Stack detection (Next.js, Vite, Remix, Astro, Svelte, React)
- Package manager detection (pnpm, yarn, npm, bun)
- Monorepo awareness (pnpm workspaces, lerna, package.json workspaces)
- Coexistence detection for CLAUDE.md, .cursorrules, etc.
- Self-repair mode (re-init detects and restores missing files)
- Doctor health check with 6 named checks and bitmask exit codes
- `--yes` non-interactive mode, `--offline` flag, `--here` monorepo override
- 79 automated tests (unit + integration + 9 scenario tests)
- VitePress documentation site
- GitHub Actions CI (macOS + Linux × Node 18/20/22)
- Pre-implementation verification harness (scripts/verify.sh)

## [Unreleased]