import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const baseUrl = (process.env.SEO_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const buildDir = process.env.SEO_BUILD_DIR ? resolve(process.env.SEO_BUILD_DIR) : null;
const canonicalOrigin = "https://randomtopics.app";
const routesManifest = buildDir
  ? JSON.parse(await readFile(resolve(buildDir, "../../routes-manifest.json"), "utf8"))
  : null;

const checks = [
  { path: "/", index: true, canonical: "/", titleMax: 70, titleHas: "Random Topic Generator" },
  { path: "/es", index: true, canonical: "/es", titleMax: 70, titleHas: "Temas al Azar", es: true, hreflang: true },
  { path: "/debate", index: true, canonical: "/debate", titleMax: 70, titleHas: "Debate Topic Generator", hreflang: true },
  { path: "/question-of-the-day", index: true, canonical: "/question-of-the-day", titleMax: 70, titleHas: "Question of the Day" },
  { path: "/icebreaker", index: true, canonical: "/icebreaker", titleMax: 70, titleHas: "Icebreaker Question Generator", hreflang: true },
  { path: "/writing", index: true, canonical: "/writing", titleMax: 76, titleHas: "Random Topics to Write About", hreflang: true },
  { path: "/conversation", index: true, canonical: "/conversation", titleMax: 65, titleHas: "Conversation Topic Generator", hreflang: true, bodyHas: ["Popular Conversation Starter Collections"], bodyOccurrences: [{ needle: 'href="/topics/', min: 6 }] },
  { path: "/topics/ethical-dilemma-questions", index: true, canonical: "/topics/ethical-dilemma-questions", titleMax: 65, titleHas: "65+ Moral & Ethical Dilemma Questions", hreflang: true, bodyHas: ["Quick Moral Dilemmas to Discuss", "Try the Argument Generator"], bodyOccurrences: [{ needle: 'class="flex items-start gap-3"', exact: 66 }] },
  { path: "/topics/toastmasters-table-topics", index: true, canonical: "/topics/toastmasters-table-topics", titleMax: 70, titleHas: "Toastmasters Table Topics", bodyHas: ["Updated:", "Print or save as PDF"] },
  { path: "/es/most-likely-to", index: true, canonical: "/es/most-likely-to", titleMax: 76, titleHas: "Quién Es Más Probable", es: true, hreflang: true },
  { path: "/es/topics/most-likely-to-questions", index: true, canonical: "/es/topics/most-likely-to-questions", titleMax: 65, titleHas: "100 Preguntas de Quién Es Más Probable", es: true, hreflang: true, bodyHas: ["Preguntas fuertes de Quién es más probable para amigos", "Abrir el Generador de Quién Es Más Probable"], bodyOccurrences: [{ needle: 'class="flex items-start gap-3"', exact: 100 }] },
  { path: "/writing/philosophy", index: true, canonical: "/writing/philosophy", titleHas: "Philosophy" },
  { path: "/writing/psychology", index: true, canonical: "/writing/psychology", titleHas: "Psychology" },
  { path: "/speech/politics", index: true, canonical: "/speech/politics", titleHas: "Politics" },
  { path: "/debate/technology", index: true, canonical: "/debate/technology", titleHas: "Technology" },
  { path: "/conversation/philosophy", index: true, canonical: "/conversation/philosophy", titleHas: "Philosophy" },
  { path: "/writing/sports", index: false, canonical: "/writing/sports" },
  { path: "/es/speech/politics", index: false, canonical: "/es/speech/politics", es: true },
];

function fail(message) {
  throw new Error(message);
}

function decodeHtml(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function tagWith(html, tagName, attribute, value) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) || [];
  return tags.find((tag) => new RegExp(`${attribute}=["']${value}["']`, "i").test(tag));
}

function attr(tag, name) {
  return tag?.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1];
}

function buildArtifactPath(path) {
  if (path === "/") return resolve(buildDir, "index.html");
  return resolve(buildDir, `${path.slice(1)}.html`);
}

function hasSpanishHeaderRule() {
  return routesManifest?.headers?.some(
    (rule) =>
      rule.source === "/es/:path*" &&
      rule.headers?.some(
        (header) => header.key.toLowerCase() === "content-language" && header.value === "es",
      ),
  );
}

async function getPage(path) {
  if (!buildDir) return fetch(`${baseUrl}${path}`, { redirect: "manual" });

  const html = await readFile(buildArtifactPath(path), "utf8");
  return {
    status: 200,
    ok: true,
    headers: {
      get(name) {
        if (name.toLowerCase() === "content-language" && path.startsWith("/es") && hasSpanishHeaderRule()) {
          return "es";
        }
        return null;
      },
    },
    async text() {
      return html;
    },
  };
}

async function getTextArtifact(path, artifactName) {
  if (!buildDir) return fetch(`${baseUrl}${path}`);

  const body = await readFile(resolve(buildDir, artifactName), "utf8");
  return {
    status: 200,
    ok: true,
    async text() {
      return body;
    },
  };
}

async function checkPage(check) {
  const response = await getPage(check.path);
  if (response.status !== 200) fail(`${check.path}: expected 200, received ${response.status}`);

  const html = await response.text();
  const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim());
  const canonicalTag = tagWith(html, "link", "rel", "canonical");
  const canonical = attr(canonicalTag, "href");
  const robotsTag = tagWith(html, "meta", "name", "robots");
  const robots = (attr(robotsTag, "content") || "").toLowerCase();

  const expectedCanonical = check.canonical === "/"
    ? canonicalOrigin
    : `${canonicalOrigin}${check.canonical}`;
  if (canonical !== expectedCanonical) {
    fail(`${check.path}: canonical ${canonical || "missing"}, expected ${expectedCanonical}`);
  }
  if (check.index && robots.includes("noindex")) fail(`${check.path}: unexpectedly noindexed`);
  if (!check.index && !robots.includes("noindex")) fail(`${check.path}: expected noindex`);
  if (check.titleHas && !title.includes(check.titleHas)) fail(`${check.path}: title misses “${check.titleHas}”`);
  if (check.titleMax && title.length > check.titleMax) fail(`${check.path}: title is ${title.length} chars (max ${check.titleMax})`);
  if (check.es) {
    if (response.headers.get("content-language") !== "es") fail(`${check.path}: missing Content-Language: es`);
    if (!/\blang=["']es["']/i.test(html)) fail(`${check.path}: missing server-rendered lang=es boundary`);
  }
  if (check.hreflang) {
    if (!/hreflang=["']en["']/i.test(html) || !/hreflang=["']es["']/i.test(html)) {
      fail(`${check.path}: missing reciprocal en/es hreflang links`);
    }
  }
  for (const needle of check.bodyHas || []) {
    if (!html.includes(needle)) fail(`${check.path}: missing expected content “${needle}”`);
  }
  for (const occurrence of check.bodyOccurrences || []) {
    const actual = html.split(occurrence.needle).length - 1;
    if (occurrence.exact !== undefined && actual !== occurrence.exact) {
      fail(`${check.path}: expected ${occurrence.exact} occurrences of “${occurrence.needle}”, received ${actual}`);
    }
    if (occurrence.min !== undefined && actual < occurrence.min) {
      fail(`${check.path}: expected at least ${occurrence.min} occurrences of “${occurrence.needle}”, received ${actual}`);
    }
  }
  return { path: check.path, title, robots: robots || "index (implicit)" };
}

async function checkRedirect() {
  if (routesManifest) {
    const redirect = routesManifest.redirects?.find((rule) => rule.source === "/article/:slug");
    if (!redirect) fail("legacy article redirect: missing from build manifest");
    if (![301, 308].includes(redirect.statusCode)) {
      fail(`legacy article redirect: received ${redirect.statusCode}`);
    }
    if (redirect.destination !== "/topics/:slug") {
      fail(`legacy article redirect: unexpected destination ${redirect.destination}`);
    }
    return;
  }

  const response = await fetch(`${baseUrl}/article/deep-philosophical-questions`, { redirect: "manual" });
  if (![301, 308].includes(response.status)) fail(`legacy article redirect: received ${response.status}`);
  const location = response.headers.get("location") || "";
  if (!location.endsWith("/topics/deep-philosophical-questions")) {
    fail(`legacy article redirect: unexpected destination ${location}`);
  }
}

async function checkSitemap() {
  const response = await getTextArtifact("/sitemap.xml", "sitemap.xml.body");
  if (!response.ok) fail(`sitemap: received ${response.status}`);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (new Set(urls).size !== urls.length) fail("sitemap: duplicate URLs detected");

  for (const path of [
    "/writing/philosophy",
    "/writing/psychology",
    "/speech/politics",
    "/debate/technology",
    "/conversation/philosophy",
  ]) {
    if (!urls.includes(`${canonicalOrigin}${path}`)) fail(`sitemap: missing ${path}`);
  }
  for (const path of ["/writing/sports", "/es/speech/politics", "/saved-topics", "/embed"]) {
    if (urls.includes(`${canonicalOrigin}${path}`)) fail(`sitemap: noindex URL included: ${path}`);
  }
  if (!xml.includes('hreflang="es"') || !xml.includes('hreflang="x-default"')) {
    fail("sitemap: missing language alternates");
  }
  return urls.length;
}

async function checkRobots() {
  const response = await getTextArtifact("/robots.txt", "robots.txt.body");
  if (!response.ok) fail(`robots.txt: received ${response.status}`);
  const text = await response.text();
  if (!text.includes("Sitemap: https://randomtopics.app/sitemap.xml")) {
    fail("robots.txt: sitemap declaration missing");
  }
}

try {
  const results = [];
  for (const check of checks) results.push(await checkPage(check));
  await checkRedirect();
  const sitemapUrls = await checkSitemap();
  await checkRobots();

  console.table(results);
  const source = buildDir ? `build artifacts in ${buildDir}` : baseUrl;
  console.log(`SEO audit passed against ${source}: ${results.length} pages, ${sitemapUrls} sitemap URLs, redirect and robots.txt.`);
} catch (error) {
  console.error(`SEO audit failed: ${error.message}`);
  process.exitCode = 1;
}
