// Built pages, isolated contexts, synthetic replay SDK. No real collectors or business APIs.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const source = process.env.SPEECH_LAYOUT_ORIGIN || 'http://127.0.0.1:4712';
const output = process.env.SPEECH_LAYOUT_EVIDENCE || '/tmp/speech-firstscreen';
const browser = await chromium.launch({ headless: true, chromiumSandbox: true });
const results = [], errors = [];
const copy = 'Help improve speech practice with optional Microsoft Clarity session replay of page interactions. Your audio is not recorded by replay; speech text and email are masked.';
const replayMock = `window.__replayCalls = [...(window.clarity?.q || [])]; window.clarity = (...args) => window.__replayCalls.push(args);`;

async function open(viewport, fontScale = 100) {
  const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
  let replayLoads = 0;
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.hostname === 'www.clarity.ms' && url.pathname.startsWith('/tag/')) {
      replayLoads++;
      return route.fulfill({ contentType: 'text/javascript', body: replayMock });
    }
    if (url.hostname !== 'randomtopics.app' || request.method() !== 'GET' ||
        url.pathname.startsWith('/api/') || url.pathname.startsWith('/_vercel/')) return route.abort();
    const response = await route.fetch({ url: source + url.pathname + url.search, maxRedirects: 0,
      headers: { ...request.headers(), host: new URL(source).host } });
    return route.fulfill({ response });
  });
  await context.addInitScript(() => {
    sessionStorage.setItem('rt_usage_qa', '1'); sessionStorage.setItem('rt_speech_qa', '1');
    window.__events = [];
    window.addEventListener('rt:analytics', event => {
      if (event.detail.stage === 'constructed') window.__events.push(event.detail);
    });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => errors.push({ viewport, fontScale, message: error.message }));
  await page.goto('https://randomtopics.app/speech', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Continue without replay', exact: true }).waitFor();
  if (fontScale !== 100) await page.addStyleTag({ content: `html { font-size: ${fontScale}%; }` });
  return { context, page, replayLoads: () => replayLoads };
}

async function readable(locator) {
  const geometry = await locator.evaluate(element => {
    const box = element.getBoundingClientRect();
    const range = document.createRange(); range.selectNodeContents(element);
    return { width: box.width, height: box.height, scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth, inside: [...range.getClientRects()].every(rect =>
        rect.left >= box.left - 1 && rect.right <= box.right + 1 &&
        rect.top >= box.top - 1 && rect.bottom <= box.bottom + 1),
      inPage: box.left >= 0 && box.right <= innerWidth + 1 };
  });
  assert.ok(geometry.inside && geometry.inPage && geometry.scrollWidth <= geometry.clientWidth + 1,
    'All text fits its control and the page: ' + JSON.stringify(geometry));
  assert.ok(geometry.height >= 44, 'Touch targets retain at least 44px height');
}

async function textFitsPage(locator) {
  assert.ok(await locator.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    return [...range.getClientRects()].every(rect => rect.left >= 0 && rect.right <= innerWidth + 1);
  }), 'Text reflows within the viewport');
}

async function unchangedNotice(fixture) {
  const { page } = fixture;
  const notice = page.getByRole('complementary', { name: 'Session replay preferences' });
  assert.equal(await notice.locator('p').innerText(), copy);
  await textFitsPage(notice.locator('p'));
  assert.equal(await notice.getByRole('button').count(), 2);
  assert.equal(await notice.getByRole('link', { name: 'Privacy details' }).getAttribute('href'), '/privacy');
  for (const button of await notice.getByRole('button').all()) await readable(button);
  assert.equal(await page.evaluate(() => localStorage.getItem('rt-replay-consent-v1')), null);
  assert.equal(fixture.replayLoads(), 0, 'Unknown consent never loads replay');
}

async function run(name, fn) {
  try { results.push({ name, pass: true, ...await fn() }); console.log('PASS ' + name); }
  catch (error) { results.push({ name, pass: false, error: error.message }); console.log('FAIL ' + name + ': ' + error.message); }
}

try {
  for (const [width, height, fontScale, firstScreen] of [
    [360, 800, 100, true], [375, 667, 100, true], [390, 844, 100, true], [412, 915, 100, true],
    [320, 568, 100, false], [844, 390, 100, false], [1280, 900, 100, false],
    [320, 568, 200, false], [390, 844, 200, false], [844, 390, 200, false],
  ]) await run(`First visit ${width}x${height}, text ${fontScale}%`, async () => {
    const fixture = await open({ width, height }, fontScale);
    try {
      await unchangedNotice(fixture);
      const { page } = fixture;
      await textFitsPage(page.locator('h1'));
      const generate = page.locator('button.btn-generate').first();
      const box = await generate.boundingBox();
      await page.screenshot({ path: `${output}-${width}x${height}-${fontScale}.png` });
      if (firstScreen) assert.ok(box.y >= 0 && box.y + box.height <= height,
        `Complete Generate button must fit with unknown-consent notice: ${JSON.stringify(box)}`);
      await generate.scrollIntoViewIfNeeded(); await readable(generate);
      await page.screenshot({ path: `${output}-${width}x${height}-${fontScale}-action.png` });
      const reachable = await generate.boundingBox();
      assert.ok(reachable.y >= 0 && reachable.y + reachable.height <= height, 'Generate remains reachable by scrolling');
      await generate.click(); await page.locator('.topic-card h3').first().waitFor();
      if (width < 640 && fontScale === 200) {
        await page.getByRole('button', { name: 'Choose filters & count', exact: true }).click();
        const filtered = page.getByRole('button', { name: 'Generate with these filters', exact: true });
        await filtered.scrollIntoViewIfNeeded(); await readable(filtered);
      }
      assert.equal(fixture.replayLoads(), 0, 'Generation does not imply replay consent');
      assert.equal(await page.evaluate(() => window.__events.filter(e => e.event === 'qa_generate_success').length), 1);
      return { viewport: { width, height }, fontScale, firstScreenRequired: firstScreen,
        generateTop: box.y, generateBottom: box.y + box.height, replayLoads: 0 };
    } finally { await fixture.context.close(); }
  });

  for (const choice of ['unknown', 'denied', 'allowed']) await run(`Choice ${choice}: generate, Back, reload and preferences`, async () => {
    const fixture = await open({ width: 390, height: 844 });
    const { page } = fixture;
    try {
      await unchangedNotice(fixture);
      if (choice !== 'unknown') {
        await page.getByRole('button', { name: choice === 'allowed' ? 'I’m 18 or older · Allow replay' : 'Continue without replay', exact: true }).click();
        await page.getByRole('button', { name: `Session replay: ${choice === 'allowed' ? 'allowed' : 'off'} · Change`, exact: true }).waitFor();
      }
      if (choice === 'allowed') {
        await page.waitForFunction(() => window.__rtReplayActive === true);
        assert.equal(fixture.replayLoads(), 1);
        const calls = await page.evaluate(() => window.__replayCalls);
        assert.deepEqual(calls[0], ['consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' }]);
        assert.ok(calls.some(call => call[0] === 'start'));
      } else assert.equal(fixture.replayLoads(), 0);
      await page.locator('button.btn-generate').first().click();
      await page.locator('.topic-card h3').first().waitFor();
      const topics = await page.locator('.topic-card h3').allTextContents();
      await page.setViewportSize({ width: 844, height: 390 });
      assert.deepEqual(await page.locator('.topic-card h3').allTextContents(), topics);
      await page.setViewportSize({ width: 390, height: 844 });
      assert.deepEqual(await page.locator('.topic-card h3').allTextContents(), topics);
      const choiceInStorage = await page.evaluate(() => JSON.parse(localStorage.getItem('rt-replay-consent-v1'))?.choice ?? 'unknown');
      assert.equal(choiceInStorage, choice);
      await page.goto('https://randomtopics.app/saved-topics', { waitUntil: 'networkidle' });
      assert.equal(await page.evaluate(() => Boolean(window.__rtReplayActive)), false, 'Private library has no active replay');
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.getByRole('heading', { name: topics[0], exact: true }).first().waitFor();
      assert.deepEqual(await page.locator('.topic-card h3').allTextContents(), topics);
      await page.reload({ waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: topics[0], exact: true }).first().waitFor();
      assert.deepEqual(await page.locator('.topic-card h3').allTextContents(), topics);
      assert.equal(await page.evaluate(() => window.__events.filter(e => e.event === 'qa_generate_success').length), 0, 'Restoration is not another draw');
      assert.equal(await page.evaluate(() => window.__events.filter(e => /speech_checkout|speech_practice_submit/.test(e.event)).length), 0);
      if (choice === 'unknown') await unchangedNotice(fixture);
      else {
        await page.getByRole('button', { name: `Session replay: ${choice === 'allowed' ? 'allowed' : 'off'} · Change`, exact: true }).click();
        await page.getByRole('button', { name: 'Continue without replay', exact: true }).click();
        await page.waitForFunction(() => !window.__rtReplayActive);
        assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('rt-replay-consent-v1')).choice), 'denied');
        if (choice === 'allowed') {
          const calls = await page.evaluate(() => window.__replayCalls);
          assert.ok(calls.some(call => call[0] === 'stop'));
          assert.ok(calls.some(call => call[0] === 'consentv2' && call[1].analytics_Storage === 'denied'));
        } else assert.equal(fixture.replayLoads(), 0);
      }
      return { choice, topicsRestored: topics.length, mockReplayLoads: fixture.replayLoads() };
    } finally { await fixture.context.close(); }
  });
} finally {
  await browser.close();
  writeFileSync(output + '.json', JSON.stringify({ source, results, errors, realCollectorRequests: 0, realBusinessRequests: 0 }, null, 2));
}
assert.ok(results.every(result => result.pass) && !errors.length, JSON.stringify({ results: results.filter(result => !result.pass), errors }));
console.log(`${results.length} Speech first-screen and privacy checks passed.`);
