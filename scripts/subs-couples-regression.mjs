// Couples Daily Question: question permutation, trial window, streak, answer
// visibility, join rules and room codes. Pure logic, no network.
import assert from "node:assert/strict";
import { load } from "./lib/load-typescript.mjs";

let checks = 0;
const check = (ok, message) => { assert.ok(ok, message); checks++; };
const c = load("src/lib/subs/couples.ts");
const data = load("src/data/couplesDaily.ts");

// Pools
for (const [lang, pool] of [["en", data.COUPLES_QUESTIONS_EN], ["es", data.COUPLES_QUESTIONS_ES]]) {
  check(pool.length >= 120, `${lang} pool has at least 120 questions (${pool.length})`);
  check(new Set(pool).size === pool.length, `${lang} pool has no duplicates`);
  check(pool.every((q) => q.endsWith("?") && q.length < 300), `${lang} questions are single questions`);
}

// Determinism and no repeats until the pool is used up, per room and language
const room = "3f2c1a9e-aaaa-4bbb-8ccc-0123456789ab";
for (const lang of ["en", "es"]) {
  const n = c.questionPool(lang).length;
  const first = Array.from({ length: n }, (_, d) => c.questionForDay(room, d, lang));
  const again = Array.from({ length: n }, (_, d) => c.questionForDay(room, d, lang));
  check(first.every((q, i) => q === again[i]), `${lang}: same room and day give the same question`);
  check(new Set(first).size === n, `${lang}: ${n} days in a row never repeat`);
  const second = Array.from({ length: n }, (_, d) => c.questionForDay(room, n + d, lang));
  check(new Set(second).size === n, `${lang}: second cycle also covers the whole pool`);
  const other = Array.from({ length: 10 }, (_, d) => c.questionForDay("another-room-id-0000", d, lang));
  check(other.join("|") !== first.slice(0, 10).join("|"), `${lang}: different rooms get different orders`);
}
check(c.questionForDay(room, 0, "en") !== c.questionForDay(room, 0, "es"), "Spanish room gets a Spanish question");
check(c.questionForDay(room, -5, "en") === c.questionForDay(room, 0, "en"), "Negative day clamps to day 0");

// Trial window by time zone: free for room days 0, 1, 2
const created = "2026-10-24T23:30:00Z"; // 24 Oct in UTC, 25 Oct in Tokyo, 24 Oct in New York
check(c.dayIn(created, "UTC") === "2026-10-24", "UTC creation day");
check(c.dayIn(created, "Asia/Tokyo") === "2026-10-25", "Tokyo creation day is the next date");
check(c.dayIndex(created, "2026-10-24", "UTC") === 0, "creation day is day 0");
check(c.trialOpen(created, "2026-10-26", "UTC"), "day 2 is still free");
check(!c.trialOpen(created, "2026-10-27", "UTC"), "day 3 needs a plan");
check(c.trialOpen(created, "2026-10-27", "Asia/Tokyo"), "Tokyo room: 27 Oct is day 2, still free");
check(!c.trialOpen(created, "2026-10-28", "Asia/Tokyo"), "Tokyo room: 28 Oct is day 3");
check(c.trialDaysLeft(created, "2026-10-24", "UTC") === 3 && c.trialDaysLeft(created, "2026-10-26", "UTC") === 1 && c.trialDaysLeft(created, "2026-11-10", "UTC") === 0, "trial days left counts down to 0");
check(c.dayIn(created, "Not/AZone") === "2026-10-24", "unknown zone falls back to UTC");
check(c.canAnswerToday(true, false) && c.canAnswerToday(false, true) && !c.canAnswerToday(false, false), "answering needs trial or plan");

// Streak
check(c.streak([], "2026-10-24") === 0, "empty streak is 0");
check(c.streak(["2026-10-22", "2026-10-23", "2026-10-24"], "2026-10-24") === 3, "streak through today");
check(c.streak(["2026-10-21", "2026-10-22", "2026-10-23"], "2026-10-24") === 3, "open today does not break the streak");
check(c.streak(["2026-10-20", "2026-10-21"], "2026-10-24") === 0, "a missed day resets the streak");
check(c.streak(["2026-10-18", "2026-10-22", "2026-10-23", "2026-10-24"], "2026-10-24") === 3, "gap before the run does not count");
check(c.streak(["2026-09-30", "2026-10-01"], "2026-10-01") === 2, "streak crosses a month boundary");
const rows = [{ day: "2026-10-23", user_id: "a" }, { day: "2026-10-23", user_id: "b" }, { day: "2026-10-24", user_id: "a" }];
check(c.daysBothAnswered(rows).join() === "2026-10-23", "only days both answered count");

// No partner-answer leak
const mine = { user_id: "a", answer: "my words" };
const theirs = { user_id: "b", answer: "secret words" };
let shaped = c.shapeToday([theirs], "a");
check(shaped.answers === null && shaped.answered.partner && !shaped.answered.me, "partner answered first: I get a boolean, no text");
check(!JSON.stringify(shaped).includes("secret"), "partner text absent before I answer");
shaped = c.shapeToday([mine], "a");
check(shaped.answers === null && shaped.answered.me && !shaped.answered.partner, "I answered first: nothing to reveal");
shaped = c.shapeToday([mine, theirs], "a");
check(shaped.answers.mine === "my words" && shaped.answers.theirs === "secret words", "both answered: reveal both");
shaped = c.shapeToday([mine, theirs], "b");
check(shaped.answers.mine === "secret words" && shaped.answers.theirs === "my words", "reveal is mirrored for the partner");
shaped = c.shapeToday([], "a");
check(shaped.answers === null && !shaped.answered.me && !shaped.answered.partner, "empty day");

// Answer validation
check(c.cleanAnswer("  hi  ") === "hi" && c.cleanAnswer("") === null && c.cleanAnswer("   ") === null && c.cleanAnswer(5) === null, "answer is trimmed and non-empty");
check(c.cleanAnswer("x".repeat(2000)) !== null && c.cleanAnswer("x".repeat(2001)) === null, "answer limit is 2000 characters");

// Join rules
const open = { id: "r1", owner_id: "owner", partner_id: null };
check(c.joinCheck(open, "guest", false).ok === true, "a guest can join an open room");
check(c.joinCheck(open, "owner", false).ok === false, "the owner cannot join their own room");
check(c.joinCheck({ ...open, partner_id: "p" }, "guest", false).status === 409, "a full room is closed");
check(c.joinCheck({ ...open, partner_id: "p" }, "p", false).already === true, "the partner re-joining is idempotent");
check(c.joinCheck(null, "guest", false).status === 404, "unknown code is 404");
check(c.joinCheck(open, "guest", true).status === 409, "someone already in another room cannot join");
check(c.isMember(open, "owner") && !c.isMember(open, "guest"), "only members can read a room");

// Room codes match the DB check ^[A-Za-z0-9]{10,16}$
const seen = new Set();
for (let i = 0; i < 500; i++) {
  const code = c.roomCode();
  check(/^[A-Za-z0-9]{10,16}$/.test(code) && code.length === 12, "room code format");
  seen.add(code);
}
check(seen.size === 500, "room codes do not collide");
check(c.validCode("abcDEF123456") === "abcDEF123456" && c.validCode("short") === null && c.validCode("has space123456") === null && c.validCode("x".repeat(17)) === null && c.validCode(undefined) === null, "validCode mirrors the DB check");

console.log(`subs-couples-regression: ${checks} checks passed`);
