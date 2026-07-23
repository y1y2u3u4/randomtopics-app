import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import QuestionBank from "@/components/QuestionBank";
import { PartyIllustration } from "@/components/CategoryIllustration";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { TRUTH_OR_DARE } from "@/data/partyGames";

export const metadata: Metadata = {
  title: "Truth or Dare Generator — Clean, Party-Safe Questions & Dares",
  description:
    "Free Truth or Dare generator with clean, party-safe truths and dares. One click per prompt, no repeats — perfect for parties, sleepovers, road trips, and family game nights. No signup.",
  keywords: [
    "truth or dare questions",
    "truth or dare generator",
    "truth or dare game",
    "clean truth or dare",
    "truth or dare for teens",
    "good dares",
    "funny truth or dare",
  ],
  alternates: { canonical: "/truth-or-dare" },
};

const FAQ_ITEMS = [
  {
    question: "How do you play Truth or Dare?",
    answer:
      "Players take turns choosing 'truth' or 'dare.' Pick truth and you answer the question honestly; pick dare and you complete the challenge. This generator deals a fresh, clean truth or dare each click so nobody has to think them up on the spot.",
  },
  {
    question: "Are these Truth or Dare questions clean?",
    answer:
      "Yes — every truth and dare in this deck is party-safe and appropriate for mixed company, sleepovers, classrooms, and family game nights. No adult themes.",
  },
  {
    question: "Can I use this for a kids' or teen party?",
    answer:
      "Absolutely. The deck is designed to be fun and harmless — silly dares and light-hearted truths that work for teens, tweens, and family gatherings.",
  },
  {
    question: "How is the no-repeat deck useful?",
    answer:
      "The generator cycles through every prompt before repeating any, so a long game never feels stale and you won't get the same dare twice in a row.",
  },
  {
    question: "What if someone doesn't want to do a dare?",
    answer:
      "House rules vary — common options are a small forfeit, swapping to a truth, or skipping once per player. Keep it friendly and let anyone pass on something they're not comfortable with.",
  },
];

export default function TruthOrDarePage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Truth or Dare" }]} />
        <PartyIllustration game="truth-or-dare" />
        <PartyGenerator
          questions={TRUTH_OR_DARE}
          title="Truth or Dare Generator"
          subtitle="Clean, party-safe truths and dares — one click per prompt, no repeats until you've seen the whole deck."
          emoji="🎭"
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              The Classic Party Game, Minus the Awkward Silence
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Truth or Dare</strong> lives or dies on good prompts — and coming up with them on
                the spot is where most rounds fizzle out. This generator hands you a hand-curated deck of
                clean truths and silly dares, one per click, with no repeats until the deck runs out. Pick
                truth for a revealing question, or dare for a harmless challenge, and let the game keep
                itself moving.
              </p>
              <p>
                Want more party ammunition? Try{" "}
                <Link href="/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">Would You Rather</Link>,{" "}
                <Link href="/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">Never Have I Ever</Link>,{" "}
                <Link href="/most-likely-to" className="text-[var(--neon-cyan)] hover:underline">Most Likely To</Link>,{" "}
                <Link href="/charades" className="text-[var(--neon-cyan)] hover:underline">Charades</Link>,{" "}
                <Link href="/hot-seat-questions" className="text-[var(--neon-cyan)] hover:underline">Hot Seat</Link>, or the{" "}
                <Link href="/question-generator" className="text-[var(--neon-cyan)] hover:underline">random question generator</Link>.
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
              House Rules That Keep Truth or Dare Fun
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p><strong className="text-[var(--text-primary)]">Bottle ordering.</strong> Spin a bottle to pick who answers next instead of going in a circle &mdash; the randomness is half the tension, and nobody can count turns to dodge a dare.</p>
              <p><strong className="text-[var(--text-primary)]">Truth-streak rule.</strong> Three truths in a row means your next turn must be a dare. Stops the table from going full interview mode.</p>
              <p><strong className="text-[var(--text-primary)]">Dare jar.</strong> Before starting, everyone writes two dares on slips and drops them in a jar. Choosing dare means drawing blind. Crowd-sourced dares are consistently better than on-the-spot ones.</p>
              <p><strong className="text-[var(--text-primary)]">Consent rules (non-negotiable).</strong> Every player gets two vetoes for the night, no dares involving phones or posting anything, and nothing that leaves the room. The game dies the moment someone is genuinely uncomfortable &mdash; the vetoes keep it alive.</p>
              <p className="text-xs text-[var(--text-muted)]">Facilitator tip: with new groups, open with two rounds of truths only. Dares land better once the room is warm.</p>
            </div>
          </div>
        </section>
        <QuestionBank
          heading="All 38 Truth Prompts and Dares"
          intro="The full deck &mdash; every truth and dare in rotation, all clean enough for family game night."
          questions={TRUTH_OR_DARE}
        />
      </main>
      <Footer />
    </>
  );
}
