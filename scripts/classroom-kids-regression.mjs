// Classroom kids / student pages (2026-10-16): bank tags and safety blocklist,
// either/or splitting for projector mode, page wiring (projector, pack card,
// sitemap, en-only, kids switch).
// Run: node scripts/classroom-kids-regression.mjs (also part of generators:test)
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
const src = (f) => readFileSync(resolve(root, f), "utf8");
const k = load("src/data/kidsQuestions.ts", {});

let passed = 0;
const test = (name, fn) => {
  try { fn(); passed++; } catch (error) { console.error(`✗ ${name}`); throw error; }
};

const BANKS = {
  KIDS_THIS_OR_THAT: { grades: k.KIDS_GRADES.map((g) => g.id), min: 100, split: true },
  KIDS_WOULD_YOU_RATHER: { grades: k.KIDS_GRADES.map((g) => g.id), min: 100, split: true },
  STUDENT_GET_TO_KNOW_YOU: { grades: k.STUDENT_GRADES.map((g) => g.id), min: 120, split: false },
};

// Words that must never reach a kids classroom deck.
const BLOCK = /\b(kiss\w*|dat(e|ing)|boyfriend|girlfriend|crush|romantic|love life|marr\w+|beer|wine|alcohol|drunk|party drinks?|guns?|weapons?|kill\w*|die|dies|death|dead|blood\w*|fight\w*|wars?|punch\w*|president|election|vote for|politic\w*|democrat|republican|religio\w*|church|sexy|ex|boss|salary|rich|poor|money|lottery|bank|diet|weight|ugly|fat|hell|damn|scar(y|e)|horror|zombies?)\b/i;

test("blocklist catches what it should", () => {
  for (const bad of ["Would you rather kiss a frog?", "Beer or wine?", "Who would you vote for president?", "Zombies or ghosts?"]) assert.ok(BLOCK.test(bad), bad);
  assert.ok(!BLOCK.test("Pizza party or pajama day?"));
});

for (const [name, spec] of Object.entries(BANKS)) {
  const bank = k[name];
  test(`${name}: size, audience tag, grades, no duplicates`, () => {
    assert.ok(bank.length >= spec.min, `${name} has ${bank.length}`);
    assert.equal(new Set(bank.map((q) => q.text.toLowerCase())).size, bank.length, "duplicate question");
    for (const q of bank) {
      assert.equal(q.audience, "kids", q.text);
      assert.ok(q.grades.length > 0 && q.grades.every((g) => spec.grades.includes(g)), q.text);
      assert.match(q.text, /^[A-Z].*\?$/, `question format: ${q.text}`);
    }
    for (const g of spec.grades) assert.ok(bank.filter((q) => q.grades.includes(g)).length >= 30, `${name} ${g} has fewer than 30`);
  });
  test(`${name}: no adult or sensitive topics`, () => {
    const hits = bank.filter((q) => BLOCK.test(q.text)).map((q) => q.text);
    assert.deepEqual(hits, []);
  });
  if (spec.split) test(`${name}: every question splits into two sides of the room`, () => {
    for (const q of bank) {
      const sides = k.splitChoice(q.text);
      assert.ok(sides && sides[0].length > 1 && sides[1].length > 1, q.text);
      assert.ok(!/\bor\b/i.test(sides[0]) && !/\bor\b/i.test(sides[1]), `ambiguous split: ${q.text}`);
    }
  });
}

test("this or that themes cover every item and every theme is used", () => {
  const themes = new Set(k.KIDS_THEMES.map((t) => t.id));
  for (const q of k.KIDS_THIS_OR_THAT) assert.ok(themes.has(q.theme), q.text);
  for (const t of themes) assert.ok(k.KIDS_THIS_OR_THAT.some((q) => q.theme === t), t);
});

test("splitChoice handles would-you-rather and plain pairs", () => {
  assert.deepEqual(k.splitChoice("Would you rather be able to fly or be invisible?"), ["Be able to fly", "Be invisible"]);
  assert.deepEqual(k.splitChoice("Pizza or tacos?"), ["Pizza", "Tacos"]);
  assert.equal(k.splitChoice("What is your favorite color?"), null);
});

const PAGES = {
  "/this-or-that/kids": "src/app/this-or-that/kids/page.tsx",
  "/would-you-rather/kids": "src/app/would-you-rather/kids/page.tsx",
  "/topics/get-to-know-you-questions-for-students": "src/app/topics/get-to-know-you-questions-for-students/page.tsx",
};
const sitemap = src("src/app/sitemap.ts");
const config = src("src/i18n/config.ts");
for (const [path, file] of Object.entries(PAGES)) {
  test(`${path}: generator first, projector, pack card, og, sitemap, en-only`, () => {
    const page = src(file);
    assert.ok(page.indexOf("<ClassroomQuestionGenerator") < page.indexOf("<QuestionBank"), "generator above the list");
    assert.match(page, /<ClassroomPackCard pack="question-of-the-day" page=\{PATH\}/);
    assert.match(page, /<FaqSchema items=\{FAQ_ITEMS\}/);
    assert.match(page, new RegExp(`const PATH = "${path.replace(/\//g, "\\/")}"`));
    assert.ok(sitemap.includes(`"${path.slice(1)}"`), "in sitemap");
    assert.ok(config.includes(`"${path}"`), "en-only (no Spanish twin yet)");
    const og = page.match(/\/og\/([a-z0-9-]+)\.jpg/)[1];
    readFileSync(resolve(root, "public/og", `${og}.jpg`));
  });
}

test("student page usage picks all come from the bank", () => {
  const page = src(PAGES["/topics/get-to-know-you-questions-for-students"]);
  const block = page.slice(page.indexOf("const USES"), page.indexOf("const byGrade"));
  const picks = [...block.matchAll(/^\s+"([^"]+\?)",$/gm)].map((m) => m[1]);
  assert.equal(picks.length, 15);
  const bank = new Set(k.STUDENT_GET_TO_KNOW_YOU.map((q) => q.text));
  for (const p of picks) assert.ok(bank.has(p), p);
});

test("projector: keyboard paging, full screen, escape, no fetch", () => {
  const p = src("src/components/ClassroomProjector.tsx");
  for (const key of ['"ArrowRight"', '"ArrowLeft"', '"Escape"', 'e.key === "f"', "requestFullscreen", 'aria-modal="true"', "overflow-x-hidden"]) assert.ok(p.includes(key), key);
  assert.ok(!/fetch\(/.test(p), "projector must not call the API");
});

test("general pages link to the kids versions without new titles", () => {
  for (const [file, kids] of [["src/app/this-or-that/page.tsx", "/this-or-that/kids"], ["src/app/would-you-rather/page.tsx", "/would-you-rather/kids"]]) {
    const page = src(file);
    assert.ok(page.includes(`kids="${kids}" active="general"`), file);
  }
  assert.ok(src("src/app/classroom-packs/page.tsx").includes("<ClassroomToolLinks"));
  assert.ok(src("src/app/categories/[category]/page.tsx").includes('href="/this-or-that/kids"'));
});

console.log(`classroom kids: ${passed} tests passed`);
