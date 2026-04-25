# Release Gate: AGENTS.md auto-routing test

Per spec §7.3: each Tier 1 agent must auto-route to `brainstorming/SKILL.md`
when given a generic creative request ("Help me plan adding dark mode") without
mentioning any skill by name.

## Setup

```bash
pnpm dlx create-next-app@latest /tmp/harless-gate --yes
cd /tmp/harless-gate
npx harless init --yes
```

## Results

### Claude Code

- Date: <!-- fill -->
- Prompt: "Help me plan adding dark mode"
- Agent read brainstorming/SKILL.md within 3 turns: <!-- YES / NO -->
- Verdict: <!-- PASS / FAIL -->

### Cursor

- Date: <!-- fill -->
- Prompt: "Help me plan adding dark mode"
- Agent read brainstorming/SKILL.md within 3 turns: <!-- YES / NO -->
- Verdict: <!-- PASS / FAIL -->

### Codex CLI

- Date: <!-- fill -->
- Prompt: "Help me plan adding dark mode"
- Agent read brainstorming/SKILL.md within 3 turns: <!-- YES / NO -->
- Verdict: <!-- PASS / FAIL -->

## Overall: <!-- PASS (all 3) / FAIL (blocks release) -->
