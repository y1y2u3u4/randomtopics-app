import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import CoinFlip from "@/components/generators/CoinFlip";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/toss-a-coin";
const TITLE = "Toss a Coin Online — Call Heads or Tails, Best of 3, Cricket Toss";
const DESCRIPTION =
  "Toss a coin online in one tap. Call heads or tails first, play best of 3, 5 or 7, and see your results and streaks. A fair 50/50 toss for cricket, games and quick decisions. Free, no app, no signup.";

const SOCIAL = generatorSocial({ card: "toss-a-coin", title: TITLE, description: DESCRIPTION, alt: "Toss a Coin — a gold coin in the air with heads and tails" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["toss a coin", "coin toss online", "toss a coin online", "cricket toss", "toss coin heads or tails", "toss a coin best of 3", "online toss"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How do I toss a coin online?",
    answer: "Press the Toss button. The coin spins and lands on Heads or Tails. If you want to call it first, tap Heads or Tails under the button before you toss. The page tells you if you won the toss.",
  },
  {
    question: "Is this toss fair?",
    answer: "Yes. Your phone or computer picks heads or tails with its secure random number generator. Each side has an equal 50% chance, and the last toss does not change the next one. The spinning animation is only for show.",
  },
  {
    question: "Can I use it for the toss in a cricket match?",
    answer: "Yes. In cricket, one captain tosses and the other captain calls heads or tails. The captain who wins the toss chooses to bat or bowl. Set one person to call, press Toss, and the page shows who won. It is useful for gully cricket, school matches and club games when nobody has a coin.",
  },
  {
    question: "How does best of 3 work?",
    answer: "Choose Best of 3, 5 or 7 under the button. The first side to win more than half of the tosses wins the series. In best of 3, that means 2 wins. The score is shown as Heads against Tails, and the button changes to New series when it is over.",
  },
  {
    question: "Does it remember my results?",
    answer: "Your all-time totals (tosses, heads share, calls you got right) are saved in your own browser, so they stay when you come back on the same phone or computer. Nothing is sent to a server. Press Clear under the totals to remove them.",
  },
  {
    question: "Why do I sometimes get the same side many times?",
    answer: "That is normal for random tosses. Getting heads three times in a row happens 1 time in 8. A run of five happens about 1 time in 32. Use the streak counter to see your longest run.",
  },
  {
    question: "Do I need to download an app?",
    answer: "No. It works in the browser on any phone, tablet or computer, and it is free. There is no signup and no popup in front of the coin.",
  },
];

export default function TossACoinPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Toss a Coin"
      heading={["Toss a", "Coin"]}
      intro="Call heads or tails, toss the coin and see who wins. Play best of 3, 5 or 7. Works for a cricket toss."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Tap Toss to throw a fair coin and get heads or tails. Call it first if you want a winner, choose best of 3, 5 or 7 for a series, and read your streaks and all-time totals. Free, no app, no signup."
      related={[
        { href: "/flip-a-coin", label: "Flip a coin (1 to 10 coins)" },
        { href: "/heads-or-tails", label: "Heads or tails" },
        { href: "/dice-roller", label: "Dice roller" },
        { href: "/yes-or-no-wheel", label: "Yes or no wheel" },
        { href: "/picker-wheel", label: "Picker wheel" },
      ]}
      content={
        <>
          <SectionTitle>How a cricket toss works</SectionTitle>
          <p>
            Every cricket match starts with a <strong>toss</strong>. The two captains meet in the middle. One captain tosses the coin in the air and the other captain calls
            &ldquo;heads&rdquo; or &ldquo;tails&rdquo; before it lands. If the call is right, that captain wins the toss and chooses to <strong>bat first or bowl first</strong>.
            In international matches the home captain usually tosses and the visiting captain calls.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Gully and street cricket.</strong> No coin in your pocket? Open this page, tap Heads or Tails to make the call, then press Toss.</li>
            <li><strong>School and office matches.</strong> Everyone can see the screen, so nobody can say the toss was unfair.</li>
            <li><strong>Who bats first, who serves first.</strong> The same toss works for carrom, table tennis, badminton, kabaddi teams and any game with two sides.</li>
          </ul>
          <SectionTitle>Other ways to use a toss</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Settle a small argument.</strong> Say before the toss which option is heads and which is tails. Then accept the result.</li>
            <li><strong>Best of 3, 5 or 7.</strong> For a bigger decision, play a series. The first side to reach the winning number takes it.</li>
            <li><strong>Teaching chance.</strong> Toss 10 times, then 100 times. The share of heads moves close to 50% as the number grows. The all-time totals under the coin show this.</li>
          </ul>
          <SectionTitle>Real coin or online coin?</SectionTitle>
          <p>
            A real coin is slightly biased toward the side that was face-up when it left the thumb. A study of more than 350,000 real tosses found it lands on that side
            about 51% of the time. An online toss has no starting side, so both outcomes are equal. If you want to flip many coins at once, use{" "}
            <Link prefetch={false} href="/flip-a-coin" className={linkClass}>flip a coin</Link>. If you need more than two options, try the{" "}
            <Link prefetch={false} href="/picker-wheel" className={linkClass}>picker wheel</Link>.
          </p>
        </>
      }
    >
      <CoinFlip extended={{ pageId: "toss_a_coin", cricket: true }} />
    </GeneratorPageShell>
  );
}
