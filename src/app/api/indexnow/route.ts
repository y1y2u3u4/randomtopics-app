import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";

const INDEXNOW_KEY = "randomtopics2026";
const HOST = "randomtopics.app";

// Every URL in src/app/sitemap.ts (English, Spanish and standalone locale
// pages), so IndexNow pings Bing/Yandex for exactly what the sitemap lists.
function getAllUrls(): string[] {
  return [...new Set(sitemap().map((entry) => entry.url))];
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
