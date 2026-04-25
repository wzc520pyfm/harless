#!/usr/bin/env bash
# Append a session summary to memory.
# AGENT_CMD examples (not used by this script, listed for convention):
#   AGENT_CMD="claude -p"          (default)
#   AGENT_CMD="cursor-agent -p"
#   AGENT_CMD="codex exec"
# Usage:
#   echo "<markdown synopsis>" | bash .harness/scripts/compact.sh
#   bash .harness/scripts/compact.sh < summary.md
set -euo pipefail
DATE=$(date +%Y-%m-%d); TS=$(date +%Y-%m-%dT%H:%M:%S%z)
DIR=.harness/memory/sessions; mkdir -p "$DIR"
FILE="$DIR/$DATE.md"
{ echo; echo "## Session @ $TS"; echo; cat; echo; } >> "$FILE"
echo "✓ appended to $FILE"
echo "Reminder: update topic files in .harness/memory/topics/ for any reusable knowledge."
