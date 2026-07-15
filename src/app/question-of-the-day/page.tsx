import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import QuestionOfTheDay from "@/components/QuestionOfTheDay";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { QOTD_QUESTIONS, QOTD_CATEGORIES } from "@/data/questionOfTheDay";

export const metadata: Metadata = {
  title: "Question of the Day — Today's QOTD for Classrooms, Teams & Family",
  description:
    "A fresh question of the day, every day — the same for everyone, rotating at midnight. 120 hand-written QOTD questions for classrooms, work teams, kids and dinner tables, plus a random question generator. Free.",
  keywords: [
    "question of the day",
    "question of the day ideas",
    "random question of the day",
    "qotd",
    "question of the day for students",
    "question of the day for work",
    "question of the day for kids",
    "daily question",
    "icebreaker question of the day",
  ],
  alternates: { canonical: "/question-of-the-day" },
};

const FAQ_ITEMS = [
  {
    question: "What is a question of the day?",
    answer:
      "A question of the day (QOTD) is a single, thoughtful question posed once a day to spark conversation — in classroom morning meetings, team Slack channels, family dinners, or journals. The ritual matters as much as the question: same time, one question, everyone answers. Our page shows one question that's the same for every visitor and rotates automatically at midnight, so a class or team can rely on it as their daily source.",
  },
  {
    question: "What are good question of the day ideas?",
    answer:
      "Good QOTD questions are open-ended (no yes/no dead ends), answerable by everyone in the room in under a minute, and safe to answer honestly in public. Rotate flavors across the week: light and funny to start the week, curious mid-week, deeper on Fridays. Our bank tags every question by audience — classroom, work, kids, deep, and funny — so you can match the question to the room.",
  },
  {
    question: "How do teachers use a question of the day?",
    answer:
      "The classic pattern is the morning meeting: project the question, give students a minute to think, then share in pairs before a few answer aloud. It builds speaking confidence and community in under five minutes. Teachers also use QOTDs as journal warm-ups, exit tickets, or early-finisher prompts. Every classroom question in our bank is school-appropriate and discussion-tested.",
  },
  {
    question: "How do teams use a question of the day at work?",
    answer:
      "Post it in a Slack or Teams channel each morning and let answers accumulate — it's the lowest-effort team ritual that actually builds connection, especially for remote teams. Keep answers optional, keep questions light on Mondays, and let anyone take over posting duty. The Work & Teams category is written to be safe and fun for professional settings.",
  },
  {
    question: "Does the question of the day change automatically?",
    answer:
      "Yes — the featured question is chosen deterministically from the bank based on the date, so it's identical for every visitor and switches at midnight in your local timezone. If today's doesn't fit your group, hit Random Question and filter by category; the generator never repeats a question until you've seen the whole set.",
  },
];

// Crawlable themed samples (the interactive bank lives in the component).
const SAMPLES: Record<string, string[]> = {
  classroom: [
    "If you could instantly master one school subject, which would you pick and why?",
    "What's one question you wish teachers asked more often?",
    "What's something hard you can do now that you couldn't do a year ago?",
    "If you were principal for a week, what's your first new rule?",
    "Which historical figure would be the most interesting substitute teacher?",
    "What's one small thing someone did that made your week better?",
  ],
  work: [
    "What's a small win from this week that nobody clapped for?",
    "If your job had an honest tagline, what would it be?",
    "What's a 'boring' skill that has quietly paid off the most?",
    "If you had a fully paid month to learn anything, what would you study?",
    "Describe your work style in exactly three words.",
    "What's one meeting you'd delete from every calendar forever?",
  ],
  kids: [
    "If your pet could talk for one day, what's the first thing it would say?",
    "What animal would make the funniest school teacher?",
    "If our family had a flag, what would be on it?",
    "What's something grown-ups do that makes no sense to you?",
    "Would you rather have a dragon or be a dragon?",
    "If bedtime were cancelled tonight, what's your plan?",
  ],
  deep: [
    "What's something you believe that most people around you don't?",
    "If your life had chapters, what would this one be titled?",
    "When did you last change your mind about something important?",
    "What does 'enough' look like for you?",
    "What are you slowly getting better at that nobody notices?",
    "Which word do you hope people use when they describe you?",
  ],
  funny: [
    "What's the most ridiculous fact you know off the top of your head?",
    "What would be the worst superpower to have?",
    "If you had a warning label, what would it say?",
    "What's a hill you'll die on that absolutely does not matter?",
    "If Monday were a person, what would you say to them?",
    "If you were a kitchen appliance, which one are you and why?",
  ],
};

export default function QuestionOfTheDayPage() {
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
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
          <h1
            className="section-heading text-4xl sm:text-6xl font-extrabold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Question <span className="gradient-text">of the Day</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            One thoughtful question, every day — the same for everyone, rotating at midnight.
            Built for classroom morning meetings, team channels, and dinner tables.
          </p>
        </section>

        <QuestionOfTheDay />

        {/* Crawlable samples by audience */}
        {QOTD_CATEGORIES.map((cat) => (
          <section key={cat.id} className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
            <div className="glass-card p-8 sm:p-10">
              <h2
                className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {cat.emoji} Question of the Day Ideas: {cat.label}
              </h2>
              <ul className="space-y-2 mt-4">
                {(SAMPLES[cat.id] || []).map((q) => (
                  <li key={q} className="flex gap-3 items-start text-sm text-[var(--text-secondary)] leading-relaxed">
                    <span className="text-[var(--neon-cyan)] shrink-0">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[var(--text-muted)] mt-4">
                {QOTD_QUESTIONS.filter((x) => x.c === cat.id).length} {cat.label.toLowerCase()} questions in the daily rotation — use the generator above to browse them all.
              </p>
            </div>
          </section>
        ))}

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
                <Link href="/question-generator" className="text-[var(--neon-cyan)] hover:underline">random question generator</Link>{" "}
                deals unlimited questions, the{" "}
                <Link href="/icebreaker" className="text-[var(--neon-cyan)] hover:underline">icebreaker generator</Link>{" "}
                is tuned for meetings and events, and{" "}
                <Link href="/topics/get-to-know-you-questions-for-adults" className="text-[var(--neon-cyan)] hover:underline">get-to-know-you questions</Link>{" "}
                go deeper for new groups. For journaling instead of discussion, use the{" "}
                <Link href="/journal-prompts" className="text-[var(--neon-cyan)] hover:underline">journal prompt generator</Link>.
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
