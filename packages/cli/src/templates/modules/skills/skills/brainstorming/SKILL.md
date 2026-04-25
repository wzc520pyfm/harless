---
name: brainstorming
description: Use before any creative work — creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements, and design before implementation.
when-to-use:
  - User requests a new feature or component
  - Task is ambiguous or has multiple valid approaches
  - Significant architectural decisions are involved
when-not-to-use:
  - Fixing a well-defined bug with a clear root cause
  - Mechanical refactors (rename, move, reformat)
  - User explicitly says "just do it"
---

# Brainstorming

## When to use

Before writing any code for creative or design work. If the task has
multiple valid approaches or unclear requirements, brainstorm first.

## Procedure

1. **Clarify intent.** Restate what the user wants in your own words.
   Ask up to 3 focused questions if requirements are ambiguous.
2. **Explore constraints.** Identify: existing patterns in the codebase,
   performance requirements, compatibility needs, LOC budget.
3. **Propose options.** Present 2–3 concrete approaches with trade-offs.
   Use a short comparison table if helpful.
4. **Get approval.** Wait for the user to pick an approach (or refine).
5. **Define acceptance.** Before coding, state what "done" looks like
   (e.g., "tests pass, component renders in Storybook, <50 LOC").

## Anti-patterns

- Jumping straight to code without understanding intent.
- Asking more than 3 clarifying questions (analysis paralysis).
- Proposing only one approach and calling it "the best."
- Brainstorming when the user said "just do it" or the fix is obvious.
