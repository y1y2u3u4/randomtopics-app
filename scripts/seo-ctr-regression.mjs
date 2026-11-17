import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const read = (path) => readFileSync(path, 'utf8');
const slugs = ['random-animal-generator', 'japanese-name-generator', 'last-name-generator', 'random-name-generator', 'random-letter-generator', 'wingding-translator'];
const entries = slugs.map((slug) => {
  const source = read(`src/app/${slug}/page.tsx`);
  const value = (name) => {
    const match = source.match(new RegExp(`const ${name} =\\s*([\\x22\\x60].*?[\\x22\\x60]);`, 's'));
    assert.ok(match, `${slug}: missing ${name}`);
    return runInNewContext(match[1]);
  };
  assert.match(source, /title: \{ absolute: TITLE \}/);
  assert.match(source, /description: DESCRIPTION/);
  assert.match(source, /intro=/);
  return { path: `/${slug}`, title: value('TITLE'), description: value('DESCRIPTION') };
});
const spanish = read('src/data/seoContent.es.part1.ts').split('slug: "conversation-starters-for-couples"')[1].split('sections:')[0];
entries.push({ path: '/es/topics/conversation-starters-for-couples', title: spanish.match(/metaTitle: "([^"]+)"/)[1], description: spanish.match(/metaDescription:\s*"([^"]+)"/)[1] });
const qotd = read('src/app/question-of-the-day/page.tsx');
const titleTemplate = qotd.match(/title: \{ absolute: `([^`]+)`/)[1];
const description = qotd.match(/description: `([^`]+)`/)[1];
assert.match(qotd, /month: "short"/);
assert.match(qotd, /timeZone: "UTC"/);
assert.match(qotd, /revalidate = 3600/);
for (let year = 2024; year <= 2032; year++) {
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 31; day++) {
      const date = new Date(Date.UTC(year, month, day));
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
      assert.ok(titleTemplate.replace('${day}', label).length <= 60, label);
    }
  }
}
entries.push({ path: '/question-of-the-day', title: titleTemplate.replace('${day}', 'Nov 17, 2026'), description });
const archive = read('src/app/question-of-the-day/archive/page.tsx');
entries.push({ path: '/question-of-the-day/archive', title: archive.match(/absolute: "([^"]+)"/)[1], description: archive.match(/description: "([^"]+)"/)[1] });
assert.match(qotd, /href="\/question-of-the-day\/archive"/);
assert.match(read('src/app/sitemap.ts'), /path: "\/question-of-the-day\/archive"/);
assert.match(archive, /length: 30/);
assert.match(archive, /qotdIndexForDate\(calendarDate\)/);
assert.match(archive, /href="\/question-of-the-day"/);
function validate(entries) {
const titles = new Set();
for (const entry of entries) {
  assert.ok(entry.title.length > 0 && entry.title.length <= 60, `${entry.path}: title ${entry.title.length}`);
  assert.ok(entry.description.length > 0 && entry.description.length <= 155, `${entry.path}: description ${entry.description.length}`);
  assert.ok(!titles.has(entry.title.toLowerCase()), `duplicate title: ${entry.title}`);
  titles.add(entry.title.toLowerCase());

}
}
validate(entries);
assert.throws(() => validate([{ title: 'x'.repeat(61), description: 'ok' }]));
assert.throws(() => validate([{ title: 'ok', description: 'x'.repeat(156) }]));
assert.throws(() => validate([{ title: 'Same', description: 'ok' }, { title: 'same', description: 'ok' }]));
for (const entry of entries) console.log(`PASS ${entry.path}: title=${entry.title.length}/60 description=${entry.description.length}/155`);
console.log('PASS negative fixtures: long title, long description, duplicate title rejected');
console.log('PASS 9 scoped pages: unique titles; QOTD date lengths 2024–2032; archive links and sitemap');
