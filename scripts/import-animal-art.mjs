// Slice a ChatGPT-made 4×4 (or N×N) animal sprite sheet into one WebP per
// animal and register the ids in src/data/generators/animalImages.json.
// Usage: node scripts/import-animal-art.mjs <sheet.png> <cols> <id1,id2,...>
// Ids are listed left-to-right, top-to-bottom; use "-" to skip a bad cell.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const [sheet, colsArg, idsArg] = process.argv.slice(2);
if (!sheet || !colsArg || !idsArg) {
  console.error("usage: node scripts/import-animal-art.mjs <sheet.png> <cols> <id1,id2,...>");
  process.exit(1);
}
const root = resolve(import.meta.dirname, "..");
const animals = JSON.parse(readFileSync(resolve(root, "src/data/generators/animals.json"), "utf8"));
const known = new Set(animals.map((a) => a.id));
const ids = idsArg.split(",").map((s) => s.trim());
for (const id of ids) if (id !== "-" && !known.has(id)) throw new Error(`unknown animal id: ${id}`);

const cols = Number(colsArg);
const rows = Math.ceil(ids.length / cols);
const { width, height } = await sharp(sheet).metadata();
const cw = width / cols;
const ch = height / rows;
// Trim a little inside each cell so gutters never show at the edges.
const inset = Math.round(Math.min(cw, ch) * 0.03);
const outDir = resolve(root, "public/generators/animals");
mkdirSync(outDir, { recursive: true });

const indexPath = resolve(root, "src/data/generators/animalImages.json");
const index = new Set(JSON.parse(readFileSync(indexPath, "utf8")));
for (let i = 0; i < ids.length; i++) {
  if (ids[i] === "-") continue;
  const left = Math.round((i % cols) * cw) + inset;
  const top = Math.round(Math.floor(i / cols) * ch) + inset;
  const size = Math.floor(Math.min(cw, ch)) - inset * 2;
  await sharp(sheet)
    .extract({ left, top, width: size, height: size })
    .resize(384, 384)
    .webp({ quality: 78 })
    .toFile(resolve(outDir, `${ids[i]}.webp`));
  index.add(ids[i]);
}
writeFileSync(indexPath, `${JSON.stringify([...index].sort(), null, 0)}\n`);
console.log(`imported ${ids.filter((x) => x !== "-").length} → ${index.size} animals with art`);
