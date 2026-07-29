import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import { CATEGORIES } from "@/data/types";
import { topics } from "@/data/topics";

export const metadata: Metadata = {
  title: { absolute: "100 Pro and Con Debate Topics — Arguments for Both Sides" },
  description:
    "Browse 100 balanced pro and con debate topics for students, classrooms and debate clubs. Pick a topic, prepare both sides, then generate more free debate motions.",
  keywords: [
    "pro topics",
    "pro and con topics",
    "pro and con debate topics",
    "topics with pros and cons",
    "debate topics for both sides",
    "argument topics",
  ],
  alternates: { canonical: "/pro-and-con-debate-topics" },
};

const FAQ_ITEMS = [
  {
    question: "What makes a good pro and con debate topic?",
    answer:
      "A strong topic has a clear decision, meaningful consequences, credible evidence on both sides, and enough ambiguity that reasonable people can disagree. Avoid statements that are purely factual or overwhelmingly one-sided.",
  },
  {
    question: "How do I prepare arguments for both sides?",
    answer:
      "Define the motion, identify the people affected, list the strongest benefit and strongest harm, then find one credible example for each side. Preparing the opposing case first is one of the fastest ways to improve rebuttals.",
  },
  {
    question: "Can these topics be used for argumentative essays?",
    answer:
      "Yes. Turn the pro case into a thesis, use the con case as the counterargument, and finish by explaining why your evidence outweighs the opposing side.",
  },
  {
    question: "Are these topics suitable for students?",
    answer:
      "The list mixes accessible and advanced topics across education, technology, ethics, health, politics, science and everyday life. Teachers can use the depth label and category to choose an age-appropriate motion.",
  },
];

const debateBuckets = CATEGORIES.map((category) => ({
  category,
  topics: topics.filter((topic) => topic.category === category.id && topic.modes.includes("debate")),
}));

const balancedTopics = Array.from({ length: 8 }, (_, round) =>
  debateBuckets.map((bucket) => ({ topic: bucket.topics[round], category: bucket.category }))
)
  .flat()
  .filter((item): item is { topic: (typeof topics)[number]; category: (typeof CATEGORIES)[number] } => Boolean(item.topic))
  .slice(0, 100)
  .map((item, index) => ({ ...item, number: index + 1 }));

const groupedTopics = CATEGORIES.map((category) => ({
  category,
  items: balancedTopics.filter((item) => item.category.id === category.id),
})).filter((group) => group.items.length > 0);

export default function ProAndConDebateTopicsPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Debate", href: "/debate" },
            { label: "Pro and Con Topics" },
          ]}
        />

        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--neon-cyan)] mb-3">
            Balanced arguments · classroom ready
          </p>
          <h1 className="section-heading text-4xl sm:text-6xl font-extrabold mb-5">
            100 Pro and Con Debate Topics
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Pick a question, build the strongest case for each side, and practice rebutting the argument you
            personally agree with. The list is balanced across sixteen subject areas.
          </p>
        </header>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">How to prepare both sides</h2>
            <ol className="grid sm:grid-cols-2 gap-4 text-sm text-[var(--text-secondary)]">
              {[
                ["1", "Define the motion", "Rewrite the topic as one precise decision or claim."],
                ["2", "Map the stakeholders", "List who benefits, who pays, and who carries the risk."],
                ["3", "Build the best case", "Find the strongest mechanism, evidence, and example for each side."],
                ["4", "Test the clash", "Ask which value matters more and what evidence would change your mind."],
              ].map(([number, title, body]) => (
                <li key={number} className="rounded-xl border border-white/10 p-4">
                  <span className="text-[var(--neon-pink)] font-bold">{number}</span>
                  <h3 className="font-semibold text-[var(--text-primary)] mt-1">{title}</h3>
                  <p className="mt-1 leading-relaxed">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {groupedTopics.map((group) => (
          <section key={group.category.id} className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
            <div className="glass-card p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-5">
                {group.category.emoji} {group.category.label} pro and con topics
              </h2>
              <ol className="space-y-5">
                {group.items.map(({ topic, number }) => (
                    <li key={topic.id} className="border-b border-white/5 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--neon-pink)]/10 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center">
                          {number}
                        </span>
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)] leading-snug">{topic.text}</h3>
                          <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mt-1">
                            {topic.depth} depth
                          </p>
                          <ul className="mt-2 flex flex-wrap gap-2">
                            {topic.talkingPoints.slice(0, 3).map((point) => (
                              <li
                                key={point}
                                className="text-xs text-[var(--text-secondary)] rounded-full border border-white/10 px-2.5 py-1"
                              >
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                ))}
              </ol>
            </div>
          </section>
        ))}

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 text-center border-[var(--neon-cyan)]/20">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Need a fresh motion?</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-5">
              Generate unlimited debate topics with filters for category and depth, plus talking points for prep.
            </p>
            <Link href="/debate" className="btn-generate inline-flex px-6 py-3 text-sm">
              ⚔️ Open the Debate Topic Generator
            </Link>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Frequently asked questions</h2>
            <div className="space-y-5">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <h3 className="font-semibold text-[var(--text-primary)]">{item.question}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{item.answer}</p>
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
