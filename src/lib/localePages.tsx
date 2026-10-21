import type { Metadata } from "next";
import LocaleToolPage, { type LocalePageCopy } from "@/components/LocaleToolPage";
import { ES_PAGES } from "@/data/localePages/es";
import { PT_PAGES } from "@/data/localePages/pt";
import type { LocalePageConfig } from "@/data/localePages/types";
import { PT_SIBLINGS, ptCopy } from "@/data/ptPageCopy";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

// Data-driven standalone es/pt landing pages (2026-10-21 batch). Each page
// file is a two-liner that looks its config up by path.

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
const PT_ALL_SIBLINGS = [...PT_SIBLINGS, ...PT_PAGES.map((p) => ({ href: p.path, ...p.sibling }))];

export function getLocalePage(path: string): LocalePageConfig {
  const page = [...ES_PAGES, ...PT_PAGES].find((p) => p.path === path);
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
  const isEs = path.startsWith("/es/");
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path, languages: hreflangAlternates(page.enPath) },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "Random Topics",
      locale: isEs ? "es_ES" : "pt_BR",
      ...(isEs ? { images: ["/es/opengraph-image"] } : {}),
      type: "website",
    },
  };
}

export function LocaleConfigPage({ path }: { path: string }) {
  const page = getLocalePage(path);
  const isEs = path.startsWith("/es/");
  return (
    <LocaleToolPage
      path={path}
      groups={page.groups}
      mode={page.mode}
      englishHref={page.enPath}
      title={page.title}
      lead={fill(page.lead, page)}
      buttonLabel={page.buttonLabel}
      copy={isEs ? esCopy(page.englishLabel, page.buttonLabel) : ptCopy(page.englishLabel, page.buttonLabel)}
      siblings={isEs ? ES_SIBLINGS : PT_ALL_SIBLINGS}
      howTo={page.howTo}
      faq={page.faq}
      showLocaleSwitcher={isEs}
    />
  );
}
