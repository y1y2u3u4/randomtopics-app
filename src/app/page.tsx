import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import { MODES, CATEGORIES } from "@/data/types";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <TopicGenerator />

        {/* Mode cards section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-10"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Choose Your <span className="gradient-text">Mode</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODES.map((mode) => (
              <Link
                key={mode.slug}
                href={`/${mode.slug}`}
                className="glass-card p-6 hover:border-[var(--accent-pink)]/30 transition-all hover:translate-y-[-2px] group"
              >
                <span className="text-3xl mb-3 block">{mode.emoji}</span>
                <h3
                  className="text-lg font-semibold mb-2 group-hover:text-[var(--accent-pink)] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {mode.label}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">{mode.description}</p>
              </Link>
            ))}
            <Link
              href="/funny"
              className="glass-card p-6 hover:border-[var(--accent-pink)]/30 transition-all hover:translate-y-[-2px] group"
            >
              <span className="text-3xl mb-3 block">😂</span>
              <h3
                className="text-lg font-semibold mb-2 group-hover:text-[var(--accent-pink)] transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Funny Topics
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                Hilarious and bizarre topics guaranteed to make everyone laugh
              </p>
            </Link>
          </div>
        </section>

        {/* Categories section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-10"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="glass-card p-4 text-center hover:border-[var(--accent-blue)]/30 transition-all hover:translate-y-[-2px] group"
              >
                <span className="text-2xl mb-2 block">{cat.emoji}</span>
                <span
                  className="text-sm font-medium group-hover:text-[var(--accent-blue)] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What is a Random Topic Generator?
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
            <p>
              A random topic generator is a tool that instantly provides you with conversation
              starters, writing prompts, debate topics, speech ideas, and icebreaker questions.
              Whether you&apos;re stuck in a creative rut, preparing for a presentation, or just
              looking for something interesting to talk about, our generator has you covered.
            </p>
            <p>
              With over 500 hand-curated topics across 15+ categories including science,
              philosophy, technology, relationships, and more, you&apos;ll never run out of
              interesting things to discuss. Each topic comes with talking points to help guide
              your conversation or writing.
            </p>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-4">
              How to Use the Random Topic Generator
            </h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Choose a mode: conversation, writing, debate, speech, or icebreaker</li>
              <li>Optionally filter by category and depth level</li>
              <li>Select how many topics you want (1, 3, 5, or 10)</li>
              <li>Click Generate and get instant random topics!</li>
              <li>Copy any topic with one click to share or save</li>
            </ol>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-4">
              Perfect For
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Teachers looking for classroom discussion topics</li>
              <li>Writers seeking creative writing prompts</li>
              <li>Debate teams preparing for practice rounds</li>
              <li>Public speakers finding presentation ideas</li>
              <li>Friends wanting fun conversation starters</li>
              <li>Team leaders running icebreaker activities</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
