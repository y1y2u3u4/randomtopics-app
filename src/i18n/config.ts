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
  "/couples-daily-question": "/es/pregunta-diaria-pareja",
  "/random-team-generator": "/es/generador-de-equipos-aleatorios",
  "/random-animal-generator": "/es/generador-de-animales-aleatorios",
  "/last-name-generator": "/es/generador-de-apellidos",
  "/random-word-generator": "/es/generador-de-palabras-aleatorias",
  // 2026-10-21 batch (src/data/localePages/es.ts)
  "/philosophical-questions": "/es/preguntas-filosoficas",
  "/moral-dilemma-examples": "/es/dilemas-morales",
  "/essay-topic-generator": "/es/temas-para-ensayos",
  "/trivia-questions": "/es/preguntas-de-cultura-general",
  "/deep-conversation-question-generator": "/es/preguntas-profundas",
  "/random-drawing-generator": "/es/ideas-para-dibujar",
  "/riddles-for-kids": "/es/adivinanzas-para-ninos",
  "/journal-prompts": "/es/preguntas-para-diario",
  "/facts": "/es/datos-curiosos",
  "/paranoia-questions": "/es/preguntas-de-paranoia",
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
  "/classroom-packs",
  "/classroom/present",
  "/topics/get-to-know-you-questions-for-students",
  "/topics/book-club-questions",
  "/morning-meeting-questions",
  "/riddles-for-kids",
  "/classroom-timer",
  "/random-group-generator",
  "/account",
  "/yo-mama-randomizer",
  "/how-we-curate",
  "/random-drawing-generator",
  "/story-prompt-generator",
  "/random-category-generator",
  "/random-idea-generator",
  "/topic-of-the-day",
  "/philosophical-questions",
  "/moral-dilemma-examples",
  "/facts",
  "/random-object-generator",
  "/random-state-generator",
  "/country-name-generator",
  "/band-name-generator",
  "/dragon-name-generator",
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
  "/journal-prompts",
  "/group-discussion-topics",
  "/question-of-the-day-for-students",
  "/question-of-the-day-for-work",
  "/paranoia-questions",
  "/trivia-questions",
  "/trivia-questions/halloween",
  "/trivia-questions/christmas",
  "/charades/christmas",
  "/topics/ethical-dilemmas-for-students",
  "/topics/workplace-ethical-dilemmas",
  "/topics/ethical-dilemmas-for-adults",
  "/deep-conversation-question-generator",
  "/5-minute-speech-topics",
  "/funny-question-of-the-day",
  "/dnd-name-generator",
  "/viking-name-generator",
  "/character-name-generator",
  "/fake-name-generator",
  "/fake-address-generator",
  "/fake-identity-generator",
  "/fake-person-generator",
  "/random-zip-code-generator",
  "/pictionary-word-generator",
  "/pictionary-phrase-generator",
  "/pictionary-words",
  "/random-date-generator",
  "/21-questions",
  "/random-character-generator",
  "/gnome-name-generator",
  "/warrior-cat-name-generator",
  "/elf-name-generator",
  "/vampire-name-generator",
  "/pirate-name-generator",
  "/incorrect-quote-generator",
  "/headcanon-generator",
  "/put-a-finger-down",
  "/random-food-generator",
  "/random-letter-generator",
  "/japanese-name-generator",
  "/random-color-generator",
  "/fantasy-map-maker",
  "/my-9-albums",
  "/my-9-games",
  "/my-9-anime",
  "/my-9-movies",
  "/my-9-books",
  "/my-9-grid",
  "/apa-citation-generator",
  "/random-movie-generator",
  "/wu-tang-name-generator",
  "/asa-citation-generator",
  "/acs-citation-generator",
  "/chicago-citation-generator",
  "/random-name-picker",
  "/decision-maker",
  "/teacher-warm-ups",
  "/slack-icebreaker-bot",
  "/discord-qotd-bot",
  "/writing-journal",
  "/number-randomizer",
  "/ai-metadata-remover",
  "/western-baby-name-generator",
  "/this-or-that/couples",
  "/this-or-that/hard",
  "/this-or-that/work",
  "/impromptu-speech-topics/students",
  "/impromptu-speech-topics/funny",
  "/impromptu-speech-topics/1-minute",
  "/fancy-text-generator",
  "/cursed-text-generator",
  "/glitch-text-generator",
  "/weird-text-generator",
  "/creepy-text-generator",
  "/scary-text-generator",
  "/strikethrough-text-generator",
  "/subscript-generator",
  "/username-generator",
  "/city-name-generator",
]);

/** Spanish-only editorial pages with no honest one-to-one English alternate. */
export const ES_ONLY_PATHS: ReadonlySet<string> = new Set([
  "/topics/quien-es-mas-probable-parejas",
  "/topics/quien-es-mas-probable-preguntas-fuertes",
  "/topics/quien-es-mas-probable-amigos",
  "/topics/quien-es-mas-probable-preguntas-incomodas",
  "/topics/quien-es-mas-probable-amigas",
  "/topics/quien-es-mas-probable-preguntas-chistosas",
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
  return withPortuguese(path, hreflangAlternatesEnEs(path));
}

/**
 * Standalone Portuguese (pt-BR) pages, 2026-10-21. Portuguese is not a site
 * locale (no dictionaries); only these EN pages have a pt counterpart, and
 * every member of the set (en, es, pt) lists all of them.
 */
export const PORTUGUESE_ALTERNATES: Readonly<Record<string, string>> = {
  "/conversation": "/pt/temas-para-conversar",
  "/debate": "/pt/temas-para-debate",
  "/speech": "/pt/temas-para-apresentacao",
  "/question-of-the-day": "/pt/pergunta-do-dia",
  "/random-subject-generator": "/pt/gerador-de-materias-aleatorias",
  // 2026-10-21 batch (src/data/localePages/pt.ts)
  "/philosophical-questions": "/pt/perguntas-filosoficas",
  "/deep-conversation-question-generator": "/pt/perguntas-profundas",
  "/trivia-questions": "/pt/perguntas-de-conhecimentos-gerais",
  "/riddles-for-kids": "/pt/charadas-para-criancas",
  "/random-drawing-generator": "/pt/ideias-para-desenhar",
  "/random-word-generator": "/pt/gerador-de-palavras-aleatorias",
  "/writing": "/pt/temas-para-redacao",
  "/research-topic-generator": "/pt/temas-para-pesquisa",
  "/this-or-that": "/pt/isso-ou-aquilo",
  "/icebreaker": "/pt/perguntas-para-quebrar-o-gelo",
  "/random-animal-generator": "/pt/gerador-de-animais-aleatorios",
};

function withPortuguese(path: string, languages: Record<string, string>): Record<string, string> {
  const ptPath = PORTUGUESE_ALTERNATES[path];
  if (!ptPath) return languages;
  const { "x-default": xDefault, ...rest } = languages;
  return { ...rest, pt: `${SITE_URL}${ptPath}`, "x-default": xDefault };
}

function hreflangAlternatesEnEs(path: string): Record<string, string> {
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
