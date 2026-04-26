# loop — 自纠正循环（Ralph）

迭代式 Agent 循环：执行 → 检查 → 重复直到完成。

## 文件

- `.agents/loop/SKILL.md`
- `.agents/loop/.template/goal.md`
- `.agents/loop/.template/check.sh`
- `.agents/scripts/loop.sh`

## 用法

```bash
cp -r .agents/loop/.template .agents/loop/my-task
# 编辑 goal.md 和 check.sh
bash .agents/scripts/loop.sh .agents/loop/my-task
```

环境变量：`AGENT_CMD`（默认 `claude -p`），`MAX_ITER`（默认 20）。
