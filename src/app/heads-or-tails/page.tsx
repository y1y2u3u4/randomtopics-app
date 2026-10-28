import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import CoinFlip from "@/components/generators/CoinFlip";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/heads-or-tails";
const TITLE = "Heads or Tails — Free Online Coin Flip with Series Score";
const DESCRIPTION =
  "Heads or tails? Flip the coin online, call your side, play best of 3, 5 or 7 and track your streaks and totals. A fair 50/50 coin flip that works on any phone. Free, no signup.";

const SOCIAL = generatorSocial({ card: "heads-or-tails", title: TITLE, description: DESCRIPTION, alt: "Heads or Tails — a gold coin showing heads" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["heads or tails", "heads or tails online", "heads or tails coin flip", "head or tails", "heads or tails game", "heads or tails generator", "coin flip heads or tails"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "Is heads or tails really 50/50?",
    answer: "On this page, yes. The result comes from your device's secure random number generator, so heads and tails each have a 50% chance and earlier flips do not matter. A real coin is a hair off 50/50: a large study found it lands on its starting side about 51% of the time.",
  },
  {
    question: "What are the odds of heads or tails several times in a row?",
    answer: "Halve the chance for each flip: 25% for two in a row, 12.5% for three, about 3% for five and about 0.1% for ten. Over a long session some streaks of four or five are expected. The streak counter shows your longest one.",
  },
  {
    question: "Can a coin land on its edge?",
    answer: "Rarely. Tests on real coins put it at roughly 1 in 6,000 for a thick coin like a US nickel, and much less for thin coins. An online flip always gives heads or tails.",
  },
  {
    question: "How do I play heads or tails with a friend?",
    answer: "One person taps Heads or Tails under the button to call it, then presses Flip. If the coin matches the call, that person wins. For a longer game choose Best of 3, 5 or 7 and the page keeps the score.",
  },
  {
    question: "Why is it called heads and tails?",
    answer: "The head side shows the portrait of a ruler or national figure and the tail side is the back. The game is old: Roman children played it as \"navia aut caput\", ship or head, after the ship on one side of their coins.",
  },
  {
    question: "Does it save my heads and tails history?",
    answer: "The last 30 flips and the totals show under the coin while the page is open. The all-time totals are kept in your own browser only, and you can clear them. Nothing is uploaded.",
  },
  {
    question: "Is it free?",
    answer: "Yes. There is nothing to install, no account to make and no popup in front of the coin.",
  },
];

export default function HeadsOrTailsPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Heads or Tails"
      heading={["Heads or", "Tails"]}
      intro="Heads or tails? Flip the coin, keep score in a best-of series and watch your streaks."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Press Flip to get heads or tails from a fair 50/50 coin. Call your side first, play best of 3, 5 or 7, and see heads and tails percentages, streaks and the last 30 flips. Free, with nothing to download."
      related={[
        { href: "/flip-a-coin", label: "Flip a coin (1 to 10 coins)" },
        { href: "/toss-a-coin", label: "Toss a coin" },
        { href: "/yes-or-no-wheel", label: "Yes or no wheel" },
        { href: "/dice-roller", label: "Dice roller" },
        { href: "/decision-maker", label: "Decision maker" },
      ]}
      content={
        <>
          <SectionTitle>Heads or tails: the quick rules</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Agree what each side means (heads = pizza, tails = tacos).</li>
            <li>One person calls a side. Tap Heads or Tails under the button to record the call.</li>
            <li>Press Flip. If the coin matches the call, the caller wins.</li>
            <li>For a tie-break that feels fairer, play best of 3, 5 or 7.</li>
          </ol>
          <SectionTitle>What the numbers mean</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead><tr className="border-b border-white/10"><th className="py-1 pr-3">Same side in a row</th><th className="py-1 pr-3">Chance</th><th className="py-1">About 1 in</th></tr></thead>
              <tbody>
                <tr className="border-b border-white/5"><td className="py-1 pr-3">2</td><td className="pr-3">25%</td><td>4</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 pr-3">3</td><td className="pr-3">12.5%</td><td>8</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 pr-3">5</td><td className="pr-3">3.1%</td><td>32</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 pr-3">7</td><td className="pr-3">0.8%</td><td>128</td></tr>
                <tr><td className="py-1 pr-3">10</td><td className="pr-3">0.1%</td><td>1,024</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            People expect heads and tails to alternate, so a streak of four feels wrong. It is not. In 100 flips, a run of five or more of one side is likely. Short sessions
            can sit far from 50% and still be fair; the share only settles near half after hundreds of flips.
          </p>
          <SectionTitle>Heads or tails for decisions and classrooms</SectionTitle>
          <p>
            Use heads or tails for two-way choices only: who goes first, which film, which route. With three or more options use the{" "}
            <Link prefetch={false} href="/picker-wheel" className={linkClass}>picker wheel</Link> or the <Link prefetch={false} href="/decision-maker" className={linkClass}>decision maker</Link>.
            Teachers can flip 10, 50 and 100 times and compare the share of heads each time. For several coins at once, see{" "}
            <Link prefetch={false} href="/flip-a-coin" className={linkClass}>flip a coin</Link>; for a cricket-style call, use <Link prefetch={false} href="/toss-a-coin" className={linkClass}>toss a coin</Link>.
          </p>
        </>
      }
    >
      <CoinFlip extended={{ pageId: "heads_or_tails" }} />
    </GeneratorPageShell>
  );
}
