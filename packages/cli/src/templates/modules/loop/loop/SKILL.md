---
name: loop
description: Use when you need an iterative self-correcting loop that keeps running an agent against a goal until a done condition is met.
when-to-use:
  - Long-running refactors with a clear done criterion
  - Fixing flaky tests by repeated targeted runs
  - Migration tasks with a verifiable end state
when-not-to-use:
  - Creative or design work (use brainstorming skill)
  - Single-shot tasks with no iteration needed
requires-scripts:
  - .agents/scripts/loop.sh
---

# Self-Correcting Loop (Ralph)

## Procedure

1. **Create a work directory.**
   ```bash
   cp -r .agents/loop/.template .agents/loop/<task-name>
   ```
2. **Write `goal.md`.** Describe what the agent should accomplish in
   each iteration. Be specific: include file paths, expected behavior,
   and constraints.
3. **Write `check.sh`.** A script that exits 0 when the goal is met,
   non-zero otherwise. Typical checks: `pnpm test`, `grep`, `diff`.
4. **Run the loop.**
   ```bash
   bash .agents/scripts/loop.sh .agents/loop/<task-name>
   ```
5. **Review iteration logs.** Each iteration produces `iter-N.log`.
   If the loop hits `MAX_ITER` (default 20), read the last log and
   adjust goal.md or check.sh.

## Environment variables

- `AGENT_CMD` — agent CLI to invoke (default: `claude -p`)
- `MAX_ITER` — max iterations before giving up (default: 20)

## Anti-patterns

- Vague goal.md ("make it better") — be specific and measurable.
- check.sh that always passes or always fails.
- Running loop without reading iteration logs on failure.
