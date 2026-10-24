// Host Pass: plans, purchase verification, grants, no-repeat picking and the
// host_* events (GA4 + Umami, production only). Synthetic Stripe/DB; no network.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
let checks = 0;
const check = (ok, message) => { assert.ok(ok, message); checks++; };

// ── Plans (approved 2026-10-24) ──────────────────────────────────────────
const plans = load("src/lib/host/plans.ts");
check(plans.HOST_PLANS.pass30.cents === 499 && plans.HOST_PLANS.pass30.mode === "payment", "30-day pass: $4.99 one-time");
check(plans.HOST_PLANS.monthly.cents === 299 && plans.HOST_PLANS.monthly.interval === "month", "Monthly: $2.99/month");
check(plans.HOST_PLANS.yearly.cents === 1999 && plans.HOST_PLANS.yearly.interval === "year", "Yearly: $19.99/year");
check(plans.DEFAULT_HOST_PLAN === "pass30" && plans.HOST_PLAN_ORDER[0] === "pass30", "30-day pass is the default, listed first");
check(plans.hostPlan("yearly") === "yearly" && plans.hostPlan("toString") === null && plans.hostPlan(5) === null, "Plan ids are validated");
check(plans.HOST_TRIAL_PROMPTS === 5, "Free trial is one round of 5 prompts");

// ── Purchase verification ────────────────────────────────────────────────
const purchases = load("src/lib/host/purchases.ts", { "server-only": {} });
const item = purchases.hostLineItem("yearly");
check(item.price_data.currency === "usd" && item.price_data.unit_amount === 1999 && item.price_data.recurring.interval === "year", "Yearly line item is USD and recurring");
check(!purchases.hostLineItem("pass30").price_data.recurring, "30-day pass line item is one-time");
const good = (over = {}, plan = "pass30") => ({
  id: "cs_test_abcdefghijk", mode: plan === "pass30" ? "payment" : "subscription", status: "complete", payment_status: "paid",
  livemode: false, client_reference_id: "u1", metadata: { product: "randomtopics_host_pass", user_id: "u1", plan },
  line_items: { data: [{ quantity: 1, price: { currency: "usd", unit_amount: plans.HOST_PLANS[plan].cents, recurring: plan === "pass30" ? null : { interval: plans.HOST_PLANS[plan].interval, interval_count: 1 } } }] },
  ...over,
});
check(purchases.verifiedHostSession(good(), "u1", false) === "pass30", "Paid 30-day pass verifies");
check(purchases.verifiedHostSession(good({}, "monthly"), "u1", false) === "monthly", "Paid monthly verifies");
check(purchases.verifiedHostSession(good({}, "yearly"), "u1", false) === "yearly", "Paid yearly verifies");
for (const [label, s, user, live] of [
  ["unpaid", good({ payment_status: "unpaid" }), "u1", false],
  ["open", good({ status: "open" }), "u1", false],
  ["other user", good(), "u2", false],
  ["reference mismatch", good({ client_reference_id: "u2" }), "u1", false],
  ["classroom session", good({ metadata: { product: "randomtopics_classroom_pack", user_id: "u1", plan: "pass30" } }), "u1", false],
  ["unknown plan", good({ metadata: { product: "randomtopics_host_pass", user_id: "u1", plan: "lifetime" } }), "u1", false],
  ["wrong environment", good(), "u1", true],
  ["yearly paid at monthly price", good({ metadata: { product: "randomtopics_host_pass", user_id: "u1", plan: "yearly" } }, "monthly"), "u1", false],
  ["pass as subscription", good({ mode: "subscription" }), "u1", false],
  ["quantity 2", good({ line_items: { data: [{ quantity: 2, price: { currency: "usd", unit_amount: 499 } }] } }), "u1", false],
  ["non-usd", good({ line_items: { data: [{ quantity: 1, price: { currency: "eur", unit_amount: 499 } }] } }), "u1", false],
]) { assert.equal(purchases.verifiedHostSession(s, user, live), null, label); checks++; }

// ── Grants (synthetic DB + Stripe) ───────────────────────────────────────
const rpcs = [];
const db = { rpc: async (name, args) => { rpcs.push([name, args]); return { data: !rpcs.slice(0, -1).some(([, a]) => (a.p_session ?? a.p_subscription) === (args.p_session ?? args.p_subscription)), error: null }; } };
const period = Math.floor(Date.now() / 1000) + 30 * 86400;
const subscription = (over = {}) => ({ id: "sub_1", status: "active", livemode: false, metadata: { product: "randomtopics_host_pass", user_id: "u1", plan: "monthly" },
  items: { data: [{ quantity: 1, current_period_end: period, price: { currency: "usd", unit_amount: 299, recurring: { interval: "month", interval_count: 1 } } }] }, ...over });
const sessions = [good(), good({ id: "cs_test_monthlyabcde", subscription: "sub_1" }, "monthly"), good({ id: "cs_test_otheruserabc", client_reference_id: "u2" })];
const api = {
  checkout: { sessions: { retrieve: async (id) => sessions.find((s) => s.id === id), list: async () => ({ data: sessions }) } },
  subscriptions: { retrieve: async () => subscription() },
};
const granted = await purchases.reconcileHost(api, db, "cus_1", "u1", false, "cs_test_abcdefghijk");
check(granted.join() === "pass30,monthly", "Reconcile grants the pass and the subscription, not another user's session");
check(rpcs[0][0] === "grant_host_pass" && rpcs[0][1].p_amount === 499, "30-day pass uses the stacking grant");
check(rpcs[1][0] === "sync_host_subscription" && rpcs[1][1].p_expires === new Date(period * 1000).toISOString(), "Subscription access runs to the paid period end");
check((await purchases.reconcileHost(api, db, "cus_1", "u1", false)).length === 0, "Grants are idempotent");
rpcs.length = 0;
await purchases.syncHostSubscription(db, subscription({ status: "canceled" }), "u1", 99);
check(new Date(rpcs[0][1].p_expires) <= new Date(), "A deleted subscription ends access now");
check(!(await purchases.syncHostSubscription(db, subscription({ metadata: { product: "randomtopics_speech", user_id: "u1", plan: "monthly" } }), "u1", 1)), "Other products are ignored");

// ── No repeats ───────────────────────────────────────────────────────────
const pools = load("src/lib/host/pools.ts");
const seen = new Set();
for (let i = 0; i < 7; i++) { const n = pools.nextUnseen(7, seen); check(n !== null && !seen.has(n), "Never repeats before reset"); seen.add(n); }
check(pools.nextUnseen(7, seen) === null, "Reports when every prompt was shown");
check(pools.nextUnseen(3, new Set([0, 2]), () => 0.99) === 1, "Picks among the unseen only");

// ── Migration and wiring ─────────────────────────────────────────────────
const sql = readFileSync(resolve(root, "supabase/migrations/20261024120000_host_passes.sql"), "utf8");
check(/enable row level security/.test(sql) && /revoke all on public\.host_passes from anon, authenticated/.test(sql), "host_passes is service-role only");
check(/greatest\(now\(\), coalesce\(max\(expires_at\)/.test(sql), "A new pass starts when the current one ends");
check(/host_passes\.event_time <= excluded\.event_time/.test(sql), "Old webhooks never overwrite newer subscription state");
const checkout = readFileSync(resolve(root, "src/app/api/host/checkout/route.ts"), "utf8");
check(/adaptive_pricing: \{ enabled: false \}/.test(checkout), "Checkout shows USD (adaptive pricing off)");
const ads = readFileSync(resolve(root, "src/app/api/speech/ad-entitlement/route.ts"), "utf8");
check(/host_passes/.test(ads), "A valid Host Pass removes ads");
for (const page of ["charades", "this-or-that", "would-you-rather", "truth-or-dare", "question-of-the-day", "icebreaker", "debate"])
  check(readFileSync(resolve(root, `src/app/${page}/page.tsx`), "utf8").includes(`<HostPassEntry generator="${page}" />`), `${page}: Host mode entry`);
check(!readFileSync(resolve(root, "src/app/page.tsx"), "utf8").includes("HostPassEntry"), "Homepage untouched (frozen until 10/26)");
const entry = readFileSync(resolve(root, "src/components/host/HostPassEntry.tsx"), "utf8");
check(/dynamic\(\(\) => import\("\.\/HostMode"\)/.test(entry) && !entry.split("\n").filter((l) => l.startsWith("import ") && !l.startsWith("import type")).some((l) => /supabase|stripe|@\/data\/|host\/client|host\/pools/i.test(l)), "Entry stays light: Host mode, data and payment load on open");

// ── Events: same names in GA4 and Umami, production and non-QA only ──────
const storage = new Map();
const store = { getItem: (k) => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, String(v)), removeItem: (k) => storage.delete(k) };
const gtag = [], umami = [];
let generateEvents = 0;
globalThis.sessionStorage = store;
globalThis.document = { title: "Fixture", documentElement: { lang: "en" } };
globalThis.CustomEvent = class { constructor(type, options) { this.type = type; this.detail = options.detail; } };
globalThis.window = { location: { hostname: "randomtopics.app", origin: "https://randomtopics.app", pathname: "/charades", search: "" }, sessionStorage: store, localStorage: store,
  dispatchEvent: (e) => { if (e.type === "rt:generate") generateEvents++; }, setTimeout: (fn) => fn(), gtag: (c, e, p) => gtag.push([e, p]), umami: { track: (e, p) => umami.push([e, p]) } };
const { track, sessionGenerateCount } = load("src/lib/track.ts", { "./coreUsage": { coreUsageEvents: () => [] } });
const EVENTS = ["host_entry_view", "host_entry_click", "host_trial_start", "host_trial_end", "host_paywall_view", "host_plan_select", "host_checkout_start", "host_purchase", "host_session_start", "timer_set", "no_repeat_reset"];
for (const e of EVENTS) track(e, { generator: "charades", tool_type: "host_mode", plan: "pass30" });
check(EVENTS.every((e) => gtag.some(([n]) => n === e)) && EVENTS.every((e) => umami.some(([n]) => n === e)), "Every host event reaches GA4 and Umami under the same name");
check(umami.every(([, p]) => p.plan === "pass30" && p.generator === "charades"), "Umami gets plan and generator");
for (let i = 0; i < 3; i++) track("generate_success", { tool_type: "charades" });
check(sessionGenerateCount() === 3 && generateEvents === 3, "Generations are counted for the 3rd-generation entry");
umami.length = 0; gtag.length = 0;
window.location.search = "?usage_qa=1";
track("host_purchase", { generator: "charades", plan: "pass30" });
check(umami.length === 0 && gtag.every(([n]) => n.startsWith("qa_")), "QA purchases stay out of Umami and the real GA4 names");
window.location.search = ""; storage.delete("rt_usage_qa"); umami.length = 0; gtag.length = 0;
window.location.hostname = "localhost";
track("host_purchase", { generator: "charades", plan: "pass30" });
check(umami.length === 0 && gtag.length === 0, "localhost never sends host events");

console.log(`host-pass regression: ${checks} checks passed`);
