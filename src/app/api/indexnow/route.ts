import { NextResponse } from "next/server";
import { CATEGORIES, MODES } from "@/data/types";
import { SEO_ARTICLES } from "@/data/seoContent";
import { EN_ONLY_PATHS } from "@/i18n/config";

const INDEXNOW_KEY = "randomtopics2026";
const HOST = "randomtopics.app";

// Root-relative paths, kept in parity with src/app/sitemap.ts. Each is pushed
// for both English (root) and Spanish (/es) so IndexNow pings Bing/Yandex for
// every indexable URL the moment we deploy.
function getPaths(): string[] {
  const paths: string[] = [
    "/",
    "/topics",
    "/categories",
    "/press",
    "/about",
    "/privacy",
    "/terms",
    "/stats",
    "/funny",
    "/topic-generator",
    "/argument-generator",
    "/table-topics-generator",
    "/random-subject-generator",
    "/essay-topic-generator",
    "/impromptu-speech-topics",
    "/debate/students",
    "/debate/funny",
    "/debate/middle-school",
    "/debate/high-school",
    "/debate/college",
    "/debate/questions",
    "/debate/motions",
    "/speech/persuasive",
    "/speech/informative",
    "/charades",
    "/journal-prompts",
    "/hot-seat-questions",
    "/group-discussion-topics",
    "/question-generator",
    "/would-you-rather",
    "/never-have-i-ever",
    "/spin-the-wheel",
    "/truth-or-dare",
    "/this-or-that",
    "/most-likely-to",
    "/two-truths-and-a-lie",
  ];
  for (const mode of MODES) paths.push(`/${mode.slug}`);
  for (const cat of CATEGORIES) paths.push(`/categories/${cat.id}`);
  for (const article of SEO_ARTICLES) paths.push(`/topics/${article.slug}`);
  for (const mode of MODES) for (const cat of CATEGORIES) paths.push(`/${mode.slug}/${cat.id}`);
  return paths;
}

function getAllUrls(): string[] {
  const base = `https://${HOST}`;
  const urls: string[] = [];
  for (const p of getPaths()) {
    urls.push(p === "/" ? base : `${base}${p}`);
    // English-only pages have no Spanish counterpart — never ping a dead /es URL.
    if (!EN_ONLY_PATHS.has(p)) {
      urls.push(p === "/" ? `${base}/es` : `${base}/es${p}`);
    }
  }
  return urls;
}

export async function POST() {
  const urls = getAllUrls();

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, urlList: urls }),
  });

  return NextResponse.json({
    status: res.status,
    submitted: urls.length,
    message: res.status === 202 ? "Accepted by IndexNow" : `Response: ${res.status}`,
  });
}

export async function GET() {
  return NextResponse.json({
    info: "POST to this endpoint to submit all URLs to IndexNow (Bing, Yandex, etc.)",
    urls: getAllUrls().length,
  });
}
