// Unit tests for the random generator pages: team splitting (even sizes,
// balanced tags/levels, locks), no-repeat drawing, filters and data banks.
// Run: npm run generators:test
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
const dataDir = resolve(root, "src/data/generators");
const json = Object.fromEntries(
  readdirSync(dataDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => [`@/data/generators/${f}`, JSON.parse(readFileSync(resolve(dataDir, f), "utf8"))]),
);
const overrides = { ...json };
const rg = load("src/lib/randomGenerators.ts", overrides);
const cache = new Map();
const mod = (file) => load(file, overrides, cache);

let passed = 0;
const test = (name, fn) => {
  try {
    fn();
    passed++;
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
};

const people = (n, tagFn, levelFn) =>
  Array.from({ length: n }, (_, i) => ({ id: `p${i}`, name: `P${i}`, tag: tagFn?.(i), level: levelFn?.(i) }));
const sizes = (teams) => teams.map((t) => t.length);
const spread = (xs) => Math.max(...xs) - Math.min(...xs);

/* ---------------- team splitting ---------------- */

test("every person is placed exactly once and sizes differ by at most one", () => {
  for (let seed = 1; seed <= 400; seed++) {
    const rng = rg.createRng(seed);
    const n = 2 + Math.floor(rng() * 60);
    const k = 1 + Math.floor(rng() * 10);
    const ppl = people(n);
    const teams = rg.makeTeams(ppl, { mode: "teams", value: k }, rg.createRng(seed * 7));
    assert.equal(teams.length, Math.min(k, n));
    const ids = teams.flat().map((p) => p.id).sort();
    assert.deepEqual(ids, ppl.map((p) => p.id).sort());
    assert.ok(spread(sizes(teams)) <= 1, `sizes ${sizes(teams)} for n=${n} k=${k}`);
  }
});

test("people-per-team mode computes the team count", () => {
  assert.equal(rg.teamCountFor(23, { mode: "size", value: 4 }), 6);
  assert.equal(rg.teamCountFor(24, { mode: "size", value: 4 }), 6);
  assert.equal(rg.teamCountFor(5, { mode: "teams", value: 9 }), 5);
  assert.deepEqual(sizes(rg.makeTeams(people(23), { mode: "teams", value: 4 }, rg.createRng(3))).sort(), [5, 6, 6, 6]);
  const bySize = rg.makeTeams(people(10), { mode: "size", value: 3 }, rg.createRng(1));
  assert.equal(bySize.length, 4);
  assert.ok(spread(sizes(bySize)) <= 1);
});

test("balanced tags are spread evenly across teams", () => {
  for (let seed = 1; seed <= 300; seed++) {
    const rng = rg.createRng(seed);
    const n = 4 + Math.floor(rng() * 40);
    const k = 2 + Math.floor(rng() * 5);
    const tags = ["girl", "boy", "other", undefined];
    const ppl = people(n, () => tags[Math.floor(rng() * (rng() < 0.85 ? 2 : 4))]);
    const teams = rg.makeTeams(ppl, { mode: "teams", value: k, balanceTag: true }, rg.createRng(seed + 99));
    assert.ok(spread(sizes(teams)) <= 1);
    for (const tag of ["girl", "boy"]) {
      const counts = teams.map((t) => t.filter((p) => p.tag === tag).length);
      assert.ok(spread(counts) <= 1, `tag ${tag} counts ${counts} (n=${n}, k=${k}, seed=${seed})`);
    }
  }
});

test("balanced skill levels keep team strength totals close", () => {
  for (let seed = 1; seed <= 300; seed++) {
    const rng = rg.createRng(seed);
    const n = 6 + Math.floor(rng() * 30);
    const k = 2 + Math.floor(rng() * 4);
    const ppl = people(n, undefined, () => 1 + Math.floor(rng() * 5));
    const teams = rg.makeTeams(ppl, { mode: "teams", value: k, balanceLevel: true }, rg.createRng(seed + 5));
    const totals = teams.map((t) => t.reduce((s, p) => s + p.level, 0));
    assert.ok(spread(sizes(teams)) <= 1);
    assert.ok(spread(totals) <= 5, `totals ${totals}`);
  }
});

test("balanced tag + level together keep tags even", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const rng = rg.createRng(seed);
    const ppl = people(8 + Math.floor(rng() * 24), () => (rng() < 0.5 ? "girl" : "boy"), () => 1 + Math.floor(rng() * 5));
    const teams = rg.makeTeams(ppl, { mode: "teams", value: 3, balanceTag: true, balanceLevel: true }, rg.createRng(seed));
    for (const tag of ["girl", "boy"]) assert.ok(spread(teams.map((t) => t.filter((p) => p.tag === tag).length)) <= 1);
  }
});

test("locked people stay on their team and the rest still balance", () => {
  const ppl = people(20);
  const locks = { p0: 0, p1: 0, p5: 2, p19: 3 };
  for (let seed = 1; seed <= 200; seed++) {
    const teams = rg.makeTeams(ppl, { mode: "teams", value: 4, locks }, rg.createRng(seed));
    for (const [id, idx] of Object.entries(locks)) assert.ok(teams[idx].some((p) => p.id === id), `${id} locked to ${idx}`);
    assert.deepEqual(sizes(teams), [5, 5, 5, 5]);
    assert.equal(new Set(teams.flat().map((p) => p.id)).size, 20);
  }
  // A lock pointing at a team that no longer exists is ignored, not lost.
  const teams = rg.makeTeams(people(6), { mode: "teams", value: 2, locks: { p0: 5 } }, rg.createRng(1));
  assert.equal(teams.flat().length, 6);
});

test("same seed gives the same teams; different seeds differ", () => {
  const a = rg.makeTeams(people(12), { mode: "teams", value: 3 }, rg.createRng(42)).map((t) => t.map((p) => p.id));
  const b = rg.makeTeams(people(12), { mode: "teams", value: 3 }, rg.createRng(42)).map((t) => t.map((p) => p.id));
  const c = rg.makeTeams(people(12), { mode: "teams", value: 3 }, rg.createRng(43)).map((t) => t.map((p) => p.id));
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
});

test("pasted name lists are parsed from lines, commas and numbered lists", () => {
  assert.deepEqual(rg.parseNames("Ava\nBen\n\n  Chloe  "), ["Ava", "Ben", "Chloe"]);
  assert.deepEqual(rg.parseNames("Ava, Ben,Chloe ; Diego"), ["Ava", "Ben", "Chloe", "Diego"]);
  assert.deepEqual(rg.parseNames("1. Ava\n2) Ben\n- Chloe\n• Diego"), ["Ava", "Ben", "Chloe", "Diego"]);
  assert.equal(rg.parseNames(Array.from({ length: 900 }, (_, i) => `N${i}`).join("\n")).length, 500);
});

test("share payloads round-trip through base64url, including accents", () => {
  const text = JSON.stringify({ names: ["José", "Zoë", "李雷"], teams: [[0, 2], [1]] });
  const encoded = rg.toBase64Url(text);
  assert.match(encoded, /^[A-Za-z0-9_-]+$/);
  assert.equal(rg.fromBase64Url(encoded), text);
  assert.equal(rg.fromBase64Url("%%%"), null);
});

/* ---------------- no-repeat drawing ---------------- */

test("drawUnique never repeats until the pool is exhausted", () => {
  const pool = Array.from({ length: 10 }, (_, i) => `x${i}`);
  const rng = rg.createRng(7);
  let used = [];
  const seen = [];
  for (let i = 0; i < 3; i++) {
    const out = rg.drawUnique(pool, 3, (x) => x, used, rng);
    assert.equal(out.picks.length, 3);
    seen.push(...out.picks);
    used = out.used;
  }
  assert.equal(new Set(seen).size, 9);
  const last = rg.drawUnique(pool, 3, (x) => x, used, rng);
  assert.equal(last.cycled, true);
  assert.equal(new Set(last.picks).size, 3, "no duplicates inside one draw");
  const missing = pool.find((x) => !seen.includes(x));
  assert.ok(last.picks.includes(missing), "the unseen item comes first after a cycle");
  assert.deepEqual(rg.drawUnique(pool, 50, (x) => x, [], rng).picks.length, 10);
  assert.deepEqual(rg.drawUnique([], 3, (x) => x, [], rng).picks, []);
});

test("filterBy treats an empty selection as all and ORs within a group", () => {
  const items = [{ t: ["a"] }, { t: ["b"] }, { t: ["a", "c"] }];
  assert.equal(rg.filterBy(items, [], (x) => x.t).length, 3);
  assert.equal(rg.filterBy(items, ["c"], (x) => x.t).length, 1);
  assert.equal(rg.filterBy(items, ["b", "c"], (x) => x.t).length, 2);
});

/* ---------------- generators + data banks ---------------- */

function checkGenerator(name, gen, filterCases, minPool = 300, distinct = gen.poolSize({})) {
  const all = gen.poolSize({});
  assert.ok(all >= minPool, `${name}: pool ${all} < ${minPool}`);
  // Draw the whole pool in chunks: no repeats, every result resolvable.
  let used = [];
  const keys = new Set();
  let seed = 1;
  const target = Math.min(distinct, 2000);
  while (keys.size < target) {
    const out = gen.generate({}, Math.min(20, target - keys.size), used, seed++);
    for (const r of out.results) {
      assert.ok(!keys.has(r.key), `${name}: repeated ${r.key}`);
      keys.add(r.key);
      assert.ok(r.title && !/undefined/.test(r.title + (r.subtitle ?? "") + (r.detail ?? "")), `${name}: bad result ${JSON.stringify(r)}`);
      assert.deepEqual(gen.resolve(r.key, {}), r, `${name}: resolve(${r.key})`);
    }
    used = out.used;
    if (out.results.length === 0) break;
  }
  assert.deepEqual(gen.generate({}, 5, [], 123).results, gen.generate({}, 5, [], 123).results, `${name}: deterministic by seed`);
  for (const [filters, check] of filterCases) {
    const size = gen.poolSize(filters);
    assert.ok(size > 0, `${name}: filters ${JSON.stringify(filters)} empty`);
    const out = gen.generate(filters, 30, [], 9);
    assert.ok(out.results.length > 0);
    for (const r of out.results) assert.ok(check(r), `${name}: ${r.key} breaks ${JSON.stringify(filters)}`);
  }
}

test("animal generator: ≥300 animals, filters respected, en + es complete", () => {
  const { ANIMALS, animalGenerator } = mod("src/lib/generators/animals.ts");
  const byId = new Map(ANIMALS.map((a) => [a.id, a]));
  assert.equal(byId.size, ANIMALS.length, "unique ids");
  for (const a of ANIMALS) assert.ok(a.en && a.es && a.fact.en && a.fact.es, `incomplete ${a.id}`);
  for (const locale of ["en", "es"]) {
    checkGenerator(`animals-${locale}`, animalGenerator(locale), [
      [{ where: ["ocean"] }, (r) => byId.get(r.key).habitats.includes("ocean")],
      [{ type: ["mammal"] }, (r) => byId.get(r.key).class === "mammal"],
      [{ type: ["bird"], level: ["kids"] }, (r) => byId.get(r.key).class === "bird" && byId.get(r.key).kids],
      [{ where: ["farm", "pet"] }, (r) => ["farm", "pet"].some((h) => byId.get(r.key).habitats.includes(h))],
    ]);
  }
  assert.equal(animalGenerator("es").generate({}, 1, [], 5).results[0].title, byId.get(animalGenerator("es").generate({}, 1, [], 5).results[0].key).es);
});

test("last name generator: ≥300 surnames with meanings, origin filter respected", () => {
  const { LAST_NAMES, lastNameGenerator, ORIGIN_LABELS } = mod("src/lib/generators/lastNames.ts");
  const byName = new Map(LAST_NAMES.map((n) => [n.name, n]));
  assert.equal(byName.size, LAST_NAMES.length);
  for (const n of LAST_NAMES) {
    assert.ok(ORIGIN_LABELS[n.origin], `unknown origin ${n.origin}`);
    assert.ok(n.meaning.en && n.meaning.es, `meaning missing for ${n.name}`);
  }
  for (const locale of ["en", "es"]) {
    checkGenerator(`lastnames-${locale}`, lastNameGenerator(locale), [
      [{ origin: ["japanese"] }, (r) => byName.get(r.key).origin === "japanese"],
      [{ origin: ["irish", "italian"] }, (r) => ["irish", "italian"].includes(byName.get(r.key).origin)],
    ]);
  }
});

test("team names are distinct and well-formed in both languages", () => {
  const { makeTeamNames } = mod("src/lib/generators/teamNames.ts");
  for (const locale of ["en", "es"]) {
    for (let seed = 1; seed <= 50; seed++) {
      const names = makeTeamNames(12, locale, rg.createRng(seed));
      assert.equal(new Set(names).size, 12);
      for (const n of names) assert.match(n, /^\S+( \S+)+$/u);
    }
  }
});

test("D&D names: ≥300 first names, family name matches race, filters respected", () => {
  const { DND_FIRST, DND_FAMILY, dndGenerator, RACES } = mod("src/lib/generators/dnd.ts");
  assert.ok(DND_FIRST.length >= 300);
  const raceIds = new Set(RACES.map((r) => r.id));
  for (const f of [...DND_FIRST, ...DND_FAMILY]) assert.ok(raceIds.has(f.race), `race ${f.race}`);
  for (const r of raceIds) assert.ok(DND_FAMILY.some((f) => f.race === r), `family names for ${r}`);
  const familyRace = new Map(DND_FAMILY.map((f) => [`${f.race}:${f.name}`, f.race]));
  const raceOf = (r) => r.key.split(":")[0];
  checkGenerator("dnd", dndGenerator, [
    [{ race: ["dwarf"] }, (r) => raceOf(r) === "dwarf" && familyRace.has(`dwarf:${r.key.split("|")[1]}`)],
    [{ race: ["elf", "tiefling"], gender: ["female"] }, (r) => ["elf", "tiefling"].includes(raceOf(r)) && r.subtitle.endsWith("female")],
  ], 300, DND_FIRST.length);
});

test("Viking names: real names, patronymic by gender, style filter respected", () => {
  const { VIKING_NAMES, vikingGenerator, patronymic } = mod("src/lib/generators/viking.ts");
  assert.ok(VIKING_NAMES.length >= 300);
  assert.equal(patronymic("Harald", "male"), "Haraldsson");
  assert.equal(patronymic("Thor", "female"), "Thorsdottir");
  assert.equal(patronymic("Magnus", "male"), "Magnusson");
  const gender = new Map(VIKING_NAMES.map((n) => [n.ascii, n.gender]));
  checkGenerator("viking", vikingGenerator, [
    [{ gender: ["female"] }, (r) => gender.get(r.key.split("|")[0]) === "female" && /dottir/.test(r.title)],
    [{ style: ["plain"] }, (r) => r.title === r.key.split("|")[0]],
    [{ style: ["byname"], gender: ["male"] }, (r) => !/sson\b/.test(r.title.split(" ")[1] ?? "") && r.title.split(" ").length >= 2],
  ], 300, VIKING_NAMES.length);
});

test("character names: genre + gender filters, surname shares a genre", () => {
  const { CHAR_FIRST, CHAR_LAST, characterNameGenerator, randomCharacterGenerator } = mod("src/lib/generators/characters.ts");
  assert.ok(CHAR_FIRST.length >= 300 && CHAR_LAST.length >= 200);
  const first = new Map(CHAR_FIRST.map((f) => [f.name, f]));
  const last = new Map(CHAR_LAST.map((l) => [l.name, l]));
  const parts = (r) => [first.get(r.key.split("|")[0]), last.get(r.key.split("|")[1])];
  checkGenerator("character-names", characterNameGenerator, [
    [{ genre: ["scifi"] }, (r) => { const [f, l] = parts(r); return f.genres.includes("scifi") && l.genres.includes("scifi"); }],
    [{ genre: ["modern"], gender: ["female"] }, (r) => { const [f, l] = parts(r); return f.gender === "female" && f.genres.includes("modern") && l.genres.includes("modern"); }],
  ], 300, CHAR_FIRST.length);
  checkGenerator("random-character", randomCharacterGenerator, [
    [{ genre: ["fantasy"] }, (r) => parts(r)[0].genres.includes("fantasy") && /Personality: .+\nLooks: .+\nMotivation: .+\nSecret: .+/.test(r.detail)],
  ], 300, CHAR_FIRST.length);
});

test("gnome names: ≥300 name parts, style filter respected", () => {
  const { GNOME_FIRST, GNOME_NICKNAMES, GNOME_CLANS, gnomeGenerator } = mod("src/lib/generators/gnome.ts");
  assert.ok(GNOME_FIRST.length + GNOME_NICKNAMES.length + GNOME_CLANS.length >= 300);
  checkGenerator("gnome", gnomeGenerator, [
    [{ style: ["clan"] }, (r) => !r.title.includes('"') && r.title.split(" ").length === 2],
    [{ gender: ["female"] }, (r) => r.subtitle.endsWith("female") && r.title.includes('"')],
  ], 140, GNOME_FIRST.length);
});

test("food generator: ≥300 dishes, meal/cuisine/diet filters respected", () => {
  const { FOODS, foodGenerator } = mod("src/lib/generators/foods.ts");
  const byId = new Map(FOODS.map((f) => [f.id, f]));
  assert.equal(byId.size, FOODS.length);
  checkGenerator("food", foodGenerator, [
    [{ meal: ["breakfast"] }, (r) => byId.get(r.key).meals.includes("breakfast")],
    [{ meal: ["dinner"], cuisine: ["thai", "mexican"] }, (r) => byId.get(r.key).meals.includes("dinner") && ["thai", "mexican"].includes(byId.get(r.key).cuisine)],
    [{ diet: ["vegan"] }, (r) => byId.get(r.key).diet.includes("vegan")],
  ]);
});

test("letter generator: sets, case and no repeats across a full alphabet", () => {
  const { letterGenerator } = mod("src/lib/generators/letters.ts");
  const gen = letterGenerator();
  assert.equal(gen.poolSize({}), 26);
  assert.equal(gen.poolSize({ set: ["vowels"] }), 5);
  assert.equal(gen.poolSize({ set: ["easy"] }), 19);
  const all = gen.generate({}, 26, [], 3).results.map((r) => r.title);
  assert.equal(new Set(all).size, 26);
  let used = [];
  const seen = [];
  for (let i = 0; i < 5; i++) {
    const out = gen.generate({ set: ["easy"], case: ["lower"] }, 3, used, 10 + i);
    used = out.used;
    for (const r of out.results) {
      assert.match(r.title, /^[a-z]$/);
      assert.ok(!"qxzjkvy".includes(r.title));
      seen.push(r.title);
    }
  }
  assert.equal(new Set(seen).size, 15);
  assert.equal(gen.resolve("q", { case: ["lower"] }).title, "q");
});

test("word generator: ≥300 words per language, every filter respected", () => {
  const { WORDS, wordGenerator, initialOf, lengthBand } = mod("src/lib/generators/words.ts");
  assert.equal(initialOf("Árbol"), "a");
  assert.equal(initialOf("ñandú"), "ñ");
  assert.equal(lengthBand("cat"), "short");
  assert.equal(lengthBand("lighthouse"), "long");
  for (const locale of ["en", "es"]) {
    const by = new Map(WORDS[locale].map((w) => [w.w, w]));
    assert.equal(by.size, WORDS[locale].length, `${locale}: unique words`);
    checkGenerator(`words-${locale}`, wordGenerator(locale), [
      [{ pos: ["verb"] }, (r) => by.get(r.key).pos === "verb"],
      [{ pos: ["noun"], use: ["draw"], level: ["easy"] }, (r) => { const w = by.get(r.key); return w.pos === "noun" && w.draw && w.level === "easy"; }],
      [{ length: ["long"] }, (r) => [...r.key].length >= 8],
      [{ letter: ["m"] }, (r) => initialOf(r.key) === "m"],
      [{ letter: ["any"], level: ["hard"] }, (r) => by.get(r.key).level === "hard"],
    ]);
  }
});

test("every illustration listed exists on disk and matches a bank entry", () => {
  for (const [set, bank] of [["animals", "animals.json"], ["foods", "foods.json"]]) {
    const index = json[`@/data/generators/${set === "animals" ? "animal" : "food"}Images.json`];
    const ids = new Set(json[`@/data/generators/${bank}`].map((x) => x.id));
    const files = new Set(readdirSync(resolve(root, "public/generators", set)).map((f) => f.replace(/\.webp$/, "")));
    assert.equal(index.length, ids.size, `${set}: every entry illustrated`);
    for (const id of index) {
      assert.ok(ids.has(id), `${set}: ${id} not in bank`);
      assert.ok(files.has(id), `${set}: ${id}.webp missing`);
    }
  }
});

test("Japanese names: kanji + kana + romaji for every result, gender and order filters", () => {
  const { JP_GIVEN, JP_FAMILY, japaneseNameGenerator, withOrder } = mod("src/lib/generators/japanese.ts");
  assert.ok(JP_GIVEN.length >= 300 && JP_FAMILY.length >= 200);
  for (const n of [...JP_GIVEN, ...JP_FAMILY]) {
    assert.match(n.kana, /^[\u3041-\u309Fー]+$/u, `kana ${n.romaji}`);
    assert.match(n.kanji, /[\u4E00-\u9FFF々]/u, `kanji ${n.romaji}`);
  }
  const gen = withOrder(japaneseNameGenerator());
  const given = new Map(JP_GIVEN.map((g) => [`${g.romaji}-${g.gender}`, g]));
  checkGenerator("japanese", gen, [
    [{ gender: ["female"] }, (r) => given.get(r.key.split("|")[0]).gender === "female"],
    [{ order: ["japanese"] }, (r) => r.title.split(" ")[0] === r.key.split("|")[1]],
    [{ order: ["western"] }, (r) => r.title.split(" ")[0] === given.get(r.key.split("|")[0]).romaji],
  ], 300, JP_GIVEN.length);
});

test("color generator: conversions round-trip, palette rules, locks kept, all distinct", () => {
  const c = mod("src/lib/generators/colors.ts");
  for (const hex of ["#000000", "#FFFFFF", "#FF0000", "#12AB9F", "#7F3C2A"]) {
    const rgb = c.hexToRgb(hex);
    assert.equal(c.rgbToHex(rgb), hex);
    const back = c.rgbToHex(c.hslToRgb(c.rgbToHsl(rgb)));
    const diff = c.hexToRgb(back).map((v, i) => Math.abs(v - rgb[i]));
    assert.ok(Math.max(...diff) <= 3, `${hex} → ${back}`);
  }
  assert.equal(c.formatColor("#FF0000").rgb, "rgb(255, 0, 0)");
  assert.equal(c.formatColor("#FF0000").hsl, "hsl(0, 100%, 50%)");
  assert.equal(c.readableText("#FFFFFF"), "#000000");
  assert.equal(c.readableText("#101010"), "#FFFFFF");
  for (let seed = 1; seed <= 100; seed++) {
    for (const mode of c.PALETTE_MODES.map((m) => m.id)) {
      const p = c.generatePalette(mode, [], new Set(), 8, rg.createRng(seed));
      assert.equal(p.length, 8);
      assert.equal(new Set(p).size, 8, `${mode} distinct`);
      for (const hex of p) assert.match(hex, /^#[0-9A-F]{6}$/);
      if (mode === "pastel") for (const hex of p) assert.ok(c.rgbToHsl(c.hexToRgb(hex)).l >= 74, `pastel ${hex}`);
      if (mode === "monochrome") {
        const hues = p.map((hex) => c.rgbToHsl(c.hexToRgb(hex)));
        const ls = hues.map((h) => h.l);
        assert.ok(Math.max(...ls) - Math.min(...ls) >= 40, "monochrome spans lightness");
      }
    }
  }
  const first = c.generatePalette("random", [], new Set(), 5, rg.createRng(3));
  const next = c.generatePalette("triadic", first, new Set([0, 3]), 5, rg.createRng(4));
  assert.equal(next[0], first[0]);
  assert.equal(next[3], first[3]);
  assert.notDeepEqual(next, first);
});

test("fantasy map: deterministic by seed, sensible land share, labels in place", () => {
  const f = mod("src/lib/generators/fantasyMap.ts");
  const a = f.generateFantasyMap(42, "continent");
  const b = f.generateFantasyMap(42, "continent");
  assert.deepEqual(Array.from(a.elevation.slice(0, 500)), Array.from(b.elevation.slice(0, 500)));
  assert.deepEqual(a.labels, b.labels);
  assert.notDeepEqual(Array.from(f.generateFantasyMap(43).elevation.slice(0, 500)), Array.from(a.elevation.slice(0, 500)));
  const ratios = { continent: [], archipelago: [], pangaea: [] };
  for (let seed = 1; seed <= 30; seed++) for (const shape of Object.keys(ratios)) {
    const m = f.generateFantasyMap(seed, shape);
    ratios[shape].push(m.landRatio);
    for (const l of m.labels) {
      const e = m.elevation[l.y * m.width + l.x];
      if (l.kind === "sea") assert.ok(e < f.SEA_LEVEL, "sea label on water");
      else assert.ok(e >= f.SEA_LEVEL, `${l.kind} label on land`);
      assert.match(l.name, /^[A-Z]/);
    }
    // Edges stay water so every map has a coastline.
    const corners = [0, m.width - 1, (m.height - 1) * m.width, m.height * m.width - 1].map((i) => m.elevation[i]);
    if (shape !== "pangaea") assert.ok(corners.every((e) => e < f.SEA_LEVEL), `${shape} corners are sea`);
  }
  const median = (xs) => xs.slice().sort((x, y) => x - y)[Math.floor(xs.length / 2)];
  assert.ok(median(ratios.continent) > 0.15 && median(ratios.continent) < 0.6, `continent land ${median(ratios.continent)}`);
  assert.ok(median(ratios.pangaea) > median(ratios.continent), "supercontinent has more land");
  assert.ok(median(ratios.archipelago) < median(ratios.pangaea), "islands have less land");
  for (let seed = 1; seed <= 2000; seed++) assert.notEqual(f.placeName(rg.createRng(seed)).toLowerCase(), "mordor");
  for (const style of ["color", "parchment"]) for (const e of [0.1, 0.49, 0.5, 0.75, 0.9]) {
    const rgb = f.cellColor(e, 0.5, style);
    assert.ok(rgb.every((v) => v >= 0 && v <= 255));
  }
});

/* ---------------- My 9 grid maker ---------------- */

const ng = mod("src/lib/generators/nineGrid.ts");
const fakeFetch = (body) => {
  const f = async (url, init) => { f.calls.push({ url: String(url), init }); return { ok: true, json: async () => body }; };
  f.calls = [];
  return f;
};

test("my 9: share link round-trips ids, empty and uploaded slots, and custom titles", () => {
  const slots = Array(9).fill(null);
  slots[0] = { id: "111", title: "A", image: "x" };
  slots[2] = { title: "upload", image: "blob:x" };
  slots[4] = { id: "555", title: "E", image: "y" };
  const qs = ng.encodeShare(slots, "My 9 Albums", "My 9 Albums");
  assert.equal(qs, "i=111._._._.555");
  const back = ng.decodeShare(`?${qs}`);
  assert.deepEqual(back.ids, ["111", "", "", "", "555", "", "", "", ""]);
  assert.equal(back.title, undefined);
  assert.equal(ng.decodeShare(`?${ng.encodeShare(slots, "Albums that made me", "My 9 Albums")}`).title, "Albums that made me");
  assert.equal(ng.encodeShare(Array(9).fill(null), "My 9 Albums", "My 9 Albums"), "");
  // Hostile input is ignored rather than reaching the APIs.
  assert.deepEqual(ng.decodeShare("?i=1;drop.<x>.12.1.2.3.4.5.6.7.8.9").ids, ["", "", "12", "1", "2", "3", "4", "5", "6"]);
});

test("my 9: placing fills the chosen or first empty square and refuses a full grid", () => {
  let slots = Array(9).fill(null);
  const item = (n) => ({ id: String(n), title: `T${n}`, image: "i" });
  const a = ng.placeItem(slots, item(1), null);
  assert.equal(a.index, 0);
  const b = ng.placeItem(a.slots, item(2), 5);
  assert.equal(b.index, 5);
  assert.equal(b.slots[0].id, "1");
  assert.equal(slots[0], null, "input not mutated");
  slots = Array.from({ length: 9 }, (_, i) => item(i));
  assert.equal(ng.placeItem(slots, item(99), null), null);
  assert.equal(ng.placeItem(slots, item(99), 3).slots[3].id, "99", "a chosen square is replaced");
  const swapped = ng.swapSlots(slots, 0, 8);
  assert.equal(swapped[0].id, "8");
  assert.equal(swapped[8].id, "0");
});

test("my 9: layout keeps nine tiles inside the canvas and crop fills the tile", () => {
  for (const aspect of [1, 4 / 3]) for (const captions of [true, false]) {
    const L = ng.gridLayout(aspect, captions, true);
    assert.equal(L.width, 1080);
    assert.equal(L.height, 1080, "square export");
    assert.equal(L.tiles.length, 9);
    assert.ok(Math.abs(L.tileH / L.tileW - aspect) < 0.02);
    for (const t of L.tiles) {
      assert.ok(t.x >= 0 && t.x + L.tileW <= L.width);
      assert.ok(t.y >= L.header && t.y + L.tileH + L.caption <= L.height);
    }
  }
  const story = ng.gridLayout(1, true, true, 1920);
  assert.equal(story.height, 1920);
  assert.ok(story.tiles[0].y > 300, "story grid is centred vertically");
  assert.ok(story.tiles[8].y + story.tileH + story.caption <= 1920 - story.pad);
  const c = ng.coverCrop(1000, 500, 300, 400);
  assert.ok(Math.abs(c.sw / c.sh - 300 / 400) < 1e-9);
  assert.ok(c.sx > 0 && c.sy === 0);
});

/* ---------------- citation generators ---------------- */

const cf = mod("src/lib/citations/format.ts");
const cl = mod("src/lib/citations/lookup.ts");
const su = mod("src/lib/citations/safeUrl.ts");
const P = (given, family) => ({ given, family });
const desmond = { type: "journal", authors: [P("Matthew", "Desmond")], title: "Eviction and the Reproduction of Urban Poverty", container: "American Journal of Sociology", volume: "118", issue: "1", pages: "88-133", year: "2012", doi: "10.1086/666082" };
const marucho = { type: "journal", authors: [P("M.", "Marucho"), P("C. T.", "Kelley"), P("B. Montgomery", "Pettitt")], title: "Solutions of the Optimized Closure Integral Equation Theory:  Heteronuclear Polyatomic Fluids", container: "Journal of Chemical Theory and Computation", containerShort: "J. Chem. Theory Comput.", volume: "4", issue: "3", pages: "385-396", year: "2008", doi: "10.1021/ct700202h" };
const book = { type: "book", authors: [P("Lanny D.", "Schmidt")], title: "The Engineering of Chemical Reactions", edition: "2", publisher: "Oxford University Press", year: "2005" };
const chapter = { type: "chapter", authors: [P("Robin R. R.", "Gray")], title: "Repatriation and Decolonization", container: "The Oxford Handbook of Musical Repatriation", editors: [P("Frank", "Gunderson"), P("Robert C.", "Lancefield"), P("Bret", "Woods")], pages: "722-738", publisher: "Oxford University Press", year: "2018", doi: "10.1093/oxfordhb/9780190659806.013.39" };
const many = (n) => Array.from({ length: n }, (_, i) => P(`Given${i}`, `Family${i}`));
const txt = (style, src, opts = {}) => cf.plainText(cf.formatCitation(style, src, opts).reference);
const inText = (style, src, opts = {}) => cf.formatCitation(style, src, opts).inText.map((t) => cf.plainText(t.value));

test("citations: ASA 7th journal, book, chapter and in-text rules", () => {
  assert.equal(txt("asa", desmond), "Desmond, Matthew. 2012. “Eviction and the Reproduction of Urban Poverty.” American Journal of Sociology 118(1):88–133. https://doi.org/10.1086/666082");
  assert.deepEqual(inText("asa", desmond, { page: "95" }), ["(Desmond 2012:95)"]);
  assert.equal(txt("asa", { ...desmond, authors: [P("Nathan", "Innocente"), P("Jayne", "Baker")] }).split(". 2012")[0], "Innocente, Nathan, and Jayne Baker");
  assert.deepEqual(inText("asa", marucho), ["(Marucho, Kelley, and Pettitt 2008)", "(Marucho et al. 2008)"], "three authors: all, then et al.");
  assert.deepEqual(inText("asa", { ...marucho, authors: many(4) }), ["(Family0 et al. 2008)"]);
  assert.match(txt("asa", { ...marucho, authors: many(11) }), /Given6 Family6, et al\. 2008/, "more than ten authors: first seven");
  assert.equal(txt("asa", { ...book, place: "New York" }), "Schmidt, Lanny D. 2005. The Engineering of Chemical Reactions. 2nd ed. New York: Oxford University Press.");
  assert.match(txt("asa", chapter), /“Repatriation and Decolonization\.” Pp\. 722–738 in The Oxford Handbook of Musical Repatriation, edited by Frank Gunderson, Robert C\. Lancefield, and Bret Woods\./);
  assert.deepEqual(inText("asa", { type: "web", authors: [], title: "What Is Climate Change?" }), ["(“What Is Climate Change?” n.d.)".replace(" n.d.", ", n.d.")]);
  // Italics: journal and book titles only.
  const segs = cf.formatCitation("asa", desmond).reference;
  assert.deepEqual(segs.filter((x) => x.i).map((x) => x.t), ["American Journal of Sociology"]);
});

test("citations: ACS journal, book and chapter match the guide's examples", () => {
  assert.equal(txt("acs", marucho), "Marucho, M.; Kelley, C. T.; Pettitt, B. M. Solutions of the Optimized Closure Integral Equation Theory: Heteronuclear Polyatomic Fluids. J. Chem. Theory Comput. 2008, 4 (3), 385–396. DOI: 10.1021/ct700202h");
  const segs = cf.formatCitation("acs", marucho).reference;
  assert.deepEqual(segs.filter((x) => x.b).map((x) => x.t), ["2008"], "bold year");
  assert.deepEqual(segs.filter((x) => x.i).map((x) => x.t), ["J. Chem. Theory Comput.", "4"], "italic journal and volume");
  assert.equal(txt("acs", book), "Schmidt, L. D. The Engineering of Chemical Reactions, 2nd ed.; Oxford University Press, 2005.");
  assert.equal(txt("acs", { ...book, place: "Boca Raton, FL", publisher: "CRC Press", edition: "3" }), "Schmidt, L. D. The Engineering of Chemical Reactions, 3rd ed.; CRC Press: Boca Raton, FL, 2005.");
  assert.equal(txt("acs", chapter), "Gray, R. R. R. Repatriation and Decolonization. In The Oxford Handbook of Musical Repatriation; Gunderson, F., Lancefield, R. C., Woods, B., Eds.; Oxford University Press, 2018; pp 722–738. DOI: 10.1093/oxfordhb/9780190659806.013.39");
  assert.match(txt("acs", { ...marucho, authors: many(12) }), /Family9, G\.; et al\. Solutions/, "ten authors then et al.");
  assert.equal(txt("acs", { type: "web", authors: [{ given: "", family: "U.S. Environmental Protection Agency", org: true }], title: "Toxics Release Inventory (TRI) Program", url: "https://www.epa.gov/toxics-release-inventory-tri-program", accessed: "2019-02-21" }),
    "U.S. Environmental Protection Agency. Toxics Release Inventory (TRI) Program. https://www.epa.gov/toxics-release-inventory-tri-program (accessed 2019-02-21).");
  assert.deepEqual(inText("acs", marucho, { number: 3 }), ["3", "(3)"]);
  assert.equal(cf.initials("Jean-Paul"), "J.-P.");
  assert.equal(cf.cleanText("van der Walt, St&#233;fan J. &amp; Co&#x2019;s"), "van der Walt, Stéfan J. & Co’s");
});

test("citations: Chicago 18th notes-bibliography and author-date", () => {
  assert.equal(txt("chicago-nb", desmond), "Desmond, Matthew. “Eviction and the Reproduction of Urban Poverty.” American Journal of Sociology 118, no. 1 (2012): 88–133. https://doi.org/10.1086/666082.");
  const [full, short] = inText("chicago-nb", desmond, { page: "95" });
  assert.equal(full, "Matthew Desmond, “Eviction and the Reproduction of Urban Poverty,” American Journal of Sociology 118, no. 1 (2012): 95, https://doi.org/10.1086/666082.");
  assert.equal(short, "Desmond, “Eviction and the Reproduction,” 95.");
  assert.equal(txt("chicago-nb", book), "Schmidt, Lanny D. The Engineering of Chemical Reactions. 2nd ed. Oxford University Press, 2005.", "no place of publication (18th ed.)");
  assert.equal(inText("chicago-nb", book, { page: "40" })[0], "Lanny D. Schmidt, The Engineering of Chemical Reactions, 2nd ed. (Oxford University Press, 2005), 40.");
  assert.match(inText("chicago-nb", marucho)[0], /^M\. Marucho et al\., /, "three or more authors in notes: et al.");
  assert.match(txt("chicago-nb", { ...desmond, authors: many(6) }), /Given4 Family4, and Given5 Family5\./, "up to six authors listed");
  assert.match(txt("chicago-nb", { ...desmond, authors: many(7) }), /^Family0, Given0, Given1 Family1, Given2 Family2, et al\. “/, "more than six: first three et al.");
  assert.equal(txt("chicago-ad", desmond), "Desmond, Matthew. 2012. “Eviction and the Reproduction of Urban Poverty.” American Journal of Sociology 118 (1): 88–133. https://doi.org/10.1086/666082.");
  assert.deepEqual(inText("chicago-ad", marucho, { page: "390" }), ["(Marucho et al. 2008, 390)"]);
  assert.doesNotMatch(inText("chicago-nb", { ...desmond, title: "Who Did It?" })[0], /\?,/, "no comma after a question mark");
  const web = { type: "web", authors: [{ given: "", family: "United Nations", org: true }], title: "What Is Climate Change?", container: "United Nations", url: "https://www.un.org/en/climatechange/what-is-climate-change", accessed: "2026-10-12" };
  assert.equal(inText("chicago-nb", web, { page: "2" })[1], "United Nations, “What Is Climate Change?” 2.");
  assert.equal(txt("chicago-nb", web), "United Nations. “What Is Climate Change?” United Nations. Accessed October 12, 2026. https://www.un.org/en/climatechange/what-is-climate-change.");
});

test("citations: headline case, names and sorting", () => {
  assert.equal(cf.headlineCase("eviction and the reproduction of urban poverty: a study of the iPhone in NYC"), "Eviction and the Reproduction of Urban Poverty: A Study of the iPhone in NYC");
  assert.equal(cf.headlineCase("what is it for"), "What Is It For");
  assert.deepEqual(cf.parsePerson("Julio de Paula"), { given: "Julio", family: "de Paula" });
  assert.deepEqual(cf.parsePerson("Desmond, Matthew"), { family: "Desmond", given: "Matthew" });
  const sorted = cf.sortForStyle("asa", [{ source: marucho }, { source: desmond }]).map((x) => x.source.authors[0].family);
  assert.deepEqual(sorted, ["Desmond", "Marucho"]);
  assert.deepEqual(cf.sortForStyle("acs", [{ source: marucho }, { source: desmond }]).map((x) => x.source.authors[0].family), ["Marucho", "Desmond"], "ACS keeps citation order");
});

test("citations: input detection, metadata mapping and the URL guard", () => {
  assert.deepEqual(cl.detectInput("https://doi.org/10.1086/666082"), { kind: "doi", value: "10.1086/666082" });
  assert.deepEqual(cl.detectInput("doi:10.1021/ct700202h."), { kind: "doi", value: "10.1021/ct700202h" });
  assert.deepEqual(cl.detectInput("978-0-553-44743-9"), { kind: "isbn", value: "9780553447439" });
  assert.equal(cl.detectInput("978-0-553-44743-8").kind, "unknown", "bad ISBN check digit");
  assert.equal(cl.detectInput("https://pubs.acs.org/doi/10.1021/ct700202h").kind, "doi");
  assert.equal(cl.detectInput("https://www.un.org/en/climatechange/what-is-climate-change").kind, "url");
  const work = cl.fromCrossref({ type: "journal-article", title: ["Solutions of the Optimized Closure Integral Equation Theory:  Heteronuclear <i>Polyatomic</i> Fluids"], "container-title": ["Journal of Chemical Theory and Computation"], "short-container-title": ["J. Chem. Theory Comput."], volume: "4", issue: "3", page: "385-396", issued: { "date-parts": [[2008, 2, 21]] }, author: [{ given: "M.", family: "Marucho" }], DOI: "10.1021/ct700202h" });
  assert.equal(work.title, "Solutions of the Optimized Closure Integral Equation Theory: Heteronuclear Polyatomic Fluids");
  assert.equal(work.containerShort, "J. Chem. Theory Comput.");
  assert.equal(cl.fromCrossref({ type: "journal-article", title: ["T"], "short-container-title": ["Speculum"] }).containerShort, undefined, "only real abbreviations");
  assert.equal(cl.fromCrossref({ type: "reference-entry", title: ["T"] }).type, "chapter");
  const ol = cl.fromOpenLibrary({ title: "Evicted", subtitle: "Poverty and Profit in the American City", authors: [{ name: "Matthew Desmond" }], publishers: [{ name: "Crown Publishers" }], publish_places: [{ name: "New York" }], publish_date: "March 1, 2016" });
  assert.deepEqual([ol.title, ol.authors[0].family, ol.year, ol.place], ["Evicted: Poverty and Profit in the American City", "Desmond", "2016", "New York"]);
  const meta = cl.parsePageMeta(`<html><head><title>x</title><meta property="og:title" content="What Is Climate Change? | United Nations"><meta property="og:site_name" content="United Nations"><meta name="author" content="United Nations"><meta property="article:published_time" content="2023-05-04T10:00:00Z"></head></html>`, "https://www.un.org/x");
  assert.deepEqual([meta.title, meta.site, meta.date], ["What Is Climate Change?", "United Nations", "2023-05-04T10:00:00Z"]);
  const web = cl.fromPageMeta(meta, "2026-10-12");
  assert.deepEqual([web.type, web.year, web.month, web.day, web.accessed], ["web", "2023", 5, 4, "2026-10-12"]);
  const sch = cl.parsePageMeta(`<meta name="citation_title" content="A"><meta name="citation_author" content="Kelley, C. T."><meta name="citation_author" content="Marucho, M."><meta name="citation_doi" content="10.1021/ct700202h"><meta name="citation_journal_title" content="JCTC"><meta name="citation_volume" content="4">`, "https://pubs.acs.org/x");
  assert.deepEqual([sch.doi, sch.authors.length], ["10.1021/ct700202h", 2]);
  for (const bad of ["http://localhost/", "http://127.0.0.1/", "http://10.0.0.5/", "http://169.254.169.254/latest/meta-data", "http://[::1]/", "file:///etc/passwd", "http://example.com:8080/", "http://user:pw@example.com/", "http://intranet/", "http://192.168.1.1/"]) assert.equal(su.urlAllowed(bad), null, bad);
  assert.ok(su.urlAllowed("https://www.un.org/en/climatechange/what-is-climate-change"));
  for (const ip of ["10.1.2.3", "172.20.0.1", "100.64.0.1", "198.18.0.5", "::ffff:127.0.0.1", "fd00::1", "fe80::1", "0.0.0.0"]) assert.ok(su.ipBlocked(ip), ip);
  assert.equal(su.ipBlocked("198.18.0.5", true), false, "benchmark range allowed only off production");
  assert.equal(su.ipBlocked("151.101.1.140"), false);
});

test("keep playing: three different tools, never the page itself, all routed", () => {
  const rt = mod("src/data/relatedTools.ts");
  for (const tool of rt.RELATED_TOOLS) {
    const picks = rt.keepPlaying(tool.href);
    assert.equal(picks.length, 3, tool.href);
    assert.equal(new Set(picks.map((t) => t.href)).size, 3);
    assert.ok(!picks.some((t) => t.href === tool.href), `${tool.href} recommends itself`);
    assert.ok(existsSync(resolve(root, `src/app${tool.href}/page.tsx`)), `no route for ${tool.href}`);
  }
  assert.deepEqual(rt.keepPlaying("/not-a-tool"), []);
  assert.notDeepEqual(rt.keepPlaying("/charades").map((t) => t.href), rt.keepPlaying("/this-or-that").map((t) => t.href), "neighbours differ");
});

const asyncTests = [];
asyncTests.push((async () => {
  // Albums: Deezer via our route first, iTunes when the route returns nothing or fails.
  const dz = ng.fromDeezer([
    { id: 12114240, title: "The Dark Side of the Moon", artist: { name: "Pink Floyd" }, cover_xl: "https://cdn-images.dzcdn.net/x/1000.jpg", cover_medium: "https://cdn-images.dzcdn.net/x/250.jpg", record_type: "album" },
    { id: 5, title: "A single", artist: { name: "X" }, cover_xl: "https://cdn-images.dzcdn.net/s.jpg", record_type: "single" },
    { id: 6, title: "No cover", artist: { name: "X" } },
  ]);
  assert.deepEqual(ng.fromDeezer([
    { id: 1, title: "Physical Graffiti (Remaster)", cover_xl: "c" },
    { id: 2, title: "Since I Left You (20th Anniversary Deluxe Edition)", cover_xl: "c" },
    { id: 3, title: "Mezzanine", cover_xl: "c" },
    { id: 4, title: "Abbey Road (Super Deluxe Edition) [2019 Mix]", cover_xl: "c" },
  ]).map((a) => a.title), ["Physical Graffiti", "Since I Left You", "Mezzanine", "Abbey Road (Super Deluxe Edition)"]);
  assert.deepEqual(dz, [{ id: "d12114240", title: "The Dark Side of the Moon", subtitle: "Pink Floyd", image: "https://cdn-images.dzcdn.net/x/1000.jpg", thumb: "https://cdn-images.dzcdn.net/x/250.jpg" }]);
  const routed = fakeFetch({ items: dz });
  assert.equal((await ng.searchItems("albums", "dark side", routed))[0].id, "d12114240");
  assert.equal(routed.calls[0].url, "/api/my9/albums?q=dark+side");
  assert.equal(routed.calls.length, 1, "no iTunes call when the route answers");
  assert.deepEqual(ng.decodeShare("?i=d12114240.1097861387").ids.slice(0, 2), ["d12114240", "1097861387"], "Deezer and legacy iTunes ids");
  const mixed = async (url) => ({ ok: true, json: async () => (String(url).startsWith("/api/") ? { items: dz } : { results: [{ wrapperType: "collection", collectionId: 77, collectionName: "Kid A", artistName: "Radiohead", artworkUrl100: "https://is1-ssl.mzstatic.com/k/100x100bb.jpg" }] }) });
  const both = await ng.lookupItems("albums", ["d12114240", "77"], mixed);
  assert.equal(both.get("d12114240").subtitle, "Pink Floyd");
  assert.equal(both.get("77").title, "Kid A");
  const f = fakeFetch({ results: [
    { wrapperType: "collection", collectionId: 1, collectionName: "Abbey Road", artistName: "The Beatles", artworkUrl100: "https://is1-ssl.mzstatic.com/a/100x100bb.jpg" },
    { wrapperType: "collection", collectionId: 2, collectionName: "No art", artistName: "X" },
    { wrapperType: "collection", collectionId: 3, collectionName: "Something - Single", artistName: "The Beatles", artworkUrl100: "https://is1-ssl.mzstatic.com/s/100x100bb.jpg" },
  ] });
  const albums = await ng.searchItems("albums", "abbey", f);
  assert.deepEqual(albums, [{ id: "1", title: "Abbey Road", subtitle: "The Beatles", image: "https://is1-ssl.mzstatic.com/a/600x600bb.jpg", thumb: "https://is1-ssl.mzstatic.com/a/200x200bb.jpg" }]);
  assert.match(f.calls[0].url, /^\/api\/my9\/albums/);
  assert.match(f.calls[1].url, /itunes\.apple\.com\/search.*entity=album/, "iTunes fallback");
  assert.deepEqual(await ng.searchItems("albums", "a", f), [], "one letter does not search");

  const w = fakeFetch({ query: { pages: {
    "9": { pageid: 9, index: 2, title: "Halo 3", description: "2007 video game", thumbnail: { source: "https://upload.wikimedia.org/h.jpg" } },
    "7": { pageid: 7, index: 1, title: "Doom (1993 video game)", thumbnail: { source: "https://upload.wikimedia.org/d.jpg" } },
    "8": { pageid: 8, index: 3, title: "Minecraft" },
  } } });
  const games = await ng.searchItems("games", "doom", w);
  assert.deepEqual(games.map((g) => g.title), ["Doom", "Halo 3"], "ordered by relevance, no-cover pages dropped, disambiguator removed");
  assert.equal(new URL(w.calls[0].url).searchParams.get("gsrsearch"), `doom hastemplate:"Infobox video game"`);
  assert.match(w.calls[0].url, /origin=\*/);
  const m = fakeFetch({ query: { pages: { "5": { pageid: 5, index: 1, title: "Paprika (2006 film)", thumbnail: { source: "https://upload.wikimedia.org/p.jpg" } } } } });
  assert.equal((await ng.searchItems("movies", "paprika", m))[0].title, "Paprika");
  assert.equal(new URL(m.calls[0].url).searchParams.get("gsrsearch"), `paprika hastemplate:"Infobox film"`);
  const bk = fakeFetch({ query: { pages: {} } });
  await ng.searchItems("books", "dune", bk);
  assert.equal(new URL(bk.calls[0].url).searchParams.get("gsrsearch"), `dune hastemplate:"Infobox book"`);

  const a = fakeFetch({ data: { Page: { media: [
    { id: 20, title: { english: null, romaji: "NARUTO" }, coverImage: { extraLarge: "https://s4.anilist.co/x.jpg" }, startDate: { year: 2002 }, format: "TV" },
  ] } } });
  const anime = await ng.searchItems("anime", "naruto", a);
  assert.deepEqual(anime[0], { id: "20", title: "NARUTO", subtitle: "2002 · TV", image: "https://s4.anilist.co/x.jpg", thumb: undefined });
  assert.equal(JSON.parse(a.calls[0].init.body).variables.q, "naruto");
  const looked = await ng.lookupItems("anime", ["20", "", "20"], a);
  assert.equal(looked.get("20").title, "NARUTO");
  assert.deepEqual(JSON.parse(a.calls[1].init.body).variables.ids, [20], "deduplicated numeric ids");
  passed++;
})());
await Promise.all(asyncTests);

console.log(`✓ random generators: ${passed} tests passed`);
