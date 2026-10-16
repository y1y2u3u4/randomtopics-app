// Builds src/data/adPublicPaths.json: every public content page in the sitemap
// that may load Google Auto ads, minus the pages that must stay ad-free.
// Run: node scripts/ad-public-paths.mjs --write   (regenerate after adding pages)
//      node scripts/ad-public-paths.mjs           (check only; part of ads:test)
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "src/data/adPublicPaths.json");

// Matched against the path with any /es prefix removed. Keep this list short
// and explicit; a page not in the sitemap never gets ads (fail closed).
export const AD_FREE = [
  // Paid practice, accounts and checkout.
  /^\/speech(\/|$)/, /^\/account(\/|$)/, /^\/saved-topics(\/|$)/,
  // Children and classrooms: no ads on child-directed pages.
  /(^|\/|-)kids(\/|-|$)/, /students?(\/|$)/, /middle-school/, /presentation-ideas-for-school/,
  /^\/morning-meeting-questions$/, /^\/riddles-for-kids$/, /^\/classroom/, /^\/random-group-generator$/,
  // Legal, about and internal pages.
  /^\/(privacy|terms|contact|about|press|stats|how-we-curate)$/,
  // Insult humour: kept off to stay clear of ad content policy.
  /^\/yo-mama-randomizer$/,
];
const COLLEGE = /college-students/;

export function adFree(path) {
  const base = path.replace(/^\/es(?=\/|$)/, "") || "/";
  if (COLLEGE.test(base)) return AD_FREE.slice(0, 3).some((r) => r.test(base));
  return AD_FREE.some((r) => r.test(base));
}

const sitemap = load("src/app/sitemap.ts").default();
const paths = [...new Set(sitemap.map((e) => new URL(e.url).pathname.replace(/\/$/, "") || "/"))].sort();
const allowed = paths.filter((p) => !adFree(p));
const json = JSON.stringify(allowed, null, 1) + "\n";

if (process.argv.includes("--write")) {
  writeFileSync(out, json);
  console.log(`ad public paths: wrote ${allowed.length} of ${paths.length} sitemap paths`);
} else {
  assert.equal(readFileSync(out, "utf8"), json, "src/data/adPublicPaths.json is stale: run node scripts/ad-public-paths.mjs --write");
  for (const p of ["/speech", "/es/speech/politics", "/this-or-that/kids", "/es/would-you-rather/kids", "/riddles-for-kids", "/morning-meeting-questions",
    "/classroom-timer", "/classroom-packs", "/random-group-generator", "/question-of-the-day-for-students", "/topics/get-to-know-you-questions-for-students",
    "/topics/writing-prompts-for-kids", "/debate/middle-school", "/es/debate/students", "/privacy", "/es/terms", "/yo-mama-randomizer"]) {
    assert.ok(adFree(p) && !allowed.includes(p), `ad-free: ${p}`);
  }
  for (const p of ["/", "/es", "/random-food-generator", "/my-9-albums", "/charades", "/would-you-rather", "/topics/speech-topics-for-college-students",
    "/debate/high-school", "/categories/philosophy", "/es/most-likely-to", "/trivia-questions"]) {
    assert.ok(allowed.includes(p), `ads allowed: ${p}`);
  }
  console.log(`PASS: ad public paths in sync (${allowed.length} of ${paths.length} sitemap paths allowed)`);
}
