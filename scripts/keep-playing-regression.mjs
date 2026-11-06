// Keep-playing / list ads / daily-return logic (2026-11-06). No network.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from './lib/load-typescript.mjs';

const ads = load('src/lib/adsense.ts');
const streak = load('src/lib/qotd/streak.ts');
const place = load('src/lib/listAdPlacement.ts');
const next = load('src/data/nextList.ts');
const adPaths = JSON.parse(readFileSync('src/data/adPublicPaths.json', 'utf8'));
const src = (f) => readFileSync(f, 'utf8');
let checks = 0;
const check = (v, m) => { assert.ok(v, m); checks++; };

// 1. Mid-list ad slots only on allowed list pages.
for (const p of ads.ADSENSE_LIST_PATHS) check(ads.adListPageAllowed(p) && ads.adInlinePageAllowed(p), 'list path allowed ' + p);
for (const p of ['/topics/book-club-questions', '/es/topics/preguntas-para-conocerse']) {
  if (adPaths.includes(p)) check(ads.adListPageAllowed(p), 'topic list allowed ' + p);
}
for (const p of ['/speech', '/speech/practice', '/es/speech', '/speech/account', '/this-or-that/kids', '/topics/writing-prompts-for-kids',
  '/topics/get-to-know-you-questions-for-students', '/question-of-the-day-for-students', '/classroom-timer', '/yo-mama-randomizer',
  '/privacy', '/saved-topics', '/embed', '/topics', '/topics/a/b', '/charades']) {
  check(!ads.adListPageAllowed(p), 'no list ad on ' + p);
}
for (const p of adPaths.filter((x) => ads.adListPageAllowed(x))) check(ads.adPersonalizationAllowed(p), 'list ad never on child page ' + p);

// 2. The entitlement gate is still the one inside ArticleAdvertisement; PublicAdPlacement adds no second path.
const article = src('src/components/ArticleAdvertisement.tsx');
check(article.includes('observeSpeechAdEntitlement'), 'ArticleAdvertisement keeps the paid / ad-free gate');
const pub = src('src/components/PublicAdPlacement.tsx');
check(pub.includes('ArticleAdvertisement') && pub.includes('adInlinePageAllowed') && !pub.includes('adsbygoogle'), 'PublicAdPlacement only wraps ArticleAdvertisement');
check(/list/.test(article) && article.includes('rt-article-ad'), 'list placement uses the reserved-height box');
const css = src('src/app/globals.css');
check(/\.rt-article-ad\s*\{[^}]*\bheight:\s*\d+px/.test(css), 'ad box reserves height (no CLS)');
for (const f of ['src/app/speech', 'src/app/classroom-timer']) {
  let hit = false;
  try { hit = /placement="list"/.test(src(f + '/page.tsx')); } catch { /* page may not exist */ }
  check(!hit, 'no list placement in ' + f);
}

// 3. Placement rule: after the middle, >= 8 items, never after the last section.
check(place.listAdAfter([5, 5]) === -1, 'under 3 sections: none');
check(place.listAdAfter([2, 2, 2, 2]) === -1, 'short list: none');
check(place.listAdAfter([6, 6, 6, 6, 6, 6]) === 4 || place.listAdAfter([6, 6, 6, 6, 6, 6]) === 3, 'mid-list index');
for (const sizes of [[5, 5, 5, 5, 5], [10, 10, 10, 10], [1, 1, 1, 9, 9, 9], [3, 3, 3, 3, 3, 3, 3, 3]]) {
  const i = place.listAdAfter(sizes);
  check(i === -1 || (i >= Math.floor(sizes.length / 2) && i <= sizes.length - 2), 'ad never after last section ' + sizes);
}

// 4. Next list rings stay on public, reviewed pages and never leave the scene.
for (const p of ['/topics/truth-or-dare-questions', '/es/topics/preguntas-para-conocerse']) {
  const n = next.nextList(p);
  if (n) check(adPaths.includes(n.href) && n.href !== p, 'next list is a public other page ' + n.href);
}
for (const ring of next.LIST_RINGS) check(ring.length >= 3 && new Set(ring).size === ring.length, 'ring distinct');
check(next.nextList('/privacy') === null && next.nextList('/this-or-that/kids') === null, 'no next list on excluded pages');

// 5. Streak.
const S = streak;
let s = S.recordCheckIn(null, '2026-11-06');
check(s.count === 1 && s.last === '2026-11-06', 'first check-in = 1');
check(S.recordCheckIn(s, '2026-11-06').count === 1, 'same day twice counts once');
s = S.recordCheckIn(s, '2026-11-07');
check(s.count === 2 && s.best === 2, 'next day extends');
check(S.currentStreak(s, '2026-11-08').count === 2, 'still alive the day after');
check(S.currentStreak(s, '2026-11-09').count === 0, 'missed day shows 0');
s = S.recordCheckIn(s, '2026-11-12');
check(s.count === 1 && s.best === 2, 'gap restarts, best kept');
check(S.currentStreak(undefined, '2026-11-06').count === 0 && S.currentStreak({ last: 5 }, '2026-11-06').count === 0, 'corrupt storage is empty');
check(S.recordCheckIn(S.EMPTY_STREAK, '2026-12-31').count === 1 && S.recordCheckIn({ last: '2026-12-31', count: 3, best: 3 }, '2027-01-01').count === 4, 'year rollover');

// 6. Countdown.
check(S.untilTomorrow(new Date(2026, 10, 6, 0, 0, 0)) === '24:00', 'midnight shows 24:00');
check(S.untilTomorrow(new Date(2026, 10, 6, 23, 59, 30)) === '00:01', 'last minute rounds up');
check(S.untilTomorrow(new Date(2026, 10, 6, 18, 30, 0)) === '05:30', '18:30 -> 05:30');

// 7. Weekly plan: Mon-Fri, weekends roll forward.
const wk = (d) => S.weekdayDates(d).map((x) => x.getDay() + ':' + x.getDate());
check(wk(new Date(2026, 10, 4)).join() === '1:2,2:3,3:4,4:5,5:6', 'Wednesday -> that week Mon-Fri');
check(wk(new Date(2026, 10, 7))[0] === '1:9' && wk(new Date(2026, 10, 8))[0] === '1:9', 'weekend -> next Monday');
check(S.weekdayDates(new Date(2026, 10, 6)).length === 5, 'five days');

// 8. Save hint.
check(S.saveHint('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', false) === 'ios', 'ios');
check(S.saveHint('Mozilla/5.0 (Linux; Android 14)', false) === 'android', 'android');
check(S.saveHint('Mozilla/5.0 (Macintosh)', false) === 'desktop', 'desktop');
check(S.saveHint('Mozilla/5.0 (iPhone)', true) === 'installed', 'installed');

// 9. Wiring: tracking, no popups, no metadata edits on QOTD.
check(/keep_playing_click/.test(src('src/lib/track.ts')), 'keep_playing_click reaches Umami');
check(src('src/components/PlayNextCards.tsx').includes('keep_playing_click') && src('src/components/NextListLink.tsx').includes('keep_playing_click'), 'cards and next-list send keep_playing_click');
check(src('src/components/TryNext.tsx').includes('PlayNextCards'), 'TryNext renders the three cards');
check(src('src/app/question-of-the-day/page.tsx').includes('QotdReturnPanel'), 'QOTD page mounts the return panel');
check(!/\b(alert|confirm|showModal|beforeinstallprompt)\b/.test(src('src/components/QotdReturnPanel.tsx')), 'return panel has no popups');

console.log(`PASS: ${checks} keep-playing, list-ad placement and daily-return assertions (no network).`);
