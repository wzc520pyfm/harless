# Getting Started

## Install

```bash
npx harless init
```

This creates `.harness/` in your project root, merges a managed block into
`AGENTS.md`, and optionally writes `.mcp.json` for browser-debug.

## Non-interactive

```bash
npx harless init --yes
```

Installs the 6 default modules (skills, spec, loop, memory, browser-debug,
review) with Claude Code as the default agent.

## Select modules

```bash
npx harless init --yes --modules=skills,spec,loop
```

## Add / remove modules

```bash
npx harless add orchestrate
npx harless remove simplify
```

## Update templates

```bash
npx harless update
```

Compares each file's hash against the recorded install hash. Pristine files
get overwritten; user-modified files are left alone (or flagged as conflicts
with `--yes`).

## Health check

```bash
npx harless doctor
```

Verifies config, AGENTS.md markers, script permissions, MCP entries, and
file integrity. Exit code 0 means all clear; non-zero is a bitmask of
failing checks.

## How it works

1. **AGENTS.md** at the project root tells any compliant agent which skill
   files to read and when.
2. **SKILL.md** files under `.harness/` define procedures (brainstorming,
   TDD, debugging, etc.) the agent follows.
3. **Shell scripts** under `.harness/scripts/` provide executable helpers
   (ralph loop, memory compact, dispatch, review, simplify).
4. **config.json** tracks installed modules, hashes, and detected stack.

No daemons, no hooks, no global config writes. Delete `.harness/` and the
AGENTS.md block to fully uninstall.
