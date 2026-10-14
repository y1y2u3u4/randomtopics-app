// Classroom packs: content quality, exported files, purchase verification,
// grants, downloads and presenter access. Synthetic Stripe/DB only; no network.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
let checks = 0;
const check = (ok, message) => { assert.ok(ok, message); checks++; };

// ── Content ──────────────────────────────────────────────────────────────
const content = JSON.parse(readFileSync(resolve(root, "src/data/classroomPacks.json"), "utf8"));
const catalog = load("src/lib/classroom/catalog.ts");
check(content.packs.length === catalog.CLASSROOM_PACKS.length, "Every catalog pack has content");
const UNSUITABLE = /\b(sex|sexual|drugs?|alcohol|beer|wine|drunk|kill|suicide|guns?|abortion|dating|cheat(s|ing)?|gambl\w*|porn\w*|death penalty|psychedelic\w*|cannabis|marijuana|tobacco use|weapon\w*|breakup|divorce)\b/i;
for (const pack of content.packs) {
  const info = catalog.CLASSROOM_PACKS.find((p) => p.id === pack.id);
  const items = pack.sections.flatMap((s) => s.items);
  check(info && info.count === items.length && pack.count === items.length, `${pack.id}: catalog count matches content (${items.length})`);
  check(new Set(items.map((i) => i.text.toLowerCase())).size === items.length, `${pack.id}: no duplicate questions`);
  for (const item of items) {
    const all = [item.text, item.followUp, item.pro, item.con].filter(Boolean).join(" ");
    check(!UNSUITABLE.test(all), `${pack.id}: classroom-safe wording: ${item.text}`);
    check(!/\s{2,}|\s[,.?!]|\.\./.test(item.text), `${pack.id}: clean spacing/punctuation: ${item.text}`);
    if (pack.id === "question-of-the-day") check(item.followUp && item.theme && item.level && /^Day \d+ · \w+day$/.test(item.label), "QOTD item has day, theme, level and follow-up");
    if (pack.id === "debate") check(item.pro?.length > 20 && item.con?.length > 20 && /[.]$/.test(item.text), "Debate motion has both sides");
    if (pack.id === "speech") check(pack.timing[item.timing]?.rule, "Speech topic has a timing rule");
  }
}
const qotd = content.packs.find((p) => p.id === "question-of-the-day");
check(qotd.sections.length === 36 && qotd.sections.every((w) => w.items.length === 5), "36 school weeks × 5 days");
check(qotd.sections.at(-1).items.at(-1).label === "Day 180 · Friday", "Ends on day 180");
const debate = content.packs.find((p) => p.id === "debate");
check(debate.sections.map((s) => s.items.length).join() === "20,20,20", "Three debate levels of 20");

// ── Exported files and previews ──────────────────────────────────────────
// The paid files are not in the (public) repository: they are exported locally
// with `npm run classroom:build` and uploaded to the private Storage bucket.
const exported = existsSync(resolve(root, "private/classroom"));
for (const pack of content.packs) {
  for (const p of catalog.classroomPreviews(pack.id)) check(existsSync(resolve(root, "public", p.src.slice(1))), `Preview exists: ${p.src}`);
  if (!exported) continue;
  const pptx = resolve(root, `private/classroom/${pack.id}.pptx`), pdf = resolve(root, `private/classroom/${pack.id}.pdf`);
  check(existsSync(pptx) && existsSync(pdf), `${pack.id}: PPTX and PDF exported`);
  const slides = execFileSync("unzip", ["-Z1", pptx], { encoding: "utf8" }).split("\n").filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f)).length;
  check(slides === pack.count + pack.sections.length + 3, `${pack.id}: one slide per question + dividers + cover/guide/end (${slides})`);
  const pages = (readFileSync(pdf, "latin1").match(/\/Type\s*\/Page(?!s)/g) || []).length;
  check(pages >= 10 && statSync(pdf).size < 4_000_000, `${pack.id}: printable PDF has ${pages} pages`);
}

// ── Purchase verification and grants ─────────────────────────────────────
const purchases = load("src/lib/classroom/purchases.ts");
const good = (over = {}) => ({
  id: "cs_test_classroom0001", mode: "payment", status: "complete", payment_status: "paid", livemode: false,
  client_reference_id: "u1", customer: "cus_1", metadata: { product: "randomtopics_classroom_pack", user_id: "u1", pack: "debate" },
  line_items: { data: [{ quantity: 1, price: { currency: "usd", unit_amount: 499 } }] }, ...over,
});
const allPack = { metadata: { product: "randomtopics_classroom_pack", user_id: "u1", pack: "all" }, line_items: { data: [{ quantity: 1, price: { currency: "usd", unit_amount: 999 } }] } };
check(purchases.verifiedClassroom(good(), "u1", false) === "debate", "Paid single pack verifies");
check(purchases.verifiedClassroom(good(allPack), "u1", false) === "all", "Paid all-packs verifies");
for (const [label, s, user, live] of [
  ["unpaid", good({ payment_status: "unpaid" }), "u1", false],
  ["open", good({ status: "open" }), "u1", false],
  ["other user", good(), "u2", false],
  ["reference mismatch", good({ client_reference_id: "u2" }), "u1", false],
  ["speech pack session", good({ metadata: { product: "randomtopics_speech_pack", user_id: "u1", pack: "debate" } }), "u1", false],
  ["unknown pack", good({ metadata: { product: "randomtopics_classroom_pack", user_id: "u1", pack: "math" } }), "u1", false],
  ["wrong environment", good(), "u1", true],
  ["all paid at single price", good({ metadata: allPack.metadata }), "u1", false],
  ["quantity 2", good({ line_items: { data: [{ quantity: 2, price: { currency: "usd", unit_amount: 499 } }] } }), "u1", false],
  ["non-usd", good({ line_items: { data: [{ quantity: 1, price: { currency: "eur", unit_amount: 499 } }] } }), "u1", false],
  ["no line items", good({ line_items: undefined }), "u1", false],
]) { assert.equal(purchases.verifiedClassroom(s, user, live), null, label); checks++; }
const line = purchases.classroomLineItem("all");
check(line.price_data.currency === "usd" && line.price_data.unit_amount === 999 && line.quantity === 1, "All-packs line item is $9.99 USD");
check(purchases.classroomLineItem("speech").price_data.unit_amount === 499, "Single pack line item is $4.99 USD");
check(catalog.ownedPacks(["all"]).length === 3 && catalog.ownedPacks(["speech"]).join() === "speech" && catalog.ownedPacks([]).length === 0, "all includes every pack");

const granted = new Set();
const grantDb = { rpc: async (name, args) => { assert.equal(name, "grant_classroom_pack"); const fresh = !granted.has(args.p_session); granted.add(args.p_session); return { data: fresh, error: null }; } };
const sessions = [good(), good({ id: "cs_test_classroom0002", ...allPack }), good({ id: "cs_test_classroom0003", payment_status: "unpaid" }), good({ id: "cs_test_classroom0004", customer: "cus_other" })];
const api = { checkout: { sessions: { list: async () => ({ data: sessions }), retrieve: async (id) => sessions.find((s) => s.id === id) } } };
check((await purchases.reconcileClassroom(api, grantDb, "cus_1", "u1", false, "cs_test_classroom0001")).map((g) => g.purchase).join() === "debate,all", "Reconcile grants paid sessions of this customer");
check((await purchases.reconcileClassroom(api, grantDb, "cus_1", "u1", false)).length === 0, "Never granted twice");

// ── Download and presenter routes ────────────────────────────────────────
class SpeechError extends Error { constructor(status, message) { super(message); this.status = status; } }
let owned = [], authFails = false, signed = [];
const db = { storage: { from(bucket) { return { createSignedUrl: async (path, seconds, options) => { signed.push({ bucket, path, seconds, options }); return { data: { signedUrl: `https://storage.invalid/${path}?token=SYNTHETIC` }, error: null }; } }; } }, from(name) { assert.equal(name, "classroom_purchases"); return { select: () => ({ eq: async () => ({ data: owned.map((pack) => ({ pack })), error: null }) }) }; } };
const server = {
  SpeechError,
  actor: async () => { if (authFails) throw new SpeechError(401, "Please reconnect."); return { db, user: { id: "u1" } }; },
  response: (body, status = 200) => Response.json(body, { status }),
  failure: (error) => Response.json({ error: error.message }, { status: error.status || 503 }),
};
const { GET: download } = load("src/app/api/classroom/download/route.ts", { "@/lib/speech/server": server });
const req = (url, auth = true) => new Request(`https://fixture.invalid${url}`, auth ? { headers: { Authorization: "Bearer SYNTHETIC" } } : {});
check((await download(req("/api/classroom/download?pack=debate&format=pptx"))).status === 403 && signed.length === 0, "No purchase, no download link");
owned = ["debate"];
const file = await download(req("/api/classroom/download?pack=debate&format=pdf"));
check(file.status === 200 && (await file.json()).url.startsWith("https://storage.invalid/v1/debate.pdf"), "Owner gets a signed link to the PDF");
check(signed.at(-1).bucket === "classroom-packs" && signed.at(-1).seconds <= 60 && signed.at(-1).options.download.endsWith(".pdf"), "Short-lived private link, saved as an attachment");
check((await download(req("/api/classroom/download?pack=speech&format=pdf"))).status === 403, "One pack does not unlock another");
check((await download(req("/api/classroom/download?pack=debate&format=exe"))).status === 400, "Unknown format rejected");
check((await download(req("/api/classroom/download?pack=../../etc&format=pdf"))).status === 400, "Pack id cannot traverse paths");
owned = ["all"];
check((await download(req("/api/classroom/download?pack=speech&format=pptx"))).status === 200, "All-packs unlocks every pack");

const { GET: slides } = load("src/app/api/classroom/slides/route.ts", { "@/lib/speech/server": server, "@/data/classroomPacks.json": { __esModule: true, default: content } });
owned = [];
let deck = await (await slides(req("/api/classroom/slides?pack=question-of-the-day", false))).json();
check(!deck.full && deck.slides.length === 5 && deck.total === 180, "Signed-out presenter shows the 5-slide preview");
owned = ["question-of-the-day"];
deck = await (await slides(req("/api/classroom/slides?pack=question-of-the-day"))).json();
check(deck.full && deck.slides.length === 180 && deck.slides[0].followUp, "Owner presents the whole pack");
authFails = true;
deck = await (await slides(req("/api/classroom/slides?pack=question-of-the-day"))).json();
check(!deck.full && deck.slides.length === 5, "Expired session falls back to the preview");
authFails = false;
check((await slides(req("/api/classroom/slides?pack=nope"))).status === 400, "Unknown pack rejected");

console.log(`PASS ${checks} classroom pack content, export, purchase verification, grant, download and presenter assertions; no network.`);
