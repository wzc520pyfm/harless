# review — Independent Diff Review

Spawn a fresh agent process to review your diff without session bias.

## Files

- `.harness/review/SKILL.md`
- `.harness/scripts/review.sh`

## Usage

```bash
bash .harness/scripts/review.sh HEAD
```

Output: `.harness/review/<timestamp>.md`

The review checklist covers correctness, tests, naming, complexity,
security, performance, and leftovers.
