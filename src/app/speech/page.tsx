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
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

export const metadata: Metadata = {
  title: { absolute: "Speech Topic Generator & Practice Timer | Random Topics" },
  description:
    "Free speech topic generator with a built-in practice timer. Get prompts for impromptu speaking, presentations, Toastmasters, persuasive speeches, and public speaking practice.",
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
  alternates: {
    canonical: "/speech",
    languages: hreflangAlternates("/speech"),
  },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Speech Topic Generator & Practice Timer",
            url: `${SITE_URL}/speech`,
            description: metadata.description,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Speech topics filtered by category and depth",
              "One to ten generated prompts",
              "Three-point speaking outlines",
              "One to five minute practice timer",
              "Copy, save, and share actions",
            ],
          }),
        }}
      />
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
          subtitle="Generate a focused prompt for an impromptu speech, presentation, Toastmasters round, or public speaking practice."
          contentSource="speech_hub"
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4" aria-labelledby="speech-practice-paths">
          <div className="glass-card p-6 sm:p-8 border-[var(--neon-cyan)]/20">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--neon-cyan)]">Choose by speaking task</p>
            <h2 id="speech-practice-paths" className="mt-2 text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Pick the Right Speech Practice Path
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Start with the format you need, then use its focused prompts, timing, and practice guidance.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Toastmasters Table Topics",
                  detail: "Draw from 120 meeting-ready questions and run a complete one-to-two-minute drill.",
                  href: "/topics/toastmasters-table-topics",
                },
                {
                  title: "Five-Minute Speech",
                  detail: "Choose a developed topic with a five-part outline and a five-minute timer.",
                  href: "/5-minute-speech-topics",
                },
                {
                  title: "Impromptu Practice",
                  detail: "Train fast thinking with short prompts, a simple structure, and timed delivery.",
                  href: "/impromptu-speech-topics",
                },
                {
                  title: "Presentation Planning",
                  detail: "Generate a presentation idea by audience and difficulty with a slide-ready angle.",
                  href: "/presentation-topic-generator",
                },
              ].map((path) => (
                <Link
                  key={path.href}
                  href={path.href}
                  className="rounded-xl border border-white/10 p-4 hover:border-[var(--neon-cyan)]/30 hover:bg-[rgba(0,229,255,0.04)] transition-colors"
                >
                  <span className="block text-sm font-semibold text-[var(--text-primary)]">{path.title} →</span>
                  <span className="block mt-1 text-xs leading-5 text-[var(--text-muted)]">{path.detail}</span>
                </Link>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Running a club round? Use the focused{" "}
              <Link href="/table-topics-generator" className="text-[var(--neon-cyan)] hover:underline">
                Table Topics generator
              </Link>{" "}
              to draw prompts without browsing the full list.
            </p>
          </div>
        </section>

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
                Generate a speech topic, start the timer, and practice delivering a 1, 2, 3, or 5-minute
                speech on the spot. This is the same technique used in{" "}
                <Link href="/topics/toastmasters-table-topics" className="text-[var(--neon-cyan)] hover:underline">
                  Toastmasters Table Topics practice
                </Link>{" "}
                and speech competitions worldwide.
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
                <li>Generate a speech topic using the generator above</li>
                <li>Set the timer to your desired duration (start with 1 minute)</li>
                <li>Take 10-15 seconds to organize your thoughts</li>
                <li>Deliver your speech until the timer runs out</li>
                <li>Gradually increase the duration as you improve</li>
              </ol>
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Three Fast Speech Frameworks
              </h3>
              <p>
                Choose one framework before the timer starts. A simple structure makes an improvised answer easier
                to follow and keeps you from filling time without a clear point.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 p-4">
                  <h4 className="font-semibold text-[var(--text-primary)]">PREP</h4>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    State your Point, give a Reason, add an Example, then repeat the Point as your close.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 p-4">
                  <h4 className="font-semibold text-[var(--text-primary)]">Past–Present–Future</h4>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    Explain how the topic began, what it means now, and what you expect or recommend next.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 p-4">
                  <h4 className="font-semibold text-[var(--text-primary)]">Problem–Cause–Solution</h4>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    Define one problem, name its main cause, and finish with one practical response.
                  </p>
                </div>
              </div>
              <p>
                Looking for a broader starting point before choosing a speaking angle? Use the dedicated{" "}
                <Link href="/random-subject-generator" className="text-[var(--neon-cyan)] hover:underline">
                  random subject generator
                </Link>{" "}
                to pick a field first. For writing prompts, use the{" "}
                <Link href="/writing-topic-generator" className="text-[var(--neon-cyan)] hover:underline">writing topic generator</Link>
                {" "}instead.
              </p>
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
              { title: "80 Five-Minute Speech Topics + Timer", href: "/5-minute-speech-topics" },
              { title: "100+ Persuasive Speech Topics", href: "/speech/persuasive" },
              { title: "100+ Informative Speech Topics", href: "/speech/informative" },
              { title: "Impromptu Speech Topics with Timer", href: "/impromptu-speech-topics" },
              { title: "Toastmasters Table Topics Generator", href: "/table-topics-generator" },
              { title: "120 Toastmasters Table Topics + Practice Drill", href: "/topics/toastmasters-table-topics" },
              { title: "75 Speech Topics for College Students", href: "/topics/speech-topics-for-college-students" },
              { title: "60 Public Speaking Topics for Beginners", href: "/topics/public-speaking-topics-for-beginners" },
              { title: "75 Presentation Topics for School", href: "/topics/presentation-ideas-for-school" },
              { title: "Presentation Topic Generator", href: "/presentation-topic-generator" },
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
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl text-[var(--text-primary)]">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 space-y-6">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">{item.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{item.answer}</p>
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
