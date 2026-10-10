// Local-only end-to-end verification: no external, API, or non-GET traffic.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.NAME_TOOLS_BASE_URL || 'http://127.0.0.1:4723';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(origin).hostname));
const output = process.env.NAME_TOOLS_EVIDENCE || '/tmp/name-tools-browser';
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, chromiumSandbox: true });
const results = [], errors = [], blocked = new Set();
async function setup(viewport, storageMode = 'normal') {
  const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
  context.setDefaultTimeout(15000);
  await context.route('**/*', route => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin === origin && !url.pathname.startsWith('/api/') && request.method() === 'GET') return route.continue();
    blocked.add(url.origin + url.pathname); return route.abort();
  });
  await context.addInitScript(mode => {
    sessionStorage.setItem('rt_usage_qa', '1');
    window.__events = []; window.__copyMode = 'success'; window.__shareMode = 'abort'; window.__copied = [];
    window.addEventListener('rt:analytics', event => { if (event.detail.stage === 'constructed') window.__events.push(event.detail); });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => {
      if (window.__copyMode === 'fail') throw Error('Synthetic clipboard denial');
      if (window.__copyMode === 'hold') await new Promise(resolve => { window.__releaseCopy = resolve; });
      window.__copied.push(text);
    } } });
    Object.defineProperty(navigator, 'share', { configurable: true, value: async () => {
      if (window.__shareMode === 'abort') throw new DOMException('Synthetic cancellation', 'AbortError');
      if (window.__shareMode === 'fail') throw Error('Synthetic share denial');
    } });
    document.execCommand = () => false;
    if (mode === 'blocked') {
      Storage.prototype.getItem = () => { throw Error('Synthetic storage denial'); };
      Storage.prototype.setItem = () => { throw Error('Synthetic storage denial'); };
    }
  }, storageMode);
  const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
  return { context, page };
}
const snapshot = async page => page.locator('[data-name-result="generated"] [data-name-display]').allTextContents();
const eventCount = (page, name) => page.evaluate(n => window.__events.filter(e => e.event === 'qa_' + n).length, name);
const generate = page => page.locator('[data-name-generate]');
const row = page => page.locator('[data-name-result="generated"]').first();
async function test(name, fn) { await fn(); results.push({ name, pass: true }); console.log('PASS ' + name); }
async function open(page, kind) { await page.goto(`${origin}/${kind}-name-generator?usage_qa=1`, { waitUntil: 'networkidle' }); }
try {
  for (const kind of ['band', 'dragon']) {
    const { context, page } = await setup({ width: 375, height: 667 });
    await test(`${kind}: mobile first screen, SSR collection, privacy defaults`, async () => {
      await open(page, kind);
      assert.equal(await page.locator('[data-name-example]').count(), kind === 'band' ? 108 : 48);
      assert.equal(await page.locator('[data-name-result="starter"]').count(), 1);
      assert.equal(await eventCount(page, 'generate_start'), 0);
      assert.equal(await eventCount(page, 'generate_success'), 0);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://randomtopics.app/${kind}-name-generator`);
      assert.equal(await page.locator('link[hreflang="es"]').count(), 0);
      const box = await generate(page).boundingBox(); assert.ok(box.y >= 0 && box.y + box.height <= 667);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.equal(await page.locator('ins.adsbygoogle,script[src*="clarity.ms"]').count(), 0);
      await page.screenshot({ path: `${output}/${kind}-375-initial.png` });
    });
    await test(`${kind}: duplicate submit guard, no-repeat next batch and keyboard focus`, async () => {
      await generate(page).focus();
      await generate(page).evaluate(button => { button.click(); button.click(); });
      assert.equal(await eventCount(page, 'generate_start'), 1); assert.equal(await eventCount(page, 'generate_success'), 1);
      const first = await snapshot(page); assert.equal(first.length, 3); assert.equal(new Set(first).size, 3);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => window.__events.filter(e => e.event === 'qa_generate_success').length === 2);
      const second = await snapshot(page); assert.equal(second.length, 3); assert.ok(second.every(name => !first.includes(name)));
      assert.ok(await generate(page).evaluate(button => document.activeElement === button));
    });
    await test(`${kind}: batch copy guarded while pending; per-name cancellation and fallback`, async () => {
      await page.evaluate(() => { window.__copyMode = 'hold'; });
      await page.getByRole('button', { name: 'Copy all names', exact: true }).evaluate(button => { button.click(); button.click(); });
      assert.equal(await eventCount(page, 'copy_result'), 0);
      await page.evaluate(() => { window.__releaseCopy(); window.__copyMode = 'success'; });
      await page.waitForFunction(() => window.__events.some(e => e.event === 'qa_copy_result'));
      assert.equal(await eventCount(page, 'copy_result'), 1);
      assert.equal(await page.evaluate(() => window.__copied.at(-1)), (await snapshot(page)).join('\n'));
      await row(page).getByRole('button', { name: 'Share', exact: true }).click();
      assert.equal(await eventCount(page, 'share_result'), 0); assert.equal(await eventCount(page, 'share_error'), 0);
      await page.evaluate(() => { window.__copyMode = 'fail'; window.__shareMode = 'fail'; });
      await row(page).getByRole('button', { name: 'Copy name', exact: true }).click();
      assert.equal(await row(page).locator('textarea').inputValue(), (await snapshot(page))[0]);
      assert.equal(await eventCount(page, 'copy_error'), 1);
      await row(page).getByRole('button', { name: 'Share', exact: true }).click();
      assert.ok((await row(page).locator('textarea').inputValue()).includes(`/${kind}-name-generator`));
      assert.equal(await eventCount(page, 'share_error'), 1);
      await page.evaluate(() => { window.__copyMode = 'success'; });
      await row(page).getByRole('button', { name: 'Share', exact: true }).click();
      assert.equal(await eventCount(page, 'share_result'), 1);
      await page.evaluate(() => { window.__shareMode = 'success'; });
      await row(page).getByRole('button', { name: 'Share', exact: true }).click();
      assert.equal(await eventCount(page, 'share_result'), 2);
      await page.evaluate(() => { window.__copyMode = 'fail'; });
      await page.getByRole('button', { name: 'Copy all names', exact: true }).click();
      assert.equal(await page.getByLabel('Select and copy all names').inputValue(), (await snapshot(page)).join('\n'));
      assert.equal(await eventCount(page, 'copy_error'), 2);
      await page.evaluate(() => { window.__copyMode = 'success'; });
    });
    await test(`${kind}: shortlist, reload and Back restore without generating or touching topic favorites`, async () => {
      await page.evaluate(() => {
        localStorage.setItem('rt_favorites', 'existing-topic-fixture');
        localStorage.setItem('rt_favorite_topics_v2', JSON.stringify([{ id: 'fixture-topic', text: 'Existing topic', category: 'creativity', modes: ['writing'], depth: 'light', talkingPoints: [] }]));
      });
      const topicFavorites = await page.evaluate(() => localStorage.getItem('rt_favorite_topics_v2'));
      const names = await snapshot(page);
      await row(page).getByRole('button', { name: 'Save to shortlist', exact: true }).click();
      assert.equal(await page.locator('[data-name-result="shortlist"]').count(), 1);
      assert.equal(await eventCount(page, 'save_result'), 1);
      await page.reload({ waitUntil: 'networkidle' }); assert.deepEqual(await snapshot(page), names);
      assert.equal(await page.locator('[data-name-result="shortlist"]').count(), 1);
      assert.equal(await eventCount(page, 'generate_success'), 0);
      await page.getByRole('button', { name: 'Copy shortlist', exact: true }).click();
      assert.equal(await page.evaluate(() => window.__copied.at(-1)), names[0]);
      await page.goto(`${origin}/${kind === 'band' ? 'dragon' : 'band'}-name-generator`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('[data-name-result="shortlist"]').count(), 0);
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.querySelectorAll('[data-name-result="generated"]').length === 3);
      assert.deepEqual(await snapshot(page), names);
      assert.equal(await page.evaluate(() => localStorage.getItem('rt_favorites')), 'existing-topic-fixture');
      assert.equal(await page.evaluate(() => localStorage.getItem('rt_favorite_topics_v2')), topicFavorites);
    });
    await test(`${kind}: stale pending copy cannot mark replacement results`, async () => {
      await page.evaluate(() => { window.__copyMode = 'hold'; });
      const copies = await eventCount(page, 'copy_result');
      await row(page).getByRole('button', { name: 'Copy name', exact: true }).click();
      await generate(page).click();
      await page.evaluate(() => { window.__releaseCopy(); window.__copyMode = 'success'; });
      await page.waitForTimeout(50);
      assert.equal(await eventCount(page, 'copy_result'), copies);
      assert.equal(await row(page).getByRole('button', { name: 'Copy name', exact: true }).getAttribute('aria-busy'), 'false');
    });
    await page.getByText('Customize names', { exact: true }).click();
    if (kind === 'band') {
      await test('band: seed/style/length/avoid filters, invalid input and honest empty pool', async () => {
        await page.getByLabel('Music style').selectOption('rock'); await page.getByLabel('Name length').selectOption('2');
        await page.getByLabel('Names per batch').selectOption('5');
        await page.getByLabel('Seed word (optional)', { exact: true }).fill('Moon');
        await page.getByLabel('Avoid words or phrases (optional)', { exact: true }).fill('Choir');
        await page.getByRole('button', { name: 'Apply filters', exact: true }).click(); await generate(page).click();
        const names = await snapshot(page); assert.equal(names.length, 5);
        assert.ok(names.every(name => name.includes('Moon') && name.split(' ').length === 2 && !/choir/i.test(name)));
        await page.getByText('Customize names', { exact: true }).click(); await generate(page).scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${output}/band-375-seeded.png` });
        await page.getByText('Customize names', { exact: true }).click();
        await page.getByLabel('Seed word (optional)', { exact: true }).fill('two words');
        await page.getByRole('button', { name: 'Apply filters', exact: true }).click(); assert.ok(await page.locator('form [role="alert"]').isVisible());
        assert.deepEqual(await snapshot(page), names);
        await page.getByLabel('Seed word (optional)', { exact: true }).fill('Moon');
        await page.getByLabel('Avoid words or phrases (optional)', { exact: true }).fill('moon');
        await page.getByRole('button', { name: 'Apply filters', exact: true }).click();
        assert.ok(await generate(page).isDisabled()); assert.ok(await page.getByText('No names match these filters.', { exact: false }).isVisible());
        const all = JSON.stringify(await page.evaluate(() => window.__events));
        for (const text of ['Moon', 'Choir', 'two words', ...names]) assert.ok(!all.includes(text), 'No raw inputs/results in events');
      });
    } else {
      await test('dragon: finite filtered pool, smaller tail, title identity, explicit reset', async () => {
        await page.getByLabel('Element style').selectOption('tide'); await page.getByLabel('Name length').selectOption('long');
        await page.getByLabel('Names per batch').selectOption('5'); await page.getByRole('button', { name: 'Apply filters', exact: true }).click();
        // Earlier unfiltered draws may have used Tide names. Exhaust them, then explicitly reset this selection.
        while (await generate(page).isEnabled()) await generate(page).click();
        await page.getByRole('button', { name: 'Start a fresh round', exact: true }).click();
        await generate(page).click(); const first = await snapshot(page); assert.equal(first.length, 5);
        assert.ok(first.every(name => name.includes(', ')));
        await generate(page).click(); const tail = await snapshot(page); assert.equal(tail.length, 1); assert.ok(!first.includes(tail[0]));
        assert.ok(await generate(page).isDisabled());
        await page.getByLabel('Include a dragon title').uncheck(); await page.getByRole('button', { name: 'Apply filters', exact: true }).click();
        assert.ok(await generate(page).isDisabled(), 'Title display cannot refill exhausted names');
        await page.getByRole('button', { name: 'Start a fresh round', exact: true }).click(); assert.equal((await snapshot(page)).length, 0);
        await generate(page).click(); assert.equal((await snapshot(page)).length, 5); assert.ok((await snapshot(page)).every(name => !name.includes(', ')));
        await page.getByText('Customize names', { exact: true }).click(); await generate(page).scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${output}/dragon-375-results.png` });
      });
    }
    await test(`${kind}: local-only anonymous events and responsive desktop`, async () => {
      const events = await page.evaluate(() => window.__events.filter(e => e.event !== 'qa_page_view'));
      assert.ok(events.length > 0); assert.ok(events.every(e => e.params.is_test && e.params.environment === 'local_preview'));
      assert.ok(events.every(e => e.params.tool_type === `${kind}_name`));
      const filters = page.locator('section[aria-label$="name tool"] > details');
      if (!await filters.evaluate(element => element.open)) await page.getByText('Customize names', { exact: true }).click();
      await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
      await page.getByText('Customize names', { exact: true }).click(); await generate(page).click();
      await page.setViewportSize({ width: 1280, height: 900 }); await page.evaluate(() => scrollTo(0, 0));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: `${output}/${kind}-1280.png` });
      await page.setViewportSize({ width: 320, height: 568 });
      await page.evaluate(() => document.documentElement.style.fontSize = '200%'); await page.waitForTimeout(350);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await generate(page).scrollIntoViewIfNeeded(); await page.screenshot({ path: `${output}/${kind}-320-zoom.png` });
    });
    await context.close();
  }
  await test('Blocked storage: generation and copy survive, saving reports failure', async () => {
    const { context, page } = await setup({ width: 390, height: 844 }, 'blocked'); await open(page, 'band');
    assert.ok(await page.getByText('Browser storage is blocked.', { exact: false }).isVisible());
    await generate(page).click(); assert.equal((await snapshot(page)).length, 3);
    await row(page).getByRole('button', { name: 'Save to shortlist', exact: true }).click();
    assert.equal(await eventCount(page, 'save_error'), 1); assert.equal(await eventCount(page, 'save_result'), 0);
    assert.equal(await page.locator('[data-name-result="shortlist"]').count(), 0);
    await row(page).getByRole('button', { name: 'Copy name', exact: true }).click(); assert.equal(await eventCount(page, 'copy_result'), 1);
    await context.close();
  });
  await test('Damaged and expired local state recover to a clean starter with no generation event', async () => {
    const { context, page } = await setup({ width: 390, height: 844 }); await open(page, 'band');
    await page.evaluate(() => {
      sessionStorage.setItem('rt_name_round_band_v1', '{broken');
      localStorage.setItem('rt_name_shortlist_band_v1', '{broken');
    });
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('[data-name-result="starter"]').count(), 1);
    assert.equal(await page.locator('[data-name-result="shortlist"]').count(), 0);
    assert.equal(await eventCount(page, 'generate_success'), 0);
    await generate(page).click();
    await page.evaluate(() => {
      const value = JSON.parse(sessionStorage.getItem('rt_name_round_band_v1'));
      value.updated = Date.now() - 25 * 3600000;
      sessionStorage.setItem('rt_name_round_band_v1', JSON.stringify(value));
    });
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('[data-name-result="starter"]').count(), 1);
    assert.equal(await eventCount(page, 'generate_success'), 0);
    await context.close();
  });
  assert.deepEqual(errors, []);
  writeFileSync(`${output}/result.json`, JSON.stringify({ origin, results, pageErrors: errors, blocked: [...blocked], externalOrApiRequestsAllowed: 0 }, null, 2));
  console.log(`PASS ${results.length} local name-tool browser stories.`);
} catch (error) {
  writeFileSync(`${output}/result.json`, JSON.stringify({ origin, results, pageErrors: errors, error: error.message, blocked: [...blocked] }, null, 2)); throw error;
} finally { await browser.close(); }
