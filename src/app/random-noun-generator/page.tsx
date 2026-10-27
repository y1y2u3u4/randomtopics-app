import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import RandomNounGenerator from "@/components/generators/RandomNounGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/random-noun-generator";
const TITLE = "Random Noun Generator — Get Random Nouns by Level, Length and Letter";
const DESCRIPTION =
  "Generate random nouns from a list of 789 common English nouns. Filter by level, word length, category and starting letter, draw 1 to 20 at a time and copy. Free and instant.";

const SOCIAL = generatorSocial({ card: "random-noun-generator", title: TITLE, description: DESCRIPTION, alt: "Random Noun Generator" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random noun generator", "random noun", "noun generator", "random nouns list", "random object generator", "random thing generator", "random noun picker"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "What is a random noun generator?",
    answer: "A tool that picks nouns (people, places, things and ideas) at random from a word list. Writers use it for prompts, teachers for vocabulary games, and players for drawing and guessing games.",
  },
  {
    question: "How many nouns are in the list?",
    answer: "789 common English nouns, from easy words like 'door' and 'apple' to harder ones. Use the level filter to keep to the words you want.",
  },
  {
    question: "Can I get nouns that start with a certain letter?",
    answer: "Yes. Pick a starting letter, optionally combine it with a word length or category, and every result will match.",
  },
  {
    question: "Are the nouns repeated?",
    answer: "Not within a session: the tool tracks what it has already shown, so you see fresh words until the filtered list is used up.",
  },
  {
    question: "How do I use random nouns for a story?",
    answer: "Draw three nouns and make all three matter to the plot. The odder the combination, the more inventive the story has to be.",
  },
  {
    question: "Is there a version for adjectives or verbs?",
    answer: "Try the random word generator for mixed words, and the random sentence generator, which combines nouns, verbs and adjectives into full sentences.",
  },
];

export default function RandomNounGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Noun Generator"
      heading={["Random Noun", "Generator"]}
      intro="Random nouns on demand. Filter by level, length, category or starting letter, and copy what you like."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Pick filters (level, word length, category or starting letter) and draw 1 to 20 random nouns from a list of 789 common English nouns. Results do not repeat within a session, and you can copy them in one tap. It is free and needs no signup."
      related={[
        { href: "/random-word-generator", label: "Random word generator" },
        { href: "/random-sentence-generator", label: "Random sentence generator" },
        { href: "/random-letter-generator", label: "Random letter generator" },
        { href: "/writing", label: "Writing prompt generator" },
        { href: "/random-name-generator", label: "Random name generator" },
      ]}
      content={
        <>
          <SectionTitle>Where random nouns help</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Creative writing</strong> — a noun is the smallest possible prompt. Draw three and build a scene that contains all of them.</li>
            <li><strong>Drawing games</strong> — pass a noun to the artist, let everyone guess. Use short, concrete words for younger players.</li>
            <li><strong>Vocabulary lessons</strong> — draw nouns by level and have students write a sentence, define the word or act it out.</li>
            <li><strong>Brainstorming</strong> — force a connection between your project and a random object to break a stuck idea.</li>
            <li><strong>Word games</strong> — Pictionary, charades, 20 questions and Scattergories need a steady supply of nouns.</li>
          </ul>
          <SectionTitle>Using the filters</SectionTitle>
          <p>
            <strong>Level</strong> sets how common the word is. <strong>Length</strong> narrows to short words (good for kids and word search) or long ones (good for a challenge).{" "}
            <strong>Starting letter</strong> gives you alliteration and fits letter-of-the-day lessons. Combine them: a four-letter noun starting with B is a small, fair list.
          </p>
          <SectionTitle>Nouns, words and sentences</SectionTitle>
          <p>
            Need any part of speech? Use the <Link prefetch={false} href="/random-word-generator" className={linkClass}>random word generator</Link>. Want a whole line built from nouns, verbs and adjectives?
            The <Link prefetch={false} href="/random-sentence-generator" className={linkClass}>random sentence generator</Link> does that. For a single starting letter, the{" "}
            <Link prefetch={false} href="/random-letter-generator" className={linkClass}>random letter generator</Link> works well alongside this page.
          </p>
        </>
      }
    >
      <RandomNounGenerator />
    </GeneratorPageShell>
  );
}
