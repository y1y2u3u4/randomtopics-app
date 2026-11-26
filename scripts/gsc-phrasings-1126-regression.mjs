// GSC potential queries 2026-11-26 (randomtopics): answered on the page that already ranks, never a near-synonym page.
// Lesson: "my9games" and "speak topic gen"/"speechtopicgen website" are other sites' brand names (my9games.net/.app,
// speechtopicgen.com). We answer them with an honest "is this X? No" FAQ and must never put the competitor brand in a
// title/H1 or claim to be that site.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (p) => readFileSync(p, 'utf8');
const sitemap = read('src/app/sitemap.ts');
const cases = [
  { query: 'my9games', file: 'src/app/my-9-games/page.tsx', must: ['question: "Is this the my9games site?"', 'answer: "No. my9games.net', '#my9games'], noPage: 'my9games', brand: /my9games/i },
  { query: 'random location generator', file: 'src/app/random-place-generator/page.tsx', must: ['<SectionTitle>Random location generator</SectionTitle>', 'question: "Is this a random location generator too?"'], noPage: 'random-location-generator' },
  { query: 'qotd ideas for discord', file: 'src/app/discord-qotd-bot/page.tsx', must: ['<SectionTitle>QOTD ideas for Discord (original and poll-ready)</SectionTitle>', 'question: "What are good QOTD ideas for Discord that work as polls?"'], noPage: 'qotd-ideas' },
  { query: 'speak topic gen / speechtopicgen website', file: 'src/app/speech/page.tsx', must: ['question: "Is this a speak topic generator?"', 'question: "Is this Speech Topic Gen (speechtopicgen.com)?"', '"No. Speech Topic Gen at speechtopicgen.com is a separate site'], noPage: 'speech-topic-gen', brand: /speechtopicgen|speech topic gen\b/i },
];
for (const c of cases) {
  const src = read(c.file);
  for (const m of c.must) assert.ok(src.includes(m), `${c.file}: must keep "${m}" for GSC query "${c.query}"`);
  assert.ok(!sitemap.includes(`/${c.noPage}`), `"${c.query}" stays on the existing page, no /${c.noPage}`);
  if (c.brand) {
    const title = (src.match(/const TITLE = "([^"]+)"/) || src.match(/title: \{ absolute: "([^"]+)" \}/))[1];
    assert.ok(!c.brand.test(title), `${c.file}: competitor brand must not be in the title: ${title}`);
    const heading = (src.match(/heading=\{[^}]+\}/) || [''])[0];
    assert.ok(!c.brand.test(heading), `${c.file}: competitor brand must not be in the H1`);
  }
}
// Cross-links into the landing pages from their sibling tools.
assert.ok(read('src/app/random-city-generator/page.tsx').includes('href="/random-place-generator" className={linkClass}>random location generator<'), 'city → place link');
assert.ok(read('src/app/question-of-the-day/page.tsx').includes('href="/discord-qotd-bot"'), 'qotd → discord link');
assert.ok(read('src/app/impromptu-speech-topics/page.tsx').includes('href="/speech"'), 'impromptu → speech link');
console.log('gsc phrasings 11-26 ok:', cases.length);
