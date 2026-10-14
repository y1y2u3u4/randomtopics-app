import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import TriviaGame from "@/components/trivia/TriviaGame";
import { TriviaHero, TriviaList } from "@/components/trivia/TriviaExtras";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { DIFFICULTIES, TRIVIA_BANKS } from "@/lib/trivia";

const PATH = "/trivia-questions/halloween";
const BANK = TRIVIA_BANKS.halloween;
const COUNT = BANK.length;
const TITLE = `Halloween Trivia — ${COUNT} Questions and Answers, With Timer & Scoreboard`;
const DESCRIPTION = `${COUNT} Halloween trivia questions with answers: jack-o'-lantern folklore, the history of the holiday, candy, pumpkins and classic monsters. Play multiple choice or host a spooky quiz with a timer and team scores.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "halloween trivia", "halloween trivia questions", "halloween trivia questions and answers", "halloween quiz",
    "halloween trivia for kids", "halloween trivia multiple choice", "spooky trivia",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const LEVEL = { easy: "🎃 Easy Halloween trivia", medium: "🦇 Medium Halloween trivia", hard: "🧛 Hard Halloween trivia" } as const;
const LIST = DIFFICULTIES.map((d) => ({ id: d, title: LEVEL[d], questions: BANK.filter((q) => q.difficulty === d) }));

const FAQ = [
  {
    question: "What topics do these Halloween trivia questions cover?",
    answer: "Folklore (jack-o'-lanterns, black cats, bats), the history of the holiday and its customs, trick-or-treating, Halloween candy, pumpkins, and the classic monsters of public-domain literature such as Dracula, Frankenstein's creature and the Headless Horseman. Classic horror films appear only by title and year.",
  },
  {
    question: "Are these Halloween trivia questions OK for kids?",
    answer: "Yes. The questions are spooky-fun rather than gory, and the Easy level works for children from about eight with multiple choice switched on. Every answer has a short explanation, so a wrong guess still teaches something.",
  },
  {
    question: "How do I run a Halloween trivia game at a party or in class?",
    answer: "Press Host mode to put the question on a big screen with a countdown timer and a scoreboard for 2 to 8 teams. Play a round of easy questions, then medium, then a hard final round. Questions never repeat within a game.",
  },
  {
    question: "Where did the jack-o'-lantern come from?",
    answer: "From Irish and Scottish folklore, where people carved faces into turnips and other root vegetables at the end of October. Immigrants in North America switched to pumpkins, which are larger and easier to carve.",
  },
  {
    question: "Can I print these Halloween trivia questions?",
    answer: "Yes. The full list with answers is on this page; open the questions you want and use your browser's print. For a paperless game, use the generator above instead and keep the answers hidden until you reveal them.",
  },
];

export default function HalloweenTriviaPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Halloween Trivia"
      heading={["Halloween", "Trivia"]}
      intro={`${COUNT} spooky trivia questions and answers. Draw one, play multiple choice, or host a Halloween quiz with a timer and team scores.`}
      description={DESCRIPTION}
      updated="2026-10-14"
      faq={FAQ}
      related={[
        { href: "/trivia-questions", label: "All trivia questions" },
        { href: "/charades", label: "Charades generator" },
        { href: "/paranoia-questions", label: "Paranoia questions" },
        { href: "/topics/questions-to-ask-at-a-party", label: "Questions to ask at a party" },
      ]}
      afterTool={
        <>
          <TriviaHero src="/art/trivia/halloween-hero.jpg" alt="Illustrated jack-o'-lantern, candy bowl and trivia question cards under a crescent moon" variant="halloween" />
          <TriviaList
            heading={`All ${COUNT} Halloween Trivia Questions and Answers`}
            intro="Sorted from easy to hard. Tap a question to reveal the answer and the story behind it."
            groups={LIST}
          />
        </>
      }
      inShort={
        <>
          These {COUNT} Halloween trivia questions cover folklore, the history of the holiday, candy, pumpkins and classic monsters, each with
          an answer and a one-line explanation. Play them one at a time with multiple choice, or open host mode for a timed team quiz.
        </>
      }
      content={
        <>
          <SectionTitle>A Halloween quiz that runs itself</SectionTitle>
          <p>
            Printing a list of <strong>Halloween trivia questions</strong> means someone has to read, hide the answers and keep score on paper.
            Here the game is ready in the first screen: press <strong>Next question</strong>, let players guess from four options or shout an open
            answer, then reveal. Host mode puts it on the big screen with a countdown and a scoreboard for up to eight teams, which makes it an
            easy activity for a classroom party, an office potluck or a family night before trick-or-treating.
          </p>
          <SectionTitle>What&apos;s in the deck</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Folklore:</strong> why jack-o&apos;-lanterns started as turnips, the legend of Stingy Jack, black cats and bats.</li>
            <li><strong>History of the holiday:</strong> the Celtic festival of Samhain, where the word &quot;Halloween&quot; comes from, and how trick-or-treating spread.</li>
            <li><strong>Candy and pumpkins:</strong> the history of candy corn, pumpkin seeds and flowers, and why a pumpkin is botanically a fruit.</li>
            <li><strong>Classic monsters:</strong> the novels behind Dracula (1897), Frankenstein (1818) and the Headless Horseman (1820), plus werewolf and mummy lore.</li>
          </ul>
          <SectionTitle>Tips for a spooky trivia round</SectionTitle>
          <p>
            Dim the lights and set the timer to 15 seconds for the easy round, 30 for the hard one. Give a bonus point for the best costume on each
            team, and let the losing team pick the next round&apos;s difficulty. Between rounds, act out monsters with the{" "}
            <Link href="/charades" className={linkClass}>charades generator</Link> or switch to the year-round{" "}
            <Link href="/trivia-questions" className={linkClass}>trivia questions</Link> in ten categories.
          </p>
          <p>
            Every question is written in-house, sticks to facts that won&apos;t change, and avoids film plot details beyond titles and years. Each
            answer comes with the basis for it, so you can settle arguments before the candy runs out.
          </p>
        </>
      }
    >
      <TriviaGame bank="halloween" seed={20261031} />
    </GeneratorPageShell>
  );
}
