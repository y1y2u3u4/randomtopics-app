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
  PORTUGUESE_ALTERNATES,
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
    { path: "/yo-mama-randomizer", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-10-04" },
    { path: "/press", changeFrequency: "monthly", priority: 0.4 },
    { path: "/stats", changeFrequency: "weekly", priority: 0.6 },
    { path: "/about", changeFrequency: "monthly", priority: 0.5 },
    { path: "/how-we-curate", changeFrequency: "monthly", priority: 0.5 },
    { path: "/facts", changeFrequency: "monthly", priority: 0.6, lastModified: "2026-10-18" },
    { path: "/pro-and-con-debate-topics", changeFrequency: "monthly", priority: 0.85 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
    { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.4 },
  ];

  // Standalone keyword tool pages
  const premiumPaths = new Set([
    "question-of-the-day-for-students",
    "question-of-the-day-for-work",
    "topics/ethical-dilemmas-for-students",
    "topics/workplace-ethical-dilemmas",
    "topics/ethical-dilemmas-for-adults",
    "deep-conversation-question-generator",
    "5-minute-speech-topics",
    "funny-question-of-the-day",
  ]);
  const septemberPremiumPaths = new Set([
    "topics/ethical-dilemmas-for-adults",
    "deep-conversation-question-generator",
    "5-minute-speech-topics",
    "funny-question-of-the-day",
  ]);
  for (const p of [
    "argument-generator",
    "table-topics-generator",
    "random-subject-generator",
    "random-drawing-generator",
    "story-prompt-generator",
    "random-category-generator",
    "random-idea-generator",
    "topic-of-the-day",
    "philosophical-questions",
    "moral-dilemma-examples",
    "random-object-generator",
    "random-state-generator",
    "country-name-generator",
    "band-name-generator",
    "dragon-name-generator",
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
    "question-of-the-day-for-students",
    "question-of-the-day-for-work",
    "topics/ethical-dilemmas-for-students",
    "topics/workplace-ethical-dilemmas",
    "topics/ethical-dilemmas-for-adults",
    "deep-conversation-question-generator",
    "5-minute-speech-topics",
    "funny-question-of-the-day",
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
    entries.push({
      path: `/${p}`,
      changeFrequency: "weekly",
      priority: premiumPaths.has(p) ? 0.88 : 0.85,
      ...(premiumPaths.has(p)
        ? { lastModified: septemberPremiumPaths.has(p) ? "2026-09-01" : "2026-08-31" }
        : {}),
    });
  }

  // 2026-10-14 inner pages.
  for (const p of ["apa-citation-generator", "random-movie-generator", "wu-tang-name-generator"]) {
    entries.push({ path: `/${p}`, changeFrequency: "monthly", priority: 0.85, lastModified: "2026-10-14" });
  }

  // Trivia question bank + seasonal Halloween page (2026-10-14).
  for (const p of ["trivia-questions", "trivia-questions/halloween"]) {
    entries.push({ path: `/${p}`, changeFrequency: "weekly", priority: 0.88, lastModified: "2026-10-14" });
  }

  // Classroom packs landing page (2026-10-14; free tools strip 2026-10-16).
  entries.push({ path: "/classroom-packs", changeFrequency: "weekly", priority: 0.85, lastModified: "2026-10-16" });

  // Classroom pages, batches 1–3 (2026-10-16).
  for (const p of ["this-or-that/kids", "would-you-rather/kids", "topics/get-to-know-you-questions-for-students", "morning-meeting-questions", "riddles-for-kids", "classroom-timer", "random-group-generator"]) {
    entries.push({ path: `/${p}`, changeFrequency: "monthly", priority: 0.88, lastModified: "2026-10-16" });
  }

  // Fake name generator + address / identity / person variants (2026-10-19).
  for (const p of ["fake-name-generator", "fake-address-generator", "fake-identity-generator", "fake-person-generator"]) {
    entries.push({ path: `/${p}`, changeFrequency: "monthly", priority: p === "fake-name-generator" ? 0.9 : 0.88, lastModified: "2026-10-19" });
  }

  // Random ZIP code generator (2026-10-19).
  entries.push({ path: "/random-zip-code-generator", changeFrequency: "monthly", priority: 0.88, lastModified: "2026-10-19" });

  // Party games + random date generator (2026-10-19).
  for (const p of ["pictionary-word-generator", "pictionary-phrase-generator", "pictionary-words", "random-date-generator", "21-questions"]) {
    entries.push({ path: `/${p}`, changeFrequency: "monthly", priority: 0.88, lastModified: "2026-10-19" });
  }

  // This or that + impromptu speech inner pages (2026-10-19).
  for (const p of ["this-or-that/couples", "this-or-that/hard", "this-or-that/work", "impromptu-speech-topics/students", "impromptu-speech-topics/funny", "impromptu-speech-topics/1-minute"]) {
    entries.push({ path: `/${p}`, changeFrequency: "monthly", priority: 0.85, lastModified: "2026-10-19" });
  }

  // Random generator pages (2026-10-10 inner-page batch).
  for (const p of [
    "random-team-generator",
    "random-animal-generator",
    "last-name-generator",
    "dnd-name-generator",
    "viking-name-generator",
    "character-name-generator",
    "random-character-generator",
    "gnome-name-generator",
    "random-food-generator",
    "random-letter-generator",
    "random-word-generator",
    "japanese-name-generator",
    "random-color-generator",
    "fantasy-map-maker",
    "my-9-albums",
    "my-9-games",
    "my-9-anime",
    "my-9-movies",
    "my-9-books",
    "my-9-grid",
    "asa-citation-generator",
    "acs-citation-generator",
    "chicago-citation-generator",
    "random-name-picker",
    "number-randomizer",
    "ai-metadata-remover",
    "western-baby-name-generator",
  ]) {
    entries.push({ path: `/${p}`, changeFrequency: "monthly", priority: 0.85, lastModified: "2026-10-10" });
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
    const ptPath = PORTUGUESE_ALTERNATES[e.path];
    const languages: Record<string, string> = ptPath
      ? { en: enUrl, es: esUrl, pt: abs(ptPath), "x-default": enUrl }
      : { en: enUrl, es: esUrl, "x-default": enUrl };
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
        ? { lastModified: e.esLastModified ?? e.lastModified ?? "2026-08-31" }
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
  // Added 2026-10-19 for "quien es mas probable" phrasings with GSC
  // impressions but no page (incómodas, amigas, chistosas).
  for (const path of [
    "/es/topics/quien-es-mas-probable-preguntas-incomodas",
    "/es/topics/quien-es-mas-probable-amigas",
    "/es/topics/quien-es-mas-probable-preguntas-chistosas",
  ]) {
    const url = abs(path);
    result.push({
      url,
      lastModified: "2026-10-19",
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: { es: url, "x-default": url } },
    });
  }

  // Standalone Turkish pages (2026-10-19). Turkish is not a site locale, so
  // these advertise only themselves.
  for (const path of ["/tr", "/tr/rastgele-konu-carki", "/tr/rastgele-arastirma-konulari", "/tr/1-dakika-konusma-konulari"]) {
    const url = abs(path);
    result.push({
      url,
      lastModified: "2026-10-19",
      changeFrequency: "monthly",
      priority: path === "/tr" ? 0.85 : 0.8,
      alternates: { languages: { tr: url, "x-default": url } },
    });
  }

  // Standalone Portuguese pages (2026-10-21), each a counterpart of an EN page
  // and carrying the same en/es/pt alternates as its EN and ES siblings.
  for (const [enPath, ptPath] of Object.entries(PORTUGUESE_ALTERNATES)) {
    const enUrl = abs(enPath);
    result.push({
      url: abs(ptPath),
      lastModified: "2026-10-21",
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: { en: enUrl, es: abs(spanishCounterpartPath(enPath) ?? localizePath(enPath, "es")), pt: abs(ptPath), "x-default": enUrl } },
    });
  }

  return result;
}
