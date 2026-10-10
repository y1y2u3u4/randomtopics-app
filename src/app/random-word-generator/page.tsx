import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WordGenerator from "@/components/generators/WordGenerator";
import { WORDS } from "@/lib/generators/words";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/random-word-generator";
const TITLE = "Random Word Generator — Nouns, Verbs & Adjectives by Difficulty";
const DESCRIPTION = `Free random word generator with ${WORDS.en.length}+ hand-picked English words. Filter by noun, verb or adjective, difficulty, length and first letter, or get only drawable words for Pictionary and charades. Generate up to 50 at once, no repeats, one-click copy.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random word generator", "random word", "random noun generator", "random verb generator", "random adjective generator", "pictionary word generator", "random words list"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const FAQ = [
  {
    question: "How does the random word generator work?",
    answer: `Choose any filters you want — part of speech, difficulty, length, first letter or drawable only — then press Generate. Words are drawn at random from a hand-checked list of ${WORDS.en.length}+ common English words and never repeat until you have seen every word that matches your filters.`,
  },
  {
    question: "Can I get only nouns, verbs or adjectives?",
    answer:
      "Yes. Tick Nouns, Verbs, Adjectives or Adverbs (or several at once). That makes it a random noun generator, random verb generator or random adjective generator in one place — handy for grammar lessons and Mad Libs-style games.",
  },
  {
    question: "Which words are good for Pictionary or charades?",
    answer:
      "Turn on 'Drawable / actable only'. You'll only get concrete things and actions that can be sketched or mimed, like giraffe, umbrella or swim. Pair it with Easy for kids or Hard for a tougher round.",
  },
  {
    question: "Are these real words?",
    answer:
      "Yes — every word is a common English word in standard American spelling, chosen by hand rather than pulled from a dictionary dump. That means no obscure archaic terms, no proper nouns and nothing unsuitable for a classroom.",
  },
  {
    question: "How can I use random words for writing?",
    answer:
      "Generate three random words and write a story, poem or paragraph that uses all three. Hard adjectives make great vocabulary warm-ups, and a random verb is a quick way to break writer's block.",
  },
];

export default function RandomWordGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Word Generator"
      heading={["Random Word", "Generator"]}
      intro={`${WORDS.en.length}+ hand-picked English words. Filter by part of speech, difficulty, length or first letter — or only words you can draw or act out.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/charades", label: "Charades generator" },
        { href: "/writing", label: "Writing prompt generator" },
        { href: "/random-letter-generator", label: "Random letter generator" },
        { href: "/random-character-generator", label: "Random character generator" },
      ]}
      content={
        <>
          <SectionTitle>Random words you can actually use</SectionTitle>
          <p>
            Most random word generators pull from a huge dictionary, so you get words nobody has heard of. This{" "}
            <strong>random word generator</strong> draws from a hand-picked list of everyday and advanced English words, each tagged with its
            part of speech, difficulty and whether it can be drawn or acted out — so the word you get fits the game, lesson or story you
            have in mind.
          </p>
          <SectionTitle>Filters</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Part of speech</strong> — nouns, verbs, adjectives, adverbs, or any mix.</li>
            <li><strong>Difficulty</strong> — easy words kids know, everyday words, or advanced vocabulary like &quot;ephemeral&quot;.</li>
            <li><strong>Length</strong> — short (3–4 letters), medium (5–7) or long (8+), useful for spelling and word puzzles.</li>
            <li><strong>Starts with</strong> — pick a letter, or draw one with the <Link href="/random-letter-generator" className={linkClass}>random letter generator</Link>.</li>
            <li><strong>Drawable / actable</strong> — only concrete nouns and actions for Pictionary and charades.</li>
          </ul>
          <SectionTitle>Ideas for random words</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Pictionary</strong> — drawable + easy, one word per turn; for acting rounds use the <Link href="/charades" className={linkClass}>charades generator</Link>.</li>
            <li><strong>Three-word stories</strong> — generate three words and write a story that uses all of them; more ideas in the <Link href="/writing" className={linkClass}>writing prompt generator</Link>.</li>
            <li><strong>Vocabulary warm-ups</strong> — hard adjectives or verbs: define it, use it in a sentence, find a synonym.</li>
            <li><strong>Word games</strong> — Taboo-style clue giving, 20 Questions, or spelling bees with long words.</li>
          </ul>
        </>
      }
    >
      <WordGenerator locale="en" />
    </GeneratorPageShell>
  );
}
