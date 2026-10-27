import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import NumberRandomizer from "@/components/generators/NumberRandomizer";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/random-number-generator";
const TITLE = "Random Number Generator — Pick Numbers Between Any Range";
const DESCRIPTION =
  "Free random number generator: choose a minimum and maximum, how many numbers you need, and whether repeats are allowed. Generate 1 to 1,000 numbers at once, sort them, copy them and share the setup.";

const SOCIAL = generatorSocial({ card: "random-number-generator", title: TITLE, description: DESCRIPTION, alt: "Random Number Generator — numbered tiles" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random number generator", "random number", "number generator", "random number between", "random number 1-100", "random number picker", "rng"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How do I generate a random number between 1 and 100?",
    answer:
      "Press the 1–100 preset, or type 1 in From and 100 in To and press Generate. Each number from 1 to 100 has the same 1-in-100 chance. Change 'How many' to get several numbers at once.",
  },
  {
    question: "Can I get random numbers with no repeats?",
    answer:
      "Yes. 'No repeats' is on by default, so every number in a batch is different, like drawing numbered tickets from a hat. Turn it off if you want each number drawn independently, as with dice or a lottery machine that returns balls.",
  },
  {
    question: "Is this a true random number generator?",
    answer:
      "It is a pseudo-random generator seeded fresh each time you press Generate, which is the right tool for games, raffles, classroom picks and testing. Do not use it for passwords, encryption keys or anything where an attacker could gain from predicting the result.",
  },
  {
    question: "How many random numbers can I generate at once?",
    answer:
      "Up to 1,000 per click, from any range up to plus or minus one billion. With No repeats on, you can never ask for more numbers than the range contains (for example, 11 unique numbers between 1 and 10).",
  },
  {
    question: "Can I generate negative numbers or decimals?",
    answer:
      "Negative whole numbers work: set From to -50 and To to 50. This generator produces whole numbers only. For a decimal, generate a whole number in a larger range and divide it, for example 0 to 1000 divided by 10.",
  },
  {
    question: "How do I share or repeat the same settings?",
    answer: "After you generate, press 'Copy link to this setup'. The link contains your range, count and options, so a friend or a lesson plan opens with the same tool ready to press.",
  },
];

export default function RandomNumberGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Number Generator"
      heading={["Random Number", "Generator"]}
      intro="Choose a range, say how many numbers you need and press Generate. Allow repeats or draw each number only once."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Enter a minimum and maximum, choose how many numbers you want and press Generate. With No repeats on, each number appears once; turn it off for dice-style rolls. Presets cover 1–10, 1–100, 0–9, a coin flip and a million-number range, and results can be sorted, copied and shared as a link."
      related={[
        { href: "/number-randomizer", label: "Number randomizer" },
        { href: "/dice-roller", label: "Dice roller" },
        { href: "/flip-a-coin", label: "Flip a coin" },
        { href: "/random-letter-generator", label: "Random letter generator" },
        { href: "/wheel-of-names", label: "Wheel of names" },
      ]}
      content={
        <>
          <SectionTitle>Everyday uses for a random number generator</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Raffles and giveaways</strong> — number the entries, set the range and draw winners with No repeats on so nobody wins twice.</li>
            <li><strong>Classroom</strong> — call student number 1–30, pick a question or page, or build a quick maths worksheet from random operands.</li>
            <li><strong>Board games and tabletop</strong> — use the <em>d20</em> preset for a single roll, or the <Link prefetch={false} href="/dice-roller" className={linkClass}>dice roller</Link> when you need several dice added together.</li>
            <li><strong>Lottery-style picks</strong> — ask for 6 unique numbers between 1 and 49 (or whatever your game uses) and sort them.</li>
            <li><strong>Testing and sampling</strong> — pull random row numbers to spot-check a spreadsheet, or random IDs for a quick test.</li>
          </ul>
          <SectionTitle>What the options mean</SectionTitle>
          <p>
            <strong>From / To</strong> are inclusive, so 1 to 6 can return 1 and 6. <strong>How many</strong> is the batch size. <strong>No repeats</strong> removes a number from the hat
            once it is drawn; switch it off and each result is independent, so 7, 7, 7 is possible, and just as likely as any other sequence. <strong>Sort results</strong> puts the batch in
            ascending order, which is handy for lottery tickets and for reading long lists.
          </p>
          <SectionTitle>Random does not mean evenly spread</SectionTitle>
          <p>
            Short runs of random numbers often look suspicious: repeats, clusters, long gaps. That is normal. A fair generator has no memory, so a number that has not come up
            for 20 draws is no more &lsquo;due&rsquo; than any other. If you need numbers spread out, draw more than you need, then pick a spread from the sorted list.
          </p>
          <p>
            Looking for the original page with the same engine? It lives at <Link prefetch={false} href="/number-randomizer" className={linkClass}>number randomizer</Link>.
            To choose between people instead of numbers, use the <Link prefetch={false} href="/wheel-of-names" className={linkClass}>wheel of names</Link>.
          </p>
        </>
      }
    >
      <NumberRandomizer variant="generator" />
    </GeneratorPageShell>
  );
}
