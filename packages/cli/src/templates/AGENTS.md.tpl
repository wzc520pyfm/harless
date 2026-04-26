## AI Harness (harless)

This project uses harless, a minimal agent-agnostic AI Harness.
Any AGENTS.md-compliant agent should read the relevant skill file on
demand before acting.

### Disciplines (always-on principles, read whenever in doubt)

| When you... | Read this file |
|---|---|
| Have an idea, before designing | `.agents/skills/brainstorming/SKILL.md` |
| Are about to write code | `.agents/skills/tdd/SKILL.md` |
| Hit a bug or unexpected behavior | `.agents/skills/systematic-debugging/SKILL.md` |
| Are about to claim work is "done" | `.agents/skills/verification-before-completion/SKILL.md` |
| Receive code review feedback | `.agents/skills/receiving-review/SKILL.md` |

### Capability Modules (read on demand)

| When you need to... | Read this file |
|---|---|
| Produce spec → plan → tasks | `.agents/spec/SKILL.md` |
| Run an iterative self-correcting loop | `.agents/loop/SKILL.md` |
| Persist or recall cross-session context | `.agents/memory/SKILL.md` |
| Debug a running web page | `.agents/browser-debug/SKILL.md` |
| Parallelize independent subtasks | `.agents/orchestrate/SKILL.md` |
| Review a diff before committing | `.agents/review/SKILL.md` |
| Simplify / reduce code | `.agents/simplify/SKILL.md` |

### Executable Scripts (call via your terminal tool)

- `.agents/scripts/loop.sh <work-dir>`         ralph loop
- `.agents/scripts/compact.sh < summary.md`    append session summary to memory
- `.agents/scripts/review.sh [<ref>]`          spawn an independent agent to review diff
- `.agents/scripts/dispatch.sh <tasks.json>`   run N agents in parallel
- `.agents/scripts/simplify.sh [<path>]`       independent simplification scan

### House Rules

1. Before non-trivial work, check the Skills Index and read the matching SKILL.md.
2. Specs live in `.agents/specs/<YYYY-MM-DD-topic>/`; copy from `.template/`.
3. Memory: `sessions/` is append-only; `topics/` is curated.
4. Do not commit `.agents/memory/sessions/` if it may contain secrets.
