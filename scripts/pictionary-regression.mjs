import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';
const { PICTIONARY_THEMES, PICTIONARY_WORDS, PICTIONARY_PHRASES, wordsIn } = load('src/data/pictionary.ts');
const { KNOW_SETS, KNOW_QUESTIONS, GUESS_SECRETS, GUESS_STARTERS, MAX_QUESTIONS } = load('src/data/twentyOneQuestions.ts');
let checks = 0;
const test = (name, fn) => { fn(); checks++; console.log('PASS ' + name); };

test('≥50 words per theme, every level present, no duplicates', () => {
  assert.equal(PICTIONARY_THEMES.length, 4);
  const all = PICTIONARY_WORDS.map((e) => e.w.toLowerCase());
  assert.equal(new Set(all).size, all.length, 'duplicate word');
  assert.equal(PICTIONARY_WORDS.length, 240, 'relatedTools blurb says 240');
  for (const t of PICTIONARY_THEMES) {
    const words = PICTIONARY_WORDS.filter((e) => e.t === t.id);
    assert.ok(words.length >= 50, t.id);
    for (const lvl of [1, 2, 3]) assert.ok(words.some((e) => e.d === lvl), `${t.id} level ${lvl}`);
  }
});

test('phrases are 2–4 words, unique, cover every theme', () => {
  const seen = new Set();
  for (const p of PICTIONARY_PHRASES) {
    const n = p.w.trim().split(/\s+/).length;
    assert.ok(n >= 2 && n <= 4, p.w);
    assert.ok(!seen.has(p.w.toLowerCase()), p.w);
    seen.add(p.w.toLowerCase());
  }
  for (const t of PICTIONARY_THEMES) assert.ok(PICTIONARY_PHRASES.some((p) => p.t === t.id), t.id);
});

test('wordsIn filters by theme and level', () => {
  assert.equal(wordsIn(PICTIONARY_WORDS, 'all', 0).length, PICTIONARY_WORDS.length);
  for (const e of wordsIn(PICTIONARY_WORDS, 'animals', 2)) { assert.equal(e.t, 'animals'); assert.equal(e.d, 2); }
});

test('21 questions: 3 sets of ≥21 unique questions, secrets unique', () => {
  assert.equal(MAX_QUESTIONS, 21);
  assert.deepEqual(KNOW_SETS.map((s) => s.id), ['friends', 'couples', 'kids']);
  for (const s of KNOW_SETS) {
    const q = KNOW_QUESTIONS[s.id];
    assert.ok(q.length >= 21, s.id);
    assert.equal(new Set(q).size, q.length, s.id);
    for (const x of q) assert.ok(x.endsWith('?'), x);
  }
  assert.equal(new Set(GUESS_SECRETS.map((s) => s.w)).size, GUESS_SECRETS.length);
  assert.ok(GUESS_STARTERS.length >= 21);
});

console.log(`pictionary-regression: ${checks} checks passed`);
