#!/usr/bin/env bash
# Pre-implementation verification harness for harless v0.1.
# Executes the checklist defined in docs/superpowers/specs/2026-04-20-harless-design.md §7.5
# (claims V1–V7). Automates V4/V5/V6; prompts the operator for V1/V2/V3/V7.
# Results are written to docs/smoke/verification.md in Markdown.
#
# Usage:
#   bash scripts/verify.sh
#
# Exits 0 always (check the output file); a non-zero exit from an automated
# command is captured as FAIL in the report but does not abort the run.

set -uo pipefail

OUT=docs/smoke/verification.md
mkdir -p "$(dirname "$OUT")"

{
  echo "# Pre-Implementation Verification — $(date -Iseconds 2>/dev/null || date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo
  echo "Executed by \`scripts/verify.sh\`. See spec §7.5 for the full claim"
  echo "descriptions and fallback plans."
  echo
} > "$OUT"

automated() {
  local id="$1" desc="$2" cmd="$3"
  {
    echo "## $id — $desc"
    echo
    echo '```'
  } >> "$OUT"
  if eval "$cmd" >> "$OUT" 2>&1; then
    {
      echo '```'
      echo
      echo "Result: ✓ PASS"
      echo
    } >> "$OUT"
  else
    {
      echo '```'
      echo
      echo "Result: ✗ FAIL"
      echo
    } >> "$OUT"
  fi
}

manual() {
  local id="$1" desc="$2" steps="$3"
  {
    echo "## $id — $desc (MANUAL)"
    echo
    echo "$steps"
    echo
  } >> "$OUT"
  local ans=""
  if [ -t 0 ]; then
    read -rp "$id passed? [y/N/u=unknown]: " ans
  else
    # Non-interactive: default to UNKNOWN so CI / scripted runs don't lie.
    ans="u"
  fi
  case "$ans" in
    y|Y) echo "Result: ✓ PASS" >> "$OUT" ;;
    u|U|"") echo "Result: ? UNKNOWN (manual step not yet performed)" >> "$OUT" ;;
    *)   echo "Result: ✗ FAIL" >> "$OUT" ;;
  esac
  echo >> "$OUT"
}

automated V4 "cursor-agent -p exists (non-interactive mode)" \
  "command -v cursor-agent >/dev/null && cursor-agent --help 2>&1 | head -40"
automated V5 "copilot -p exists (Copilot CLI non-interactive mode)" \
  "command -v copilot >/dev/null && copilot --help 2>&1 | head -40"
automated V6 "chrome-devtools-mcp package exists on npm" \
  "npm view chrome-devtools-mcp version"

manual V1 "Claude Code Skill tool auto-discovers .agents/skills/*/SKILL.md" \
  "Steps:
1. Place a SKILL.md at \`.agents/skills/foo/SKILL.md\` with a unique, matching \`description\`.
2. In a Claude Code session, send a query that matches that description.
3. Observe whether CC auto-loads the skill (PASS) vs only Read-on-demand (FAIL → apply §7.5 V1 fallback: route ALL skill activation through AGENTS.md index reads)."

manual V2 "Cursor reads project-root .mcp.json" \
  "Steps:
1. Place \`.mcp.json\` at the project root containing a known MCP server entry.
2. Restart Cursor.
3. Check Cursor's MCP panel; PASS if the server appears.
4. If FAIL: \`init\` must write to \`.cursor/mcp.json\` instead; \`doctor\` must check both paths (§7.5 V2 fallback)."

manual V3 "Codex CLI follows imperative AGENTS.md instructions" \
  "Steps:
1. Create a minimal AGENTS.md containing: \`When you receive any request, first read .agents/skills/foo/SKILL.md.\`
2. In a Codex CLI session, send a generic, unrelated request.
3. Observe the transcript: PASS if Codex reads the target file first; FAIL if it ignores the directive (→ inline more critical instructions in AGENTS.md, §7.5 V3 fallback)."

manual V7 "Project-root AGENTS.md is the primary convention file (CC, Cursor, Codex)" \
  "Steps (run in each Tier-1 agent):
1. Open a session in the repo with a populated AGENTS.md.
2. Ask: \"Can you see AGENTS.md at the project root? Summarise its first section.\"
3. PASS if the agent cites its contents. If any agent prefers a different file (CLAUDE.md, .cursorrules, etc.), apply the §7.5 V7 fallback: \`init\` writes a 1-line shim (\`Read AGENTS.md and follow it.\`) in that agent's preferred file and hash-tracks it."

{
  echo "---"
  echo
  echo "## Summary"
  echo
  echo "- Automated (V4, V5, V6): see block results above."
  echo "- Manual (V1, V2, V3, V7): re-run this script interactively in each Tier-1 agent and answer the prompts."
  echo "- Gate to Phase 1: every V# must be PASS or carry an explicit fallback note before scaffolding begins."
} >> "$OUT"

echo "Verification report written to $OUT"
