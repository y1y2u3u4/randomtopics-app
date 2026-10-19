import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { load } from './lib/load-typescript.mjs';
const { US_STATES, ZIP_STATE_SUMMARY, ZIP_TOTAL, MAX_ZIPS, planStates, pickZips, sortZips, zipCsv, zipText } = load('src/lib/generators/zipCodes.ts');
const { createRng } = load('src/lib/randomGenerators.ts');
let checks = 0;
const test = (name, fn) => { fn(); checks++; console.log('PASS ' + name); };
const ZCTA = new Set(readFileSync('scripts/data/zcta-2023.txt', 'utf8').split('\n').filter(Boolean));
const shardPath = (st) => `public/data/zip/${st}.json`;
const shards = Object.fromEntries(US_STATES.map((s) => [s.code, JSON.parse(readFileSync(shardPath(s.code), 'utf8'))]));

test('51 shards, each ≤ 200KB, matching the summary', () => {
  assert.equal(US_STATES.length, 51);
  let total = 0;
  for (const { code } of US_STATES) {
    assert.ok(statSync(shardPath(code)).size <= 200 * 1024, `${code} shard too big`);
    const rows = shards[code];
    const z = ZIP_STATE_SUMMARY[code];
    assert.equal(rows.length, z.count, code);
    assert.equal(rows[0][0], z.first, code);
    assert.equal(rows[rows.length - 1][0], z.last, code);
    assert.ok(rows.some((r) => r[0] === z.sample && r[1] === z.city), `${code} sample`);
    total += rows.length;
  }
  assert.equal(total, ZIP_TOTAL);
});
test('Every ZIP is five digits, on the Census ZCTA list, with a city and no duplicates', () => {
  const seen = new Set();
  for (const rows of Object.values(shards)) {
    for (const [zip, city] of rows) {
      assert.match(zip, /^\d{5}$/);
      assert.ok(ZCTA.has(zip), `${zip} not a ZCTA`);
      assert.ok(city && !/undefined/.test(city), zip);
      assert.ok(!seen.has(zip), `dup ${zip}`);
      seen.add(zip);
    }
  }
});
test('Known ZIPs sit in the right state', () => {
  const where = (zip) => Object.entries(shards).find(([, rows]) => rows.some((r) => r[0] === zip))?.[0];
  assert.equal(where('10001'), 'NY'); assert.equal(where('90001'), 'CA'); assert.equal(where('60601'), 'IL');
  assert.equal(where('02108'), 'MA'); assert.equal(where('20001'), 'DC'); assert.equal(where('99501'), 'AK');
});
test('planStates sums to the requested count and honours the state filter', () => {
  for (const n of [1, 5, 10, 25, 50, 500]) {
    const plan = planStates([], n, createRng(n));
    assert.equal(Object.values(plan).reduce((a, b) => a + b, 0), Math.min(n, MAX_ZIPS));
  }
  assert.deepEqual(Object.keys(planStates(['TX'], 50, createRng(1))), ['TX']);
  assert.deepEqual(planStates(['XX'], 10, createRng(1)), {});
});
test('pickZips: right state, no repeats, real ZIPs', () => {
  for (const st of ['DC', 'WY', 'CA']) {
    const out = pickZips(planStates([st], 50, createRng(3)), shards, createRng(4));
    assert.equal(out.length, Math.min(50, ZIP_STATE_SUMMARY[st].count));
    assert.ok(out.every((r) => r.state === st && ZCTA.has(r.zip)));
    assert.equal(new Set(out.map((r) => r.zip)).size, out.length);
  }
  const mix = pickZips(planStates([], 50, createRng(9)), shards, createRng(10));
  assert.equal(mix.length, 50);
  assert.ok(new Set(mix.map((r) => r.state)).size > 5, 'nationwide batch should span states');
  const sorted = sortZips(mix).map((r) => r.zip);
  assert.deepEqual(sorted, [...sorted].sort());
});
test('CSV and text output', () => {
  const out = pickZips(planStates(['MA'], 10, createRng(5)), shards, createRng(6));
  const csv = zipCsv(out).trimEnd().split('\n');
  assert.equal(csv[0], 'zip,city,state,state_name,county');
  assert.equal(csv.length, 11);
  assert.ok(csv.slice(1).every((l) => /^0\d{4},/.test(l)), 'MA ZIPs keep the leading 0');
  assert.match(zipCsv([{ zip: '12345', city: 'A, "B"', state: 'NY', stateName: 'New York', county: '' }]), /"A, ""B"""/);
  assert.equal(zipText(out, false).split('\n').length, 10);
  assert.match(zipText(out, true).split('\n')[0], /^\d{5} — .+, MA$/);
});
console.log(`zip-code regression: ${checks} checks passed`);
