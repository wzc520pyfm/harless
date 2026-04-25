#!/usr/bin/env bash
# Spawn an independent agent to review a diff.
# AGENT_CMD examples:
#   AGENT_CMD="claude -p"          (default)
#   AGENT_CMD="cursor-agent -p"
#   AGENT_CMD="codex exec"
set -euo pipefail
REF="${1:-HEAD}"
AGENT_CMD="${AGENT_CMD:-claude -p}"
TS=$(date +%Y-%m-%dT%H-%M-%S)
OUT_DIR=.harness/review; mkdir -p "$OUT_DIR"
OUT="$OUT_DIR/$TS.md"
DIFF=$(git diff "$REF")
if [[ -z "$DIFF" ]]; then echo "no diff against $REF"; exit 0; fi
CHECKLIST=$(cat .harness/review/SKILL.md)
{ echo "$CHECKLIST"; echo; echo "=== DIFF ==="; echo "$DIFF"; } | $AGENT_CMD > "$OUT"
echo "✓ wrote $OUT"
