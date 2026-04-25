# Changelog

All notable changes to this project will be documented in this file. The
format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-04-26

### Added

- CLI with 5 commands: `init`, `add`, `remove`, `update`, `doctor`
- 8 capability modules: skills, spec, loop, memory, browser-debug, orchestrate, review, simplify
- 12 SKILL.md files (5 disciplines + 7 capability modules)
- 5 shell scripts (loop.sh, compact.sh, review.sh, dispatch.sh, simplify.sh)
- AGENTS.md managed block with marker-delimited merge
- .mcp.json merge for chrome-devtools-mcp (browser-debug module)
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