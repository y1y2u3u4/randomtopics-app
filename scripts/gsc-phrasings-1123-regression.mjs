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
