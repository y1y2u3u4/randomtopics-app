import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import CharacterNameGenerator from "@/components/generators/CharacterNameGenerator";
import { CHAR_FIRST, CHAR_LAST } from "@/lib/generators/characters";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/character-name-generator";
const TITLE = "Character Name Generator — Names for Stories, by Genre";
const DESCRIPTION = `Free character name generator for writers: ${CHAR_FIRST.length}+ first names and ${CHAR_LAST.length}+ surnames for fantasy, sci-fi, modern and historical fiction, each with its meaning. Filter by genre and gender.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["character name generator", "name generator for characters", "story character names", "fantasy character name generator", "sci fi name generator", "book character name generator", "names for writers"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const FAQ = [
  {
    question: "How does the character name generator work?",
    answer: `Choose a genre (fantasy, sci-fi, modern or historical) and, if you like, a gender, then press Generate. You get full names — a first name and a surname from the same genre — with the meaning of both parts. There are ${CHAR_FIRST.length}+ first names, and none repeats until you've seen them all.`,
  },
  {
    question: "Are the names real?",
    answer:
      "Modern and historical names are real names with their real origins and meanings, drawn from many cultures. Fantasy and sci-fi names are original inventions; their notes explain what each name is meant to evoke rather than claiming a fake etymology.",
  },
  {
    question: "How do I pick the right name for a character?",
    answer:
      "Think about the character's parents, era and place — names are chosen by families, not authors. Vary the first letters and syllable counts across your cast so readers never confuse two characters, and say the name aloud in a line of dialogue.",
  },
  {
    question: "Can I generate gender-neutral names?",
    answer:
      "Yes. Choose Gender-neutral to get names used for any gender, such as Rowan, Quinn or Sasha, or leave all genders on for a mix.",
  },
  {
    question: "I need more than a name — can it build the whole character?",
    answer:
      "Use the random character generator: it adds an occupation, personality, a distinctive look, a motivation, a secret, a quirk and a flaw to every name.",
  },
];

export default function CharacterNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Character Name Generator"
      heading={["Character Name", "Generator"]}
      intro={`Full names for fantasy, sci-fi, modern and historical stories — ${CHAR_FIRST.length}+ first names and ${CHAR_LAST.length}+ surnames, each with its meaning.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/random-character-generator", label: "Random character generator" },
        { href: "/writing", label: "Writing prompt generator" },
        { href: "/writing-topic-generator", label: "Writing topic generator" },
        { href: "/last-name-generator", label: "Last name generator" },
      ]}
      content={
        <>
          <SectionTitle>Names that fit the world of your story</SectionTitle>
          <p>
            A good name tells the reader where a character comes from before they say a word. This <strong>character name generator</strong>{" "}
            keeps genres apart — a sci-fi pilot gets a name that sounds like the future, a Victorian clerk gets one from the period — and shows
            the meaning of every first name and surname so you can hide a clue in plain sight.
          </p>
          <SectionTitle>Four genres</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Fantasy</strong> — invented names with an old, mythic ring, and surnames of places and crafts.</li>
            <li><strong>Sci-fi</strong> — sleek, technical and cross-cultural names for colonists, captains and AIs.</li>
            <li><strong>Modern</strong> — real names from dozens of cultures, as you would meet them today.</li>
            <li><strong>Historical</strong> — names common in earlier centuries, from medieval Europe to the 1800s.</li>
          </ul>
          <SectionTitle>A quick naming checklist</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Match the name to the character&apos;s birth year and family, not just their personality.</li>
            <li>Give each main character a different first letter and rhythm.</li>
            <li>Check the meaning — then decide whether irony or a hint works better.</li>
            <li>Search the full name once so you don&apos;t accidentally name a famous person.</li>
          </ol>
          <p>
            Stuck on the story itself? Try the <Link href="/writing" className={linkClass}>writing prompt generator</Link>, or build a
            complete cast with the <Link href="/random-character-generator" className={linkClass}>random character generator</Link>.
          </p>
        </>
      }
    >
      <CharacterNameGenerator />
    </GeneratorPageShell>
  );
}
