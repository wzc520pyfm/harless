# memory — 跨会话记忆

在 Agent 会话之间持久化和回忆上下文。

## 文件

- `.harness/memory/SKILL.md`
- `.harness/scripts/compact.sh`

## 用法

**读取**（会话开始时）：`ls .harness/memory/topics/`

**写入主题**：Agent 直接写入 `.harness/memory/topics/<name>.md`

**归档**（会话结束时）：

```bash
echo "## 摘要\n- 修复了认证 bug" | bash .harness/scripts/compact.sh
```

sessions 是仅追加的日志；topics 是经过整理的知识文件。
