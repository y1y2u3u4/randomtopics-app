import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import Magic8Ball from "@/components/generators/Magic8Ball";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import { CLASSIC_ANSWERS, DAILY_QUESTIONS, classicOdds } from "@/lib/magic8";
import { QUESTION_IDEAS } from "@/data/magic8";

const PATH = "/magic-8-ball";
const TITLE = "Magic 8 Ball — Shake Online, All 20 Answers & Daily Question";
const DESCRIPTION =
  "Ask the Magic 8 Ball a yes or no question and shake it online. All 20 classic answers, add your own custom answers, save a shareable result card, and get a new question of the day with a streak.";

const SOCIAL = generatorSocial({ card: "magic-8-ball", title: TITLE, description: DESCRIPTION, alt: "Magic 8 Ball — shake the ball for an answer" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "magic 8 ball", "magic eight ball", "magic 8 ball online", "8 ball answers", "magic 8 ball answers",
    "ask the magic 8 ball", "yes or no 8 ball", "magic 8 ball list of answers", "shake magic 8 ball",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const odds = classicOdds();
const KIND_LABEL = { yes: "Affirmative", maybe: "Non-committal", no: "Negative" } as const;

const FAQ = [
  {
    question: "How do I use the Magic 8 Ball online?",
    answer: "Think of a yes or no question, type it in the box if you like, then tap the ball or press Shake the ball. It shakes for about a second and shows one of 20 answers in the window. Tap again to ask a new question.",
  },
  {
    question: "What are all 20 Magic 8 Ball answers?",
    answer: `There are ${odds.yes} affirmative answers, ${odds.maybe} non-committal and ${odds.no} negative: ${CLASSIC_ANSWERS.map((a) => a.text).join("; ")}. The full list is in the table on this page.`,
  },
  {
    question: "Is the Magic 8 Ball really random?",
    answer: "Here it is. Every shake picks one answer at random from the pool with equal odds, so each of the 20 classic answers comes up about 5% of the time. It does not look at your question and it does not remember earlier answers. It is for fun and not a way to decide anything important.",
  },
  {
    question: "What are the odds of a yes, a no or a maybe?",
    answer: `With the 20 classic answers, 10 of 20 are affirmative (50%), 5 of 20 are non-committal (25%) and 5 of 20 are negative (25%). So the ball leans yes. If you add custom answers, the odds change because your answers join the pool.`,
  },
  {
    question: "Can I add my own answers?",
    answer: "Yes. Open Custom answers, type a reply and press Add. You can keep up to 30, mix them with the 20 classics or switch to Use only mine for a party version. They are saved in your browser on this device and are never uploaded.",
  },
  {
    question: "What if I ask a question that is not yes or no?",
    answer: "The ball still answers, but the replies were written for yes or no questions, so open questions like \"What should I eat?\" give odd results. Rephrase it as \"Should I eat pizza?\" or use the decision maker for choices between several options.",
  },
  {
    question: "Can I shake it on my phone?",
    answer: "Tap the ball or the Shake button. The page does not ask for motion sensor access, so there is no permission pop-up.",
  },
  {
    question: "Why does it say Ask again later? Can I get a real answer?",
    answer: "Five of the 20 answers are non-committal, such as Reply hazy, try again. That is part of the toy. Just shake again; each shake is independent.",
  },
  {
    question: "What is the question of the day?",
    answer: "Each day (UTC) the page shows one yes or no question, and everyone who asks gets the same answer. You can ask once per day. Come back on consecutive days to build a streak, which is saved only in your browser.",
  },
  {
    question: "Can I share my answer?",
    answer: "Yes. After an answer appears, use Share to send the text, Copy to paste it, or Save image to create a square card of the ball with your question and answer.",
  },
  {
    question: "Does it work without cookies or an account?",
    answer: "It works with no sign-in. If your browser blocks local storage, the ball still works, but your custom answers and streak will not be remembered.",
  },
  {
    question: "Is this the official Magic 8 Ball?",
    answer: "No. This is an unofficial fan version for fun. Magic 8 Ball is a trademark of its owner, and this site is not affiliated with Mattel. It uses the widely published 20 answers and its own artwork.",
  },
];

export default function Magic8BallPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Magic 8 Ball"
      heading={["Magic 8 Ball", "Online"]}
      intro="Ask a yes or no question and shake the ball. You get one of the 20 classic answers, or one of your own. Add custom answers for party games, save a shareable result card, and come back for a new question of the day."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort={`This online Magic 8 Ball gives one of the 20 classic answers (${odds.yes} yes, ${odds.maybe} maybe, ${odds.no} no) at random each shake. Add your own answers, save a result card, or ask the daily question to build a streak. It is for fun only.`}
      related={[
        { href: "/decision-maker", label: "Decision maker" },
        { href: "/yes-or-no-wheel", label: "Yes or no wheel" },
        { href: "/wheel-of-names", label: "Wheel of names" },
        { href: "/dice-roller", label: "Dice roller" },
        { href: "/truth-or-dare", label: "Truth or dare" },
        { href: "/random-pokemon-generator", label: "Random Pokémon generator" },
      ]}
      content={
        <>
          <SectionTitle>All 20 Magic 8 Ball answers</SectionTitle>
          <p>
            The classic ball has {odds.total} answers: {odds.yes} affirmative, {odds.maybe} non-committal and {odds.no} negative. Each is equally likely, which is why the ball says yes about half the time.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" data-m8-answers>
              <thead>
                <tr className="text-[var(--text-primary)]">
                  <th className="py-2 pr-4 font-semibold">Type</th>
                  <th className="py-2 pr-4 font-semibold">Answers</th>
                  <th className="py-2 font-semibold">Chance</th>
                </tr>
              </thead>
              <tbody>
                {(["yes", "maybe", "no"] as const).map((k) => (
                  <tr key={k} className="border-t border-white/10 align-top">
                    <td className="py-2 pr-4 whitespace-nowrap">{KIND_LABEL[k]}</td>
                    <td className="py-2 pr-4">{CLASSIC_ANSWERS.filter((a) => a.kind === k).map((a) => a.text).join(", ")}</td>
                    <td className="py-2 whitespace-nowrap">{odds[k] * 5}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionTitle>What to ask the Magic 8 Ball</SectionTitle>
          <p>It works best with questions that have a yes or no answer and a bit of humour. A few ideas:</p>
          <ul className="list-disc pl-5 space-y-1">
            {QUESTION_IDEAS.map((g) => (
              <li key={g.theme}><strong>{g.theme}</strong> — {g.items.join(" · ")}</li>
            ))}
          </ul>
          <p>The question of the day draws from a bank of {DAILY_QUESTIONS.length} questions, so it does not repeat for more than two months.</p>

          <SectionTitle>Make it a party game</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Custom answer mode</strong> — add ten silly replies, switch to Use only mine, and pass the phone around. Great for birthdays and classrooms.</li>
            <li><strong>Fortune-teller round</strong> — one player asks, another reads the answer in a dramatic voice.</li>
            <li><strong>Settle small debates</strong> — which movie, who pays, who goes first. For choices with more than two options, use the <Link prefetch={false} href="/decision-maker" className={linkClass}>decision maker</Link> or the <Link prefetch={false} href="/yes-or-no-wheel" className={linkClass}>yes or no wheel</Link>.</li>
            <li><strong>Icebreaker</strong> — ask the ball a question about the person next to you, then they explain why it is right or wrong.</li>
            <li><strong>Kids</strong> — a harmless way to practise asking yes or no questions.</li>
          </ul>

          <SectionTitle>How this online version works</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Random pick</strong> — every shake chooses one answer from the pool with equal odds, using your browser&rsquo;s random number generator.</li>
            <li><strong>No motion permission</strong> — tap the ball. Nothing asks to use your phone sensors.</li>
            <li><strong>Reduced motion</strong> — if your device asks for reduced motion, the shake is skipped and the answer appears at once.</li>
            <li><strong>Privacy</strong> — your question is not sent anywhere. Custom answers and your streak stay in your browser.</li>
            <li><strong>Result card</strong> — Save image makes a square picture with the ball, your question and the answer.</li>
          </ul>

          <p className="rounded-xl border border-white/10 p-3 text-xs" data-m8-disclaimer>
            <strong className="text-[var(--text-primary)]">Disclaimer:</strong> For entertainment only. Answers are random and are not advice. Unofficial fan version, not affiliated with or endorsed by Mattel or the owner of the Magic 8 Ball trademark.
          </p>
        </>
      }
    >
      <Magic8Ball />
    </GeneratorPageShell>
  );
}
