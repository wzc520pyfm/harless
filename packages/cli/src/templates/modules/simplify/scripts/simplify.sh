#!/usr/bin/env bash
# Independent code simplification scan.
# AGENT_CMD examples:
#   AGENT_CMD="claude -p"          (default)
#   AGENT_CMD="cursor-agent -p"
#   AGENT_CMD="codex exec"
set -euo pipefail
TARGET="${1:-.}"
AGENT_CMD="${AGENT_CMD:-claude -p}"
TS=$(date +%Y-%m-%dT%H-%M-%S)
OUT_DIR=.harness/simplify; mkdir -p "$OUT_DIR"
OUT="$OUT_DIR/$TS.md"
CHECKLIST=$(cat .harness/simplify/SKILL.md)
FILES=$(find "$TARGET" -type f -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' | head -50)
if [[ -z "$FILES" ]]; then echo "no source files found in $TARGET"; exit 0; fi
{
  echo "$CHECKLIST"
  echo
  echo "=== FILES TO SCAN ==="
  for f in $FILES; do
    echo "--- $f ---"
    head -100 "$f"
  done
} | $AGENT_CMD > "$OUT"
echo "✓ wrote $OUT"
