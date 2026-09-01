import { NextResponse } from "next/server";
import { CATEGORIES, MODES } from "@/data/types";
import { SEO_ARTICLES } from "@/data/seoContent";
import { INDEXABLE_MODE_CATEGORY_PATHS, isEnOnly, spanishCounterpartPath } from "@/i18n/config";

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
    "/how-we-curate",
    "/pro-and-con-debate-topics",
    "/contact",
    "/privacy",
    "/terms",
    "/stats",
    "/funny",
    "/argument-generator",
    "/table-topics-generator",
    "/random-subject-generator",
    "/random-learning-topic-generator",
    "/writing-topic-generator",
    "/research-topic-generator",
    "/presentation-topic-generator",
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
    "/question-of-the-day",
    "/question-of-the-day-for-students",
    "/question-of-the-day-for-work",
    "/topics/ethical-dilemmas-for-students",
    "/topics/workplace-ethical-dilemmas",
    "/topics/ethical-dilemmas-for-adults",
    "/deep-conversation-question-generator",
    "/paranoia-questions",
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
  paths.push(...INDEXABLE_MODE_CATEGORY_PATHS);
  for (const article of SEO_ARTICLES) paths.push(`/topics/${article.slug}`);
  return paths;
}

function getAllUrls(): string[] {
  const base = `https://${HOST}`;
  const urls: string[] = [];
  for (const p of getPaths()) {
    urls.push(p === "/" ? base : `${base}${p}`);
    // Never ping a /es URL that is missing or noindexed (see isEnOnly).
    const customSpanishPath = spanishCounterpartPath(p);
    if (customSpanishPath) {
      urls.push(`${base}${customSpanishPath}`);
    } else if (!isEnOnly(p)) {
      urls.push(p === "/" ? `${base}/es` : `${base}/es${p}`);
    }
  }
  for (const path of [
    "/es/topics/quien-es-mas-probable-parejas",
    "/es/topics/quien-es-mas-probable-preguntas-fuertes",
    "/es/topics/quien-es-mas-probable-amigos",
  ]) {
    urls.push(`${base}${path}`);
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
    message: res.ok ? "Accepted by IndexNow" : `Response: ${res.status}`,
  });
}

export async function GET() {
  return NextResponse.json({
    info: "POST to this endpoint to submit all URLs to IndexNow (Bing, Yandex, etc.)",
    urls: getAllUrls().length,
  });
}
