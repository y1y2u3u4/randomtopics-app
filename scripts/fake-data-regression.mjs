import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';
const { NATIONALITIES, fakeProfiles } = load('src/lib/generators/fakeNames.ts');
const { fakeAddress, fakeDetails, withExtras, recordsCsv, starSign, generation, profileCountry } = load('src/lib/generators/fakeAddresses.ts');
const { createRng } = load('src/lib/randomGenerators.ts');
let checks = 0;
const test = (name, fn) => { fn(); checks++; console.log('PASS ' + name); };
const day = new Date(Date.UTC(2026, 9, 19));
const POST = {
  us: /^\d{5}$/, uk: /^[A-Z]{1,2}\d{1,2} \d[ABDEFGHJLNPQRSTUWXYZ]{2}$/, ie: /^[A-Z]\d{2} [A-Z0-9]{4}$/, ca: /^[ABCEGHJKLMNPRSTVXY]\d[A-Z] \d[A-Z]\d$/,
  au: /^\d{4}$/, mx: /^\d{5}$/, es: /^\d{5}$/, br: /^\d{5}-\d{3}$/, fr: /^\d{5}$/, de: /^\d{5}$/, it: /^\d{5}$/, nl: /^\d{4} [A-Z]{2}$/,
  pl: /^\d{2}-\d{3}$/, ru: /^\d{6}$/, gr: /^\d{3} \d{2}$/, il: /^\d{7}$/, in: /^\d{6}$/, cn: /^\d{6}$/, jp: /^\d{3}-\d{4}$/, kr: /^\d{5}$/, vn: /^\d{6}$/, ph: /^\d{4}$/,
};
test('Every country yields a well-formed address in the profile city', () => {
  for (const nat of NATIONALITIES) {
    const rows = fakeProfiles({ nationality: [nat.id], gender: 'any', age: 'any' }, 60, 7, day);
    for (const p of rows) {
      assert.equal(profileCountry(p), nat.id);
      const a = fakeAddress(p, createRng(p.birthday.length + p.name.length));
      assert.ok(a.street && a.city && a.lines.length >= 2, `${nat.id} ${JSON.stringify(a)}`);
      assert.ok(p.city.startsWith(a.city), `${p.city} vs ${a.city}`);
      if (POST[nat.id]) assert.match(a.postcode, POST[nat.id], `${nat.id} ${a.city} ${a.postcode}`);
      assert.ok(!a.lines.some((l) => /undefined|NaN/.test(l)), a.lines.join(' | '));
    }
  }
});
test('City-specific postcode prefixes', () => {
  const pc = (id, city) => {
    const p = fakeProfiles({ nationality: [id], gender: 'any', age: 'any' }, 80, 3, day).find((r) => r.city.startsWith(city));
    return fakeAddress(p, createRng(1)).postcode;
  };
  assert.match(pc('us', 'Chicago'), /^606/); assert.match(pc('fr', 'Paris'), /^750[0-2]\d$/); assert.match(pc('es', 'Madrid'), /^28/);
  assert.match(pc('uk', 'Manchester'), /^M\d/); assert.match(pc('ca', 'Toronto'), /^M/); assert.match(pc('au', 'Melbourne'), /^3/);
});
test('Extras never reshuffle names and are stable per profile', () => {
  const rows = fakeProfiles({ nationality: [], gender: 'any', age: 'any' }, 25, 99, day);
  const a = withExtras(rows, 99, { address: true, details: true });
  const b = withExtras(rows, 99, { address: true, details: false });
  assert.deepEqual(a.map((r) => r.profile.name), rows.map((r) => r.name));
  assert.deepEqual(a.map((r) => r.address), b.map((r) => r.address));
  const csv = recordsCsv(a, true).trim().split('\n');
  assert.equal(csv.length, 26);
  assert.ok(csv[0].includes('postcode') && csv[0].includes('star_sign'));
});
test('Details agree with the birthday and stay plausible', () => {
  assert.equal(starSign('1990-03-21'), 'Aries'); assert.equal(starSign('1990-03-20'), 'Pisces');
  assert.equal(starSign('1990-12-25'), 'Capricorn'); assert.equal(starSign('1990-01-19'), 'Capricorn'); assert.equal(starSign('1990-01-20'), 'Aquarius');
  assert.equal(generation('1997-01-01'), 'Gen Z'); assert.equal(generation('1980-12-31'), 'Gen X');
  for (const p of fakeProfiles({ nationality: [], gender: 'any', age: 'any' }, 100, 5, day)) {
    const d = fakeDetails(p, createRng(p.name.length));
    assert.equal(d.starSign, starSign(p.birthday));
    assert.ok(d.heightCm > 135 && d.heightCm < 205 && d.weightKg > 35 && d.weightKg < 130, JSON.stringify(d));
    assert.ok(/^[A-Z]/.test(d.hobby) && /^[A-Z]/.test(d.personality));
  }
});
console.log(`${checks} fake data checks passed`);
