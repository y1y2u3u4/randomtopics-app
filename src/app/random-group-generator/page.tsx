import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import GroupGenerator from "@/components/GroupGenerator";
import ClassroomPackCard from "@/components/ClassroomPackCard";
import ClassroomToolLinks from "@/components/ClassroomToolLinks";
import ClassroomArt from "@/components/ClassroomArt";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import { createRng } from "@/lib/randomGenerators";
import { GROUP_ROLES, makeGroups, parsePairs } from "@/lib/groupRules";

const PATH = "/random-group-generator";
const TITLE = "Random Group Generator — Keep Students Together or Apart";
const DESCRIPTION = "Free random group generator for teachers: paste a class list, keep students together or apart, add group roles, then project or print the groups.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Random Topics` },
  description: DESCRIPTION,
  keywords: ["random group generator", "group generator", "random group maker", "random groups for class", "student group generator", "group maker with rules", "random pairs generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Random Topics",
    type: "website",
    images: [{ url: "/og/random-group-generator.jpg", width: 1200, height: 630, alt: "Random Group Generator" }],
  },
};

// A real split from the same function the tool uses, with a fixed seed.
const CLASS = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Finn", "Grace", "Hiro", "Isla", "Jonah", "Kai", "Luna", "Mateo", "Nia", "Omar", "Priya", "Quinn", "Rosa"];
const EXAMPLE_RULES = { together: parsePairs("Ava + Ben", CLASS), apart: parsePairs("Diego + Emma\nKai + Luna", CLASS) };
const EXAMPLE = makeGroups(CLASS, 5, EXAMPLE_RULES, createRng(2026));

const FAQ_ITEMS = [
  {
    question: "How does the random group generator work?",
    answer: "Paste your names, one per line or separated by commas. Choose people per group (pairs, trios, fours…) or a number of groups, then press Make groups. The list is shuffled fairly and dealt so no group is more than one person bigger than another — 23 students in groups of 4 become five groups of 4 and one group of 3.",
  },
  {
    question: "Can I keep two students together or apart?",
    answer: "Yes. Open “Together / apart rules” and type one pair per line, like “Ava + Ben”. Keep-together pairs always land in the same group; keep-apart pairs never share a group. You can chain names (“Kai + Luna + Mateo”). If a rule can't be met — for example too few groups for everyone who must be apart — the tool tells you which one instead of silently ignoring it.",
  },
  {
    question: "What are group roles?",
    answer: `Turn on Group roles and each member gets a random job: ${GROUP_ROLES.join(", ")}. Roles keep everyone busy in group work and rotate fairly every time you shuffle.`,
  },
  {
    question: "Can I show the groups on the board or print them?",
    answer: "Yes. “Show on the board” opens a full-screen view with large, color-coded group cards — press Space to reshuffle and Esc to close. “Print groups” makes a clean printable page, and “Copy groups” copies them as text for your LMS or chat.",
  },
  {
    question: "Is my class list saved or uploaded?",
    answer: "Nothing is uploaded. Saved class lists stay in this browser only (they are shared with our random team generator on the same device), so Period 3 is one click away next time.",
  },
  {
    question: "What's the difference between this and the random team generator?",
    answer: "Both split a list fairly. This group generator is built for classrooms — together/apart rules, group roles and a board view. The random team generator is built for games and sports — balance by skill, lock players, team names and share links.",
  },
];

export default function RandomGroupGeneratorPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Random Group Generator" }]} />
        <GroupGenerator />
        <ClassroomArt src="/art/classroom/random-group-generator.jpg" alt="Illustrated students moving into small color-coded groups shown on a classroom board" />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-6 sm:p-10 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <h2 className="section-heading text-2xl sm:text-3xl mb-2 text-[var(--text-primary)]">Random Groups, With the Rules Teachers Actually Need</h2>
            <p>
              Purely random groups are fair, but every teacher knows the two students who should never share a table — and the new student
              who needs a buddy. A <strong>random group generator</strong> with rules gives you both: the class sees a fair shuffle, and you
              quietly keep the pairs that matter together or apart.
            </p>
            <ol className="space-y-2 list-decimal pl-5">
              <li><strong>Paste the class list</strong> from a spreadsheet or roster — one name per line or comma separated.</li>
              <li><strong>Pick the size:</strong> pairs for peer review, trios for labs, fours for projects — or a fixed number of groups for stations.</li>
              <li><strong>Add rules</strong> (optional): “Ava + Ben” under keep together, “Diego + Emma” under keep apart.</li>
              <li><strong>Make groups</strong>, then show them on the board, print them or copy them. Not happy? Shuffle again — the rules stay.</li>
            </ol>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-2" style={{ fontFamily: "var(--font-display)" }}>Example: 18 students, 5 groups, 3 rules</h3>
            <p>Rules: Ava + Ben together, Diego + Emma apart, Kai + Luna apart. One shuffle:</p>
            <ul className="space-y-1 list-disc pl-5" data-group-example>
              {EXAMPLE.groups.map((g, i) => <li key={i}><strong className="text-[var(--text-primary)]">Group {i + 1}:</strong> {g.join(", ")}</li>)}
            </ul>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-2" style={{ fontFamily: "var(--font-display)" }}>What size should student groups be?</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong className="text-[var(--text-primary)]">Pairs:</strong> think–pair–share, peer editing, reading buddies. Everyone talks.</li>
              <li><strong className="text-[var(--text-primary)]">Groups of 3–4:</strong> the sweet spot for projects and labs — big enough for ideas, small enough that nobody hides.</li>
              <li><strong className="text-[var(--text-primary)]">Groups of 5–6:</strong> stations, debates and games where roles keep everyone involved.</li>
            </ul>
            <p>
              Give each group something to talk about with a <Link prefetch={false} href="/morning-meeting-questions" className="text-[var(--neon-cyan)] hover:underline">morning meeting question</Link> or
              a <Link prefetch={false} href="/would-you-rather/kids" className="text-[var(--neon-cyan)] hover:underline">would you rather question</Link>, and time it with
              the <Link prefetch={false} href="/classroom-timer" className="text-[var(--neon-cyan)] hover:underline">classroom timer</Link>. Picking teams for a game or sport?
              The <Link prefetch={false} href="/random-team-generator" className="text-[var(--neon-cyan)] hover:underline">random team generator</Link> balances by skill.
              Need one name, not groups? Use the <Link prefetch={false} href="/random-name-picker" className="text-[var(--neon-cyan)] hover:underline">random name picker</Link>.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="glass-card p-6 sm:p-10 space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Frequently Asked Questions</h2>
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <ClassroomToolLinks currentPath={PATH} />
        <ClassroomPackCard pack="question-of-the-day" page={PATH} />
      </main>
      <Footer />
    </>
  );
}
