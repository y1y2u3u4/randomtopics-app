import PublicAdPlacement from "@/components/PublicAdPlacement";
import DirectAnswer from "@/components/DirectAnswer";
import ClassroomPackCard from "@/components/ClassroomPackCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import QuestionOfTheDay from "@/components/QuestionOfTheDay";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { withSocial } from "@/lib/metadata/social";
import { hreflangAlternates } from "@/i18n/config";
import { QOTD_QUESTIONS, QOTD_CATEGORIES, qotdIndexForDate } from "@/data/questionOfTheDay";
import QotdListActions from "@/components/QotdListActions";
import KeepPlaying from "@/components/KeepPlaying";
import TryNext from "@/components/TryNext";
import FactSheet from "@/components/FactSheet";
import HostPassEntry from "@/components/host/HostPassEntry";

// ISR: regenerate hourly so the server-rendered "today's question" (UTC) stays
// current and crawlers always see a real question in the HTML, not a placeholder.
export const revalidate = 3600;

// Title and description carry today's date (UTC, refreshed by the hourly ISR
// above) so the result shows it is current. Old title for rollback:
// "Question of the Day: Today's QOTD + 120 Question Ideas" (see docs/ctr-titles-2026-10-21.md).
export function generateMetadata(): Metadata {
  const day = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  return withSocial({
    title: { absolute: `Question of the Day for ${day} + 120 QOTD Ideas` },
    description: `Today's question of the day (${day}) is ready to copy for your class, team or group chat. 120 QOTD ideas in 5 categories, new every midnight. Free.`,
    keywords: [
      "question of the day",
      "question of the day ideas",
      "random question of the day",
      "qotd",
      "question of the day for kids",
      "daily question",
      "icebreaker question of the day",
    ],
    alternates: { canonical: "/question-of-the-day", languages: hreflangAlternates("/question-of-the-day") },
  });
}

const FAQ_ITEMS = [
  {
    question: "What is a question of the day?",
    answer:
      "A question of the day (QOTD) is a single, thoughtful question posed once a day to spark conversation — in classroom morning meetings, team Slack channels, family dinners, or journals. The ritual matters as much as the question: same time, one question, everyone answers. Choose a daily category for your group. Visitors using the same category and local date see the same question, and the browser can remember that category for tomorrow.",
  },
  {
    question: "What are good question of the day ideas?",
    answer:
      "Good QOTD questions are open-ended (no yes/no dead ends), answerable by everyone in the room in under a minute, and safe to answer honestly in public. Rotate flavors across the week: light and funny to start the week, curious mid-week, deeper on Fridays. Our bank tags every question by audience — classroom, work, kids, deep, and funny — so you can match the question to the room.",
  },
  {
    question: "How do teachers use a question of the day?",
    answer:
      "The classic pattern is the morning meeting: project the question, give students a minute to think, then share in pairs before a few answer aloud. It builds speaking confidence and community in under five minutes. Teachers also use QOTDs as journal warm-ups, exit tickets, or early-finisher prompts. Every classroom question in our bank is written for classroom discussion; teachers should check suitability for their group.",
  },
  {
    question: "How do teams use a question of the day at work?",
    answer:
      "Post it in a Slack or Teams channel each morning and let answers accumulate — it's the lowest-effort team ritual that actually builds connection, especially for remote teams. Keep answers optional, keep questions light on Mondays, and let anyone take over posting duty. The Work & Teams category is written to be safe and fun for professional settings.",
  },
  {
    question: "Does the question of the day change automatically?",
    answer:
      "Yes — the featured question is chosen deterministically from the bank based on the date, so it's identical for the same daily category and local date, and switches at midnight in your local timezone. Your daily-category preference is stored only in this browser; if browser storage is blocked, it lasts for this open page. If today's doesn't fit your group, hit Random Question and filter by category; the generator never repeats a question until you've seen the whole set.",
  },
];

// The complete question bank is rendered below for reading and printing.
export default function QuestionOfTheDayPage() {
  // Server-side (UTC) pick so the question is part of the crawlable HTML; the
  // client component re-checks against the visitor's local date after mount.
  const now = new Date();
  const initialIdx = qotdIndexForDate(now);
  const initialDateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Question of the Day" },
          ]}
        />

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-4 text-center">
          <h1
            className="section-heading text-4xl sm:text-6xl font-extrabold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Question <span className="gradient-text">of the Day</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            Today’s question is ready below. Copy it for your group chat, or choose another from 120 question ideas. Free, with no signup.
          </p>
        </section>

        <QuestionOfTheDay initialIdx={initialIdx} initialDateLabel={initialDateLabel} />
        <HostPassEntry generator="question-of-the-day" />
        <p className="mt-6 px-4 text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed text-center">
          {`A question of the day is one short prompt everyone answers on the same day: a classroom bell-ringer, a stand-up icebreaker, or a family dinner starter. Pick one of ${QOTD_CATEGORIES.length} categories (classroom, work, kids, deep, or funny); everyone on the same category and local date gets the same question, and a new one appears at midnight in your time zone.`}
        </p>
        <div className="pt-6">
          <DirectAnswer question="What is today's question of the day?">
            {`Today's question of the day is shown at the top of this page. Everyone using the same category on the same local date sees the same question, and it changes at midnight in your time zone. Choose from ${QOTD_CATEGORIES.length} categories (classroom, work, kids, deep, funny) or draw from all ${QOTD_QUESTIONS.length} question ideas. Free, no signup.`}
          </DirectAnswer>
        </div>
        <TryNext path="/question-of-the-day" />
        <ClassroomPackCard pack="question-of-the-day" page="/question-of-the-day" />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link prefetch={false} href="/question-of-the-day-for-students" className="glass-card p-6 border-[var(--neon-cyan)]/20 hover:border-[var(--neon-cyan)]/40 transition-colors">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--neon-cyan)]">For classrooms</p>
              <h2 className="mt-2 text-lg font-bold text-[var(--text-primary)]">Question of the Day for Students</h2>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">180 grade-aware prompts, classroom filters, facilitation notes, and printable five-day plans.</p>
            </Link>
            <Link prefetch={false} href="/question-of-the-day-for-work" className="glass-card p-6 border-[var(--neon-pink)]/20 hover:border-[var(--neon-pink)]/40 transition-colors">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--neon-pink)]">For teams</p>
              <h2 className="mt-2 text-lg font-bold text-[var(--text-primary)]">Question of the Day for Work</h2>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">120 professional prompts for remote, hybrid, onboarding, meetings, and retrospectives.</p>
            </Link>
            <Link prefetch={false} href="/funny-question-of-the-day" className="glass-card p-6 border-[var(--neon-yellow)]/20 hover:border-[var(--neon-yellow)]/40 transition-colors">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--neon-yellow)]">For an easy laugh</p>
              <h2 className="mt-2 text-lg font-bold text-[var(--text-primary)]">Funny Question of the Day</h2>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">100 audience-safe funny prompts, daily rotation, filters, and printable five-day plans.</p>
            </Link>
          </div>
        </section>

        <PublicAdPlacement path="/question-of-the-day" />

        <nav id="question-ideas" aria-label="Browse question ideas by category" className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 scroll-mt-24">
          <h2 className="text-xl font-bold">Browse all {QOTD_QUESTIONS.length} question-of-the-day ideas</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Jump to a category to read its questions. The filters above choose your next random draw.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {QOTD_CATEGORIES.map((cat) => <a key={cat.id} href={`#ideas-${cat.id}`} className="inline-flex min-h-11 items-center rounded-xl border border-white/10 px-3 py-2 text-sm text-[var(--neon-cyan)]">{cat.emoji} {cat.label} · {QOTD_QUESTIONS.filter((item) => item.c === cat.id).length}</a>)}
          </div>
        </nav>

        {/* Complete crawlable question bank by audience */}
        {QOTD_CATEGORIES.map((cat) => (
          <section key={cat.id} id={`ideas-${cat.id}`} className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 scroll-mt-24">
            <div className="glass-card p-8 sm:p-10">
              <h2
                className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {cat.emoji} Question of the Day Ideas: {cat.label}
              </h2>
              <ul className="space-y-2 mt-4">
                {QOTD_QUESTIONS.filter((item) => item.c === cat.id).map(({ q }) => (
                  <li key={q} data-qotd-question="true" className="flex gap-3 items-start text-sm text-[var(--text-secondary)] leading-relaxed">
                    <span className="text-[var(--neon-cyan)] shrink-0">•</span>
                    <div className="min-w-0 flex-1"><span>{q}</span><QotdListActions question={q} category={cat.id} index={QOTD_QUESTIONS.findIndex((item) => item.q === q)} /></div>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[var(--text-muted)] mt-4">
                {QOTD_QUESTIONS.filter((x) => x.c === cat.id).length} {cat.label.toLowerCase()} questions in the daily rotation. <a href="#qotd-generator" className="text-[var(--neon-cyan)] underline underline-offset-4">Back to today’s question and generator ↑</a>
              </p>
            </div>
          </section>
        ))}

        <FactSheet
          heading="Question of the Day at a glance"
          updated="2026-10-18"
          rows={[
            ["What it is", `A free daily question for classrooms, teams and families: ${QOTD_QUESTIONS.length} editor-written questions, one shown per day, plus a quick vote.`],
            ["Categories", QOTD_CATEGORIES.map((c) => `${c.label} (${QOTD_QUESTIONS.filter((q) => q.c === c.id).length})`).join(", ")],
            ["When it changes", "At midnight in your own time zone. The page HTML uses midnight UTC until your browser loads."],
            ["Who sees the same question", "Everyone who picks the same category on the same date, so a whole class or team can answer together."],
            ["Daily vote", "4 suggested answers plus \u201cSomething else\u201d."],
            ["Cost and signup", "Free, no account. Copy, share or print the full list of questions."],
          ]}
          stepsName="How to use the question of the day"
          steps={[
            "Pick a category (or All) and read today\u2019s question.",
            "Post it in your class, Slack or Teams channel, or read it aloud.",
            "Give everyone 1\u20132 minutes to answer, then vote or share answers.",
            "Come back tomorrow for a new question, or tap for a random one now.",
          ]}
        />

        {/* SEO content + FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              How to Run a Question-of-the-Day Ritual
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                The power of a <strong>question of the day</strong> isn&apos;t the question — it&apos;s
                the ritual. One question, same time every day, everyone welcome to answer. In
                classrooms that&apos;s the morning meeting; on teams it&apos;s the 9 a.m. Slack post;
                at home it&apos;s the dinner-table opener. Keep answers short, never force
                participation, and let the streak build: by week three, people start showing up
                curious about what today&apos;s question will be.
              </p>
              <p>
                Need more than one a day? Our{" "}
                <Link prefetch={false} href="/question-generator" className="text-[var(--neon-cyan)] hover:underline">random question generator</Link>{" "}
                deals unlimited questions, the{" "}
                <Link prefetch={false} href="/icebreaker" className="text-[var(--neon-cyan)] hover:underline">icebreaker generator</Link>{" "}
                is tuned for meetings and events, and{" "}
                <Link prefetch={false} href="/topics/get-to-know-you-questions-for-adults" className="text-[var(--neon-cyan)] hover:underline">get-to-know-you questions</Link>{" "}
                go deeper for new groups. Want a debate instead? Try{" "}
                <Link prefetch={false} href="/topics/ethical-dilemma-questions" className="text-[var(--neon-cyan)] hover:underline">ethical dilemma questions</Link>{" "}
                or the{" "}
                <Link prefetch={false} href="/debate" className="text-[var(--neon-cyan)] hover:underline">debate topic generator</Link>. For journaling instead of discussion, use the{" "}
                <Link prefetch={false} href="/journal-prompts" className="text-[var(--neon-cyan)] hover:underline">journal prompt generator</Link>.
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
        <KeepPlaying path="/question-of-the-day" />
      </main>
      <Footer />
    </>
  );
}
