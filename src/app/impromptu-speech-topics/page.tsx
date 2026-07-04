import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import SpeechTimer from "@/components/SpeechTimer";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impromptu Speech Topics Generator — Practice With a Timer",
  description:
    "Generate random impromptu speech topics and practice against a built-in timer. Free tool for speech class, forensics, Toastmasters and interview prep — 500+ topics, no signup.",
  alternates: { canonical: "/impromptu-speech-topics" },
};

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
      "The best impromptu topics are ones anyone can speak about without research: personal experiences, opinions on everyday questions, abstract words (courage, failure, luck), proverbs, and light hypotheticals. Our generator lets you filter by category and depth to match your audience.",
  },
  {
    question: "How do I structure an impromptu speech quickly?",
    answer:
      "Use PREP: Point (state your answer), Reason (why you believe it), Example (a short story or fact), Point (restate to close). With 30 seconds of thinking time, decide your Point and your Example — the rest fills itself in as you speak.",
  },
  {
    question: "Is this impromptu speech generator free?",
    answer:
      "Yes — 500+ curated topics, category and depth filters, unlimited AI generation, and the practice timer are all free with no signup and no ads.",
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
            { label: "Impromptu Speech Topics" },
          ]}
        />
        <TopicGenerator
          initialMode="speech"
          title="Impromptu Speech Topics Generator"
          subtitle="Get a surprise topic, start the timer, and practice speaking on your feet — the way it happens in class, contests, and interviews."
        />

        {/* Speech Timer */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
          <SpeechTimer />
        </section>

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
                better — speaking does. This page pairs a <strong>random impromptu speech topic
                generator</strong> with a <strong>practice timer</strong> so you can run realistic drills:
                generate a topic, give yourself 15-30 seconds to think, then speak until the timer ends.
              </p>
              <p>
                Impromptu formats show up everywhere: speech class assignments, NSDA and forensics Limited
                Prep events, Toastmasters <Link href="/table-topics-generator" className="text-[var(--neon-cyan)] hover:underline">Table Topics</Link>,
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
                Preparing a full presentation instead? Browse
                our <Link href="/speech" className="text-[var(--neon-cyan)] hover:underline">speech topic generator</Link> for
                prepared speech ideas, or grab ready-made lists
                like <Link href="/topics/presentation-ideas-for-school" className="text-[var(--neon-cyan)] hover:underline">presentation ideas for school</Link>.
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
