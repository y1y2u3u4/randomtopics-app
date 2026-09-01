// i18n configuration. English is served at the root (no prefix) and stays the
// canonical/default locale; Spanish lives under the /es path prefix. This is an
// additive design — no existing English URL changes.

import { CATEGORIES, MODES } from "@/data/types";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Derive the active locale from a pathname (e.g. "/es/debate" -> "es"). */
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split("/")[1];
  return isLocale(seg) ? seg : defaultLocale;
}

/** Path prefix for a locale ("" for English/root, "/es" for Spanish). */
export function localeBase(locale: Locale): string {
  return locale === defaultLocale ? "" : `/${locale}`;
}

/**
 * Prefix an app-relative path with the locale base.
 * localizePath("/debate", "es") -> "/es/debate"; ("/debate", "en") -> "/debate".
 */
export function localizePath(path: string, locale: Locale): string {
  const base = localeBase(locale);
  if (path === "/") return base || "/";
  return `${base}${path}`;
}

/** Strip a leading locale segment, returning the root-relative English path. */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (isLocale(seg) && seg !== defaultLocale) {
    const rest = pathname.slice(`/${seg}`.length);
    return rest === "" ? "/" : rest;
  }
  return pathname;
}

export const SITE_URL = "https://randomtopics.app";

/**
 * Search-led Spanish pages whose URL intentionally follows natural Spanish
 * wording instead of mirroring the English slug.
 */
export const CUSTOM_SPANISH_ALTERNATES: Readonly<Record<string, string>> = {
  "/presentation-topic-generator": "/es/generador-de-temas-para-exponer",
  "/research-topic-generator": "/es/generador-de-temas-para-investigar",
  "/random-learning-topic-generator": "/es/generador-de-temas-para-estudiar",
};

export function spanishCounterpartPath(englishPath: string): string | null {
  return CUSTOM_SPANISH_ALTERNATES[englishPath] ?? null;
}

/**
 * Mode/category pages that have demonstrated search demand in GSC and contain
 * enough differentiated copy + real examples to remain standalone landing
 * pages. Keep this deliberately small: new entries should only be added after
 * they earn clicks or sustained impressions, rather than publishing all 80
 * permutations by default.
 *
 * Evidence window: 2026-07-16 through 2026-08-12.
 */
export const INDEXABLE_MODE_CATEGORY_PATHS = [
  "/writing/philosophy",
  "/writing/psychology",
  "/speech/politics",
  "/debate/technology",
  "/conversation/philosophy",
] as const;

const INDEXABLE_MODE_CATEGORY_SET: ReadonlySet<string> = new Set(
  INDEXABLE_MODE_CATEGORY_PATHS,
);

/**
 * Root-relative paths that exist only in English (no /es mirror yet). Single
 * source of truth so the sitemap omits their es alternate and the locale
 * switcher hides the (nonexistent) Spanish toggle instead of 404-ing.
 */
export const EN_ONLY_PATHS: ReadonlySet<string> = new Set([
  "/how-we-curate",
  "/random-subject-generator",
  "/random-learning-topic-generator",
  "/writing-topic-generator",
  "/research-topic-generator",
  "/presentation-topic-generator",
  "/pro-and-con-debate-topics",
  "/essay-topic-generator",
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
  "/paranoia-questions",
  "/topics/ethical-dilemmas-for-students",
  "/topics/workplace-ethical-dilemmas",
  "/topics/ethical-dilemmas-for-adults",
  "/deep-conversation-question-generator",
]);

/** Spanish-only editorial pages with no honest one-to-one English alternate. */
export const ES_ONLY_PATHS: ReadonlySet<string> = new Set([
  "/topics/quien-es-mas-probable-parejas",
  "/topics/quien-es-mas-probable-preguntas-fuertes",
  "/topics/quien-es-mas-probable-amigos",
]);

export function isEsOnly(rootPath: string): boolean {
  return ES_ONLY_PATHS.has(rootPath);
}

/** Resolve a real locale counterpart, including non-mirrored Spanish slugs. */
export function localeCounterpartPath(pathname: string, target: Locale): string | null {
  const rootPath = stripLocale(pathname);

  if (target === "es") {
    const custom = spanishCounterpartPath(rootPath);
    if (custom) return custom;
    if (isEnOnly(rootPath)) return null;
    return localizePath(rootPath, "es");
  }

  const spanishPath = pathname.startsWith("/es") ? pathname : localizePath(rootPath, "es");
  const customEnglish = Object.entries(CUSTOM_SPANISH_ALTERNATES).find(([, value]) => value === spanishPath)?.[0];
  if (customEnglish) return customEnglish;
  if (isEsOnly(rootPath)) return null;
  return rootPath;
}

const MODE_SLUGS: ReadonlySet<string> = new Set(MODES.map((m) => m.slug));
const CATEGORY_IDS: ReadonlySet<string> = new Set(CATEGORIES.map((c) => c.id));

/**
 * True for a mode×category combo path such as "/debate/technology". These are
 * templated permutations — 5 modes × 16 categories = 80 per locale.
 */
export function isModeCategoryPath(rootPath: string): boolean {
  const seg = rootPath.split("/");
  return seg.length === 3 && MODE_SLUGS.has(seg[1]) && CATEGORY_IDS.has(seg[2]);
}

export function isIndexableModeCategoryPath(rootPath: string): boolean {
  return INDEXABLE_MODE_CATEGORY_SET.has(rootPath);
}

/**
 * True when a root-relative path has no *indexable* Spanish counterpart.
 *
 * Combo paths are English-only by this rule even though /es/<mode>/<category>
 * still renders. Only the small, GSC-backed English allowlist is indexable;
 * excluding the Spanish permutations keeps crawl focus on the /es hubs and
 * topic articles that already demonstrate demand.
 */
export function isEnOnly(rootPath: string): boolean {
  return EN_ONLY_PATHS.has(rootPath) || rootPath.startsWith("/share") || isModeCategoryPath(rootPath);
}

/**
 * Build the alternates.languages map for a given root-relative path so every
 * page emits correct hreflang (en, es, x-default) links.
 */
export function hreflangAlternates(path: string): Record<string, string> {
  const en = `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;
  const customSpanishPath = spanishCounterpartPath(path);
  if (customSpanishPath) {
    return {
      en: en || SITE_URL,
      es: `${SITE_URL}${customSpanishPath}`,
      "x-default": en || SITE_URL,
    };
  }
  if (isEnOnly(path)) {
    return {
      en: en || SITE_URL,
      "x-default": en || SITE_URL,
    };
  }
  const esPath = localizePath(path, "es");
  const es = `${SITE_URL}${esPath}`;
  return {
    en: en || SITE_URL,
    es,
    "x-default": en || SITE_URL,
  };
}
