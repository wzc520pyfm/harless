import fs from "node:fs";
import path from "node:path";

export type Framework = "next" | "vite" | "remix" | "astro" | "svelte" | "react" | "unknown";
export type PackageManager = "pnpm" | "yarn" | "npm" | "bun" | "unknown";
export type StackKind = "web" | "generic";

export interface StackInfo {
  framework: Framework;
  packageManager: PackageManager;
  kind: StackKind;
  workspace: boolean;
}

const FRAMEWORK_KEYS: Array<[Framework, string[]]> = [
  ["next", ["next"]],
  ["remix", ["@remix-run/node", "@remix-run/react"]],
  ["astro", ["astro"]],
  ["svelte", ["@sveltejs/kit", "svelte"]],
  ["vite", ["vite"]],
  ["react", ["react"]],
];

export function detectStack(cwd: string): StackInfo {
  const pkgPath = path.join(cwd, "package.json");
  let deps: Record<string, string> = {};
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  }
  let framework: Framework = "unknown";
  for (const [name, keys] of FRAMEWORK_KEYS) {
    if (keys.some((k) => k in deps)) {
      framework = name;
      break;
    }
  }
  const packageManager: PackageManager =
    fs.existsSync(path.join(cwd, "pnpm-lock.yaml")) ? "pnpm" :
    fs.existsSync(path.join(cwd, "yarn.lock")) ? "yarn" :
    fs.existsSync(path.join(cwd, "bun.lockb")) ? "bun" :
    fs.existsSync(path.join(cwd, "package-lock.json")) ? "npm" : "unknown";
  const workspace =
    fs.existsSync(path.join(cwd, "pnpm-workspace.yaml")) ||
    fs.existsSync(path.join(cwd, "lerna.json")) ||
    (fs.existsSync(pkgPath) && Array.isArray(JSON.parse(fs.readFileSync(pkgPath, "utf8")).workspaces));
  const kind: StackKind = framework === "unknown" ? "generic" : "web";
  return { framework, packageManager, kind, workspace };
}
