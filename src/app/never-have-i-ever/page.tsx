import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { NEVER_HAVE_I_EVER } from "@/data/partyQuestions";

export const metadata: Metadata = {
  title: "Never Have I Ever Generator — 60+ Clean Questions",
  description:
    "Free Never Have I Ever question generator: 60+ clean, funny prompts with a no-repeat deck. Perfect for parties, icebreakers, road trips and family game night — no signup.",
  keywords: [
    "never have i ever questions",
    "never have i ever generator",
    "never have i ever game",
    "clean never have i ever questions",
    "never have i ever for teens",
    "funny never have i ever questions",
  ],
  alternates: { canonical: "/never-have-i-ever" },
};

const FAQ_ITEMS = [
  {
    question: "How do you play Never Have I Ever?",
    answer:
      "Everyone starts with ten fingers up (or ten points). One player reads a 'Never have I ever...' statement; anyone who HAS done it puts a finger down. The best part is the storytelling — whoever puts a finger down usually owes the group the story. Last player with fingers up wins.",
  },
  {
    question: "Are these Never Have I Ever questions clean?",
    answer:
      "Yes — this deck is deliberately clean and party-safe: embarrassing-but-innocent moments, funny habits, and everyday confessions. It works for coworkers, classrooms, families, and mixed groups.",
  },
  {
    question: "How many players do you need?",
    answer:
      "It works with 3 players and scales to 30. For big groups, use points instead of fingers and have people stand while they still have points — the shrinking crowd builds drama.",
  },
  {
    question: "Can I use this as a workplace icebreaker?",
    answer:
      "Yes — this clean deck is designed to be office-appropriate. For a quick team warm-up, do three rounds and invite (never force) people to share the story behind a lowered finger. Also see our icebreaker generator for meeting-specific questions.",
  },
  {
    question: "What if we run out of questions?",
    answer:
      "The deck holds 60+ prompts and won't repeat until you've seen every one. After that it reshuffles — or you can switch to Would You Rather or the random question generator to keep the night going.",
  },
];

export default function NeverHaveIEverPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Never Have I Ever" },
          ]}
        />
        <PartyGenerator
          questions={NEVER_HAVE_I_EVER}
          title="Never Have I Ever Generator"
          subtitle="60+ clean, funny prompts — ten fingers up, and let the confessions begin."
          emoji="🙈"
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              The Confession Game That Never Gets Old
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Never Have I Ever</strong> is really a story-collection machine disguised as a
                game. Every lowered finger is a story the group gets to demand, and the statements in
                this deck are tuned for exactly that: <strong>clean, funny prompts</strong> about the
                embarrassing, relatable things almost everyone has secretly done — texting the wrong
                person, fake-laughing at jokes, clapping when the plane lands.
              </p>
              <p>
                The generator deals one prompt per click with no repeats until all 60+ are used, so
                nobody can accuse you of picking targeted questions. Pair it
                with <Link href="/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">Would You Rather</Link> for
                a full game night, or keep the conversation rolling
                with <Link href="/topics/questions-to-ask-at-a-party" className="text-[var(--neon-cyan)] hover:underline">party questions</Link> and
                the <Link href="/question-generator" className="text-[var(--neon-cyan)] hover:underline">random question generator</Link>.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                House Rules Worth Trying
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Story tax:</strong> putting a finger down costs you the story behind it. This single rule turns a counting game into the best hour of the night.</li>
                <li><strong>Reverse round:</strong> once per game, a player may call &quot;reverse&quot; — everyone who HASN&apos;T done it puts a finger down. Saves the innocent from always winning.</li>
                <li><strong>Team mode:</strong> pairs share a hand of ten fingers; couples and best friends argue about whose history counts.</li>
                <li><strong>Icebreaker mode:</strong> three rounds only, sharing optional, no elimination — perfect for onboarding sessions and <Link href="/icebreaker" className="text-[var(--neon-cyan)] hover:underline">team icebreakers</Link>.</li>
              </ul>

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
