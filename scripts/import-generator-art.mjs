// Slice a ChatGPT-made 4×4 (or N×N) sprite sheet into one WebP per item and
// register the ids in src/data/generators/<set>Images.json.
// Usage: [ART_SET=foods] node scripts/import-generator-art.mjs <sheet.png> <cols> <id1,id2,...>
// ART_SET defaults to "animals" (bank animals.json); "foods" uses foods.json.
// Ids are listed left-to-right, top-to-bottom; use "-" to skip a bad cell.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const [sheet, colsArg, idsArg] = process.argv.slice(2);
if (!sheet || !colsArg || !idsArg) {
  console.error("usage: node scripts/import-generator-art.mjs <sheet.png> <cols> <id1,id2,...>");
  process.exit(1);
}
const root = resolve(import.meta.dirname, "..");
const set = process.env.ART_SET === "foods" ? "foods" : "animals";
const singular = set === "foods" ? "food" : "animal";
const bank = JSON.parse(readFileSync(resolve(root, `src/data/generators/${set}.json`), "utf8"));
const known = new Set(bank.map((a) => a.id));
const ids = idsArg.split(",").map((s) => s.trim());
for (const id of ids) if (id !== "-" && !known.has(id)) throw new Error(`unknown ${singular} id: ${id}`);

const cols = Number(colsArg);
// ChatGPT sheets are square grids even when the last one is only partly filled.
const rows = Math.max(cols, Math.ceil(ids.length / cols));
const { data, info } = await sharp(sheet).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

// ChatGPT's grids are close to, but not exactly, equal. Find the real white
// gutters: the line (row or column) near each expected boundary with the most
// pure-white pixels. Falls back to the even split when no gutter is visible.
const whiteness = (horizontal, index) => {
  let white = 0;
  const span = horizontal ? width : height;
  for (let k = 0; k < span; k += 2) {
    const x = horizontal ? k : index;
    const y = horizontal ? index : k;
    const o = (y * width + x) * 3;
    if (data[o] > 249 && data[o + 1] > 249 && data[o + 2] > 249) white++;
  }
  return white / Math.ceil(span / 2);
};
// Returns cell spans [start, end) that exclude the white gutter lines.
const boundaries = (count, size, horizontal) => {
  const step = size / count;
  const radius = Math.round(step * 0.12);
  const gutters = [];
  for (let b = 1; b < count; b++) {
    const expected = Math.round(b * step);
    let best = expected;
    let bestScore = -1;
    for (let at = expected - radius; at <= expected + radius; at++) {
      const score = whiteness(horizontal, at);
      if (score > bestScore) { best = at; bestScore = score; }
    }
    if (bestScore < 0.9) { gutters.push({ from: expected, to: expected }); continue; }
    let from = best, to = best;
    while (from > 0 && whiteness(horizontal, from - 1) > 0.9) from--;
    while (to < size - 1 && whiteness(horizontal, to + 1) > 0.9) to++;
    gutters.push({ from, to });
  }
  const spans = [];
  for (let c = 0; c < count; c++) {
    const start = c === 0 ? 0 : gutters[c - 1].to + 1;
    const end = c === count - 1 ? size : gutters[c].from;
    spans.push([start, end]);
  }
  return spans;
};
const ys = boundaries(rows, height, true);
const xs = boundaries(cols, width, false);
const outDir = resolve(root, `public/generators/${set}`);
mkdirSync(outDir, { recursive: true });

const indexPath = resolve(root, `src/data/generators/${singular}Images.json`);
const index = new Set(JSON.parse(readFileSync(indexPath, "utf8")));
for (let i = 0; i < ids.length; i++) {
  if (ids[i] === "-") continue;
  const c = i % cols;
  const r = Math.floor(i / cols);
  const [x0, x1] = xs[c];
  const [y0, y1] = ys[r];
  // Square crop centred in the cell, trimmed just past the gutter.
  const pad = Math.round(Math.min(x1 - x0, y1 - y0) * 0.01);
  const size = Math.min(x1 - x0, y1 - y0) - pad * 2;
  const left = Math.round(x0 + (x1 - x0 - size) / 2);
  const top = Math.round(y0 + (y1 - y0 - size) / 2);
  await sharp(sheet)
    .extract({ left, top, width: size, height: size })
    .resize(384, 384)
    .webp({ quality: 78 })
    .toFile(resolve(outDir, `${ids[i]}.webp`));
  index.add(ids[i]);
}
writeFileSync(indexPath, `${JSON.stringify([...index].sort(), null, 0)}\n`);
console.log(`imported ${ids.filter((x) => x !== "-").length} → ${index.size} ${set} with art`);
