// Tests for /random-nba-player-generator: data bank, filters, lock-and-reroll, daily five.
// Run: node scripts/nba-players-regression.mjs
import assert from "node:assert/strict";
import { load } from "./lib/load-typescript.mjs";

const lib = load("src/lib/nbaPlayers.ts");
const rg = load("src/lib/randomGenerators.ts");
const { NBA_PLAYERS, NBA_TEAMS, DECADES } = lib;
let passed = 0;
const test = (name, fn) => { try { fn(); passed++; } catch (e) { console.error(`✗ ${name}`); throw e; } };

test("bank has at least 250 unique, well-formed players", () => {
  assert.ok(NBA_PLAYERS.length >= 250, `only ${NBA_PLAYERS.length}`);
  assert.equal(new Set(NBA_PLAYERS.map((p) => p.id)).size, NBA_PLAYERS.length);
  for (const p of NBA_PLAYERS) {
    assert.ok(["PG", "SG", "SF", "PF", "C"].includes(p.pos), p.name);
    assert.ok(p.teams.length >= 1 && p.teams.every((t) => NBA_TEAMS.includes(t)), `${p.name} teams ${p.teams}`);
    assert.ok(p.from >= 1946 && p.from <= 2025, p.name);
    assert.ok(p.to === 0 || p.to >= p.from, p.name);
    assert.equal(p.active, p.to === 0);
    assert.ok(p.honors.length >= 1 && p.honors.length <= 3, p.name);
  }
});

test("all 30 franchises, all five positions and every decade are covered", () => {
  assert.equal(NBA_TEAMS.length, 30);
  for (const t of NBA_TEAMS) assert.ok(NBA_PLAYERS.some((p) => p.teams.includes(t)), t);
  for (const pos of ["PG", "SG", "SF", "PF", "C"]) assert.ok(NBA_PLAYERS.filter((p) => p.pos === pos).length >= 30, pos);
  for (const d of DECADES) assert.ok(NBA_PLAYERS.filter((p) => lib.playedInDecade(p, d)).length >= 15, String(d));
  assert.ok(NBA_PLAYERS.filter((p) => p.active).length >= 40);
});

test("filters combine correctly", () => {
  const base = { status: "all", team: "", pos: "", era: "" };
  assert.equal(lib.filterPlayers(base).length, NBA_PLAYERS.length);
  assert.ok(lib.filterPlayers({ ...base, status: "active" }).every((p) => p.active));
  assert.ok(lib.filterPlayers({ ...base, status: "retired" }).every((p) => !p.active));
  assert.ok(lib.filterPlayers({ ...base, team: "Lakers", pos: "C" }).every((p) => p.teams.includes("Lakers") && p.pos === "C"));
  assert.ok(lib.filterPlayers({ ...base, era: "1990" }).every((p) => lib.playedInDecade(p, 1990)));
  assert.equal(lib.filterPlayers({ ...base, status: "retired", era: "2020" }).filter((p) => p.active).length, 0);
});

test("lock keeps cards and reroll never duplicates", () => {
  const f = { status: "all", team: "", pos: "", era: "" };
  for (let seed = 1; seed <= 200; seed++) {
    const first = lib.drawSlots([], new Set(), 6, f, [], rg.createRng(seed));
    assert.equal(first.slots.length, 6);
    const lock = new Set([first.slots[1].id, first.slots[4].id]);
    const again = lib.drawSlots(first.slots, lock, 6, f, first.used, rg.createRng(seed + 999));
    assert.equal(again.slots.length, 6);
    assert.equal(again.slots[1].id, first.slots[1].id);
    assert.equal(again.slots[4].id, first.slots[4].id);
    assert.equal(new Set(again.slots.map((p) => p.id)).size, 6);
  }
});

test("small pools return only what matches", () => {
  const f = { status: "active", team: "Pelicans", pos: "C", era: "" };
  const n = lib.filterPlayers(f).length;
  const out = lib.drawSlots([], new Set(), 10, f, [], rg.createRng(5));
  assert.equal(out.slots.length, Math.min(10, n));
  assert.equal(out.short, n < 10);
});

test("daily five is deterministic, one per position, and varies by day", () => {
  const d = lib.dayNumber(new Date("2026-10-28T12:00:00Z"));
  const a = lib.dailyFive(d), b = lib.dailyFive(d);
  assert.deepEqual(a.map((p) => p.id), b.map((p) => p.id));
  assert.deepEqual(a.map((p) => p.pos), ["PG", "SG", "SF", "PF", "C"]);
  const seen = new Set();
  for (let i = 0; i < 60; i++) seen.add(lib.dailyFive(d + i).map((p) => p.id).join());
  assert.ok(seen.size > 50);
  assert.match(lib.fiveShareText(d, a, "https://x.test"), /^Random NBA starting five · Oct 28, 2026\nPG /);
});

console.log(`nba players: ${passed} tests passed`);
