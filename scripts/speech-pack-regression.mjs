// One-time speech packs: verification, idempotent grants, reconciliation and
// the checkout branch. Synthetic Stripe objects only; no network.
import assert from "node:assert/strict";
import { load } from "./lib/load-typescript.mjs";

const packs = load("src/lib/speech/packs.ts");
const good = (over = {}) => ({
  id: "cs_test_abcdefghijk1", mode: "payment", status: "complete", payment_status: "paid", livemode: false,
  client_reference_id: "u1", customer: "cus_1", metadata: { product: "randomtopics_speech_pack", user_id: "u1", pack: "5" },
  line_items: { data: [{ quantity: 1, price: { currency: "usd", unit_amount: 299 } }] }, ...over,
});
assert.equal(packs.verifiedPack(good(), "u1", false), 5);
assert.equal(packs.verifiedPack(good({ metadata: { product: "randomtopics_speech_pack", user_id: "u1", pack: "20" }, line_items: { data: [{ quantity: 1, price: { currency: "usd", unit_amount: 699 } }] } }), "u1", false), 20);
for (const [label, s, user, live] of [
  ["unpaid", good({ payment_status: "unpaid" }), "u1", false],
  ["open", good({ status: "open" }), "u1", false],
  ["subscription mode", good({ mode: "subscription" }), "u1", false],
  ["other user", good(), "u2", false],
  ["reference mismatch", good({ client_reference_id: "u2" }), "u1", false],
  ["other product", good({ metadata: { product: "flashcardmaker", user_id: "u1", pack: "5" } }), "u1", false],
  ["bad pack", good({ metadata: { product: "randomtopics_speech_pack", user_id: "u1", pack: "50" } }), "u1", false],
  ["wrong mode env", good(), "u1", true],
  ["cheaper price", good({ line_items: { data: [{ quantity: 1, price: { currency: "usd", unit_amount: 1 } }] } }), "u1", false],
  ["20 pack paid as 5", good({ metadata: { product: "randomtopics_speech_pack", user_id: "u1", pack: "20" } }), "u1", false],
  ["quantity 3", good({ line_items: { data: [{ quantity: 3, price: { currency: "usd", unit_amount: 299 } }] } }), "u1", false],
  ["non-usd", good({ line_items: { data: [{ quantity: 1, price: { currency: "cny", unit_amount: 299 } }] } }), "u1", false],
  ["no line items", good({ line_items: undefined }), "u1", false],
]) assert.equal(packs.verifiedPack(s, user, live), null, label);
assert.equal(packs.packSize("5"), 5); assert.equal(packs.packSize(20), 20); assert.equal(packs.packSize("7"), null);
const item = packs.packLineItem(20);
assert.deepEqual([item.price_data.currency, item.price_data.unit_amount, item.quantity], ["usd", 699, 1]);

// Reconcile: grants each paid session once (DB function is idempotent per session id).
const granted = new Set();
const db = { rpc: async (name, args) => { assert.equal(name, "grant_speech_pack"); const fresh = !granted.has(args.p_session); granted.add(args.p_session); return { data: fresh, error: null }; } };
const sessions = [good(), good({ id: "cs_test_abcdefghijk2", metadata: { product: "randomtopics_speech_pack", user_id: "u1", pack: "20" }, line_items: { data: [{ quantity: 1, price: { currency: "usd", unit_amount: 699 } }] } }), good({ id: "cs_test_abcdefghijk3", payment_status: "unpaid" }), good({ id: "cs_test_abcdefghijk4", customer: "cus_other" })];
const api = { checkout: { sessions: { list: async () => ({ data: sessions }), retrieve: async (id) => sessions.find((s) => s.id === id) } } };
assert.deepEqual(await packs.reconcilePacks(api, db, "cus_1", "u1", false, "cs_test_abcdefghijk1"), [5, 20]);
assert.deepEqual(await packs.reconcilePacks(api, db, "cus_1", "u1", false), [], "never granted twice");
assert.deepEqual(await packs.reconcilePacks(api, db, "cus_1", "u1", false, "not-a-session"), [], "malformed ids are ignored");
console.log("PASS: pack verification (paid, owner, product, price, currency, quantity, mode), single grant per session, reconciliation, line items.");
