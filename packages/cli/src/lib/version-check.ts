import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const CACHE = path.join(os.homedir(), ".cache", "harless", "version-check.json");
const TTL_MS = 24 * 60 * 60 * 1000;

export async function latestVersion(opts: {
  offline: boolean;
  now?: number;
  fetchImpl?: typeof fetch;
  cachePath?: string;
}): Promise<string | null> {
  if (opts.offline) return null;
  const now = opts.now ?? Date.now();
  const cp = opts.cachePath ?? CACHE;
  if (fs.existsSync(cp)) {
    try {
      const c = JSON.parse(fs.readFileSync(cp, "utf8"));
      if (now - c.checkedAt < TTL_MS) return c.version ?? null;
    } catch {
      /* ignore corrupt cache */
    }
  }
  const f = opts.fetchImpl ?? fetch;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 1000);
  try {
    const res = await f("https://registry.npmjs.org/harless/latest", { signal: ctrl.signal });
    if (!res.ok) return null;
    const j: any = await res.json();
    fs.mkdirSync(path.dirname(cp), { recursive: true });
    fs.writeFileSync(cp, JSON.stringify({ checkedAt: now, version: j.version }));
    return j.version;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
