// Daily Writing Journal: prompt determinism, streak, free limit, day validation,
// and route source checks. Pure logic; no network.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
let checks = 0;
const check = (ok, message) => { assert.ok(ok, message); checks++; };
const j = load("src/lib/subs/journal.ts");

// Prompts
check(j.FREE_ENTRIES === 3, "3 free entries");
check(j.PROMPT_POOL_SIZE >= 366, `pool covers a leap year (${j.PROMPT_POOL_SIZE})`);
check(j.promptForDay("2026-10-24") === j.promptForDay("2026-10-24"), "prompt is stable for a date");
for (const year of [2026, 2027, 2028]) {
  const seen = new Set();
  let day = `${year}-01-01`;
  while (day.startsWith(String(year))) { seen.add(j.promptForDay(day)); day = j.addDays(day, 1); }
  check(seen.size === (year === 2028 ? 366 : 365), `no repeats in ${year} (${seen.size})`);
}
check(j.promptForDay("2026-03-01") !== j.promptForDay("2027-03-01") || j.promptForDay("2026-03-02") !== j.promptForDay("2027-03-02"), "different years use different orders");
check(j.promptForDay("2026-10-24").length > 10 && j.promptForDay("2026-10-24").length <= 500, "prompt fits the 500-char column");
let longest = 0, d = "2026-01-01";
for (let i = 0; i < 365; i++) { longest = Math.max(longest, j.promptForDay(d).length); d = j.addDays(d, 1); }
check(longest <= 500, `all prompts <= 500 chars (${longest})`);
assert.throws(() => j.promptForDay("2026-13-40")); checks++;

// Streak
const T = "2026-10-24";
check(j.streak([], T) === 0, "no entries: 0");
check(j.streak(["2026-10-24"], T) === 1, "today only: 1");
check(j.streak(["2026-10-23"], T) === 1, "yesterday only keeps streak 1");
check(j.streak(["2026-10-22"], T) === 0, "gap of two days: 0");
check(j.streak(["2026-10-24", "2026-10-23", "2026-10-22", "2026-10-20"], T) === 3, "stops at a gap");
check(j.streak(["2026-10-23", "2026-10-22", "2026-10-21"], T) === 3, "ending yesterday counts");
check(j.streak(["2026-10-24", "2026-10-24", "2026-10-23"], T) === 2, "duplicates ignored");
check(j.streak(["2026-03-01", "2026-02-28", "2026-02-27"], "2026-03-01") === 3, "month boundary");
check(j.streak(["2027-01-01", "2026-12-31"], "2027-01-01") === 2, "year boundary");
check(j.streak(["bad", T], T) === 1, "invalid day strings ignored");

// Free limit
check(j.canSave({ hasPlan: false, isNewDay: true, entryCount: 2 }), "3rd new entry allowed");
check(!j.canSave({ hasPlan: false, isNewDay: true, entryCount: 3 }), "4th new entry blocked without plan");
check(j.canSave({ hasPlan: false, isNewDay: false, entryCount: 3 }), "editing an existing day always allowed");
check(j.canSave({ hasPlan: false, isNewDay: false, entryCount: 50 }), "editing allowed even above the limit");
check(j.canSave({ hasPlan: true, isNewDay: true, entryCount: 100 }), "plan: unlimited");
check(j.freeLeft(0) === 3 && j.freeLeft(2) === 1 && j.freeLeft(9) === 0, "freeLeft");

// Validation
const ok = (day, body = "hello") => j.validateEntry({ day, body }, T);
check(ok(T).ok, "today valid");
check(ok("2026-10-17").ok, "7 days ago valid");
check(!ok("2026-10-16").ok, "8 days ago rejected");
check(!ok("2026-10-25").ok, "future rejected");
check(!ok("2026-02-30").ok && !ok("nope").ok && !j.validateEntry({ day: 5, body: "x" }, T).ok, "malformed day rejected");
check(!ok(T, "").ok && !ok(T, "   \n").ok && !j.validateEntry({ day: T, body: 5 }, T).ok, "empty body rejected");
check(ok(T, "x".repeat(20000)).ok && !ok(T, "x".repeat(20001)).ok, "body limit 20000");

// Route source
const route = readFileSync(resolve(root, "src/app/api/sub/journal/route.ts"), "utf8");
check(/status|, 402\)/.test(route) && route.includes("paywall: true") && route.includes("402"), "402 paywall path");
check(route.includes("canSave(") && route.includes("isNewDay: !existing"), "new-day check uses canSave");
check(route.includes("prompt: promptForDay(day)") && !/body\.prompt/.test(route), "prompt computed server-side");
check(route.includes("rateLimit(") && route.includes('"save"'), "saves are rate limited");
check(/\.eq\("user_id", user\.id\)/.test(route) && route.includes('action === "delete"'), "delete scoped to the user");
check(route.includes("subContext(request)"), "uses subContext");
console.log(`subs-journal-regression: ${checks} checks passed`);
