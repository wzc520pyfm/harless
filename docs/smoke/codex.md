# Smoke: Codex CLI against harless v0.1.0

- Date: <!-- fill -->
- OS: <!-- fill -->
- Node: <!-- fill -->
- Codex CLI version: <!-- fill -->

## Step 1: install

```bash
npx harless init --yes
```

- [ ] `.harness/` created with all default modules
- [ ] `AGENTS.md` contains harless marker block
- [ ] `doctor` exits 0

## Step 2: brainstorming skill triggers

Send: "Help me plan adding dark mode to this app"

- [ ] Agent reads `.harness/skills/brainstorming/SKILL.md` (check transcript)

## Step 3: AGENTS.md adherence

Send a generic request — verify Codex follows AGENTS.md directives.

- [ ] Transcript shows Codex reading AGENTS.md or referenced SKILL.md

## Step 4: review runs

- [ ] Script completes or exits with "no diff"

## Verdict: <!-- PASS / FAIL -->
