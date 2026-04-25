# Compared to alternatives

| Feature | Superpowers | OpenSpec | claude-mem | harless |
|---|---|---|---|---|
| Agent scope | Claude Code only | Claude Code only | Claude Code only | Any AGENTS.md agent |
| Delivery | Plugin/hooks | CLI inject | Plugin | CLI inject |
| Skills | ~30 files | N/A | N/A | 12 files (5 disciplines + 7 modules) |
| Spec workflow | N/A | Full | N/A | Minimal (3 templates) |
| Self-correcting loop | N/A | N/A | N/A | Ralph loop (script) |
| Memory | N/A | N/A | Full (daemon) | Minimal (stdin appender + topics) |
| Browser debug | N/A | N/A | N/A | chrome-devtools-mcp |
| Orchestration | N/A | N/A | N/A | dispatch.sh (parallel) |
| Code review | Plugin | N/A | N/A | review.sh (independent agent) |
| Simplification | Plugin | N/A | N/A | simplify.sh (independent agent) |
| Runtime | Hooks + daemon | None | Daemon | None |
| Total injected LOC | ~3000+ | ~500 | ~800 | ≤ 1830 |

harless is designed to be the **minimal complete** harness — covering all 8
capability areas in a single lightweight package, without agent-specific
plugins or background processes.
