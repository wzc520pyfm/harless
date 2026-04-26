---
name: orchestrate
description: Use when you need to parallelize independent subtasks across multiple agent processes.
when-to-use:
  - 2+ independent tasks with no shared state
  - Migration across many files with identical per-file logic
  - Tasks that benefit from parallel execution
when-not-to-use:
  - Tasks with sequential dependencies (do them in order)
  - Single task that's fast enough in one agent
requires-scripts:
  - .agents/scripts/dispatch.sh
---

# Parallel Subagent Dispatch

## Procedure

1. **Write `tasks.json`.** A JSON array of task objects:
   ```json
   [
     { "id": "task-1", "prompt": "Refactor auth module", "cwd": ".", "timeoutSec": 300 },
     { "id": "task-2", "prompt": "Update API tests", "cwd": ".", "timeoutSec": 300 }
   ]
   ```
   - `id`: unique identifier (used in log filenames)
   - `prompt`: the full prompt sent to the agent
   - `cwd`: working directory (optional, default `.`)
   - `timeoutSec`: per-task timeout (optional, default: no timeout)

2. **Run dispatch.**
   ```bash
   bash .agents/scripts/dispatch.sh tasks.json
   ```

3. **Review logs.** Each task produces `.agents/orchestrate/<id>-<ts>.log`.
   Read logs for any task that exited non-zero.

4. **Aggregate.** After all tasks complete, review changes across
   all branches/files and resolve any conflicts.

## Anti-patterns

- Dispatching tasks that modify the same files (merge conflicts).
- Not setting timeouts (runaway agents).
- Ignoring per-task logs after dispatch completes.
