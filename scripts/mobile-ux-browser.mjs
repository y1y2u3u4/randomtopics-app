// Real built pages; fresh isolated contexts, synthetic clipboard, no business APIs.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.USAGE_BASE_URL || 'http://127.0.0.1:4711';
const output = process.env.USAGE_EVIDENCE || '/tmp/mobile-ux';
const browser = await chromium.launch({ headless: true, chromiumSandbox: true });
const results = [], errors = [];
try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      return url.origin === origin && !url.pathname.startsWith('/api/') ? route.continue() : route.abort();
    });
    await context.addInitScript(() => {
      sessionStorage.setItem('rt_usage_qa', '1'); sessionStorage.setItem('rt_speech_qa', '1');
      window.__events = []; window.__copyMode = 'success'; window.__copyCalls = 0;
      Math.random = () => 0.21; // Deterministic editorial draw; no model.
      window.addEventListener('rt:analytics', event => { if (event.detail.stage === 'constructed') window.__events.push(event.detail); });
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: text => {
        window.__copyCalls++; window.__copiedText = text;
        if (window.__copyMode === 'held') return new Promise(resolve => { window.__releaseCopy = resolve; });
        return window.__copyMode === 'success' ? Promise.resolve() : Promise.reject(Error('Synthetic refusal'));
      } } });
      document.execCommand = () => false;
    });
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    const test = async (name, fn) => { await fn(); results.push({ viewport: viewport.width, name, pass: true }); };
    const go = path => page.goto(origin + path + '?usage_qa=1&speech_qa=1', { waitUntil: 'networkidle' });
    const count = name => page.evaluate(n => window.__events.filter(event => event.event === 'qa_' + n).length, name);
    const titles = () => page.locator('.topic-card h3').allTextContents();
    const screenshot = async name => {
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
      await page.screenshot({ path: `${output}-${viewport.width}-${name}.png`, animations: 'disabled' });
    };
    const firstScreen = async () => {
      const box = await page.locator('button.btn-generate').first().boundingBox();
      assert.ok(box, 'Free primary action exists');
      if (viewport.width < 640) assert.ok(box.y >= 0 && box.y + box.height <= viewport.height, 'Free primary action is fully in the mobile first screen');
    };
    await test('Homepage first-screen draw, accessible filters and exact result/filter restoration on Back', async () => {
      await go('/'); await firstScreen(); await screenshot('home-first-screen');
      if (viewport.width < 640) {
        const toggle = page.getByRole('button', { name: 'Choose mode, category & count', exact: true });
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false'); await toggle.click();
        assert.equal(await page.getByRole('button', { name: 'Hide filters', exact: true }).getAttribute('aria-expanded'), 'true');
      }
      await page.getByRole('button', { name: '🔬 Science', exact: true }).click();
      await page.getByRole('button', { name: '3', exact: true }).click();
      await page.getByRole('button', { name: 'Generate with these filters', exact: true }).click();
      await page.locator('.topic-card h3').nth(2).waitFor(); const before = await titles();
      assert.equal(before.length, 3); assert.equal(await count('generate_success'), 1);
      await page.evaluate(() => { window.__events = []; });
      await go('/saved-topics'); await page.goBack({ waitUntil: 'networkidle' });
      await page.locator('.topic-card h3').nth(2).waitFor(); assert.deepEqual(await titles(), before);
      assert.equal(await count('generate_success'), 0, 'Restoration is not generation');
      if (viewport.width < 640) await page.getByRole('button', { name: 'Choose mode, category & count', exact: true }).click();
      assert.equal(await page.getByRole('button', { name: '🔬 Science', exact: true }).getAttribute('aria-pressed'), 'true');
      assert.equal(await page.getByRole('button', { name: '3', exact: true }).getAttribute('aria-pressed'), 'true');
      await page.locator('button.btn-generate').first().click();
      await page.waitForFunction(old => [...document.querySelectorAll('.topic-card h3')].every(h => !old.includes(h.textContent)), before);
      assert.equal(await count('generate_success'), 1, 'One deliberate next draw');
    });
    await test('Actual result copy has one pending operation and one success; failure can retry', async () => {
      const group = page.getByRole('group', { name: 'Result actions' }).first();
      await group.scrollIntoViewIfNeeded();
      await page.evaluate(() => { window.__events = []; window.__copyMode = 'held'; });
      await group.getByRole('button', { name: 'Copy topic + points', exact: false }).evaluate(button => { button.click(); button.click(); });
      assert.equal(await page.evaluate(() => window.__copyCalls), 1);
      assert.equal(await group.getByRole('button', { name: 'Copying…', exact: false }).isDisabled(), true);
      await screenshot('copy-pending'); await page.evaluate(() => window.__releaseCopy());
      await group.getByRole('button', { name: 'Copied', exact: false }).waitFor();
      assert.equal(await count('copy_result'), 1); assert.equal(await count('post_generate_copy'), 1);
      await page.evaluate(() => { window.__copyMode = 'blocked'; });
      await group.getByRole('button', { name: 'Copied', exact: false }).click();
      const fallback = page.locator('.topic-card textarea').first(); await fallback.waitFor();
      assert.equal(await fallback.inputValue(), await page.evaluate(() => window.__copiedText));
      await screenshot('copy-failure'); await page.evaluate(() => { window.__copyMode = 'success'; });
      await group.getByRole('button', { name: 'Copy topic + points', exact: false }).click();
      assert.equal(await fallback.count(), 0); assert.equal(await count('copy_error'), 1); assert.equal(await count('copy_result'), 2);
    });
    await test('Chosen homepage topic reaches free Speech practice without login or automatic submission', async () => {
      const chosen = (await titles())[0];
      await page.getByRole('button', { name: 'Practice this topic →', exact: true }).first().click();
      await page.waitForURL('**/speech*#selected-topic');
      const section = page.locator('#selected-topic');
      await section.getByRole('heading', { name: chosen, exact: true }).waitFor();
      await section.getByRole('button', { name: 'Practice this topic free', exact: true }).click();
      await section.getByRole('button', { name: 'Start recording', exact: true }).waitFor();
      assert.equal(await count('speech_checkout_request'), 0); assert.equal(await count('speech_practice_submit'), 0);
      await screenshot('speech-handoff');
      await section.getByRole('link', { name: 'Return to where you chose this topic', exact: true }).click();
      await page.waitForURL('**/#selected-topic');
      await page.getByRole('heading', { name: chosen, exact: true }).first().waitFor();
      assert.equal(await page.getByRole('heading', { name: chosen, exact: true }).count(), 1, 'Explicit handoff return has one selected topic card');
    });
    await test('Wheel first-screen spin saves to library and restores its exact unsaved result without another spin', async () => {
      await go('/spin-the-wheel'); await firstScreen(); await screenshot('wheel-first-screen');
      await page.locator('button.btn-generate').first().click(); await page.locator('.topic-card h3').first().waitFor();
      const before = (await titles())[0]; assert.equal(await count('spin_success'), 1);
      const recent = await page.evaluate(() => JSON.parse(localStorage.getItem('rt_recent_topics_v1')));
      assert.ok(recent.some(topic => topic.text === before), 'Wheel result is recoverable in recent history');
      await page.evaluate(() => { window.__events = []; });
      await go('/saved-topics'); await page.goBack({ waitUntil: 'networkidle' });
      await page.locator('.topic-card h3').first().waitFor(); assert.equal((await titles())[0], before);
      assert.equal(await count('spin_start'), 0); assert.equal(await count('spin_success'), 0);
      const group = page.getByRole('group', { name: 'Result actions' }).first();
      await group.getByRole('button', { name: 'Save in this browser', exact: true }).click();
      await page.getByRole('link', { name: 'Open my saved topics', exact: false }).click();
      await page.waitForURL('**/saved-topics'); await page.getByRole('heading', { name: 'Your Topic Library', exact: true }).waitFor();
      assert.ok((await page.locator('main').innerText()).includes(before));
    });
    await test('QOTD daily/random copy retains its existing schema and saved no-signup return path', async () => {
      await go('/question-of-the-day'); await screenshot('qotd-first-screen');
      const tool = page.locator('#qotd-generator');
      await tool.getByRole('button', { name: 'Copy for group chat', exact: false }).click();
      assert.equal(await count('post_generate_copy'), 0);
      await tool.getByRole('button', { name: 'Random Question', exact: false }).click();
      await tool.getByRole('button', { name: 'Copy for group chat', exact: false }).click();
      assert.equal(await count('post_generate_copy'), 1); assert.equal(await count('generate_success'), 1);
      assert.ok((await page.evaluate(() => window.__copiedText)).endsWith('/question-of-the-day'));
      await tool.getByRole('button', { name: 'Save in this browser', exact: true }).click();
      await tool.getByRole('link', { name: 'Open my saved topics', exact: false }).click();
      await page.waitForURL('**/saved-topics'); await page.getByRole('heading', { name: 'Your Topic Library', exact: true }).waitFor();
    });
    await test('Speech first-screen generation and reload preserve the topic without starting media or checkout', async () => {
      await go('/speech'); await firstScreen(); await screenshot('speech-first-screen');
      await page.locator('button.btn-generate').first().click(); await page.locator('.topic-card h3').first().waitFor();
      const before = (await titles())[0]; await page.reload({ waitUntil: 'networkidle' });
      await page.locator('.topic-card h3').first().waitFor(); assert.equal((await titles())[0], before);
      assert.equal(await count('generate_success'), 0); assert.equal(await count('speech_checkout_request'), 0);
      await page.getByRole('button', { name: 'Practice this topic free', exact: true }).click();
      await page.getByRole('button', { name: 'Start recording', exact: true }).waitFor();
      assert.equal(await count('speech_practice_submit'), 0); await screenshot('speech-ready');
    });
    await test('Blocked session storage leaves free generation, copy and filter controls usable', async () => {
      await go('/'); await page.evaluate(() => { Storage.prototype.setItem = () => { throw Error('Synthetic storage block'); }; Storage.prototype.getItem = () => { throw Error('Synthetic storage block'); }; });
      await page.locator('button.btn-generate').first().click(); await page.locator('.topic-card h3').first().waitFor();
      await page.getByRole('group', { name: 'Result actions' }).first().getByRole('button', { name: 'Copy topic + points', exact: false }).click();
      assert.ok(await page.evaluate(() => window.__copiedText));
      const events = await page.evaluate(() => window.__events);
      assert.ok(events.every(event => event.event.startsWith('qa_') && event.params.environment === 'local_preview' && event.params.is_test === true));
      assert.ok(!JSON.stringify(events).includes((await titles())[0]));
    });
    await context.close();
  }
  assert.deepEqual(errors, []);
} finally {
  writeFileSync(output + '.json', JSON.stringify({ results, errors }, null, 2)); await browser.close();
}
console.log(`${results.length} real-page mobile/desktop UX checks passed.`);
