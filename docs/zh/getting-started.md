# 快速开始

## 安装

```bash
npx harless init
```

这会在你的项目根目录创建 `.agents/`，向 `AGENTS.md` 追加一个受管理的区块，
并可选地为 browser-debug 写入 `.mcp.json`。

## 非交互式

```bash
npx harless init --yes
```

安装 6 个默认模块（skills、spec、loop、memory、browser-debug、review），
默认 Agent 为 Claude Code。

## 指定模块

```bash
npx harless init --yes --modules=skills,spec,loop
```

## 添加 / 移除模块

```bash
npx harless add orchestrate
npx harless remove simplify
```

## 更新模板

```bash
npx harless update
```

对比每个文件的哈希与安装时记录的哈希。未修改的文件直接覆盖；
用户修改过的文件保留不动（`--yes` 模式下标记为冲突）。

## 健康检查

```bash
npx harless doctor
```

验证 config、AGENTS.md 标记、脚本权限、MCP 条目和文件完整性。
退出码 0 表示一切正常；非零值是失败检查的位掩码。

## 工作原理

1. **AGENTS.md** 放在项目根目录，告诉所有兼容的 Agent 何时读取哪些 skill 文件。
2. **SKILL.md** 文件位于 `.agents/` 下，定义 Agent 遵循的流程（头脑风暴、TDD、调试等）。
3. **Shell 脚本** 位于 `.agents/scripts/`，提供可执行的辅助工具（ralph loop、memory compact、dispatch、review、simplify）。
4. **config.json** 跟踪已安装的模块、文件哈希和检测到的技术栈。

无守护进程、无 hooks、无全局配置写入。删除 `.agents/` 和 AGENTS.md
中的区块即可完全卸载。
