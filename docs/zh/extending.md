# 扩展 harless

## 编辑任何文件

`.agents/` 下的所有文件都是你的。修改 SKILL.md 来匹配团队规范，
添加 check.sh 步骤，自定义 review 检查清单。harless 通过文件哈希追踪变更，
你的编辑会被安全保留。

## 添加自定义 skill

在 `.agents/` 下任意位置创建新的 SKILL.md：

```
.agents/skills/my-custom-skill/SKILL.md
```

使用标准 frontmatter：

```yaml
---
name: my-custom-skill
description: 当 ... 时使用
when-to-use:
  - ...
when-not-to-use:
  - ...
---
```

然后在 AGENTS.md 的 harless 区块内（标记之间）添加一行指向你的新 skill。

## 添加自定义脚本

将脚本放在 `.agents/scripts/`，并在 AGENTS.md 中引用。遵循现有脚本的约定：

1. `set -euo pipefail`
2. 使用 `$AGENT_CMD`
3. 产出写入 `.agents/<module>/`

## 覆盖 Agent CLI

所有脚本使用 `$AGENT_CMD`（默认：`claude -p`）。单次覆盖：

```bash
AGENT_CMD="cursor-agent -p" bash .agents/scripts/review.sh
```

或在 `.agents/config.json` 中修改默认值：

```json
{ "defaultAgentCmd": "codex exec" }
```

## 贡献上游

如果你的自定义对其他人也有用，欢迎向 harless 仓库提交 PR。
参见 [CONTRIBUTING.md](https://github.com/wzc520pyfm/harless/blob/master/CONTRIBUTING.md)。
