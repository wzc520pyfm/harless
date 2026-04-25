import { defineConfig } from "vitepress";

export default defineConfig({
  title: "harless",
  description: "Minimal agent-agnostic AI Coding Harness",
  themeConfig: {
    nav: [
      { text: "Guide", link: "/getting-started" },
      { text: "Modules", link: "/modules/skills" },
      { text: "GitHub", link: "https://github.com/nicepkg/harless" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Compared", link: "/compared" },
          { text: "Extending", link: "/extending" },
        ],
      },
      {
        text: "Modules",
        items: [
          { text: "skills", link: "/modules/skills" },
          { text: "spec", link: "/modules/spec" },
          { text: "loop", link: "/modules/loop" },
          { text: "memory", link: "/modules/memory" },
          { text: "browser-debug", link: "/modules/browser-debug" },
          { text: "orchestrate", link: "/modules/orchestrate" },
          { text: "review", link: "/modules/review" },
          { text: "simplify", link: "/modules/simplify" },
        ],
      },
    ],
  },
});
