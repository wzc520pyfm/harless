# simplify — Code Simplification Scan

Independent agent scan for unnecessary complexity.

## Files

- `.harness/simplify/SKILL.md`
- `.harness/scripts/simplify.sh`

## Usage

```bash
bash .harness/scripts/simplify.sh src/
```

Output: `.harness/simplify/<timestamp>.md`

Targets: dead code, over-abstraction, redundant wrappers, excessive
indirection, copy-paste duplication, premature optimization.

Default-off at init. Add with `npx harless add simplify`.
