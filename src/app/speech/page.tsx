import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import EditorsPicks from "@/components/EditorsPicks";
import { ModeIllustration } from "@/components/CategoryIllustration";
import { pickModeTopics } from "@/lib/editorial";
import SpeechTimer from "@/components/SpeechTimer";
import Link from "next/link";
import type { Metadata } from "next";
import FaqSchema from "@/components/FaqSchema";

export const metadata: Metadata = {
  title: "Random Speech Topic Generator - Public Speaking Ideas & Practice Timer",
  description:
    "Generate random speech topics for presentations, public speaking practice, and Toastmasters. Built-in speech timer for impromptu speaking practice. Find your next great speech idea instantly.",
  keywords: [
    "speech topic generator",
    "random speech topics",
    "impromptu speech topics",
    "public speaking topics",
    "toastmasters table topics",
    "table topics generator",
    "speech ideas",
    "extemporaneous speech topics",
  ],
  alternates: { canonical: "/speech" },
};

const FAQ_ITEMS = [
  {
    question: "What are good impromptu speech topics?",
    answer:
      "Good impromptu topics are ones almost anyone can speak on without research — personal experiences, opinions, and 'this vs that' choices. Our generator pulls substantive prompts across 16 categories so you always have something meaningful to say.",
  },
  {
    question: "How long should an impromptu speech be?",
    answer:
      "Most impromptu speeches run 1-2 minutes, which is why the built-in timer offers 1, 2, 3, and 5-minute presets. Start with 1 minute and work up as you get more comfortable.",
  },
  {
    question: "How do I practice impromptu speaking alone?",
    answer:
      "Generate a random topic, give yourself 15-30 seconds to think, then start the timer and speak out loud using a simple structure like Point-Reason-Example-Point. Ten minutes a day makes a noticeable difference within a few weeks.",
  },
  {
    question: "What is the best way to structure a short speech?",
    answer:
      "Use a quick framework: open with your main point, give one or two supporting reasons or examples, then restate your point to close. It keeps you on track even when you are thinking on your feet.",
  },
];

export default function SpeechPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Speech Topics" },
          ]}
        />
        <ModeIllustration mode="speech" />
        <TopicGenerator
          initialMode="speech"
          title="Speech Topic Generator"
          subtitle="Discover the perfect topic for your next presentation, speech, or public speaking practice."
        />

        {/* Speech Timer Section */}
        <section className="max-w-md mx-auto px-4 sm:px-6 py-10">
          <SpeechTimer />
        </section>

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Practice Impromptu Speaking with Our Timer
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Our built-in <strong>speech practice timer</strong> helps you develop impromptu speaking skills.
                Generate a random speech topic, start the timer, and practice delivering a 1, 2, 3, or 5-minute
                speech on the spot. This is the same technique used by Toastmasters Table Topics and speech
                competitions worldwide.
              </p>
              <p>
                Regular impromptu speaking practice builds confidence, improves your ability to organize thoughts
                quickly, and makes you a more effective communicator in meetings, presentations, and everyday
                conversations. Whether you&apos;re preparing for a speech competition, a job interview, or just
                want to become a better speaker, combining random topics with timed practice is one of the most
                effective methods available.
              </p>
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How to Practice Impromptu Speaking
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li>Generate a random speech topic using the generator above</li>
                <li>Set the timer to your desired duration (start with 1 minute)</li>
                <li>Take 10-15 seconds to organize your thoughts</li>
                <li>Deliver your speech until the timer runs out</li>
                <li>Gradually increase the duration as you improve</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Speech topics by type */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="section-heading text-2xl sm:text-3xl text-center mb-4">
            Speech Topics <span className="gradient-text">by Type</span>
          </h2>
          <p className="text-center text-[var(--text-muted)] text-sm mb-8 max-w-lg mx-auto">
            Know what kind of speech you&apos;ve been assigned? Jump straight to a curated list.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "100+ Persuasive Speech Topics", href: "/speech/persuasive" },
              { title: "100+ Informative Speech Topics", href: "/speech/informative" },
              { title: "Impromptu Speech Topics with Timer", href: "/impromptu-speech-topics" },
              { title: "Toastmasters Table Topics Generator", href: "/table-topics-generator" },
              { title: "75 Speech Topics for College Students", href: "/topics/speech-topics-for-college-students" },
              { title: "60 Public Speaking Topics for Beginners", href: "/topics/public-speaking-topics-for-beginners" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="glass-card p-5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-all hover:translate-y-[-2px] hover:border-[var(--neon-cyan)]/30"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.title} →
              </Link>
            ))}
          </div>
        </section>
        <EditorsPicks
          heading="Speech Topics with Skeleton Points"
          intro="Eight picks from the speech pool across every depth. The talking points double as a three-beat speech skeleton — copy one and you have your structure before you stand up."
          topics={pickModeTopics("speech")}
        />
      </main>
      <Footer />
    </>
  );
}
