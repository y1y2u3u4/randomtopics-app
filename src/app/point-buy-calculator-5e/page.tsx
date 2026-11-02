import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import PointBuyCalculator from "@/components/generators/PointBuyCalculator";
import { MAX_SCORE, MIN_SCORE, POINT_BUDGET, POINT_COST, fmtMod, modifier } from "@/lib/generators/pointBuy";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/point-buy-calculator-5e";
const TITLE = "Point Buy Calculator 5e — 27 Points, Modifiers & 2024/2014 Bonuses";
const DESCRIPTION =
  "Free D&D 5e point buy calculator: spend 27 points on six ability scores (8 to 15), see cost, final score and modifier live, add background or race bonuses for the 2024 or 2014 rules, and compare with the standard array.";

const SOCIAL = generatorSocial({ card: "dnd-name-generator", title: TITLE, description: DESCRIPTION, alt: "5e point buy calculator with modifiers" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["point buy calculator 5e", "5e point buy calculator", "dnd point buy", "dnd 5e point buy", "point buy 27 points", "dnd ability score calculator", "5e point buy cost table", "2024 point buy"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How does point buy work in D&D 5e?",
    answer:
      "You get 27 points to spend. All six ability scores start at 8, and you raise them one step at a time, up to a maximum of 15 before bonuses. Each step costs 1 point up to 13; going from 13 to 14 costs 2 more, and from 14 to 15 another 2. Your background (2024) or race (2014) bonuses are added afterwards.",
  },
  {
    question: "What does each score cost in point buy?",
    answer:
      "The total cost from a base of 8 is: 8 = 0, 9 = 1, 10 = 2, 11 = 3, 12 = 4, 13 = 5, 14 = 7 and 15 = 9 points. A 15 costs 9 points, so three 15s use all 27 points and leave the other three scores at 8.",
  },
  {
    question: "Can I use fewer than 27 points?",
    answer:
      "Yes, you can leave points unspent, but there is no reward for saving them, so most players spend every point. This calculator tells you when you are over budget and shows how many points are left.",
  },
  {
    question: "Is the point buy the same in the 2024 and 2014 rules?",
    answer:
      "The 27-point budget and the cost table are identical. What changed is where the bonuses come from: in the 2014 rules your race adds to scores, while in the 2024 rules your background lets you add +2 to one ability and +1 to another, or +1 to three. Either way no score may go above 20.",
  },
  {
    question: "Is the standard array better than point buy?",
    answer:
      "The standard array (15, 14, 13, 12, 10, 8) costs exactly 27 points, so it is one of the legal point buy builds. Point buy is more flexible: you can choose, for example, 15, 15, 15, 8, 8, 8, or an even spread like 13, 13, 13, 12, 12, 12. Use the preset buttons above to compare them.",
  },
  {
    question: "What is the best point buy for my class?",
    answer:
      "Put the biggest score in your class's main ability (Strength, Dexterity, Intelligence, Wisdom or Charisma depending on the class), then put your next-best score in Constitution for hit points. A score of 8 in a stat you will rarely use is a fair trade. The Fighter, Rogue, Wizard and Cleric presets show four typical spreads.",
  },
];

export default function PointBuyPage() {
  const rows = Object.entries(POINT_COST).map(([score, cost]) => ({ score: Number(score), cost }));
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Point Buy Calculator 5e"
      heading={["Point Buy Calculator", "5e"]}
      intro="This point buy calculator for D&D 5e lets you spend your 27 points on six ability scores, then add 2024 background or 2014 race bonuses to see final scores and modifiers instantly. Free, no sign-up."
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A 5e point buy calculator tracks the 27 points you spend on ability scores. Every score starts at 8 and can be raised to 15, with
          costs of 1 point per step up to 13, then 2 per step for 14 and 15. This tool shows your remaining points, adds 2024 background or
          2014 race bonuses, and prints each final score and modifier. It is free and needs no sign-up.
        </>
      }
      related={[
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/dice-roller", label: "Dice roller" },
        { href: "/fantasy-name-generator", label: "Fantasy name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
      ]}
      content={
        <>
          <SectionTitle>The point buy rules in plain words</SectionTitle>
          <p>
            In D&amp;D 5e, <strong>point buy</strong> is the method of building a character without rolling dice. You have {POINT_BUDGET} points. All six
            scores start at {MIN_SCORE}, and you may raise any score to at most {MAX_SCORE} before bonuses. The cost rises as the score gets
            higher: one point per step up to 13, and two points per step after that. Once you have spent your points, you add the bonuses from your
            background or race, and the modifier follows from the final score: subtract 10, divide by 2 and round down.
          </p>
          <SectionTitle>Point buy cost table</SectionTitle>
          <div className="not-prose overflow-x-auto">
            <table className="w-full max-w-md text-sm border-collapse">
              <thead>
                <tr className="text-left text-[var(--text-muted)] text-xs uppercase tracking-wide">
                  <th className="py-1.5 pr-4">Base score</th><th className="py-1.5 pr-4">Total cost</th><th className="py-1.5">Modifier</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.score} className="border-t border-white/10 text-[var(--text-secondary)]">
                    <td className="py-1.5 pr-4 font-semibold text-[var(--text-primary)]">{r.score}</td>
                    <td className="py-1.5 pr-4">{r.cost} point{r.cost === 1 ? "" : "s"}</td>
                    <td className="py-1.5">{fmtMod(modifier(r.score))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SectionTitle>2024 background bonuses vs 2014 race bonuses</SectionTitle>
          <p>
            Under the <strong>2014 rules</strong> your race sets the bonus: a mountain dwarf adds +2 Strength and +2 Constitution, a
            lightfoot halfling +2 Dexterity and +1 Charisma, and a human +1 to everything. Under the <strong>2024 rules</strong> species no longer give ability
            scores. Instead your background names three abilities, and you add +2 to one and +1 to another, or +1 to all three. The calculator
            lets you pick which scores get the bonus; if your background only offers three abilities, choose among those. No final score
            can exceed 20.
          </p>
          <SectionTitle>How to spend 27 points</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>One or two big scores:</strong> a 15 in your main ability is great, and the bonus often takes it to 17.</li>
            <li><strong>Always check Constitution:</strong> it feeds your hit points, so even casters like a 13 or 14.</li>
            <li><strong>Even numbers are efficient:</strong> a 15 gives the same +2 as a 14 but costs 2 more points, so many builds use 14.</li>
            <li><strong>Dump with purpose:</strong> an 8 gives −1 and frees up points; choose the stat your character least needs.</li>
            <li><strong>Pick a build and adjust:</strong> the presets are all legal 27-point builds you can start from.</li>
          </ul>
          <SectionTitle>Next steps for your character</SectionTitle>
          <p>
            Once your scores are set, give your hero a name with the{" "}
            <Link prefetch={false} href="/dnd-name-generator" className={linkClass}>D&amp;D name generator</Link>, or browse the{" "}
            <Link prefetch={false} href="/fantasy-name-generator" className={linkClass}>fantasy name generator</Link> and{" "}
            <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link> for more ideas. If your table prefers rolling to
            buying, the <Link prefetch={false} href="/dice-roller" className={linkClass}>dice roller</Link> can roll 4d6 and drop the lowest.
          </p>
        </>
      }
    >
      <PointBuyCalculator />
    </GeneratorPageShell>
  );
}
