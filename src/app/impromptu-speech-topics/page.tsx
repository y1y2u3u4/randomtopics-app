import PublicAdPlacement from "@/components/PublicAdPlacement";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import ClassroomPackCard from "@/components/ClassroomPackCard";
import SpeechTimer from "@/components/SpeechTimer";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { withSocial } from "@/lib/metadata/social";
import { IMPROMPTU_GROUPS, IMPROMPTU_TOPIC_COUNT } from "@/data/impromptuTopics";
import KeepPlaying from "@/components/KeepPlaying";
import TryNext from "@/components/TryNext";

export const metadata: Metadata = withSocial({
  title: { absolute: "Impromptu Speech Topics: 120 Ideas by Category, With Tips & Timer | Random Topics" },
  description:
    "120 impromptu speech topics you can talk about with no research — personal stories, everyday opinions, hypotheticals, one-word prompts, proverbs, funny topics, student and interview questions — plus a 30-second prep method and practice timer.",
  keywords: [
    "impromptu speech topics",
    "impromptu speaking topics",
    "impromptu speech ideas",
    "1 minute speech topics",
    "extemporaneous speech topics",
    "impromptu topics for students",
    "table topics ideas",
  ],
  alternates: { canonical: "/impromptu-speech-topics" },
});

const FAQ_ITEMS = [
  {
    question: "What is an impromptu speech?",
    answer:
      "An impromptu speech is delivered with little or no preparation — you receive a topic and speak within seconds or minutes. It's a standard event in speech class, competitive forensics (Limited Prep events), Toastmasters Table Topics, and many job interviews.",
  },
  {
    question: "How long is an impromptu speech?",
    answer:
      "Common formats: 1-2 minutes for Toastmasters Table Topics, 3-5 minutes for classroom impromptu, and 5-7 minutes (with up to 2 minutes prep) for NSDA competitive impromptu. Our built-in timer covers all of these presets.",
  },
  {
    question: "What are good impromptu speech topics?",
    answer:
      "The best impromptu topics are ones anyone can speak about without research: personal experiences, opinions on everyday questions, abstract words (courage, failure, luck), proverbs, and light hypotheticals. The list on this page groups 120 of them by type, from beginner-friendly personal stories to harder one-word prompts.",
  },
  {
    question: "How do I structure an impromptu speech quickly?",
    answer:
      "Use PREP: Point (state your answer), Reason (why you believe it), Example (a short story or fact), Point (restate to close). With 30 seconds of thinking time, decide your Point and your Example — the rest fills itself in as you speak.",
  },
  {
    question: "Are these impromptu speech topics free to use?",
    answer:
      "Yes — the full list, the random picker with category and depth filters, and the practice timer are free with no signup. Teachers can use the topics in class. Optional AI feedback includes two free attempts (spoken or typed), including retries; more recorded practice is available on the monthly plan.",
  },
];

export default function ImpromptuSpeechPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Speech Topics", href: "/speech" },
            { label: "Impromptu Speech Topics" },
          ]}
        />
        <TopicGenerator
          initialMode="speech"
          contentSource="impromptu_speech_generator"
          speechFeedback
          speechTimerHref="#impromptu-timer"
          title="Impromptu Speech Topics"
          subtitle={`${IMPROMPTU_TOPIC_COUNT} no-research topics sorted by category below. Or draw one at random, try a 60-second answer and get feedback.`}
        />
        <TryNext path="/impromptu-speech-topics" />

        {/* Speech Timer */}
        <section id="impromptu-timer" className="max-w-3xl mx-auto scroll-mt-20 px-4 sm:px-6 pb-4">
          <SpeechTimer defaultSeconds={120} contentSource="impromptu_speech_generator" />
        </section>

        <ClassroomPackCard pack="speech" page="/impromptu-speech-topics" />

        {/* The list */}
        <section id="impromptu-topic-list" className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 scroll-mt-20">
          <h2 className="section-heading text-2xl sm:text-3xl mb-2 text-[var(--text-primary)]">{IMPROMPTU_TOPIC_COUNT} Impromptu Speech Topics by Category</h2>
          <p className="text-sm text-[var(--text-muted)] mb-5">Every topic works without research: answer from your own experience or opinion. Start with personal experiences if you are new, and move to quotes and one-word prompts for harder rounds.</p>
          <nav aria-label="Impromptu topic categories" className="flex flex-wrap gap-2 mb-5">
            {IMPROMPTU_GROUPS.map((g) => <a key={g.id} href={`#impromptu-${g.id}`} className="inline-flex min-h-11 items-center rounded-xl border border-white/10 px-3 py-2 text-sm text-[var(--neon-cyan)]">{g.title} · {g.topics.length}</a>)}
          </nav>
          <div className="space-y-4">
            {IMPROMPTU_GROUPS.map((g) => (
              <div key={g.id} id={`impromptu-${g.id}`} className="glass-card p-5 sm:p-6 scroll-mt-24">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{g.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 mb-3">{g.note}</p>
                <ol className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 list-decimal pl-5 text-sm text-[var(--text-secondary)]">
                  {g.topics.map((t) => <li key={t}>{t}</li>)}
                </ol>
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-5">
            Preparing a researched talk instead of speaking on the spot? Use the{" "}
            <Link prefetch={false} href="/speech" className="text-[var(--neon-cyan)] hover:underline">speech topic generator</Link> for persuasive, informative and presentation topics, or practise listening and speaking in turns with these <Link prefetch={false} href="/group-discussion-topics" className="text-[var(--neon-cyan)] hover:underline">group discussion topics</Link>.
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-3">
            More versions:{" "}
            <Link prefetch={false} href="/impromptu-speech-topics/students" className="text-[var(--neon-cyan)] hover:underline">impromptu speech topics for students</Link>,{" "}
            <Link prefetch={false} href="/impromptu-speech-topics/funny" className="text-[var(--neon-cyan)] hover:underline">funny impromptu speech topics</Link> and{" "}
            <Link prefetch={false} href="/impromptu-speech-topics/1-minute" className="text-[var(--neon-cyan)] hover:underline">1 minute speech topics</Link>.
          </p>
        </section>

        <PublicAdPlacement path="/impromptu-speech-topics" />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              How to Practice Impromptu Speaking
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Impromptu speaking feels like a talent, but it&apos;s a trainable skill with a simple
                formula: <strong>reps under time pressure</strong>. Reading tips doesn&apos;t make you
                better — speaking does. Pick a topic from the <strong>list above</strong> (or draw one at random),
                start the <strong>practice timer</strong>, give yourself 15-30 seconds to think, then speak until
                the timer ends.
              </p>
              <p>
                Impromptu formats show up everywhere: speech class assignments, NSDA and forensics Limited
                Prep events, Toastmasters <Link prefetch={false} href="/table-topics-generator" className="text-[var(--neon-cyan)] hover:underline">Table Topics</Link>,
                MUN crisis responses, and the classic interview curveball (&quot;Tell me about a time...&quot;).
                The common thread: a structure you can deploy in seconds and calm delivery while your brain
                catches up.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The 30-Second Prep Routine
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Seconds 0-10 — Pick your point.</strong> Decide the one sentence you&apos;d say if you could only say one. That&apos;s your opening and your closing.</li>
                <li><strong>Seconds 10-25 — Pick two supports.</strong> A reason and a story, or two examples. Don&apos;t outline more than two — depth beats breadth in short speeches.</li>
                <li><strong>Seconds 25-30 — Plant your first sentence.</strong> Knowing exactly how you&apos;ll start eliminates the most dangerous silence: the first one.</li>
              </ol>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Weekly Practice Plan (15 Minutes a Day)
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Mon/Wed/Fri:</strong> 4 topics × 2-minute speeches with 30-second prep. Record one and count filler words.</li>
                <li><strong>Tue/Thu:</strong> 2 topics × 5-minute speeches with 2-minute prep — build endurance and deeper structure.</li>
                <li><strong>Weekend:</strong> one &quot;cold start&quot; — speak the instant you read the topic, zero prep. This is the hardest and highest-yield drill.</li>
              </ul>
              <p>
                Want a ready question bank to drill from? Work through our{" "}
                <Link prefetch={false} href="/topics/toastmasters-table-topics" className="text-[var(--neon-cyan)] hover:underline">120 Table Topics questions</Link>{" "}
                — classic, funny, work, and family prompts you can practice one after another.
              </p>
              <p>
                Preparing a full presentation instead? Browse
                our <Link prefetch={false} href="/speech" className="text-[var(--neon-cyan)] hover:underline">speech topic generator</Link> for
                prepared speech ideas, practice a complete timed talk with the{" "}
                <Link prefetch={false} href="/5-minute-speech-topics" className="text-[var(--neon-cyan)] hover:underline">five-minute speech topics and timer</Link>, or grab ready-made lists
                like <Link prefetch={false} href="/topics/presentation-ideas-for-school" className="text-[var(--neon-cyan)] hover:underline">presentation ideas for school</Link>.
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

        <KeepPlaying path="/impromptu-speech-topics" />
      </main>
      <Footer />
    </>
  );
}
