import { createRequire } from "node:module";
import { initCmd } from "./commands/init.js";
import { addCmd } from "./commands/add.js";
import { removeCmd } from "./commands/remove.js";
import { updateCmd } from "./commands/update.js";
import { doctorCmd } from "./commands/doctor.js";
import { log } from "./lib/logger.js";
import { HarlessError } from "./lib/errors.js";
import { EXIT } from "./lib/exit.js";

export interface Flags {
  yes: boolean;
  offline: boolean;
  here: boolean;
  modules?: string;
  agents?: string;
  positional: string[];
  [k: string]: string | boolean | string[] | undefined;
}

export async function run(argv: string[]): Promise<void> {
  const [cmd, ...rest] = argv;
  const flags = parseGlobalFlags(rest);
  try {
    switch (cmd) {
      case "init":    return await initCmd(flags);
      case "add":     return await addCmd(flags.positional[0], flags);
      case "remove":  return await removeCmd(flags.positional[0], flags);
      case "update":  return await updateCmd(flags);
      case "doctor":  return await doctorCmd(flags);
      case "--version": case "-V": {
        const require = createRequire(import.meta.url);
        const { version } = require("../package.json");
        console.log(version);
        return;
      }
      case undefined: case "--help": case "-h":
        printHelp(); return;
      default:
        log.err(`unknown command: ${cmd}`);
        printHelp();
        process.exitCode = 1;
    }
  } catch (err) {
    if (err instanceof HarlessError) {
      log.err(err.message);
      process.exitCode = err.code;
    } else {
      log.err(String(err));
      process.exitCode = EXIT.FAIL;
    }
  }
}

function parseGlobalFlags(args: string[]): Flags {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = { yes: false, offline: false, here: false };
  for (const a of args) {
    if (a === "--yes") flags.yes = true;
    else if (a === "--offline") flags.offline = true;
    else if (a === "--here") flags.here = true;
    else if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq > -1) flags[a.slice(2, eq)] = a.slice(eq + 1);
      else flags[a.slice(2)] = true;
    } else positional.push(a);
  }
  return { ...flags, positional } as any;
}

function printHelp() {
  console.log(`Usage: harless <init|add|remove|update|doctor> [--yes] [--offline]

Commands:
  init              Initialize harness in current project
  add <module>      Add a capability module
  remove <module>   Remove a capability module
  update            Update all modules to latest templates
  doctor            Check harness health

Flags:
  --yes             Non-interactive mode (accept defaults)
  --offline         Skip npm registry version check
  --here            Allow init in monorepo sub-package`);
}
