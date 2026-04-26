# harless

[English](./README.md) | 简体中文

> 最小化、Agent 无关的 AI 编程 Harness —— 一条 `npx harless init` 命令，
> 为任何仓库接入完整、轻量的 harness 体系，兼容 Claude Code、Cursor、
> Codex CLI 及所有读取 AGENTS.md 的 Agent。

## 它是什么？

harless 是一个 **CLI 注入式** harness：它将 Markdown skills 和 shell
脚本写入你的仓库 `.harness/` 目录下，在 `AGENTS.md` 中追加一个受管理的区块，
然后退出。无守护进程、无 hooks、无全局配置写入 —— 所有文件都由你完全掌控。

## 快速开始

```bash
npx harless init        # 交互式安装
npx harless init --yes  # 非交互式，默认模块
```

## 安装后你会得到什么

| 模块 | 功能 |
|---|---|
| **skills** | 5 个始终生效的纪律：头脑风暴、TDD、调试、验证、审查 |
| **spec** | 规格 → 计划 → 任务 工作流模板 |
| **loop** | Ralph 自纠正循环（迭代直到 check.sh 通过） |
| **memory** | 跨会话记忆（topics + session 归档） |
| **browser-debug** | Web 调试纪律 + chrome-devtools-mcp 配置 |
| **review** | 由独立 Agent 进程进行的 diff 审查 |
| **orchestrate** | 从 tasks.json 并行调度子 Agent |
| **simplify** | 代码简化扫描 |

## 命令

```bash
npx harless init              # 初始化 harness
npx harless add <module>      # 添加模块
npx harless remove <module>   # 移除模块
npx harless update            # 更新模板
npx harless doctor            # 健康检查
```

## Agent 兼容性

| Agent | 状态 |
|---|---|
| Claude Code | Tier 1（已 smoke 测试） |
| Cursor | Tier 1（已 smoke 测试） |
| Codex CLI | Tier 1（已 smoke 测试） |
| Copilot CLI | Tier 2（AGENTS.md 兼容） |
| Gemini CLI | Tier 2（AGENTS.md 兼容） |

## 工作原理

1. `AGENTS.md` 放在项目根目录，告诉 Agent 何时读取哪些 skill 文件
2. `SKILL.md` 文件定义 Agent 遵循的流程
3. Shell 脚本提供可执行的辅助工具（loop、compact、dispatch、review、simplify）
4. `config.json` 跟踪已安装的模块和文件哈希

## 设计

完整架构详见 [设计规格文档](docs/superpowers/specs/2026-04-20-harless-design.md)。

## 贡献

参见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

MIT — 参见 [LICENSE](LICENSE)。
