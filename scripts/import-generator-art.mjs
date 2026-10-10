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
const rows = Math.ceil(ids.length / cols);
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
const boundaries = (count, size, horizontal) => {
  const step = size / count;
  const cuts = [0];
  for (let b = 1; b < count; b++) {
    const expected = Math.round(b * step);
    const radius = Math.round(step * 0.08);
    let best = { at: expected, score: 0, from: expected, to: expected };
    for (let at = expected - radius; at <= expected + radius; at++) {
      const score = whiteness(horizontal, at);
      if (score > best.score + 0.001) best = { at, score, from: at, to: at };
      else if (Math.abs(score - best.score) <= 0.001 && at === best.to + 1) best.to = at;
    }
    cuts.push(best.score > 0.6 ? Math.round((best.from + best.to) / 2) : expected);
  }
  cuts.push(size);
  return cuts;
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
  const x0 = xs[c], x1 = xs[c + 1], y0 = ys[r], y1 = ys[r + 1];
  // Square crop centred in the cell, trimmed just past the gutter.
  const pad = Math.round(Math.min(x1 - x0, y1 - y0) * 0.015);
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
