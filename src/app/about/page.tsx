import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Random Topics - the free random topic generator for conversations, writing, debates, speeches, and icebreakers.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Hero */}
          <section className="text-center space-y-4">
            <h1
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              About <span className="gradient-text">RandomTopics</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
              A free tool with 500+ curated topics to spark conversations,
              ignite creativity, and make every interaction more interesting.
            </p>
          </section>

          {/* What is RandomTopics */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What is RandomTopics?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              RandomTopics is a free random topic generator that gives you
              instant access to over 500 hand-picked topics across 15+
              categories. Whether you need a conversation starter, a writing
              prompt, a debate motion, a speech idea, or an icebreaker
              question, we have you covered.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Every topic is carefully curated to be thought-provoking,
              engaging, and suitable for a wide range of audiences and
              settings.
            </p>
          </section>

          {/* Why We Built It */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Why We Built It
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We believe nobody should ever run out of interesting things to
              discuss. Whether you are a teacher looking for classroom
              discussion starters, a writer battling creative block, or a
              group of friends wanting to go beyond small talk, finding the
              right topic should be effortless.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              That is why we created RandomTopics &mdash; a simple, fast,
              and completely free tool that delivers fresh ideas in a single
              click.
            </p>
          </section>

          {/* How It Works */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              How It Works
            </h2>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              <li className="flex items-start gap-3">
                <span className="text-xl mt-0.5">1.</span>
                <span>
                  <strong className="text-[var(--text-primary)]">
                    Pick a mode
                  </strong>{" "}
                  &mdash; Conversation, Writing, Debate, Speech, or
                  Icebreaker.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl mt-0.5">2.</span>
                <span>
                  <strong className="text-[var(--text-primary)]">
                    Hit Generate
                  </strong>{" "}
                  &mdash; Get a random topic instantly.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl mt-0.5">3.</span>
                <span>
                  <strong className="text-[var(--text-primary)]">
                    Use it
                  </strong>{" "}
                  &mdash; Save your favorites, share them, or jump right in.
                </span>
              </li>
            </ul>
            <p className="text-[var(--text-secondary)] leading-relaxed pt-2">
              No signup. No paywall. No ads blocking your view. Just instant
              results every time.
            </p>
          </section>

          {/* Who It's For */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Who It&apos;s For
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  emoji: "👩‍🏫",
                  title: "Teachers & Educators",
                  desc: "Spark classroom discussions and critical thinking exercises.",
                },
                {
                  emoji: "✍️",
                  title: "Writers & Creatives",
                  desc: "Overcome writer's block with fresh prompts and perspectives.",
                },
                {
                  emoji: "🎤",
                  title: "Debate Teams & Speakers",
                  desc: "Practice with diverse motions and speech topics on demand.",
                },
                {
                  emoji: "👋",
                  title: "Friends & Teams",
                  desc: "Break the ice at meetings, parties, or casual hangouts.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                >
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <h3
                    className="font-semibold text-[var(--text-primary)] mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center space-y-4 pb-4">
            <p className="text-[var(--text-secondary)]">
              Ready to discover your next great topic?
            </p>
            <a
              href="/"
              className="btn-generate inline-block"
            >
              Start Generating
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
