---
name: review
description: Use before committing to get an independent diff review from a fresh agent process with no main-session context bias.
when-to-use:
  - Before committing a significant change
  - After completing a feature or bug fix
  - When you want a second opinion on your diff
when-not-to-use:
  - Trivial one-line changes
  - Changes already reviewed by a human
requires-scripts:
  - .harness/scripts/review.sh
---

# Independent Diff Review

## Procedure

1. **Stage your changes.** Make sure `git diff` shows what you want reviewed.
2. **Run the review script.**
   ```bash
   bash .harness/scripts/review.sh HEAD
   ```
3. **Read the review.** Output is at `.harness/review/<ts>.md`.
4. **Address findings.** Use the receiving-review skill for each point.

## Review checklist (used by the review script)

The independent agent evaluates the diff against these criteria:

- [ ] **Correctness.** Does the code do what it claims? Edge cases handled?
- [ ] **Tests.** Are new behaviors tested? Do existing tests still pass?
- [ ] **Naming.** Are names clear and consistent with codebase conventions?
- [ ] **Complexity.** Can any part be simplified without losing clarity?
- [ ] **Security.** No hardcoded secrets, no unvalidated input in dangerous operations.
- [ ] **Performance.** No obvious O(n²) where O(n) is trivial; no blocking I/O in hot paths.
- [ ] **Leftovers.** No debug logs, commented-out code, or TODO without a tracking issue.

## Anti-patterns

- Reviewing your own code in the same session (confirmation bias).
- Ignoring review output because "it's just an AI."
- Running review on unstaged or uncommitted exploratory changes.
