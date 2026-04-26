# loop — 自纠正循环（Ralph）

迭代式 Agent 循环：执行 → 检查 → 重复直到完成。

## 文件

- `.harness/loop/SKILL.md`
- `.harness/loop/.template/goal.md`
- `.harness/loop/.template/check.sh`
- `.harness/scripts/loop.sh`

## 用法

```bash
cp -r .harness/loop/.template .harness/loop/my-task
# 编辑 goal.md 和 check.sh
bash .harness/scripts/loop.sh .harness/loop/my-task
```

环境变量：`AGENT_CMD`（默认 `claude -p`），`MAX_ITER`（默认 20）。
