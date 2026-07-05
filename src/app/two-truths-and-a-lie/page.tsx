import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { TWO_TRUTHS_AND_A_LIE } from "@/data/partyGames";

export const metadata: Metadata = {
  title: "Two Truths and a Lie — Idea Generator & Prompts",
  description:
    "Free Two Truths and a Lie idea generator: themed prompts that help you craft convincing rounds fast. Great for icebreakers, classrooms, team building, and parties. No signup.",
  alternates: { canonical: "/two-truths-and-a-lie" },
};

const FAQ_ITEMS = [
  {
    question: "How do you play Two Truths and a Lie?",
    answer:
      "Each player shares three statements about themselves — two true and one false — and everyone else guesses which one is the lie. The best lies are believable and the truths are surprising, which is where a themed prompt helps.",
  },
  {
    question: "What does this generator give me?",
    answer:
      "It gives you a themed prompt each click — like 'make your statements about places you've traveled' — so you can quickly craft a strong, convincing round instead of staring at a blank page.",
  },
  {
    question: "Is this good for icebreakers at work or school?",
    answer:
      "Yes. Two Truths and a Lie is a classic icebreaker for classrooms, new teams, onboarding, and virtual meetings because it helps people share something real about themselves in a fun, low-pressure way.",
  },
  {
    question: "What makes a good lie?",
    answer:
      "The best lie is boringly believable and sits next to two surprising truths. Match the tone and detail of your true statements so the lie doesn't stand out — the themed prompts help you keep all three consistent.",
  },
  {
    question: "How many people do you need?",
    answer:
      "It works with any group of three or more. Everyone takes a turn presenting their three statements while the rest vote on the lie.",
  },
];

export default function TwoTruthsAndALiePage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Two Truths and a Lie" }]} />
        <PartyGenerator
          questions={TWO_TRUTHS_AND_A_LIE}
          title="Two Truths and a Lie"
          subtitle="Themed prompts to help you craft a convincing round — one click per idea, no repeats until you've seen the whole deck."
          emoji="🕵️"
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              The Icebreaker Everyone Already Knows How to Play
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Two Truths and a Lie</strong> is a staple icebreaker — but the hard part is thinking
                of three good statements on the spot. This generator hands you a themed angle each click, so
                you can build a believable round in seconds. Draw a theme, jot two surprising truths and one
                boringly believable lie, and let the group guess.
              </p>
              <p>
                Pair it with more group games:{" "}
                <Link href="/most-likely-to" className="text-[var(--neon-cyan)] hover:underline">Most Likely To</Link>,{" "}
                <Link href="/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">Would You Rather</Link>,{" "}
                <Link href="/this-or-that" className="text-[var(--neon-cyan)] hover:underline">This or That</Link>, or{" "}
                <Link href="/icebreaker" className="text-[var(--neon-cyan)] hover:underline">icebreaker questions</Link> for work.
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
