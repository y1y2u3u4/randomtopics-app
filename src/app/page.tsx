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
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="section-heading text-2xl sm:text-3xl text-center mb-12">
            Choose Your <span className="gradient-text">Mode</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODES.map((mode) => (
              <Link
                key={mode.slug}
                href={`/${mode.slug}`}
                className="glass-card p-7 transition-all duration-300 hover:translate-y-[-4px] group
                  hover:border-[var(--neon-pink)]/40
                  hover:shadow-[0_0_20px_rgba(255,45,120,0.15)]
                  hover:bg-gradient-to-br hover:from-[rgba(255,45,120,0.06)] hover:to-transparent"
              >
                <span className="text-4xl mb-4 block drop-shadow-lg">{mode.emoji}</span>
                <h3
                  className="text-lg font-bold mb-2 group-hover:text-[var(--neon-pink)] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {mode.label}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{mode.description}</p>
              </Link>
            ))}
            <Link
              href="/funny"
              className="glass-card p-7 transition-all duration-300 hover:translate-y-[-4px] group
                hover:border-[var(--neon-pink)]/40
                hover:shadow-[0_0_20px_rgba(255,45,120,0.15)]
                hover:bg-gradient-to-br hover:from-[rgba(255,45,120,0.06)] hover:to-transparent"
            >
              <span className="text-4xl mb-4 block drop-shadow-lg">😂</span>
              <h3
                className="text-lg font-bold mb-2 group-hover:text-[var(--neon-pink)] transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Funny Topics
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Hilarious and bizarre topics guaranteed to make everyone laugh
              </p>
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)]/20 to-transparent" />
        </div>

        {/* Categories section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="section-heading text-2xl sm:text-3xl text-center mb-12">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="glass-card p-4 sm:p-5 text-center transition-all duration-300 hover:translate-y-[-4px] group
                  hover:border-[var(--neon-cyan)]/40
                  hover:shadow-[0_0_20px_rgba(0,229,255,0.12)]
                  hover:bg-gradient-to-br hover:from-[rgba(0,229,255,0.06)] hover:to-transparent"
              >
                <span className="text-3xl mb-2 block drop-shadow-lg">{cat.emoji}</span>
                <span
                  className="text-sm font-medium group-hover:text-[var(--neon-cyan)] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)]/20 to-transparent" />
        </div>

        {/* SEO content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="section-heading text-2xl sm:text-3xl mb-8 text-[var(--text-primary)]"
            >
              What is a Random Topic Generator?
            </h2>
            <div className="space-y-5 text-[var(--text-secondary)] text-sm leading-relaxed">
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
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How to Use the Random Topic Generator
              </h3>
              <ol className="space-y-3 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                  <span>Choose a mode: conversation, writing, debate, speech, or icebreaker</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                  <span>Optionally filter by category and depth level</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                  <span>Select how many topics you want (1, 3, 5, or 10)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">4</span>
                  <span>Click Generate and get instant random topics!</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">5</span>
                  <span>Copy any topic with one click to share or save</span>
                </li>
              </ol>
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Perfect For
              </h3>
              <ul className="space-y-2.5 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span>Teachers looking for classroom discussion topics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span>Writers seeking creative writing prompts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span>Debate teams preparing for practice rounds</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span>Public speakers finding presentation ideas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span>Friends wanting fun conversation starters</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span>Team leaders running icebreaker activities</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
