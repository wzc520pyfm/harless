# memory — Cross-Session Memory

Persist and recall context across agent sessions.

## Files

- `.agents/memory/SKILL.md`
- `.agents/scripts/compact.sh`

## Usage

**Read** (session start): `ls .agents/memory/topics/`

**Write topics**: Agent writes directly to `.agents/memory/topics/<name>.md`

**Compact** (session end):

```bash
echo "## Summary\n- Fixed auth bug" | bash .agents/scripts/compact.sh
```

Sessions are append-only logs; topics are curated knowledge files.
