import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import type { Metadata } from "next";
import { topics } from "@/data/topics";
import { CATEGORIES } from "@/data/types";

export const metadata: Metadata = {
  title: "How We Curate — Editorial Standards Behind the Topic Database",
  description:
    "The editorial policy behind RandomTopics: where topics come from, the five-point bar every entry must clear, why each ships with talking points, and how the database is maintained.",
  alternates: { canonical: "/how-we-curate" },
};

export default function HowWeCuratePage() {
  const total = topics.length;
  const deepCount = topics.filter((t) => t.depth === "deep").length;
  const withPoints = topics.filter((t) => t.talkingPoints.length >= 3).length;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "How We Curate" }]} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <section className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              How We <span className="gradient-text">Curate</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
              RandomTopics is a hand-maintained topic database with a generator on top —
              not the other way around. This page is the editorial policy behind it.
            </p>
          </section>

          {/* The numbers, from the live database */}
          <section className="grid grid-cols-3 gap-4">
            <div className="glass-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold gradient-text" style={{ fontFamily: "var(--font-display)" }}>{total}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Topics in the database</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold gradient-text" style={{ fontFamily: "var(--font-display)" }}>{withPoints}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Ship with 3+ talking points</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold gradient-text" style={{ fontFamily: "var(--font-display)" }}>{deepCount}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Rated Deep</p>
            </div>
          </section>

          <section className="glass-card p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              The five-point bar every topic must clear
            </h2>
            <ol className="space-y-3 text-[var(--text-secondary)] text-sm leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-[var(--text-primary)]">It must open a conversation, not close one.</strong>{" "}
                A topic that can be answered in one word gets rewritten or cut. &ldquo;Do you like coffee?&rdquo; fails;
                &ldquo;why coffee culture conquered the world&rdquo; passes.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">It must work for a stranger.</strong> No topic
                that requires niche knowledge to participate. If a random group of five could not all weigh in,
                it does not go in the deck.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">It must be clean and party-safe.</strong> Every
                entry is safe for classrooms, workplaces, and mixed company. There is no &ldquo;adult mode&rdquo;
                and there never will be — plenty of other sites do that.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">It ships with talking points.</strong> Each topic
                carries three editor-written angles, so a stalled group always has somewhere to go next. A topic
                we cannot write three interesting angles for is a topic that was not interesting.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">It gets a depth rating.</strong> Every entry is
                tagged Light, Medium, or Deep by how much vulnerability it asks of the group — so a work
                icebreaker never accidentally deals a therapy question.
              </li>
            </ol>
          </section>

          <section className="glass-card p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Where topics come from
            </h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              The seed set was written in-house, category by category, against the bar above. New entries come
              from two places: reader suggestions via the{" "}
              <Link href="/contact" className="text-[var(--neon-cyan)] hover:underline">contact page</Link>,
              and gaps we notice in the database itself — a category light on Deep entries, a mode short on
              funny ones. Every candidate is rewritten to house style before it enters the database; nothing is
              scraped or pasted from elsewhere.
            </p>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              The party decks (<Link href="/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">Would You Rather</Link>,{" "}
              <Link href="/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">Never Have I Ever</Link>,{" "}
              <Link href="/truth-or-dare" className="text-[var(--neon-cyan)] hover:underline">Truth or Dare</Link> and friends)
              are maintained separately under a stricter version of rule three: if a prompt could genuinely
              embarrass a specific person in the room, it is out — the mystery should be fun even when
              nothing is revealed.
            </p>
          </section>

          <section className="glass-card p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              What gets removed
            </h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              The database is pruned, not just grown. Entries get cut when they age badly (tied to a news cycle
              that passed) or when a better-phrased duplicate earns the slot. Datedness is the most common
              reason — a topic that assumes 2023 technology reads as stale in 2026, and stale prompts kill a
              room faster than hard ones.
            </p>
          </section>

          <section className="glass-card p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              About the AI mode
            </h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              The generator has an optional AI mode for effectively unlimited topics. AI-generated topics are
              clearly a different thing from the curated deck: they follow the same prompt rules but have not
              passed human review, and they are never added to the database or to any page on this site. Every
              topic you can read on a page here — category references, sample lists, party decks — is from the
              human-curated set.
            </p>
          </section>

          <p className="text-center text-xs text-[var(--text-muted)]">
            Questions about the policy, or a topic you think belongs in (or out of) the deck?{" "}
            <Link href="/contact" className="text-[var(--neon-cyan)] hover:underline">Tell us</Link>. Browse the results
            on the <Link href="/categories" className="text-[var(--neon-cyan)] hover:underline">category pages</Link> or
            the <Link href="/topics" className="text-[var(--neon-cyan)] hover:underline">curated topic lists</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
