// 2026-11-16 SEO×GEO: the six "popular generators" must keep their
// answer-first block (direct answer + free rule + cross-links) and the
// homepage entry. Removing any of these silently drops the internal links
// and the server-rendered answer that Google and ChatGPT quote.
import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const data = read("src/data/popularGenerators.ts");
const hrefs = [...data.matchAll(/href: "([^"]+)"/g)].map((m) => m[1]);
assert.equal(hrefs.length, 6, "POPULAR_GENERATORS should list 6 pages");
assert.match(data, /export const FREE_RULE = "Free and unlimited/, "shared free-rule sentence missing");

for (const href of hrefs) {
  const file = `src/app${href}/page.tsx`;
  assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), `${file} missing`);
  const src = read(file);
  assert.match(src, /import AnswerFirst from "@\/components\/AnswerFirst"/, `${href}: AnswerFirst not imported`);
  assert.ok(src.includes("<AnswerFirst"), `${href}: AnswerFirst not rendered`);
  assert.ok(src.includes(`path={PATH}`) || src.includes(`path="${href}"`), `${href}: AnswerFirst path must be the page's own path`);
  assert.match(src, /question="[^"]{10,}"/, `${href}: answer block needs a question heading`);
}

const answer = read("src/components/AnswerFirst.tsx");
assert.match(answer, /POPULAR_GENERATORS\.filter\(\(g\) => g\.href !== path\)/, "AnswerFirst must link the other popular generators");
assert.match(answer, /FREE_RULE/, "AnswerFirst must show the free rule");
assert.match(answer, /<Link prefetch=\{false\}/, "AnswerFirst links must not prefetch");

const home = read("src/app/page.tsx");
assert.match(home, /POPULAR_GENERATORS\.map/, "homepage must render the popular generators entry");

console.log(`popular generators ok: ${hrefs.length} pages wired, homepage entry present`);
