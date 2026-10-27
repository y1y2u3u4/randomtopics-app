import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import DiceRoller from "@/components/generators/DiceRoller";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/dice-roller";
const TITLE = "Dice Roller — Roll 1 to 10 Dice Online (d4, d6, d8, d10, d12, d20)";
const DESCRIPTION =
  "Free online dice roller: roll 1 to 10 dice with 4, 6, 8, 10, 12, 20 or 100 sides, add a modifier and see every die plus the total. Fair random rolls for board games, D&D and homework.";

const SOCIAL = generatorSocial({ card: "dice-roller", title: TITLE, description: DESCRIPTION, alt: "Dice Roller — a handful of dice" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["dice roller", "roll dice online", "online dice", "d20 roller", "roll a die", "virtual dice", "dice roller d&d", "2d6 roller"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How do I roll dice online?",
    answer: "Choose how many dice (1 to 10) and how many sides, add a modifier if your game uses one, then press Roll. You see each die and the total. Press again for a new roll; the last few rolls are listed underneath.",
  },
  {
    question: "Are the dice rolls fair?",
    answer: "Yes. Every die is drawn separately from your device's secure random generator and each face has the same chance. Dice do not remember earlier rolls, so streaks of the same number are normal.",
  },
  {
    question: "Which dice can I roll?",
    answer: "d4, d6, d8, d10, d12, d20 and d100 (percentile). That covers standard board games and every die in a tabletop role-playing set. Six-sided dice are shown with classic pip faces.",
  },
  {
    question: "What does 2d6+3 mean?",
    answer: "Roll two six-sided dice, add them together, then add 3. Choose 2 dice, d6 and a +3 modifier to roll it. The button label shows the notation you are about to roll.",
  },
  {
    question: "What is the chance of rolling a 7 with two dice?",
    answer: "One in six (16.7%). Seven can be made six ways out of 36 combinations, more than any other total, which is why it is so common in games like Monopoly and Catan. Snake eyes (2) and boxcars (12) each come up once in 36 rolls.",
  },
  {
    question: "Can I roll a d20 for D&D?",
    answer: "Select 1 die, pick d20 and add your ability or proficiency modifier. A natural 20 is a one-in-twenty roll (5%), and so is a natural 1.",
  },
];

export default function DiceRollerPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Dice Roller"
      heading={["Dice", "Roller"]}
      intro="Roll up to ten dice, from d4 to d100, add a modifier and get the total."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Pick the number of dice (1 to 10), the sides (d4, d6, d8, d10, d12, d20 or d100) and an optional modifier, then press Roll. Each die is shown on its own with the total under it. Rolls come from a secure random source, so every face is equally likely."
      related={[
        { href: "/flip-a-coin", label: "Flip a coin" },
        { href: "/random-number-generator", label: "Random number generator" },
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/fantasy-name-generator", label: "Fantasy name generator" },
        { href: "/decision-maker", label: "Decision maker" },
      ]}
      content={
        <>
          <SectionTitle>Dice notation in 30 seconds</SectionTitle>
          <p>
            Tabletop games write a roll as <strong>NdS+M</strong>: N dice with S sides, plus a modifier M. So <strong>3d6</strong> is three six-sided dice added together, and <strong>1d20+5</strong> is a single
            twenty-sided die with 5 added. Set the three controls above to match and the button shows the same notation.
          </p>
          <SectionTitle>Which die for which job</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>d6</strong> — the standard die for Monopoly, Yahtzee, Catan and most family games. Two dice give totals from 2 to 12.</li>
            <li><strong>d20</strong> — role-playing checks and attacks. High is good, with natural 20 and natural 1 as special cases in many games.</li>
            <li><strong>d4, d8, d10, d12</strong> — damage and hit points: daggers, swords, greatswords and so on.</li>
            <li><strong>d100</strong> — percentile rolls for tables and chances; same as rolling two d10s as tens and units.</li>
          </ul>
          <SectionTitle>Odds worth knowing</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>Two d6: 7 is the most likely total at 1 in 6; 2 and 12 are 1 in 36 each.</li>
            <li>One d20: each number is 5%; rolling 15 or higher is 30%.</li>
            <li>Three d6 (3d6) bunch around 10 and 11, which makes ability scores in many games cluster near the middle.</li>
          </ul>
          <p>
            Need a single number in a custom range, or a lottery-style draw? Use the <Link prefetch={false} href="/random-number-generator" className={linkClass}>random number generator</Link>.
            For heads or tails, <Link prefetch={false} href="/flip-a-coin" className={linkClass}>flip a coin</Link>. Running a campaign? Name your characters with the{" "}
            <Link prefetch={false} href="/fantasy-name-generator" className={linkClass}>fantasy name generator</Link>.
          </p>
        </>
      }
    >
      <DiceRoller />
    </GeneratorPageShell>
  );
}
