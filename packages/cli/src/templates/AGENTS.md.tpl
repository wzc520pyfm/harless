## AI Harness (harless)

This project uses harless, a minimal agent-agnostic AI Harness.
Any AGENTS.md-compliant agent should read the relevant skill file on
demand before acting.

### Disciplines (always-on principles, read whenever in doubt)

| When you... | Read this file |
|---|---|
| Have an idea, before designing | `.harness/skills/brainstorming/SKILL.md` |
| Are about to write code | `.harness/skills/tdd/SKILL.md` |
| Hit a bug or unexpected behavior | `.harness/skills/systematic-debugging/SKILL.md` |
| Are about to claim work is "done" | `.harness/skills/verification-before-completion/SKILL.md` |
| Receive code review feedback | `.harness/skills/receiving-review/SKILL.md` |

### Capability Modules (read on demand)

| When you need to... | Read this file |
|---|---|
| Produce spec → plan → tasks | `.harness/spec/SKILL.md` |
| Run an iterative self-correcting loop | `.harness/loop/SKILL.md` |
| Persist or recall cross-session context | `.harness/memory/SKILL.md` |
| Debug a running web page | `.harness/browser-debug/SKILL.md` |
| Parallelize independent subtasks | `.harness/orchestrate/SKILL.md` |
| Review a diff before committing | `.harness/review/SKILL.md` |
| Simplify / reduce code | `.harness/simplify/SKILL.md` |

### Executable Scripts (call via your terminal tool)

- `.harness/scripts/loop.sh <work-dir>`         ralph loop
- `.harness/scripts/compact.sh < summary.md`    append session summary to memory
- `.harness/scripts/review.sh [<ref>]`          spawn an independent agent to review diff
- `.harness/scripts/dispatch.sh <tasks.json>`   run N agents in parallel
- `.harness/scripts/simplify.sh [<path>]`       independent simplification scan

### House Rules

1. Before non-trivial work, check the Skills Index and read the matching SKILL.md.
2. Specs live in `.harness/specs/<YYYY-MM-DD-topic>/`; copy from `.template/`.
3. Memory: `sessions/` is append-only; `topics/` is curated.
4. Do not commit `.harness/memory/sessions/` if it may contain secrets.
