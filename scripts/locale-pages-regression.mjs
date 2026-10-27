// Regression for the data-driven pt/fr/tr batch-1 pages (2026-10-28):
// content shape, hreflang both ways, internal links resolve to real pages.
// Run: node scripts/locale-pages-regression.mjs
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
const cfg = load("src/i18n/config.ts");
const sets = {
  pt: { pages: load("src/data/localePages/pt.batch1.ts").PT_BATCH1, map: cfg.PORTUGUESE_ALTERNATES },
  fr: { pages: load("src/data/localePages/fr.batch1.ts").FR_BATCH1, map: cfg.FRENCH_ALTERNATES },
  tr: { pages: load("src/data/localePages/tr.batch1.ts").TR_BATCH1, map: cfg.TURKISH_ALTERNATES },
};
const MODES = new Set(["card", "wheel", "timer", undefined]);
const expected = Number(process.env.BATCH1_EXPECTED ?? 15);
// While writing: LOCALES=pt ALLOW_PARTIAL=1 node scripts/locale-pages-regression.mjs
const only = process.env.LOCALES?.split(",");
const partial = Boolean(process.env.ALLOW_PARTIAL);
let checked = 0;

for (const [loc, { pages, map }] of Object.entries(sets)) {
  if (only && !only.includes(loc)) continue;
  if (!partial) assert.equal(pages.length, expected, `${loc}: expected ${expected} batch-1 pages, got ${pages.length}`);
  const paths = new Set();
  for (const p of pages) {
    const id = `${loc} ${p.path}`;
    assert.match(p.path, new RegExp(`^/${loc}/[a-z0-9]+(-[a-z0-9]+)*$`), `${id}: slug must be lowercase ASCII`);
    assert.ok(!paths.has(p.path), `${id}: duplicate path`);
    paths.add(p.path);
    assert.equal(map[p.enPath], p.path, `${id}: config alternate map must map ${p.enPath} -> ${p.path}`);
    assert.ok(MODES.has(p.mode), `${id}: bad mode`);
    const total = p.groups.reduce((n, g) => n + g.topics.length, 0);
    const fill = (t) => t.replaceAll("{n}", String(total));
    const title = fill(p.metaTitle), desc = fill(p.description), lead = fill(p.lead);
    assert.ok(title.length >= 25 && title.length <= 75, `${id}: metaTitle length ${title.length}: ${title}`);
    assert.ok(desc.length >= 120 && desc.length <= 175, `${id}: description length ${desc.length}`);
    assert.ok(lead.length >= 90, `${id}: lead too short`);
    assert.ok(p.title.length >= 4 && p.title.length <= 70, `${id}: H1 length`);
    for (const t of [title, desc, lead, p.title, p.buttonLabel]) assert.ok(!/[{}]/.test(t), `${id}: stray brace in "${t}"`);
    assert.ok(total >= 40, `${id}: only ${total} items`);
    assert.ok(p.groups.length >= 3 && p.groups.length <= 8, `${id}: groups ${p.groups.length}`);
    const ids = new Set();
    const items = new Set();
    for (const g of p.groups) {
      assert.ok(g.id && g.label && !ids.has(g.id), `${id}: group id/label`);
      ids.add(g.id);
      assert.ok(g.topics.length >= 6, `${id}: group ${g.id} has ${g.topics.length} items`);
      for (const t of g.topics) {
        assert.ok(typeof t === "string" && t.trim().length >= 3 && t === t.trim(), `${id}: bad item "${t}"`);
        assert.ok(!items.has(t), `${id}: duplicate item "${t}"`);
        items.add(t);
      }
    }
    assert.ok(p.howTo.length >= 3 && p.howTo.length <= 6, `${id}: howTo`);
    assert.ok(p.faq.length >= 4 && p.faq.length <= 8, `${id}: faq count ${p.faq.length}`);
    for (const f of p.faq) assert.ok(f.question.endsWith("?") && f.answer.length >= 60, `${id}: faq "${f.question}"`);
    assert.ok(p.sibling.label && p.sibling.detail && p.sibling.emoji, `${id}: sibling needs label, detail, emoji`);
    assert.ok(p.englishLabel, `${id}: englishLabel`);
    // hreflang both ways: the English page lists this URL, this page lists the English one.
    const langs = cfg.hreflangAlternates(p.enPath);
    assert.equal(langs[loc], `https://randomtopics.app${p.path}`, `${id}: hreflang`);
    assert.equal(langs.en, `https://randomtopics.app${p.enPath}`, `${id}: en hreflang`);
    checked++;
  }
  // Every alternate in the map resolves to a real page (static folder or batch-1 config).
  for (const [en, local] of Object.entries(map)) {
    const exists = existsSync(resolve(root, "src/app", ...local.split("/").filter(Boolean), "page.tsx")) || paths.has(local);
    if (!exists && partial && local.slice(1).split("/")[0] === loc) continue;
    assert.ok(exists, `${loc}: ${en} -> ${local} has no page`);
  }
  // Hand-written internal links (hub cards, try-next chips) must point at real pages.
  const linkFiles = { pt: ["src/data/ptPageCopy.ts"], fr: ["src/data/frPageCopy.ts"], tr: ["src/components/TurkishToolPage.tsx"] }[loc];
  linkFiles.push("src/lib/localePages.tsx");
  for (const f of linkFiles) {
    for (const m of readFileSync(resolve(root, f), "utf8").matchAll(new RegExp(`"(/${loc}(?:/[a-z0-9-]+)?)"`, "g"))) {
      const href = m[1];
      const ok = href === `/${loc}` || paths.has(href) || existsSync(resolve(root, "src/app", ...href.split("/").filter(Boolean), "page.tsx"));
      if (!ok && partial) continue;
      assert.ok(ok, `${f}: link ${href} has no page`);
    }
  }
}
console.log(`locale pages: ${checked} batch-1 pages OK (pt/fr/tr)`);
