// Vercel cost (2026-10-27): ad pages hand navigation to a fresh document
// (AdDocumentBoundary), so Link viewport prefetches were wasted requests.
// Every Link must opt out explicitly.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const files = [];
(function walk(dir) { for (const name of readdirSync(dir)) { const p = join(dir, name); statSync(p).isDirectory() ? walk(p) : /\.tsx$/.test(p) && files.push(p); } })("src");
const missing = [];
for (const file of files) {
  const source = readFileSync(file, "utf8").replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  for (const match of source.matchAll(/<Link\b[^>]*>/g)) if (!match[0].includes("prefetch={false}")) missing.push(`${file}:${source.slice(0, match.index).split("\n").length}`);
}
if (missing.length) { console.error("Link without prefetch={false}:\n" + missing.join("\n")); process.exit(1); }
console.log(`PASS: ${files.length} TSX files, every Link opts out of prefetch.`);
