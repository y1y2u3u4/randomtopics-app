import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import PictionaryQuickPick from "@/components/generators/PictionaryQuickPick";
import { PICTIONARY_THEMES, PICTIONARY_WORDS, levelLabel } from "@/data/pictionary";
import { withSocial } from "@/lib/metadata/social";
import { hreflangAlternates } from "@/i18n/config";

const PATH = "/pictionary-words";
const TOTAL = PICTIONARY_WORDS.length;
const TITLE = `Pictionary Words: ${TOTAL} Ideas by Theme and Difficulty`;
const DESCRIPTION = `A printable list of ${TOTAL} Pictionary words and ideas: animals, objects, actions and movies, each sorted easy, medium and hard. Copy, print or pick one at random.`;

export const metadata: Metadata = withSocial({
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["pictionary words", "pictionary word list", "pictionary ideas", "things to draw for pictionary", "easy pictionary words", "hard pictionary words", "pictionary words for kids", "printable pictionary words"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
});

const FAQ = [
  {
    question: "What are good Pictionary words?",
    answer: "Words with one clear shape that cannot be confused with something else: elephant, umbrella, lighthouse, juggling. Avoid words that need letters (a brand name) or are too vague (thing, stuff). Every word on this list was chosen to be drawable without letters.",
  },
  {
    question: "What are easy Pictionary words for kids?",
    answer: "The Easy column in each theme: cat, fish, ball, sun, jump, swim, Finding Nemo. They can be drawn in a few lines and are known to most children by age six.",
  },
  {
    question: "What are hard Pictionary words for adults?",
    answer: "The Hard column: platypus, metronome, procrastinating, eavesdropping, The Truman Show. For even harder prompts, try the Pictionary phrase generator with idioms.",
  },
  {
    question: "Can I print this Pictionary word list?",
    answer: "Yes. Press Print / PDF at the top for a clean one-column list you can save as PDF or cut into slips. Copy the whole list pastes every word grouped by theme.",
  },
  {
    question: "How many words do I need for a game?",
    answer: "About 10 per player for a full game: a party of eight uses roughly 80 words. With 60 words per theme you can play a single-theme night without repeats.",
  },
];

const COMPARE = [
  { feature: "Words per theme", us: "60 (animals, objects, actions, movies)", them: "One mixed list" },
  { feature: "Easy / medium / hard labels", us: "Every word", them: "Sometimes" },
  { feature: "Random pick, copy and print on one page", us: "Yes", them: "List only" },
  { feature: "Timer and team score", us: "In the generator", them: "No" },
];

export default function PictionaryWordsPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Pictionary Words"
      heading={["Pictionary", "Words"]}
      intro={`${TOTAL} drawable Pictionary words and ideas, sorted by theme and difficulty. Pick one at random, copy the whole list or print it for game night.`}
      description={DESCRIPTION}
      updated="2026-10-19"
      faq={FAQ}
      inShort={
        <>
          This is a free list of {TOTAL} Pictionary words: 60 each for animals, objects, actions and movies, and each labelled easy, medium
          or hard. Press the button to pick one at random, or use the{" "}
          <Link prefetch={false} href="/pictionary-word-generator" className={linkClass}>Pictionary word generator</Link> for a timer and team scores.
        </>
      }
      related={[
        { href: "/pictionary-word-generator", label: "Pictionary word generator" },
        { href: "/pictionary-phrase-generator", label: "Pictionary phrase generator" },
        { href: "/charades", label: "Charades generator" },
        { href: "/21-questions", label: "21 Questions game" },
        { href: "/random-drawing-generator", label: "Random drawing ideas" },
      ]}
      content={
        <>
          {PICTIONARY_THEMES.map((t) => (
            <div key={t.id} data-pictionary-list={t.id}>
              <SectionTitle>{`${t.emoji} ${t.label} Pictionary words`}</SectionTitle>
              <p className="text-sm text-[var(--text-muted)] mb-3">Drawing tip: {t.tip}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {([1, 2, 3] as const).map((d) => (
                  <div key={d}>
                    <p className="font-semibold text-[var(--text-primary)] mb-1">{levelLabel(d)}</p>
                    <ul className="list-disc pl-5 space-y-0.5 text-sm">
                      {PICTIONARY_WORDS.filter((e) => e.t === t.id && e.d === d).map((e) => <li key={e.w}>{e.w}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <SectionTitle>How to use this list</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>On a screen:</strong> press Pick a random word, show it to the drawer only, and start drawing.</li>
            <li><strong>On paper:</strong> press Print / PDF, cut the words into slips and draw them from a bowl.</li>
            <li><strong>For a timed game:</strong> open the <Link prefetch={false} href="/pictionary-word-generator" className={linkClass}>generator</Link> with a 60-second timer, team scores and projector mode.</li>
          </ol>

          <SectionTitle>How it compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15"><th className="py-2 pr-3">Feature</th><th className="py-2 pr-3">This list</th><th className="py-2">Typical word lists</th></tr>
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
      <PictionaryQuickPick />
    </GeneratorPageShell>
  );
}
