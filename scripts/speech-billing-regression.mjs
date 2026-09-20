import assert from "node:assert/strict";
import Stripe from "stripe";
import { load } from "./lib/load-typescript.mjs";

// All credentials and Stripe objects in this test are synthetic; no network calls.
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
const server = load("src/lib/speech/server.ts");
const billing = load("src/lib/speech/billing.ts", { "./server": server });
assert.equal(billing.billingReady(), true, "restricted test keys must work");
process.env.STRIPE_SECRET_KEY = "sk_test_another_product";
delete process.env.SPEECH_STRIPE_SECRET_KEY;
assert.equal(billing.billingReady(), false, "never fall back to a shared key");
process.env.SPEECH_STRIPE_SECRET_KEY = "rk_live_fixture";
process.env.SPEECH_LIVE_BILLING_ENABLED = "true";
assert.equal(
  billing.billingReady(),
  false,
  "preview cannot accept real payments",
);
process.env.VERCEL_ENV = "production";
delete process.env.SPEECH_LIVE_BILLING_ENABLED;
assert.equal(billing.billingReady(), false);
process.env.SPEECH_STRIPE_SECRET_KEY = "rk_test_fixture";
process.env.SPEECH_EMAIL_ENABLED = "false";
assert.equal(
  billing.billingReady(),
  false,
  "do not sell unrecoverable accounts",
);
process.env.SPEECH_EMAIL_ENABLED = "true";
process.env.SPEECH_SITE_URL = "https://speech.example.test/path";
assert.equal(billing.billingReady(), false);
process.env.SPEECH_SITE_URL = "https://speech.example.test";

const plan = {
  id: "price_speech",
  active: true,
  livemode: false,
  currency: "usd",
  unit_amount: 1200,
  product: {
    id: "prod_speech",
    active: true,
    metadata: { product: "randomtopics_speech" },
  },
  billing_scheme: "per_unit",
  transform_quantity: null,
  recurring: { interval: "month", interval_count: 1, usage_type: "licensed" },
};
assert.equal(billing.matchesSpeechPrice(plan), true);
for (const change of [
  { product: "prod_other" },
  { id: "price_other" },
  { unit_amount: 999 },
  { livemode: true },
  { currency: "eur" },
  { transform_quantity: { divide_by: 10 } },
  { recurring: { ...plan.recurring, usage_type: "metered" } },
  { recurring: { ...plan.recurring, interval: "year" } },
])
  assert.equal(billing.matchesSpeechPrice({ ...plan, ...change }), false);

const user = {
  id: "user_fixture",
  email: "customer@example.test",
  email_confirmed_at: "2026-09-01",
  is_anonymous: false,
};
let account;
let offeredPrice;
let customer;
let sessions;
let subscriptions;
let calls;
function reset() {
  account = {
    customer_id: "cus_speech",
    subscription_active: false,
    billing_event_time: 0,
  };
  offeredPrice = structuredClone(plan);
  customer = {
    id: "cus_speech",
    livemode: false,
    metadata: { product: "randomtopics_speech", user_id: user.id },
  };
  sessions = [];
  subscriptions = [];
  calls = {
    checkout: [],
    portal: [],
    retrieve: 0,
    updates: [],
    customerCreates: 0,
  };
  user.is_anonymous = false;
  process.env.SPEECH_BILLING_ENABLED = "true";
}
reset();
function query() {
  let update;
  const filters = [];
  return {
    select() {
      return this;
    },
    upsert() {
      return this;
    },
    update(value) {
      update = value;
      return this;
    },
    eq(field, value) {
      filters.push([field, value]);
      return this;
    },
    lte(field, value) {
      filters.push([field, value, "lte"]);
      return this;
    },
    async single() {
      return { data: account, error: null };
    },
    then(resolve) {
      if (update) {
        const matches = filters.every(([key, value, op]) =>
          key === "user_id"
            ? value === user.id
            : op === "lte"
              ? account[key] <= value
              : account[key] === value,
        );
        if (matches) {
          Object.assign(account, update);
          calls.updates.push(update);
        }
      }
      resolve({ data: null, error: null });
    },
  };
}
const db = { from: () => query() };
const sdk = new Stripe("rk_test_fixture");
let currentSubscription;
const api = {
  prices: { retrieve: async () => offeredPrice },
  customers: {
    retrieve: async () => customer,
    create: async () => {
      calls.customerCreates++;
      return customer;
    },
  },
  subscriptions: {
    list: async () => ({ data: subscriptions }),
    retrieve: async () => {
      calls.retrieve++;
      return currentSubscription;
    },
  },
  checkout: {
    sessions: {
      list: async () => ({ data: sessions }),
      create: async (...args) => {
        calls.checkout.push(args);
        return { id: "cs_test_fixture", url: "https://checkout.stripe.com/fixture" };
      },
    },
  },
  billingPortal: {
    sessions: {
      create: async (args) => {
        calls.portal.push(args);
        return { url: "https://billing.stripe.com/fixture" };
      },
    },
  },
  webhooks: sdk.webhooks,
};
const overrides = {
  "@/lib/speech/server": {
    ...server,
    actor: async () => ({ db, user }),
    database: () => db,
  },
  "@/lib/speech/billing": {
    ...billing,
    stripe: (acceptingPayment) => {
      billing.stripe(acceptingPayment);
      return api;
    },
  },
};
const checkout = load("src/app/api/speech/checkout/route.ts", overrides);
const portal = load("src/app/api/speech/portal/route.ts", overrides);
const webhook = load("src/app/api/speech/webhook/route.ts", overrides);
const request = () =>
  new Request("https://speech.example.test/api/speech/checkout", {
    method: "POST",
  });

user.is_anonymous = true;
assert.equal((await checkout.POST(request())).status, 401);
assert.equal(calls.checkout.length, 0);
reset();
offeredPrice.product.metadata.product = "flashcardmaker";
assert.equal((await checkout.POST(request())).status, 503);
assert.equal(calls.checkout.length, 0);
reset();
customer.metadata.user_id = "another_owner";
assert.equal((await checkout.POST(request())).status, 409);
assert.equal((await portal.POST(request())).status, 409);
assert.equal(calls.checkout.length + calls.portal.length, 0);
reset();
sessions = [
  {
    client_reference_id: user.id,
    mode: "subscription",
    metadata: { product: "other_app" },
    url: "https://checkout.stripe.com/wrong",
  },
];
assert.equal((await checkout.POST(request())).status, 200);
assert.equal(calls.checkout.length, 1);
const [params, options] = calls.checkout[0];
assert.deepEqual(params.line_items, [{ price: "price_speech", quantity: 1 }]);
assert.equal(params.customer, "cus_speech");
assert.equal(params.metadata.product, "randomtopics_speech");
assert.match(options.idempotencyKey, /price_speech/);
sessions = [{ ...params, id: "cs_test_reuse", url: "https://checkout.stripe.com/reuse" }];
assert.equal(
  (await (await checkout.POST(request())).json()).url,
  sessions[0].url,
);
assert.equal(
  calls.checkout.length,
  1,
  "reuse the same product's pending session",
);
subscriptions = [
  { status: "active", metadata: { product: "randomtopics_speech" } },
];
assert.equal((await checkout.POST(request())).status, 409);

process.env.SPEECH_BILLING_ENABLED = "false";
assert.equal((await checkout.POST(request())).status, 503);
assert.equal(
  (await portal.POST(request())).status,
  200,
  "closing sales must preserve cancellation",
);
assert.equal(calls.portal[0].configuration, "bpc_speech");
assert.equal(calls.portal[0].customer, "cus_speech");

const metadata = { product: "randomtopics_speech", user_id: user.id };
const baseEvent = {
  id: "evt_fixture",
  livemode: false,
  created: 100,
  type: "customer.subscription.updated",
  data: { object: { id: "sub_speech", metadata } },
};
async function deliver(event, signatureOverride) {
  const body = JSON.stringify(event);
  const signature =
    signatureOverride ??
    sdk.webhooks.generateTestHeaderString({
      payload: body,
      secret: "whsec_fixture",
    });
  return webhook.POST(
    new Request("https://speech.example.test/api/speech/webhook", {
      method: "POST",
      body,
      headers: { "stripe-signature": signature },
    }),
  );
}
currentSubscription = {
  id: "sub_speech",
  customer: "cus_speech",
  metadata,
  livemode: false,
  status: "active",
  items: {
    data: [
      {
        price: plan,
        quantity: 1,
        current_period_start: 1000,
        current_period_end: 2000,
      },
    ],
  },
};
assert.equal((await deliver(baseEvent, "forged")).status, 400);
assert.equal((await deliver({ ...baseEvent, livemode: true })).status, 400);
assert.equal(calls.retrieve, 0);
assert.equal(
  (
    await deliver({
      ...baseEvent,
      data: {
        object: { id: "sub_other", metadata: { product: "flashcardmaker" } },
      },
    })
  ).status,
  200,
);
assert.equal(calls.retrieve, 0, "other products must not even be fetched");
assert.equal((await deliver(baseEvent)).status, 200);
assert.equal(
  account.subscription_active,
  true,
  "signed callbacks still work with new sales disabled",
);
const firstState = structuredClone(account);
assert.equal((await deliver(baseEvent)).status, 200);
assert.deepEqual(
  account,
  firstState,
  "replay must not extend an allowance period",
);
currentSubscription.status = "canceled";
assert.equal(
  (
    await deliver({
      ...baseEvent,
      created: 101,
      type: "customer.subscription.deleted",
    })
  ).status,
  200,
);
assert.equal(account.subscription_active, false);
currentSubscription.status = "active";
assert.equal((await deliver({ ...baseEvent, created: 99 })).status, 200);
assert.equal(
  account.subscription_active,
  false,
  "an old event must not overwrite a newer cancellation",
);
currentSubscription.items.data[0].price = { ...plan, product: "prod_other" };
await deliver({ ...baseEvent, created: 102 });
assert.equal(
  account.subscription_active,
  false,
  "wrong products cannot grant access",
);
console.log(
  "PASS: dedicated credentials, restricted keys, mode and product isolation, verified owners, duplicate checkout, portal configuration, signed webhook replay, cancellation and event ordering.",
);
