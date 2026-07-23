import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import QuestionBank from "@/components/QuestionBank";
import { PartyIllustration } from "@/components/CategoryIllustration";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { MOST_LIKELY_TO } from "@/data/partyGames";

export const metadata: Metadata = {
  title: "Most Likely To Questions Generator — Fun & Clean Party Prompts",
  description:
    "Free 'Most Likely To' question generator: clean, funny prompts for parties, classrooms, and team building. One click per question, no repeats — no signup needed.",
  keywords: [
    "most likely to questions",
    "most likely to game",
    "who is most likely to questions",
    "most likely to questions for friends",
    "party game questions",
  ],
  alternates: { canonical: "/most-likely-to" },
};

const FAQ_ITEMS = [
  {
    question: "How do you play Most Likely To?",
    answer:
      "Read a prompt out loud, then everyone points at the person they think is 'most likely to' do it. The person with the most points wins (or loses) the round. It's fast, funny, and reveals how a group sees each other.",
  },
  {
    question: "Are these prompts clean and party-safe?",
    answer:
      "Yes — every 'Most Likely To' prompt in this deck is light-hearted and appropriate for classrooms, family game nights, team building, and mixed company.",
  },
  {
    question: "How many players do you need?",
    answer:
      "Most Likely To works best with three or more people so there's someone to point at. It's a great fit for parties, classrooms, road trips, and work team-building sessions.",
  },
  {
    question: "Can I use this for team building at work?",
    answer:
      "Absolutely. Keep it to friendly, positive prompts and it becomes a quick, low-pressure way for colleagues to laugh together and learn about each other.",
  },
  {
    question: "Does the deck repeat?",
    answer:
      "No — the generator cycles through every prompt before repeating any, so you can play a long game without seeing the same question twice in a row.",
  },
];

export default function MostLikelyToPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Most Likely To" }]} />
        <PartyIllustration game="most-likely-to" />
        <PartyGenerator
          questions={MOST_LIKELY_TO}
          title="Most Likely To Questions"
          subtitle="Clean, funny 'who is most likely to…' prompts — one click per question, no repeats until you've seen the whole deck."
          emoji="👉"
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              The Game That Reveals How Your Group Really Sees Each Other
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Most Likely To</strong> turns a simple prompt into instant laughter: everyone points
                at the same time, and suddenly you learn who the group thinks would survive a zombie
                apocalypse or be late to their own wedding. This generator deals from a curated deck of
                clean, funny prompts, one per click, with no repeats until the deck runs out.
              </p>
              <p>
                Keep the party going with{" "}
                <Link href="/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">Would You Rather</Link>,{" "}
                <Link href="/truth-or-dare" className="text-[var(--neon-cyan)] hover:underline">Truth or Dare</Link>,{" "}
                <Link href="/this-or-that" className="text-[var(--neon-cyan)] hover:underline">This or That</Link>, and{" "}
                <Link href="/two-truths-and-a-lie" className="text-[var(--neon-cyan)] hover:underline">Two Truths and a Lie</Link>.
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
              Four Ways to Play Most Likely To
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p><strong className="text-[var(--text-primary)]">Point on three.</strong> Read the prompt, count to three, everyone points at once. The player with the most fingers aimed at them owes the group an explanation &mdash; or a rebuttal.</p>
              <p><strong className="text-[var(--text-primary)]">Vote and defend.</strong> The accused gets 30 seconds to argue why they are NOT the most likely &mdash; then the group votes again. Watching someone argue against their own reputation is the whole game.</p>
              <p><strong className="text-[var(--text-primary)]">Anonymous ballots.</strong> For shy groups or workplaces: everyone writes a name on a slip, votes are tallied out loud. Same fun, no direct finger-pointing.</p>
              <p><strong className="text-[var(--text-primary)]">Superlatives ceremony.</strong> End-of-year classrooms and team offsites: run 10 prompts as an awards show, with a winner crowned per category. Pairs well with paper certificates and zero budget.</p>
              <p className="text-xs text-[var(--text-muted)]">Facilitator tip: this game runs on affection, not roasting. If a prompt could genuinely sting someone in your group, skip it &mdash; there are 37 others.</p>
            </div>
          </div>
        </section>
        <QuestionBank
          heading="All 38 Most Likely To Questions"
          intro="The full deck &mdash; superlatives your group will actually argue about, kept kind by design."
          questions={MOST_LIKELY_TO}
        />
      </main>
      <Footer />
    </>
  );
}
