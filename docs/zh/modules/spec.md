# spec — 规格驱动开发

三步工作流：想法 → `spec.md` → `plan.md` → `tasks.md`。

## 文件

- `.harness/spec/SKILL.md`
- `.harness/specs/.template/spec.md`
- `.harness/specs/.template/plan.md`
- `.harness/specs/.template/tasks.md`

## 用法

```bash
cp -r .harness/specs/.template .harness/specs/$(date +%Y-%m-%d)-my-feature
```

在实现之前逐步填写每个文档。
