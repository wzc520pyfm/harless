#!/usr/bin/env bash
# Ralph self-correcting loop.
# AGENT_CMD examples:
#   AGENT_CMD="claude -p"          (default)
#   AGENT_CMD="cursor-agent -p"
#   AGENT_CMD="codex exec"
set -euo pipefail
WORK="${1:?usage: loop.sh <work-dir>}"; cd "$WORK"
MAX="${MAX_ITER:-20}"
AGENT_CMD="${AGENT_CMD:-claude -p}"
[[ -f goal.md && -f check.sh ]] || { echo "need goal.md + check.sh in $WORK"; exit 3; }
for i in $(seq 1 "$MAX"); do
  echo "=== iter $i ==="
  $AGENT_CMD "$(cat goal.md)" | tee "iter-$i.log"
  if bash check.sh; then echo "✓ done @ iter $i"; exit 0; fi
done
echo "✗ max iterations reached"; exit 1
