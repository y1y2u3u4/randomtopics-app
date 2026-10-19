import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import TwentyOneQuestions from "@/components/generators/TwentyOneQuestions";
import { GUESS_SECRETS, GUESS_STARTERS, KNOW_QUESTIONS, KNOW_SETS } from "@/data/twentyOneQuestions";
import { withSocial } from "@/lib/metadata/social";
import { hreflangAlternates } from "@/i18n/config";

const PATH = "/21-questions";
const TITLE = "21 Questions Game: Questions for Friends, Couples, Kids";
const DESCRIPTION =
  "Play 21 Questions online for free: draw get-to-know-you questions for friends, couples or kids with an x/21 counter, or deal a secret object and guess it in 21 yes/no questions.";

export const metadata: Metadata = withSocial({
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["21 questions", "21 questions game", "21 questions to ask", "21 questions for couples", "21 questions for friends", "21 questions for kids", "21 questions guessing game", "20 questions game"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
});

const FAQ = [
  {
    question: "How do you play 21 Questions?",
    answer:
      "There are two common versions. In the guessing game, one player thinks of a thing and the others have 21 yes/no questions to work out what it is. In the get-to-know-you version, players take turns answering 21 open questions. This page does both: pick a mode at the top.",
  },
  {
    question: "What are good 21 questions to ask a friend?",
    answer: "Light, specific questions work best: \"What is a hill you will die on, even a silly one?\", \"Which song do you never skip?\", \"What did you believe as a kid that turned out wrong?\". The Friends set has 30 of them; the tool draws 21 without repeats.",
  },
  {
    question: "Are the couples questions suitable for a first date?",
    answer: "Most are better once you know each other a little (\"What was your first impression of me?\"). For a first date, use the Friends set; save Couples for a date night or a long drive.",
  },
  {
    question: "Is 21 Questions the same as 20 Questions?",
    answer: "Yes, apart from the count. The classic parlour game is 20 Questions; 21 gives the guessers one extra try. Turn the counter off in your head at 20 if you prefer the classic rules.",
  },
  {
    question: "What are the best first yes/no questions?",
    answer: "Ones that split the possibilities in half: \"Is it alive?\", \"Is it bigger than a microwave?\", \"Would I find it indoors?\". The guess mode shows one of these hints each turn.",
  },
  {
    question: "Can kids play?",
    answer: "Yes. The Kids set has 30 questions for ages 5–12, and every secret in guess mode is a common animal, object, place, food or job a child will know.",
  },
];

const COMPARE = [
  { feature: "Both versions (guessing + get to know)", us: "Yes", them: "One or the other" },
  { feature: "Separate friends, couples and kids sets", us: "3 × 30 questions", them: "One long list" },
  { feature: "x/21 counter and progress", us: "Yes", them: "Count it yourself" },
  { feature: "Secret dealt for the answerer", us: "60 things in 5 categories", them: "Think of your own" },
  { feature: "No repeats until the set runs out", us: "Yes", them: "Scroll and pick" },
];

export default function TwentyOneQuestionsPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="21 Questions"
      heading={["21", "Questions"]}
      intro="Draw 21 questions for friends, couples or kids, or play the guessing game: get a secret, then find it in 21 yes/no questions."
      description={DESCRIPTION}
      updated="2026-10-19"
      faq={FAQ}
      inShort={
        <>
          21 Questions is a talking game with two versions. Here you can draw open questions one at a time from a friends, couples or kids
          set ({KNOW_QUESTIONS.friends.length} each) with a 1–21 counter, or deal a secret thing and count the guessers&apos; yes/no
          questions up to 21.
        </>
      }
      related={[
        { href: "/charades", label: "Charades generator" },
        { href: "/pictionary-word-generator", label: "Pictionary word generator" },
        { href: "/pictionary-words", label: "Pictionary word list" },
        { href: "/random-team-generator", label: "Random team generator" },
      ]}
      content={
        <>
          <SectionTitle>How to play</SectionTitle>
          <p><strong>Get to know each other:</strong></p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Pick Friends, Couples or Kids.</li>
            <li>Press Draw a question and read it out. Everyone answers, or take turns.</li>
            <li>Each player may pass once. Stop at 21/21 and swap who starts.</li>
          </ol>
          <p className="mt-3"><strong>Guess the thing:</strong></p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>The answerer presses Deal a secret, memorises it and presses Hide secret.</li>
            <li>Guessers ask yes/no questions; press +1 for each one.</li>
            <li>Press Guessed it if they get it before 21, otherwise the answerer wins.</li>
          </ol>

          {KNOW_SETS.map((s) => (
            <div key={s.id}>
              <SectionTitle>21 questions for {s.label.toLowerCase()}</SectionTitle>
              <ol className="list-decimal pl-5 space-y-0.5 text-sm">
                {KNOW_QUESTIONS[s.id].slice(0, 21).map((q) => <li key={q}>{q}</li>)}
              </ol>
            </div>
          ))}

          <SectionTitle>Good yes/no questions for the guessing game</SectionTitle>
          <ul className="list-disc pl-5 space-y-0.5 text-sm columns-1 sm:columns-2">
            {GUESS_STARTERS.map((q) => <li key={q}>{q}</li>)}
          </ul>
          <p className="mt-3 text-sm">Secrets in the deck include {GUESS_SECRETS.filter((_, i) => i % 6 === 0).map((s) => s.w).join(", ")} and more. Want a drawing round instead? Try <Link href="/pictionary-word-generator" className={linkClass}>Pictionary</Link> or <Link href="/charades" className={linkClass}>charades</Link>.</p>

          <SectionTitle>How it compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15"><th className="py-2 pr-3">Feature</th><th className="py-2 pr-3">This page</th><th className="py-2">Typical question lists</th></tr>
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
      <TwentyOneQuestions />
    </GeneratorPageShell>
  );
}
