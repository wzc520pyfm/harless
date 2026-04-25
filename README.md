# harless

> Minimal, agent-agnostic AI Coding Harness — one `npx harless init` to give
> any repo a complete, lightweight Harness (skills, spec, loop, memory,
> browser-debug, orchestration, review, simplify) for Claude Code, Cursor,
> Codex CLI, and any other AGENTS.md-aware agent.

`harless` is a **CLI-injected** harness: the CLI writes Markdown skills and
shell scripts straight into your repo under `.harness/`, appends a block to
`AGENTS.md` at the project root, and exits. No daemons, no hooks, no global
config writes — you own every file it generates.

See the authoritative v0.1 design spec: [`docs/superpowers/specs/2026-04-20-harless-design.md`](docs/superpowers/specs/2026-04-20-harless-design.md).

## Status

🚧 Pre-release — v0.1 is under active development. The CLI is not yet
published to npm. See [`CHANGELOG.md`](CHANGELOG.md) for progress.

## Quick Start (once published)

```bash
npx harless init        # interactive setup at the repo root
```

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

MIT — see [`LICENSE`](LICENSE).
