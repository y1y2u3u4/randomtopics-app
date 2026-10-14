// Every live random-generator page, used for cross-links between generator
// pages, the homepage "Random generators" group and /categories. Add a page
// here only once it is deployed.

export interface GeneratorLink {
  href: string;
  esHref?: string;
  emoji: string;
  label: { en: string; es?: string };
  detail: { en: string; es?: string };
  /** Only linked from other generator pages, not the homepage group or footer. */
  crossLinkOnly?: boolean;
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
    label: { en: "Random Team & Group Generator", es: "Generador de equipos y grupos" },
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
  {
    href: "/japanese-name-generator",
    emoji: "🎌",
    label: { en: "Japanese Name Generator" },
    detail: { en: "Kanji, kana, romaji & meaning" },
  },
  {
    href: "/random-color-generator",
    emoji: "🎨",
    label: { en: "Random Color Generator" },
    detail: { en: "HEX/RGB/HSL palettes, lock & copy" },
  },
  {
    href: "/fantasy-map-maker",
    emoji: "🗺️",
    label: { en: "Fantasy Map Maker" },
    detail: { en: "Random worlds, download PNG" },
  },
  {
    href: "/my-9-albums",
    emoji: "💿",
    label: { en: "My 9 Albums" },
    detail: { en: "3×3 album cover grid, PNG" },
    crossLinkOnly: true,
  },
  {
    href: "/my-9-games",
    emoji: "🎮",
    label: { en: "My 9 Games" },
    detail: { en: "3×3 favorite games grid" },
    crossLinkOnly: true,
  },
  {
    href: "/my-9-movies",
    emoji: "🎬",
    label: { en: "My 9 Movies" },
    detail: { en: "3×3 favorite movies grid" },
    crossLinkOnly: true,
  },
  {
    href: "/my-9-anime",
    emoji: "🌸",
    label: { en: "My 9 Anime" },
    detail: { en: "3×3 favorite anime grid" },
    crossLinkOnly: true,
  },
  {
    href: "/my-9-books",
    emoji: "📚",
    label: { en: "My 9 Books" },
    detail: { en: "3×3 favorite books grid" },
    crossLinkOnly: true,
  },
  {
    href: "/my-9-grid",
    emoji: "🔳",
    label: { en: "My 9 Grid Maker" },
    detail: { en: "Any 9 pictures in one image" },
    crossLinkOnly: true,
  },
  {
    href: "/apa-citation-generator",
    emoji: "📝",
    label: { en: "APA Citation Generator" },
    detail: { en: "APA 7 reference page & in-text" },
    crossLinkOnly: true,
  },
  {
    href: "/asa-citation-generator",
    emoji: "📑",
    label: { en: "ASA Citation Generator" },
    detail: { en: "ASA 7th ed. references from a DOI" },
    crossLinkOnly: true,
  },
  {
    href: "/acs-citation-generator",
    emoji: "🧪",
    label: { en: "ACS Citation Generator" },
    detail: { en: "Numbered ACS references" },
    crossLinkOnly: true,
  },
  {
    href: "/chicago-citation-generator",
    emoji: "📚",
    label: { en: "Chicago Citation Generator" },
    detail: { en: "Footnotes, bibliography, author-date" },
    crossLinkOnly: true,
  },
  {
    href: "/random-movie-generator",
    emoji: "🎬",
    label: { en: "Random Movie Generator" },
    detail: { en: "Pick a movie by genre & decade" },
    crossLinkOnly: true,
  },
  {
    href: "/wu-tang-name-generator",
    emoji: "🥋",
    label: { en: "Wu-Tang Name Generator" },
    detail: { en: "What's your Wu-Tang name?" },
    crossLinkOnly: true,
  },
  {
    href: "/random-name-picker",
    emoji: "🎩",
    label: { en: "Random Name Picker" },
    detail: { en: "Draw names, no repeats" },
    crossLinkOnly: true,
  },
  {
    href: "/number-randomizer",
    emoji: "🔢",
    label: { en: "Number Randomizer" },
    detail: { en: "Random numbers in any range" },
    crossLinkOnly: true,
  },
  {
    href: "/ai-metadata-remover",
    emoji: "🧹",
    label: { en: "AI Metadata Remover" },
    detail: { en: "Strip EXIF, GPS, C2PA, prompts" },
    crossLinkOnly: true,
  },
  {
    href: "/western-baby-name-generator",
    emoji: "🤠",
    label: { en: "Western Baby Name Generator" },
    detail: { en: "Cowboy & country names with meanings" },
    crossLinkOnly: true,
  },
];

export function generatorsFor(locale: "en" | "es", opts: { crossLinks?: boolean } = {}): { href: string; emoji: string; label: string; detail: string }[] {
  return RANDOM_GENERATORS.filter((g) => (locale === "en" || g.esHref) && (opts.crossLinks || !g.crossLinkOnly)).map((g) => ({
    href: locale === "es" ? (g.esHref as string) : g.href,
    emoji: g.emoji,
    label: (locale === "es" ? g.label.es : undefined) ?? g.label.en,
    detail: (locale === "es" ? g.detail.es : undefined) ?? g.detail.en,
  }));
}
