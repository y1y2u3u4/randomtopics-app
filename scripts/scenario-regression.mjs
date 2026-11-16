// Tests for /scenario-generator: scenario data rules, filters, no-repeat draws,
// name filling ({{user}}/{{char}} tags), share links and the daily scenario.
// Run: node scripts/scenario-regression.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import { load } from "./lib/load-typescript.mjs";

const s = load("src/lib/generators/scenarios.ts");
const { createRng } = load("src/lib/randomGenerators.ts");
const { SCENARIOS, MODES, GENRES, TONES, TWISTS, DEFAULT_FILTERS, EMPTY_NAMES } = s;
let passed = 0;
const test = (name, fn) => { try { fn(); passed++; } catch (e) { console.error(`x ${name}`); throw e; } };
const words = (t) => t.trim().split(/\s+/).length;
const placeholders = (t) => new Set([...t.matchAll(/\{([a-z]+)\}/g)].map((m) => m[1]));

test("240 scenarios, unique ids, known mode/genre/tone/cast", () => {
  assert.equal(SCENARIOS.length, 240);
  assert.equal(new Set(SCENARIOS.map((x) => x.id)).size, SCENARIOS.length);
  for (const x of SCENARIOS) {
    assert.match(x.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, x.id);
    assert.ok(MODES.some((m) => m.id === x.mode), x.id);
    assert.ok(GENRES.some((g) => g.id === x.genre), x.id);
    assert.ok(TONES.some((t) => t.id === x.tone), x.id);
    assert.ok([1, 2, 3].includes(x.cast), x.id);
  }
});

test("every mode × genre has 10 and every mode × cast × tone has at least 4", () => {
  for (const m of MODES) {
    for (const g of GENRES) assert.equal(SCENARIOS.filter((x) => x.mode === m.id && x.genre === g.id).length, 10, `${m.id}/${g.id}`);
    for (const c of [1, 2, 3]) for (const t of TONES) {
      assert.ok(s.pool({ ...DEFAULT_FILTERS, mode: m.id, cast: c, tones: [t.id] }).length >= 4, `${m.id}/${c}/${t.id}`);
    }
  }
});

test("placeholders match the cast size in text and hook", () => {
  for (const x of SCENARIOS) {
    const want = ["a", "b", "c"].slice(0, x.cast);
    const inText = placeholders(x.text);
    for (const k of want) assert.ok(inText.has(k), `${x.id} text missing {${k}}`);
    for (const part of [x.text, x.hook]) {
      for (const k of placeholders(part)) assert.ok(want.includes(k), `${x.id} uses {${k}} with cast ${x.cast}`);
    }
  }
});

test("scenario text is 20–60 words; OC hooks are questions; content stays SFW", () => {
  const banned = /\b(sex|sexual|nude|naked|gore|torture|suicide|self-harm|rape)\b/i;
  for (const x of SCENARIOS) {
    const n = words(x.text);
    assert.ok(n >= 20 && n <= 60, `${x.id}: ${n} words`);
    assert.ok(x.hook.trim().length > 5, x.id);
    if (x.mode === "oc") assert.ok(x.hook.trim().endsWith("?"), `${x.id} hook`);
    assert.ok(!banned.test(`${x.text} ${x.hook}`), x.id);
  }
});

// Guards against template-stitched data (a 2026-11-16 draft reused the same second
// sentence and hook across dozens of scenarios, which reads like a phrase mixer).
test("scenarios are individually written: unique hooks, no shared 6-word runs, ids not numbered templates", () => {
  const norm = (t) => t.toLowerCase().replace(/\{[abc]\}/g, "x").replace(/[^a-z0-9x ]/g, " ").split(/\s+/).filter(Boolean);
  assert.equal(new Set(SCENARIOS.map((x) => norm(x.hook).join(" "))).size, SCENARIOS.length, "every hook is unique");
  const seenIn = new Map();
  for (const x of SCENARIOS) {
    const w = norm(x.text);
    for (const g of new Set(w.slice(0, -5).map((_, i) => w.slice(i, i + 6).join(" ")))) seenIn.set(g, [...(seenIn.get(g) ?? []), x.id]);
  }
  const repeated = [...seenIn].filter(([, ids]) => ids.length > 2);
  assert.deepEqual(repeated.slice(0, 5), [], `6-word phrases reused in 3+ scenarios: ${repeated.length}`);
  const opener = new Map();
  for (const x of SCENARIOS) { const k = norm(x.text).slice(0, 2).join(" "); opener.set(k, (opener.get(k) ?? 0) + 1); }
  for (const [k, n] of opener) assert.ok(n <= 12, `${n} scenarios open with "${k}"`);
  for (const x of SCENARIOS) assert.doesNotMatch(x.id, /-\d+$/, `${x.id}: use a descriptive slug`);
});

test("solo scenarios use singular verbs for {a}", () => {
  for (const x of SCENARIOS.filter((y) => y.cast === 1)) {
    assert.doesNotMatch(`${x.text} ${x.hook}`, /\{a\} (share|are|have|were|must both|each)\b/, x.id);
  }
});

test("twists use only {a}, have known tones, and every tone has at least 6", () => {
  assert.equal(new Set(TWISTS.map((t) => t.id)).size, TWISTS.length);
  for (const t of TWISTS) {
    for (const k of placeholders(t.text)) assert.equal(k, "a", t.id);
    for (const tone of t.tones) assert.ok(TONES.some((x) => x.id === tone), t.id);
  }
  for (const tone of TONES) assert.ok(TWISTS.filter((t) => t.tones.includes(tone.id)).length >= 6, tone.id);
});

test("filters narrow the pool and a twist matches the scenario tone", () => {
  const f = { ...DEFAULT_FILTERS, mode: "roleplay", genres: ["fantasy", "horror"], tones: ["dark"], cast: 2 };
  const p = s.pool(f);
  assert.ok(p.length > 0);
  for (const x of p) assert.ok(x.mode === "roleplay" && ["fantasy", "horror"].includes(x.genre) && x.tone === "dark" && x.cast === 2);
  for (let seed = 1; seed < 50; seed++) {
    const r = s.roll(f, createRng(seed)).roll;
    assert.ok(p.includes(r.scenario));
    assert.ok(s.twistById(r.twist).tones.includes(r.scenario.tone), r.twist);
  }
  assert.equal(s.roll({ ...f, twist: false }, createRng(1)).roll.twist, null);
});

test("an impossible filter returns null instead of throwing", () => {
  const empty = SCENARIOS.filter((x) => x.mode === "oc" && x.genre === "romance" && x.cast === 3 && x.tone === "dark").length === 0;
  const f = { ...DEFAULT_FILTERS, genres: ["romance"], tones: ["dark"], cast: 3 };
  if (empty) assert.equal(s.roll(f, createRng(1)), null);
  else assert.ok(s.roll(f, createRng(1)));
  assert.equal(s.roll({ ...DEFAULT_FILTERS, genres: ["nope"] }, createRng(1)), null);
});

test("no scenario repeats until the filtered pool is used up", () => {
  const f = { ...DEFAULT_FILTERS, mode: "writing", genres: ["mystery"] };
  const size = s.pool(f).length;
  let seen = [], prev = null;
  const ids = [];
  const rng = createRng(9);
  for (let i = 0; i < size; i++) {
    const out = s.roll(f, rng, seen, prev);
    ids.push(out.roll.scenario.id); seen = out.seen; prev = out.roll;
  }
  assert.equal(new Set(ids).size, size);
  const next = s.roll(f, rng, seen, prev);
  assert.notEqual(next.roll.scenario.id, prev.scenario.id, "no back-to-back repeat after the cycle restarts");
});

test("keepScenario rerolls only the twist", () => {
  const first = s.roll(DEFAULT_FILTERS, createRng(3)).roll;
  const again = s.roll(DEFAULT_FILTERS, createRng(4), [], first, true).roll;
  assert.equal(again.scenario.id, first.scenario.id);
  assert.notEqual(again.twist, first.twist);
});

test("names fill placeholders; blanks fall back; tags give {{user}}/{{char}}", () => {
  const text = "{a} meets {b} while {c} watches. {a} leaves.";
  assert.equal(s.fill(text, { a: "Mira", b: "Ode", c: "" }), "Mira meets Ode while Character C watches. Mira leaves.");
  assert.equal(s.fill(text, EMPTY_NAMES, true), "{{user}} meets {{char}} while Character C watches. {{user}} leaves.");
  assert.equal(s.fill("{a}", { a: "  <b>{x}</b>   Lee  ", b: "", c: "" }), "bx/b Lee");
  assert.equal(s.cleanName("x".repeat(80)).length, s.MAX_NAME);
});

test("share link reopens the exact scenario, twist, names and tag mode", () => {
  const r = s.exampleRoll(11, { mode: "roleplay", cast: 2 });
  const names = { a: "Mira Vale", b: "Ode", c: "" };
  const p = s.rollToParams(r, names, true);
  const back = s.rollFromParams(new URLSearchParams(p.toString()));
  assert.equal(back.roll.scenario.id, r.scenario.id);
  assert.equal(back.roll.twist, r.twist);
  assert.deepEqual(back.names, names);
  assert.equal(back.tags, true);
  assert.equal(s.rollFromParams(new URLSearchParams("s=not-real")), null);
  assert.equal(s.rollFromParams(new URLSearchParams(`s=${r.scenario.id}&t=bogus`)).roll.twist, null);
});

test("mode and filters can be set from the URL", () => {
  const f = s.filtersFromParams(new URLSearchParams("mode=roleplay&genre=fantasy,bogus,horror&tone=dark&cast=2&twist=0"));
  assert.deepEqual(f, { mode: "roleplay", genres: ["fantasy", "horror"], tones: ["dark"], cast: 2, twist: false });
  assert.deepEqual(s.filtersFromParams(new URLSearchParams("mode=nope&cast=7")), DEFAULT_FILTERS);
});

test("copy text includes the label, filled scenario, twist and hook", () => {
  const r = s.exampleRoll(5, { mode: "writing" });
  const t = s.rollText(r, EMPTY_NAMES, false, "https://randomtopics.app/scenario-generator?s=x");
  assert.match(t.split("\n")[0], /^Writing scenario \(/);
  assert.ok(t.includes("Twist: "));
  assert.ok(t.includes("First sentence: "));
  assert.ok(!/\{[abc]\}/.test(t), "no raw placeholders in copied text");
  assert.ok(t.endsWith("?s=x"));
});

test("today's scenario is the same all day, rotates modes and changes daily", () => {
  const d = s.dayNumber(new Date("2026-11-16T03:00:00Z"));
  assert.equal(d, s.DAILY_EPOCH);
  assert.equal(s.dayNumber(new Date("2026-11-16T23:59:00Z")), d);
  assert.deepEqual(s.dailyRoll(d), s.dailyRoll(d));
  assert.deepEqual([d, d + 1, d + 2].map((x) => s.dailyRoll(x).scenario.mode).sort(), ["oc", "roleplay", "writing"]);
  const week = new Set(Array.from({ length: 7 }, (_, i) => s.dailyRoll(d + i).scenario.id));
  assert.equal(week.size, 7);
  for (let i = 0; i < 7; i++) assert.ok(s.dailyRoll(d + i).twist);
});

test("page is wired into sitemap, registry, llms.txt, ad paths and links back to the story prompt generator", () => {
  assert.ok(fs.readFileSync("src/app/sitemap.ts", "utf8").includes('"scenario-generator"'));
  assert.ok(fs.readFileSync("src/data/generators/registry.ts", "utf8").includes('href: "/scenario-generator"'));
  assert.ok(fs.readFileSync("public/llms.txt", "utf8").includes("https://randomtopics.app/scenario-generator"));
  assert.ok(JSON.parse(fs.readFileSync("src/data/adPublicPaths.json", "utf8")).includes("/scenario-generator"));
  const page = fs.readFileSync("src/app/scenario-generator/page.tsx", "utf8");
  assert.ok(page.includes('href="/story-prompt-generator"'));
  assert.ok(fs.readFileSync("src/app/story-prompt-generator/page.tsx", "utf8").includes('href="/scenario-generator"'));
});

console.log(`scenario regression: ${passed} passed`);
