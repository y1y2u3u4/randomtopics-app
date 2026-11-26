// Tests for /megacorp-name-generator and the "gimme a random object" phrasing on /random-object-generator.
// Run: node scripts/megacorp-regression.mjs (also part of generators:test)
import assert from "node:assert/strict";
import fs from "node:fs";
import { load } from "./lib/load-typescript.mjs";

const m = load("src/lib/generators/megacorpNames.ts");
const { CORP_ROOTS, CORP_GENRES, CORP_SECTORS, CORP_SLOGANS, megacorpGenerator: g, corpTicker } = m;
let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log(`PASS ${name}`); } catch (e) { console.error(`x ${name}`); throw e; } };

test("24 unique roots per genre, 6 slogans per sector, no franchise or real mega-corps", () => {
  assert.equal(new Set(CORP_ROOTS.map((r) => r.word)).size, CORP_ROOTS.length);
  for (const genre of CORP_GENRES) assert.equal(CORP_ROOTS.filter((r) => r.genre === genre.id).length, 24, genre.id);
  for (const s of CORP_SECTORS) assert.equal(new Set(CORP_SLOGANS[s.id]).size, 6, s.id);
  const banned = /arasaka|militech|weyland|yutani|tyrell|umbrella|cyberdyne|aperture|black mesa|abstergo|shinra|tessier|saeder|renraku|aztechnology|mitsuhama|omni consumer|kiroshi|krupp|nakatomi/i;
  for (const r of CORP_ROOTS) assert.ok(!banned.test(r.word), r.word);
});

test("every generated corp honors filters, has ticker + slogan, and its share key resolves to the same result", () => {
  for (const genre of [[], ...CORP_GENRES.map((x) => [x.id])]) {
    for (const sector of [[], ...CORP_SECTORS.map((x) => [x.id])]) {
      const filters = { genre, sector };
      for (let seed = 1; seed <= 4; seed++) {
        const { results } = g.generate(filters, 20, [], seed);
        assert.equal(results.length, 20);
        assert.equal(new Set(results.map((r) => r.title)).size, results.length, "no duplicate names in a batch");
        for (const r of results) {
          const [ticker, sectorShort, genreShort] = r.subtitle.split(" · ");
          assert.match(ticker, /^[A-Z]{2,4}$/, r.title);
          assert.equal(ticker, corpTicker(r.title));
          if (sector.length) assert.equal(sectorShort, CORP_SECTORS.find((s) => s.id === sector[0]).short);
          if (genre.length) assert.equal(genreShort, CORP_GENRES.find((x) => x.id === genre[0]).short);
          assert.match(r.detail, /^“.+”$/);
          assert.ok(!/undefined|NaN/.test(r.title + r.subtitle + r.detail), r.title);
          assert.deepEqual(g.resolve(r.key, filters), r, "shared link shows the same corp");
        }
      }
    }
  }
});

test("mergers always hyphenate two different surnames", () => {
  const { results } = g.generate({ genre: ["merger"] }, 24, [], 9);
  for (const r of results) {
    const [a, b] = r.title.split(" ")[0].split("-");
    assert.ok(a && b && a !== b, r.title);
  }
});

test("tampered share keys are rejected instead of rendering garbage", () => {
  const { results } = g.generate({}, 1, [], 3);
  const [base, extra] = results[0].key.split("|");
  const parts = extra.split("~");
  const bad = [
    `${base}|nope~${parts.slice(1).join("~")}`,
    `${base}|${parts[0]}~Bananas~${parts.slice(2).join("~")}`,
    `${base}|${[...parts.slice(0, 2), "9", ...parts.slice(3)].join("~")}`,
    `${base}|${[...parts.slice(0, 5), "99"].join("~")}`,
    `Nobody|${extra}`,
  ];
  for (const k of bad) assert.equal(g.resolve(k, {}), null, k);
  assert.equal(g.resolve("Ashcroft|finance~Capital~0~0~Ashcroft~0", {}), null, "merger with itself");
  assert.equal(g.resolve("Kessler|finance~Capital~0~0~Vance~0", {}), null, "partner only for mergers");
});

test("page is registered for crawl, ads, cross-links and llms.txt", () => {
  const path = "/megacorp-name-generator";
  assert.ok(fs.existsSync(`src/app${path}/page.tsx`));
  const page = fs.readFileSync(`src/app${path}/page.tsx`, "utf8");
  assert.match(page, /megacorp name gen/i, "FAQ/description use the searched phrasing");
  for (const f of ["src/app/sitemap.ts", "src/data/generators/registry.ts", "src/data/relatedTools.ts", "src/i18n/config.ts", "src/data/adPublicPaths.json", "public/llms.txt", "src/app/business-name-generator/page.tsx"]) {
    assert.ok(fs.readFileSync(f, "utf8").includes(path), `${f} links ${path}`);
  }
});

test("/random-object-generator carries 'gimme a random object' in title, H1 and FAQ", () => {
  const src = fs.readFileSync("src/components/RandomPickerPage.tsx", "utf8");
  const line = src.split("\n").find((l) => l.includes('slug:"random-object-generator"'));
  assert.match(line, /title:"Random Object Generator: Gimme a Random Object/);
  assert.match(line, /h1:"[^"]*Gimme a Random Object"/);
  assert.match(line, /\["Can you gimme a random object right now\?"/);
  assert.match(src, /"h1" in c \? c\.h1 : c\.name/);
});

console.log(`${passed} megacorp checks passed`);
