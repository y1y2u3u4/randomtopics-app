import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';
const { parseIso, isWeekend, weekday, formatDay, countEligible, pickDates, datesCsv, MAX_DATES } = load('src/lib/generators/randomDates.ts');
const { createRng } = load('src/lib/randomGenerators.ts');
let checks = 0;
const test = (name, fn) => { fn(); checks++; console.log('PASS ' + name); };
const d = (s) => parseIso(s);

test('parseIso accepts real dates and rejects invalid ones', () => {
  assert.equal(formatDay(d('2026-10-19'), 'iso'), '2026-10-19');
  assert.equal(weekday(d('2026-10-19')), 'Monday');
  assert.notEqual(d('2024-02-29'), null);
  for (const bad of ['2026-02-29', '2026-13-01', '2026-00-10', '2026-04-31', '19/10/2026', '', 'abc']) assert.equal(parseIso(bad), null, bad);
});

test('formats: ISO, US, EU, long', () => {
  const x = d('2026-03-07');
  assert.equal(formatDay(x, 'iso'), '2026-03-07');
  assert.equal(formatDay(x, 'us'), '03/07/2026');
  assert.equal(formatDay(x, 'eu'), '07/03/2026');
  assert.equal(formatDay(x, 'long'), 'Saturday, March 7, 2026');
});

test('countEligible matches brute force, both ends inclusive', () => {
  const base = d('2026-01-01');
  for (let s = 0; s < 14; s++) for (let len = 0; len < 40; len++) {
    const a = base + s, b = a + len;
    let all = 0, wk = 0;
    for (let x = a; x <= b; x++) { all++; if (!isWeekend(x)) wk++; }
    assert.equal(countEligible(a, b, false), all);
    assert.equal(countEligible(a, b, true), wk);
  }
  assert.equal(countEligible(d('2026-01-01'), d('2026-12-31'), false), 365);
  assert.equal(countEligible(d('2024-01-01'), d('2024-12-31'), false), 366);
  assert.equal(countEligible(d('2026-10-24'), d('2026-10-25'), true), 0);
  assert.equal(countEligible(d('2026-10-20'), d('2026-10-19'), false), 0);
});

test('single-day range always returns that day', () => {
  const x = d('2026-01-01');
  assert.deepEqual(pickDates(x, x, 5, {}, createRng(1)), [x]);
});

test('unique full draw covers every eligible day exactly once (boundaries hit)', () => {
  const a = d('2026-10-01'), b = d('2026-10-31');
  for (const ex of [false, true]) {
    const n = countEligible(a, b, ex);
    const out = pickDates(a, b, 100, { excludeWeekends: ex, unique: true, sort: true }, createRng(7));
    assert.equal(out.length, n);
    assert.equal(new Set(out).size, n);
    const expected = [];
    for (let x = a; x <= b; x++) if (!ex || !isWeekend(x)) expected.push(x);
    assert.deepEqual(out, expected);
  }
});

test('exclude weekends never returns Saturday or Sunday; all in range', () => {
  const a = d('2025-12-27'), b = d('2027-01-03');
  for (let seed = 1; seed <= 30; seed++) {
    for (const x of pickDates(a, b, 100, { excludeWeekends: true, unique: false }, createRng(seed))) {
      assert.ok(!isWeekend(x));
      assert.ok(x >= a && x <= b);
    }
  }
});

test('ends of range are reachable and roughly uniform', () => {
  const a = d('2026-10-19'), b = d('2026-10-23');
  const hits = new Map();
  const rng = createRng(42);
  for (let i = 0; i < 50; i++) for (const x of pickDates(a, b, 100, { unique: false }, rng)) hits.set(x, (hits.get(x) || 0) + 1);
  assert.equal(hits.size, 5);
  for (const c of hits.values()) assert.ok(c > 800 && c < 1200, String(c));
});

test('count capped at MAX_DATES, sorted output, CSV shape', () => {
  const a = d('2000-01-01'), b = d('2030-12-31');
  const out = pickDates(a, b, 500, { sort: true }, createRng(3));
  assert.equal(out.length, MAX_DATES);
  for (let i = 1; i < out.length; i++) assert.ok(out[i - 1] <= out[i]);
  const csv = datesCsv([d('2026-10-19')]).split('\n');
  assert.equal(csv[0], 'iso,us,eu,weekday');
  assert.equal(csv[1], '2026-10-19,10/19/2026,19/10/2026,Monday');
});

console.log(`random-dates-regression: ${checks} checks passed`);
