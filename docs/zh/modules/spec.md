# spec — 规格驱动开发

三步工作流：想法 → `spec.md` → `plan.md` → `tasks.md`。

## 文件

- `.agents/spec/SKILL.md`
- `.agents/specs/.template/spec.md`
- `.agents/specs/.template/plan.md`
- `.agents/specs/.template/tasks.md`

## 用法

```bash
cp -r .agents/specs/.template .agents/specs/$(date +%Y-%m-%d)-my-feature
```

在实现之前逐步填写每个文档。
