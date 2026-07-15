import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import JournalPromptGenerator from "@/components/JournalPromptGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { JOURNAL_PROMPTS } from "@/data/journalPrompts";

export const metadata: Metadata = {
  title: "Journal Prompt Generator — Daily Journal Prompts by Style, Free",
  description:
    "Free journal prompt generator with 95+ reflection prompts — self-discovery, gratitude, morning pages, evening review, goals and creative sparks. One click for today's prompt, printable, no signup.",
  keywords: [
    "journal prompt generator",
    "journal prompts",
    "daily journal prompts",
    "journaling prompts",
    "give me a journal prompt for today",
    "random journal prompt",
    "morning journal prompts",
    "gratitude journal prompts",
    "self discovery journal prompts",
  ],
  alternates: { canonical: "/journal-prompts" },
};

const FAQ_ITEMS = [
  {
    question: "What is a journal prompt generator?",
    answer:
      "A journal prompt generator gives you a reflection question to write about instead of facing a blank page. Click once and you get today's prompt — a question about your day, your goals, your gratitude, or yourself — plus a fresh one every click after that, with no repeats until you've seen the whole set. It removes the hardest part of journaling: deciding what to write about.",
  },
  {
    question: "How do I use journal prompts effectively?",
    answer:
      "Pick one prompt, set a timer for five to ten minutes, and write without editing — the goal is honesty, not polish. If a prompt sparks something unexpected, follow the tangent; the prompt is a door, not a fence. Journaling works best as a small daily ritual: morning prompts to set the day, evening prompts to close it.",
  },
  {
    question: "What's the difference between journal prompts and writing prompts?",
    answer:
      "Journal prompts are reflection questions about your real life — your feelings, habits, gratitude, and goals. Writing prompts are story starters for fiction and essays. This page is for reflection; if you want creative story ideas, use our writing prompt generator instead.",
  },
  {
    question: "Can I get a journal prompt for today?",
    answer:
      "Yes — that's exactly what the generator does. Choose a style that fits the moment (Morning Pages before the day starts, Evening Reflection before bed, or Gratitude anytime) and deal a prompt. Every prompt is written to work on any day of the year.",
  },
  {
    question: "Are these journal prompts good for beginners?",
    answer:
      "Very. Start with Gratitude or Evening Reflection — they're concrete and easy to answer in a few sentences. Self-Discovery and Growth prompts go deeper and reward longer sessions. There's no wrong way: even one honest sentence per day counts as journaling.",
  },
];

export default function JournalPromptsPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Journal Prompts" },
          ]}
        />

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
          <h1
            className="section-heading text-4xl sm:text-6xl font-extrabold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Journal Prompt <span className="gradient-text">Generator</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            {JOURNAL_PROMPTS.length}+ hand-written reflection prompts across six journaling styles.
            One click for today&apos;s prompt — no signup, no repeats, printable.
          </p>
        </section>

        <JournalPromptGenerator />

        {/* SEO content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              A Journal Prompt for Every Kind of Day
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                The hardest part of journaling isn&apos;t the writing — it&apos;s the blank page asking
                you to decide what matters today. A good <strong>journal prompt</strong> makes that
                decision for you, so you can spend your five minutes actually reflecting instead of
                staring. Every prompt in this generator was written to be answerable on an ordinary
                day: no journaling experience required, no right answers.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Six Styles
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>🧭 Self-Discovery</strong> — questions about who you are when nobody&apos;s grading the answer.</li>
                <li><strong>🙏 Gratitude</strong> — concrete, specific thankfulness (never just &quot;list three things&quot;).</li>
                <li><strong>🌅 Morning Pages</strong> — set the day&apos;s direction before the day sets it for you.</li>
                <li><strong>🌙 Evening Reflection</strong> — close the day, empty your head, sleep lighter.</li>
                <li><strong>🌱 Growth &amp; Goals</strong> — honest check-ins on habits, skills, and what you keep postponing.</li>
                <li><strong>✨ Creative Sparks</strong> — playful prompts when reflection feels heavy and you just want to write.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Build the Habit in Five Minutes a Day
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Anchor it</strong> — attach journaling to something you already do: with coffee, or right after brushing your teeth at night.</li>
                <li><strong>Deal one prompt</strong> — don&apos;t browse for the perfect one; answer the one you get.</li>
                <li><strong>Set a five-minute timer</strong> — small enough to start, long enough to matter.</li>
                <li><strong>Write ugly</strong> — grammar and spelling are not invited to this meeting.</li>
                <li><strong>Stop while it&apos;s easy</strong> — ending mid-thought makes tomorrow&apos;s session easier to start.</li>
              </ol>

              <p className="pt-2">
                Want story starters instead of reflection questions? Try the{" "}
                <Link href="/writing" className="text-[var(--neon-cyan)] hover:underline">writing prompt generator</Link>.
                Journaling with a partner or group? Our{" "}
                <Link href="/topics/deep-questions-to-ask-your-partner" className="text-[var(--neon-cyan)] hover:underline">deep questions for your partner</Link>{" "}
                and{" "}
                <Link href="/topics/deep-philosophical-questions" className="text-[var(--neon-cyan)] hover:underline">philosophical questions</Link>{" "}
                make excellent shared prompts. For school use, see{" "}
                <Link href="/topics/writing-prompts-for-kids" className="text-[var(--neon-cyan)] hover:underline">writing prompts for kids</Link>.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
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
