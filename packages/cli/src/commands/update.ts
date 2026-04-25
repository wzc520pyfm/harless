import fs from "node:fs";
import path from "node:path";
import { parseConfig, stringifyConfig } from "../lib/config.js";
import { sha256 } from "../lib/hash.js";
import { decideUpdateAction } from "../lib/decide-update-action.js";
import { loadManifest, loadAgentsMdBlock, rewriteAgentsMd, distTemplateRoot } from "../lib/installer.js";
import { log } from "../lib/logger.js";
import { precondition, conflict as conflictErr } from "../lib/errors.js";
import type { Flags } from "../cli.js";

export async function updateCmd(flags: Flags) {
  const cwd = process.cwd();
  const configPath = path.join(cwd, ".harness/config.json");
  if (!fs.existsSync(configPath)) {
    throw precondition("no .harness/config.json found — run `harless init` first");
  }

  const config = parseConfig(fs.readFileSync(configPath, "utf8"));
  const tplRoot = distTemplateRoot();
  const manifest = loadManifest(tplRoot);
  let conflicts = 0;
  const summary: { file: string; action: string }[] = [];

  for (const [mod, mc] of Object.entries(config.modules)) {
    if (!mc.enabled || !mc.files) continue;
    const mDef = manifest[mod];
    if (!mDef) continue;

    for (const rel of mDef.files) {
      const dst = path.join(cwd, ".harness", rel);
      const src = path.join(tplRoot, "modules", mod, rel);
      if (!fs.existsSync(src)) continue;

      const newContent = fs.readFileSync(src, "utf8");
      const newHash = sha256(newContent);
      const entry = mc.files.find(f => f.path === `.harness/${rel}`);
      const oldHash = entry?.hash ?? "";
      const diskContent = fs.existsSync(dst) ? fs.readFileSync(dst, "utf8") : null;
      const diskHash = diskContent !== null ? sha256(diskContent) : null;

      const action = decideUpdateAction({
        diskExists: diskContent !== null,
        diskHash,
        oldTemplateHash: oldHash,
        newTemplateHash: newHash,
      });

      switch (action) {
        case "keep":
          summary.push({ file: `.harness/${rel}`, action: "keep" });
          break;
        case "overwrite":
          fs.mkdirSync(path.dirname(dst), { recursive: true });
          fs.writeFileSync(dst, newContent);
          if (rel.endsWith(".sh")) fs.chmodSync(dst, 0o755);
          if (entry) entry.hash = newHash;
          summary.push({ file: `.harness/${rel}`, action: "overwritten" });
          break;
        case "recreate":
          fs.mkdirSync(path.dirname(dst), { recursive: true });
          fs.writeFileSync(dst, newContent);
          if (rel.endsWith(".sh")) fs.chmodSync(dst, 0o755);
          if (entry) entry.hash = newHash;
          else mc.files.push({ path: `.harness/${rel}`, hash: newHash });
          summary.push({ file: `.harness/${rel}`, action: "recreated" });
          break;
        case "conflict":
          conflicts++;
          summary.push({ file: `.harness/${rel}`, action: "CONFLICT (user-modified + template changed)" });
          break;
      }
    }
  }

  fs.writeFileSync(configPath, stringifyConfig(config));
  rewriteAgentsMd(cwd, loadAgentsMdBlock(tplRoot));

  for (const s of summary) {
    const icon = s.action.startsWith("CONFLICT") ? "⚠" : "✓";
    log.dim(`  ${icon} ${s.action.padEnd(40)} ${s.file}`);
  }

  if (conflicts > 0) {
    log.warn(`${conflicts} conflict(s) — resolve manually, then re-run update`);
    if (flags.yes) throw conflictErr(`${conflicts} file(s) in conflict; non-interactive mode aborts`);
  } else {
    log.ok("update complete");
  }
}
