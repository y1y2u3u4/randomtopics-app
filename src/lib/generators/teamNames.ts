import words from "@/data/generators/teamWords.json";
import { shuffle, type Rng } from "@/lib/randomGenerators";

interface Adjective { en: string; es: { m: string; f: string } }
interface Noun { en: string; es: string; g: "m" | "f" }

const ADJECTIVES = words.adjectives as Adjective[];
const NOUNS = words.nouns as Noun[];

export const TEAM_NAME_COMBINATIONS = ADJECTIVES.length * NOUNS.length;

/** `count` distinct fun team names, e.g. "Swift Otters" / "Nutrias Veloces". */
export function makeTeamNames(count: number, locale: "en" | "es", rng: Rng): string[] {
  const nouns = shuffle(NOUNS, rng);
  const adjectives = shuffle(ADJECTIVES, rng);
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    // Distinct nouns while they last, so two teams never share an animal.
    const noun = nouns[i % nouns.length];
    const adj = adjectives[(i + Math.floor(i / nouns.length)) % adjectives.length];
    names.push(locale === "es" ? `${noun.es} ${adj.es[noun.g]}` : `${adj.en} ${noun.en}`);
  }
  return names;
}
