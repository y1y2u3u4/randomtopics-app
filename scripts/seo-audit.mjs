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
  { path: "/es", index: true, canonical: "/es", titleMax: 70, titleHas: "Generador de Temas Aleatorios", es: true, hreflang: true },
  { path: "/debate", index: true, canonical: "/debate", titleMax: 70, titleHas: "Debate Topic Generator", hreflang: true },
  { path: "/question-of-the-day", index: true, canonical: "/question-of-the-day", titleMax: 70, titleHas: "Question of the Day" },
  { path: "/question-of-the-day-for-students", index: true, canonical: "/question-of-the-day-for-students", titleMax: 60, titleHas: "Question of the Day for Students", enOnlyHreflang: true, bodyHas: ["180", "Today's Classroom Question", "Build a five-day plan", "Build weekly plan", "Save ☆", '"@type":"WebApplication"'], bodyNotHas: ['"@type":"FAQPage"'], bodyOccurrences: [{ needle: 'class="rounded-xl border border-white/10 p-4 sm:p-5"', exact: 180 }] },
  { path: "/question-of-the-day-for-work", index: true, canonical: "/question-of-the-day-for-work", titleMax: 60, titleHas: "Question of the Day for Work", enOnlyHreflang: true, bodyHas: ["120", "Today's Team Question", "Copy for Slack / Teams", "Build a five-day plan", "Save ☆", '"@type":"WebApplication"'], bodyNotHas: ['"@type":"FAQPage"'], bodyOccurrences: [{ needle: 'class="rounded-xl border border-white/10 p-4 sm:p-5"', exact: 120 }] },
  { path: "/icebreaker", index: true, canonical: "/icebreaker", titleMax: 70, titleHas: "Icebreaker Question Generator", hreflang: true },
  { path: "/writing", index: true, canonical: "/writing", titleMax: 76, titleHas: "Random Topics to Write About", hreflang: true },
  { path: "/conversation", index: true, canonical: "/conversation", titleMax: 65, titleHas: "Conversation Topic Generator", hreflang: true, bodyHas: ["Popular Conversation Starter Collections"], bodyOccurrences: [{ needle: 'href="/topics/', min: 6 }] },
  { path: "/random-subject-generator", index: true, canonical: "/random-subject-generator", titleMax: 65, titleHas: "Random Subject Generator", bodyHas: ["Get a Random Subject in One Click", "Pick a Random Subject", '"@type":"WebApplication"'] },
  { path: "/random-learning-topic-generator", index: true, canonical: "/random-learning-topic-generator", titleMax: 65, titleHas: "Random Learning Topic Generator", bodyHas: ["Give Me a Topic to Learn", "Example topics by category", "Daily curiosity", '"@type":"WebApplication"'] },
  { path: "/writing-topic-generator", index: true, canonical: "/writing-topic-generator", titleMax: 65, titleHas: "Writing Topic Generator", bodyHas: ["Generate Writing Topics", "Essay, Journal, Fiction, or Blog", "Example topics by category", '"@type":"WebApplication"'] },
  { path: "/research-topic-generator", index: true, canonical: "/research-topic-generator", titleMax: 65, titleHas: "Research Topic Generator", bodyHas: ["Generate Research Ideas", "Research papers", "Example topics by category", '"@type":"WebApplication"'] },
  { path: "/presentation-topic-generator", index: true, canonical: "/presentation-topic-generator", titleMax: 65, titleHas: "Presentation Topic Generator", bodyHas: ["Generate Presentation Ideas", "School presentations", "Example topics by category", '"@type":"WebApplication"'] },
  { path: "/es/generador-de-temas-para-exponer", index: true, canonical: "/es/generador-de-temas-para-exponer", titleMax: 65, titleHas: "Generador de Temas para Exponer", es: true, hreflang: true, bodyHas: ["Generar un tema para exponer", "Ejemplos de temas por categoría", "Exposición escolar", '"@type":"WebApplication"'] },
  { path: "/es/generador-de-temas-para-investigar", index: true, canonical: "/es/generador-de-temas-para-investigar", titleMax: 65, titleHas: "Generador de Temas para Investigar", es: true, hreflang: true, bodyHas: ["Generar un tema de investigación", "Ejemplos de temas por categoría", "Proyecto escolar", '"@type":"WebApplication"'] },
  { path: "/es/generador-de-temas-para-estudiar", index: true, canonical: "/es/generador-de-temas-para-estudiar", titleMax: 65, titleHas: "Generador de Temas para Estudiar", es: true, hreflang: true, bodyHas: ["Dame un tema para estudiar", "Ejemplos de temas por categoría", "Aprendizaje diario", '"@type":"WebApplication"'] },
  { path: "/speech", index: true, canonical: "/speech", titleMax: 60, titleHas: "Speech Topic Generator & Practice Timer", hreflang: true, bodyHas: ["random subject generator", "75 Presentation Topics for School"] },
  { path: "/group-discussion-topics", index: true, canonical: "/group-discussion-topics", titleMax: 60, titleHas: "100+ Group Discussion Topics for 2026", bodyHas: ["Situation-Based Questions", "Updated August 15, 2026"], bodyOccurrences: [{ needle: 'class="text-[var(--neon-cyan)] font-bold shrink-0"', exact: 103 }] },
  { path: "/topics/presentation-ideas-for-school", index: true, canonical: "/topics/presentation-ideas-for-school", titleMax: 60, titleHas: "75 Unique Presentation Topics for School", hreflang: true, bodyHas: ["Easy 5-Minute Presentation Topics", "Open the Presentation Topic Generator"], bodyOccurrences: [{ needle: 'class="flex items-start gap-3"', exact: 75 }] },
  { path: "/es/topics/controversial-topics-to-discuss", index: true, canonical: "/es/topics/controversial-topics-to-discuss", titleMax: 60, titleHas: "Temas Controversiales para Debatir", es: true, hreflang: true, bodyHas: ["temas controversiales", "Abrir el Generador de Debate"], bodyOccurrences: [{ needle: 'class="flex items-start gap-3"', exact: 55 }] },
  { path: "/es/topics/public-speaking-topics-for-beginners", index: true, canonical: "/es/topics/public-speaking-topics-for-beginners", titleMax: 70, titleHas: "Temas para Oratoria Fáciles", es: true, hreflang: true, bodyHas: ["Temas fáciles para una oratoria corta", "Practicar Oratoria con Temporizador"], bodyOccurrences: [{ needle: 'class="flex items-start gap-3"', exact: 45 }] },
  { path: "/es/topics/conversation-topics-for-teens", index: true, canonical: "/es/topics/conversation-topics-for-teens", titleMax: 65, titleHas: "Temas para Adolescentes", es: true, hreflang: true, bodyHas: ["Temas de debate para adolescentes", "Abrir el Generador de Conversación"], bodyOccurrences: [{ needle: 'class="flex items-start gap-3"', exact: 50 }] },
  { path: "/truth-or-dare", index: true, canonical: "/truth-or-dare", titleMax: 70, titleHas: "Truth or Dare Generator", bodyHas: ["Truths Only", "Dares Only", "More Party Game Generators"] },
  { path: "/would-you-rather", index: true, canonical: "/would-you-rather", titleMax: 65, titleHas: "Would You Rather Generator", bodyHas: ["More Party Game Generators"] },
  { path: "/paranoia-questions", index: true, canonical: "/paranoia-questions", titleMax: 70, titleHas: "Paranoia Questions Generator", bodyHas: ["More Party Game Generators"] },
  { path: "/this-or-that", index: true, canonical: "/this-or-that", titleMax: 65, titleHas: "This or That Generator", bodyHas: ["More Party Game Generators", "All 38 This or That Questions"] },
  { path: "/saved-topics", index: false, canonical: "/saved-topics", titleHas: "Saved Topics", headerNoindex: true },
  { path: "/es/saved-topics", index: false, canonical: "/es/saved-topics", titleHas: "Temas guardados", es: true, headerNoindex: true },
  { path: "/topics/ethical-dilemma-questions", index: true, canonical: "/topics/ethical-dilemma-questions", titleMax: 65, titleHas: "65+ Moral & Ethical Dilemma Questions", hreflang: true, bodyHas: ["Quick Moral Dilemmas to Discuss", "Try a Random Ethical Dilemma", "Give Me a Dilemma"], bodyOccurrences: [{ needle: 'class="flex items-start gap-3"', exact: 66 }] },
  { path: "/topics/ethical-dilemmas-for-students", index: true, canonical: "/topics/ethical-dilemmas-for-students", titleMax: 60, titleHas: "50 Ethical Dilemmas for Students", enOnlyHreflang: true, bodyHas: ["Choose a Classroom Ethical Dilemma", "A four-step classroom analysis routine", "How this collection was curated", '"featureList":["Audience filters","No-repeat random prompts","Copy","Save","Share","Print"]', '"@type":"WebApplication"'], bodyNotHas: ['"@type":"FAQPage"'], bodyOccurrences: [{ needle: 'class="rounded-xl border border-white/10 p-4 sm:p-5"', exact: 50 }] },
  { path: "/topics/workplace-ethical-dilemmas", index: true, canonical: "/topics/workplace-ethical-dilemmas", titleMax: 60, titleHas: "45 Workplace Ethical Dilemmas", enOnlyHreflang: true, bodyHas: ["Choose a Workplace Ethics Case", "A practical decision canvas for workplace cases", "For training and discussion only", '"featureList":["Audience filters","No-repeat random prompts","Copy","Save","Share","Print"]', '"@type":"WebApplication"'], bodyNotHas: ['"@type":"FAQPage"'], bodyOccurrences: [{ needle: 'class="rounded-xl border border-white/10 p-4 sm:p-5"', exact: 45 }] },
  { path: "/topics/toastmasters-table-topics", index: true, canonical: "/topics/toastmasters-table-topics", titleMax: 60, titleHas: "Toastmasters Table Topics", bodyHas: ["Updated:", "Practice a Random Table Topic", "Speech Timer", "Draw a Table Topic"] },
  { path: "/es/most-likely-to", index: true, canonical: "/es/most-likely-to", titleMax: 76, titleHas: "Quién Es Más Probable", es: true, hreflang: true },
  { path: "/es/topics/most-likely-to-questions", index: true, canonical: "/es/topics/most-likely-to-questions", titleMax: 65, titleHas: "100 Preguntas de Quién Es Más Probable", es: true, hreflang: true, bodyHas: ["Preguntas fuertes de Quién es más probable para amigos", "Juega a Quién Es Más Probable", "Sacar una pregunta"], bodyOccurrences: [{ needle: 'class="flex items-start gap-3"', exact: 100 }] },
  { path: "/es/spin-the-wheel", index: true, canonical: "/es/spin-the-wheel", titleMax: 65, titleHas: "Ruleta de Temas Aleatorios", es: true, hreflang: true, bodyHas: ["Ruleta de Temas Aleatorios", "más de 500 temas"] },
  { path: "/es/topics/quien-es-mas-probable-parejas", index: true, canonical: "/es/topics/quien-es-mas-probable-parejas", titleMax: 65, titleHas: "45 Preguntas de Quién Es Más Probable para Parejas", es: true, bodyHas: ["Preguntas románticas y de complicidad", "Abrir el generador de Quién es más probable"], bodyOccurrences: [{ needle: 'class="flex items-start gap-3"', exact: 45 }] },
  { path: "/es/topics/quien-es-mas-probable-preguntas-fuertes", index: true, canonical: "/es/topics/quien-es-mas-probable-preguntas-fuertes", titleMax: 65, titleHas: "45 Preguntas Fuertes de Quién Es Más Probable", es: true, bodyHas: ["Preguntas intensas sobre amistad y relaciones", "Abrir el generador de Quién es más probable"], bodyOccurrences: [{ needle: 'class="flex items-start gap-3"', exact: 45 }] },
  { path: "/es/topics/quien-es-mas-probable-amigos", index: true, canonical: "/es/topics/quien-es-mas-probable-amigos", titleMax: 65, titleHas: "45 Preguntas de Quién Es Más Probable para Amigos", es: true, bodyHas: ["Preguntas de aventuras y planes", "Abrir el generador de Quién es más probable"], bodyOccurrences: [{ needle: 'class="flex items-start gap-3"', exact: 45 }] },
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

function getConfiguredHeader(path, name) {
  const matchingRules = routesManifest?.headers?.filter(
    (candidate) => candidate.source === path || (candidate.source === "/es/:path*" && path.startsWith("/es")),
  ) || [];
  for (const rule of matchingRules) {
    const header = rule.headers?.find((candidate) => candidate.key.toLowerCase() === name.toLowerCase());
    if (header) return header.value;
  }
  return null;
}

async function getPage(path) {
  if (!buildDir) return fetch(`${baseUrl}${path}`, { redirect: "manual" });

  const html = await readFile(buildArtifactPath(path), "utf8");
  return {
    status: 200,
    ok: true,
    headers: {
      get(name) {
        if (name.toLowerCase() === "content-language" && path.startsWith("/es") && hasSpanishHeaderRule()) return "es";
        return getConfiguredHeader(path, name);
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
  if (check.headerNoindex && !(response.headers.get("x-robots-tag") || "").toLowerCase().includes("noindex")) {
    fail(`${check.path}: expected X-Robots-Tag noindex header`);
  }
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
  if (check.enOnlyHreflang) {
    if (!/hreflang=["']en["']/i.test(html) || !/hreflang=["']x-default["']/i.test(html)) {
      fail(`${check.path}: missing en/x-default hreflang links`);
    }
    if (/hreflang=["']es["']/i.test(html)) {
      fail(`${check.path}: advertises a nonexistent Spanish alternate`);
    }
  }
  for (const needle of check.bodyHas || []) {
    if (!html.includes(needle)) fail(`${check.path}: missing expected content “${needle}”`);
  }
  for (const needle of check.bodyNotHas || []) {
    if (html.includes(needle)) fail(`${check.path}: unexpectedly contains “${needle}”`);
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
    "/random-learning-topic-generator",
    "/writing-topic-generator",
    "/research-topic-generator",
    "/presentation-topic-generator",
    "/es/generador-de-temas-para-exponer",
    "/es/generador-de-temas-para-investigar",
    "/es/generador-de-temas-para-estudiar",
    "/es/topics/quien-es-mas-probable-parejas",
    "/es/topics/quien-es-mas-probable-preguntas-fuertes",
    "/es/topics/quien-es-mas-probable-amigos",
    "/question-of-the-day-for-students",
    "/question-of-the-day-for-work",
    "/topics/ethical-dilemmas-for-students",
    "/topics/workplace-ethical-dilemmas",
  ]) {
    if (!urls.includes(`${canonicalOrigin}${path}`)) fail(`sitemap: missing ${path}`);
  }
  for (const path of ["/writing/sports", "/es/speech/politics", "/saved-topics", "/embed", "/internal/analytics", "/es/random-learning-topic-generator", "/es/writing-topic-generator", "/es/research-topic-generator", "/es/presentation-topic-generator", "/es/question-of-the-day-for-students", "/es/question-of-the-day-for-work", "/es/topics/ethical-dilemmas-for-students", "/es/topics/workplace-ethical-dilemmas"]) {
    if (urls.includes(`${canonicalOrigin}${path}`)) fail(`sitemap: noindex URL included: ${path}`);
  }
  if (!xml.includes('hreflang="es"') || !xml.includes('hreflang="x-default"')) {
    fail("sitemap: missing language alternates");
  }
  for (const path of [
    "/topics/presentation-ideas-for-school",
    "/es/topics/public-speaking-topics-for-beginners",
    "/es/topics/conversation-topics-for-teens",
  ]) {
    const marker = `<loc>${canonicalOrigin}${path}</loc>`;
    const entryTail = xml.split(marker)[1]?.split("</url>")[0] || "";
    if (!entryTail.includes("<lastmod>2026-08-15")) fail(`sitemap: stale lastmod for ${path}`);
  }
  for (const path of [
    "/topics/ethical-dilemma-questions",
    "/topics/toastmasters-table-topics",
    "/es/topics/controversial-topics-to-discuss",
    "/es/topics/most-likely-to-questions",
    "/es/generador-de-temas-para-exponer",
    "/es/generador-de-temas-para-investigar",
    "/es/generador-de-temas-para-estudiar",
    "/es/topics/quien-es-mas-probable-parejas",
    "/es/topics/quien-es-mas-probable-preguntas-fuertes",
    "/es/topics/quien-es-mas-probable-amigos",
    "/question-of-the-day-for-students",
    "/question-of-the-day-for-work",
    "/topics/ethical-dilemmas-for-students",
    "/topics/workplace-ethical-dilemmas",
  ]) {
    const marker = `<loc>${canonicalOrigin}${path}</loc>`;
    const entryTail = xml.split(marker)[1]?.split("</url>")[0] || "";
    if (!entryTail.includes("<lastmod>2026-08-31")) fail(`sitemap: stale lastmod for ${path}`);
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
  for (const path of ["/internal/", "/api/internal/"]) {
    if (!text.includes(`Disallow: ${path}`)) {
      fail(`robots.txt: private reporting path is not disallowed: ${path}`);
    }
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
