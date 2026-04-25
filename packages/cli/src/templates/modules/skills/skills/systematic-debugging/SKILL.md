---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior. Requires gathering evidence before proposing fixes — no random guesses.
when-to-use:
  - A test fails unexpectedly
  - Runtime error or crash
  - Behavior differs from specification
when-not-to-use:
  - Implementing new features (use tdd skill)
  - Known trivial typo fixes
---

# Systematic Debugging

## When to use

When something is broken and you don't yet know why. The key principle
is **evidence before hypothesis**.

## Procedure

1. **Reproduce.** Get the exact error output. Copy the full stack trace
   or test failure message. If you can't reproduce, say so and gather
   more context before guessing.
2. **Narrow scope.** Identify the smallest input or test case that
   triggers the bug. Binary search through recent changes if needed.
3. **Form hypothesis.** Based on the evidence (not intuition), state
   one specific theory: "The bug is in X because evidence Y shows Z."
4. **Verify.** Add a diagnostic (log, assertion, minimal test) that
   confirms or refutes the hypothesis. Do not change production code yet.
5. **Fix.** Write a failing test that captures the bug, then apply the
   minimal fix. Run the full suite. Confirm no regressions.
6. **Document.** In the commit message, state root cause and fix.

## Anti-patterns

- Changing code before understanding the bug ("let me try this").
- Applying multiple fixes at once (can't tell which one worked).
- Ignoring the stack trace and grepping randomly.
- Assuming the bug is in the most recently changed file without evidence.
