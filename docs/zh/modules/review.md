# review — 独立 Diff 审查

启动一个全新的 Agent 进程来审查你的 diff，避免会话偏见。

## 文件

- `.agents/review/SKILL.md`
- `.agents/scripts/review.sh`

## 用法

```bash
bash .agents/scripts/review.sh HEAD
```

输出：`.agents/review/<timestamp>.md`

审查清单涵盖：正确性、测试、命名、复杂度、安全性、性能和遗留问题。
