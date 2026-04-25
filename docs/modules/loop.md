# loop — Self-Correcting Loop (Ralph)

Iterative agent loop: run → check → repeat until done.

## Files

- `.harness/loop/SKILL.md`
- `.harness/loop/.template/goal.md`
- `.harness/loop/.template/check.sh`
- `.harness/scripts/loop.sh`

## Usage

```bash
cp -r .harness/loop/.template .harness/loop/my-task
# Edit goal.md and check.sh
bash .harness/scripts/loop.sh .harness/loop/my-task
```

Environment: `AGENT_CMD` (default `claude -p`), `MAX_ITER` (default 20).
