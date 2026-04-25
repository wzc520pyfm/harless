import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "../src/templates");
const DST = path.resolve(__dirname, "../dist/templates");

function cp(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

function walk(dir, base = dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base);
    else cp(p, path.join(DST, path.relative(base, p)));
  }
}

if (fs.existsSync(SRC)) {
  fs.rmSync(DST, { recursive: true, force: true });
  walk(SRC);
  console.log("✓ templates copied to dist/templates");
} else {
  console.warn("⚠ no templates dir yet");
}
