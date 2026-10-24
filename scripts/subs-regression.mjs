// Subscription products (2026-10-24): prices, Stripe line items, session checks,
// teacher warm-up schedule, roster wheel logic and event names. Pure logic; no network.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(resolve(root, file), "utf8");
let checks = 0;
const check = (ok, message) => { assert.ok(ok, message); checks++; };

// Approved prices (cents, USD). Do not change without the user's approval.
const products = load("src/lib/subs/products.ts");
const PRICES = { teacher: [300, 2400], bot: [700, 5900], journal: [399, 2999], couples: [499, 2999], wheel: [299, 1999] };
for (const [p, [m, y]] of Object.entries(PRICES)) {
  check(products.SUB_PRODUCTS[p].monthly === m && products.SUB_PRODUCTS[p].yearly === y, `${p} price is ${m}/${y}`);
  check(products.SUB_PRODUCTS[p].stripeName.startsWith("RandomTopics ") && products.SUB_PRODUCTS[p].stripeName.includes("—"), `${p} Stripe name says what is included`);
}
check(products.SUB_PRODUCT_LIST.length === 5, "five products");
check(products.usd(399) === "$3.99" && products.usd(300) === "$3", "usd formatting");
check(products.subProduct("teacher") === "teacher" && products.subProduct("toString") === null && products.subProduct(1) === null, "product validation");

// Stripe line items and session verification
const purchases = load("src/lib/subs/purchases.ts");
const item = purchases.subLineItem("couples", "yearly");
check(item.price_data.currency === "usd" && item.price_data.unit_amount === 2999 && item.price_data.recurring.interval === "year", "yearly couples line item");
check(item.price_data.product_data.metadata.product === purchases.SUB_META && item.price_data.product_data.metadata.sub === "couples", "line item metadata");
const price = (amount, interval, currency = "usd") => ({ currency, unit_amount: amount, recurring: { interval, interval_count: 1 } });
check(purchases.matchesSubPrice(price(299, "month"), "wheel", "monthly"), "wheel monthly price matches");
check(!purchases.matchesSubPrice(price(299, "month", "eur"), "wheel", "monthly"), "non-USD rejected");
check(!purchases.matchesSubPrice(price(299, "year"), "wheel", "monthly"), "wrong interval rejected");
const session = (over = {}) => ({
  mode: "subscription", status: "complete", payment_status: "paid", livemode: true, client_reference_id: "u1",
  metadata: { product: purchases.SUB_META, sub: "teacher", plan: "monthly", user_id: "u1" },
  line_items: { data: [{ quantity: 1, price: price(300, "month") }] }, ...over,
});
check(purchases.verifiedSubSession(session(), "u1", true)?.product === "teacher", "paid session verifies");
check(purchases.verifiedSubSession(session(), "u2", true) === null, "other user's session rejected");
check(purchases.verifiedSubSession(session({ payment_status: "unpaid" }), "u1", true) === null, "unpaid session rejected");
check(purchases.verifiedSubSession(session({ livemode: false }), "u1", true) === null, "test-mode session rejected in live");
check(purchases.verifiedSubSession(session({ line_items: { data: [{ quantity: 1, price: price(100, "month") }] } }), "u1", true) === null, "edited price rejected");

// syncSub and reconcile: the returned session counts even when the webhook stored it first.
const sub = { id: "sub_1", livemode: true, status: "active", metadata: { product: purchases.SUB_META, sub: "teacher", plan: "monthly", user_id: "u1" }, items: { data: [{ quantity: 1, price: price(300, "month"), current_period_end: 2_000_000_000 }] } };
const dbWith = (fresh) => ({ rpc: async () => ({ data: fresh, error: null }) });
check((await purchases.syncSub(dbWith(true), sub, "u1", 1)).fresh, "new row is fresh");
check((await purchases.syncSub(dbWith(false), sub, "u1", 1)).live, "existing active row is live");
check(!(await purchases.syncSub(dbWith(true), { ...sub, status: "canceled" }, "u1", 1)).live, "canceled is not live");
const api = {
  checkout: { sessions: { retrieve: async () => ({ ...session(), id: "cs_live_abcdefghijkl", customer: "cus_1", subscription: "sub_1" }), list: async () => ({ data: [] }) } },
  subscriptions: { retrieve: async () => sub },
};
const again = await purchases.reconcileSubs(api, dbWith(false), "cus_1", "u1", true, "cs_live_abcdefghijkl");
check(again.length === 1 && again[0].product === "teacher" && again[0].value === 3, "returned session granted after webhook");
const api2 = { ...api, checkout: { sessions: { retrieve: api.checkout.sessions.retrieve, list: async () => ({ data: [{ ...session(), id: "cs_live_other00000000", customer: "cus_1", subscription: "sub_1" }] }) } } };
check((await purchases.reconcileSubs(api2, dbWith(false), "cus_1", "u1", true)).length === 0, "old sessions already stored are not re-granted");

// Teacher schedule: no repeats within a school year per grade band
const sched = load("src/lib/subs/teacherSchedule.ts");
check(sched.schoolDay("2026-10-24") === "2026-10-26", "Saturday maps to Monday");
check(sched.mondayOf("2026-10-29") === "2026-10-26", "mondayOf");
check(sched.schoolYear("2026-07-31") === 2025 && sched.schoolYear("2026-08-01") === 2026, "school year starts Aug 1");
const teacher = load("src/lib/subs/teacher.ts");
const KINDS = ["qotd", "debate", "wyr", "ethics", "fun"];
for (const grade of ["k5", "g68", "g912"]) {
  const seen = new Set();
  let day = "2026-08-03", dupes = 0, n = 0;
  while (day < "2027-07-31") {
    if (sched.weekday(day) < 5) {
      const w = teacher.warmupFor(day, grade);
      if (seen.has(w.prompt)) dupes++;
      seen.add(w.prompt);
      n++;
      if (n < 6) check(w.kind === KINDS[sched.weekday(day)], `${grade} ${day} is ${KINDS[sched.weekday(day)]}`);
      check(w.prompt.length > 5 && w.task.length > 5, `${grade} ${day} has prompt and task`);
    }
    day = sched.addDays(day, 1);
  }
  check(dupes === 0, `${grade}: no repeated warm-up in a school year (${dupes} repeats of ${n})`);
}
check(teacher.warmupFor("2026-10-26", "g68").prompt === teacher.warmupFor("2026-10-26", "g68").prompt, "warm-up is stable for a date");
check(teacher.warmupFor("2026-10-26", "k5").prompt !== teacher.warmupFor("2026-10-26", "g912").prompt, "grade bands differ");

// Roster wheel
const wheel = load("src/lib/subs/wheel.ts");
check(wheel.cleanNames([" Ava ", "ava", "", "Ben", 3]).join() === "Ava,Ben", "names cleaned and deduped");
let drawn = [];
const names = ["A", "B", "C"];
const order = [];
for (let i = 0; i < 3; i++) { const r = wheel.pickNext(names, drawn, Math.random); order.push(r.pick); drawn = r.drawn; }
check(new Set(order).size === 3, "no repeats until everyone had a turn");
const next = wheel.pickNext(names, drawn, () => 0);
check(next.newRound && next.drawn.length === 1, "new round after everyone");
check(wheel.keepDrawn(["A"], ["A", "Z"]).join() === "A", "drawn trimmed to list");
const g = wheel.makeGroups(["a", "b", "c", "d", "e", "f", "g"], 3, () => 0.5);
check(g.length === 2 && g.flat().length === 7, "7 names in groups of 3 -> 2 groups, nobody dropped");
check(wheel.addHistory(Array(200).fill({ at: "x" }), { at: "y" }).length === 200, "history capped");
check(wheel.wheelAllowed("create", false, 0) && !wheel.wheelAllowed("create", false, 1), "one free list");
check(!wheel.wheelAllowed("groups", false, 0) && wheel.wheelAllowed("groups", true, 0), "groups need Pro");

// Events are wired for GA4 + Umami
const track = read("src/lib/track.ts");
for (const e of ["teacher_present", "bot_message_sent", "journal_entry_saved", "couples_reveal", "wheel_list_saved"]) check(track.includes(e), `${e} usage event registered`);
check(/entry_view\|entry_click\|landing_view\|trial_start\|paywall_view\|plan_select\|checkout_start\|purchase/.test(track), "funnel step regex");

// Checkout route keeps USD only and adaptive pricing off
const checkout = read("src/app/api/sub/checkout/route.ts");
check(/adaptive_pricing:\s*\{\s*enabled:\s*false\s*\}/.test(checkout), "adaptive pricing off");
check(read("src/app/api/speech/webhook/route.ts").includes("SUB_META"), "webhook handles subscriptions");

// One paid entry per page; never on the homepage or Host Pass pages
for (const page of ["src/app/page.tsx", "src/app/charades/page.tsx", "src/app/question-of-the-day/page.tsx", "src/app/icebreaker/page.tsx"]) {
  try { check(!read(page).includes("SubEntry"), `no subscription entry on ${page}`); } catch { /* page may not exist */ }
}
check(!read("src/app/impromptu-speech-topics/page.tsx").includes("SubEntry"), "impromptu speech keeps its single classroom entry");

console.log(`subs regression: ${checks} checks passed`);
