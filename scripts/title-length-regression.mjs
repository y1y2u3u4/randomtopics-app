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
