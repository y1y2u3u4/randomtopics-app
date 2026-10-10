// Every live random-generator page, used for cross-links between generator
// pages, the homepage "Random generators" group and /categories. Add a page
// here only once it is deployed.

export interface GeneratorLink {
  href: string;
  esHref?: string;
  emoji: string;
  label: { en: string; es?: string };
  detail: { en: string; es?: string };
}

export const RANDOM_GENERATORS: GeneratorLink[] = [
  {
    href: "/random-word-generator",
    esHref: "/es/generador-de-palabras-aleatorias",
    emoji: "🔠",
    label: { en: "Random Word Generator", es: "Generador de palabras" },
    detail: { en: "Nouns, verbs & adjectives by level", es: "Sustantivos, verbos y adjetivos" },
  },
  {
    href: "/random-team-generator",
    esHref: "/es/generador-de-equipos-aleatorios",
    emoji: "👥",
    label: { en: "Random Team Generator", es: "Generador de equipos" },
    detail: { en: "Split a list into fair teams", es: "Divide una lista en equipos justos" },
  },
  {
    href: "/random-animal-generator",
    esHref: "/es/generador-de-animales-aleatorios",
    emoji: "🦊",
    label: { en: "Random Animal Generator", es: "Generador de animales" },
    detail: { en: "Animals with pictures & fun facts", es: "Animales con dibujo y dato curioso" },
  },
  {
    href: "/last-name-generator",
    esHref: "/es/generador-de-apellidos",
    emoji: "🏷️",
    label: { en: "Last Name Generator", es: "Generador de apellidos" },
    detail: { en: "Surnames by origin, with meanings", es: "Apellidos por origen, con significado" },
  },
  {
    href: "/dnd-name-generator",
    emoji: "🐉",
    label: { en: "D&D Name Generator" },
    detail: { en: "Fantasy names by race & gender" },
  },
  {
    href: "/viking-name-generator",
    emoji: "🛡️",
    label: { en: "Viking Name Generator" },
    detail: { en: "Old Norse names & bynames" },
  },
  {
    href: "/character-name-generator",
    emoji: "✒️",
    label: { en: "Character Name Generator" },
    detail: { en: "Names for stories, by genre" },
  },
  {
    href: "/random-character-generator",
    emoji: "🎭",
    label: { en: "Random Character Generator" },
    detail: { en: "Name, traits, motive & secret" },
  },
  {
    href: "/gnome-name-generator",
    emoji: "⚙️",
    label: { en: "Gnome Name Generator" },
    detail: { en: "Names, nicknames & clans" },
  },
  {
    href: "/random-food-generator",
    emoji: "🍜",
    label: { en: "Random Food Generator" },
    detail: { en: "What should I eat today?" },
  },
  {
    href: "/random-letter-generator",
    emoji: "🔤",
    label: { en: "Random Letter Generator" },
    detail: { en: "A–Z with no repeats" },
  },
];

export function generatorsFor(locale: "en" | "es"): { href: string; emoji: string; label: string; detail: string }[] {
  return RANDOM_GENERATORS.filter((g) => locale === "en" || g.esHref).map((g) => ({
    href: locale === "es" ? (g.esHref as string) : g.href,
    emoji: g.emoji,
    label: (locale === "es" ? g.label.es : undefined) ?? g.label.en,
    detail: (locale === "es" ? g.detail.es : undefined) ?? g.detail.en,
  }));
}
