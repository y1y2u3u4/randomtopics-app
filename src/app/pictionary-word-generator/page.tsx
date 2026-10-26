import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import PictionaryGenerator from "@/components/generators/PictionaryGenerator";
import { PICTIONARY_THEMES, PICTIONARY_WORDS } from "@/data/pictionary";
import { withSocial } from "@/lib/metadata/social";
import { hreflangAlternates } from "@/i18n/config";

const PATH = "/pictionary-word-generator";
const TITLE = `Pictionary Word Generator: ${PICTIONARY_WORDS.length} Words, Easy to Hard + Timer`;
const DESCRIPTION = `Free Pictionary word generator: ${PICTIONARY_WORDS.length} drawable words in animals, objects, actions and movies, easy to hard. 60-second timer, team scores and a projector mode.`;

export const metadata: Metadata = withSocial({
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["pictionary word generator", "random pictionary words", "pictionary generator", "pictionary words generator", "random drawing word generator", "easy pictionary words", "hard pictionary words", "pictionary ideas"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
});

const FAQ = [
  {
    question: "How does the Pictionary word generator work?",
    answer: `Pick a theme (animals, objects, actions or movies) and a difficulty, then press Get a word. It draws from ${PICTIONARY_WORDS.length} words written for drawing and never repeats one until every word in your mix has been used. Show the screen to the drawer only, press Start to hide the word and run the timer.`,
  },
  {
    question: "What makes a Pictionary word easy, medium or hard?",
    answer:
      "Easy words are one simple thing a child can draw in a few lines (cat, sun, kite). Medium words need two parts or a small scene (lighthouse, walking the dog). Hard words are abstract, rare or need several ideas at once (procrastinating, compass, The Truman Show).",
  },
  {
    question: "How long should a Pictionary round be?",
    answer:
      "60 seconds is the classic length and the default here. Use 90 seconds for young kids or hard words, and 30 seconds for a fast lightning round. Set the timer to Off if you prefer to play without one.",
  },
  {
    question: "Can I use this in a classroom?",
    answer:
      "Yes. Press Projector mode to open a full-screen deck of 30 words from your current theme and difficulty, sized for the back row. Students come up one at a time while the rest of the class guesses; the team scoreboard keeps count.",
  },
  {
    question: "How do I keep the word secret from the guessers?",
    answer:
      "Turn the screen to the drawer, then press Start or Hide from team: the word changes to dots while the timer runs. Press Show again if the drawer forgets it. On a phone, the drawer can simply hold it.",
  },
  {
    question: "Is there a list of all the words?",
    answer: "Yes — the full printable Pictionary word list is on its own page, sorted by theme and difficulty, with copy and print buttons.",
  },
];

const COMPARE = [
  { feature: "Words picked for drawing (no letters needed)", us: "Every word", them: "Mixed with undrawable nouns" },
  { feature: "Themes × difficulty filter", us: "4 themes × 3 levels", them: "One list or difficulty only" },
  { feature: "No repeats until the list runs out", us: "Yes", them: "Often repeats" },
  { feature: "Built-in round timer", us: "30 / 60 / 90 s", them: "Separate timer needed" },
  { feature: "Two-team scoreboard", us: "Yes", them: "Rare" },
  { feature: "Projector mode for classrooms", us: "Yes", them: "Rare" },
  { feature: "Signup or app install", us: "None", them: "Sometimes" },
];

export default function PictionaryWordGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Pictionary Word Generator"
      heading={["Pictionary Word", "Generator"]}
      intro="Random words to draw, from easy to hard. Pick a theme, show the word to the drawer, start the 60-second timer and keep score for two teams."
      description={DESCRIPTION}
      updated="2026-10-19"
      faq={FAQ}
      inShort={
        <>
          A Pictionary word generator picks a random word for the drawer so nobody has to think one up. This one draws from{" "}
          {PICTIONARY_WORDS.length} hand-picked drawable words in four themes and three difficulty levels, never repeats until the mix runs
          out, and has a built-in timer, team scores and a projector mode. Free, no signup.
        </>
      }
      related={[
        { href: "/pictionary-words", label: "Pictionary word list" },
        { href: "/pictionary-phrase-generator", label: "Pictionary phrase generator" },
        { href: "/charades", label: "Charades generator" },
        { href: "/random-team-generator", label: "Random team generator" },
        { href: "/21-questions", label: "21 Questions game" },
        { href: "/random-drawing-generator", label: "Random drawing ideas" },
      ]}
      content={
        <>
          <SectionTitle>How to play Pictionary with this generator</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Split into two teams</strong> (the <Link prefetch={false} href="/random-team-generator" className={linkClass}>team generator</Link> does it fairly). Team A draws first.</li>
            <li><strong>Choose a theme and difficulty</strong>, or leave both on Any for a mixed game.</li>
            <li><strong>The drawer presses Get a word</strong>, reads it, then presses Start. The word hides and the clock runs.</li>
            <li><strong>Draw — no letters, numbers or talking.</strong> Your team shouts guesses until someone says the word or time runs out.</li>
            <li><strong>Press Guessed</strong> to give the point; the turn passes to the other team automatically. First to 10 wins.</li>
          </ol>

          <SectionTitle>Example words by theme</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PICTIONARY_THEMES.map((t) => (
              <div key={t.id}>
                <p className="font-semibold text-[var(--text-primary)]">{t.emoji} {t.label}</p>
                <p className="text-sm">{PICTIONARY_WORDS.filter((e) => e.t === t.id).filter((_, i) => i % 6 === 0).map((e) => e.w).join(", ")}</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">Drawing tip: {t.tip}</p>
              </div>
            ))}
          </div>
          <p className="mt-3">See every word on the <Link prefetch={false} href="/pictionary-words" className={linkClass}>full Pictionary word list</Link>, or try longer prompts with the{" "}
            <Link prefetch={false} href="/pictionary-phrase-generator" className={linkClass}>Pictionary phrase generator</Link>.</p>

          <SectionTitle>House rules that keep the game fun</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>No letters or numbers</strong> in the drawing, and no gestures — that is <Link prefetch={false} href="/charades" className={linkClass}>charades</Link>.</li>
            <li><strong>&quot;Sounds like&quot; is allowed</strong> if you draw an ear first, then something that rhymes.</li>
            <li><strong>All-play round:</strong> every 5th word, both teams guess at once; first correct shout wins the point.</li>
            <li><strong>Mixed ages:</strong> give kids Easy words and adults Hard ones in the same game so everyone has a fair chance.</li>
          </ul>

          <SectionTitle>How it compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">Feature</th><th className="py-2 pr-3">This generator</th><th className="py-2">Typical Pictionary word sites</th>
                </tr>
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
      <PictionaryGenerator mode="word" />
    </GeneratorPageShell>
  );
}
