import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import NumberRandomizer from "@/components/generators/NumberRandomizer";
import QuickSet, { QuickRow } from "@/components/generators/QuickSet";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/number-randomizer";
const TITLE = "Number Randomizer — Pick a Number 1 or 2, 1–10, 1–100 & Any Range";
const DESCRIPTION =
  "Free number randomizer: pick one or up to 1,000 random numbers in any range, with or without repeats, sorted or not. Presets for 1–10, 1–100, 1–1000 and dice. Raffles, classroom picks, games. No signup.";

const SOCIAL = generatorSocial({ card: "number-randomizer", title: TITLE, description: DESCRIPTION, alt: "Number randomizer — random numbers in a range" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["number randomizer", "random number picker", "number picker", "random number between 1 and 100", "random number generator no repeats", "pick a random number", "raffle number generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I pick a random number between 1 and 100?", answer: "Press the 1–100 preset, or type 1 in From and 100 in To, then press Generate. Each number in the range has the same chance." },
  { question: "Can I get several numbers with no repeats?", answer: "Yes. Set How many (up to 1,000) and keep No repeats on: every number appears at most once, like drawing raffle tickets. Turn it off for independent draws, like rolling dice." },
  { question: "Is it truly random?", answer: "It uses your browser's random number source with an unbiased method for whole numbers, which is fair for games, classroom picks and informal raffles. For regulated lotteries, use the method your rules require." },
  { question: "Can I share the same settings?", answer: "Yes — after generating, Copy link to this setup copies a link with your range, count and repeat setting so others can draw with the same rules." },
  { question: "What is the largest range?", answer: "From −1,000,000,000 to 1,000,000,000, and up to 1,000 numbers per draw." },
  { question: "How do I pick a number 1 or 2?", answer: "Tap the 1 or 2 button. It draws 1 or 2 with an equal 50% chance and shows it in large type. Press Space or Enter to pick again, and read the History line to see your last picks." },
  { question: "Can I pick a random number between 1 and 3 or 1 and 10?", answer: "Yes. Tap 1–3 or 1–10, or type your own From and To. The range is inclusive, so 1–3 can return 1, 2 or 3 with a one-in-three chance each." },
  { question: "How do I get lottery-style numbers?", answer: "Tap Lottery 6/49. It draws 6 different numbers from 1 to 49 and sorts them. Change From, To and How many for other games. It is a fair random pick, not a prediction: every combination is equally likely." },
  { question: "What does Never repeat across clicks do?", answer: "With it on, a number that was already shown in this range will not appear again until every number in the range has been used, then the pool refills. Use it to call students or tickets one by one without repeats." },
];

export default function NumberRandomizerPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Number Randomizer"
      heading={["Number", "Randomizer"]}
      intro="Random numbers in any range — one or a thousand, with or without repeats. Presets for 1–10, 1–100 and dice."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Set the range and how many numbers you need, then press Generate. Keep No repeats on for raffle-style draws, or turn it off for dice-style rolls. Results can be sorted and copied, and a link shares the same settings. It is free, needs no signup, and handles up to 1,000 numbers at once."
      related={[
        { href: "/random-name-picker", label: "Random name picker" },
        { href: "/random-letter-generator", label: "Random letter generator" },
        { href: "/random-team-generator", label: "Random team generator" },
        { href: "/spin-the-wheel", label: "Spin the wheel" },
        { href: "/decision-maker", label: "Decision maker" },
        { href: "/random-number-generator", label: "Random number generator" },
      ]}
      content={
        <>
          <SectionTitle>Ideas</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Raffles</strong> — number the tickets, set the range and draw winners with no repeats.</li>
            <li><strong>Classroom</strong> — call on student number 1–30, choose a question number from a worksheet, or pick a page to read.</li>
            <li><strong>Games</strong> — the Dice preset rolls 1–6; turn No repeats off and ask for 2 numbers to roll two dice.</li>
            <li><strong>Math practice</strong> — generate numbers to add, multiply or sort, then check with Sort results.</li>
          </ul>
          <SectionTitle>Pick a number 1 or 2</SectionTitle>
          <p>
            The fastest way to settle a two-way choice: option 1 or option 2. Decide beforehand which choice is which, press the button and accept the number. For three
            choices use 1–3. If you need a yes or no instead, try the <Link prefetch={false} href="/yes-or-no-wheel" className={linkClass}>yes or no wheel</Link>.
          </p>
          <QuickRow>
            <QuickSet tool="numbers" id="1-2">Pick 1 or 2</QuickSet>
            <QuickSet tool="numbers" id="1-3">Pick 1, 2 or 3</QuickSet>
          </QuickRow>
          <SectionTitle>Random number 1 to 10 and 1 to 100</SectionTitle>
          <p>
            1 to 10 suits a quick pick: which question, which turn, how many steps. 1 to 100 suits percentages, a guess-the-number game or a class of up to 100 students. Every
            number in the range has the same chance, so with 1–100 each draw is a 1-in-100 shot.
          </p>
          <QuickRow>
            <QuickSet tool="numbers" id="1-10">Random 1–10</QuickSet>
            <QuickSet tool="numbers" id="1-100">Random 1–100</QuickSet>
          </QuickRow>
          <SectionTitle>Lottery numbers and dice rolls</SectionTitle>
          <p>
            Lottery 6/49 draws six different numbers between 1 and 49 and sorts them, the way a ticket is usually filled in. The dice button rolls one six-sided die; turn off
            No repeats in a batch and set How many to 2 to roll two dice. Example: a 6/49 pick might read 4, 11, 23, 27, 38, 45, and any other six numbers are exactly as
            likely.
          </p>
          <QuickRow>
            <QuickSet tool="numbers" id="lottery">Lottery 6/49</QuickSet>
            <QuickSet tool="numbers" id="dice">Roll a die</QuickSet>
          </QuickRow>
          <SectionTitle>Which repeat setting should I use?</SectionTitle>
          <table className="w-full text-left text-sm border-collapse">
            <thead><tr className="border-b border-white/10"><th className="py-1.5 pr-3">Setting</th><th className="py-1.5 pr-3">What it does</th><th className="py-1.5">Good for</th></tr></thead>
            <tbody>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3">No repeats in a batch</td><td className="pr-3">Each number once per click</td><td>Raffles, lottery picks, ordering a list</td></tr>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3">Never repeat across clicks</td><td className="pr-3">Numbers stay out until the range is used up</td><td>Calling students, drawing tickets one at a time</td></tr>
              <tr><td className="py-1.5 pr-3">Both off</td><td className="pr-3">Every draw is independent</td><td>Dice, coin-style picks, simulations</td></tr>
            </tbody>
          </table>
          <SectionTitle>Picking names instead?</SectionTitle>
          <p>Paste the names into the <Link prefetch={false} href="/random-name-picker" className={linkClass}>random name picker</Link>; it removes winners so nobody is picked twice. Can&apos;t choose between more than two options? Try the <Link prefetch={false} href="/decision-maker" className={linkClass}>decision maker</Link> or <Link prefetch={false} href="/spin-the-wheel" className={linkClass}>spin the wheel</Link>. Need a number with a wider range or presets like 1–1,000,000? Use the <Link prefetch={false} href="/random-number-generator" className={linkClass}>random number generator</Link>.</p>
        </>
      }
    >
      <NumberRandomizer />
    </GeneratorPageShell>
  );
}
