# browser-debug — Web 调试

通过 `chrome-devtools-mcp` 进行浏览器自动化的纪律规范。

## 文件

- `.harness/browser-debug/SKILL.md`

## MCP

harless 在 init 时自动在 `.mcp.json` 中配置 `chrome-devtools-mcp`。

## 核心规则

1. 交互前先快照
2. 点击前先滚动到可视区域
3. 一次操作，然后验证
4. 连续失败 4 次后放弃
