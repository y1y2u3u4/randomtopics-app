// 2026-11-16 SEO×GEO dispatch: the six generators ranking 7–9 for big head
// terms (~75k impressions / 28 days). They link to each other and get a
// homepage entry. scripts/popular-generators-regression.mjs checks the wiring.
export interface PopularGenerator {
  href: string;
  label: string;
  detail: string;
  emoji: string;
}

export const POPULAR_GENERATORS: readonly PopularGenerator[] = [
  { href: "/japanese-name-generator", label: "Japanese Name Generator", detail: "Names in kanji, with meanings", emoji: "🌸" },
  { href: "/random-animal-generator", label: "Random Animal Generator", detail: "A real animal + a fun fact", emoji: "🦊" },
  { href: "/last-name-generator", label: "Last Name Generator", detail: "Real surnames from 20+ cultures", emoji: "🪪" },
  { href: "/charades", label: "Charades Generator", detail: "Words to act out + a timer", emoji: "🎭" },
  { href: "/wingding-translator", label: "Wingdings Translator", detail: "English ⇄ Wingdings symbols", emoji: "✋" },
  { href: "/incorrect-quote-generator", label: "Incorrect Quote Generator", detail: "Funny dialogue for 1–6 characters", emoji: "💬" },
];

// One sentence, identical on every page, so search snippets and AI answers
// quote the same free rule. All six tools run in the browser with no quota.
export const FREE_RULE = "Free and unlimited: no sign-up, no daily cap, and every result is made right in your browser.";

/** Evenly spaced, deterministic picks so the server-rendered examples stay stable between builds. */
export function spreadPick<T>(items: readonly T[], n: number, offset = 0): T[] {
  if (items.length === 0) return [];
  return Array.from({ length: Math.min(n, items.length) }, (_, i) => items[(offset + Math.floor((i * items.length) / n)) % items.length]);
}
