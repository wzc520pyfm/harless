# memory — Cross-Session Memory

Persist and recall context across agent sessions.

## Files

- `.harness/memory/SKILL.md`
- `.harness/scripts/compact.sh`

## Usage

**Read** (session start): `ls .harness/memory/topics/`

**Write topics**: Agent writes directly to `.harness/memory/topics/<name>.md`

**Compact** (session end):

```bash
echo "## Summary\n- Fixed auth bug" | bash .harness/scripts/compact.sh
```

Sessions are append-only logs; topics are curated knowledge files.
