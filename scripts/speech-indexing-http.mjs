// Verify the actual Next HTTP boundary, including dynamic private pages.
// Run against a locally built server; no browser, analytics, or business API calls.
import assert from "node:assert/strict";

const base = new URL(process.env.SPEECH_INDEXING_BASE_URL || "http://127.0.0.1:4706");
assert.equal(base.protocol, "http:", "Use a local HTTP server");
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(base.hostname), "Local hosts only");
const publicPaths = ["/speech", "/speech/persuasive", "/speech/informative", "/speech/politics", "/es/speech"];
const privatePaths = ["/speech/account", "/speech/practice"];
const excludedCategories = ["/speech/science", "/es/speech/politics"];
const results = [];

function tags(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].map(([value]) =>
    Object.fromEntries([...value.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, content]) => [key.toLowerCase(), content])),
  );
}
async function get(path) {
  const response = await fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200, `${path}: remains a direct 200`);
  return { response, html: await response.text() };
}
async function test(name, run) {
  try { results.push({ name, pass: true, ...await run() }); }
  catch (error) { results.push({ name, pass: false, error: error.message }); }
}
for (const path of [...publicPaths, ...privatePaths, ...excludedCategories]) {
  await test(path, async () => {
    const { response, html } = await get(path);
    const header = response.headers.get("x-robots-tag");
    const robots = tags(html, "meta").filter(tag => ["robots", "googlebot"].includes(tag.name)).map(tag => tag.content).join(",");
    const canonical = tags(html, "link").find(tag => tag.rel === "canonical")?.href;
    if (publicPaths.includes(path)) {
      assert.doesNotMatch(`${header || ""},${robots}`, /\b(noindex|nofollow|none)\b/i, "Public pages must be indexable and followable at both layers");
      assert.equal(canonical, `https://randomtopics.app${path}`, "Self-canonical must remain intact");
    } else {
      assert.match(robots, /\bnoindex\b/i, "Private pages and excluded categories stay noindex");
    }
    if (privatePaths.includes(path)) assert.match(header || "", /\bnoindex\b/i, "Private pages retain HTTP noindex");
    if (path.startsWith("/speech")) assert.equal(response.headers.get("referrer-policy"), "no-referrer", "Speech referrer privacy remains intact");
    if (path === "/speech" || path === "/es/speech") {
      const alternates = tags(html, "link").filter(tag => tag.rel === "alternate");
      for (const [lang, href] of [["en", "https://randomtopics.app/speech"], ["es", "https://randomtopics.app/es/speech"]]) {
        assert.ok(alternates.some(tag => tag.hreflang === lang && tag.href === href), `${lang} alternate remains correct`);
      }
      const counterpart = path === "/speech" ? "/es/speech" : "/speech";
      assert.ok(tags(html, "a").some(tag => tag.href === counterpart), "Visible locale link remains available");
    }
    return { status: response.status, header, robots, canonical };
  });
}
await test("robots.txt and sitemap.xml", async () => {
  const { html: robots } = await get("/robots.txt");
  assert.doesNotMatch(robots, /Disallow:\s*\/(?:es\/)?speech/i, "Crawlers must see page-level directives");
  assert.match(robots, /Sitemap: https:\/\/randomtopics\.app\/sitemap\.xml/);
  const { html: sitemap } = await get("/sitemap.xml");
  for (const path of publicPaths) assert.ok(sitemap.includes(`<loc>https://randomtopics.app${path}</loc>`), `${path} is in sitemap`);
  for (const path of [...privatePaths, ...excludedCategories]) assert.ok(!sitemap.includes(`<loc>https://randomtopics.app${path}</loc>`), `${path} is excluded from sitemap`);
});
console.log(JSON.stringify({ verifiedAtUTC: new Date().toISOString(), results, passed: results.filter(result => result.pass).length, total: results.length }, null, 2));
if (results.some(result => !result.pass)) process.exitCode = 1;
