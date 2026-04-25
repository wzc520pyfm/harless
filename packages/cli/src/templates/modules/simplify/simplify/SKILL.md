---
name: simplify
description: Use to scan code for unnecessary complexity and reduce it. Targets dead code, over-abstraction, redundant wrappers, and excessive indirection.
when-to-use:
  - After a feature is complete and tests pass
  - Codebase feels harder to navigate than it should
  - LOC budget is tight and you need to trim
when-not-to-use:
  - Mid-implementation (finish first, simplify after)
  - Code you don't own or understand yet
requires-scripts:
  - .harness/scripts/simplify.sh
---

# Code Simplification Scan

## Procedure

1. **Run the simplify script** on target files or directories:
   ```bash
   bash .harness/scripts/simplify.sh src/
   ```
2. **Read the report** at `.harness/simplify/<ts>.md`.
3. **Evaluate each suggestion.** Not every simplification is correct —
   some complexity exists for good reasons.
4. **Apply selectively.** Make one change at a time, run tests after each.

## Simplification checklist

The independent agent looks for:

- [ ] **Dead code.** Unreachable branches, unused imports, unexported functions never called.
- [ ] **Over-abstraction.** Interfaces with one implementation, factories that create one type, wrappers that just delegate.
- [ ] **Redundant wrappers.** Functions that add no logic beyond calling another function.
- [ ] **Excessive indirection.** More than 3 levels of function calls to reach actual logic.
- [ ] **Copy-paste duplication.** Identical or near-identical blocks that could be a shared function.
- [ ] **Premature optimization.** Caching, memoization, or pooling without measured need.

## Anti-patterns

- Simplifying code you don't understand (you'll break it).
- Removing "dead" code that's actually called dynamically.
- Conflating "simple" with "fewer files" (splitting can clarify).
