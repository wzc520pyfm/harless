---
name: memory
description: Use to persist or recall cross-session context. Read topic files at session start; compact session summaries at session end.
when-to-use:
  - Starting a new session (read existing topics)
  - Ending a session (compact summary)
  - Knowledge should survive across conversations
when-not-to-use:
  - Ephemeral debugging sessions
  - Information already in the codebase (comments, README)
requires-scripts:
  - .agents/scripts/compact.sh
---

# Cross-Session Memory

## Reading (session start)

1. List topic files: `ls .agents/memory/topics/`
2. Read any topics matching the current task keywords.
3. If no topics exist, check `ls .agents/memory/sessions/` for
   recent session logs.

## Writing topics

Write topic files directly using your file-write tool:
- Path: `.agents/memory/topics/<topic>.md` (e.g., `auth.md`, `deploy.md`)
- Filename = retrieval key. Choose descriptive, grep-friendly names.
- Keep each topic file focused: one concept per file.

## Compacting (session end)

1. Author a markdown summary of the session's key decisions, problems
   solved, and open questions.
2. **Redaction checklist** — before writing, remove:
   - API keys, tokens, passwords
   - Personal data (emails, names, IPs)
   - Internal URLs not meant to be persisted
3. Pipe the summary to the compact script:
   ```bash
   echo "<your summary>" | bash .agents/scripts/compact.sh
   ```

## Log rotation

If any `sessions/<date>.md` exceeds 500 lines, summarize its key
points into the appropriate topic files, then truncate the session
file to a one-line stub: `Summarized into topics on <date>.`

## Anti-patterns

- Storing raw conversation transcripts (too noisy, may contain secrets).
- Never reading topics (memory exists but is never used).
- Giant monolithic topic files (split by concept).
