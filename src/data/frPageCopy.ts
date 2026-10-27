import type { LocalePageCopy } from "@/components/LocaleToolPage";

// Shared French chrome for the standalone /fr pages (2026-10-27).
export function frCopy(englishLabel: string, buttonLabel: string, listHeading = "Liste complète"): LocalePageCopy {
  return {
    lang: "fr",
    currency: "EUR",
    homeHref: "/fr",
    homeLabel: "Accueil",
    meta: "Gratuit · sans inscription · {n} idées · mis à jour en octobre 2026",
    siblingsHeading: "Autres générateurs en français",
    howToHeading: "Comment l'utiliser",
    listHeading,
    faqHeading: "Questions fréquentes",
    englishNote: "Version anglaise :",
    englishLabel,
    ui: {
      chooseCategory: "Choisir une catégorie",
      all: "Toutes",
      spinning: "La roue tourne…",
      prompt: "Appuie sur le bouton pour tirer au sort.",
      timeUp: "Temps écoulé !",
      spin: "Lancer la roue",
      startTimer: "Lancer 1 minute",
      restartTimer: "Relancer le chrono",
      copied: "Copié ✓",
      copy: "Copier",
      topicsWord: "idées",
      shownWord: "vues",
      noRepeat: "sans répétition jusqu'à la fin",
      defaultButton: buttonLabel,
    },
  };
}

export const FR_SIBLINGS = [
  { href: "/fr", label: "Sujet aléatoire", detail: "Un sujet au hasard en un clic" },
  { href: "/fr/sujets-de-discussion", label: "Sujets de discussion", detail: "Relancer la conversation" },
  { href: "/fr/question-du-jour", label: "Question du jour", detail: "Pour la classe, l'équipe ou le groupe" },
  { href: "/fr/tu-preferes", label: "Tu préfères", detail: "Des dilemmes à départager" },
  { href: "/fr/idees-de-mime", label: "Idées de mime", detail: "Pour le jeu du mime entre amis" },
  { href: "/fr/sujets-de-debat", label: "Sujets de débat", detail: "Pour l'école et les clubs" },
];
