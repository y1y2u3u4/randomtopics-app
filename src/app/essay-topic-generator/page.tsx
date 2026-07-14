import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essay Topic Generator — Random Essay Topics & Prompts, Free",
  description:
    "Free essay topic generator. Get a random essay topic or prompt instantly for argumentative, persuasive, expository, and narrative essays — across 16 subjects. No signup, unlimited spins.",
  keywords: [
    "essay topic generator",
    "essay prompt generator",
    "random essay topic generator",
    "random essay topics generator",
    "topic generator for essay",
    "random essay topics",
    "random essay",
  ],
  alternates: {
    canonical: "/essay-topic-generator",
  },
};

// Essay-friendly subject areas (map to existing category pages). These double as
// browse links for the "random essay topics" intent.
const ESSAY_SUBJECTS: { emoji: string; label: string; href: string }[] = [
  { emoji: "🔬", label: "Science", href: "/categories/science" },
  { emoji: "💻", label: "Technology", href: "/categories/technology" },
  { emoji: "📜", label: "History", href: "/categories/history" },
  { emoji: "🤔", label: "Philosophy", href: "/categories/philosophy" },
  { emoji: "🧠", label: "Psychology", href: "/categories/psychology" },
  { emoji: "🏛️", label: "Politics", href: "/categories/politics" },
  { emoji: "❤️", label: "Health", href: "/categories/health" },
  { emoji: "🎨", label: "Art & Culture", href: "/categories/art-culture" },
  { emoji: "🌿", label: "Environment", href: "/categories/nature" },
  { emoji: "💼", label: "Business", href: "/categories/business" },
  { emoji: "📚", label: "Education", href: "/categories/education" },
  { emoji: "💬", label: "Society", href: "/categories/relationships" },
];

// Essay types — the four workhorse formats students are assigned. Each links to
// the writing prompts tool so the generator covers format-specific intent.
const ESSAY_TYPES: { label: string; blurb: string }[] = [
  { label: "Argumentative", blurb: "Take a clear position and defend it with evidence." },
  { label: "Persuasive", blurb: "Convince the reader to adopt your point of view." },
  { label: "Expository", blurb: "Explain or inform on a topic without taking sides." },
  { label: "Narrative", blurb: "Tell a story that makes a point or reflection." },
  { label: "Compare & Contrast", blurb: "Weigh two subjects against each other." },
  { label: "Cause & Effect", blurb: "Trace why something happens and what follows." },
];

const FAQ_ITEMS = [
  {
    question: "What is an essay topic generator?",
    answer:
      "An essay topic generator instantly gives you a random essay topic or prompt to write about at the click of a button. Instead of staring at a blank page, you get a ready-to-develop subject with talking points. Ours pulls from 16 subject areas — science, history, philosophy, politics, health, and more — so you can find a topic for almost any assignment, from an argumentative essay to a reflective personal one.",
  },
  {
    question: "How do I use the essay topic generator?",
    answer:
      "Click generate to get a random essay topic instantly. Want to narrow it down? Pick a subject like Science or History first, then spin — every result comes with an angle you can turn into a thesis. Keep clicking until a prompt sparks something. It is free, needs no signup, and has no limit, so you can generate as many essay ideas as you need.",
  },
  {
    question: "Can it generate topics for argumentative and persuasive essays?",
    answer:
      "Yes. Many of the generated topics are debatable by design, which makes them ideal for argumentative and persuasive essays — you get two defensible sides to build an argument around. For explanatory assignments, the same topics work as expository or research-paper subjects. Pair the tool with our debate topics if you specifically want a strong for-and-against angle.",
  },
  {
    question: "Is the essay topic generator free?",
    answer:
      "Completely free — no account, no signup, no limits, and no ads blocking the tool. It works on phones, tablets, and laptops, so you can brainstorm essay topics in class, in the library, or at home. Generate unlimited random essay topics and prompts as often as you like.",
  },
  {
    question: "What is the difference between a topic and a prompt?",
    answer:
      "A topic is the subject you write about (for example, social media and mental health); a prompt frames it as a question or task (for example, \"Argue whether social media does more harm than good for teenagers\"). This generator gives you both — a subject plus a ready angle — so you can move straight from idea to outline.",
  },
];

export default function EssayTopicGeneratorPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Essay Topic Generator" },
          ]}
        />
        <TopicGenerator
          initialMode="writing"
          title="Essay Topic Generator"
          subtitle="Get a random essay topic or prompt instantly. Pick a subject to focus your essay, or leave it on random and let the generator hand you one to write about."
        />

        {/* Essay subjects picker */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Random Essay Topics by Subject
            </h2>
            <p className="text-[var(--text-muted)] text-sm mb-5">
              Tap a subject to generate an essay topic within it — or use the generator above on random for
              a surprise prompt. Great for research papers, class assignments, and timed writing.
            </p>
            <div className="flex flex-wrap gap-3">
              {ESSAY_SUBJECTS.map((s) => (
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

        {/* Essay types */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Works for Every Essay Type
            </h2>
            <p className="text-[var(--text-muted)] text-sm mb-5">
              The same generated topics adapt to whatever format you have been assigned. Turn any prompt
              into one of these with our{" "}
              <Link href="/writing" className="text-[var(--neon-cyan)] hover:underline">writing prompts</Link>{" "}
              tool.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {ESSAY_TYPES.map((e) => (
                <div
                  key={e.label}
                  className="text-sm px-4 py-3 rounded-lg border border-[rgba(255,255,255,0.06)]"
                >
                  <strong className="text-[var(--text-primary)]">{e.label}</strong>
                  <p className="text-[var(--text-muted)] mt-0.5">{e.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              The Free Essay Topic Generator
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Need <strong>an essay topic</strong> right now? This <strong>essay topic generator</strong>{" "}
                hands you one instantly — a random essay prompt with a built-in angle you can turn into a
                thesis. Whether you are facing an argumentative essay, a research paper, a timed exam
                response, or a personal statement, a random starting point beats a blank page every time.
              </p>
              <p>
                Unlike a plain word picker, every topic here comes with real, hand-crafted talking points.
                You do not just get told &quot;the internet&quot; — you get a specific, debatable angle you can
                actually argue, explain, or explore in an essay. Spin until something clicks, then start
                outlining.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Who Uses an Essay Topic Generator?
              </h3>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">1.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Students &amp; Exam Prep</strong>
                    <p className="mt-1">Beat writer&apos;s block on assignments, or practice timed essays by generating a surprise prompt and giving yourself 40 minutes. Great for SAT, IELTS, and AP-style writing drills.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">2.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">College Applications</strong>
                    <p className="mt-1">Warm up before writing personal statements by riffing on random reflective prompts. For ready-made lists, see our <Link href="/topics/random-essay-topics-for-college" className="text-[var(--neon-cyan)] hover:underline">random essay topics for college</Link>.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">3.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Teachers &amp; Writing Clubs</strong>
                    <p className="mt-1">Project the generator and assign each student a random essay topic for a writing sprint, or use it to build a bank of prompts for the term.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">4.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Argumentative &amp; Debate Essays</strong>
                    <p className="mt-1">Many prompts are two-sided by design. Pair the tool with our <Link href="/debate" className="text-[var(--neon-cyan)] hover:underline">debate topics</Link> when you need a clear for-and-against to structure your argument.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">5.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Bloggers &amp; Journalers</strong>
                    <p className="mt-1">Out of things to write? Use a random essay prompt as a <Link href="/writing" className="text-[var(--neon-cyan)] hover:underline">writing prompt</Link> or a daily journaling seed to keep the words flowing.</p>
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
                <li><strong>Click generate</strong> — get an instant essay topic with a ready angle</li>
                <li><strong>Use the talking points</strong> — each result includes ideas to build a thesis</li>
                <li><strong>Spin again</strong> — one more click for a brand-new essay prompt</li>
              </ol>

              <p className="pt-2">
                Looking for a broader subject rather than a full prompt? Try the{" "}
                <Link href="/random-subject-generator" className="text-[var(--neon-cyan)] hover:underline">random subject generator</Link>. Want any topic across every category? Use the general{" "}
                <Link href="/topic-generator" className="text-[var(--neon-cyan)] hover:underline">topic generator</Link>.
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
