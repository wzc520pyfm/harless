---
name: browser-debug
description: Use when debugging a running web page. Enforces discipline around browser automation — snapshot before action, abandon after 4 fails.
when-to-use:
  - Testing UI changes in a live browser
  - Debugging layout, state, or network issues on a web page
  - Verifying visual output of a web application
when-not-to-use:
  - Backend-only work with no UI
  - Static file generation (no live page)
---

# Web Debugging via chrome-devtools-mcp

## Prerequisites

The `chrome-devtools-mcp` MCP server must be running. harless
configures this in `.mcp.json` at init time.

## Procedure

1. **Snapshot first.** Before any interaction, take a browser snapshot
   to understand the current page structure and obtain element refs.
2. **Scroll into view.** Before clicking any element, use
   scroll-into-view to ensure it's visible and not obscured.
3. **One action, then verify.** After each action (click, type, navigate),
   take a fresh snapshot to confirm the page state changed as expected.
4. **Use search for large pages.** On long pages, use browser search to
   locate text instead of scrolling blindly.
5. **Abandon after 4 failures.** If the same action fails 4 times,
   stop and report what you observed, what blocked progress, and the
   most likely next step.

## Anti-patterns

- Clicking without a snapshot (you don't know the page state).
- Repeating the same failing action more than 4 times.
- Assuming element positions from previous snapshots after navigation.
- Ignoring console errors visible in the DevTools output.
