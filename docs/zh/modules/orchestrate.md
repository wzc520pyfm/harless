# orchestrate — 并行子 Agent 调度

并行运行多个 Agent 任务。

## 文件

- `.harness/orchestrate/SKILL.md`
- `.harness/scripts/dispatch.sh`

## 用法

```bash
cat > tasks.json << 'EOF'
[
  { "id": "refactor-auth", "prompt": "重构认证模块", "timeoutSec": 300 },
  { "id": "update-tests", "prompt": "更新 API 测试", "timeoutSec": 300 }
]
EOF
bash .harness/scripts/dispatch.sh tasks.json
```

日志：`.harness/orchestrate/<id>-<timestamp>.log`

init 时默认不启用。通过 `npx harless add orchestrate` 添加。
