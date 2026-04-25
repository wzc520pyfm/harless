# orchestrate — Parallel Subagent Dispatch

Run multiple agent tasks in parallel.

## Files

- `.harness/orchestrate/SKILL.md`
- `.harness/scripts/dispatch.sh`

## Usage

```bash
cat > tasks.json << 'EOF'
[
  { "id": "refactor-auth", "prompt": "Refactor auth module", "timeoutSec": 300 },
  { "id": "update-tests", "prompt": "Update API tests", "timeoutSec": 300 }
]
EOF
bash .harness/scripts/dispatch.sh tasks.json
```

Logs: `.harness/orchestrate/<id>-<timestamp>.log`

Default-off at init. Add with `npx harless add orchestrate`.
