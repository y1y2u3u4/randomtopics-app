// Regression for the 2026-10-28 recommendation cards: scene-based picks, "next step" row,
// same-language locale cards, next_* events. Run: node scripts/next-cards-regression.mjs
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
const cards = load("src/data/nextCards.ts");
const seo = readFileSync(resolve(root, "src/data/seoContent.ts"), "utf8");
const esSeo = ["", ".part1", ".part2", ".part3", ".part4", ".part5"].map((p) => { try { return readFileSync(resolve(root, `src/data/seoContent.es${p}.ts`), "utf8"); } catch { return ""; } }).join("\n");
const topicSlugs = new Set([...seo.matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]));
const esTopicSlugs = new Set([...esSeo.matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]));

function routeExists(href) {
  const parts = href.split("/").filter(Boolean);
  if (existsSync(resolve(root, "src/app", ...parts, "page.tsx"))) return true;
  if (parts[0] === "topics" && parts.length === 2) return topicSlugs.has(parts[1]);
  if (parts[0] === "es" && parts[1] === "topics" && parts.length === 3) return esTopicSlugs.has(parts[2]) || topicSlugs.has(parts[2]);
  // Mode routes such as /es/[mode] are not used by cards.
  return false;
}
let checked = 0;
const mustExist = (href, where) => { assert.ok(routeExists(href), `${where}: ${href} is not a real route`); checked++; };

// Scenes: members are exclusive, picks are real pages, picks never include the page itself.
const seen = new Map();
for (const s of cards.SCENES) {
  for (const m of s.members) {
    assert.ok(!seen.has(m), `${m} is in scenes ${seen.get(m)} and ${s.scene}`);
    seen.set(m, s.scene);
    mustExist(m, `scene ${s.scene} member`);
    const picks = cards.sceneNext(m, 3);
    assert.equal(picks.length, 3, `${m}: needs 3 same-scene picks`);
    assert.ok(picks.every((p) => p.href !== m), `${m}: recommends itself`);
  }
  for (const p of s.picks) mustExist(p.href, `scene ${s.scene} pick`);
}
// Same scene, not random: classroom pages recommend classroom tools, couples pages couples tools.
const classroomOk = new Set(cards.SCENES.find((s) => s.scene === "classroom").picks.map((p) => p.href));
for (const p of cards.sceneNext("/question-of-the-day-for-students", 3)) assert.ok(classroomOk.has(p.href), `classroom pick ${p.href}`);
const couplesOk = new Set(cards.SCENES.find((s) => s.scene === "couples").picks.map((p) => p.href));
for (const p of cards.sceneNext("/this-or-that/couples", 3)) assert.ok(couplesOk.has(p.href), `couples pick ${p.href}`);
assert.ok(cards.sceneNext("/topics/conversation-starters-for-couples", 3).some((p) => p.href === "/couples-daily-question"), "couples pages recommend the couples daily question");
assert.equal(cards.sceneNext("/charades-nonexistent"), null, "unknown pages fall back to the legacy picks");
console.log("PASS scenes: exclusive members, real routes, same-scene picks");

// Next step rows.
for (const [path, step] of Object.entries(cards.NEXT_STEPS)) {
  mustExist(path, "next step page"); mustExist(step.next.href, `${path} next`); mustExist(step.collection.href, `${path} collection`);
  assert.notEqual(step.next.href, path); assert.notEqual(step.collection.href, path);
  assert.notEqual(step.next.href, step.collection.href, `${path}: next and collection must differ`);
}
assert.equal(cards.NEXT_STEPS["/charades"].next.href, "/this-or-that", "charades -> this-or-that");
console.log("PASS next steps:", Object.keys(cards.NEXT_STEPS).length, "pages");

for (const fam of cards.EXTRA_CATEGORY_FAMILIES) { assert.ok(fam.length >= 4); for (const t of fam) mustExist(t.href, "category family"); }

// Other languages: same-language picks only, real routes.
for (const [scene, list] of Object.entries(cards.ES_SCENES)) for (const t of list) { assert.ok(t.href.startsWith("/es/"), `es ${scene}: ${t.href}`); mustExist(t.href, `es ${scene}`); }
for (const path of ["/es/charades", "/es/generador-de-temas-para-investigar", "/es/topics/most-likely-to-questions", "/es/preguntas-profundas"]) {
  const out = cards.esNext(path);
  assert.equal(out.length, 4, `${path}: 4 Spanish cards`);
  assert.ok(out.every((t) => t.href.startsWith("/es/") && t.href !== path), `${path}: cards must stay in Spanish`);
}
assert.equal(cards.localeSceneOf("/would-you-rather"), "party");
assert.equal(cards.localeSceneOf("/speech"), "learn");
assert.equal(cards.localeOfPath("/pt/roleta-de-temas"), "pt");
assert.equal(cards.localeOfPath("/charades"), null);
console.log("PASS locale cards: Spanish scenes and scene classification");

// Source-level wiring.
const src = (f) => readFileSync(resolve(root, f), "utf8");
const track = src("src/lib/track.ts");
assert.match(track, /NEXT_EVENT\s*=\s*\/\^next_/, "next_* events must reach Umami");
assert.ok(track.includes('"from"') && track.includes('"target_path"') && track.includes('"slot"'), "umami props: slot, from, target_path");
const tn = src("src/components/TryNext.tsx");
for (const ev of ["next_locale_click", "next_card_click"]) assert.ok(tn.includes(ev), `TryNext sends ${ev}`);
assert.ok(src("src/components/NextStepRow.tsx").includes("next_result_click"));
assert.ok(src("src/components/RelatedToolLink.tsx").includes("related_tool_click"), "legacy event kept");
assert.ok(src("src/app/topics/[slug]/page.tsx").includes('placement="mid"') && src("src/app/es/topics/[slug]/page.tsx").includes('placement="mid"'), "topic pages get the mid-article row");
// Layout stability: the next-step row has a fixed min height and no popups/modals.
assert.match(src("src/components/NextStepRow.tsx"), /min-h-11/);
assert.ok(!/dialog|modal|fixed inset/.test(src("src/components/NextStepRow.tsx")));
console.log(`PASS wiring; ${checked} hrefs resolved to real routes`);
