import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import CoinFlip from "@/components/generators/CoinFlip";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/flip-a-coin";
const TITLE = "Flip a Coin — Heads or Tails, Flip 1 to 10 Coins Online";
const DESCRIPTION =
  "Flip a coin online and get heads or tails instantly. Flip 1, 2, 3, 5 or 10 coins at once and keep count of heads, tails and your longest streak. Fair 50/50 odds, free, no download.";

const SOCIAL = generatorSocial({ card: "flip-a-coin", title: TITLE, description: DESCRIPTION, alt: "Flip a Coin — a gold coin mid-flip" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["flip a coin", "coin flip", "heads or tails", "coin toss", "flip a coin online", "virtual coin flip", "toss a coin"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "Is the online coin flip fair?",
    answer:
      "Yes. Each flip is decided by your device's secure random number generator, giving heads and tails exactly the same 50% chance. Nothing from earlier flips affects the next one, and the animation is only decoration: the result is chosen before the coin appears to land.",
  },
  {
    question: "What are the odds of getting heads several times in a row?",
    answer:
      "Each flip is independent, so the chance of n heads in a row is one half to the power n: 25% for two, 12.5% for three, about 3% for five and roughly 0.1% for ten. Streaks of four or five are normal in a long session. Use the streak counter to see yours.",
  },
  {
    question: "Does a real coin land 50/50?",
    answer: "Very nearly, but not exactly. A study of real coin tosses found a coin tends to land on the side it started on slightly more than half the time, around 51%. A digital flip has no starting side, so it avoids that small bias.",
  },
  {
    question: "Can I flip more than one coin at once?",
    answer: "Yes. Choose 1, 2, 3, 5 or 10 coins. The result shows how many heads and tails came up, and every coin is added to the running totals underneath.",
  },
  {
    question: "How do I use a coin flip to decide something?",
    answer: "Assign each option to a side before you flip (heads = pizza, tails = tacos) and accept the result. If you feel disappointed when it lands, that reaction tells you which option you actually wanted.",
  },
  {
    question: "Can I reset the heads and tails count?",
    answer: "Press 'Reset counts' under the totals, or reload the page. Counts live in your browser tab only and are never sent anywhere.",
  },
];

export default function FlipACoinPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Flip a Coin"
      heading={["Flip a", "Coin"]}
      intro="Heads or tails in one tap. Flip up to ten coins at a time and track heads, tails and streaks."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Press the button to flip a fair coin and see heads or tails. Choose 1, 2, 3, 5 or 10 coins, then watch the running totals, current streak and longest streak. Each flip is a secure 50/50 random choice, free to use with no download or signup."
      related={[
        { href: "/dice-roller", label: "Dice roller" },
        { href: "/yes-or-no-wheel", label: "Yes or no wheel" },
        { href: "/decision-maker", label: "Decision maker" },
        { href: "/random-number-generator", label: "Random number generator" },
        { href: "/wheel-of-names", label: "Wheel of names" },
      ]}
      content={
        <>
          <SectionTitle>When a coin flip is the right tool</SectionTitle>
          <p>
            A <strong>coin flip</strong> is the oldest way to settle a choice between two options without anyone arguing about fairness: who serves first, which route to take,
            whether to order in or cook. Because it is a pure 50/50 chance, both sides can agree to it in advance, and the result is final the moment it lands.
          </p>
          <SectionTitle>How to call it</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Call before you flip.</strong> Decide which option is heads and which is tails first, so nobody can argue afterwards.</li>
            <li><strong>Best of three.</strong> For a bigger decision, flip until one side has two wins; the totals panel keeps score for you.</li>
            <li><strong>Several coins.</strong> Flip 3 or 5 coins when you need an odd number of voters, or to see how many heads show up in a batch.</li>
            <li><strong>More than two options?</strong> Use the <Link prefetch={false} href="/wheel-of-names" className={linkClass}>wheel of names</Link> or the <Link prefetch={false} href="/dice-roller" className={linkClass}>dice roller</Link> instead.</li>
          </ul>
          <SectionTitle>Classroom and maths uses</SectionTitle>
          <p>
            Probability lessons start with coins: flip 10 times, record heads, then flip 100 and watch the share of heads settle near 50%. The stats panel shows the percentage after every flip, so
            students can see the law of large numbers in a few minutes. Short runs wander far from half, and that is exactly the point.
          </p>
          <p>Prefer a yes/no answer to a question? Try the <Link prefetch={false} href="/yes-or-no-wheel" className={linkClass}>yes or no wheel</Link>, or let the <Link prefetch={false} href="/decision-maker" className={linkClass}>decision maker</Link> weigh several options.</p>
        </>
      }
    >
      <CoinFlip />
    </GeneratorPageShell>
  );
}
