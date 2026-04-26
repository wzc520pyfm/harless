# Pre-Implementation Verification — 2026-04-23T22:37:57+08:00

Executed by `scripts/verify.sh`. See spec §7.5 for the full claim
descriptions and fallback plans.

## V4 — cursor-agent -p exists (non-interactive mode)

```
```

Result: ✗ FAIL

## V5 — copilot -p exists (Copilot CLI non-interactive mode)

```
```

Result: ✗ FAIL

## V6 — chrome-devtools-mcp package exists on npm

```
0.23.0
```

Result: ✓ PASS

## V1 — Claude Code Skill tool auto-discovers .agents/skills/*/SKILL.md (MANUAL)

Steps:
1. Place a SKILL.md at `.agents/skills/foo/SKILL.md` with a unique, matching `description`.
2. In a Claude Code session, send a query that matches that description.
3. Observe whether CC auto-loads the skill (PASS) vs only Read-on-demand (FAIL → apply §7.5 V1 fallback: route ALL skill activation through AGENTS.md index reads).

Result: ? UNKNOWN (manual step not yet performed)

## V2 — Cursor reads project-root .mcp.json (MANUAL)

Steps:
1. Place `.mcp.json` at the project root containing a known MCP server entry.
2. Restart Cursor.
3. Check Cursor's MCP panel; PASS if the server appears.
4. If FAIL: `init` must write to `.cursor/mcp.json` instead; `doctor` must check both paths (§7.5 V2 fallback).

Result: ? UNKNOWN (manual step not yet performed)

## V3 — Codex CLI follows imperative AGENTS.md instructions (MANUAL)

Steps:
1. Create a minimal AGENTS.md containing: `When you receive any request, first read .agents/skills/foo/SKILL.md.`
2. In a Codex CLI session, send a generic, unrelated request.
3. Observe the transcript: PASS if Codex reads the target file first; FAIL if it ignores the directive (→ inline more critical instructions in AGENTS.md, §7.5 V3 fallback).

Result: ? UNKNOWN (manual step not yet performed)

## V7 — Project-root AGENTS.md is the primary convention file (CC, Cursor, Codex) (MANUAL)

Steps (run in each Tier-1 agent):
1. Open a session in the repo with a populated AGENTS.md.
2. Ask: "Can you see AGENTS.md at the project root? Summarise its first section."
3. PASS if the agent cites its contents. If any agent prefers a different file (CLAUDE.md, .cursorrules, etc.), apply the §7.5 V7 fallback: `init` writes a 1-line shim (`Read AGENTS.md and follow it.`) in that agent's preferred file and hash-tracks it.

Result: ? UNKNOWN (manual step not yet performed)

---

## Summary

- Automated (V4, V5, V6): see block results above.
- Manual (V1, V2, V3, V7): re-run this script interactively in each Tier-1 agent and answer the prompts.
- Gate to Phase 1: every V# must be PASS or carry an explicit fallback note before scaffolding begins.

---

## Notes & Fallback Decisions (2026-04-23)

Context of this run: executed on the maintainer workstation (macOS, Node via
nvm, Claude Code installed). Results above reflect only what the local shell
can automate; the manual V#s must still be completed inside each Tier-1 agent.

### Supporting fact: `claude -p` is available

Probe: `claude --version` → `2.1.81 (Claude Code)`; `claude --help` advertises
`-p/--print` as the non-interactive mode. This confirms the default
`$AGENT_CMD=claude -p` used by the injected scripts works on this host.

### V4 — `cursor-agent -p` (FAIL, interpreted)

`cursor-agent` is not installed on this workstation, so the automated probe
reports FAIL. Per spec §7.5 V4 fallback, we treat this as **"not confirmed on
this box"** rather than "claim refuted":

- Keep `$AGENT_CMD=cursor-agent -p` in README / docs as an **example only**,
  guarded by an installation check.
- The injected scripts never hard-code `cursor-agent`; they honour
  `$AGENT_CMD` unconditionally, so users who do have it installed can opt in.
- Before release, re-run this script on a machine where `cursor-agent` is
  installed to confirm the flag spelling (`-p` vs `--print` vs `--prompt`)
  and update docs accordingly.

### V5 — `copilot -p` (FAIL, interpreted)

`copilot` (GitHub Copilot CLI) is not installed on this workstation. Per spec
§7.5 V5 fallback, Copilot remains a **Tier 2** agent (AGENTS.md-compatible,
not smoke-tested in v0.1):

- Remove Copilot from default `$AGENT_CMD` example tables.
- Keep Copilot listed as Tier 2 in the compatibility matrix.
- Revisit for v0.2 once Copilot CLI's non-interactive surface stabilises.

### V6 — `chrome-devtools-mcp` on npm (PASS)

Version `0.23.0` resolved on 2026-04-23. No fallback needed; `init` will
inject the package name as-is.

### V1 / V2 / V3 / V7 — manual, UNKNOWN

These require live sessions in Claude Code, Cursor, and Codex CLI. Maintainer
(or first external contributor) must re-run `bash scripts/verify.sh`
interactively inside each Tier-1 agent and answer `y`/`N` for each claim. If
any claim comes back FAIL, apply the fallback documented in spec §7.5 and
update this file with the decision.

### Phase 0 gate status

- V4 FAIL — fallback applied above (conditional example in docs).
- V5 FAIL — fallback applied above (Copilot stays Tier 2, drops from examples).
- V6 PASS.
- V1 / V2 / V3 / V7 UNKNOWN — **must be resolved before v0.1.0 release**, but
  do not block internal scaffolding (Phases 1–4) because the resolutions only
  affect injected template content and docs, not the CLI core.

**Decision:** Proceed to Phase 1 (repository bootstrap) while the manual V#s
remain open. Phase 7 (smoke testing) is the hard gate that blocks release
until V1/V2/V3/V7 are resolved.
