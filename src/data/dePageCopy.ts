import type { LocalePageCopy } from "@/components/LocaleToolPage";

// Shared German chrome for the standalone /de pages (2026-11-06 pilot).
export function deCopy(englishLabel: string, buttonLabel: string, listHeading = "Die komplette Liste"): LocalePageCopy {
  return {
    lang: "de",
    currency: "EUR",
    homeHref: "/de",
    homeLabel: "Startseite",
    meta: "Kostenlos · ohne Anmeldung · {n} Einträge · aktualisiert im November 2026",
    siblingsHeading: "Weitere Generatoren auf Deutsch",
    howToHeading: "So funktioniert es",
    listHeading,
    faqHeading: "Häufige Fragen",
    englishNote: "Englische Version:",
    englishLabel,
    ui: {
      chooseCategory: "Kategorie wählen",
      all: "Alle",
      spinning: "Das Rad dreht sich …",
      prompt: "Tippe auf den Button, um eine zu ziehen.",
      timeUp: "Die Zeit ist um!",
      spin: "Rad drehen",
      startTimer: "1 Minute starten",
      restartTimer: "Timer neu starten",
      copied: "Kopiert ✓",
      copy: "Kopieren",
      topicsWord: "Einträge",
      shownWord: "gezogen",
      noRepeat: "keine Wiederholung, bis alle durch sind",
      defaultButton: buttonLabel,
    },
  };
}

export const DE_SIBLINGS = [
  { href: "/de", label: "Themen-Generator", detail: "Zufälliges Thema per Klick" },
];
