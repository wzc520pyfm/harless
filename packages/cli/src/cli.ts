import { createRequire } from "node:module";

export async function run(argv: string[]): Promise<void> {
  if (argv[0] === "--version" || argv[0] === "-V") {
    const require = createRequire(import.meta.url);
    const { version } = require("../package.json");
    console.log(version);
    return;
  }
  console.log("harless v0.1 — full CLI coming in Phase 3");
}
