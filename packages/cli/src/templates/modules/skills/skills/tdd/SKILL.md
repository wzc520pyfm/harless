---
name: tdd
description: Use before writing implementation code. Write a failing test first, then implement just enough to make it pass, then refactor.
when-to-use:
  - Implementing any new function, method, or component
  - Fixing a bug (reproduce with a test first)
  - Adding behavior to existing code
when-not-to-use:
  - Exploratory prototyping the user wants thrown away
  - Pure configuration or markup changes with no logic
  - The user explicitly opts out of TDD
---

# Test-Driven Development

## When to use

Before writing any implementation code. The cycle is Red → Green → Refactor.

## Procedure

1. **Red.** Write a small, focused failing test that describes the
   desired behavior. Run the test suite; confirm it fails for the
   expected reason (not a syntax error).
2. **Green.** Write the minimum code to make the test pass. Do not
   add extra features or handle edge cases not yet tested.
3. **Refactor.** Clean up duplication or unclear naming while all
   tests stay green. Run the full suite after refactoring.
4. **Repeat.** Pick the next behavior and start a new Red cycle.

## Rules

- One behavior per test. If a test name has "and", split it.
- Test names describe behavior, not implementation:
  Good: "returns null when user not found"
  Bad:  "tests the getUserById function"
- Keep tests independent — no shared mutable state between tests.
- Commit after each Green+Refactor cycle when practical.

## Anti-patterns

- Writing implementation before the test (defeats the purpose).
- Writing a passing test first ("test-after" is not TDD).
- Giant test that covers 5 behaviors at once.
- Skipping the Red step — you must see the test fail first.
