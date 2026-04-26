# loop — Self-Correcting Loop (Ralph)

Iterative agent loop: run → check → repeat until done.

## Files

- `.agents/loop/SKILL.md`
- `.agents/loop/.template/goal.md`
- `.agents/loop/.template/check.sh`
- `.agents/scripts/loop.sh`

## Usage

```bash
cp -r .agents/loop/.template .agents/loop/my-task
# Edit goal.md and check.sh
bash .agents/scripts/loop.sh .agents/loop/my-task
```

Environment: `AGENT_CMD` (default `claude -p`), `MAX_ITER` (default 20).
