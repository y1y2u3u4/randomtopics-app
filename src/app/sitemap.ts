import { MetadataRoute } from "next";
import { CATEGORIES, MODES } from "@/data/types";
import { SEO_ARTICLES } from "@/data/seoContent";
import { SEO_ARTICLES_ES } from "@/data/seoContent.es";
import {
  INDEXABLE_MODE_CATEGORY_PATHS,
  SITE_URL,
  localizePath,
  isEnOnly,
  spanishCounterpartPath,
} from "@/i18n/config";

// Bilingual sitemap: every route is emitted for both English (root) and Spanish
// (/es), and each entry carries hreflang alternates (en / es / x-default) so
// Google serves the right language version. hreflang via sitemap is officially
// supported, which keeps the English page files untouched.

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: string | Date;
  esLastModified?: string | Date;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/topics", changeFrequency: "weekly", priority: 0.8 },
    { path: "/categories", changeFrequency: "weekly", priority: 0.8 },
    { path: "/funny", changeFrequency: "weekly", priority: 0.8 },
    { path: "/press", changeFrequency: "monthly", priority: 0.4 },
    { path: "/stats", changeFrequency: "weekly", priority: 0.6 },
    { path: "/about", changeFrequency: "monthly", priority: 0.5 },
    { path: "/how-we-curate", changeFrequency: "monthly", priority: 0.5 },
    { path: "/pro-and-con-debate-topics", changeFrequency: "monthly", priority: 0.85 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
    { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.4 },
  ];

  // Standalone keyword tool pages
  for (const p of [
    "argument-generator",
    "table-topics-generator",
    "random-subject-generator",
    "random-learning-topic-generator",
    "writing-topic-generator",
    "research-topic-generator",
    "presentation-topic-generator",
    "essay-topic-generator",
    "impromptu-speech-topics",
    "debate/students",
    "debate/funny",
    "debate/middle-school",
    "debate/high-school",
    "debate/college",
    "debate/questions",
    "debate/motions",
    "speech/persuasive",
    "speech/informative",
    "charades",
    "journal-prompts",
    "hot-seat-questions",
    "group-discussion-topics",
    "question-of-the-day",
    "paranoia-questions",
    "question-generator",
    "would-you-rather",
    "never-have-i-ever",
    "spin-the-wheel",
    "truth-or-dare",
    "this-or-that",
    "most-likely-to",
    "two-truths-and-a-lie",
  ]) {
    entries.push({ path: `/${p}`, changeFrequency: "weekly", priority: 0.85 });
  }

  for (const mode of MODES) entries.push({ path: `/${mode.slug}`, changeFrequency: "weekly", priority: 0.9 });
  for (const cat of CATEGORIES) entries.push({ path: `/categories/${cat.id}`, changeFrequency: "weekly", priority: 0.7 });
  for (const path of INDEXABLE_MODE_CATEGORY_PATHS) {
    entries.push({ path, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const article of SEO_ARTICLES) {
    const spanishArticle = SEO_ARTICLES_ES.find((candidate) => candidate.slug === article.slug);
    entries.push({
      path: `/topics/${article.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: article.lastModified,
      esLastModified: spanishArticle?.lastModified,
    });
  }
  // Non-allowlisted mode×category pages stay noindexed and out of the sitemap.

  const abs = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

  const result: MetadataRoute.Sitemap = [];
  for (const e of entries) {
    const enUrl = abs(e.path);

    const customSpanishPath = spanishCounterpartPath(e.path);
    if (isEnOnly(e.path) && !customSpanishPath) {
      const languages = { en: enUrl, "x-default": enUrl };
      result.push({
        url: enUrl,
        ...(e.lastModified ? { lastModified: e.lastModified } : {}),
        changeFrequency: e.changeFrequency,
        priority: e.priority,
        alternates: { languages },
      });
      continue;
    }

    const esUrl = abs(customSpanishPath ?? localizePath(e.path, "es"));
    const languages = { en: enUrl, es: esUrl, "x-default": enUrl };
    // One entry per locale, each advertising both alternates.
    result.push({
      url: enUrl,
      ...(e.lastModified ? { lastModified: e.lastModified } : {}),
      changeFrequency: e.changeFrequency,
      priority: e.priority,
      alternates: { languages },
    });
    result.push({
      url: esUrl,
      ...(customSpanishPath
        ? { lastModified: "2026-08-31" }
        : e.esLastModified || e.lastModified
          ? { lastModified: e.esLastModified ?? e.lastModified }
          : {}),
      changeFrequency: e.changeFrequency,
      priority: Math.max(0.1, e.priority - 0.1),
      alternates: { languages },
    });
  }

  // These Spanish editorial clusters answer search demand that does not yet
  // have a true English equivalent. Do not invent reciprocal hreflang URLs.
  for (const path of [
    "/es/topics/quien-es-mas-probable-parejas",
    "/es/topics/quien-es-mas-probable-preguntas-fuertes",
    "/es/topics/quien-es-mas-probable-amigos",
  ]) {
    const url = abs(path);
    result.push({
      url,
      lastModified: "2026-08-31",
      changeFrequency: "monthly",
      priority: 0.82,
      alternates: { languages: { es: url, "x-default": url } },
    });
  }

  return result;
}
