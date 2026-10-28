import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import TeamGenerator from "@/components/generators/TeamGenerator";
import QuickSet, { QuickRow } from "@/components/generators/QuickSet";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { createRng, makeTeams } from "@/lib/randomGenerators";
import { makeTeamNames } from "@/lib/generators/teamNames";

const PATH = "/random-team-generator";
const TITLE = "Random Team & Group Generator — Fair, Balanced Groups in One Click";
const DESCRIPTION =
  "Free random team and group generator: paste a list of names and split it into random or balanced teams or groups by number of groups or people per group. Fun team names, lock players, full-screen mode, share link. No signup.";

const SOCIAL = generatorSocial({ card: "random-team-generator", title: TITLE, description: DESCRIPTION, alt: "Random Team & Group Generator — names split into fair teams" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random team generator", "random group generator", "group generator", "random group maker", "random groups for class", "team picker", "team generator", "random team maker", "split into groups", "balanced team generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real splits from the same team logic with fixed seeds.
const CLASS = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Finn", "Grace", "Hiro", "Isla", "Jonah", "Kai", "Luna", "Mateo", "Nia", "Omar", "Priya"];
function exampleSplit(label: string, count: number, mode: "teams" | "size", value: number, seed: number) {
  const people = CLASS.slice(0, count).map((name) => ({ id: name, name }));
  const teams = makeTeams(people, { mode, value }, createRng(seed));
  const names = makeTeamNames(teams.length, "en", createRng(seed + 1));
  return { label, results: teams.map((t, i) => ({ title: names[i], detail: t.map((p) => p.name).join(", ") })) };
}
// A balanced split: eight players with skill levels 1-5, dealt snake-draft style into 2 teams.
const SKILLED = [["Ava", 5], ["Ben", 4], ["Chloe", 4], ["Diego", 3], ["Emma", 3], ["Finn", 2], ["Grace", 2], ["Hiro", 1]] as const;
const BALANCED = (() => {
  const people = SKILLED.map(([name, level]) => ({ id: name, name, level }));
  const teams = makeTeams(people, { mode: "teams", value: 2, balanceLevel: true }, createRng(104));
  return teams.map((t) => ({ names: t.map((p) => `${p.name} (${p.level})`).join(", "), total: t.reduce((s, p) => s + (p.level ?? 0), 0) }));
})();
const EXAMPLES = [
  exampleSplit("12 names → 3 teams", 12, "teams", 3, 101),
  exampleSplit("10 names → pairs", 10, "size", 2, 102),
  exampleSplit("16 names → 4 groups", 16, "teams", 4, 103),
];

const FAQ = [
  {
    question: "How does the random team generator work?",
    answer:
      "Paste your names (one per line or separated by commas), choose either the number of teams or how many people you want per team, and press Make teams. The list is shuffled with a fair random algorithm and dealt so team sizes never differ by more than one person.",
  },
  {
    question: "Can I make balanced teams instead of purely random ones?",
    answer:
      "Yes. Turn on Balance teams, then tag each person as girl, boy or other and give them a skill level from 1 to 5. Tagged groups are spread evenly across teams and the skill levels are dealt like a snake draft, so team totals stay close while the line-ups are still random.",
  },
  {
    question: "How do I keep two people on the same team, or keep someone where they are?",
    answer:
      "After making teams, tap a name to lock it (a 🔒 appears). Locked people stay on their current team when you shuffle again, and everyone else is re-dealt around them. Tap the name again to unlock it.",
  },
  {
    question: "Is my class list saved or uploaded?",
    answer:
      "Nothing is uploaded. Saved lists live only in your browser's local storage, so you can reload Period 3 tomorrow on the same device. A share link encodes the finished teams in the URL itself, so anyone who opens it sees exactly the same teams.",
  },
  {
    question: "How do I make random groups for a class?",
    answer:
      "Paste your class list, choose People per team and set the group size — 2 for pairs, 3 or 4 for small groups — then press Make teams. The generator spreads leftovers so no group is more than one student bigger than another. Turn on Balance teams to mix ability levels, lock a student who needs a particular partner, then press Full screen to show the groups on the board.",
  },
  {
    question: "How do I split a list of names into teams of 2, 3 or 4?",
    answer:
      "Tap Pairs, Groups of 3 or Groups of 4 (or the 2, 3 and 4 teams buttons). If the list is empty, a sample list is loaded so you can see how it works; paste your own names and press the same button again. Leftover people are spread so no team is more than one person bigger.",
  },
  {
    question: "How do I make fair teams when players have different skill?",
    answer:
      "Tap Balanced by skill, give each person a level from 1 to 5 and press Make teams. The strongest players are dealt first in snake-draft order, so team totals end up within a point or two of each other while the line-ups still change on every shuffle.",
  },
  {
    question: "What's the difference between a random team generator and a random group generator?",
    answer:
      "Nothing, really — teachers often say groups, coaches say teams. Use People per team for small groups (pairs, trios, groups of four) and Number of teams when you need a fixed number of sides, such as two teams for a quiz or four houses for sports day.",
  },
];

export default function RandomTeamGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Team & Group Generator"
      heading={["Random Team &", "Group Generator"]}
      intro="Paste names, pick the number of teams or people per group, and get fair random teams or groups in one click — balanced by gender or skill if you want, with fun team names."
      description={DESCRIPTION}
      updated="2026-10-28"
      inShort="Paste a list of names, tap 2, 3 or 4 teams (or pairs, groups of 3 or 4) and get fair random teams instantly. Team sizes never differ by more than one person, Balanced by skill evens out strength, and you can lock players, press Space to reshuffle, copy a result link or go full screen. Free, no signup, and the list never leaves your browser."
      faq={FAQ}
      related={[
        { href: "/icebreaker", label: "Icebreaker questions" },
        { href: "/debate", label: "Debate topic generator" },
        { href: "/charades", label: "Charades generator" },
        { href: "/spin-the-wheel", label: "Topic wheel" },
        { href: "/random-group-generator", label: "Random group generator" },
        { href: "/decision-maker", label: "Decision maker" },
      ]}
      content={
        <>
          <SectionTitle>Split any list into teams in seconds</SectionTitle>
          <p>
            Picking teams by hand is slow and somebody always ends up picked last. A <strong>random team generator</strong> takes the
            decision out of your hands: paste the roster, choose how to split it, and every person is dealt to a team by a
            proper shuffle. Team sizes are always as even as possible — 23 students in 4 teams becomes 6, 6, 6 and 5, never 8 and 3.
          </p>
          <SectionTitle>Random teams of 2, 3 or 4</SectionTitle>
          <p>
            The two questions are always the same: how many sides, or how many people on each side. Tap a button to split now; with an empty list a sample class is used so you
            can see the result, then paste your own names and tap again. 23 people in teams of 4 become five teams of 4 and one team of 3.
          </p>
          <QuickRow>
            <QuickSet tool="teams" id="teams-2">2 teams</QuickSet>
            <QuickSet tool="teams" id="teams-3">3 teams</QuickSet>
            <QuickSet tool="teams" id="teams-4">4 teams</QuickSet>
            <QuickSet tool="teams" id="size-2">Pairs</QuickSet>
            <QuickSet tool="teams" id="size-3">Groups of 3</QuickSet>
            <QuickSet tool="teams" id="size-4">Groups of 4</QuickSet>
          </QuickRow>
          <SectionTitle>Two ways to split</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Number of teams</strong> — when you need a fixed number of sides: two teams for a quiz, four houses, six stations.</li>
            <li><strong>People per team</strong> — when the group size matters: pairs for peer review, trios for lab work, fives for basketball.</li>
          </ul>
          <SectionTitle>Balanced teams without the arguing</SectionTitle>
          <p>
            Purely random teams can be lopsided. Switch on <strong>Balance teams</strong> and tag people with a group (for example girl or
            boy) and a skill level from 1 to 5. The generator spreads each group evenly and deals the strongest players first, snake-draft
            style, so team strength totals stay close. Then tap any name to <strong>lock</strong> it before reshuffling — handy for keeping
            two helpers apart or a new student with a buddy.
          </p>
          <SectionTitle>Balanced teams by skill: a worked example</SectionTitle>
          <p>
            Eight players with skill levels from 1 (new) to 5 (strong), split into two teams with Balance teams on. Real output from this generator:
          </p>
          <ul className="list-disc pl-5 space-y-1" data-balanced-example>
            {BALANCED.map((t, i) => <li key={i}><strong>Team {i + 1}</strong> (total {t.total}): {t.names}</li>)}
          </ul>
          <QuickRow>
            <QuickSet tool="teams" id="balanced">Try balanced teams</QuickSet>
          </QuickRow>
          <SectionTitle>Made for the front of the room</SectionTitle>
          <p>
            Hit <strong>Full screen</strong> to project the teams in large type, or copy them as text, download a CSV for your gradebook, or
            send a share link. Each team gets a fun auto-generated name like &quot;Cosmic Otters&quot;; turn it off if you prefer Team 1, Team 2.
            Save your class lists in the browser so next week takes one click.
          </p>
          <SectionTitle>Popular uses</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>Classroom group work, debates and review games — pair it with our <Link prefetch={false} href="/debate" className={linkClass}>debate topic generator</Link>.</li>
            <li>PE lessons, five-a-side football, pickup basketball and office sports days.</li>
            <li>Trivia nights, escape rooms and party games like <Link prefetch={false} href="/charades" className={linkClass}>charades</Link>.</li>
            <li>Breakout rooms in online meetings and workshop tables.</li>
            <li>Grouping a class? The <Link prefetch={false} href="/random-group-generator" className={linkClass}>random group generator</Link> keeps chosen students together or apart and hands out group roles.</li>
            <li>Can&apos;t agree on a game? Let the <Link prefetch={false} href="/decision-maker" className={linkClass}>decision maker</Link> or <Link prefetch={false} href="/spin-the-wheel" className={linkClass}>spin the wheel</Link> pick it.</li>
            <li>Need one person, not teams? Use the <Link prefetch={false} href="/random-name-picker" className={linkClass}>random name picker</Link> — or the <Link prefetch={false} href="/number-randomizer" className={linkClass}>number randomizer</Link> for numbered students.</li>
          </ul>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note="Real splits made with this generator, with the random team names it suggests:" sets={EXAMPLES} />
        </>
      }
    >
      <TeamGenerator locale="en" pageId="random_team_generator" />
    </GeneratorPageShell>
  );
}
