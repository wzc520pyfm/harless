# simplify — 代码简化扫描

独立 Agent 扫描不必要的复杂度。

## 文件

- `.harness/simplify/SKILL.md`
- `.harness/scripts/simplify.sh`

## 用法

```bash
bash .harness/scripts/simplify.sh src/
```

输出：`.harness/simplify/<timestamp>.md`

目标：死代码、过度抽象、冗余封装、过多间接层、复制粘贴重复、过早优化。

init 时默认不启用。通过 `npx harless add simplify` 添加。
