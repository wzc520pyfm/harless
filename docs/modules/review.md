# review — Independent Diff Review

Spawn a fresh agent process to review your diff without session bias.

## Files

- `.agents/review/SKILL.md`
- `.agents/scripts/review.sh`

## Usage

```bash
bash .agents/scripts/review.sh HEAD
```

Output: `.agents/review/<timestamp>.md`

The review checklist covers correctness, tests, naming, complexity,
security, performance, and leftovers.
