import { NextResponse } from "next/server";
import { CATEGORIES, MODES } from "@/data/types";
import { SEO_ARTICLES } from "@/data/seoContent";

const INDEXNOW_KEY = "randomtopics2026";
const HOST = "randomtopics.app";

function getAllUrls(): string[] {
  const base = `https://${HOST}`;
  const urls: string[] = [
    base,
    `${base}/topics`,
    `${base}/categories`,
    `${base}/press`,
    `${base}/about`,
    `${base}/privacy`,
    `${base}/funny`,
  ];

  for (const mode of MODES) {
    urls.push(`${base}/${mode.slug}`);
  }
  for (const cat of CATEGORIES) {
    urls.push(`${base}/categories/${cat.id}`);
  }
  for (const article of SEO_ARTICLES) {
    urls.push(`${base}/topics/${article.slug}`);
  }

  return urls;
}

export async function POST() {
  const urls = getAllUrls();

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      urlList: urls,
    }),
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
