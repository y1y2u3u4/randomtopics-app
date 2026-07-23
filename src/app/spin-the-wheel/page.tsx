import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import WheelGenerator from "@/components/WheelGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { PartyIllustration } from "@/components/CategoryIllustration";
import { CATEGORIES } from "@/data/types";
import { topics } from "@/data/topics";

export const metadata: Metadata = {
  title: "Spin the Wheel — Random Topic Wheel Generator, Free & No Signup",
  description:
    "Spin the wheel to get a random topic. A free random topic wheel across 16 categories — perfect for conversations, classroom warm-ups, debates and icebreakers. One click, instant result, no signup.",
  keywords: [
    "spin the wheel",
    "random topic wheel",
    "wheel of topics",
    "spinner wheel generator",
    "random wheel picker",
    "topic wheel generator",
  ],
  alternates: { canonical: "/spin-the-wheel" },
};

const FAQ_ITEMS = [
  {
    question: "What is the topic wheel?",
    answer:
      "The topic wheel is a free random picker that spins across 16 topic categories — from science and technology to food, relationships, and weird-and-fun. When the wheel stops, it hands you a real topic from that category, complete with talking points you can dive into right away.",
  },
  {
    question: "Is the wheel really random?",
    answer:
      "Yes. Every spin selects a category with equal probability, then picks a fresh topic from that category's curated database at random. There is no weighting and no signup — just spin and go.",
  },
  {
    question: "What can I use the topic wheel for?",
    answer:
      "It works as a conversation starter at parties and dinners, a bell-ringer or discussion prompt in classrooms, a warm-up for Toastmasters and public-speaking practice, and a tie-breaker whenever a group can't decide what to talk about.",
  },
  {
    question: "How is the wheel different from the topic generator?",
    answer:
      "Same database, different feel. The wheel adds a spin-and-reveal moment that groups love, while the classic generator lets you filter by mode, category, and depth and pull several topics at once. Use the wheel for fun and surprise, the generator for control.",
  },
  {
    question: "Do I need to download anything or create an account?",
    answer:
      "No. The topic wheel runs entirely in your browser, it is completely free, and it never asks you to sign up or install anything.",
  },
];

export default function SpinTheWheelPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Spin the Wheel" }]} />
        <PartyIllustration game="spin-the-wheel" />
        <WheelGenerator
          title="Spin the Wheel"
          subtitle="Spin the random topic wheel across 16 categories — one click, one topic, endless combinations."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              A Random Topic Wheel That Actually Gives You Something to Say
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Most <strong>spin-the-wheel</strong> tools stop at a word or a name. This one lands on a
                full <strong>random topic</strong> — a real prompt with built-in talking points — so the moment
                the wheel stops, you already know what to discuss, write about, or debate. Sixteen categories
                sit on the wheel, from science and technology to food and travel, relationships, history, and the
                gloriously weird. Give it a spin and let chance break the deadlock.
              </p>
              <p>
                The wheel is the playful cousin of our{" "}
                <Link href="/" className="text-[var(--neon-cyan)] hover:underline">
                  random topic generator
                </Link>
                . Both draw from the same curated database of 500+ topics, but the wheel adds the spin-and-reveal
                suspense that groups love. Want more control instead of chance? The generator lets you filter by
                mode, category, and depth, and pull several topics at once.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ways to Use the Topic Wheel
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <strong>Parties &amp; dinners:</strong> spin whenever the conversation stalls — the surprise
                  factor does the heavy lifting.
                </li>
                <li>
                  <strong>Classrooms:</strong> use it as a bell-ringer or discussion warm-up. Pair it with the{" "}
                  <Link href="/debate/middle-school" className="text-[var(--neon-cyan)] hover:underline">
                    middle school debate generator
                  </Link>{" "}
                  for a quick persuasive-writing seed.
                </li>
                <li>
                  <strong>Public speaking:</strong> spin, take 30 seconds, and give a two-minute impromptu talk —
                  great for{" "}
                  <Link href="/table-topics-generator" className="text-[var(--neon-cyan)] hover:underline">
                    Toastmasters Table Topics
                  </Link>{" "}
                  practice.
                </li>
                <li>
                  <strong>Icebreakers:</strong> let each person spin once and answer whatever the wheel gives them.
                </li>
              </ul>

              <p>
                Prefer a fixed deck? Try{" "}
                <Link href="/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">
                  Would You Rather
                </Link>
                ,{" "}
                <Link href="/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">
                  Never Have I Ever
                </Link>
                , or the{" "}
                <Link href="/question-generator" className="text-[var(--neon-cyan)] hover:underline">
                  random question generator
                </Link>
                .
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

        {/* What can land on the wheel: one real topic per category, from the curated DB */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3" style={{ fontFamily: "var(--font-display)" }}>
              What Can Land on the Wheel
            </h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
              All sixteen wedges, each with a real example from the curated database it draws on &mdash;
              so you know what kind of topic each slice can deal before you spin.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const sample = topics.find((t) => t.category === cat.id && t.depth !== "light") ?? topics.find((t) => t.category === cat.id);
                return (
                  <Link key={cat.id} href={`/categories/${cat.id}`} className="rounded-xl border border-[rgba(255,255,255,0.06)] p-4 hover:border-[var(--neon-cyan)]/30 transition-all">
                    <p className="text-xs font-bold text-[var(--text-primary)] mb-1">{cat.emoji} {cat.label}</p>
                    {sample && <p className="text-[var(--text-secondary)] text-xs leading-relaxed">{sample.text}</p>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
