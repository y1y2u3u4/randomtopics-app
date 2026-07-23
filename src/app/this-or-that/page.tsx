import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import QuestionBank from "@/components/QuestionBank";
import { PartyIllustration } from "@/components/CategoryIllustration";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { THIS_OR_THAT } from "@/data/partyGames";

export const metadata: Metadata = {
  title: "This or That Questions Generator — 60+ Fun Either/Or Prompts",
  description:
    "Free This or That question generator: fun either/or prompts for parties, classrooms, road trips, and icebreakers. One click per question, no repeats — clean and party-safe. No signup.",
  keywords: [
    "this or that questions",
    "this or that generator",
    "this or that game",
    "this or that questions for couples",
    "fun this or that questions",
    "hard this or that questions",
  ],
  alternates: { canonical: "/this-or-that" },
};

const FAQ_ITEMS = [
  {
    question: "What is the This or That game?",
    answer:
      "This or That is a fast-paced game where players pick between two options — coffee or tea, beach or mountains — and often explain why. It's a quick, low-pressure way to spark conversation and learn about a group.",
  },
  {
    question: "How do you play This or That?",
    answer:
      "Generate a prompt, have everyone answer at the same time (point, shout, or raise a hand), then let a few people defend their pick. In classrooms, use it as a 'stand on this side of the room' warm-up.",
  },
  {
    question: "Are these questions kid-friendly?",
    answer:
      "Yes — every prompt is clean and party-safe, suitable for classrooms, family game nights, and mixed company.",
  },
  {
    question: "How is This or That different from Would You Rather?",
    answer:
      "This or That uses quick, everyday either/or choices for fast rounds, while Would You Rather leans into bigger, funnier hypotheticals. Both are great icebreakers — pick This or That when you want speed.",
  },
  {
    question: "Can teachers use this in class?",
    answer:
      "Definitely. This or That works as a bell-ringer, an ESL speaking warm-up, and a 'four corners' movement activity where students physically choose a side and explain their reasoning.",
  },
];

export default function ThisOrThatPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "This or That" }]} />
        <PartyIllustration game="this-or-that" />
        <PartyGenerator
          questions={THIS_OR_THAT}
          title="This or That Questions"
          subtitle="60+ fun either/or prompts — one click per question, no repeats until you've seen the whole deck."
          emoji="⚖️"
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              The Fastest Icebreaker There Is
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>This or That</strong> works because it demands an instant choice. There's no wrong
                answer and no long setup — just two options and a snap decision, which is exactly why it
                wakes up sleepy classrooms and warms up quiet parties. This generator deals from a curated
                deck of clean either/or prompts, one per click, with no repeats until the deck runs out.
              </p>
              <p>
                More party games:{" "}
                <Link href="/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">Would You Rather</Link>,{" "}
                <Link href="/truth-or-dare" className="text-[var(--neon-cyan)] hover:underline">Truth or Dare</Link>,{" "}
                <Link href="/most-likely-to" className="text-[var(--neon-cyan)] hover:underline">Most Likely To</Link>, and{" "}
                <Link href="/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">Never Have I Ever</Link>.
              </p>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-3" style={{ fontFamily: "var(--font-display)" }}>
                Frequently Asked Questions
              </h3>
              {FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h4>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-5" style={{ fontFamily: "var(--font-display)" }}>
              Five Ways to Play This or That
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p><strong className="text-[var(--text-primary)]">Rapid fire.</strong> Three-second shot clock, answer by pointing left or right, no explanations allowed. Run 15 questions in two minutes &mdash; the speed is what makes answers honest.</p>
              <p><strong className="text-[var(--text-primary)]">Four corners.</strong> The classroom classic: each wall is an option, students walk to their choice, then two volunteers per side defend it in one sentence. A bell-ringer that gets bodies moving.</p>
              <p><strong className="text-[var(--text-primary)]">Sort the room.</strong> After answering, players line up by how strongly they feel, lukewarm in the middle. Suddenly a two-option question has a whole spectrum of takes to argue about.</p>
              <p><strong className="text-[var(--text-primary)]">Couples predict.</strong> Write your answer down, then guess your partner&apos;s. A point per correct guess &mdash; low stakes, weirdly revealing.</p>
              <p><strong className="text-[var(--text-primary)]">Road trip mode.</strong> Passenger reads, everyone answers in seat order, driver breaks ties. The no-wrong-answers format is exactly what hour three of a drive needs.</p>
              <p className="text-xs text-[var(--text-muted)]">Facilitator tip: alternate easy comfort picks (coffee or tea) with genuinely hard ones &mdash; the rhythm keeps both kids and adults locked in.</p>
            </div>
          </div>
        </section>
        <QuestionBank
          heading="All 38 This or That Questions"
          intro="The complete deck of quick either/or prompts &mdash; scan it, steal from it, or copy the whole list for your next session."
          questions={THIS_OR_THAT}
        />
      </main>
      <Footer />
    </>
  );
}
