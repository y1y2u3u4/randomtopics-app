import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import PictionaryGenerator from "@/components/generators/PictionaryGenerator";
import { PICTIONARY_PHRASES, PICTIONARY_THEMES, levelLabel } from "@/data/pictionary";
import { withSocial } from "@/lib/metadata/social";
import { hreflangAlternates } from "@/i18n/config";

const PATH = "/pictionary-phrase-generator";
const TITLE = "Pictionary Phrase Generator: 2–4 Word Prompts";
const DESCRIPTION = `Free Pictionary phrase generator: ${PICTIONARY_PHRASES.length} short phrases and idioms to draw, from easy scenes to hard sayings. Timer, team scores and projector mode built in.`;

export const metadata: Metadata = withSocial({
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["pictionary phrase generator", "pictionary phrases", "random pictionary phrases", "pictionary sayings", "idioms to draw", "hard pictionary phrases", "pictionary sentences"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
});

const FAQ = [
  {
    question: "What is a Pictionary phrase?",
    answer:
      "A short prompt of two to four words that needs a little scene instead of one object: \"dog chasing its tail\", \"message in a bottle\" or an idiom such as \"spill the beans\". Phrases are slower to guess than single words, so they suit adults and experienced players.",
  },
  {
    question: "How do I draw an idiom?",
    answer:
      "Draw it literally. For \"raining cats and dogs\" draw a cloud dropping a cat and a dog. Draw a dash for each word first so the team knows the length, and point at the dash you are working on.",
  },
  {
    question: "Are the phrases suitable for kids?",
    answer: "Easy phrases are literal scenes kids can draw and guess. Medium and hard ones include idioms many children do not know yet, so choose Easy for under-10s.",
  },
  {
    question: "Can I mix words and phrases in one game?",
    answer: "Yes. Open the Pictionary word generator in another tab and alternate: single words for one-minute rounds, phrases for 90-second rounds worth two points.",
  },
  {
    question: "How many phrases are there?",
    answer: `${PICTIONARY_PHRASES.length}, split across animals, objects, actions and movies and three difficulty levels. None repeat until your chosen mix runs out.`,
  },
];

const COMPARE = [
  { feature: "Every phrase 2–4 words and drawable", us: "Yes", them: "Long sentences mixed in" },
  { feature: "Idioms marked as Hard", us: "Yes", them: "Not labelled" },
  { feature: "Theme and difficulty filters", us: "4 × 3", them: "Rare" },
  { feature: "Timer, team scores, projector", us: "Built in", them: "Plain list" },
  { feature: "No repeats until the mix runs out", us: "Yes", them: "No" },
];

export default function PictionaryPhraseGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Pictionary Phrase Generator"
      heading={["Pictionary Phrase", "Generator"]}
      intro="Random two-to-four word phrases and idioms to draw. Pick a theme and difficulty, hide the phrase from your team and race the clock."
      description={DESCRIPTION}
      updated="2026-10-19"
      faq={FAQ}
      inShort={
        <>
          A Pictionary phrase generator gives the drawer a short scene or saying instead of a single word. This one has{" "}
          {PICTIONARY_PHRASES.length} phrases of 2–4 words, sorted by theme and from literal (easy) to idiom (hard), with a timer, team
          scoreboard and projector mode.
        </>
      }
      related={[
        { href: "/pictionary-word-generator", label: "Pictionary word generator" },
        { href: "/pictionary-words", label: "Pictionary word list" },
        { href: "/charades", label: "Charades generator" },
        { href: "/21-questions", label: "21 Questions game" },
        { href: "/random-team-generator", label: "Random team generator" },
      ]}
      content={
        <>
          <SectionTitle>How to use it</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Pick a theme and difficulty.</strong> Hard is mostly idioms — great for adults.</li>
            <li><strong>Press Get a phrase</strong> with the screen turned to the drawer, then Start to hide it and run the timer.</li>
            <li><strong>Draw one dash per word</strong> so the team knows the length, then draw the scene.</li>
            <li><strong>Press Guessed</strong> to score; the turn passes to the other team.</li>
          </ol>

          <SectionTitle>Example phrases</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15"><th className="py-2 pr-3">Theme</th><th className="py-2 pr-3">{levelLabel(1)}</th><th className="py-2 pr-3">{levelLabel(2)}</th><th className="py-2">{levelLabel(3)}</th></tr>
              </thead>
              <tbody>
                {PICTIONARY_THEMES.map((t) => (
                  <tr key={t.id} className="border-b border-white/10 align-top">
                    <td className="py-2 pr-3 text-[var(--text-primary)]">{t.emoji} {t.label}</td>
                    {([1, 2, 3] as const).map((d) => (
                      <td key={d} className="py-2 pr-3">{PICTIONARY_PHRASES.filter((e) => e.t === t.id && e.d === d).slice(0, 3).map((e) => e.w).join("; ")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionTitle>Tips for drawing phrases</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Small words are free:</strong> once the team has the big words, they can usually fill in &quot;in&quot;, &quot;the&quot; and &quot;a&quot;.</li>
            <li><strong>Draw the verb with arrows:</strong> motion lines and arrows turn a still picture into &quot;chasing&quot; or &quot;melting&quot;.</li>
            <li><strong>Idioms:</strong> draw the literal picture; the guessers then have to jump to the saying. Short on ideas? The{" "}
              <Link prefetch={false} href="/pictionary-word-generator" className={linkClass}>word generator</Link> is quicker for warm-up rounds.</li>
          </ul>

          <SectionTitle>How it compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15"><th className="py-2 pr-3">Feature</th><th className="py-2 pr-3">This generator</th><th className="py-2">Typical phrase lists</th></tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.feature} className="border-b border-white/10 align-top">
                    <td className="py-2 pr-3">{r.feature}</td><td className="py-2 pr-3 text-[var(--text-primary)]">{r.us}</td><td className="py-2">{r.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      }
    >
      <PictionaryGenerator mode="phrase" />
    </GeneratorPageShell>
  );
}
