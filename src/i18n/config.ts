// i18n configuration. English is served at the root (no prefix) and stays the
// canonical/default locale; Spanish lives under the /es path prefix. This is an
// additive design — no existing English URL changes.

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
 * Root-relative paths that exist only in English (no /es mirror yet). Single
 * source of truth so the sitemap omits their es alternate and the locale
 * switcher hides the (nonexistent) Spanish toggle instead of 404-ing.
 */
export const EN_ONLY_PATHS: ReadonlySet<string> = new Set([
  "/random-subject-generator",
  "/essay-topic-generator",
  "/debate/questions",
  "/debate/motions",
  "/speech/persuasive",
  "/speech/informative",
  "/charades",
  "/journal-prompts",
  "/hot-seat-questions",
  "/group-discussion-topics",
]);

/** True when a root-relative path has no Spanish counterpart. */
export function isEnOnly(rootPath: string): boolean {
  return EN_ONLY_PATHS.has(rootPath);
}

/**
 * Build the alternates.languages map for a given root-relative path so every
 * page emits correct hreflang (en, es, x-default) links.
 */
export function hreflangAlternates(path: string): Record<string, string> {
  const en = `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;
  const es = `${SITE_URL}${localizePath(path, "es")}`;
  return {
    en: en || SITE_URL,
    es,
    "x-default": en || SITE_URL,
  };
}
