# browser-debug — Web Debugging

Discipline for browser automation via `chrome-devtools-mcp`.

## Files

- `.harness/browser-debug/SKILL.md`

## MCP

harless configures `.mcp.json` with `chrome-devtools-mcp` at init time.

## Key rules

1. Snapshot before any interaction
2. Scroll into view before clicking
3. One action, then verify
4. Abandon after 4 consecutive failures
