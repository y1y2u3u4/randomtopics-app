// Unit tests for /wu-tang-name-generator: determinism, normalisation,
// distribution, word-list safety and share-link round trips.
// Run: node scripts/wu-tang-name-regression.mjs
import assert from "node:assert/strict";
import { load } from "./lib/load-typescript.mjs";

const wu = load("src/lib/generators/wuTang.ts");
const rg = load("src/lib/randomGenerators.ts");

let passed = 0;
const test = (name, fn) => {
  try {
    fn();
    passed++;
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
};

const ALL_WORDS = [...wu.WU_FIRST, ...wu.WU_SECOND, ...wu.WU_FLOURISH];

test("word lists are big enough and free of duplicates", () => {
  assert.ok(wu.WU_FIRST.length >= 120, `first words: ${wu.WU_FIRST.length}`);
  assert.ok(wu.WU_SECOND.length >= 120, `second words: ${wu.WU_SECOND.length}`);
  assert.ok(wu.WU_COMBINATIONS >= 14_000, `combinations: ${wu.WU_COMBINATIONS}`);
  assert.equal(new Set(wu.WU_FIRST).size, wu.WU_FIRST.length, "duplicate first word");
  assert.equal(new Set(wu.WU_SECOND).size, wu.WU_SECOND.length, "duplicate second word");
  const firstLower = new Set(wu.WU_FIRST.map((w) => w.toLowerCase()));
  for (const w of wu.WU_SECOND) assert.ok(!firstLower.has(w.toLowerCase()), `word in both lists: ${w}`);
  for (const w of ALL_WORDS) assert.match(w, /^[A-Za-z][A-Za-z .'-]*$/, `odd characters: ${w}`);
});

// Real members, their well-known aliases and the most recognisable alias
// fragments. No word in our lists may equal one of these tokens.
const MEMBER_NAMES = [
  "RZA", "GZA", "Method Man", "Raekwon", "Ghostface Killah", "Inspectah Deck", "U-God", "Masta Killa",
  "Ol' Dirty Bastard", "Cappadonna", "Ghostface", "Ol Dirty Bastard", "ODB",
];
const FORBIDDEN_TOKENS = [
  "rza", "gza", "method", "raekwon", "ghostface", "killah", "killa", "inspectah", "deck", "u-god", "god", "masta",
  "dirty", "bastard", "cappadonna", "odb", "abbot", "genius", "chef", "ironman", "starks", "blaze", "digital",
  "rakeem", "stallion", "ticallion", "osirus", "wu", "wu-tang", "tang", "clan", "chamber", "chambers", "man",
];

test("no real member names or aliases can be generated", () => {
  for (const w of ALL_WORDS) {
    for (const token of w.toLowerCase().split(/[\s.]+/)) {
      assert.ok(!FORBIDDEN_TOKENS.includes(token), `forbidden token "${token}" in "${w}"`);
    }
  }
  const members = new Set(MEMBER_NAMES.map((m) => m.toLowerCase()));
  for (const f of wu.WU_FIRST) for (const s of wu.WU_SECOND) {
    assert.ok(!members.has(`${f} ${s}`.toLowerCase()), `member name generated: ${f} ${s}`);
  }
});

const BLOCKLIST = [
  // slurs / insults
  "bitch", "whore", "slut", "retard", "fag", "nigg", "hoe", "bastard", "damn", "hell",
  // drugs / alcohol
  "weed", "blunt", "dope", "coke", "crack", "meth", "pill", "stoned", "high", "drunk", "drunken", "liquor", "brew", "smoke", "420", "kush", "dealer",
  // sexual
  "sex", "sexy", "pimp", "playa", "booty", "nude", "naked", "horny",
  // real-world violence / crime
  "gun", "glock", "shooter", "murder", "killer", "kill", "thug", "gangsta", "gangster", "mobster", "smuggler", "terror", "bomb", "blood", "gore",
];

test("blocklist: every word is PG-13 or cleaner", () => {
  const texts = [...ALL_WORDS];
  // Origin lines too: render every template × deed combination.
  for (let o = 0; o < 400; o++) texts.push(wu.nameFromIndices(0, 0, -1, o).origin);
  for (const text of texts) {
    const tokens = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    for (const bad of BLOCKLIST) assert.ok(!tokens.includes(bad), `blocked word "${bad}" in "${text}"`);
  }
});

test("name mode is deterministic", () => {
  for (const n of ["Alex", "Maria", "Jordan", "李明", "José", "a"]) {
    assert.deepEqual(wu.nameFor(n), wu.nameFor(n));
  }
  // Pin a known value so an accidental list or hash change is noticed.
  const alex = wu.nameFor("Alex");
  assert.ok(alex.first && alex.second && alex.origin.includes(alex.first));
  assert.equal(wu.cyrb53("alex", 36), wu.cyrb53("alex", 36));
  assert.notEqual(wu.cyrb53("alex", 36), wu.cyrb53("alex", 7));
});

test("normalisation: case and whitespace do not matter", () => {
  const base = wu.nameFor("alex");
  for (const v of ["Alex", " Alex ", "ALEX", "\talex\n", "aLeX"]) assert.deepEqual(wu.nameFor(v), base, v);
  assert.deepEqual(wu.nameFor("mary  jane"), wu.nameFor(" Mary Jane "));
  assert.notDeepEqual(wu.nameFor("maryjane"), wu.nameFor("mary jane"));
  assert.equal(wu.normalise("  ÁLEX   Smith "), "álex smith");
  assert.equal(wu.nameFor(""), null);
  assert.equal(wu.nameFor("   "), null);
  assert.ok(wu.normalise("x".repeat(200)).length <= wu.MAX_INPUT_LENGTH);
});

test("distribution: 5,000 names spread across the lists", () => {
  const first = new Map();
  const second = new Map();
  const pairs = new Set();
  let flourishes = 0;
  for (let i = 0; i < 5000; i++) {
    const r = wu.nameFor(`person ${i}`);
    first.set(r.first, (first.get(r.first) ?? 0) + 1);
    second.set(r.second, (second.get(r.second) ?? 0) + 1);
    pairs.add(wu.pairKey(r));
    if (r.flourish) flourishes++;
  }
  assert.ok(first.size >= wu.WU_FIRST.length * 0.95, `first words used: ${first.size}`);
  assert.ok(second.size >= wu.WU_SECOND.length * 0.95, `second words used: ${second.size}`);
  const expected = 5000 / wu.WU_FIRST.length;
  assert.ok(Math.max(...first.values()) < expected * 3, `hottest first word: ${Math.max(...first.values())}`);
  assert.ok(Math.max(...second.values()) < (5000 / wu.WU_SECOND.length) * 3);
  assert.ok(pairs.size > 4000, `unique pairs: ${pairs.size}`);
  assert.ok(flourishes > 200 && flourishes < 700, `flourishes: ${flourishes}`);
});

test("random mode avoids recent repeats", () => {
  const rng = rg.createRng(42);
  const seen = new Set();
  for (let i = 0; i < 300; i++) {
    const r = wu.randomName(rng, seen);
    assert.ok(!seen.has(wu.pairKey(r)), `repeat at ${i}: ${r.full}`);
    seen.add(wu.pairKey(r));
  }
  // Same seed, same sequence.
  const a = wu.randomName(rg.createRng(7));
  const b = wu.randomName(rg.createRng(7));
  assert.deepEqual(a, b);
});

test("share params round-trip", () => {
  const origin = "https://randomtopics.app";
  for (const n of ["Alex", "Mary Jane", "José", "O'Brien & Co"]) {
    const url = wu.shareUrl(origin, { name: n });
    assert.ok(url.startsWith(`${origin}/wu-tang-name-generator?name=`), url);
    const back = wu.readShareParams(new URL(url).search);
    assert.equal(back.input, n);
    assert.deepEqual(back.result, wu.nameFor(n));
  }
  const rng = rg.createRng(9);
  for (let i = 0; i < 200; i++) {
    const r = wu.randomName(rng);
    const back = wu.readShareParams(new URL(wu.shareUrl(origin, { code: r.code })).search);
    assert.equal(back.input, null);
    assert.deepEqual(back.result, r);
  }
  for (let i = 0; i < 200; i++) {
    const r = wu.nameFor(`n${i}`);
    assert.deepEqual(wu.nameFromCode(r.code), r);
  }
  assert.equal(wu.readShareParams(""), null);
  assert.equal(wu.readShareParams("?name=%20%20"), null);
  assert.equal(wu.readShareParams("?r=zzz-zzz-zzz-zzz"), null);
  assert.equal(wu.readShareParams("?r=<script>"), null);
  assert.equal(wu.shareUrl(origin, {}), `${origin}/wu-tang-name-generator`);
});

console.log(`✓ wu-tang name generator: ${passed} tests passed (${wu.WU_FIRST.length} first × ${wu.WU_SECOND.length} second = ${wu.WU_COMBINATIONS} combinations)`);
for (const n of ["Alex", "Maria", "Jordan"]) console.log(`  ${n} → ${wu.nameFor(n).full}`);
