import data from "@/data/generators/lastNames.json";
import { listGenerator } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

export interface LastName {
  name: string;
  origin: string;
  meaning: { en: string; es: string };
}

export const LAST_NAMES = data as LastName[];

export const ORIGIN_LABELS: Record<string, { en: string; es: string; flag: string }> = {
  english: { en: "English", es: "Inglés", flag: "🇬🇧" },
  irish: { en: "Irish", es: "Irlandés", flag: "🇮🇪" },
  scottish: { en: "Scottish", es: "Escocés", flag: "🏴" },
  welsh: { en: "Welsh", es: "Galés", flag: "🏴" },
  italian: { en: "Italian", es: "Italiano", flag: "🇮🇹" },
  spanish: { en: "Spanish", es: "Español", flag: "🇪🇸" },
  portuguese: { en: "Portuguese", es: "Portugués", flag: "🇵🇹" },
  french: { en: "French", es: "Francés", flag: "🇫🇷" },
  german: { en: "German", es: "Alemán", flag: "🇩🇪" },
  dutch: { en: "Dutch", es: "Neerlandés", flag: "🇳🇱" },
  scandinavian: { en: "Scandinavian", es: "Escandinavo", flag: "🇸🇪" },
  polish: { en: "Polish", es: "Polaco", flag: "🇵🇱" },
  russian: { en: "Russian", es: "Ruso", flag: "🇷🇺" },
  greek: { en: "Greek", es: "Griego", flag: "🇬🇷" },
  jewish: { en: "Jewish", es: "Judío", flag: "✡️" },
  arabic: { en: "Arabic", es: "Árabe", flag: "🌙" },
  indian: { en: "Indian", es: "Indio", flag: "🇮🇳" },
  chinese: { en: "Chinese", es: "Chino", flag: "🇨🇳" },
  japanese: { en: "Japanese", es: "Japonés", flag: "🇯🇵" },
  korean: { en: "Korean", es: "Coreano", flag: "🇰🇷" },
  vietnamese: { en: "Vietnamese", es: "Vietnamita", flag: "🇻🇳" },
  filipino: { en: "Filipino", es: "Filipino", flag: "🇵🇭" },
};

export function lastNameFilters(locale: "en" | "es"): FilterGroup[] {
  return [
    {
      id: "origin",
      label: locale === "es" ? "Origen" : "Origin",
      multi: true,
      options: Object.entries(ORIGIN_LABELS).map(([value, l]) => ({ value, label: `${l.flag} ${l[locale]}` })),
    },
  ];
}

export function lastNameGenerator(locale: "en" | "es") {
  return listGenerator<LastName>({
    items: LAST_NAMES,
    key: (n) => n.name,
    facets: { origin: (n) => [n.origin] },
    toResult: (n) => ({
      key: n.name,
      title: n.name,
      subtitle: `${ORIGIN_LABELS[n.origin]?.flag ?? ""} ${ORIGIN_LABELS[n.origin]?.[locale] ?? n.origin}`.trim(),
      detail: n.meaning[locale],
    }),
  });
}
