#!/usr/bin/env bash
# Run N agents in parallel from a tasks.json manifest.
# AGENT_CMD examples:
#   AGENT_CMD="claude -p"          (default)
#   AGENT_CMD="cursor-agent -p"
#   AGENT_CMD="codex exec"
set -euo pipefail
TASKS="${1:?usage: dispatch.sh <tasks.json>}"
AGENT_CMD="${AGENT_CMD:-claude -p}"
TS=$(date +%Y-%m-%dT%H-%M-%S)
LOG_DIR=.agents/orchestrate; mkdir -p "$LOG_DIR"

PIDS=()
IDS=()
LOGS=()

while IFS=$'\t' read -r ID PROMPT CWD TIMEOUT; do
  LOG="$LOG_DIR/$ID-$TS.log"
  echo "→ $ID (cwd=$CWD, log=$LOG)"
  if [[ "$TIMEOUT" -gt 0 ]] 2>/dev/null; then
    ( cd "$CWD" && timeout "${TIMEOUT}s" $AGENT_CMD "$PROMPT" ) >"$LOG" 2>&1 &
  else
    ( cd "$CWD" && $AGENT_CMD "$PROMPT" ) >"$LOG" 2>&1 &
  fi
  PIDS+=($!)
  IDS+=("$ID")
  LOGS+=("$LOG")
done < <(node -e '
  const t = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  for (const x of t) console.log([x.id, x.prompt, x.cwd||".", x.timeoutSec||0].join("\t"));
' "$TASKS")

FAIL=0
echo
printf "%-20s %-6s %s\n" "id" "exit" "log"
printf "%-20s %-6s %s\n" "---" "---" "---"
for i in "${!PIDS[@]}"; do
  wait "${PIDS[$i]}" && EC=0 || EC=$?
  printf "%-20s %-6s %s\n" "${IDS[$i]}" "$EC" "${LOGS[$i]}"
  [[ "$EC" -ne 0 ]] && FAIL=1
done

exit "$FAIL"
