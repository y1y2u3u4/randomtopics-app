import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import PutAFingerDownGame from "@/components/generators/PutAFingerDownGame";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { FINGER_STATEMENTS, fingerGenerator } from "@/lib/generators/fingerDown";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/put-a-finger-down";
const TITLE = `Put a Finger Down — ${FINGER_STATEMENTS.length} Statements & Finger Game`;
const DESCRIPTION = `Put a finger down if... ${FINGER_STATEMENTS.length} clean statements for teens, friends, couples, school, work, gamers and family, plus a 10-finger game mode with a counter. Free, no sign-up.`;

const SOCIAL = generatorSocial({ card: "put-a-finger-down", title: TITLE, description: DESCRIPTION, alt: "Put a Finger Down — statements and a 10-finger game" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["put a finger down", "put a finger down if", "put a finger down questions", "put a finger down game", "put a finger down for teens", "finger down game"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const EXAMPLES = [
  { label: "Friends", results: fingerGenerator.generate({ cat: ["friends"] }, 4, [], 81).results },
  { label: "Gamers", results: fingerGenerator.generate({ cat: ["gamers"] }, 4, [], 82).results },
  { label: "Juicy (PG-13)", results: fingerGenerator.generate({ cat: ["juicy"] }, 4, [], 83).results },
];

const FAQ = [
  { question: "How do you play Put a Finger Down?", answer: "Everyone holds up all ten fingers. One person reads a statement that starts with 'Put a finger down if...'. Anyone it is true for lowers a finger. Keep going; the player with the most fingers up at the end wins, or the last one with a finger up if you play to zero." },
  { question: "How many statements are there?", answer: `There are ${FINGER_STATEMENTS.length} statements in nine categories: clean and family, teens, friends, couples, school, work, funny, gamers and a mild PG-13 juicy set.` },
  { question: "Are the statements clean?", answer: "Yes. None are sexual or explicit. The juicy category is PG-13: awkward crushes, white lies and embarrassing moments, never anything graphic." },
  { question: "Can I play it alone or over a video call?", answer: "Yes. The built-in counter starts at 10 and drops with every Finger down tap. On a call, one person shares the screen and everyone counts their own fingers." },
  { question: "How do I keep it fun and not awkward?", answer: "Start with clean or funny statements, then move to friends or juicy once everyone is relaxed. Players can always skip a question, and the Next statement button moves on without costing a finger." },
  { question: "What is a good number of players?", answer: "Anything from two to a whole classroom works. Larger groups play best with a host reading from one screen." },
];

export default function PutAFingerDownPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Put a Finger Down"
      heading={["Put a Finger", "Down"]}
      intro={`${FINGER_STATEMENTS.length} “Put a finger down if...” statements with a 10-finger game counter.`}
      description={DESCRIPTION}
      updated="2026-10-22"
      faq={FAQ}
      related={[
        { href: "/never-have-i-ever", label: "Never have I ever" },
        { href: "/would-you-rather", label: "Would you rather" },
        { href: "/truth-or-dare", label: "Truth or dare" },
      ]}
      content={
        <>
          <SectionTitle>A finger game for every group</SectionTitle>
          <p>
            Put a Finger Down is the easiest party game: no props, no setup, ten fingers. This page gives you a statement to read and a
            counter that tracks how many fingers you still have up, so the host can focus on the fun.
          </p>
          <SectionTitle>Nine categories</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Clean / family</strong> and <strong>funny</strong> — safe for any age.</li>
            <li><strong>Teens</strong>, <strong>school</strong> and <strong>friends</strong> — sleepover and classroom favourites.</li>
            <li><strong>Couples</strong> — sweet and silly, perfect for date night.</li>
            <li><strong>Work</strong> — team-building without the cringe.</li>
            <li><strong>Gamers</strong> — rage quits, lag excuses and one more match.</li>
            <li><strong>Juicy (PG-13)</strong> — a little embarrassing, never explicit.</li>
          </ul>
          <SectionTitle>Game mode and variations</SectionTitle>
          <p>
            Tap Finger down each time a statement is true for you. The counter shows how many fingers are left, and Reset starts a new
            round. For more party games, try <Link prefetch={false} href="/never-have-i-ever" className={linkClass}>Never Have I Ever</Link>,{" "}
            <Link prefetch={false} href="/would-you-rather" className={linkClass}>Would You Rather</Link> or{" "}
            <Link prefetch={false} href="/truth-or-dare" className={linkClass}>Truth or Dare</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real statements from three categories:"} sets={EXAMPLES} />
        </>
      }
    >
      <PutAFingerDownGame />
    </GeneratorPageShell>
  );
}
