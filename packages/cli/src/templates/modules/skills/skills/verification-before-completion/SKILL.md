---
name: verification-before-completion
description: Use before claiming work is complete, fixed, or passing. Requires running verification commands and confirming output before making any success claims.
when-to-use:
  - About to say "done", "fixed", "all tests pass"
  - Before committing or creating a PR
  - After any implementation or bug fix
when-not-to-use:
  - Mid-implementation (verify at the end, not every line)
  - Answering questions that require no code changes
---

# Verification Before Completion

## When to use

Before making any claim that work is complete. The rule is simple:
**evidence before assertions**.

## Procedure

1. **Run the tests.** Execute the relevant test suite and read the
   output. Do not assume "it should pass" — confirm it actually does.
2. **Run the build.** If the project has a build step, run it. Check
   for compiler warnings, not just errors.
3. **Check for regressions.** Run the full test suite, not just the
   tests you added. If full suite is slow, run at minimum the affected
   test files.
4. **Verify the claim.** If you're about to say "the bug is fixed",
   show the output that proves it. If "tests pass", show the test
   runner output.
5. **Review the diff.** Glance at `git diff` before committing. Look
   for: debug logs left in, commented-out code, unrelated changes.

## Anti-patterns

- Saying "tests pass" without running them.
- Running only the new test, not the existing suite.
- Committing before verifying the build succeeds.
- Claiming "done" based on what the code should do, not what it does.
