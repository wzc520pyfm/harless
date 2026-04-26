# .agents/

This directory is managed by [harless](https://github.com/nicepkg/harless) — a
minimal, agent-agnostic AI Coding Harness. You own every file here; edit freely.

## What's inside

| Directory | Purpose |
|---|---|
| `skills/` | 5 always-on discipline SKILLs (brainstorming, TDD, debugging, verification, review) |
| `spec/` | Spec-driven development: idea → spec → plan → tasks |
| `loop/` | Self-correcting Ralph loop templates |
| `memory/` | Cross-session memory (sessions + topics) |
| `browser-debug/` | Web debugging discipline via `chrome-devtools-mcp` |
| `orchestrate/` | Parallel subagent dispatch |
| `review/` | Independent diff review |
| `simplify/` | Code simplification scan |
| `scripts/` | Executable helpers called by agents |

## Calling scripts

```bash
# Ralph loop (iterates until check.sh passes)
bash .agents/scripts/loop.sh .agents/loop/my-task

# Append a session summary to memory
echo "## Summary\n- Fixed auth bug" | bash .agents/scripts/compact.sh

# Independent code review of staged changes
bash .agents/scripts/review.sh HEAD
```

Override the agent CLI with `$AGENT_CMD`:

```bash
AGENT_CMD="cursor-agent -p" bash .agents/scripts/review.sh
AGENT_CMD="codex exec"      bash .agents/scripts/dispatch.sh tasks.json
```

## Cross-agent MCP config

harless writes **`.mcp.json`** at the project root (Claude Code) and **`.cursor/mcp.json`**
(Cursor). Keep both in sync if you edit MCP servers by hand.

For other agents, add the MCP server manually:

**Codex CLI** (`~/.codex/config.toml`):
```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["chrome-devtools-mcp@latest"]
```

**Gemini CLI** (`.gemini/settings.json`):
```json
{ "mcpServers": { "chrome-devtools": { "command": "npx", "args": ["chrome-devtools-mcp@latest"] } } }
```

## Uninstall

```bash
npx harless remove <module>   # remove a specific module
rm -rf .agents               # remove everything
```

Then remove the `<!-- BEGIN harless v0.1 -->` block from `AGENTS.md`.
