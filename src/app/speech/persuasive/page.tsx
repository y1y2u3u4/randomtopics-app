import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100+ Persuasive Speech Topics That Actually Persuade (2026)",
  description:
    "100+ persuasive speech topics organized by theme — school, technology, health, environment, money and fun. Each one takes a clear stance your audience can disagree with. Free, with a random topic generator.",
  keywords: [
    "persuasive speech topics",
    "topics for persuasive speech",
    "persuasive speech topic ideas",
    "good persuasive speech topics",
    "easy persuasive speech topics",
    "persuasive speech topics for college",
    "persuasive speech topics for teens",
    "interesting persuasive speech topics",
  ],
  alternates: { canonical: "/speech/persuasive" },
};

const TOPIC_SECTIONS: {
  theme: string;
  emoji: string;
  intro: string;
  href: string;
  topics: string[];
}[] = [
  {
    theme: "School & Education",
    emoji: "📚",
    intro:
      "The most assigned persuasive territory — every listener has been a student, so the stakes land immediately.",
    href: "/categories/education",
    topics: [
      "Schools should replace letter grades with written feedback.",
      "College should be free for every qualified student.",
      "Homework should be capped at 30 minutes per night.",
      "Financial literacy should be a graduation requirement.",
      "Standardized tests should be abolished in admissions.",
      "Schools should start no earlier than 9 a.m.",
      "Every student should learn to code before learning a second language.",
      "Phones should be locked away during the school day.",
      "Physical education should count toward GPA.",
      "Schools should teach media literacy before teaching history.",
      "Trade school deserves the same prestige as university.",
      "Attendance should never affect a course grade.",
      "AI tutors should supplement — not replace — human teachers.",
    ],
  },
  {
    theme: "Technology & Social Media",
    emoji: "💻",
    intro:
      "High-interest, evidence-rich, and constantly refreshed by the news cycle — ideal when you need the room to lean in.",
    href: "/categories/technology",
    topics: [
      "Social media platforms should verify the age of every user.",
      "Algorithmic feeds should be off by default.",
      "AI-generated content should always carry a visible label.",
      "Tech companies should pay you for your personal data.",
      "Smartphones should not be marketed to children under 12.",
      "Self-driving cars should replace human drivers on highways.",
      "Governments should regulate AI like they regulate medicine.",
      "Everyone should have the legal right to be forgotten online.",
      "Influencers should disclose every paid post — with penalties.",
      "Facial recognition should be banned in public spaces.",
      "Video games belong in the school curriculum.",
      "The internet should be a public utility.",
      "Deepfakes of real people should be illegal without consent.",
    ],
  },
  {
    theme: "Health & Lifestyle",
    emoji: "❤️",
    intro:
      "Personal-stakes topics where the audience can act on your conclusion the same day — the essence of persuasion.",
    href: "/categories/health",
    topics: [
      "Junk food advertising should be banned before 9 p.m.",
      "Mental health days should be a legal right for workers and students.",
      "Sugar should be taxed like tobacco.",
      "Every workplace should offer a four-day week option.",
      "Organ donation should be opt-out, not opt-in.",
      "Fast fashion is a public health issue, not just an environmental one.",
      "Sleep education belongs in every school curriculum.",
      "Gyms should be subsidized like public transit.",
      "Ultra-processed foods should carry warning labels.",
      "Vaccination should be required for public school attendance.",
      "Social media use should come with screen-time nutrition labels.",
      "Therapy should be as normal as a dental checkup.",
      "Youth sports should ban year-round single-sport specialization.",
    ],
  },
  {
    theme: "Environment & Sustainability",
    emoji: "🌿",
    intro:
      "Urgency built in — the challenge is moving the audience from agreement to action, which is what strong speeches do.",
    href: "/categories/nature",
    topics: [
      "Single-use plastics should be banned nationwide.",
      "Meat should cost what it really costs the planet.",
      "Every new roof should be required to hold solar panels.",
      "Fast fashion brands should fund textile recycling.",
      "Short-haul flights should be replaced by rail where possible.",
      "Nuclear power is the most realistic path to zero carbon.",
      "Cities should be redesigned for bikes, not cars.",
      "Companies should publish their carbon footprint like a nutrition label.",
      "Lawns are an environmental disaster we should retire.",
      "Bottled water should be banned where tap water is safe.",
      "Climate education should be mandatory in every grade.",
      "Wealthy nations owe climate reparations to developing ones.",
      "Your individual carbon footprint matters less than your vote.",
    ],
  },
  {
    theme: "Money & Work",
    emoji: "💼",
    intro:
      "Adult-audience favorites — money topics force concrete trade-offs, which keeps arguments honest.",
    href: "/categories/business",
    topics: [
      "Everyone should receive a universal basic income.",
      "Unpaid internships should be illegal.",
      "Salaries should be transparent inside every company.",
      "Tipping should be replaced by living wages.",
      "The minimum wage should rise automatically with inflation.",
      "Remote work should be a legal right for office jobs.",
      "CEO pay should be capped as a multiple of median pay.",
      "Credit scores are an unfair gatekeeper and should be reformed.",
      "Employees should sit on every corporate board.",
      "Buy-now-pay-later apps should be regulated like credit cards.",
      "Financial influencers should be licensed to give advice.",
      "A four-day week produces more than a five-day week.",
      "Student loan debt should be dischargeable in bankruptcy.",
    ],
  },
  {
    theme: "Society & Justice",
    emoji: "🏛️",
    intro:
      "The classic persuasive arena — rights, fairness, and how we live together. Handle with evidence and empathy.",
    href: "/categories/politics",
    topics: [
      "Voting should be a national holiday.",
      "The voting age should be lowered to 16.",
      "Jury duty should pay a living wage.",
      "Prisons should prioritize rehabilitation over punishment.",
      "Politicians should face lifetime lobbying bans.",
      "Public transportation should be fare-free.",
      "Billionaires should not exist — tax wealth above a threshold.",
      "Community service should be a graduation requirement.",
      "Local journalism deserves public funding.",
      "Housing is a human right, not just an investment.",
      "Political ads should be fact-checked before they air.",
      "Museums should return artifacts taken without consent.",
      "Every city should have a citizens' assembly.",
    ],
  },
  {
    theme: "Fun & Low-Stakes",
    emoji: "🤪",
    intro:
      "Perfect for practice rounds, icebreakers, and class debuts — real persuasive structure, zero controversy hangover.",
    href: "/categories/weird-fun",
    topics: [
      "Pineapple absolutely belongs on pizza.",
      "Cereal is a soup — and should be treated as one.",
      "Everyone should make their bed every morning.",
      "Cats are objectively better roommates than dogs.",
      "The book is always better than the movie.",
      "Breakfast is not the most important meal of the day.",
      "Board game night beats movie night every time.",
      "Hot chocolate is superior to coffee.",
      "Every meeting could have been an email.",
      "Socks with sandals deserve a comeback.",
      "The best pizza slice is the corner of a square pizza.",
      "Karaoke should be a team-building requirement.",
      "Winter is the best season — and it's not close.",
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "What is a persuasive speech topic?",
    answer:
      "A persuasive speech topic is a claim your audience can genuinely disagree with — your job is to move them toward your position using evidence, logic, and emotional appeal. That is what separates it from an informative topic: 'How recycling works' informs, while 'Single-use plastics should be banned' persuades. The best persuasive topics take a clear stance, matter to your specific audience, and give you room to propose action.",
  },
  {
    question: "What makes a good persuasive speech topic?",
    answer:
      "Three tests: disagreement, stakes, and action. First, a reasonable person must be able to take the other side — if everyone already agrees, you are describing, not persuading. Second, the topic should matter to your audience's actual life. Third, the audience should be able to do something concrete when you finish — vote, change a habit, sign up. Topics that pass all three consistently outperform 'big issue' topics chosen for importance alone.",
  },
  {
    question: "What are easy persuasive speech topics for beginners?",
    answer:
      "Start with everyday-experience topics where the evidence is your audience's own life: school start times, homework limits, tipping culture, screen time, breakfast habits. They require no specialized research to argue credibly, and the audience engages instantly. Our Fun & Low-Stakes section is built exactly for first speeches — the structure is real persuasion, but the stakes stay friendly.",
  },
  {
    question: "How do I choose a persuasive speech topic for college?",
    answer:
      "Pick the intersection of three circles: what you genuinely care about, what your audience has a stake in, and what has credible evidence available. College audiences respond to topics with fresh angles — 'social media is bad' is worn out, but 'algorithmic feeds should be off by default' is specific enough to feel new. Check our Technology, Money & Work, and Society sections for that level of specificity.",
  },
  {
    question: "Can I get a random persuasive speech topic?",
    answer:
      "Yes — our speech topic generator deals random speech topics with talking points, and every debate-style topic it produces works as a persuasive speech thesis. Random draws are excellent practice: you learn to build persuasive structure fast instead of leaning on a topic you already know well.",
  },
];

export default function PersuasiveSpeechTopicsPage() {
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
            { label: "Persuasive" },
          ]}
        />

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
          <h1
            className="text-3xl sm:text-5xl font-bold mb-4 text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            100+ Persuasive <span className="gradient-text">Speech Topics</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto">
            Every topic below takes a clear stance your audience can disagree with — organized by
            theme, from classroom classics to fun first-speech material. Steal one, or spin a random
            topic with talking points included.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link href="/speech" className="btn-generate inline-flex items-center gap-2 text-sm px-6 py-3">
              <span>🎲</span> Random Speech Topic Generator
            </Link>
            <Link
              href="/speech/informative"
              className="inline-flex items-center gap-2 text-sm px-6 py-3 rounded-lg border border-[rgba(255,255,255,0.1)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-all"
            >
              📖 Informative Speech Topics
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
                  {section.emoji} Persuasive Speech Topics: {section.theme}
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
              How to Turn a Topic Into a Speech That Persuades
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                A <strong>persuasive speech topic</strong> is only the starting claim — the speech
                succeeds or fails on structure. The reliable skeleton: hook the audience with a
                stake they already feel, state your position in one sentence, give two or three
                arguments each anchored to evidence, answer the strongest objection honestly, and
                close with one concrete action. Audiences forgive imperfect delivery; they never
                forgive a speech that wanders.
              </p>
              <p>
                Practice with random draws to build that structure into muscle memory: our{" "}
                <Link href="/speech" className="text-[var(--neon-cyan)] hover:underline">speech topic generator</Link>{" "}
                deals topics with talking points, the{" "}
                <Link href="/impromptu-speech-topics" className="text-[var(--neon-cyan)] hover:underline">impromptu speech tool</Link>{" "}
                adds a timer, and{" "}
                <Link href="/table-topics-generator" className="text-[var(--neon-cyan)] hover:underline">Table Topics</Link>{" "}
                runs the Toastmasters format. Prefer a ready-made list for class? See{" "}
                <Link href="/topics/speech-topics-for-college-students" className="text-[var(--neon-cyan)] hover:underline">75 speech topics for college students</Link>{" "}
                or grab a two-sided angle from the{" "}
                <Link href="/debate" className="text-[var(--neon-cyan)] hover:underline">debate topic generator</Link>.
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
