import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import NumberRandomizer from "@/components/generators/NumberRandomizer";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/number-randomizer";
const TITLE = "Number Randomizer — Random Number Picker, 1–100 & Any Range";
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
      updated="2026-10-13"
      faq={FAQ}
      inShort="Set the range and how many numbers you need, then press Generate. Keep No repeats on for raffle-style draws, or turn it off for dice-style rolls. Results can be sorted and copied, and a link shares the same settings. It is free, needs no signup, and handles up to 1,000 numbers at once."
      related={[
        { href: "/random-name-picker", label: "Random name picker" },
        { href: "/random-letter-generator", label: "Random letter generator" },
        { href: "/random-team-generator", label: "Random team generator" },
        { href: "/spin-the-wheel", label: "Spin the wheel" },
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
          <SectionTitle>Picking names instead?</SectionTitle>
          <p>Paste the names into the <Link prefetch={false} href="/random-name-picker" className={linkClass}>random name picker</Link>; it removes winners so nobody is picked twice.</p>
        </>
      }
    >
      <NumberRandomizer />
    </GeneratorPageShell>
  );
}
