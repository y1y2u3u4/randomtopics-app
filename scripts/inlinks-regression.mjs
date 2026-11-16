// After `npm run build`: every sitemap URL must be linked from at least MIN other prerendered pages.
// Pages that Google reports as "Discovered / unknown" are almost always under-linked. Usage: node scripts/inlinks-regression.mjs [min=3]
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const MIN = Number(process.argv[2] ?? 3);
const root = ".next/server/app";
const norm = (p) => p.replace(/\/+$/, "") || "/";
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : []; });
const inlinks = new Map();
for (const f of walk(root)) {
  const self = norm(f.slice(root.length, -5).replace(/\/index$/, ""));
  if (self.startsWith("/_")) continue;
  for (const m of readFileSync(f, "utf8").matchAll(/href="(\/[^"#?]*)"/g)) {
    const to = norm(m[1]);
    if (to !== self) (inlinks.get(to) ?? inlinks.set(to, new Set()).get(to)).add(self);
  }
}
const xml = readFileSync(join(root, "sitemap.xml.body"), "utf8");
const urls = [...xml.matchAll(/<loc>https:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => norm(m[1]));
const weak = urls.filter((u) => (inlinks.get(u)?.size ?? 0) < MIN).map((u) => `${inlinks.get(u)?.size ?? 0} ${u}`);
console.log(`${urls.length} sitemap URLs, min inlinks ${MIN}, weak: ${weak.length}`);
if (weak.length) { console.log(weak.join("\n")); process.exit(1); }
