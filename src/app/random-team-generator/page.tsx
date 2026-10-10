import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import TeamGenerator from "@/components/generators/TeamGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/random-team-generator";
const TITLE = "Random Team Generator — Fair, Balanced Teams in One Click";
const DESCRIPTION =
  "Free random team generator: paste a list of names and split it into random or balanced teams by number of teams or people per team. Fun team names, lock players, full-screen mode, share link. No signup.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random team generator", "random group generator", "team picker", "team generator", "random team maker", "split into groups", "balanced team generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

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
      name="Random Team Generator"
      heading={["Random Team", "Generator"]}
      intro="Paste names, pick the number of teams or people per team, and get fair random teams — balanced by gender or skill if you want, with fun team names."
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/icebreaker", label: "Icebreaker questions" },
        { href: "/debate", label: "Debate topic generator" },
        { href: "/charades", label: "Charades generator" },
        { href: "/spin-the-wheel", label: "Topic wheel" },
      ]}
      content={
        <>
          <SectionTitle>Split any list into teams in seconds</SectionTitle>
          <p>
            Picking teams by hand is slow and somebody always ends up picked last. A <strong>random team generator</strong> takes the
            decision out of your hands: paste the roster, choose how to split it, and every person is dealt to a team by a
            proper shuffle. Team sizes are always as even as possible — 23 students in 4 teams becomes 6, 6, 6 and 5, never 8 and 3.
          </p>
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
          <SectionTitle>Made for the front of the room</SectionTitle>
          <p>
            Hit <strong>Full screen</strong> to project the teams in large type, or copy them as text, download a CSV for your gradebook, or
            send a share link. Each team gets a fun auto-generated name like &quot;Cosmic Otters&quot;; turn it off if you prefer Team 1, Team 2.
            Save your class lists in the browser so next week takes one click.
          </p>
          <SectionTitle>Popular uses</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>Classroom group work, debates and review games — pair it with our <Link href="/debate" className={linkClass}>debate topic generator</Link>.</li>
            <li>PE lessons, five-a-side football, pickup basketball and office sports days.</li>
            <li>Trivia nights, escape rooms and party games like <Link href="/charades" className={linkClass}>charades</Link>.</li>
            <li>Breakout rooms in online meetings and workshop tables.</li>
          </ul>
        </>
      }
    >
      <TeamGenerator locale="en" />
    </GeneratorPageShell>
  );
}
