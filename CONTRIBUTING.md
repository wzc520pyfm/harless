# Contributing to harless

Thanks for your interest! `harless` is a **minimal** AI Coding Harness; every
contribution should defend that property. Before opening a PR, please read
the design spec at `docs/superpowers/specs/2026-04-20-harless-design.md` —
especially the LOC budgets (§5.2) and the Definition of Done (§10).

## Prerequisites

- Node.js ≥ 18
- pnpm ≥ 9 (`corepack enable` recommended)

## Workflow

```bash
pnpm install
pnpm -r build
pnpm -r test
```

## Principles

1. **Minimal primitives.** Markdown + shell scripts only — no new DSLs.
2. **Zero runtime.** The injected harness must have no daemon, hook, or
  background process.
3. **Agent-agnostic by default.** Any CLI example that references a specific
  agent (`claude -p`, `cursor-agent -p`, etc.) must be labelled as such and
   overridable via `$AGENT_CMD`.
4. **Test-driven.** Every pure function under `packages/cli/src/lib/` ships
  with a vitest unit test.
5. **Small PRs.** Keep PRs under ~300 LOC where possible; call out any LOC
  budget impact explicitly.

## Reporting issues

- Open an issue describing the expected vs. actual behaviour and the agent
CLI you were using.
- For cross-agent regressions, include output from `npx harless doctor`
(once implemented).

## Code of conduct

This project follows the [Contributor Covenant 2.1](./CODE_OF_CONDUCT.md).