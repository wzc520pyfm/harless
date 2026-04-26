# 与其他方案对比

| 特性 | Superpowers | OpenSpec | claude-mem | harless |
|---|---|---|---|---|
| Agent 范围 | 仅 Claude Code | 仅 Claude Code | 仅 Claude Code | 任何 AGENTS.md Agent |
| 交付方式 | 插件/hooks | CLI 注入 | 插件 | CLI 注入 |
| Skills | ~30 个文件 | 无 | 无 | 12 个文件（5 纪律 + 7 模块） |
| Spec 工作流 | 无 | 完整 | 无 | 最小化（3 个模板） |
| 自纠正循环 | 无 | 无 | 无 | Ralph loop（脚本） |
| 记忆 | 无 | 无 | 完整（守护进程） | 最小化（stdin 追加 + topics） |
| 浏览器调试 | 无 | 无 | 无 | chrome-devtools-mcp |
| 编排 | 无 | 无 | 无 | dispatch.sh（并行） |
| 代码审查 | 插件 | 无 | 无 | review.sh（独立 Agent） |
| 代码简化 | 插件 | 无 | 无 | simplify.sh（独立 Agent） |
| 运行时 | Hooks + 守护进程 | 无 | 守护进程 | 无 |
| 注入总行数 | ~3000+ | ~500 | ~800 | ≤ 1830 |

harless 的设计目标是成为**最小但完整**的 harness —— 用一个轻量化的包覆盖全部 8
个能力领域，无需 Agent 专属插件或后台进程。
