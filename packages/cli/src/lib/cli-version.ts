import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** Semver of the published `harless` CLI package (from package.json). */
export function harlessCliVersion(): string {
  return require("../../package.json").version as string;
}
