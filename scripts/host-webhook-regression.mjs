import assert from "node:assert/strict";
import Stripe from "stripe";
import { load } from "./lib/load-typescript.mjs";

// Host Pass branch of the signed Stripe webhook. All keys and Stripe objects are
// synthetic; no network calls.
Object.assign(process.env, {
  SPEECH_STRIPE_SECRET_KEY: "rk_test_fixture",
  SPEECH_STRIPE_WEBHOOK_SECRET: "whsec_fixture",
  SPEECH_STRIPE_PRODUCT_ID: "prod_speech",
  SPEECH_STRIPE_PRICE_ID: "price_speech",
  SPEECH_STRIPE_PORTAL_CONFIGURATION_ID: "bpc_speech",
  SPEECH_SITE_URL: "https://speech.example.test",
  SPEECH_EMAIL_ENABLED: "true",
  SPEECH_BILLING_ENABLED: "true",
  VERCEL_ENV: "preview",
});
const sdk = new Stripe("sk_test_fixture");
const server = load("src/lib/speech/server.ts");
const billing = load("src/lib/speech/billing.ts", { "./server": server });

const userId = "user_host";
const rpcCalls = [];
let owner = { user_id: userId };
let rpcResult = { data: true, error: null };
const db = {
  from(table) {
    assert.equal(table, "speech_accounts", "host webhook reads only the owner row");
    const query = { select: () => query, eq: () => query, maybeSingle: async () => ({ data: owner, error: null }) };
    return query;
  },
  rpc: async (name, args) => { rpcCalls.push({ name, args }); return rpcResult; },
};
const metadata = { product: "randomtopics_host_pass", user_id: userId, plan: "monthly" };
let subscription;
let retrieved = 0;
const api = {
  subscriptions: { retrieve: async (id) => { retrieved++; return { ...subscription, id }; } },
  webhooks: sdk.webhooks,
};
const webhook = load("src/app/api/speech/webhook/route.ts", {
  "@/lib/speech/server": { ...server, database: () => db },
  "@/lib/speech/billing": { ...billing, stripe: () => api },
});
const item = (overrides = {}) => ({
  quantity: 1,
  current_period_end: 4_102_444_800,
  price: { currency: "usd", unit_amount: 299, recurring: { interval: "month", interval_count: 1 } },
  ...overrides,
});
const reset = () => {
  rpcCalls.length = 0; retrieved = 0; owner = { user_id: userId }; rpcResult = { data: true, error: null };
  subscription = { customer: "cus_host", metadata, livemode: false, status: "active", items: { data: [item()] } };
};
async function deliver(event, signature) {
  const body = JSON.stringify(event);
  return webhook.POST(new Request("https://speech.example.test/api/speech/webhook", {
    method: "POST", body,
    headers: { "stripe-signature": signature ?? sdk.webhooks.generateTestHeaderString({ payload: body, secret: "whsec_fixture" }) },
  }));
}
const event = (type = "customer.subscription.updated", created = 100, meta = metadata) =>
  ({ id: "evt_host", livemode: false, created, type, data: { object: { id: "sub_host", metadata: meta } } });

let passed = 0;
const check = async (name, fn) => { reset(); await fn(); passed++; console.log(`ok - ${name}`); };

await check("forged signature is rejected before any read", async () => {
  const forged = sdk.webhooks.generateTestHeaderString({ payload: JSON.stringify(event()), secret: "whsec_wrong" });
  assert.equal((await deliver(event(), forged)).status, 400);
  assert.equal(retrieved + rpcCalls.length, 0);
});
await check("missing signature is rejected", async () => {
  assert.equal((await deliver(event(), "")).status, 400);
  assert.equal(rpcCalls.length, 0);
});
await check("live event on a test endpoint is rejected", async () => {
  assert.equal((await deliver({ ...event(), livemode: true })).status, 400);
  assert.equal(rpcCalls.length, 0);
});
await check("active subscription extends access to the period end", async () => {
  assert.equal((await deliver(event())).status, 200);
  assert.equal(retrieved, 1, "provider state is re-read");
  assert.equal(rpcCalls.length, 1);
  const { name, args } = rpcCalls[0];
  assert.equal(name, "sync_host_subscription");
  assert.equal(args.p_user, userId);
  assert.equal(args.p_plan, "monthly");
  assert.equal(args.p_amount, 299);
  assert.equal(args.p_event, 100, "ordered by Stripe event time");
  assert.equal(args.p_expires, new Date(4_102_444_800 * 1000).toISOString());
});
await check("deleted subscription ends access now", async () => {
  subscription.status = "canceled";
  const before = Date.now();
  assert.equal((await deliver(event("customer.subscription.deleted", 200))).status, 200);
  assert.ok(Date.parse(rpcCalls[0].args.p_expires) <= Date.now() && Date.parse(rpcCalls[0].args.p_expires) >= before - 1000);
});
await check("tampered price does not extend access", async () => {
  subscription.items.data = [item({ price: { currency: "usd", unit_amount: 1, recurring: { interval: "month", interval_count: 1 } } })];
  await deliver(event());
  assert.ok(Date.parse(rpcCalls[0].args.p_expires) <= Date.now());
});
await check("snapshot claiming Host but live object is another product is ignored", async () => {
  subscription.metadata = { ...metadata, product: "other_app" };
  assert.equal((await deliver(event())).status, 200);
  assert.equal(rpcCalls.length, 0);
});
await check("subscription owned by another account is not granted", async () => {
  owner = null;
  assert.equal((await deliver(event())).status, 503, "Stripe retries until the account exists");
  assert.equal(rpcCalls.length, 0);
});
await check("other event types are acknowledged without reads", async () => {
  assert.equal((await deliver(event("checkout.session.completed"))).status, 200);
  assert.equal(retrieved + rpcCalls.length, 0);
});
await check("database failure asks Stripe to retry", async () => {
  rpcResult = { data: null, error: new Error("down") };
  assert.equal((await deliver(event())).status, 503);
});
await check("replayed event reaches the idempotent RPC (no double grant in code)", async () => {
  rpcResult = { data: false, error: null };
  assert.equal((await deliver(event())).status, 200);
  assert.equal(rpcCalls.length, 1);
});

console.log(`PASS: ${passed} host webhook checks`);
