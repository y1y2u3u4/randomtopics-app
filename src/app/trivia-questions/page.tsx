import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import TriviaGame from "@/components/trivia/TriviaGame";
import { TriviaHero, TriviaList } from "@/components/trivia/TriviaExtras";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { CATEGORY_TRIVIA, TRIVIA_CATEGORIES, TRIVIA_CATEGORY_IDS, staticList } from "@/lib/trivia";

const PATH = "/trivia-questions";
const COUNT = `${Math.floor(CATEGORY_TRIVIA.length / 50) * 50}+`;
const TITLE = `Trivia Questions and Answers — ${COUNT} Free, With Host Mode & Scoreboard`;
const DESCRIPTION = `${COUNT} trivia questions with answers in 10 categories and 3 difficulty levels. Draw one at a time, play multiple choice, or host a game night with a timer and a 2–8 team scoreboard.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "trivia questions", "trivia questions and answers", "trivia generator", "random trivia questions",
    "trivia night questions", "general knowledge quiz", "trivia questions for kids", "multiple choice trivia",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const LIST = staticList(10).map((g) => ({
  id: g.category,
  title: `${TRIVIA_CATEGORIES[g.category].emoji} ${TRIVIA_CATEGORIES[g.category].label} trivia questions`,
  questions: g.questions,
}));

const FAQ = [
  {
    question: "How does the trivia question generator work?",
    answer: `Pick a category and a difficulty, press Next question, then Show answer. Each draw comes from ${COUNT} questions written in-house, and nothing repeats within a game: once every matching question has been asked, the generator tells you and offers a new game.`,
  },
  {
    question: "How do I host a trivia night with it?",
    answer: "Press Host mode. The question goes full screen with a countdown timer (10 to 90 seconds, or off) and a scoreboard for 2 to 8 teams. Read the question, let the timer run, reveal the answer and tap + or − for each team. You can rename teams and change the timer mid-game; scores carry over.",
  },
  {
    question: "Can scores go below zero?",
    answer: "Yes, on purpose. Many hosts take a point off for a wrong buzz-in or a shouted answer, so the − button keeps counting down past zero. If you don't play with penalties, simply never press it.",
  },
  {
    question: "Multiple choice or open answer: which is better?",
    answer: "Multiple choice suits kids, mixed groups and harder questions: every question has the right answer plus two or three plausible wrong ones, shuffled each time. Open answer is tougher and better for competitive pub-style rounds; switch with one tap.",
  },
  {
    question: "Are the answers checked?",
    answer: "Every question has a one-sentence explanation that states the basis for the answer. We only use stable facts — no 'current champion' or 'latest record' questions that go out of date — and we avoid politics, religion and disasters so the deck is safe for classrooms and families.",
  },
  {
    question: "Are there trivia questions for kids?",
    answer: `Yes. The Kids category has ${CATEGORY_TRIVIA.filter((q) => q.category === "kids").length} questions written for ages 8 to 12, and Easy questions in any category work for younger players with multiple choice turned on.`,
  },
];

export default function TriviaQuestionsPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Trivia Questions"
      heading={["Trivia", "Questions"]}
      intro={`${COUNT} trivia questions and answers. Draw one, play multiple choice, or host a game night with a timer and team scores.`}
      description={DESCRIPTION}
      updated="2026-10-14"
      faq={FAQ}
      related={[
        { href: "/trivia-questions/christmas", label: "Christmas trivia" },
        { href: "/trivia-questions/halloween", label: "Halloween trivia" },
        { href: "/charades", label: "Charades generator" },
        { href: "/paranoia-questions", label: "Paranoia questions" },
        { href: "/topics/questions-to-ask-at-a-party", label: "Questions to ask at a party" },
        { href: "/random-team-generator", label: "Random team generator" },
      ]}
      afterTool={
        <>
          <TriviaHero src="/art/trivia/hero.jpg" alt="Illustrated trivia question cards beside a countdown timer and a four-team scoreboard" variant="party" />
          <TriviaList
            heading="100 Trivia Questions and Answers"
            intro="Ten questions from each category, easy to hard. Tap a question to see the answer and why it's right, or use the game above to draw from the full bank."
            groups={LIST}
          />
        </>
      }
      inShort={
        <>
          This free trivia generator draws from {COUNT} original questions with answers across {TRIVIA_CATEGORY_IDS.length} categories and
          three difficulty levels, with multiple choice or open answers, and a host mode that adds a countdown timer and a scoreboard for 2–8 teams.
        </>
      }
      content={
        <>
          <SectionTitle>A trivia game, not just a list</SectionTitle>
          <p>
            Most pages of <strong>trivia questions and answers</strong> are one long article: you scroll, read a question out loud and try not
            to see the answer underneath. This page starts the game in the first screen instead. Choose a category, press{" "}
            <strong>Next question</strong> and reveal the answer when your group is ready. The <strong>trivia generator</strong> never repeats a
            question within a game, so a two-hour quiz night doesn&apos;t loop back to the questions you asked in round one.
          </p>
          <SectionTitle>Ten categories, three difficulty levels</SectionTitle>
          <p>
            The bank covers {TRIVIA_CATEGORY_IDS.map((c) => TRIVIA_CATEGORIES[c].label.toLowerCase()).join(", ")}. Each question is tagged easy,
            medium or hard, so you can run an easy warm-up round for everyone, then raise the difficulty for the final. Mixed draws from every
            category at once, which suits a general knowledge quiz.
          </p>
          <SectionTitle>How to host a trivia night</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Split into teams.</strong> Two to eight teams of two to five players works best; the <Link prefetch={false} href="/random-team-generator" className={linkClass}>random team generator</Link> makes fair teams in seconds.</li>
            <li><strong>Open Host mode.</strong> Put the screen on a TV or laptop facing the room, set the timer (20 seconds is a good default) and name the teams.</li>
            <li><strong>Play rounds of ten.</strong> Pick one category per round, read each question, let the timer run, then reveal the answer and the one-line explanation.</li>
            <li><strong>Score as you go.</strong> Tap + for a correct answer. If your house rules punish wrong buzz-ins, tap − — scores may go below zero. The leader gets a crown.</li>
          </ol>
          <SectionTitle>How we write the questions</SectionTitle>
          <p>
            Every question is written in-house rather than copied from list articles. We stick to facts that don&apos;t change, like dates of
            inventions, chemical symbols, capitals and film release years, and avoid anything that depends on who is champion or record holder
            today. Each answer ships with a short explanation of its basis, and the multiple-choice options are plausible but clearly wrong once
            you know the fact. Politics, religion and disasters are left out, so the questions work in classrooms, offices and family game nights.
          </p>
          <p>
            Want something seasonal? Try the <Link prefetch={false} href="/trivia-questions/christmas" className={linkClass}>Christmas trivia questions</Link> or the{" "}
            <Link prefetch={false} href="/trivia-questions/halloween" className={linkClass}>Halloween trivia questions</Link>. For a
            louder party game between rounds, deal a few <Link prefetch={false} href="/charades" className={linkClass}>charades</Link> words or a round of{" "}
            <Link prefetch={false} href="/paranoia-questions" className={linkClass}>paranoia questions</Link>.
          </p>
        </>
      }
    >
      <TriviaGame seed={20261014} />
    </GeneratorPageShell>
  );
}
