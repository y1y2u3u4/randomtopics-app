import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");
function load(file, overrides = {}, cache = new Map()) {
  file = resolve(root, file);
  if (cache.has(file)) return cache.get(file).exports;
  const loaded = { exports: {} };
  cache.set(file, loaded);
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  new Function("require", "module", "exports", code)(
    (id) => {
      if (Object.hasOwn(overrides, id)) return overrides[id];
      if (id === "server-only") return {};
      if (id.startsWith("@/") || id.startsWith(".")) {
        let path = id.startsWith("@/")
          ? resolve(root, "src", id.slice(2))
          : resolve(dirname(file), id);
        if (!existsSync(path)) path += ".ts";
        return load(path, overrides, cache);
      }
      return require(id);
    },
    loaded,
    loaded.exports,
  );
  return loaded.exports;
}
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
  "@/lib/speech/billing": { billingReady: () => false },
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
process.env.STRIPE_SECRET_KEY = "sk_live_not_a_real_key";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
process.env.SPEECH_STRIPE_PRICE_ID = "price_test";
delete process.env.SPEECH_LIVE_BILLING_ENABLED;
assert.equal(billing.billingReady(), false);
assert.throws(() => billing.stripe(), /not open/);
process.env.STRIPE_SECRET_KEY = "sk_test_not_a_real_key";
assert.equal(billing.billingReady(), true);
let writes = 0;
const Stripe = require("stripe");
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhook = load("src/app/api/speech/webhook/route.ts", {
  "@/lib/speech/billing": { stripe: () => stripeClient },
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
  type: "customer.created",
  data: { object: { id: "cus_test" } },
});
const signature = stripeClient.webhooks.generateTestHeaderString({
  payload: unrelated,
  secret: process.env.STRIPE_WEBHOOK_SECRET,
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
