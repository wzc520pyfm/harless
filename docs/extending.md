# Extending harless

## Edit any file

Every file under `.harness/` is yours. Edit SKILL.md files to match your
team's conventions. Add steps to check.sh templates. Customize the review
checklist. harless tracks file hashes to handle updates safely — your edits
are preserved.

## Add custom skills

Create a new SKILL.md anywhere under `.harness/`:

```
.harness/skills/my-custom-skill/SKILL.md
```

Use the standard frontmatter:

```yaml
---
name: my-custom-skill
description: Use when ...
when-to-use:
  - ...
when-not-to-use:
  - ...
---
```

Then add a row to the AGENTS.md harless block (inside the markers) pointing
to your new skill.

## Add custom scripts

Place scripts in `.harness/scripts/` and reference them in AGENTS.md. Follow
the conventions in the existing scripts:

1. `set -euo pipefail`
2. Honor `$AGENT_CMD`
3. Output artifacts to `.harness/<module>/`

## Override agent CLI

All scripts use `$AGENT_CMD` (default: `claude -p`). Override per-invocation:

```bash
AGENT_CMD="cursor-agent -p" bash .harness/scripts/review.sh
```

Or change the default in `.harness/config.json`:

```json
{ "defaultAgentCmd": "codex exec" }
```

## Contribute upstream

If your customization would benefit others, consider opening a PR to the
harless repository. See [CONTRIBUTING.md](https://github.com/nicepkg/harless/blob/main/CONTRIBUTING.md).
