// Run the real Spanish category template and route data without external calls.
// This checks source/SSR output; production HTTP and GSC validation are separate.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const cache = new Map();
const read = (file) => load(file, {}, cache);
const { CATEGORIES, MODES } = read("src/data/types.ts");
const { SEO_ARTICLES } = read("src/data/seoContent.ts");
const { SEO_ARTICLES_ES } = read("src/data/seoContent.es.ts");
const { categoryToArticles } = read("src/data/internalLinks.ts");
const { SITE_URL } = read("src/i18n/config.ts");

// Enumerate actual static pages and the data accepted by each dynamic route.
// Merely matching /topics/[slug] would incorrectly accept nonexistent slugs.
const routes = new Set();
for (const file of readdirSync(resolve(root, "src/app"), { recursive: true })) {
  if (!/(^|\/)page\.tsx$/.test(file) || file.includes("[")) continue;
  routes.add("/" + file.replace(/(^|\/)page\.tsx$/, ""));
}
for (const locale of ["", "/es"]) {
  for (const category of CATEGORIES) {
    routes.add(locale + "/categories/" + category.id);
    for (const mode of MODES) routes.add(locale + "/" + mode.slug + "/" + category.id);
  }
}
for (const article of SEO_ARTICLES) routes.add("/topics/" + article.slug);
for (const article of SEO_ARTICLES_ES) routes.add("/es/topics/" + article.slug);
function assertRoute(href, context) {
  const url = new URL(href, SITE_URL);
  assert.equal(url.origin, SITE_URL, context + ": unexpected origin " + href);
  assert.ok(routes.has(url.pathname), context + ": nonexistent route " + href);
}

const noop = () => null;
const overrides = {
  "@/components/Navbar": noop,
  "@/components/Footer": noop,
  "@/components/Breadcrumb": noop,
  "@/components/TopicGenerator": noop,
  "next/link": ({ href, children }) => createElement("a", { href }, children),
};
const pageFile = "src/app/es/categories/[category]/page.tsx";
const code = ts.transpileModule(readFileSync(resolve(root, pageFile), "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
  },
}).outputText;
const loadedPage = { exports: {} };
new Function("require", "module", "exports", code)((id) => {
  if (Object.hasOwn(overrides, id)) return overrides[id];
  if (id.startsWith("@/")) return read("src/" + id.slice(2) + ".ts");
  return require(id);
}, loadedPage, loadedPage.exports);
const CategoryPage = loadedPage.exports.default;
const renderCategory = async (category) => renderToStaticMarkup(
  await CategoryPage({ params: Promise.resolve({ category }) }),
);
const brokenPaths = [
  "/es/topics/ethical-dilemmas-for-adults",
  "/es/topics/ethical-dilemmas-for-students",
  "/es/topics/workplace-ethical-dilemmas",
  "/es/deep-conversation-question-generator",
  "/es/question-of-the-day-for-students",
  "/es/question-of-the-day-for-work",
];
const rendered = new Map();
let renderedLinks = 0;
for (const category of CATEGORIES) {
  const html = await renderCategory(category.id);
  rendered.set(category.id, html);
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    assertRoute(match[1], "Spanish category " + category.id);
    renderedLinks++;
  }
  for (const path of brokenPaths) assert.ok(
    !html.includes('href="' + path + '"'),
    "Spanish category " + category.id + " still links to " + path,
  );
}
// Keep genuine related collections present, instead of removing the section.
for (const [category, path] of [
  ["philosophy", "/es/topics/ethical-dilemma-questions"],
  ["psychology", "/es/topics/deep-questions-to-ask-your-partner"],
  ["relationships", "/es/topics/conversation-starters-for-couples"],
  ["education", "/es/topics/debate-topics-for-students"],
  ["business", "/es/topics/team-building-questions"],
]) assert.ok(rendered.get(category).includes('href="' + path + '"'), category + ": real related link lost");

// Exercise a non-mirrored Spanish slug through the actual page renderer.
const originalScience = categoryToArticles.science;
try {
  categoryToArticles.science = [
    ...originalScience,
    { title: "Presentation route fixture", href: "/presentation-topic-generator" },
  ];
  const html = await renderCategory("science");
  assert.ok(html.includes('href="/es/generador-de-temas-para-exponer"'));
  assert.ok(!html.includes('href="/es/presentation-topic-generator"'));
} finally {
  categoryToArticles.science = originalScience;
}

const sitemap = read("src/app/sitemap.ts").default();
const urls = new Map(sitemap.map((entry) => [entry.url, entry]));
assert.equal(urls.size, sitemap.length, "sitemap: duplicate canonical URLs");
let alternates = 0;
for (const entry of sitemap) {
  assertRoute(entry.url, "sitemap");
  const languages = entry.alternates?.languages ?? {};
  for (const [language, href] of Object.entries(languages)) {
    assertRoute(href, "sitemap alternate " + language);
    const counterpart = urls.get(href);
    assert.ok(counterpart, "sitemap alternate missing canonical entry: " + href);
    assert.deepEqual(counterpart.alternates.languages, languages, "sitemap: nonreciprocal alternates");
    alternates++;
  }
}
for (const path of brokenPaths) {
  assert.ok(!urls.has(SITE_URL + path), "sitemap publishes nonexistent Spanish mirror " + path);
}
for (const path of [
  "/es/generador-de-temas-para-exponer",
  "/es/generador-de-temas-para-investigar",
  "/es/generador-de-temas-para-estudiar",
]) assert.ok(urls.has(SITE_URL + path), "sitemap omits custom Spanish route " + path);

const redirects = await read("next.config.ts").default.redirects();
for (const [source, destination] of [
  ["/article/:slug", "/topics/:slug"],
  ["/topic-generator", "/"],
  ["/es/topic-generator", "/es"],
]) {
  const rule = redirects.find((candidate) => candidate.source === source);
  assert.ok(rule, "legacy redirect missing: " + source);
  assert.equal(rule.destination, destination);
  assert.equal(rule.permanent, true, "legacy redirect is not permanent: " + source);
  if (source.includes(":slug")) {
    for (const article of SEO_ARTICLES) assertRoute(
      destination.replace(":slug", article.slug), "legacy article redirect",
    );
  } else assertRoute(destination, "legacy redirect");
}
console.log("SEO routing regression passed: " + CATEGORIES.length + " rendered Spanish categories, " +
  renderedLinks + " rendered links, " + sitemap.length + " sitemap URLs, " +
  alternates + " alternates, 3 legacy redirect rules. No production HTTP/GSC assertions.");

if (process.env.SEO_BASE_URL) {
  const base = new URL(process.env.SEO_BASE_URL);
  assert.ok(["127.0.0.1", "localhost"].includes(base.hostname),
    "HTTP regression must target a local test server, not production");
  const get = (path) => fetch(new URL(path, base), {
    redirect: "manual", signal: AbortSignal.timeout(15000),
  });
  const sitemapResponse = await get("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200, "HTTP sitemap");
  const xml = await sitemapResponse.text();
  const published = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(published, [...urls.keys()], "HTTP sitemap differs from source inventory");
  for (const entry of sitemap) {
    const response = await get(new URL(entry.url).pathname);
    assert.equal(response.status, 200, "HTTP sitemap URL: " + entry.url);
    await response.text();
  }
  for (const [source, destination] of [
    ["/article/deep-philosophical-questions", "/topics/deep-philosophical-questions"],
    ["/topic-generator", "/"],
    ["/es/topic-generator", "/es"],
  ]) {
    const response = await get(source + "?utm_source=routing-regression");
    assert.ok([301, 308].includes(response.status), "HTTP permanent redirect: " + source);
    const location = new URL(response.headers.get("location"), base);
    assert.equal(location.pathname, destination, "HTTP redirect destination: " + source);
    assert.equal(location.searchParams.get("utm_source"), "routing-regression",
      "HTTP redirect dropped query parameters: " + source);
    const target = await get(location.pathname + location.search);
    assert.equal(target.status, 200, "HTTP redirect target: " + destination);
    await target.text();
  }
  for (const path of [...brokenPaths, "/topics/nonexistent-seo-regression-slug"]) {
    const response = await get(path);
    assert.equal(response.status, 404, "Nonexistent route should remain 404: " + path);
    await response.text();
  }
  const legacyMissing = await get("/article/nonexistent-seo-regression-slug");
  assert.ok([301, 308].includes(legacyMissing.status));
  assert.equal(new URL(legacyMissing.headers.get("location"), base).pathname,
    "/topics/nonexistent-seo-regression-slug");
  console.log("HTTP routing regression passed: " + sitemap.length +
    " sitemap URLs return 200; 3 permanent redirects preserve queries and end at 200; " +
    "nonexistent pages remain 404. Test server only, no production/GSC assertion.");
}
