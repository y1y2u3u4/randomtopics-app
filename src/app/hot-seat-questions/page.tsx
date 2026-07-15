import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { HOT_SEAT_QUESTIONS } from "@/data/hotSeat";

export const metadata: Metadata = {
  title: "Hot Seat Questions — Spicy (but Clean) Questions to Ask Friends",
  description:
    "75+ hot seat questions to put friends on the spot — warm-ups, revealing questions, rapid-fire rounds and deep cuts. All party-safe. One click per question, no repeats, free.",
  keywords: [
    "hot seat questions",
    "hot seat game",
    "spicy questions to ask friends",
    "hot questions to ask friends",
    "hot seat questions for friends",
    "juicy questions to ask friends",
    "questions to put someone on the spot",
  ],
  alternates: { canonical: "/hot-seat-questions" },
};

const FAQ_ITEMS = [
  {
    question: "How do you play the Hot Seat game?",
    answer:
      "One player takes the 'hot seat' while everyone else fires questions at them for a set time — usually two to five minutes. The player must answer honestly (with one or two passes allowed, per house rules), then the next player rotates in. This generator deals the questions so the group never stalls: click, ask, answer, next.",
  },
  {
    question: "What are good hot seat questions?",
    answer:
      "The best hot seat questions are revealing without being cruel: embarrassing moments, secret opinions, who-in-this-room picks, and would-you-rather dilemmas under pressure. Start with warm-ups, escalate to the spicier middle rounds once everyone's laughing, and save the deep cuts for close friends. Everything in this deck is party-safe — spicy, not explicit.",
  },
  {
    question: "Are these hot seat questions clean?",
    answer:
      "Yes. Every question is appropriate for mixed company — revealing and funny without adult content. That makes the deck safe for teen hangouts, college nights, team socials, and family-adjacent gatherings where you still want the game to feel a little daring.",
  },
  {
    question: "How long should each hot seat turn last?",
    answer:
      "Three minutes is the sweet spot — long enough for five to eight questions, short enough that nobody suffers. For bigger groups, drop to two minutes so everyone gets a turn. Add a rule that the group votes one 'best answer' per turn to keep listeners invested.",
  },
  {
    question: "Can I use these questions for icebreakers at work?",
    answer:
      "The warm-up and rapid-fire questions work well for team socials — they're revealing in a fun, low-stakes way. For a fully professional setting, our icebreaker questions for work collection is calibrated specifically for colleagues.",
  },
];

export default function HotSeatPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Hot Seat Questions" },
          ]}
        />

        <PartyGenerator
          questions={HOT_SEAT_QUESTIONS}
          title="Hot Seat Questions"
          subtitle="Put a friend on the spot — one click per question, from warm-ups to rapid-fire rounds. All spicy, all clean, no repeats until the deck runs out."
          emoji="🔥"
        />

        {/* SEO content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              How to Run a Great Hot Seat Round
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Hot Seat</strong> is the simplest party game that reliably produces the best
                stories: one person sits in the &quot;hot seat,&quot; the group fires questions, and
                honesty does the rest. The game lives or dies on question quality — too tame and it
                stalls, too harsh and someone checks out. This deck is built to escalate properly:
                🔥 warm-ups to get answers flowing, 🌶️ revealing questions for the laughs, 👀
                group-directed picks that pull everyone in, ⚡ pressure choices, 💨 rapid-fire
                finishers, and 💭 deep cuts for when the group is close enough to go there.
              </p>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Set the timer</strong> — three minutes per person is the sweet spot.</li>
                <li><strong>Deal questions from the generator</strong> — the asker reads it exactly as written.</li>
                <li><strong>Two passes each</strong> — everyone gets outs, nobody gets cornered.</li>
                <li><strong>Rotate clockwise</strong> — and the person leaving the seat picks who&apos;s next... or spin the <Link href="/spin-the-wheel" className="text-[var(--neon-cyan)] hover:underline">wheel</Link> to decide.</li>
                <li><strong>Vote a best answer</strong> per round to keep the audience invested.</li>
              </ol>
              <p>
                Build the rest of game night with our party decks:{" "}
                <Link href="/truth-or-dare" className="text-[var(--neon-cyan)] hover:underline">Truth or Dare</Link>,{" "}
                <Link href="/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">Never Have I Ever</Link>,{" "}
                <Link href="/most-likely-to" className="text-[var(--neon-cyan)] hover:underline">Most Likely To</Link>,{" "}
                <Link href="/charades" className="text-[var(--neon-cyan)] hover:underline">Charades</Link>, and{" "}
                <Link href="/two-truths-and-a-lie" className="text-[var(--neon-cyan)] hover:underline">Two Truths and a Lie</Link>.
                Quieter group? Start with{" "}
                <Link href="/topics/questions-to-ask-at-a-party" className="text-[var(--neon-cyan)] hover:underline">questions to ask at a party</Link>.
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
