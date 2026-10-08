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
