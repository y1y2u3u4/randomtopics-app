import type { Metadata } from "next";
import LocaleToolPage, { type LocalePageCopy } from "@/components/LocaleToolPage";
import { ES_PAGES } from "@/data/localePages/es";
import { PT_PAGES } from "@/data/localePages/pt";
import { PT_BATCH1 } from "@/data/localePages/pt.batch1";
import { FR_BATCH1 } from "@/data/localePages/fr.batch1";
import { TR_BATCH1 } from "@/data/localePages/tr.batch1";
import type { LocalePageConfig } from "@/data/localePages/types";
import { PT_SIBLINGS, ptCopy } from "@/data/ptPageCopy";
import { FR_SIBLINGS, frCopy } from "@/data/frPageCopy";
import { trCopy } from "@/data/trPageCopy";
import { TR_PAGES as TR_HUBS } from "@/components/TurkishToolPage";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

// Data-driven standalone es/pt/fr/tr landing pages (2026-10-21 batch, extended
// 2026-10-28 with pt/fr/tr batch 1). Each page file is a two-liner (or the
// [slug] route of /pt, /fr, /tr) that looks its config up by path.

function esCopy(englishLabel: string, buttonLabel: string): LocalePageCopy {
  return {
    lang: "es",
    currency: "USD",
    homeHref: "/es",
    homeLabel: "Inicio",
    meta: "Gratis · sin registro · {n} opciones · actualizado en octubre de 2026",
    siblingsHeading: "Más generadores en español",
    howToHeading: "Cómo usarlo",
    listHeading: "Lista completa",
    faqHeading: "Preguntas frecuentes",
    englishNote: "Versión en inglés:",
    englishLabel,
    ui: {
      chooseCategory: "Elegir categoría",
      all: "Todas",
      spinning: "Girando…",
      prompt: "Pulsa el botón para sacar una.",
      timeUp: "¡Se acabó el tiempo!",
      spin: "Girar la ruleta",
      startTimer: "Empezar 1 minuto",
      restartTimer: "Reiniciar tiempo",
      copied: "Copiado ✓",
      copy: "Copiar",
      topicsWord: "opciones",
      shownWord: "vistas",
      noRepeat: "sin repetir hasta terminar",
      defaultButton: buttonLabel,
    },
  };
}

const ES_EXISTING_SIBLINGS = [
  { href: "/es/generador-de-temas-para-exponer", label: "Temas para exponer", detail: "Ideas para exposiciones en clase" },
  { href: "/es/generador-de-palabras-aleatorias", label: "Palabras aleatorias", detail: "Sustantivos, verbos y adjetivos" },
];

const ES_SIBLINGS = [...ES_PAGES.map((p) => ({ href: p.path, ...p.sibling })), ...ES_EXISTING_SIBLINGS];

function uniqueByHref<T extends { href: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(i.href) ? false : (seen.add(i.href), true)));
}

export type PageLocale = "es" | "pt" | "fr" | "tr";

const PAGES: Record<PageLocale, LocalePageConfig[]> = {
  es: ES_PAGES,
  pt: [...PT_PAGES, ...PT_BATCH1],
  fr: FR_BATCH1,
  tr: TR_BATCH1,
};

const HUBS: Record<Exclude<PageLocale, "es">, { href: string; label: string; detail: string }[]> = {
  pt: PT_SIBLINGS,
  fr: FR_SIBLINGS,
  tr: TR_HUBS,
};

// The most-used page of each language, shown as quick chips under the tool.
const TRY_NEXT_CORE: Record<Exclude<PageLocale, "es">, { href: string; label: string; emoji: string }[]> = {
  pt: [
    { href: "/pt/pergunta-do-dia", label: "Pergunta do dia", emoji: "📅" },
    { href: "/pt/roleta-de-temas", label: "Roleta de temas", emoji: "🎡" },
    { href: "/pt/voce-prefere", label: "Você prefere?", emoji: "🤔" },
    { href: "/pt/temas-para-conversar", label: "Assuntos para conversar", emoji: "💬" },
  ],
  fr: [
    { href: "/fr/question-du-jour", label: "Question du jour", emoji: "📅" },
    { href: "/fr/roue-des-sujets", label: "Roue des sujets", emoji: "🎡" },
    { href: "/fr/tu-preferes", label: "Tu préfères", emoji: "🤔" },
    { href: "/fr/sujets-de-discussion", label: "Sujets de discussion", emoji: "💬" },
  ],
  tr: [
    { href: "/tr/gunun-sorusu", label: "Günün Sorusu", emoji: "📅" },
    { href: "/tr/rastgele-konu-carki", label: "Rastgele Konu Çarkı", emoji: "🎡" },
    { href: "/tr/hangisini-tercih-edersin", label: "Hangisini Tercih Edersin?", emoji: "🤔" },
    { href: "/tr/sohbet-konulari", label: "Sohbet Konuları", emoji: "💬" },
  ],
};

export function localeOfPath(path: string): PageLocale {
  const seg = path.split("/")[1];
  if (seg === "pt" || seg === "fr" || seg === "tr" || seg === "es") return seg;
  throw new Error(`Not a page locale path: ${path}`);
}

/** Config pages of a locale in display order. */
export function localePageList(locale: PageLocale): LocalePageConfig[] {
  return PAGES[locale];
}

/** Hub cards + every config page: used on each locale's home so no page is orphaned. */
export function allLocaleSiblings(locale: Exclude<PageLocale, "es">) {
  return uniqueByHref([...HUBS[locale], ...PAGES[locale].map((p) => ({ href: p.path, ...p.sibling }))]);
}

// Hubs plus the next six pages in the list (wrapping), so every page gets
// inbound links from siblings without a 30-card wall on each page.
function siblingsFor(locale: Exclude<PageLocale, "es">, path: string) {
  const list = PAGES[locale];
  const at = list.findIndex((p) => p.path === path);
  const near = Array.from({ length: Math.min(6, list.length - 1) }, (_, i) => list[(at + 1 + i) % list.length]);
  return uniqueByHref([...HUBS[locale], ...near.map((p) => ({ href: p.path, ...p.sibling }))]);
}

function tryNextFor(locale: Exclude<PageLocale, "es">, path: string) {
  const list = PAGES[locale];
  const tools = TRY_NEXT_CORE[locale].filter((t) => t.href !== path).slice(0, 3);
  const at = list.findIndex((p) => p.path === path);
  for (let i = 1; i < list.length && tools.length < 4; i++) {
    const p = list[(at + i) % list.length];
    if (!tools.some((t) => t.href === p.path)) tools.push({ href: p.path, label: p.sibling.label, emoji: p.sibling.emoji ?? "🎲" });
  }
  return tools;
}

export function getLocalePage(path: string): LocalePageConfig {
  const page = Object.values(PAGES).flat().find((p) => p.path === path);
  if (!page) throw new Error(`No locale page config for ${path}`);
  return page;
}

function fill(text: string, page: LocalePageConfig): string {
  const total = page.groups.reduce((n, g) => n + g.topics.length, 0);
  return text.replaceAll("{n}", String(total));
}

export function localePageMetadata(path: string): Metadata {
  const page = getLocalePage(path);
  const title = fill(page.metaTitle, page);
  const description = fill(page.description, page);
  const locale = localeOfPath(path);
  const isEs = locale === "es";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path, languages: hreflangAlternates(page.enPath) },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "Random Topics",
      locale: { es: "es_ES", pt: "pt_BR", fr: "fr_FR", tr: "tr_TR" }[locale],
      ...(isEs ? { images: ["/es/opengraph-image"] } : {}),
      type: "website",
    },
  };
}

export function LocaleConfigPage({ path }: { path: string }) {
  const page = getLocalePage(path);
  const locale = localeOfPath(path);
  const copy =
    locale === "es" ? esCopy(page.englishLabel, page.buttonLabel)
    : locale === "pt" ? ptCopy(page.englishLabel, page.buttonLabel)
    : locale === "fr" ? frCopy(page.englishLabel, page.buttonLabel)
    : trCopy(page.englishLabel, page.buttonLabel);
  return (
    <LocaleToolPage
      path={path}
      groups={page.groups}
      mode={page.mode}
      englishHref={page.enPath}
      title={page.title}
      lead={fill(page.lead, page)}
      buttonLabel={page.buttonLabel}
      copy={copy}
      siblings={locale === "es" ? ES_SIBLINGS : siblingsFor(locale, path)}
      howTo={page.howTo}
      faq={page.faq}
      showLocaleSwitcher={locale === "es"}
      tryNext={locale === "es" ? undefined : tryNextFor(locale, path)}
    />
  );
}

/** Slugs served by the /pt, /fr and /tr [slug] routes (batch 1, 2026-10-28). */
export function batch1Slugs(locale: Exclude<PageLocale, "es">): string[] {
  const list = { pt: PT_BATCH1, fr: FR_BATCH1, tr: TR_BATCH1 }[locale];
  return list.map((p) => p.path.split("/")[2]);
}
