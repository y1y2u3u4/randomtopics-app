// Tests for /random-pokemon-generator: species data, per-generation counts, filters, lock/reroll, team, share.
// Run: node scripts/pokemon-regression.mjs
import assert from "node:assert/strict";
import { load } from "./lib/load-typescript.mjs";

const lib = load("src/lib/pokemon.ts");
const rg = load("src/lib/randomGenerators.ts");
const { POKEMON, POKEMON_TYPES, GEN_COUNTS, DEFAULT_FILTERS } = lib;
let passed = 0;
const test = (name, fn) => { try { fn(); passed++; } catch (e) { console.error(`x ${name}`); throw e; } };
const byName = (n) => POKEMON.find((p) => p.name === n);

test("1025 species with sequential dex numbers and valid types", () => {
  assert.equal(POKEMON.length, 1025);
  POKEMON.forEach((p, i) => {
    assert.equal(p.dex, i + 1, p.name);
    assert.ok(p.types.length >= 1 && p.types.length <= 2, p.name);
    assert.ok(p.types.every((t) => POKEMON_TYPES.includes(t)), p.name);
    assert.ok(p.types.length === 1 || p.types[0] !== p.types[1], p.name);
  });
  assert.equal(new Set(POKEMON.map((p) => p.name)).size, 1025);
  assert.equal(POKEMON_TYPES.length, 18);
});

test("per-generation counts are 151/100/135/107/156/72/88/96/120", () => {
  assert.deepEqual([...GEN_COUNTS], [151, 100, 135, 107, 156, 72, 88, 96, 120]);
  GEN_COUNTS.forEach((c, i) => assert.equal(POKEMON.filter((p) => p.gen === i + 1).length, c, `gen ${i + 1}`));
});

test("generation boundaries", () => {
  const edge = [["Bulbasaur", 1, 1], ["Mew", 151, 1], ["Chikorita", 152, 2], ["Celebi", 251, 2], ["Treecko", 252, 3], ["Deoxys", 386, 3],
    ["Turtwig", 387, 4], ["Arceus", 493, 4], ["Victini", 494, 5], ["Genesect", 649, 5], ["Chespin", 650, 6], ["Volcanion", 721, 6],
    ["Rowlet", 722, 7], ["Melmetal", 809, 7], ["Grookey", 810, 8], ["Enamorus", 905, 8], ["Sprigatito", 906, 9], ["Pecharunt", 1025, 9]];
  for (const [n, d, g] of edge) { const p = byName(n); assert.ok(p, n); assert.equal(p.dex, d, n); assert.equal(p.gen, g, n); }
});

test("sample of types is correct", () => {
  const t = (n) => byName(n).types.join("/");
  const want = { Bulbasaur: "Grass/Poison", Charizard: "Fire/Flying", Pikachu: "Electric", Gengar: "Ghost/Poison", Gyarados: "Water/Flying",
    Dragonite: "Dragon/Flying", Mewtwo: "Psychic", Steelix: "Steel/Ground", Blaziken: "Fire/Fighting", Lucario: "Fighting/Steel",
    Garchomp: "Dragon/Ground", Greninja: "Water/Dark", Sylveon: "Fairy", Tyranitar: "Rock/Dark", Snorlax: "Normal", Gardevoir: "Psychic/Fairy",
    Rayquaza: "Dragon/Flying", Dragapult: "Dragon/Ghost", Corviknight: "Flying/Steel", Meowscarada: "Grass/Dark", Skeledirge: "Fire/Ghost",
    Miraidon: "Electric/Dragon", Koraidon: "Fighting/Dragon", Ditto: "Normal", Eevee: "Normal", Magnemite: "Electric/Steel", Togekiss: "Fairy/Flying",
    Mimikyu: "Ghost/Fairy", Mudkip: "Water", Squirtle: "Water", Charmander: "Fire" };
  for (const [n, ty] of Object.entries(want)) assert.equal(t(n), ty, n);
});

test("filters: generation, type, kind, legendary", () => {
  const F = (o) => ({ ...DEFAULT_FILTERS, ...o });
  assert.equal(lib.filterPokemon(DEFAULT_FILTERS).length, 1025);
  assert.equal(lib.filterPokemon(F({ gens: [1] })).length, 151);
  assert.equal(lib.filterPokemon(F({ gens: [1, 3] })).length, 286);
  assert.ok(lib.filterPokemon(F({ types: ["Fire"] })).every((p) => p.types.includes("Fire")));
  const fw = lib.filterPokemon(F({ types: ["Fire", "Water"] }));
  assert.ok(fw.every((p) => p.types.includes("Fire") || p.types.includes("Water")));
  assert.ok(lib.filterPokemon(F({ kind: "single" })).every((p) => p.types.length === 1));
  assert.ok(lib.filterPokemon(F({ kind: "dual" })).every((p) => p.types.length === 2));
  const no = lib.filterPokemon(F({ special: "no" })), only = lib.filterPokemon(F({ special: "only" }));
  assert.equal(no.length + only.length, 1025);
  assert.ok(only.length > 30 && only.length < 150);
  assert.ok(only.some((p) => p.name === "Mewtwo") && !no.some((p) => p.name === "Mewtwo"));
});

test("drawSlots: unique, respects count and filters, locks survive", () => {
  const rng = rg.createRng(7);
  const f = { ...DEFAULT_FILTERS, gens: [1] };
  const a = lib.drawSlots([], new Set(), 6, f, [], rng);
  assert.equal(a.slots.length, 6);
  assert.equal(new Set(a.slots.map((p) => p.dex)).size, 6);
  assert.ok(a.slots.every((p) => p.gen === 1));
  const locked = new Set([a.slots[0].dex, a.slots[2].dex]);
  const b = lib.drawSlots(a.slots, locked, 6, f, a.used, rng);
  assert.equal(b.slots.length, 6);
  assert.equal(b.slots[0].dex, a.slots[0].dex);
  assert.equal(b.slots[2].dex, a.slots[2].dex);
  assert.equal(new Set(b.slots.map((p) => p.dex)).size, 6);
});

test("drawSlots caps at 24 and reports a short pool", () => {
  const rng = rg.createRng(3);
  assert.equal(lib.drawSlots([], new Set(), 99, DEFAULT_FILTERS, [], rng).slots.length, 24);
  const tiny = { ...DEFAULT_FILTERS, gens: [1], types: ["Dragon"], special: "only" };
  const n = lib.filterPokemon(tiny).length;
  const r = lib.drawSlots([], new Set(), 6, tiny, [], rng);
  assert.equal(r.slots.length, Math.min(6, n));
});

test("rerollOne changes only that card and never duplicates", () => {
  const rng = rg.createRng(11);
  const a = lib.drawSlots([], new Set(), 5, DEFAULT_FILTERS, [], rng).slots;
  const b = lib.rerollOne(a, 2, DEFAULT_FILTERS, rng);
  assert.notEqual(b[2].dex, a[2].dex);
  assert.deepEqual(b.filter((_, i) => i !== 2).map((p) => p.dex), a.filter((_, i) => i !== 2).map((p) => p.dex));
  assert.equal(new Set(b.map((p) => p.dex)).size, 5);
});

test("drawTeam gives six distinct Pokemon with no shared type when possible", () => {
  for (let s = 1; s <= 20; s++) {
    const { team, balanced } = lib.drawTeam(DEFAULT_FILTERS, rg.createRng(s));
    assert.equal(team.length, 6);
    assert.equal(new Set(team.map((p) => p.dex)).size, 6);
    assert.ok(balanced);
    const types = team.flatMap((p) => p.types);
    assert.equal(new Set(types).size, types.length);
  }
  const mono = lib.drawTeam({ ...DEFAULT_FILTERS, types: ["Fire"], kind: "single" }, rg.createRng(5));
  assert.equal(mono.team.length, 6);
  assert.equal(mono.balanced, false);
});

test("share link round-trips and reproduces the same result", () => {
  const state = { seed: 424242, mode: "random", count: 8, filters: { gens: [3, 1], types: ["Ghost", "Steel"], kind: "any", special: "no" } };
  const q = lib.shareQuery(state);
  const back = lib.parseShare(q);
  assert.deepEqual(back.filters.gens.sort(), [1, 3]);
  assert.deepEqual(back.filters.types, ["Ghost", "Steel"]);
  assert.equal(back.count, 8);
  assert.equal(back.special ?? back.filters.special, "no");
  const a = lib.resultFromShare(back).map((p) => p.dex);
  const b = lib.resultFromShare(lib.parseShare(q)).map((p) => p.dex);
  assert.deepEqual(a, b);
  const t = lib.parseShare(lib.shareQuery({ ...state, mode: "team" }));
  assert.equal(t.mode, "team");
  assert.equal(lib.resultFromShare(t).length, 6);
  assert.equal(lib.parseShare("mode=team"), null);
  assert.ok(lib.parseShare("seed=1&gen=99&type=bogus&n=500").count >= 1);
});

test("resultsText lists name and dex", () => {
  const txt = lib.resultsText([byName("Pikachu")]);
  assert.match(txt, /Pikachu/);
  assert.match(txt, /0025/);
});

console.log(`pokemon-regression: ${passed} tests passed`);
