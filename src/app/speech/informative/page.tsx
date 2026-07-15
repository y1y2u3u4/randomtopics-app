import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100+ Informative Speech Topics That Teach Something Real (2026)",
  description:
    "100+ informative speech topics organized by theme — science, history, technology, health, culture and everyday life. Each one teaches your audience something concrete. Free, with a random topic generator.",
  keywords: [
    "informative speech topics",
    "topics for informative speech",
    "informative topics for speech",
    "good informative speech topics",
    "popular informative speech topics",
    "informative speech topics for college",
    "easy informative speech topics",
    "interesting informative speech topics",
  ],
  alternates: { canonical: "/speech/informative" },
};

const TOPIC_SECTIONS: {
  theme: string;
  emoji: string;
  intro: string;
  href: string;
  topics: string[];
}[] = [
  {
    theme: "Science & Nature",
    emoji: "🔬",
    intro:
      "Wonder is the easiest attention to earn — these topics let you teach something genuinely surprising in five minutes.",
    href: "/categories/science",
    topics: [
      "How mRNA vaccines actually work.",
      "Why octopuses are considered the closest thing to alien intelligence.",
      "What happens to your brain while you sleep.",
      "How CRISPR gene editing works — and what it can't do yet.",
      "The science of why we procrastinate.",
      "How black holes are photographed.",
      "Why bees are essential to one out of every three bites you eat.",
      "The microbiome: the two kilograms of bacteria that run your body.",
      "How weather forecasting became accurate.",
      "What fungi networks do beneath a forest floor.",
      "The placebo effect: why fake treatments produce real results.",
      "How memory works — and why eyewitnesses get it wrong.",
      "The James Webb telescope and what it changed about cosmology.",
    ],
  },
  {
    theme: "Technology & Future",
    emoji: "💻",
    intro:
      "Everyone uses technology; almost no one knows how it works. That gap is your speech.",
    href: "/categories/technology",
    topics: [
      "How large language models like ChatGPT actually generate text.",
      "What happens in the 200 milliseconds after you press Enter on a search.",
      "How contactless payment keeps your card details safe.",
      "The real infrastructure of 'the cloud' — cables, warehouses, and water.",
      "How GPS knows where you are within a few meters.",
      "What a computer virus actually does, step by step.",
      "How recommendation algorithms decide what you see next.",
      "The history of the QWERTY keyboard — and why we still use it.",
      "How electric car batteries work and what happens when they retire.",
      "What quantum computing can and cannot do.",
      "How Wikipedia stays mostly accurate with anonymous editors.",
      "The lifecycle of a smartphone: from mine to landfill.",
      "How deepfakes are made — and how to spot them.",
    ],
  },
  {
    theme: "Health & Psychology",
    emoji: "🧠",
    intro:
      "Self-knowledge topics — the audience learns something about their own body or mind, which makes retention effortless.",
    href: "/categories/health",
    topics: [
      "What caffeine actually does to your brain.",
      "The science of habit formation — cue, routine, reward.",
      "Why teenagers biologically cannot fall asleep early.",
      "How exercise changes the brain, not just the body.",
      "What burnout is — and how it differs from stress.",
      "The psychology of first impressions: what happens in seven seconds.",
      "How the immune system remembers diseases for decades.",
      "Why multitasking is a myth.",
      "What happens to your body during a panic attack — and why it's survivable.",
      "The Dunning-Kruger effect: why beginners feel like experts.",
      "How music affects the brain during study and exercise.",
      "The real science of intermittent fasting.",
      "Why we dream: the leading theories.",
    ],
  },
  {
    theme: "History & Culture",
    emoji: "📜",
    intro:
      "Story-shaped topics — history speeches succeed because narrative does the persuading for you.",
    href: "/categories/history",
    topics: [
      "The 1918 flu pandemic: what we learned and forgot.",
      "How the Silk Road connected the ancient world.",
      "The women mathematicians who got NASA to the Moon.",
      "Why the Library of Alexandria burned — and what was actually lost.",
      "The history of coffee: from Ethiopian monks to global fuel.",
      "How the printing press triggered a century of upheaval.",
      "The Berlin Wall: rise, fall, and what remains.",
      "How jeans went from workwear to global uniform.",
      "The Olympics' strangest discontinued events.",
      "How writing systems were invented three separate times.",
      "The history of vaccines: from cowpox to mRNA.",
      "Why we shake hands: the ancient origins of everyday gestures.",
      "The forgotten pandemic drills that predicted 2020.",
    ],
  },
  {
    theme: "Money & How Things Work",
    emoji: "💼",
    intro:
      "Practical literacy topics — the audience leaves knowing how a system that affects them actually functions.",
    href: "/categories/business",
    topics: [
      "How credit scores are calculated — and who invented them.",
      "What inflation actually is, explained with one cup of coffee.",
      "How the stock market works in plain language.",
      "Where your tax money actually goes.",
      "How airlines price the same seat at ten different prices.",
      "What happens to your package between 'shipped' and 'delivered'.",
      "How streaming services decide what shows get made.",
      "The economics of free apps: if it's free, you're the product.",
      "How compound interest builds — and destroys — fortunes.",
      "What a recession actually is, and how economists spot one.",
      "How tipping became standard in America but not elsewhere.",
      "The supply chain of a $5 t-shirt.",
      "How auctions really work: from eBay to art houses.",
    ],
  },
  {
    theme: "Everyday Life & Fun",
    emoji: "🤪",
    intro:
      "Low-prep, high-delight topics — ideal for first speeches and five-minute assignments where curiosity beats gravitas.",
    href: "/categories/weird-fun",
    topics: [
      "Why movie trailers give away the whole plot — on purpose.",
      "The engineering inside a roller coaster loop.",
      "How chess became an esport.",
      "Why supermarkets are laid out the way they are.",
      "The secret life of airport baggage: where lost luggage goes.",
      "How fortune cookies became 'Chinese' food in America.",
      "The science of a perfect chocolate chip cookie.",
      "Why we get songs stuck in our heads.",
      "How escape rooms are designed to be solvable.",
      "The history of emoji — and who decides which ones exist.",
      "Why cats purr: the leading explanations.",
      "How speedrunners break video games.",
      "The surprisingly fierce world of competitive crossword solving.",
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "What is an informative speech topic?",
    answer:
      "An informative speech topic teaches your audience something concrete without arguing for a position — the goal is understanding, not agreement. 'How mRNA vaccines work' is informative; 'Vaccines should be mandatory' is persuasive. The best informative topics answer a question the audience did not know they had, and leave them able to explain the idea to someone else.",
  },
  {
    question: "What makes a good informative speech topic?",
    answer:
      "Three tests: novelty, scope, and demonstrability. Novelty — the audience should learn something they genuinely did not know. Scope — the topic must fit your time limit; 'World War II' fails in five minutes, 'why the 1918 flu was forgotten' succeeds. Demonstrability — you can show rather than tell, with examples, numbers, a prop, or a story. Topics that pass all three keep audiences awake without needing controversy.",
  },
  {
    question: "What are easy informative speech topics for beginners?",
    answer:
      "Choose topics where your everyday experience is already half the research: how supermarkets are laid out, why songs get stuck in your head, what happens to lost luggage, the science of a good cookie. Our Everyday Life & Fun section is built for first speeches — real informative structure with material that is easy to research and fun to deliver.",
  },
  {
    question: "How is an informative speech different from a persuasive speech?",
    answer:
      "Intent. An informative speech answers 'what is this and how does it work?' while a persuasive speech answers 'what should we do about it?' The same subject can produce both: 'how recommendation algorithms work' informs, 'algorithmic feeds should be off by default' persuades. Many great speeches start informative and end persuasive — but for a graded informative assignment, keep your conclusion free of 'should'.",
  },
  {
    question: "Can I get a random informative speech topic?",
    answer:
      "Yes — our speech topic generator deals random speech topics with talking points across 16 categories, and the impromptu speech tool adds a practice timer. Random topics are ideal practice for informative speaking: they force you to research, structure, and explain something new instead of recycling a topic you already know.",
  },
];

export default function InformativeSpeechTopicsPage() {
  let counter = 0;
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Speech Topics", href: "/speech" },
            { label: "Informative" },
          ]}
        />

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
          <h1
            className="text-3xl sm:text-5xl font-bold mb-4 text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            100+ Informative <span className="gradient-text">Speech Topics</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto">
            Every topic below teaches your audience something real — organized by theme, scoped to
            fit a class assignment, and picked so listeners actually stay awake. Steal one, or spin
            a random topic with talking points included.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link href="/speech" className="btn-generate inline-flex items-center gap-2 text-sm px-6 py-3">
              <span>🎲</span> Random Speech Topic Generator
            </Link>
            <Link
              href="/speech/persuasive"
              className="inline-flex items-center gap-2 text-sm px-6 py-3 rounded-lg border border-[rgba(255,255,255,0.1)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-all"
            >
              🗣️ Persuasive Speech Topics
            </Link>
          </div>
        </section>

        {/* Quick nav */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {TOPIC_SECTIONS.map((s) => (
              <a
                key={s.theme}
                href={`#${s.theme.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="text-xs px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] text-[var(--text-muted)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-all"
              >
                {s.emoji} {s.theme}
              </a>
            ))}
          </div>
        </section>

        {/* Topics by theme */}
        {TOPIC_SECTIONS.map((section) => {
          const startAt = counter;
          counter += section.topics.length;
          return (
            <section
              key={section.theme}
              id={section.theme.toLowerCase().replace(/[^a-z]+/g, "-")}
              className="max-w-3xl mx-auto px-4 sm:px-6 pb-8"
            >
              <div className="glass-card p-8 sm:p-10">
                <h2
                  className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {section.emoji} Informative Speech Topics: {section.theme}
                </h2>
                <p className="text-[var(--text-muted)] text-sm mb-5">{section.intro}</p>
                <ol className="space-y-3">
                  {section.topics.map((topic, i) => (
                    <li key={topic} className="flex gap-3 items-start text-sm text-[var(--text-secondary)] leading-relaxed">
                      <span className="text-[var(--neon-cyan)] font-bold shrink-0">{startAt + i + 1}.</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-[var(--text-muted)] mt-5">
                  Want more angles?{" "}
                  <Link href={section.href} className="text-[var(--neon-cyan)] hover:underline">
                    Browse {section.theme.toLowerCase()} topics
                  </Link>{" "}
                  or spin the{" "}
                  <Link href="/speech" className="text-[var(--neon-cyan)] hover:underline">
                    speech generator
                  </Link>{" "}
                  filtered to this category.
                </p>
              </div>
            </section>
          );
        })}

        {/* SEO content + FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              How to Turn a Topic Into a Speech That Teaches
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                An <strong>informative speech topic</strong> earns attention with a question and
                keeps it with structure. The reliable skeleton: open with the question your topic
                answers ("Where does lost luggage actually go?"), preview your two or three main
                points, teach each one with a concrete example or number, and close by returning to
                the opening question — now answered. If your audience can explain the idea to a
                friend afterward, the speech worked.
              </p>
              <p>
                Scope is the most common failure: pick the five-minute slice of a subject, not the
                subject itself. Practice with random draws to build that instinct — our{" "}
                <Link href="/speech" className="text-[var(--neon-cyan)] hover:underline">speech topic generator</Link>{" "}
                deals topics with talking points, the{" "}
                <Link href="/impromptu-speech-topics" className="text-[var(--neon-cyan)] hover:underline">impromptu speech tool</Link>{" "}
                adds a timer, and{" "}
                <Link href="/table-topics-generator" className="text-[var(--neon-cyan)] hover:underline">Table Topics</Link>{" "}
                runs the Toastmasters format. Need class-ready lists instead? See{" "}
                <Link href="/topics/speech-topics-for-college-students" className="text-[var(--neon-cyan)] hover:underline">75 speech topics for college students</Link>{" "}
                and{" "}
                <Link href="/topics/presentation-ideas-for-school" className="text-[var(--neon-cyan)] hover:underline">65 presentation ideas for school</Link>.
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
