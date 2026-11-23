// GSC potential queries 2026-11-19..11-22 (randomtopics dispatch queue): each phrase is served by the
// existing page that already ranks for it, not by a near-synonym page (near-synonym pages cannibalize).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (p) => readFileSync(p, 'utf8');
const sitemap = read('src/app/sitemap.ts');
const cases = [
  { query: 'interesting topics to research', file: 'src/data/purposeGenerators.ts', must: ['"interesting topics to research"', 'question: "What are some interesting topics to research?"', 'Interesting topics to research, in full'], noPage: 'interesting-topics-to-research' },
  { query: 'random number 0 to 1000', file: 'src/app/random-number-generator/page.tsx', must: ['<SectionTitle>Random number 0 to 1000</SectionTitle>', 'id="0-1000"', 'question: "How do I get a random number from 0 to 1000?"'], noPage: 'random-number-0-to-1000' },
  { query: 'choice maker', file: 'src/app/decision-maker/page.tsx', must: ['<SectionTitle>Choice Maker</SectionTitle>', 'question: "Is this a choice maker?"', '"choice maker"', 'Choice Maker &'], noPage: 'choice-maker' },
  { query: 'invent catchphrases galore', file: 'src/app/catchphrase-generator/page.tsx', must: ['<SectionTitle>Invent catchphrases galore</SectionTitle>', 'question: "How do I invent a catchphrase?"'], noPage: 'invent-catchphrases-galore' },
  { query: 'random movie before 2010', file: 'src/app/random-movie-generator/page.tsx', must: ['<SectionTitle>Random movie before 2010</SectionTitle>', 'question: "Can I get a random movie from before 2010?"', 'BEFORE_2010_PICKS'], noPage: 'random-movie-before-2010' },
  { query: 'heads up generator', file: 'src/app/charades/page.tsx', must: ['h2: "Heads Up Generator: Play the Forehead Version"', 'question: "Can I use this as a Heads Up generator?"', 'Reveal word'], noPage: 'heads-up-generator' },
];
for (const c of cases) {
  const src = read(c.file);
  for (const m of c.must) assert.ok(src.includes(m), `${c.file}: must keep "${m}" for GSC query "${c.query}"`);
  assert.ok(!sitemap.includes(c.noPage), `"${c.query}" stays on the existing page, no /${c.noPage}`);
}
// The 0-1000 QuickSet must resolve to a real preset with min 0 / max 1000.
const nr = read('src/components/generators/NumberRandomizer.tsx');
assert.match(nr, /\{ id: "0-1000", label: "0–1000", min: 0, max: 1000 \}/);
assert.match(nr, /const ALL_PRESETS = \[[^\n]*SECTION_PRESETS\]/);
// Decision maker title stays under 70 chars and keeps the 11-19 phrase.
const title = read('src/app/decision-maker/page.tsx').match(/const TITLE = "([^"]+)"/)[1];
assert.ok(title.length <= 60 && title.includes('Decider Machine') && title.startsWith('Decision Maker'), title);
// Homepage (where "interesting topics to research" used to land) links to the research page.
assert.ok(read('src/app/page.tsx').includes('Looking for interesting topics to research'), 'homepage must link research generator');
console.log('gsc phrasings 11-23 ok:', cases.length);

// 0–1000 button: the QuickSet id on the page resolves to the preset, and the real engine
// (drawNumbers + createRng, as NumberRandomizer.generate uses) stays in 0..1000 and reaches both ends.
import { load } from './lib/load-typescript.mjs';
const { drawNumbers } = load('src/lib/generators/picker.ts');
const { createRng } = load('src/lib/randomGenerators.ts');
const preset = nr.match(/\{ id: "0-1000", label: "[^"]+", min: (-?\d+), max: (\d+) \}/);
assert.ok(read('src/app/random-number-generator/page.tsx').includes('<QuickSet tool="numbers" id="0-1000">'), 'page button must target preset 0-1000');
const [lo, hi] = [Number(preset[1]), Number(preset[2])];
assert.deepEqual([lo, hi], [0, 1000]);
const seen = new Set();
for (let seed = 1; seed <= 400; seed++) {
  const { numbers, error } = drawNumbers(lo, hi, 25, true, createRng(seed));
  assert.equal(error, undefined);
  assert.equal(new Set(numbers).size, 25, 'no repeats in a batch');
  for (const x of numbers) { assert.ok(Number.isInteger(x) && x >= 0 && x <= 1000, `out of range: ${x}`); seen.add(x); }
}
assert.ok(seen.has(0) && seen.has(1000), '0 and 1000 must both be reachable');
{ const all = drawNumbers(0, 1000, 1000, true, createRng(7)).numbers; assert.equal(new Set(all).size, 1000); assert.ok(all.every((x) => x >= 0 && x <= 1000)); }
console.log('0-1000 preset ok: 10,000 draws in range, both ends reached');

// seo-audit hreflang: only <link rel="alternate"> counts (footer <a hrefLang> is navigation),
// and every declared alternate is fetched and must return 200.
const audit = read('scripts/seo-audit.mjs');
const fnSrc = (name) => audit.match(new RegExp(`function ${name}\\([\\s\\S]*?\\n\\}`))[0];
const alternateLinks = new Function(`${fnSrc('attr')}\n${fnSrc('alternateLinks')}\nreturn alternateLinks;`)();
const sample = '<link rel="alternate" hrefLang="en" href="https://randomtopics.app/x"/><link rel="alternate" hrefLang="x-default" href="https://randomtopics.app/x"/><a hrefLang="es" href="/es">Español</a>';
assert.deepEqual(alternateLinks(sample).map((a) => a.lang), ['en', 'x-default'], 'footer <a hrefLang> must not count as an alternate');
assert.deepEqual(alternateLinks(sample + '<link rel="alternate" hrefLang="es" href="https://randomtopics.app/es/x"/>').map((a) => a.lang), ['en', 'x-default', 'es']);
assert.match(audit, /await checkAlternateTargets\(\);/);
assert.match(audit, /hreflang alternate \$\{href\} returned \$\{response\.status\}/);
assert.ok(!/test\(html\)[^\n]*hreflang/i.test(audit) && !/hreflang=\["'\]es\["'\]\/i\.test\(html\)/.test(audit), 'no whole-page hreflang regex');
console.log('seo-audit hreflang checks ok');
