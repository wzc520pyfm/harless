# harless

English | [简体中文](./README.zh-CN.md)

> Minimal, agent-agnostic AI Coding Harness — one `npx harless init` to give
> any repo a complete, lightweight harness for Claude Code, Cursor, Codex CLI,
> and any AGENTS.md-aware agent.

## What is it?

harless is a **CLI-injected** harness: it writes Markdown skills and shell
scripts into your repo under `.harness/`, appends a managed block to
`AGENTS.md`, and exits. No daemons, no hooks, no global config writes —
you own every file.

## Quick Start

```bash
npx harless init        # interactive setup
npx harless init --yes  # non-interactive, default modules
```

## What you get


| Module            | What it does                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| **skills**        | 5 always-on disciplines: brainstorming, TDD, debugging, verification, review |
| **spec**          | Spec → plan → tasks workflow templates                                       |
| **loop**          | Ralph self-correcting loop (iterates until check.sh passes)                  |
| **memory**        | Cross-session memory via topics + session compaction                         |
| **browser-debug** | Web debugging discipline + chrome-devtools-mcp config                        |
| **review**        | Independent diff review by a fresh agent process                             |
| **orchestrate**   | Parallel subagent dispatch from tasks.json                                   |
| **simplify**      | Code simplification scan                                                     |


## Commands

```bash
npx harless init              # initialize harness
npx harless add <module>      # add a module
npx harless remove <module>   # remove a module
npx harless update            # update to latest templates
npx harless doctor            # health check
```

## Agent compatibility


| Agent       | Status                        |
| ----------- | ----------------------------- |
| Claude Code | Tier 1 (smoke-tested)         |
| Cursor      | Tier 1 (smoke-tested)         |
| Codex CLI   | Tier 1 (smoke-tested)         |
| Copilot CLI | Tier 2 (AGENTS.md compatible) |
| Gemini CLI  | Tier 2 (AGENTS.md compatible) |


## How it works

1. `AGENTS.md` at the project root tells agents which skill files to read
2. `SKILL.md` files define procedures the agent follows
3. Shell scripts provide executable helpers (loop, compact, dispatch, review, simplify)
4. `config.json` tracks installed modules and file hashes

## Design

See the [design spec](docs/superpowers/specs/2026-04-20-harless-design.md) for
full architecture details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).