// Unit tests for /trivia-questions and /trivia-questions/halloween: the JSON
// question banks (schema, counts, duplicates), the no-repeat draw, category and
// difficulty filters, multiple-choice options, the team scoreboard, the sitemap
// and the art requests.
// Run: node scripts/trivia-regression.mjs (also part of generators:test)
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
const dataDir = resolve(root, "src/data/trivia");
const CATEGORIES = ["general", "kids", "math", "science", "history", "geography", "movies", "music", "sports", "food"];
const BANK_FILES = [...CATEGORIES, "halloween"];
const DIFFICULTIES = ["easy", "medium", "hard"];

const banks = Object.fromEntries(
  BANK_FILES.map((name) => [name, JSON.parse(readFileSync(resolve(dataDir, `${name}.json`), "utf8"))]),
);
const overrides = Object.fromEntries(BANK_FILES.map((name) => [`@/data/trivia/${name}.json`, banks[name]]));
const tv = load("src/lib/trivia.ts", overrides);
const all = Object.values(banks).flat();

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
const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

/* ---------------- T3: data ---------------- */

const FIELDS = ["id", "question", "answer", "distractors", "category", "difficulty", "explanation"];

test("T3 every bank file exists and no stray files", () => {
  const files = readdirSync(dataDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
  assert.deepEqual(files, [...BANK_FILES].sort());
});

test("T3 schema: required fields, types, difficulty, category matches file", () => {
  for (const [file, items] of Object.entries(banks)) {
    assert.ok(Array.isArray(items), file);
    for (const q of items) {
      const where = `${file}:${q.id}`;
      assert.deepEqual(Object.keys(q).sort(), [...FIELDS].sort(), where);
      assert.match(q.id, new RegExp(`^${file}-\\d{3}$`), where);
      assert.equal(q.category, file, where);
      assert.ok(DIFFICULTIES.includes(q.difficulty), `${where} difficulty ${q.difficulty}`);
      for (const k of ["question", "answer", "explanation"]) {
        assert.equal(typeof q[k], "string", `${where} ${k}`);
        assert.ok(q[k].trim().length > 0 && q[k] === q[k].trim(), `${where} ${k} empty or untrimmed`);
      }
      assert.match(q.question, /\?$/, `${where} question should end with ?`);
      assert.match(q.explanation, /[.!)"]$/, `${where} explanation punctuation`);
      assert.ok(q.answer.length <= 60, `${where} answer too long for a choice button`);
    }
  }
});

test("T3 distractors: 2–3 distinct strings, none equal to the answer", () => {
  for (const q of all) {
    assert.ok(Array.isArray(q.distractors), q.id);
    assert.ok(q.distractors.length >= 2 && q.distractors.length <= 3, `${q.id} has ${q.distractors.length} distractors`);
    for (const d of q.distractors) assert.ok(typeof d === "string" && d.trim() && d === d.trim(), `${q.id} distractor`);
    const options = [q.answer, ...q.distractors].map(norm);
    assert.equal(new Set(options).size, options.length, `${q.id} duplicate option`);
  }
});

test("T3 ids are unique across files", () => {
  const ids = all.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("T3 no duplicate question text across files", () => {
  const seen = new Map();
  for (const q of all) {
    const key = norm(q.question);
    assert.ok(!seen.has(key), `${q.id} duplicates ${seen.get(key)}`);
    seen.set(key, q.id);
  }
});

test("T3 counts: total ≥ 800, halloween ≥ 50, each category ≥ 60 with every difficulty", () => {
  assert.ok(all.length >= 800, `only ${all.length} questions`);
  assert.ok(banks.halloween.length >= 50, `halloween has ${banks.halloween.length}`);
  for (const c of CATEGORIES) {
    assert.ok(banks[c].length >= 60, `${c} has ${banks[c].length}`);
    for (const d of DIFFICULTIES) assert.ok(banks[c].filter((q) => q.difficulty === d).length >= 10, `${c}/${d} under 10`);
  }
  for (const d of DIFFICULTIES) assert.ok(banks.halloween.filter((q) => q.difficulty === d).length >= 8, `halloween/${d}`);
});

test("T3 content stays evergreen (no 'current/latest/reigning' wording)", () => {
  const bad = /\b(current(ly)?|latest|reigning|nowadays|this year|right now|as of)\b/i;
  for (const q of all) assert.ok(!bad.test(q.question) && !bad.test(q.answer), `${q.id}: ${q.question}`);
});

test("library exposes the same banks", () => {
  assert.deepEqual([...tv.TRIVIA_CATEGORY_IDS], CATEGORIES);
  assert.equal(tv.ALL_TRIVIA.length, all.length);
  assert.equal(tv.TRIVIA_BANKS.halloween.length, banks.halloween.length);
  for (const c of CATEGORIES) assert.ok(tv.TRIVIA_CATEGORIES[c].label && tv.TRIVIA_CATEGORIES[c].emoji, c);
});

/* ---------------- T1: filters ---------------- */

test("T1 category and difficulty filters only return matching items", () => {
  const pool = tv.CATEGORY_TRIVIA;
  assert.equal(pool.length, all.length - banks.halloween.length, "main pool excludes the seasonal bank");
  assert.equal(tv.filterTrivia(pool, { category: "all", difficulty: "all" }).length, pool.length);
  for (const category of CATEGORIES) {
    const byCat = tv.filterTrivia(pool, { category, difficulty: "all" });
    assert.equal(byCat.length, banks[category].length, category);
    assert.ok(byCat.every((q) => q.category === category), category);
    for (const difficulty of DIFFICULTIES) {
      const both = tv.filterTrivia(pool, { category, difficulty });
      assert.ok(both.length > 0, `${category}/${difficulty} empty`);
      assert.ok(both.every((q) => q.category === category && q.difficulty === difficulty), `${category}/${difficulty}`);
    }
  }
  for (const difficulty of DIFFICULTIES) {
    const byDiff = tv.filterTrivia(pool, { category: "all", difficulty });
    assert.ok(byDiff.length > 0 && byDiff.every((q) => q.difficulty === difficulty), difficulty);
  }
  const hw = tv.filterTrivia(tv.TRIVIA_BANKS.halloween, { category: "all", difficulty: "hard" });
  assert.ok(hw.length > 0 && hw.every((q) => q.category === "halloween" && q.difficulty === "hard"));
});

/* ---------------- T1: draw ---------------- */

test("T1 draw sequence has no repeats within a game, then reports the bank as finished", () => {
  for (const filters of [
    { category: "math", difficulty: "hard" },
    { category: "all", difficulty: "easy" },
    { category: "all", difficulty: "all" },
  ]) {
    const pool = tv.filterTrivia(tv.CATEGORY_TRIVIA, filters);
    const rng = tv.createRng(7);
    let used = [];
    const seen = new Set();
    for (let i = 0; i < pool.length; i++) {
      const out = tv.drawQuestion(pool, used, rng);
      assert.ok(out.question, `ran dry early at ${i}`);
      assert.ok(!seen.has(out.question.id), `repeat ${out.question.id} at ${i}`);
      assert.ok(pool.includes(out.question));
      seen.add(out.question.id);
      used = out.used;
    }
    assert.equal(seen.size, pool.length);
    const after = tv.drawQuestion(pool, used, rng);
    assert.equal(after.question, null, "no repeat once every question is used");
    assert.equal(after.finished, true);
  }
});

test("T1 used ids from another filter do not block the current one", () => {
  const hard = tv.filterTrivia(tv.CATEGORY_TRIVIA, { category: "science", difficulty: "hard" });
  const used = hard.map((q) => q.id);
  const easy = tv.filterTrivia(tv.CATEGORY_TRIVIA, { category: "science", difficulty: "easy" });
  const out = tv.drawQuestion(easy, used, tv.createRng(3));
  assert.ok(out.question && out.question.difficulty === "easy");
  assert.ok(!used.includes(out.question.id));
});

test("T1 draws are deterministic by seed and an empty pool returns null", () => {
  const pool = tv.CATEGORY_TRIVIA;
  assert.equal(tv.drawQuestion(pool, [], tv.createRng(42)).question.id, tv.drawQuestion(pool, [], tv.createRng(42)).question.id);
  const none = tv.drawQuestion([], [], tv.createRng(1));
  assert.equal(none.question, null);
});

test("T1 multiple-choice options are the answer plus distractors, shuffled", () => {
  let moved = 0;
  for (const q of all) {
    const opts = tv.choicesFor(q, tv.createRng(q.id.length * 31 + 5));
    assert.deepEqual([...opts].sort(), [q.answer, ...q.distractors].sort(), q.id);
    if (opts[0] !== q.answer) moved++;
  }
  assert.ok(moved > all.length / 3, "answer is not always first");
});

/* ---------------- T1: scoreboard ---------------- */

test("T1 scoreboard: 2 teams, add and subtract, below zero is allowed", () => {
  let b = tv.createScoreboard(2);
  assert.equal(b.length, 2);
  assert.deepEqual(b.map((t) => t.score), [0, 0]);
  assert.deepEqual(b.map((t) => t.name), ["Team 1", "Team 2"]);
  b = tv.adjustScore(b, 0, 1);
  b = tv.adjustScore(b, 0, 1);
  b = tv.adjustScore(b, 1, 1);
  b = tv.adjustScore(b, 1, -1);
  b = tv.adjustScore(b, 1, -1);
  assert.deepEqual(b.map((t) => t.score), [2, -1], "penalties may push a team below zero");
  assert.deepEqual(tv.leaders(b), [0]);
});

test("T1 scoreboard: 8 teams, immutable updates, ties and bounds", () => {
  const start = tv.createScoreboard(8);
  assert.equal(start.length, 8);
  let b = start;
  for (let i = 0; i < 8; i++) for (let k = 0; k <= i; k++) b = tv.adjustScore(b, i, 1);
  assert.deepEqual(b.map((t) => t.score), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(start.map((t) => t.score), [0, 0, 0, 0, 0, 0, 0, 0], "original untouched");
  b = tv.adjustScore(b, 7, -3);
  b = tv.adjustScore(b, 3, 1);
  assert.deepEqual(b.map((t) => t.score), [1, 2, 3, 5, 5, 6, 7, 5]);
  assert.deepEqual(tv.leaders(b), [6]);
  b = tv.adjustScore(b, 6, -1);
  assert.deepEqual(tv.leaders(b), [5, 6], "ties share the lead");
  assert.equal(tv.adjustScore(b, 99, 1), b, "out-of-range team is a no-op");
  assert.deepEqual(tv.leaders(tv.createScoreboard(3)), [], "nobody leads at 0–0–0");
  assert.equal(tv.createScoreboard(1).length, 2, "minimum two teams");
  assert.equal(tv.createScoreboard(12).length, 8, "maximum eight teams");
  assert.equal(tv.resizeScoreboard(b, 3).length, 3);
  assert.deepEqual(tv.resizeScoreboard(b, 3).map((t) => t.score), [1, 2, 3], "resizing keeps scores");
  assert.deepEqual(tv.resizeScoreboard(tv.createScoreboard(2), 4).map((t) => t.name), ["Team 1", "Team 2", "Team 3", "Team 4"]);
});

test("T1 timer presets are sane", () => {
  assert.ok(tv.TIMER_OPTIONS.includes(tv.DEFAULT_TIMER));
  assert.ok(tv.TIMER_OPTIONS.every((s) => Number.isInteger(s) && s >= 0 && s <= 120));
  assert.equal(tv.formatSeconds(75), "1:15");
  assert.equal(tv.formatSeconds(9), "0:09");
});

/* ---------------- static list ---------------- */

test("static 100-question list: 10 per category, deterministic, all real items", () => {
  const list = tv.staticList(10);
  assert.equal(list.length, CATEGORIES.length);
  assert.equal(list.flatMap((g) => g.questions).length, 100);
  for (const g of list) {
    assert.equal(g.questions.length, 10, g.category);
    assert.ok(g.questions.every((q) => q.category === g.category));
    assert.ok(DIFFICULTIES.every((d) => g.questions.some((q) => q.difficulty === d)), `${g.category} mixes difficulties`);
  }
  assert.deepEqual(tv.staticList(10).flatMap((g) => g.questions.map((q) => q.id)), list.flatMap((g) => g.questions.map((q) => q.id)));
});

/* ---------------- sitemap & art ---------------- */

test("both URLs are in the sitemap source", () => {
  const src = readFileSync(resolve(root, "src/app/sitemap.ts"), "utf8");
  assert.match(src, /"trivia-questions"/);
  assert.match(src, /"trivia-questions\/halloween"/);
  const cfg = readFileSync(resolve(root, "src/i18n/config.ts"), "utf8");
  assert.match(cfg, /"\/trivia-questions"/, "English-only until the Spanish page ships");
  assert.match(cfg, /"\/trivia-questions\/halloween"/);
});

test("art requests: both heroes requested with pending|done status", () => {
  const art = JSON.parse(readFileSync(resolve(root, "docs/art-requests.json"), "utf8"));
  assert.ok(typeof art._readme === "string" && Array.isArray(art.requests));
  const ids = art.requests.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length, "unique art request ids");
  for (const path of ["public/art/trivia/hero.jpg", "public/art/trivia/halloween-hero.jpg"]) {
    const r = art.requests.find((x) => x.path === path);
    assert.ok(r, `missing art request for ${path}`);
    for (const k of ["id", "page", "path", "prompt", "alt", "status"]) assert.ok(typeof r[k] === "string" && r[k], `${path} ${k}`);
    assert.match(r.status, /^(pending|done)$/);
    if (r.status === "done") assert.ok(existsSync(resolve(root, r.path)), `${path} marked done but missing`);
  }
});

console.log(`✓ trivia: ${passed} tests passed (${all.length} questions, ${banks.halloween.length} halloween)`);
