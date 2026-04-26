# simplify — Code Simplification Scan

Independent agent scan for unnecessary complexity.

## Files

- `.agents/simplify/SKILL.md`
- `.agents/scripts/simplify.sh`

## Usage

```bash
bash .agents/scripts/simplify.sh src/
```

Output: `.agents/simplify/<timestamp>.md`

Targets: dead code, over-abstraction, redundant wrappers, excessive
indirection, copy-paste duplication, premature optimization.

Default-off at init. Add with `npx harless add simplify`.
