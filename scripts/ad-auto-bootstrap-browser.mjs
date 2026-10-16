// Auto ads bootstrap on public pages without the manual unit, against a built
// local Next server through a production-hostname proxy. Google SDK and CMP are
// mocks; every other external/API call is blocked.
// Build with NEXT_PUBLIC_ADSENSE_ROLLOUT=manual-public-reviewed-v1 NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT=8217822741,
// run `next start -p 4805`, then: node scripts/ad-auto-bootstrap-browser.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mockSdk } from "./lib/adsense-mock-sdk.mjs";
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const local = process.env.AD_LOCAL_ORIGIN || "http://127.0.0.1:4805";
const browser = await chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || undefined });
let failed = 0;

async function open(path, options = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 900 }, serviceWorkers: "block" });
  let sdk = 0, cmp = 0, closing = false;
  await context.route("**/*", (route) => (async () => {
    const req = route.request(), url = new URL(req.url());
    if (url.hostname === "pagead2.googlesyndication.com" && url.pathname === "/pagead/js/adsbygoogle.js") { sdk++; return route.fulfill({ contentType: "text/javascript", body: mockSdk }); }
    if (url.hostname === "fundingchoicesmessages.google.com") { cmp++; return route.fulfill({ contentType: "text/javascript", body: "/* mock CMP */" }); }
    if (url.hostname === "randomtopics.app" && url.pathname === "/api/speech/config") return route.fulfill({ contentType: "application/json", body: JSON.stringify({ url: "https://ad-fixture.supabase.co", key: "SYNTHETIC_PUBLIC_KEY", billingAvailable: true }) });
    if (url.hostname === "randomtopics.app" && url.pathname === "/api/speech/ad-entitlement") return route.fulfill({ contentType: "application/json", body: JSON.stringify({ version: "speech-ad-v1", audience: req.headers().authorization ? "verified_session" : "signed_out", adFree: Boolean(options.paid) }) });
    if (url.hostname !== "randomtopics.app" || url.pathname.startsWith("/api/")) return route.abort();
    const response = await route.fetch({ url: local + url.pathname + url.search, maxRedirects: 0, headers: { ...req.headers(), host: new URL(local).host } });
    return route.fulfill({ response });
  })().catch((error) => { if (!closing) throw error; }));
  await context.addInitScript((options) => {
    if (options.paid) {
      const part = (v) => btoa(JSON.stringify(v)).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
      const expires = Math.floor(Date.now() / 1000) + 86400;
      const token = part({ alg: "HS256", typ: "JWT" }) + "." + part({ sub: "00000000-0000-4000-8000-000000000001", exp: expires, aud: "authenticated", role: "authenticated" }) + ".SYNTHETIC";
      localStorage.setItem("sb-ad-fixture-auth-token", JSON.stringify({ access_token: token, refresh_token: "SYNTHETIC_REFRESH", expires_at: expires, expires_in: 86400, token_type: "bearer", user: { id: "00000000-0000-4000-8000-000000000001", aud: "authenticated", role: "authenticated", is_anonymous: false, app_metadata: {}, user_metadata: {} } }));
    }
    window.__privacyOptions = { missingUs: true };
    window.__consent = { cmpStatus: "loaded", gdprApplies: false };
    if (options.gpc) Object.defineProperty(navigator, "globalPrivacyControl", { value: true });
    window.__cls = 0;
    new PerformanceObserver((list) => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  }, options);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("https://randomtopics.app" + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  return { page, errors, sdk: () => sdk, cmp: () => cmp, close: async () => { closing = true; await context.close(); } };
}

async function run(name, path, options, check) {
  const f = await open(path, options);
  try { await check(f); console.log("PASS " + name); }
  catch (e) { failed++; console.log("FAIL " + name + ": " + e.message); }
  finally { await f.close(); }
}

const autoOn = async (f) => {
  assert.equal(f.sdk(), 1, "SDK loads once");
  assert.equal(f.cmp(), 1, "CMP loads once");
  assert.equal(await f.page.evaluate(() => window.__mock?.resumes), 1, "Auto ads resumed");
  assert.equal(await f.page.evaluate(() => window.__mock?.npa), 1, "same non-personalized setting");
  assert.equal(await f.page.locator("ins.adsbygoogle").count(), 0, "no manual slot added");
  assert.equal(await f.page.evaluate(() => window.__cls), 0, "no layout shift");
  assert.deepEqual(f.errors, []);
};
for (const path of ["/random-food-generator", "/charades", "/would-you-rather", "/topics/conversation-topics-for-teens", "/es/most-likely-to"])
  await run("Auto ads on " + path, path, {}, autoOn);
for (const path of ["/riddles-for-kids", "/this-or-that/kids", "/es/would-you-rather/kids", "/classroom-timer", "/random-group-generator", "/privacy", "/speech"])
  await run("No ad runtime on " + path, path, {}, async (f) => { assert.equal(f.sdk(), 0); assert.equal(f.cmp(), 0); });
await run("Paid user: no ad runtime on /charades", "/charades", { paid: true }, async (f) => { assert.equal(f.sdk(), 0); assert.equal(f.cmp(), 0); });
await run("GPC: no ad runtime on /charades", "/charades", { gpc: true }, async (f) => { assert.equal(f.sdk(), 0); assert.equal(f.cmp(), 0); });
await run("Query string: no ad runtime", "/charades?x=1", {}, async (f) => { assert.equal(f.sdk(), 0); });
for (const path of ["/spin-the-wheel", "/question-of-the-day"])
  await run("Manual-unit page loads the runtime once: " + path, path, {}, async (f) => {
    assert.equal(f.sdk(), 1); assert.equal(f.cmp(), 1);
    assert.equal(await f.page.locator("[data-ad-placement=public-content]").count(), 1);
  });
await browser.close();
console.log(failed ? `FAIL: ${failed} auto-ads bootstrap cases` : "PASS: auto-ads bootstrap browser cases");
process.exit(failed ? 1 : 0);
