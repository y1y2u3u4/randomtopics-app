// Daily ritual: answer choices line up with the question bank, and the vote
// API only accepts today's real question (any category) within a day of UTC.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import * as questions from '../src/data/questionOfTheDay.ts';
import * as answers from '../src/data/qotdAnswers.ts';

const code = ts.transpileModule(readFileSync(new URL('../src/lib/qotd/vote.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const mod = { exports: {} };
new Function('require', 'module', 'exports', code)((id) => ({ '@/data/questionOfTheDay': questions, '@/data/qotdAnswers': answers })[id], mod, mod.exports);
const vote = mod.exports;

assert.equal(answers.QOTD_ANSWERS.length, questions.QOTD_QUESTIONS.length, 'one answer row per question');
for (const [i, row] of answers.QOTD_ANSWERS.entries()) {
  assert.equal(row.length, 4, `row ${i} has four choices`);
  assert.equal(new Set(row).size, 4, `row ${i} choices are distinct`);
  for (const choice of row) assert.ok(choice.length > 0 && choice.length <= 40, `row ${i} choice fits the card: ${choice}`);
}
assert.deepEqual(answers.qotdChoices(23), ['Winter', 'Summer', 'Spring', 'Autumn', 'Something else']);
assert.deepEqual(answers.qotdChoices(999), []);

const now = new Date(Date.UTC(2026, 9, 17, 12));
const day = '2026-10-17', date = new Date(2026, 9, 17);
const today = questions.qotdIndexForDate(date);
assert.deepEqual(vote.validQotdVote(day, today, 2, now), { day, question: today, choice: 2 });
for (const { id } of questions.QOTD_CATEGORIES) {
  const q = questions.qotdIndexForCategory(date, id);
  assert.ok(vote.validQotdVote(day, q, 0, now), `category ${id} question is votable`);
}
const notToday = questions.QOTD_QUESTIONS.findIndex((_, i) => ![ 'all', ...questions.QOTD_CATEGORIES.map((c) => c.id)].some((c) => questions.qotdIndexForCategory(date, c) === i));
assert.equal(vote.validQotdVote(day, notToday, 0, now), null, 'a question that is not today is rejected');
assert.equal(vote.validQotdVote(day, today, 5, now), null, 'choice out of range');
assert.equal(vote.validQotdVote(day, today, -1, now), null);
assert.equal(vote.validQotdVote(day, 1.5, 0, now), null);
assert.equal(vote.validQotdVote('2026-10-15', questions.qotdIndexForDate(new Date(2026, 9, 15)), 0, now), null, 'two days old is rejected');
assert.ok(vote.validQotdVote('2026-10-18', questions.qotdIndexForDate(new Date(2026, 9, 18)), 0, now), 'tomorrow is fine (UTC+14)');
assert.equal(vote.validQotdVote('2026-02-30', 0, 0, now), null, 'impossible date');
assert.equal(vote.validQotdVote('17/10/2026', today, 0, now), null);
assert.equal(vote.localDayKey(new Date(2026, 0, 5)), '2026-01-05');
assert.equal(vote.previousDayKey('2026-03-01'), '2026-02-28');
assert.equal(vote.previousDayKey('2026-01-01'), '2025-12-31');
assert.deepEqual(vote.qotdTally([{ choice: 1, votes: '7' }, { choice: 4, votes: 2 }, { choice: 9, votes: 3 }]), [0, 7, 0, 0, 2]);
assert.deepEqual(vote.qotdTally(null), [0, 0, 0, 0, 0]);
console.log('PASS qotd ritual: 120 answer rows, vote validation (today per category, ±1 day, ranges), day keys, tally.');
