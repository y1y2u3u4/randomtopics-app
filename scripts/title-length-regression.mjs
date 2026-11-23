// onpage-audit 2026-11-19: /impromptu-speech-topics title was 81 chars (Google truncates ~60-70).
// It has ~300 clicks / 28d for "impromptu speech topics", so the main phrase must stay at the front.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const src = readFileSync('src/app/impromptu-speech-topics/page.tsx', 'utf8');
const title = src.match(/absolute: "([^"]+)"/)?.[1];
assert.ok(title, 'impromptu-speech-topics: missing absolute title');
assert.ok(title.length <= 70, `title ${title.length} chars: ${title}`);
assert.ok(title.startsWith('Impromptu Speech Topics'), 'main phrase must stay first');
console.log('title-length regression ok:', title.length, title);

// Article pages (/topics/[slug], /es/topics/[slug]) render seoTitle(metaTitle): brand dropped when > 70.
import { readdirSync } from 'node:fs';
const seo = readFileSync('src/lib/seoTitle.ts', 'utf8');
assert.match(seo, /TITLE_MAX = 70/);
for (const p of ['src/app/topics/[slug]/page.tsx', 'src/app/es/topics/[slug]/page.tsx']) {
  const s = readFileSync(p, 'utf8');
  assert.ok(s.includes('absolute: seoTitle(article.metaTitle)'), `${p}: must render seoTitle()`);
}
const render = (t) => (t.length <= 70 ? t : t.replace(/ \| RandomTopics$/, ''));
let n = 0;
for (const f of readdirSync('src/data').filter((f) => /^seoContent.*\.ts$/.test(f))) {
  for (const m of readFileSync(`src/data/${f}`, 'utf8').matchAll(/metaTitle:\s*"([^"]+)"/g)) {
    const t = render(m[1]);
    assert.ok(t.length <= 70, `${f}: ${t.length} chars: ${t}`);
    n++;
  }
}
assert.ok(n > 50, `only ${n} article titles found`);
console.log('article titles ok:', n);

// seo-audit 2026-11-23: three CTR titles had grown past 70 (yo-mama 73, charades 71, GD 73), and
// charades title/meta still said 528 words while the bank held 621. Counts must come from the data.
{
  const { load } = await import('./lib/load-typescript.mjs');
  const n = load('src/data/charades.ts').CHARADES_WORDS.length;
  const jokes = load('src/data/yoMama.ts').YO_MAMA_JOKES.length;
  const ch = readFileSync('src/app/charades/page.tsx', 'utf8');
  const meta = ch.slice(ch.indexOf('export const metadata'), ch.indexOf('keywords:', ch.indexOf('export const metadata')));
  assert.ok(!/\b\d{3}\b/.test(meta.replace(/\/\/.*$/gm, '')), 'charades title/description must use CHARADES_WORDS.length, not a hard-coded count');
  const chTitle = meta.match(/absolute: `([^`]+)`/)?.[1]?.replace('${CHARADES_WORDS.length}', String(n));
  assert.ok(chTitle && chTitle.length <= 65 && chTitle.startsWith('Charades Generator'), `charades title: ${chTitle}`);
  const ym = readFileSync('src/app/yo-mama-randomizer/page.tsx', 'utf8').match(/^const title = `([^`]+)`/m)?.[1]?.replace('${YO_MAMA_JOKES.length}', String(jokes));
  assert.ok(ym && ym.length <= 65 && ym.startsWith('Yo Mama Randomizer'), `yo-mama title: ${ym}`);
  const gd = readFileSync('src/app/group-discussion-topics/page.tsx', 'utf8').match(/absolute: "([^"]+)"/)?.[1];
  assert.ok(gd && gd.length <= 60 && gd.includes('Group Discussion Topics'), `GD title: ${gd}`);
  for (const f of ['src/app/page.tsx', 'src/data/relatedTools.ts', 'src/app/es/charades/page.tsx']) {
    assert.ok(!/\b528\b/.test(readFileSync(f, 'utf8')), `${f}: stale 528 charades count`);
  }
  console.log('generator titles ok:', chTitle.length, ym.length, gd.length);
}
