import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
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
                <Link href="/charades" className="text-[var(--neon-cyan)] hover:underline">Charades</Link>, or the{" "}
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
      </main>
      <Footer />
    </>
  );
}
