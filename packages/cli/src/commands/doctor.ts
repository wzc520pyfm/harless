import { runChecks, bitmaskOf } from "../lib/doctor-checks.js";
import { log } from "../lib/logger.js";
import { EXIT } from "../lib/exit.js";
import { HarlessError } from "../lib/errors.js";
import type { Flags } from "../cli.js";

export async function doctorCmd(_flags: Flags) {
  const cwd = process.cwd();
  const results = runChecks(cwd);

  log.bare("harless doctor\n");
  for (const r of results) {
    const icon = r.ok ? "✓" : "✗";
    const line = `  ${icon} ${r.label}`;
    if (r.ok) log.ok(r.label);
    else {
      log.err(r.label);
      if (r.hint) log.dim(`    hint: ${r.hint}`);
    }
  }

  const mask = bitmaskOf(results);
  if (mask === 0) {
    log.ok("\nAll checks passed.");
  } else {
    throw new HarlessError(
      (EXIT.DOCTOR_BASE + mask) as any,
      `${results.filter(r => !r.ok).length} check(s) failed`,
    );
  }
}
