// Classroom kids / student pages (2026-10-16): bank tags and safety blocklist,
// either/or splitting for projector mode, page wiring (projector, pack card,
// sitemap, en-only, kids switch).
// Run: node scripts/classroom-kids-regression.mjs (also part of generators:test)
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
const src = (f) => readFileSync(resolve(root, f), "utf8");
const k = load("src/data/kidsQuestions.ts", {});
const cache = new Map();
const kk = load("src/data/kidsQuestions.ts", {}, cache);
const mm = load("src/data/morningMeeting.ts", { "./kidsQuestions": kk }, cache);
const rd = load("src/data/riddlesForKids.ts", {});

let passed = 0;
const test = (name, fn) => {
  try { fn(); passed++; } catch (error) { console.error(`✗ ${name}`); throw error; }
};

const BANKS = {
  KIDS_THIS_OR_THAT: { grades: k.KIDS_GRADES.map((g) => g.id), min: 100, split: true },
  KIDS_WOULD_YOU_RATHER: { grades: k.KIDS_GRADES.map((g) => g.id), min: 100, split: true },
  STUDENT_GET_TO_KNOW_YOU: { grades: k.STUDENT_GRADES.map((g) => g.id), min: 120, split: false },
  KIDS_JOURNAL_PROMPTS: { grades: k.KIDS_GRADES.map((g) => g.id), min: 50, split: false, anyEnding: true },
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
      assert.match(q.text, spec.anyEnding ? /^[A-Z].*[?.”]$/ : /^[A-Z].*\?$/, `question format: ${q.text}`);
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

test("riddles: 200+, every one has an answer, level, type and kids tag", () => {
  const r = rd.RIDDLES_FOR_KIDS;
  assert.ok(r.length >= 200, `${r.length} riddles`);
  assert.equal(new Set(r.map((x) => x.q.toLowerCase())).size, r.length, "duplicate riddle");
  const levels = new Set(rd.RIDDLE_LEVELS.map((l) => l.id)), types = new Set(rd.RIDDLE_TYPES.map((t) => t.id));
  for (const x of r) {
    assert.equal(x.audience, "kids", x.q);
    assert.ok(levels.has(x.level) && types.has(x.type), x.q);
    assert.ok(x.a && x.a.trim().length >= 1, `answer for ${x.q}`);
    assert.match(x.q, /\?$|\.$/, x.q);
  }
  for (const l of levels) assert.ok(r.filter((x) => x.level === l).length >= 30, l);
  assert.deepEqual(r.filter((x) => BLOCK.test(`${x.q} ${x.a}`)).map((x) => x.q), []);
});

test("morning meeting: same calendar day gives the same set, next day differs (CL4)", () => {
  const morning = new Date(2026, 9, 16, 7, 5), evening = new Date(2026, 9, 16, 22, 40);
  assert.deepEqual(mm.morningMeetingFor(morning), mm.morningMeetingFor(evening));
  assert.equal(mm.dayNumber(morning), mm.dayNumber(evening));
  const days = Array.from({ length: 30 }, (_, i) => mm.morningMeetingFor(new Date(2026, 9, 1 + i)));
  for (let i = 1; i < days.length; i++) assert.notEqual(days[i].share.text, days[i - 1].share.text);
  assert.equal(new Set(days.map((d) => d.share.text)).size, 30, "no repeats within a month");
  for (const g of ["k2", "g36"]) assert.ok(mm.morningMeetingFor(morning, g).share.grades.includes(g));
  const all = [...mm.MORNING_GREETINGS.map((x) => `${x.name} ${x.how}`), ...mm.MORNING_ACTIVITIES.map((x) => `${x.name} ${x.how}`), ...mm.MORNING_SHARE.map((x) => x.text)];
  assert.deepEqual(all.filter((t) => BLOCK.test(t)), []);
  assert.ok(mm.MORNING_SHARE.length >= 80 && mm.MORNING_GREETINGS.length >= 25 && mm.MORNING_ACTIVITIES.length >= 25);
});

test("journal prompts: kids section added, page title untouched", () => {
  const page = src("src/app/journal-prompts/page.tsx");
  assert.ok(page.includes('title: "Journal Prompt Generator — Daily Journal Prompts by Style, Free"'));
  assert.ok(page.includes('id="kids"') && page.includes('headingLevel="h2"') && page.includes("KIDS_JOURNAL_PROMPTS"));
});

const PAGES = {
  "/this-or-that/kids": "src/app/this-or-that/kids/page.tsx",
  "/would-you-rather/kids": "src/app/would-you-rather/kids/page.tsx",
  "/topics/get-to-know-you-questions-for-students": "src/app/topics/get-to-know-you-questions-for-students/page.tsx",
  "/morning-meeting-questions": "src/app/morning-meeting-questions/page.tsx",
  "/riddles-for-kids": "src/app/riddles-for-kids/page.tsx",
};
const sitemap = src("src/app/sitemap.ts");
const ES_TWINS = new Set(["/this-or-that/kids", "/would-you-rather/kids"]);
const config = src("src/i18n/config.ts");
for (const [path, file] of Object.entries(PAGES)) {
  test(`${path}: generator first, projector, pack card, og, sitemap, en-only`, () => {
    const page = src(file);
    const generator = Math.max(page.indexOf("<ClassroomQuestionGenerator"), page.indexOf("<MorningMeeting />"));
    const list = Math.max(page.indexOf("<QuestionBank"), page.indexOf("<RiddleList"));
    assert.ok(generator > 0 && generator < list, "generator above the list");
    assert.match(page, /<ClassroomPackCard pack="question-of-the-day" page=\{PATH\}/);
    assert.match(page, /<FaqSchema items=\{FAQ_ITEMS\}/);
    assert.match(page, new RegExp(`const PATH = "${path.replace(/\//g, "\\/")}"`));
    assert.ok(sitemap.includes(`"${path.slice(1)}"`), "in sitemap");
    if (ES_TWINS.has(path)) assert.ok(!config.includes(`"${path}"`) && existsSync(resolve(root, `src/app/es${path}/page.tsx`)), "has a Spanish twin");
    else assert.ok(config.includes(`"${path}"`), "en-only (no Spanish twin yet)");
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
  for (const key of ['"ArrowRight"', '"ArrowLeft"', '"Escape"', 'e.key === "f"', "requestFullscreen", 'aria-modal="true"', "overflow-x-hidden", "setRevealed(true)", "kickers?.[index]"]) assert.ok(p.includes(key), key);
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

const ct = load("src/data/classroomTimer.ts", {});
test("classroom timer: routines, presets, clock", () => {
  assert.equal(ct.clock(0), "0:00"); assert.equal(ct.clock(65), "1:05"); assert.equal(ct.clock(1200), "20:00");
  assert.deepEqual(ct.TIMER_PRESETS, [...ct.TIMER_PRESETS].sort((a, b) => a - b));
  const tps = ct.TIMER_ROUTINES.find((r) => r.id === "think-pair-share");
  assert.deepEqual(tps.phases.map((p) => p.seconds), [60, 120, 60]);
  assert.equal(ct.routineLength(tps), 240);
  assert.equal(new Set(ct.TIMER_ROUTINES.map((r) => r.id)).size, ct.TIMER_ROUTINES.length);
  for (const r of ct.TIMER_ROUTINES) for (const p of r.phases) {
    assert.ok(p.seconds >= 30 && p.seconds <= 1200, `${r.id} ${p.label}`);
    if (r.id !== "timer") assert.ok(p.instruction.length > 10, `${r.id} ${p.label} instruction`);
  }
  for (const b of ct.BRAIN_BREAKS) assert.ok(!BLOCK.test(b), b);
});

test("classroom timer: wall-clock tick, chime, full screen, keys, no fetch", () => {
  const c = src("src/components/ClassroomTimer.tsx");
  for (const key of ["Date.now() + ", "endAt - Date.now()", "createOscillator", "requestFullscreen", 'aria-modal="true"', "overflow-x-hidden", 'e.key === " "', '"Escape"', "document.title", "<h1"]) assert.ok(c.includes(key), key);
  assert.ok(!/fetch\(/.test(c), "timer must not call the API");
  const page = src("src/app/classroom-timer/page.tsx");
  assert.ok(!page.includes("<h1"), "one h1 (in the component)");
  assert.match(page, /<ClassroomPackCard pack="question-of-the-day" page=\{PATH\}/);
  assert.match(page, /<FaqSchema items=\{FAQ_ITEMS\}/);
  assert.ok(sitemap.includes('"classroom-timer"') && config.includes('"/classroom-timer"'));
  readFileSync(resolve(root, "public/og/classroom-timer.jpg"));
  assert.ok(src("src/components/ClassroomToolLinks.tsx").includes('href: "/classroom-timer"'));
});

const rgen = load("src/lib/randomGenerators.ts", {}, cache);
const gr = load("src/lib/groupRules.ts", { "./randomGenerators": rgen }, cache);
test("group generator: even sizes, everyone once, rules met across 300 seeds", () => {
  const names = "Ava Ben Chloe Diego Emma Finn Grace Hiro Isla Jonah Kai Luna Mateo Nia Omar Priya Quinn Rosa Sam Tia Uma Vik Wes".split(" ");
  const rules = { together: gr.parsePairs("Ava + Ben\nKai & Luna & Mateo", names), apart: gr.parsePairs("Ava, Chloe\nDiego/Emma\nBen + Finn\nKai + Nia", names) };
  assert.equal(rules.together.length, 4); assert.equal(rules.apart.length, 4);
  for (let seed = 1; seed <= 300; seed++) {
    for (const k of [3, 5, 6]) {
      const r = gr.makeGroups(names, k, rules, rgen.createRng(seed));
      const sizes = r.groups.map((g) => g.length);
      assert.equal(r.groups.length, k);
      assert.deepEqual(r.groups.flat().sort(), [...names].sort());
      assert.ok(Math.max(...sizes) - Math.min(...sizes) <= 1, `sizes ${sizes}`);
      assert.equal(r.broken.length, 0, `seed ${seed} k ${k}`);
    }
  }
  assert.deepEqual(gr.groupSizes(23, 6), [4, 4, 4, 4, 4, 3]);
  assert.equal(gr.groupCountFor(23, "size", 4), 6);
  assert.equal(gr.groupCountFor(3, "groups", 8), 3);
});

test("group generator: impossible rules are reported, not hidden", () => {
  const r = gr.makeGroups(["A", "B", "C"], 2, { together: [["A", "B"]], apart: [["A", "B"]] }, rgen.createRng(1));
  assert.equal(r.broken.length, 1);
  const crowd = gr.makeGroups(["A", "B", "C", "D"], 2, { together: [], apart: gr.parsePairs("A + B + C", ["A", "B", "C", "D"]) }, rgen.createRng(1));
  assert.ok(crowd.broken.length >= 1 && crowd.broken.every((b) => b.kind === "apart"));
  assert.deepEqual(gr.parsePairs("ava + nobody\n\nBEN and chloe", ["Ava", "Ben", "Chloe"]), [["Ben", "Chloe"]]);
});

test("group generator page: wiring, one h1, links both ways", () => {
  const c = src("src/components/GroupGenerator.tsx");
  for (const key of ["<h1", "makeGroups", "<PrintButton", "requestFullscreen", 'aria-modal="true"', "overflow-x-hidden", "rt_team_lists_v1", "data-group-broken"]) assert.ok(c.includes(key), key);
  assert.ok(!/fetch\(/.test(c));
  const page = src("src/app/random-group-generator/page.tsx");
  assert.ok(!page.includes("<h1"));
  assert.match(page, /<ClassroomPackCard pack="question-of-the-day" page=\{PATH\}/);
  assert.ok(page.includes('href="/random-team-generator"'));
  assert.ok(src("src/app/random-team-generator/page.tsx").includes('href="/random-group-generator"'));
  assert.ok(src("src/app/random-team-generator/page.tsx").includes('const TITLE = "Random Team & Group Generator — Fair, Balanced Groups in One Click";'), "team page title untouched");
  assert.ok(sitemap.includes('"random-group-generator"') && config.includes('"/random-group-generator"'));
  readFileSync(resolve(root, "public/og/random-group-generator.jpg"));
});

const es = load("src/data/kidsQuestions.es.ts", { "./kidsQuestions": kk }, cache);
// Unicode-aware word edges: plain \\b treats accented letters as breaks ("atmosférico" ⊃ "rico").
const BLOCK_ES = /(?<!\p{L})(beso\w*|novi[oa]s?|enamorad\w*|cita|cerveza|vino|alcohol|borrach\w*|pistolas?|armas?|matar|muert\w*|morir|sangre|pelea\w*|guerras?|presidente|elecci\w+|pol[ií]tic\w*|religi\w+|iglesia|dinero|rico|pobre|loter[ií]a|banco|dieta|gord\w*|feo|infierno|miedo\w*|terror|zombis?|fantasmas?)(?!\p{L})/iu;
test("Spanish kids banks: size, unique, clean, splittable", () => {
  const banks = { tot: es.KIDS_THIS_OR_THAT_ES, wyr: es.KIDS_WOULD_YOU_RATHER_ES, journal: es.KIDS_JOURNAL_PROMPTS_ES };
  assert.ok(banks.tot.length >= 90 && banks.wyr.length >= 60 && banks.journal.length >= 50, Object.values(banks).map((b) => b.length).join("/"));
  const grades = new Set(es.KIDS_GRADES_ES.map((g) => g.id));
  for (const [name, bank] of Object.entries(banks)) {
    assert.equal(new Set(bank.map((q) => q.text.toLowerCase())).size, bank.length, `${name} duplicates`);
    for (const q of bank) {
      assert.equal(q.audience, "kids");
      assert.ok(q.grades.length && q.grades.every((g) => grades.has(g)), q.text);
      assert.ok(name === "journal" ? !BLOCK_ES.test(q.text) || /miedo a probar|un poco de miedo/.test(q.text) : !BLOCK_ES.test(q.text), `${name}: ${q.text}`);
      if (name !== "journal") {
        assert.match(q.text, /^¿.+\?$/, q.text);
        const sides = k.splitChoice(q.text);
        assert.ok(sides && sides[0].length > 1 && sides[1].length > 1, `split: ${q.text}`);
      }
    }
  }
  assert.deepEqual(k.splitChoice("¿Pizza o tacos?"), ["Pizza", "Tacos"]);
  assert.deepEqual(k.splitChoice("¿Qué prefieres: poder volar o ser invisible?"), ["Poder volar", "Ser invisible"]);
  assert.deepEqual(new Set(banks.tot.map((q) => q.theme)), new Set(es.KIDS_THEMES_ES.map((t) => t.id)));
});

test("Spanish classroom pages: canonical, hreflang twin, lang, switch, journal block", () => {
  for (const [path, en] of [["/es/this-or-that/kids", "/this-or-that/kids"], ["/es/would-you-rather/kids", "/would-you-rather/kids"]]) {
    const page = src(`src/app${path}/page.tsx`);
    assert.ok(page.includes(`const PATH = "${path}"`) && page.includes(`hreflangAlternates("${en}")`) && page.includes('lang="es"') && page.includes('locale="es"'));
    assert.ok(!page.includes("ClassroomPackCard"), "English slide packs are not promoted on Spanish pages");
  }
  assert.ok(src("src/app/es/this-or-that/page.tsx").includes('kids="/es/this-or-that/kids" active="general" locale="es"'));
  assert.ok(src("src/app/es/would-you-rather/page.tsx").includes('kids="/es/would-you-rather/kids" active="general" locale="es"'));
  const topic = src("src/app/es/topics/[slug]/page.tsx");
  assert.ok(topic.includes('article.slug === "writing-prompts-for-kids"') && topic.includes("KIDS_JOURNAL_PROMPTS_ES") && topic.includes('headingLevel="h2"'));
  for (const f of ["src/components/ClassroomQuestionGenerator.tsx", "src/components/ClassroomProjector.tsx"]) assert.ok(src(f).includes("es: {"), `${f} has Spanish strings`);
});

console.log(`classroom kids: ${passed} tests passed`);
