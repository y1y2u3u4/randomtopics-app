// Tests for /roast-me-in-one-sentence: roast data rules, trait matching, no-repeat
// draws, share links, the daily roast and page wiring.
// Run: node scripts/roast-regression.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import { load } from "./lib/load-typescript.mjs";

const r = load("src/lib/generators/roast.ts");
const { createRng } = load("src/lib/randomGenerators.ts");
const { TRAITS, HEATS, LIMITS } = r;
let passed = 0;
const test = (name, fn) => { try { fn(); passed++; } catch (e) { console.error(`x ${name}`); throw e; } };
const words = (t) => t.trim().split(/\s+/).length;
const heats = ["mild", "spicy", "savage"];
const traitIds = TRAITS.map((t) => t.id);
const path = "/roast-me-in-one-sentence";
const pageFile = `src/app${path}/page.tsx`;
const read = (file) => fs.readFileSync(file, "utf8");

test("at least 30 unique kebab-case traits with two lines per heat and four generic lines per heat", () => {
  assert.ok(TRAITS.length >= 30, `${TRAITS.length} traits`);
  assert.equal(new Set(traitIds).size, TRAITS.length);
  assert.deepEqual(HEATS.map((h) => h.id).sort(), [...heats].sort());
  for (const trait of TRAITS) {
    assert.match(trait.id, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.notEqual(trait.id, "any", "reserved generic id");
    for (const heat of heats) assert.equal(trait.lines[heat].length, 2, `${trait.id}/${heat}`);
  }
  for (const heat of heats) assert.ok(r.linesFor("any", heat).length >= 4, heat);
});

test("every roast is unique, starts with You or Your and fits one sentence of at most 25 words", () => {
  const seen = new Set();
  for (const trait of [...traitIds, "any"]) for (const heat of heats) {
    for (const line of r.linesFor(trait, heat)) {
      const label = `${trait}/${heat}: ${line}`;
      assert.match(line, /^(You|Your) /, label);
      assert.match(line, /[.!?]["'”’]?$/, label);
      assert.doesNotMatch(line, /[.!?]\s/, label);
      assert.ok(words(line) <= 25, label);
      assert.ok(!seen.has(line), `duplicate roast: ${label}`);
      seen.add(line);
    }
  }
});

test("roasts stay clear of denylisted looks, body, identity and health terms", () => {
  const banned = /\b(?:ugly|fat|body|weights?|chins?|faces?|noses?|teeth|skinny|short|tall|bald|hairlines?|skincare|races?|black|white|asians?|gay|religions?|jesus|muslims?|disabled|autis\w*|retard\w*|depress\w*|suicid\w*|cancer)\b/i;
  for (const trait of [...traitIds, "any"]) for (const heat of heats) {
    for (const line of r.linesFor(trait, heat)) assert.doesNotMatch(line, banned, `${trait}/${heat}: ${line}`);
  }
});

test("description matching respects first mention order, plurals and word boundaries", () => {
  const want = ["late", "coffee", "texts-back"];
  const hits = r.matchTraits("always late, lives on iced coffee, never texts back");
  assert.deepEqual(hits.filter((id) => want.includes(id)), want);
  assert.deepEqual(r.matchTraits("I love my cats"), ["cat"]);
  assert.deepEqual(r.matchTraits(""), []);
  assert.deepEqual(r.matchTraits("qwerty"), []);
  assert.ok(!r.matchTraits("lately").includes("late"));
  assert.ok(!r.matchTraits("category").includes("cat"));
});

test("names are trimmed, truncated and collapsed onto one line", () => {
  const line = "You are late.";
  assert.equal(r.withName(line, "  Sam  "), "Sam, you are late.");
  assert.equal(r.withName(line, ""), line);
  const longName = "x".repeat(LIMITS.name + 10);
  const truncated = longName.slice(0, LIMITS.name);
  assert.equal(r.cleanName(longName), truncated);
  assert.equal(r.withName(line, longName), `${truncated}, you are late.`);
  assert.equal(r.cleanName("  Sam\r\n\t Lee  "), "Sam Lee");
  assert.equal(r.withName(line, "Sam\nLee"), "Sam Lee, you are late.");
});

test("draws exhaust all four roasts before repeating and still work after exhaustion", () => {
  const traits = ["late", "gym"];
  const heat = "spicy";
  const want = new Set(traits.flatMap((trait) =>
    r.linesFor(trait, heat).map((_, index) => r.roastKey({ trait, heat, index }))));
  const seen = new Set();
  const rng = createRng(9);
  for (let i = 0; i < 4; i++) {
    const key = r.roastKey(r.nextRoast(traits, heat, "", seen, rng()));
    assert.ok(want.has(key), key);
    assert.ok(!seen.has(key), `repeated before exhaustion: ${key}`);
    seen.add(key);
  }
  assert.deepEqual(seen, want);
  const next = r.nextRoast(traits, heat, "", seen, rng());
  assert.ok(want.has(r.roastKey(next)));
});

test("empty and unknown trait selections fall back to generic, and unknown ids do not alter valid selections", () => {
  const draw = (traits) => r.nextRoast(traits, "mild", "", new Set(), createRng(3)());
  const generic = draw([]);
  assert.equal(generic.trait, "any");
  assert.equal(generic.heat, "mild");
  assert.equal(generic.name, "");
  assert.ok(Number.isInteger(generic.index) && generic.index >= 0 && generic.index < r.linesFor("any", "mild").length);
  assert.deepEqual(draw(["not-a-trait"]), generic);
  assert.deepEqual(draw(["not-a-trait", "late"]), draw(["late"]));
});

test("share codes round-trip every roast, and a hash reopens a roast with a Unicode name", () => {
  for (const trait of [...traitIds, "any"]) for (const heat of heats) {
    for (let index = 0; index < r.linesFor(trait, heat).length; index++) {
      const roast = { trait, heat, index, name: "" };
      assert.deepEqual(r.decodeRoast(r.encodeRoast(roast)), roast, r.roastKey(roast));
    }
  }
  const roast = { trait: "late", heat: "spicy", index: 1, name: "Zoë 🔥" };
  const code = r.encodeRoast(roast);
  assert.deepEqual(r.decodeRoast(code), roast);
  assert.deepEqual(r.roastFromHash(`#r=${code}`), roast);
});

test("share decoding rejects garbage and malformed payloads", () => {
  assert.equal(r.decodeRoast("%%%"), null);
  const invalid = [
    ["unknown trait", ["not-a-trait", "spicy", 0, ""]],
    ["bad heat", ["late", "hot", 0, ""]],
    ["negative index", ["late", "spicy", -1, ""]],
    ["out-of-range index", ["late", "spicy", r.linesFor("late", "spicy").length, ""]],
    ["non-integer index", ["late", "spicy", 0.5, ""]],
    ["wrong array length", ["late", "spicy", 0, "", "extra"]],
  ];
  for (const [label, payload] of invalid) {
    assert.equal(r.decodeRoast(Buffer.from(JSON.stringify(payload)).toString("base64url")), null, label);
  }
});

test("the daily roast is UTC-stable, rotates traits and is always spicy and unnamed", () => {
  process.env.TZ = "Asia/Shanghai";
  const days = Array.from({ length: 30 }, (_, i) => {
    const early = r.roastOfTheDay(new Date(Date.UTC(2026, 10, 1 + i, 0, 1)));
    const late = r.roastOfTheDay(new Date(Date.UTC(2026, 10, 1 + i, 23, 59)));
    assert.deepEqual(early, late);
    assert.ok(traitIds.includes(early.trait), early.trait);
    assert.equal(early.heat, "spicy");
    assert.equal(early.name, "");
    return early;
  });
  const changes = days.slice(1).filter((roast, i) => roast.trait !== days[i].trait).length;
  assert.ok(changes >= 25, `${changes} trait changes across 30 UTC dates`);
});

test("page is wired into sitemap, English-only routes, ads, discovery data and SEO audit", () => {
  assert.ok(read("src/app/sitemap.ts").includes('"roast-me-in-one-sentence"'));
  const enOnly = /\bEN_ONLY_PATHS\s*:[^=]+?=\s*new Set\(\[([\s\S]*?)\]\)/.exec(read("src/i18n/config.ts"));
  assert.ok(enOnly?.[1].includes(`"${path}"`), "EN_ONLY_PATHS");
  assert.ok(JSON.parse(read("src/data/adPublicPaths.json")).includes(path), "adPublicPaths.json");
  assert.ok(read("src/data/generators/registry.ts").includes(`href: "${path}"`), "registry.ts");
  assert.ok(read("src/data/relatedTools.ts").includes(`href: "${path}"`), "relatedTools.ts");
  assert.ok(read("public/llms.txt").includes(`(https://randomtopics.app${path})`), "llms.txt");
  assert.ok(read("scripts/seo-audit.mjs").includes(`path: "${path}"`), "seo-audit.mjs");
});

test("page title has the target phrase and fits 65 characters, and the FAQ has at least six questions", () => {
  const page = read(pageFile);
  const title = /\bconst TITLE = "([^"]+)"/.exec(page)?.[1];
  assert.ok(title?.includes("Roast Me in One Sentence"), title);
  assert.ok(title.length <= 65, `${title.length} characters: ${title}`);
  assert.match(page, /\btitle:\s*\{\s*absolute:\s*TITLE\s*\}/);
  const faq = /\bconst FAQ = \[([\s\S]*?)\n\];/.exec(page)?.[1] ?? "";
  const questions = [...faq.matchAll(/\bquestion:\s*"[^"]+"/g)];
  assert.ok(questions.length >= 6, `${questions.length} FAQ questions`);
  assert.ok(page.includes("faq={FAQ}"));
});

test("at least three other pages link to the roast generator", () => {
  const linkingPages = fs.globSync("src/app/**/page.tsx").filter((file) => {
    if (file === pageFile) return false;
    const page = read(file);
    const related = /\brelated=\{\[([\s\S]*?)\]\}/.exec(page)?.[1] ?? "";
    return page.includes(`href="${path}"`) || related.includes(`href: "${path}"`);
  });
  assert.ok(linkingPages.length >= 3, `${linkingPages.length} inbound pages: ${linkingPages.join(", ")}`);
});

test("component keeps the share loop and daily roast controls", () => {
  const component = read("src/components/generators/RoastOneSentence.tsx");
  for (const label of ["Roast them back", "Share link", "Save image", "Roast of the day"]) {
    assert.ok(component.includes(label), label);
  }
});

console.log(`roast regression: ${passed} passed`);
