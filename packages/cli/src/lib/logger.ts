import pc from "picocolors";

export const log = {
  info: (s: string) => console.log(pc.cyan("ℹ "), s),
  ok: (s: string) => console.log(pc.green("✓ "), s),
  warn: (s: string) => console.log(pc.yellow("⚠ "), s),
  err: (s: string) => console.error(pc.red("✗ "), s),
  dim: (s: string) => console.log(pc.dim(s)),
  bare: (s: string) => console.log(s),
};
