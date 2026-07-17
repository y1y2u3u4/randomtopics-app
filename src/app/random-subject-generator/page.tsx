import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Subject Generator — Get a Random Subject or Topic Instantly",
  description:
    "Free random subject generator. Spin a random subject to talk about, write about, or study — from science and history to philosophy and art. Includes a random school subject picker across 16 subjects. No signup.",
  keywords: [
    "random subject generator",
    "random subject",
    "random school subject generator",
    "random subject generator school",
    "random subjects",
    "give me a random subject",
    "random topic generator",
  ],
  alternates: {
    canonical: "/random-subject-generator",
  },
};

// The 16 categories double as "subjects" for the school-subject intent.
const SCHOOL_SUBJECTS: { emoji: string; label: string; href: string }[] = [
  { emoji: "🔬", label: "Science", href: "/categories/science" },
  { emoji: "💻", label: "Technology", href: "/categories/technology" },
  { emoji: "🤔", label: "Philosophy", href: "/categories/philosophy" },
  { emoji: "🧠", label: "Psychology", href: "/categories/psychology" },
  { emoji: "📜", label: "History", href: "/categories/history" },
  { emoji: "🎨", label: "Art & Culture", href: "/categories/art-culture" },
  { emoji: "🍕", label: "Food & Travel", href: "/categories/food-travel" },
  { emoji: "💬", label: "Relationships", href: "/categories/relationships" },
  { emoji: "📚", label: "Education", href: "/categories/education" },
  { emoji: "🏛️", label: "Politics", href: "/categories/politics" },
  { emoji: "🎬", label: "Entertainment", href: "/categories/entertainment" },
  { emoji: "⚽", label: "Sports", href: "/categories/sports" },
  { emoji: "💼", label: "Business", href: "/categories/business" },
  { emoji: "🌿", label: "Nature", href: "/categories/nature" },
  { emoji: "❤️", label: "Health", href: "/categories/health" },
  { emoji: "🤪", label: "Weird & Fun", href: "/categories/weird-fun" },
];

const FAQ_ITEMS = [
  {
    question: "What is a random subject generator?",
    answer:
      "A random subject generator instantly picks a subject or topic for you at the click of a button. Instead of staring at a blank page trying to decide what to talk about, write about, or study, you get a randomly chosen subject to work with. Our version pulls from 16 subject areas — science, history, philosophy, psychology, business, art, and more — and can generate a full discussion prompt within any subject you choose.",
  },
  {
    question: "How does the random school subject picker work?",
    answer:
      "Treat each of the 16 categories as a school subject. Pick a subject to lock the generator to that area, or leave it on random to be assigned any subject at all — perfect for revision roulette, deciding what to study next, or a teacher assigning surprise topics. Each result comes with a ready-made prompt so students can start writing or discussing immediately.",
  },
  {
    question: "Is the random subject generator free?",
    answer:
      "Yes — completely free, with no signup, no account, and no limits. Generate as many random subjects and topics as you like. It works on phones, tablets, and computers, so it is easy to use in class, at home, or during a study session.",
  },
  {
    question: "What can I use a random subject for?",
    answer:
      "Randomly chosen subjects are great for essays and research papers, class presentations, speech and debate practice, journaling, study drills, and conversation. Randomness helps you discover subjects you would never have picked on your own, which makes practice more varied and effective.",
  },
  {
    question: "How is this different from a random topic generator?",
    answer:
      "A subject is the broad area (history, science, health) while a topic is a specific prompt within it. This tool works at both levels: choose a subject to narrow the field, then generate a specific topic to talk or write about. If you want any topic across every subject at once, our general topic generator does exactly that.",
  },
];

export default function RandomSubjectGeneratorPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Random Subject Generator" },
          ]}
        />
        <TopicGenerator
          title="Random Subject Generator"
          subtitle="Spin a random subject to talk about, write about, or study. Pick a subject to focus, or leave it on random and let the generator choose for you."
        />

        {/* School subjects picker */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pick a Random School Subject
            </h2>
            <p className="text-[var(--text-muted)] text-sm mb-5">
              Tap any subject to generate a topic within it — or use the generator above on random to be
              assigned a surprise subject. Great for revision roulette and study drills.
            </p>
            <div className="flex flex-wrap gap-3">
              {SCHOOL_SUBJECTS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="text-sm px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 hover:bg-[rgba(0,229,255,0.05)] transition-all"
                >
                  {s.emoji} {s.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              The Free Random Subject Generator
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Need <strong>a random subject</strong> right now? This <strong>random subject
                generator</strong> gives you one instantly — whether you are a student deciding what to
                study, a writer looking for something to write about, or a speaker who needs a subject to
                practice on. Choose from 16 subject areas or let the generator pick a completely random
                subject for you, then get a ready-to-use prompt to run with.
              </p>
              <p>
                Unlike a plain word picker, every subject here comes attached to real, hand-crafted
                talking points and prompts. That means you do not just get told &quot;history&quot; — you get a
                specific angle within history you can actually discuss, debate, or write about.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Who Uses a Random Subject Generator?
              </h3>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">1.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Students &amp; Revision</strong>
                    <p className="mt-1">Turn study into a game with &quot;revision roulette&quot; — get assigned a random school subject and quiz yourself, or use it to decide what to revise next when everything feels equally daunting.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">2.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Essays &amp; Research Papers</strong>
                    <p className="mt-1">Stuck on what to write about? Generate a random subject, then narrow to a specific prompt. Send it straight to our <Link href="/essay-topic-generator" className="text-[var(--neon-cyan)] hover:underline">essay topic generator</Link>, or browse <Link href="/topics/random-essay-topics-for-college" className="text-[var(--neon-cyan)] hover:underline">random essay topics for college</Link> for ready-made lists.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">3.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Speech &amp; Debate Practice</strong>
                    <p className="mt-1">Assign yourself a surprise subject and speak on it — the fastest way to build confidence. See our <Link href="/table-topics-generator" className="text-[var(--neon-cyan)] hover:underline">Table Topics generator</Link> and <Link href="/debate" className="text-[var(--neon-cyan)] hover:underline">debate topics</Link>.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">4.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Teachers &amp; Group Activities</strong>
                    <p className="mt-1">Project the generator in class and hand out random subjects for writing sprints, presentations, or discussion. Every result works as a self-contained prompt.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">5.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Conversation &amp; Journaling</strong>
                    <p className="mt-1">Break out of the same old subjects. Use a random subject as a <Link href="/conversation" className="text-[var(--neon-cyan)] hover:underline">conversation starter</Link> or a daily <Link href="/writing" className="text-[var(--neon-cyan)] hover:underline">journaling prompt</Link>.</p>
                  </div>
                </li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How It Works
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Pick a subject</strong> (optional) — choose one of 16 subjects, or leave it random</li>
                <li><strong>Click generate</strong> — get an instant random subject with a ready prompt</li>
                <li><strong>Use the talking points</strong> — each result includes ideas to develop</li>
                <li><strong>Spin again</strong> — one more click for a brand-new random subject</li>
              </ol>

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

        {/* JSON-LD FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ_ITEMS.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
