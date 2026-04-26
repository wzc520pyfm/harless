# Smoke: Claude Code against harless v0.1.0

- Date: <!-- fill -->
- OS: <!-- fill -->
- Node: <!-- fill -->
- Claude Code version: <!-- fill -->

## Step 1: install

```bash
npx harless init --yes
```

- [ ] `.agents/` created with all default modules
- [ ] `AGENTS.md` contains harless marker block
- [ ] `doctor` exits 0

## Step 2: brainstorming skill triggers

Send: "Help me plan adding dark mode to this app"

- [ ] Agent reads `.agents/skills/brainstorming/SKILL.md` (check transcript)

## Step 3: loop runs

```bash
bash .agents/scripts/loop.sh .agents/loop/test-task
```

- [ ] Script executes (may fail on check.sh — that's OK for smoke)

## Step 4: review runs

```bash
bash .agents/scripts/review.sh HEAD
```

- [ ] Script completes or exits with "no diff"

## Step 5: browser-debug uses chrome-devtools-mcp

- [ ] `.mcp.json` contains chrome-devtools entry
- [ ] MCP server appears in agent's MCP panel (if applicable)

## Verdict: <!-- PASS / FAIL -->
