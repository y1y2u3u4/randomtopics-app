import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import LetterGenerator from "@/components/generators/LetterGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/random-letter-generator";
const TITLE = "Random Letter Generator — Pick a Letter A–Z, No Repeats";
const DESCRIPTION =
  "Free random letter generator: pick one or several random letters from A to Z, uppercase or lowercase, vowels only, consonants only, or without hard letters like Q, X and Z. No repeats until every letter is drawn.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random letter generator", "random letter", "letter picker", "random alphabet generator", "pick a random letter", "random letter a-z"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const FAQ = [
  {
    question: "How does the random letter generator work?",
    answer:
      "Press Generate to draw a letter from A to Z. Every letter has the same chance, and a letter won't come up again until all the letters in your set have been drawn — just like pulling tiles from a bag.",
  },
  {
    question: "Can I leave out hard letters like Q, X and Z?",
    answer:
      "Yes. Choose 'No hard letters' to drop Q, X, Z, J, K, V and Y, which start very few English words. That keeps games like Scattergories and categories fair.",
  },
  {
    question: "Can I draw several letters at once?",
    answer:
      "Yes — choose how many (up to all 26) and the letters come out in random order with no duplicates. Draw all 26 to get a shuffled alphabet.",
  },
  {
    question: "What can I use random letters for?",
    answer:
      "Word games (Scattergories, Categories, Stop/Basta), alphabet practice with kids, spelling bees, naming challenges, random initials for characters and picking a letter for 'a word that starts with…' prompts.",
  },
];

export default function RandomLetterGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Letter Generator"
      heading={["Random Letter", "Generator"]}
      intro="Pick a random letter from A to Z — or several, with no repeats. Uppercase or lowercase, vowels, consonants or no hard letters."
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/charades", label: "Charades generator" },
        { href: "/random-animal-generator", label: "Random animal generator" },
        { href: "/question-of-the-day-for-students", label: "Question of the day for students" },
      ]}
      content={
        <>
          <SectionTitle>A fair letter, every time</SectionTitle>
          <p>
            This <strong>random letter generator</strong> works like a bag of alphabet tiles: each draw is random, and a letter only comes back
            once the whole set has been used. Draw one letter for a round of Scattergories, five letters for a word-building challenge, or all
            26 for a shuffled alphabet.
          </p>
          <SectionTitle>Options</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>All 26</strong>, <strong>vowels</strong>, <strong>consonants</strong>, or <strong>no hard letters</strong> (Q X Z J K V Y).</li>
            <li><strong>UPPERCASE</strong> or <strong>lowercase</strong> — handy for early-reading practice.</li>
            <li>Each letter shows its NATO phonetic word (Alfa, Bravo, Charlie…) so it&apos;s clear when read aloud.</li>
          </ul>
          <SectionTitle>Classroom and game ideas</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Categories</strong> — draw a letter, then everyone names an animal, a country and a food starting with it. Pair it with the <Link href="/random-animal-generator" className={linkClass}>random animal generator</Link> to check answers.</li>
            <li><strong>Alphabet hunt</strong> — young learners find an object in the room that starts with the letter.</li>
            <li><strong>Story challenge</strong> — every sentence must start with the next drawn letter.</li>
          </ul>
        </>
      }
    >
      <LetterGenerator />
    </GeneratorPageShell>
  );
}
