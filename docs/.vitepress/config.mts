import { defineConfig } from "vitepress";

const guideSidebar = (prefix = "") => [
  {
    text: prefix ? "指南" : "Guide",
    items: [
      { text: prefix ? "快速开始" : "Getting Started", link: `${prefix}/getting-started` },
      { text: prefix ? "方案对比" : "Compared", link: `${prefix}/compared` },
      { text: prefix ? "扩展指南" : "Extending", link: `${prefix}/extending` },
    ],
  },
  {
    text: prefix ? "模块" : "Modules",
    items: [
      { text: "skills", link: `${prefix}/modules/skills` },
      { text: "spec", link: `${prefix}/modules/spec` },
      { text: "loop", link: `${prefix}/modules/loop` },
      { text: "memory", link: `${prefix}/modules/memory` },
      { text: "browser-debug", link: `${prefix}/modules/browser-debug` },
      { text: "orchestrate", link: `${prefix}/modules/orchestrate` },
      { text: "review", link: `${prefix}/modules/review` },
      { text: "simplify", link: `${prefix}/modules/simplify` },
    ],
  },
];

export default defineConfig({
  title: "harless",
  description: "Minimal agent-agnostic AI Coding Harness",

  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        nav: [
          { text: "Guide", link: "/getting-started" },
          { text: "Modules", link: "/modules/skills" },
          { text: "GitHub", link: "https://github.com/wzc520pyfm/harless" },
        ],
        sidebar: guideSidebar(),
      },
    },
    zh: {
      label: "简体中文",
      lang: "zh-CN",
      description: "最小化、Agent 无关的 AI 编程 Harness",
      themeConfig: {
        nav: [
          { text: "指南", link: "/zh/getting-started" },
          { text: "模块", link: "/zh/modules/skills" },
          { text: "GitHub", link: "https://github.com/wzc520pyfm/harless" },
        ],
        sidebar: guideSidebar("/zh"),
        outline: { label: "本页目录" },
        docFooter: { prev: "上一篇", next: "下一篇" },
        darkModeSwitchLabel: "深色模式",
        returnToTopLabel: "返回顶部",
        sidebarMenuLabel: "菜单",
      },
    },
  },
});
