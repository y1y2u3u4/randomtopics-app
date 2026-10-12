// Build share cards (1200×630 JPEG) and page hero banners (WebP) for the
// random generator pages. Backgrounds are ChatGPT-made illustrations with an
// empty left side; all text is rendered here in HTML (never drawn by the
// image model) and captured with headless Chrome.
//
// Usage: node scripts/og/render-generator-og.mjs <dir with rt-og-<id>.png> [id ...]
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "../..");
const [srcDir, ...only] = process.argv.slice(2);
if (!srcDir) throw new Error("usage: render-generator-og.mjs <source dir> [id ...]");
const data = (f) => JSON.parse(readFileSync(join(root, "src/data/generators", f), "utf8"));
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const animals = data("animals.json"), lastNames = data("lastNames.json"), words = data("wordsEn.json"), wordsEs = data("wordsEs.json");
const dnd = data("dndNames.json"), viking = data("vikingNames.json"), chars = data("characterNames.json"), traits = data("characterTraits.json");
const gnome = data("gnomeNames.json"), foods = data("foods.json"), jp = data("japaneseNames.json"), team = data("teamWords.json");
const by = (list, key, value) => list.find((x) => x[key] === value) ?? list[0];

// Example chips use real entries from the banks so the card shows actual output.
const CARDS = [
  { id: "team", slug: "random-team-generator", title: "Random Team & Group Generator", line: "Fair, balanced teams in one click", chips: ["Team 1 · Ava, Diego, Finn", "Team 2 · Ben, Chloe, Hiro", `${team.adjectives[0].en} ${team.nouns[0].en}`] },
  { id: "team", slug: "es-generador-de-equipos-aleatorios", lang: "es", title: "Generador de Equipos y Grupos Aleatorios", line: "Equipos justos y equilibrados en un clic", chips: ["Equipo 1 · Ana, Diego, Félix", "Equipo 2 · Bruno, Carla, Hugo", `${team.nouns[0].es} ${team.adjectives[0].es[team.nouns[0].g]}`] },
  { id: "animal", slug: "random-animal-generator", title: "Random Animal Generator", line: "383 animals with pictures & fun facts", chips: ["axolotl", "red-fox", "narwhal"].map((id) => by(animals, "id", id).en) },
  { id: "animal", slug: "es-generador-de-animales-aleatorios", lang: "es", title: "Generador de Animales Aleatorios", line: "383 animales con dibujo y dato curioso", chips: ["axolotl", "red-fox", "narwhal"].map((id) => by(animals, "id", id).es) },
  { id: "lastname", slug: "last-name-generator", title: "Last Name Generator", line: "Real surnames from 22 cultures, with meanings", chips: [["Murphy", "Irish"], ["Tanaka", "Japanese"], ["Rossi", "Italian"]].map(([n, o]) => `${by(lastNames, "name", n).name} · ${o}`) },
  { id: "lastname", slug: "es-generador-de-apellidos", lang: "es", title: "Generador de Apellidos", line: "Apellidos reales de 22 culturas, con significado", chips: [["Murphy", "Irlandés"], ["Tanaka", "Japonés"], ["Rossi", "Italiano"]].map(([n, o]) => `${n} · ${o}`) },
  { id: "dnd", slug: "dnd-name-generator", title: "D&D Name Generator", line: "Fantasy names by race & gender", chips: ["elf", "dwarf", "tiefling"].map((r) => { const f = dnd.first.find((x) => x.race === r); const fam = dnd.family.find((x) => x.race === r); return `${f.name} ${fam.name}`; }) },
  { id: "viking", slug: "viking-name-generator", title: "Viking Name Generator", line: "Old Norse names, patronymics & bynames", chips: [`${by(viking.names, "ascii", "Bjorn").ascii} Haraldsson ${viking.bynames[0].text}`, `${by(viking.names, "ascii", "Sigrid").ascii} Haraldsdottir`, `${by(viking.names, "ascii", "Ragnar").ascii} ${viking.bynames.find((b) => b.text.startsWith("the")).text}`] },
  { id: "charactername", slug: "character-name-generator", title: "Character Name Generator", line: "Names for fantasy, sci-fi, modern & historical stories", chips: ["fantasy", "scifi", "modern"].map((g, i) => { const f = chars.first.filter((x) => x.genres.includes(g) && x.genres.length === 1); const l = chars.last.filter((x) => x.genres.includes(g) && x.genres.length === 1); return `${f[i * 3 % f.length].name} ${l[i * 2 % l.length].name}`; }) },
  { id: "character", slug: "random-character-generator", title: "Random Character Generator", line: "Name, personality, motivation & a secret", chips: [traits.occupation[0], traits.personality[0], [...traits.secret].sort((a, b) => a.length - b.length)[0]] },
  { id: "gnome", slug: "gnome-name-generator", title: "Gnome Name Generator", line: "Gnome names, nicknames & clan names", chips: [0, 1, 2].map((i) => `${gnome.first[i * 7].name} "${gnome.nicknames[i * 5].name}" ${gnome.clans[i * 3].name}`) },
  { id: "food", slug: "random-food-generator", title: "Random Food Generator", line: "What should I eat today? 391 real dishes", chips: ["pad-thai", "shakshuka", "chicken-adobo"].map((id) => by(foods, "id", id).name) },
  { id: "letter", slug: "random-letter-generator", title: "Random Letter Generator", line: "Pick a letter A–Z, no repeats", chips: ["K · Kilo", "M · Mike", "S · Sierra"] },
  { id: "word", slug: "random-word-generator", title: "Random Word Generator", line: "Nouns, verbs & adjectives by difficulty", chips: ["lighthouse", "giraffe", "ephemeral"].map((w) => by(words, "w", w).w) },
  { id: "word", slug: "es-generador-de-palabras-aleatorias", lang: "es", title: "Generador de Palabras Aleatorias", line: "Sustantivos, verbos y adjetivos por dificultad", chips: ["mariposa", "paraguas", "efímero"].map((w) => by(wordsEs, "w", w).w) },
  { id: "japanese", slug: "japanese-name-generator", title: "Japanese Name Generator", line: "Kanji, kana, romaji & meanings", chips: [["Haruto", "Tanaka"], ["Yui", "Sato"], ["Ren", "Kurosawa"]].map(([g, f]) => { const gg = jp.given.find((x) => x.romaji === g) ?? jp.given[0]; const ff = jp.family.find((x) => x.romaji === f) ?? jp.family[0]; return `${ff.kanji}${gg.kanji} · ${gg.romaji} ${ff.romaji}`; }) },
  { id: "color", slug: "random-color-generator", title: "Random Color Generator", line: "HEX, RGB & HSL palettes — lock & copy", chips: ["#F98743", "#39ABBC", "#AADE68"], swatches: true },
  // My 9 pages: no illustration, a code-drawn 3×3 mosaic (real covers are not site art).
  { id: "my9", slug: "my-9-albums", title: "My 9 Albums", line: "Your 3×3 album grid — free, no watermark", chips: ["Search any album", "Tap 9 covers", "Download PNG"], mosaic: true },
  { id: "my9", slug: "my-9-games", title: "My 9 Games", line: "Your 3×3 favorite games grid — free", chips: ["Console, PC & retro", "Tap 9 covers", "Download PNG"], mosaic: true },
  { id: "my9", slug: "my-9-anime", title: "My 9 Anime", line: "Your 3×3 favorite anime grid — free", chips: ["Series & films", "Tap 9 posters", "Download PNG"], mosaic: true },
  { id: "my9", slug: "my-9-grid", title: "My 9 Grid Maker", line: "Any 9 pictures in one 3×3 image", chips: ["Movies, books, foods…", "Stays in your browser", "No watermark"], mosaic: true },
  { id: "map", slug: "fantasy-map-maker", title: "Fantasy Map Maker", line: "Random fantasy worlds — download PNG", chips: ["Continent", "Islands", "Parchment"] },
];

const MOSAIC_COLORS = ["#F7C9B6", "#BFE3DA", "#F6E3A6", "#D5CCF2", "#F4B9C8", "#BCD7F2", "#CDE8B9", "#F9D7A8", "#E3D0C2"];
const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function cardHtml(card, bgPath) {
  const chips = card.chips.map((c) => card.swatches
    ? `<li><i style="background:${c}"></i>${escape(c)}</li>`
    : `<li>${escape(c)}</li>`).join("");
  return `<!doctype html><html lang="${card.lang ?? "en"}"><head><meta charset="utf-8"><style>
  *{margin:0;box-sizing:border-box} body{width:1200px;height:630px;overflow:hidden;font-family:"Avenir Next","Hiragino Sans","Helvetica Neue",Arial,sans-serif;background:#F3EFE6}
  .bg{position:absolute;inset:0;background:url("file://${bgPath}") right center/auto 100% no-repeat}
  .fade{position:absolute;inset:0;background:linear-gradient(90deg,#F3EFE6 0%,#F3EFE6 34%,rgba(243,239,230,0.85) 48%,rgba(243,239,230,0) 64%)}
  .text{position:absolute;left:64px;top:0;bottom:0;width:600px;display:flex;flex-direction:column;justify-content:center;color:#1f2433}
  .brand{font-size:24px;font-weight:700;letter-spacing:.02em;color:#6b5bd2;margin-bottom:22px}
  h1{font-size:${card.title.length > 30 ? 52 : 62}px;line-height:1.05;font-weight:800;letter-spacing:-.01em}
  p{font-size:28px;line-height:1.3;margin-top:18px;color:#454b5c}
  ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:12px;margin-top:30px}
  li{display:inline-flex;align-items:center;gap:12px;align-self:flex-start;background:#fff;border:2px solid #e3ddcf;border-radius:14px;padding:10px 18px;font-size:24px;font-weight:600;color:#2b3040;box-shadow:0 2px 0 #e3ddcf}
  li i{width:26px;height:26px;border-radius:7px;display:inline-block}
  .mosaic{position:absolute;right:64px;top:50%;transform:translateY(-50%);display:grid;grid-template-columns:repeat(3,146px);gap:14px}
  .mosaic b{height:146px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:64px;font-weight:800;color:rgba(31,36,51,.55);box-shadow:0 3px 0 rgba(0,0,0,.08)}
  </style></head><body>${card.mosaic
    ? `<div class="mosaic">${MOSAIC_COLORS.map((c, i) => `<b style="background:${c}">${i + 1}</b>`).join("")}</div>`
    : `<div class="bg"></div><div class="fade"></div>`}<div class="text">
  <div class="brand">🎲 RandomTopics.app</div><h1>${escape(card.title)}</h1><p>${escape(card.line)}</p><ul>${chips}</ul></div></body></html>`;
}

const ogDir = join(root, "public/og");
const heroDir = join(root, "public/generators/hero");
mkdirSync(ogDir, { recursive: true });
mkdirSync(heroDir, { recursive: true });
const work = mkdtempSync(join(tmpdir(), "rt-og-"));
const profile = mkdtempSync(join(tmpdir(), "rt-og-chrome-"));

// Headless Chrome writes the screenshot but sometimes never exits, so wait for
// the file and then stop the process.
async function screenshot(html, shot) {
  const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--user-data-dir=${profile}`, "--allow-file-access-from-files",
    "--window-size=1200,630", `--screenshot=${shot}`, `file://${html}`], { stdio: "ignore" });
  const exited = new Promise((r) => chrome.on("exit", r));
  for (let i = 0; i < 300 && !existsSync(shot); i++) await new Promise((r) => setTimeout(r, 100));
  await new Promise((r) => setTimeout(r, 500));
  chrome.kill();
  await exited;
  if (!existsSync(shot)) throw new Error(`no screenshot for ${html}`);
}

for (const card of CARDS) {
  if (only.length && !only.includes(card.id)) continue;
  const src = join(resolve(srcDir), `rt-og-${card.id}.png`);
  if (!card.mosaic && !existsSync(src)) { console.log(`skip ${card.slug}: no background`); continue; }
  const html = join(work, `${card.slug}.html`);
  const shot = join(work, `${card.slug}.png`);
  writeFileSync(html, cardHtml(card, src));
  await screenshot(html, shot);
  await sharp(shot).resize(1200, 630).jpeg({ quality: 84, mozjpeg: true }).toFile(join(ogDir, `${card.slug}.jpg`));
  console.log(`og ${card.slug}.jpg`);
}

// Hero banners: the illustration with its empty cream margin trimmed, at most
// 960×400, WebP. Sizes go to heroImages.json so the <img> reserves its box.
const HEROES = ["dnd", "viking", "japanese", "gnome", "charactername", "character"];
const sizesPath = join(root, "src/data/generators/heroImages.json");
const sizes = existsSync(sizesPath) ? JSON.parse(readFileSync(sizesPath, "utf8")) : {};
for (const id of HEROES) {
  if (only.length && !only.includes(id)) continue;
  const src = join(resolve(srcDir), `rt-og-${id}.png`);
  if (!existsSync(src)) continue;
  const cream = { r: 243, g: 239, b: 230, alpha: 1 };
  // Drop the left side (kept nearly empty for the card title) before trimming.
  const meta = await sharp(src).metadata();
  const left = Math.round(meta.width * 0.38);
  const right = await sharp(src).extract({ left, top: 0, width: meta.width - left, height: meta.height }).toBuffer();
  const trimmed = await sharp(right).trim({ background: cream, threshold: 28 }).toBuffer();
  const info = await sharp(trimmed)
    .resize(960, 400, { fit: "inside" })
    .flatten({ background: cream })
    .webp({ quality: 76 })
    .toFile(join(heroDir, `${id}.webp`));
  sizes[`/generators/hero/${id}.webp`] = { width: info.width, height: info.height };
  console.log(`hero ${id}.webp ${info.width}x${info.height}`);
}
writeFileSync(sizesPath, `${JSON.stringify(sizes, null, 2)}\n`);
