import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { load } from "./lib/load-typescript.mjs";

const require = createRequire(import.meta.url);
const { validateFeedback } = load("src/lib/speech/schema.ts");
const transcript =
  "Daily practice matters. Yesterday I rehearsed twice and shortened my opening.";
const feedback = {
  strength: {
    quote: "Daily practice matters.",
    observation: "Your point is explicit.",
  },
  priority: {
    quote: "rehearsed twice",
    observation: "Explain one change.",
    nextStep: "Name what you removed from the opening.",
  },
  structure: {
    point: "Explicit",
    example: "Concrete but brief",
    ending: "Add a return to the point",
  },
  comparison: {
    outcome: "first_attempt",
    beforeQuote: "",
    afterQuote: "",
    explanation: "First attempt.",
  },
};
assert.deepEqual(validateFeedback(feedback, transcript), feedback);
assert.throws(
  () =>
    validateFeedback(
      {
        ...feedback,
        strength: { ...feedback.strength, quote: "An invented statement" },
      },
      transcript,
    ),
  /ungrounded/,
);
assert.throws(
  () =>
    validateFeedback(
      {
        ...feedback,
        comparison: { ...feedback.comparison, outcome: "improved" },
      },
      transcript,
    ),
  /invalid_comparison/,
);
assert.throws(
  () =>
    validateFeedback(
      {
        ...feedback,
        comparison: { ...feedback.comparison, outcome: "improved" },
      },
      transcript,
      "Earlier speech",
    ),
  /missing_comparison_evidence/,
);
const compared = {
  ...feedback,
  comparison: {
    outcome: "mixed",
    beforeQuote: "Earlier speech",
    afterQuote: "Daily practice matters.",
    explanation: "The point is clearer; the example still needs detail.",
  },
};
assert.equal(
  validateFeedback(compared, transcript, "Earlier speech").comparison.outcome,
  "mixed",
);

const server = load("src/lib/speech/server.ts");
await assert.rejects(
  () =>
    server.readJson(
      new Request("https://example.test", { method: "POST", body: "{" }),
    ),
  /Invalid request/,
);
await assert.rejects(
  () =>
    server.readJson(
      new Request("https://example.test", {
        method: "POST",
        body: "x".repeat(4_000_001),
      }),
    ),
  /too large/,
);
const hidden = server.failure(new Error("sensitive provider body"));
assert.equal(JSON.stringify(await hidden.json()).includes("sensitive"), false);
assert.equal(hidden.headers.get("cache-control"), "private, no-store");

let calls = 0;
const actor = async () => ({
  user: { id: "owner" },
  db: {
    rpc: async () => {
      calls++;
      throw new Error("should not reserve invalid audio");
    },
  },
});
const transcribe = load("src/app/api/speech/transcribe/route.ts", {
  "@/lib/speech/server": { ...server, actor },
});
const id = "6c9f1062-e17e-41df-a5da-ae87db04336f";
const invalid = await transcribe.POST(
  new Request("https://example.test/api/speech/transcribe", {
    method: "POST",
    body: JSON.stringify({
      id,
      topic: "Practice",
      previousId: null,
      audio: Buffer.alloc(200).toString("base64"),
    }),
  }),
);
assert.equal(invalid.status, 400);
assert.equal(calls, 0, "Bad audio must not consume quota or model calls");

// A failed transcription must release its reservation before allowing a new ID.
const wav = Buffer.alloc(44 + 6 * 24000);
wav.write("RIFF");
wav.writeUInt32LE(wav.length - 8, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(12000, 24);
wav.writeUInt32LE(24000, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(wav.length - 44, 40);
for (const releaseFails of [false, true]) {
  const updates = [];
  const failedChain = {
    update(value) {
      updates.push(value);
      return this;
    },
    eq() {
      return this;
    },
    then(resolve) {
      resolve({
        error: releaseFails ? new Error("database unavailable") : null,
      });
    },
  };
  const silentRoute = load("src/app/api/speech/transcribe/route.ts", {
    "@/lib/speech/server": {
      ...server,
      actor: async () => ({
        user: { id: "owner" },
        db: {
          rpc: async () => ({ data: true, error: null }),
          from: () => failedChain,
        },
      }),
      networkHash: () => "test-network",
      modelCall: async () => ({
        value: { transcript: "" },
        usage: {},
        model: "test",
      }),
    },
  });
  const result = await silentRoute.POST(
    new Request("https://example.test/api/speech/transcribe", {
      method: "POST",
      body: JSON.stringify({
        id,
        topic: "Practice",
        previousId: null,
        audio: wav.toString("base64"),
      }),
    }),
  );
  assert.equal(result.status, 422);
  assert.equal((await result.json()).retryWithNewId, !releaseFails);
  assert.equal(updates[0].status, "failed");
}

const clauses = [];
const chain = {
  select() {
    return this;
  },
  eq(...args) {
    clauses.push(args);
    return this;
  },
  is() {
    return this;
  },
  order() {
    return this;
  },
  limit() {
    return this;
  },
  async maybeSingle() {
    return { data: null, error: null };
  },
  then(resolve) {
    resolve({ data: [], error: null });
  },
};
const history = load("src/app/api/speech/history/route.ts", {
  "@/lib/speech/server": {
    ...server,
    actor: async () => ({
      user: { id: "verified-owner", is_anonymous: true },
      db: {
        from() {
          return chain;
        },
      },
    }),
  },
  "@/lib/speech/billing": {
    billingReady: () => false,
    billingManagementReady: () => false,
  },
});
const historyResponse = await history.GET(
  new Request(`https://example.test/api/speech/history?id=${id}`),
);
assert.equal(historyResponse.status, 200);
assert.ok(
  clauses.some(
    ([key, value]) => key === "user_id" && value === "verified-owner",
  ),
  "Direct practice links must still filter by verified owner",
);
assert.ok(clauses.some(([key, value]) => key === "id" && value === id));
assert.equal((await historyResponse.json()).billingAvailable, false);

const billing = load("src/lib/speech/billing.ts");
process.env.SPEECH_BILLING_ENABLED = "true";
process.env.SPEECH_EMAIL_ENABLED = "true";
process.env.SPEECH_STRIPE_SECRET_KEY = "rk_live_not_a_real_key";
process.env.SPEECH_STRIPE_WEBHOOK_SECRET = "whsec_test";
process.env.SPEECH_STRIPE_PRODUCT_ID = "prod_test";
process.env.SPEECH_STRIPE_PRICE_ID = "price_test";
process.env.SPEECH_STRIPE_PORTAL_CONFIGURATION_ID = "bpc_test";
process.env.SPEECH_SITE_URL = "https://example.test";
delete process.env.SPEECH_LIVE_BILLING_ENABLED;
assert.equal(billing.billingReady(), false);
assert.throws(() => billing.stripe(), /not open/);
process.env.SPEECH_STRIPE_SECRET_KEY = "rk_test_not_a_real_key";
assert.equal(billing.billingReady(), true);
let writes = 0;
const Stripe = require("stripe");
const stripeClient = new Stripe(process.env.SPEECH_STRIPE_SECRET_KEY);
const webhook = load("src/app/api/speech/webhook/route.ts", {
  "@/lib/speech/billing": { ...billing, stripe: () => stripeClient },
  "@/lib/speech/server": {
    ...server,
    database: () => {
      writes++;
      throw new Error("unauthenticated webhook must not access DB");
    },
  },
});
const forged = await webhook.POST(
  new Request("https://example.test/api/speech/webhook", {
    method: "POST",
    body: JSON.stringify({
      type: "customer.subscription.updated",
      data: { object: { status: "active" } },
    }),
    headers: { "stripe-signature": "invalid" },
  }),
);
assert.equal(forged.status, 400);
assert.equal(writes, 0);
const unrelated = JSON.stringify({
  id: "evt_test",
  livemode: false,
  type: "customer.created",
  data: { object: { id: "cus_test" } },
});
const signature = stripeClient.webhooks.generateTestHeaderString({
  payload: unrelated,
  secret: process.env.SPEECH_STRIPE_WEBHOOK_SECRET,
});
const ignored = await webhook.POST(
  new Request("https://example.test/api/speech/webhook", {
    method: "POST",
    body: unrelated,
    headers: { "stripe-signature": signature },
  }),
);
assert.equal(ignored.status, 200);
assert.equal(writes, 0);
console.log(
  "PASS: grounded quotes, honest comparison, bounded requests, private errors, malformed audio, owner-scoped history, live billing gate and webhook signatures.",
);
