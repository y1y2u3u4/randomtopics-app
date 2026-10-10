// Unit tests for the random generator pages: team splitting (even sizes,
// balanced tags/levels, locks), no-repeat drawing, filters and data banks.
// Run: npm run generators:test
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
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

console.log(`✓ random generators: ${passed} tests passed`);
