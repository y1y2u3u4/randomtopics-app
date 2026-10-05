// Built-page acceptance with a fresh browser context and blocked external/API
// traffic. Only synthetic clipboard responses and browser-local storage are used.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.USAGE_BASE_URL || 'http://127.0.0.1:4798';
const output = process.env.USAGE_EVIDENCE || '/tmp/usage-continuity';
const browser = await chromium.launch({ headless: true, chromiumSandbox: true });
const results = [], errors = [];
try {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      return url.origin === origin && !url.pathname.startsWith('/api/') ? route.continue() : route.abort();
    });
    await context.addInitScript(() => {
      sessionStorage.setItem('rt_usage_qa', '1');
      window.__events = []; window.__copyMode = 'success'; window.__copyCalls = 0;
      window.addEventListener('rt:analytics', e => { if (e.detail.stage === 'constructed') window.__events.push(e.detail); });
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: text => {
        window.__copyCalls++; window.__copiedText = text;
        if (window.__copyMode === 'held') return new Promise((resolve, reject) => { window.__releaseCopy = success => success ? resolve() : reject(Error('Synthetic clipboard refusal')); });
        return window.__copyMode === 'success' ? Promise.resolve() : Promise.reject(Error('Synthetic clipboard refusal'));
      } } });
      document.execCommand = () => false;
    });
    const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
    const test = async (name, fn) => { await fn(); results.push({ viewport: viewport.width, name, pass: true }); };
    const count = name => page.evaluate(n => window.__events.filter(e => e.event === 'qa_' + n).length, name);
    const home = async () => { await page.goto(origin + '/?usage_qa=1', { waitUntil: 'networkidle' }); await page.locator('button.btn-generate').first().click(); await page.getByRole('button', { name: 'Copy results', exact: false }).waitFor(); };
    await test('Generated topic saves, survives navigation and reload, and copies from the library', async () => {
      await home(); assert.equal(await count('generate_success'), 1);
      await page.getByRole('button', { name: 'Save in this browser', exact: true }).first().click();
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('rt_favorite_topics_v2'))[0]);
      assert.equal(await count('post_generate_save'), 1);
      await page.getByRole('link', { name: 'Open my saved topics', exact: false }).first().click();
      await page.waitForURL('**/saved-topics');
      // Advertising boundaries replace the document after the URL changes.
      await page.getByRole('heading', { name: 'Your Topic Library', exact: true }).waitFor();
      await page.reload({ waitUntil: 'networkidle' });
      assert.ok((await page.locator('main').innerText()).includes(saved.text));
      await page.getByRole('button', { name: 'Copy topic + points', exact: false }).first().click();
      assert.ok((await page.evaluate(() => window.__copiedText)).includes(saved.text));
      assert.equal(await count('post_generate_copy'), 0, 'Library use is not a newly generated result');
    });
    await test('Held batch copy disables duplicates and late refusal never restores previous text', async () => {
      await home(); await page.evaluate(() => { window.__copyMode = 'held'; });
      await page.getByRole('button', { name: 'Copy results', exact: false }).click();
      assert.equal(await page.getByRole('button', { name: 'Copying…', exact: false }).isDisabled(), true);
      await page.getByRole('button', { name: 'Generate next topics', exact: false }).click();
      await page.evaluate(() => { window.__releaseCopy(false); window.__copyMode = 'success'; });
      await page.waitForTimeout(60);
      assert.equal(await page.locator('#manual-copy-generated-topics').count(), 0);
      assert.equal(await count('post_generate_copy'), 0);
      await page.getByRole('button', { name: 'Copy results', exact: false }).click();
      assert.equal(await count('post_generate_copy'), 1);
      assert.equal(await page.evaluate(() => window.__copyCalls), 2);
    });
    await test('Blocked batch copy exposes exact selectable text and a successful retry', async () => {
      await home(); await page.evaluate(() => { window.__copyMode = 'blocked'; });
      await page.getByRole('button', { name: 'Copy results', exact: false }).click();
      assert.equal(await page.locator('#manual-copy-generated-topics').inputValue(), await page.evaluate(() => window.__copiedText));
      assert.equal(await count('copy_error'), 1); assert.equal(await count('post_generate_copy'), 0);
      await page.evaluate(() => { window.__copyMode = 'success'; });
      await page.getByRole('button', { name: 'Copy results', exact: false }).click();
      assert.equal(await page.locator('#manual-copy-generated-topics').count(), 0); assert.equal(await count('post_generate_copy'), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: output + '-' + viewport.width + '-home.png', animations: 'disabled' });
    });
    await test('QOTD daily and random copy/save retain distinct attribution and a saved return path', async () => {
      await page.goto(origin + '/question-of-the-day?usage_qa=1', { waitUntil: 'networkidle' });
      const tool = page.locator('#qotd-generator');
      await tool.getByRole('button', { name: 'Copy for group chat', exact: false }).click();
      assert.equal(await count('generate_success'), 0); assert.equal(await count('post_generate_copy'), 0);
      assert.ok((await page.evaluate(() => window.__copiedText)).endsWith('/question-of-the-day'));
      await tool.getByRole('button', { name: 'Random Question', exact: false }).click();
      await tool.getByRole('button', { name: 'Copy for group chat', exact: false }).click();
      assert.equal(await count('generate_success'), 1); assert.equal(await count('post_generate_copy'), 1);
      await tool.getByRole('button', { name: 'Save in this browser', exact: true }).click();
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('rt_favorite_topics_v2')).find(t => t.id.startsWith('qotd-')));
      assert.ok(saved); assert.equal(await count('post_generate_save'), 1);
      const events = await page.evaluate(() => window.__events);
      assert.ok(events.every(e => e.event.startsWith('qa_') && e.params.is_test === true));
      assert.ok(!JSON.stringify(events).includes(saved.text));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: output + '-' + viewport.width + '-qotd.png', animations: 'disabled' });
      await tool.getByRole('link', { name: 'Open my saved topics', exact: false }).click();
      await page.waitForURL('**/saved-topics');
      // Advertising boundaries replace the document after the URL changes.
      await page.getByRole('heading', { name: 'Your Topic Library', exact: true }).waitFor();
      await page.reload({ waitUntil: 'networkidle' });
      assert.ok((await page.locator('main').innerText()).includes(saved.text));
    });
    await context.close();
  }
  assert.deepEqual(errors, []);
} finally {
  writeFileSync(output + '.json', JSON.stringify({ results, errors }, null, 2));
  await browser.close();
}
console.log(results.length + ' built-page desktop/mobile checks passed.');
