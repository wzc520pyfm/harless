---
name: spec
description: Use when starting any non-trivial change. Guides the spec → plan → tasks workflow to ensure clarity before implementation.
when-to-use:
  - New feature or significant enhancement
  - Task with multiple stakeholders or unclear requirements
  - Refactor affecting more than 3 files
when-not-to-use:
  - Single-line bug fixes
  - Typo or documentation-only changes
---

# Spec-Driven Development

## Procedure

1. **Create a change folder.**
   ```bash
   cp -r .harness/specs/.template .harness/specs/$(date +%Y-%m-%d)-<topic>
   ```
2. **Fill `spec.md`** — the "what." Define the problem, constraints,
   acceptance criteria, and non-goals. Keep it under 1 page.
3. **Fill `plan.md`** — the "how." Architecture, affected files,
   trade-offs, estimated LOC. Reference the spec by section.
4. **Fill `tasks.md`** — atomic, checkboxable items. Each task should
   be completable in one commit. Use `- [ ]` syntax.
5. **Review.** Before implementing, re-read the spec with fresh eyes.
   If anything is unclear, refine it.
6. **Implement.** Work through `tasks.md` top to bottom, checking off
   each item. Commit per task when practical.

## Anti-patterns

- Writing spec after the code is done (spec becomes documentation, not design).
- Spec longer than the implementation (over-engineering the document).
- Skipping plan.md and jumping from spec to code.
