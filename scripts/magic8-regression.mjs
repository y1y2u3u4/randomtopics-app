// Tests for /magic-8-ball: the 20 classic answers, custom answers, daily question and streak.
// Run: node scripts/magic8-regression.mjs
import assert from "node:assert/strict";
import { load } from "./lib/load-typescript.mjs";

const lib = load("src/lib/magic8.ts");
const rg = load("src/lib/randomGenerators.ts");
let passed = 0;
const test = (name, fn) => { try { fn(); passed++; } catch (e) { console.error(`x ${name}`); throw e; } };

test("20 classic answers: 10 yes, 5 maybe, 5 no, all unique", () => {
  const a = lib.CLASSIC_ANSWERS;
  assert.equal(a.length, 20);
  assert.equal(new Set(a.map((x) => x.text)).size, 20);
  assert.deepEqual(lib.classicOdds(), { total: 20, yes: 10, maybe: 5, no: 5 });
  for (const t of ["It is certain", "Reply hazy, try again", "Don't count on it", "Very doubtful", "Signs point to yes"]) assert.ok(a.some((x) => x.text === t), t);
});

test("pickAnswer stays inside the pool and reaches every classic", () => {
  const pool = lib.answerPool(lib.EMPTY_CUSTOM);
  assert.equal(pool.length, 20);
  const rng = rg.createRng(5);
  const seen = new Set();
  for (let i = 0; i < 2000; i++) seen.add(lib.pickAnswer(pool, rng).text);
  assert.equal(seen.size, 20);
});

test("cleanCustom trims, dedupes, caps length and count", () => {
  assert.deepEqual(lib.cleanCustom(["  Ask  mom ", "ask mom", "", 5, null, "Yes!"]), ["Ask mom", "Yes!"]);
  assert.equal(lib.cleanCustom(["x".repeat(100)])[0].length, lib.MAX_ANSWER_LENGTH);
  assert.equal(lib.cleanCustom(Array.from({ length: 60 }, (_, i) => `a${i}`)).length, lib.MAX_CUSTOM);
});

test("parseCustom survives bad storage and keeps only valid modes", () => {
  assert.deepEqual(lib.parseCustom(null), lib.EMPTY_CUSTOM);
  assert.deepEqual(lib.parseCustom("{not json"), lib.EMPTY_CUSTOM);
  assert.deepEqual(lib.parseCustom('{"answers":"x","mode":"only"}'), lib.EMPTY_CUSTOM);
  assert.equal(lib.parseCustom('{"answers":[],"mode":"only"}').mode, "mix");
  assert.deepEqual(lib.parseCustom('{"answers":["A","B"],"mode":"only"}'), { answers: ["A", "B"], mode: "only" });
});

test("answerPool: mix adds to the 20, only uses just custom", () => {
  assert.equal(lib.answerPool({ answers: ["A", "B"], mode: "mix" }).length, 22);
  const only = lib.answerPool({ answers: ["A", "B"], mode: "only" });
  assert.deepEqual(only.map((x) => x.text), ["A", "B"]);
  assert.equal(lib.answerPool({ answers: [], mode: "only" }).length, 20);
});

test("daily question is stable per day, varies across days, no repeat within the bank length", () => {
  assert.equal(lib.dailyQuestion(20000), lib.dailyQuestion(20000));
  const n = lib.DAILY_QUESTIONS.length;
  assert.ok(n >= 60);
  const week = new Set(Array.from({ length: n }, (_, i) => lib.dailyQuestion(20000 + i)));
  assert.equal(week.size, n);
  assert.ok(lib.DAILY_QUESTIONS.every((q) => q.endsWith("?")));
  assert.equal(new Set(lib.DAILY_QUESTIONS).size, n);
});

test("dayNumber is UTC-based", () => {
  assert.equal(lib.dayNumber(new Date(Date.UTC(1970, 0, 2, 23, 59))), 1);
  assert.equal(lib.dayNumber(new Date(Date.UTC(2026, 9, 28, 0, 0))), 20754);
});

test("streak: consecutive days grow, same day is idempotent, a gap resets", () => {
  let s = lib.EMPTY_STREAK;
  s = lib.recordDaily(s, 100);
  assert.deepEqual(s, { last: 100, count: 1, best: 1 });
  assert.deepEqual(lib.recordDaily(s, 100), s);
  s = lib.recordDaily(s, 101);
  s = lib.recordDaily(s, 102);
  assert.deepEqual(s, { last: 102, count: 3, best: 3 });
  assert.equal(lib.streakOn(s, 103).count, 3);
  assert.equal(lib.streakOn(s, 104).count, 0);
  assert.equal(lib.streakOn(s, 104).best, 3);
  const after = lib.recordDaily(s, 105);
  assert.deepEqual(after, { last: 105, count: 1, best: 3 });
});

test("parseStreak rejects junk", () => {
  assert.deepEqual(lib.parseStreak("garbage"), lib.EMPTY_STREAK);
  assert.deepEqual(lib.parseStreak('{"last":-1,"count":1,"best":1}'), lib.EMPTY_STREAK);
  assert.deepEqual(lib.parseStreak('{"last":5,"count":2,"best":4}'), { last: 5, count: 2, best: 4 });
});

test("share text includes question, answer and URL", () => {
  const t = lib.resultText("Will it rain?", "Most likely");
  assert.match(t, /Q: Will it rain\?/);
  assert.match(t, /Most likely/);
  assert.match(t, /randomtopics\.app\/magic-8-ball/);
  assert.ok(!lib.resultText("", "Yes").includes("Q:"));
  assert.match(lib.dailyShareText(20754, "Q?", "Yes", 3), /3-day streak/);
});

console.log(`magic8-regression: ${passed} tests passed`);
