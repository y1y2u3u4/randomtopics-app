import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import TriviaGame from "@/components/trivia/TriviaGame";
import { TriviaHero, TriviaList } from "@/components/trivia/TriviaExtras";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { DIFFICULTIES, TRIVIA_BANKS } from "@/lib/trivia";

const PATH = "/trivia-questions/christmas";
const BANK = TRIVIA_BANKS.christmas;
const COUNT = BANK.length;
const TITLE = `Christmas Trivia — ${COUNT} Questions and Answers, With Timer & Scoreboard`;
const DESCRIPTION = `${COUNT} Christmas trivia questions with answers: movies, carols, Santa and his reindeer, traditions around the world, food and the history of the holiday. Play multiple choice or host a festive quiz with a timer and team scores.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "christmas trivia", "christmas trivia questions", "christmas trivia questions and answers", "christmas quiz",
    "christmas trivia for kids", "christmas movie trivia", "christmas trivia multiple choice", "holiday trivia",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const LEVEL = { easy: "🎄 Easy Christmas trivia", medium: "🦌 Medium Christmas trivia", hard: "🎅 Hard Christmas trivia" } as const;
const LIST = DIFFICULTIES.map((d) => ({ id: d, title: LEVEL[d], questions: BANK.filter((q) => q.difficulty === d) }));

const FAQ = [
  {
    question: "What topics do these Christmas trivia questions cover?",
    answer: "Christmas movies and songs, Santa Claus and his reindeer, traditions from around the world, holiday food and drink, decorations, A Christmas Carol and the Grinch, the nativity story and the history of the holiday, plus a few record-breaking facts.",
  },
  {
    question: "Are these Christmas trivia questions good for kids?",
    answer: "Yes. Every question is family-friendly, and the Easy level is written for children from about six with multiple choice switched on. Each answer has a short explanation, so a wrong guess still teaches something.",
  },
  {
    question: "How do I run a Christmas trivia game at a party or in class?",
    answer: "Press Host mode to put the question on a big screen with a countdown timer and a scoreboard for 2 to 8 teams. Play an easy round, a medium round and a hard final. Questions never repeat within a game, so you can play for an hour without seeing the same one twice.",
  },
  {
    question: "How many reindeer does Santa have?",
    answer: "Nine in the popular version: Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner and Blitzen come from the 1823 poem \"A Visit from St. Nicholas\", and Rudolph was added in a 1939 Montgomery Ward booklet.",
  },
  {
    question: "Can I print these Christmas trivia questions?",
    answer: "Yes. The full list with answers is on this page, grouped by difficulty; open the questions you want and use your browser's print. For a paperless game, use the generator above and keep the answers hidden until you reveal them.",
  },
  {
    question: "Is there a Christmas game without questions?",
    answer: "Try Christmas charades: more than 200 holiday words, movies, songs and characters to act out with a timer, on the Christmas charades page linked below.",
  },
];

export default function ChristmasTriviaPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Christmas Trivia"
      heading={["Christmas", "Trivia"]}
      intro={`${COUNT} Christmas trivia questions and answers. Draw one, play multiple choice, or host a holiday quiz with a timer and team scores.`}
      description={DESCRIPTION}
      updated="2026-10-22"
      faq={FAQ}
      related={[
        { href: "/charades/christmas", label: "Christmas charades" },
        { href: "/trivia-questions", label: "All trivia questions" },
        { href: "/trivia-questions/halloween", label: "Halloween trivia" },
        { href: "/random-movie-generator", label: "Random movie generator" },
      ]}
      afterTool={
        <>
          <TriviaHero src="/art/trivia/christmas-hero.jpg" alt="Illustrated Christmas tree, wrapped presents and trivia question cards by a glowing fireplace" variant="christmas" />
          <TriviaList
            heading={`All ${COUNT} Christmas Trivia Questions and Answers`}
            intro="Sorted from easy to hard. Tap a question to reveal the answer and the story behind it."
            groups={LIST}
          />
        </>
      }
      inShort={
        <>
          These {COUNT} Christmas trivia questions cover movies, carols, Santa, world traditions, food and the history of the holiday, each with
          an answer and a one-line explanation. Play them one at a time with multiple choice, or open host mode for a timed team quiz.
        </>
      }
      content={
        <>
          <SectionTitle>A Christmas quiz that runs itself</SectionTitle>
          <p>
            Most lists of <strong>Christmas trivia questions</strong> are a long article you have to read aloud while someone hides the answers and
            keeps score on a napkin. Here the game is ready in the first screen: press <strong>Next question</strong>, let players pick from four
            options or shout an open answer, then reveal the answer and the story behind it. Host mode puts it on the TV with a countdown and a
            scoreboard for up to eight teams, so it works for an office party, a classroom on the last day before break, or a family game after dinner.
          </p>
          <SectionTitle>What&apos;s in the deck</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Christmas movies:</strong> Home Alone, Elf, It&apos;s a Wonderful Life, Miracle on 34th Street and the classic TV specials, by title, year and famous details.</li>
            <li><strong>Songs and carols:</strong> who wrote &quot;Silent Night&quot;, the best-selling Christmas single, and the gifts in &quot;The Twelve Days of Christmas&quot;.</li>
            <li><strong>Santa and his reindeer:</strong> where Saint Nicholas came from, the 1823 poem that named the reindeer, and how Rudolph joined the team.</li>
            <li><strong>Traditions around the world:</strong> Krampus, La Befana, the Yule Lad, KFC in Japan, the Christmas pickle and the Gävle goat.</li>
            <li><strong>Food, decorations and history:</strong> mince pies, eggnog, candy canes, the first Christmas card (1843) and where the Christmas tree custom began.</li>
          </ul>
          <SectionTitle>Tips for a festive trivia round</SectionTitle>
          <p>
            Set the timer to 20 seconds for the easy round and 40 for the hard one, and play the easy questions with kids on one team and adults on
            another. Award a bonus point for the best ugly sweater, and let the team in last place choose the next round&apos;s difficulty. Between
            rounds, act out movies and carols with <Link href="/charades/christmas" className={linkClass}>Christmas charades</Link>, or switch to the
            year-round <Link href="/trivia-questions" className={linkClass}>trivia questions</Link> in ten categories.
          </p>
          <p>
            Every question is written in-house, sticks to facts that won&apos;t change, and comes with the basis for its answer, so you can settle
            arguments before the cookies run out. Looking for a movie to watch afterwards? The{" "}
            <Link href="/random-movie-generator" className={linkClass}>random movie generator</Link> picks one for you.
          </p>
        </>
      }
    >
      <TriviaGame bank="christmas" seed={20261225} />
    </GeneratorPageShell>
  );
}
