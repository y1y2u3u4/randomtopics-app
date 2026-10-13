// Guest purchase claim: a guest who paid (Stripe collected the email) signs in
// with that email and the plan moves to the verified account. Synthetic data only.
import assert from "node:assert/strict";
import { load } from "./lib/load-typescript.mjs";

const claim = load("src/lib/speech/claim.ts", { "./billing": { SPEECH_PRODUCT: "randomtopics_speech" } });

function world() {
  const rows = new Map();
  const attempts = [{ id: "a1", user_id: "guest" }];
  const users = { guest: { id: "guest", is_anonymous: true }, other: { id: "other", is_anonymous: false } };
  const customers = [{ id: "cus_g", email: "Buyer@Example.test", metadata: { product: "randomtopics_speech", user_id: "guest" } }];
  const subs = [{ id: "sub_g", customer: "cus_g", status: "active", metadata: { product: "randomtopics_speech", user_id: "guest" } }];
  rows.set("guest", { user_id: "guest", customer_id: "cus_g", subscription_id: "sub_g", subscription_active: true, period_start: "2026-10-01", period_end: "2099-01-01", billing_event_time: 5 });
  const log = [];
  const table = (name) => {
    let filter; let patch; let op;
    const q = {
      select() { op ??= "select"; return q; },
      update(v) { op = "update"; patch = v; return q; },
      upsert(v) {
        // Unique customer_id / subscription_id, like the real table.
        for (const [id, r] of rows) if (id !== v.user_id && (r.customer_id && r.customer_id === v.customer_id || r.subscription_id && r.subscription_id === v.subscription_id)) return Promise.resolve({ error: new Error("unique violation") });
        rows.set(v.user_id, { ...(rows.get(v.user_id) ?? {}), ...v }); log.push(["upsert", v.user_id]); return Promise.resolve({ error: null });
      },
      eq(k, v) { filter = [k, v]; return q; },
      maybeSingle() { const r = name === "speech_accounts" ? rows.get(filter[1]) : null; return Promise.resolve({ data: r ? structuredClone(r) : null, error: null }); },
      then(resolve) {
        if (op === "update") {
          if (name === "speech_accounts") { const r = rows.get(filter[1]); if (r) Object.assign(r, patch); log.push(["clear", filter[1]]); }
          if (name === "speech_attempts") for (const a of attempts) if (a[filter[0]] === filter[1]) Object.assign(a, patch);
        }
        resolve({ error: null });
      },
    };
    return q;
  };
  const db = { from: table, auth: { admin: { getUserById: async (id) => ({ data: { user: users[id] ?? null } }) } } };
  const api = {
    customers: {
      search: async ({ query }) => ({ data: customers.filter((c) => query.includes(`email:'${c.email.toLowerCase()}'`) || query.includes(`email:'${c.email}'`)) }),
      update: async (id, { metadata }) => { Object.assign(customers.find((c) => c.id === id).metadata, metadata); log.push(["stripe-customer", metadata.user_id]); },
    },
    subscriptions: {
      list: async ({ customer }) => ({ data: subs.filter((s) => s.customer === customer) }),
      update: async (id, { metadata }) => { Object.assign(subs.find((s) => s.id === id).metadata, metadata); },
    },
  };
  return { rows, attempts, users, customers, subs, db, api, log };
}

const buyer = { id: "real", email: "buyer@example.test", email_confirmed_at: "2026-10-14", is_anonymous: false };

// Happy path: the plan, Stripe ownership and practice move to the verified account.
let w = world();
assert.deepEqual(await claim.claimGuestPurchases(w.api, w.db, buyer), { claimed: 1 });
assert.equal(w.rows.get("real").customer_id, "cus_g");
assert.equal(w.rows.get("real").subscription_active, true);
assert.equal(w.rows.get("real").period_end, "2099-01-01");
assert.equal(w.rows.get("guest").customer_id, null, "guest row released first (unique keys)");
assert.equal(w.customers[0].metadata.user_id, "real");
assert.equal(w.customers[0].metadata.claimed_from, "guest");
assert.equal(w.subs[0].metadata.user_id, "real", "future webhooks target the new owner");
assert.equal(w.attempts[0].user_id, "real", "practice history moves too");
assert.ok(w.log.findIndex((l) => l[0] === "stripe-customer") < w.log.findIndex((l) => l[0] === "upsert"), "Stripe updated before the database");
// Idempotent.
assert.deepEqual(await claim.claimGuestPurchases(w.api, w.db, buyer), { claimed: 0 });

// Guests and unverified accounts never claim.
w = world();
assert.deepEqual(await claim.claimGuestPurchases(w.api, w.db, { ...buyer, is_anonymous: true }), { claimed: 0 });
assert.deepEqual(await claim.claimGuestPurchases(w.api, w.db, { ...buyer, email_confirmed_at: null }), { claimed: 0 });
assert.equal(w.customers[0].metadata.user_id, "guest");

// A plan owned by a real (non-guest) account is never taken, even with the same email.
w = world();
w.customers[0].metadata.user_id = "other"; w.subs[0].metadata.user_id = "other";
assert.deepEqual(await claim.claimGuestPurchases(w.api, w.db, buyer), { claimed: 0 });
assert.equal(w.customers[0].metadata.user_id, "other");

// Different email: nothing moves.
w = world();
assert.deepEqual(await claim.claimGuestPurchases(w.api, w.db, { ...buyer, email: "someone@else.test" }), { claimed: 0 });

// Already-paying account keeps one plan.
w = world();
w.rows.set("real", { user_id: "real", customer_id: "cus_real", subscription_active: true, period_end: "2099-01-01" });
assert.deepEqual(await claim.claimGuestPurchases(w.api, w.db, buyer), { claimed: 0 });

// Canceled guest subscription is not moved.
w = world();
w.subs[0].status = "canceled";
assert.deepEqual(await claim.claimGuestPurchases(w.api, w.db, buyer), { claimed: 0 });

// Quotes in emails cannot break the search query.
w = world();
let seen;
w.api.customers.search = async ({ query }) => { seen = query; return { data: [] }; };
await claim.claimGuestPurchases(w.api, w.db, { ...buyer, email: "o'neil@example.test" });
assert.match(seen, /email:'o\\'neil@example\.test'/);
console.log("PASS: guest purchase claim moves plan, Stripe owner and history; never from real accounts, unverified users, other emails, paying accounts or canceled plans; idempotent; query-safe.");
