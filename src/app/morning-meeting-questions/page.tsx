import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import QuestionBank from "@/components/QuestionBank";
import MorningMeeting from "@/components/MorningMeeting";
import ClassroomPackCard from "@/components/ClassroomPackCard";
import ClassroomToolLinks from "@/components/ClassroomToolLinks";
import ClassroomArt from "@/components/ClassroomArt";
import { MORNING_ACTIVITIES, MORNING_GREETINGS, MORNING_SHARE } from "@/data/morningMeeting";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import TryNext from "@/components/TryNext";

const PATH = "/morning-meeting-questions";
const TITLE = `Morning Meeting Questions: ${MORNING_SHARE.length} Ideas + Greetings & Activities`;
const DESCRIPTION = `A free morning meeting for every school day: ${MORNING_GREETINGS.length} greetings, ${MORNING_SHARE.length} sharing questions and ${MORNING_ACTIVITIES.length} activities for grades K–6. Same set for the whole class each day, with a projector mode.`;

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Random Topics` },
  description: DESCRIPTION,
  keywords: ["morning meeting questions", "morning meeting greeting ideas", "morning meeting activities", "morning meeting sharing questions", "morning meeting ideas for kindergarten"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Random Topics",
    type: "website",
    images: [{ url: "/og/morning-meeting-questions.jpg", width: 1200, height: 630, alt: "Morning Meeting Questions" }],
  },
};

const FAQ_ITEMS = [
  {
    question: "What is a morning meeting?",
    answer: "A morning meeting is a 15–20 minute routine at the start of the school day. The class sits in a circle and moves through four parts: a greeting, a sharing time, a short group activity and a morning message. It builds community and gets everyone ready to learn.",
  },
  {
    question: "Does everyone get the same question today?",
    answer: "Yes. The set is chosen from today's date, so every student, every device and every refresh shows the same greeting, question and activity all day. A new set appears tomorrow. Use the day arrows to plan ahead.",
  },
  {
    question: "What are good morning meeting questions?",
    answer: "Good sharing questions are easy to answer in one or two sentences and let every child feel included: favorite things, small wins, imaginative “if you could…” questions and gentle check-ins. Avoid questions about money, family situations or anything a student might not want to share in front of the class.",
  },
  {
    question: "How long should a morning meeting take?",
    answer: "About 15–20 minutes: 2–3 for the greeting, 5–8 for sharing, 5 for the activity and 2 for the morning message. With younger classes, start with greeting and sharing only.",
  },
  {
    question: "Can I project it for the class?",
    answer: "Yes. “Project today's meeting” shows the four parts one at a time in large text. Use the arrow keys or space bar to move, F for full screen, T for a timer and Esc to close. No sign-up needed.",
  },
];

export default function MorningMeetingPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Morning Meeting Questions" }]} />
        <MorningMeeting />
        <TryNext path="/morning-meeting-questions" />
        <ClassroomArt src="/art/classroom/morning-meeting.jpg" alt="Illustrated children greeting each other in a circle on a classroom rug during morning meeting" />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-6 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">The Four Parts of Morning Meeting</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              <div><h3 className="text-base font-bold text-[var(--text-primary)]">1. Greeting (2–3 min)</h3><p className="mt-1">Every child is greeted by name. It tells each student “you belong here” before any learning starts.</p></div>
              <div><h3 className="text-base font-bold text-[var(--text-primary)]">2. Sharing (5–8 min)</h3><p className="mt-1">One question, short answers. Listeners can ask one follow-up — great practice for speaking and listening.</p></div>
              <div><h3 className="text-base font-bold text-[var(--text-primary)]">3. Group activity (5 min)</h3><p className="mt-1">A quick game or movement break the whole class does together. No materials needed for any activity here.</p></div>
              <div><h3 className="text-base font-bold text-[var(--text-primary)]">4. Morning message (2 min)</h3><p className="mt-1">A short note about the day, read together. Younger students hunt for sight words; older ones fix a planted mistake.</p></div>
            </div>
            <p className="mt-6 text-sm text-[var(--text-secondary)] leading-relaxed">
              Short on time? Swap the activity for a <Link prefetch={false} href="/riddles-for-kids" className="text-[var(--neon-cyan)] hover:underline">riddle of the day</Link> or
              one <Link prefetch={false} href="/this-or-that/kids" className="text-[var(--neon-cyan)] hover:underline">this or that question</Link>. For older students,
              a <Link prefetch={false} href="/question-of-the-day-for-students" className="text-[var(--neon-cyan)] hover:underline">question of the day for students</Link> works as a bell-ringer.
            </p>
          </div>
        </section>

        <QuestionBank
          heading={`All ${MORNING_SHARE.length} Morning Meeting Sharing Questions`}
          intro="Every sharing question in the rotation, for grades K–6. Copy one, or the whole list for your plan book."
          questions={MORNING_SHARE.map((q) => q.text)}
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="glass-card p-6 sm:p-10 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{MORNING_GREETINGS.length} Morning Meeting Greeting Ideas</h2>
              <ol className="mt-4 space-y-2 list-decimal pl-5">
                {MORNING_GREETINGS.map((g) => <li key={g.name}><strong className="text-[var(--text-primary)]">{g.name}.</strong> {g.how}</li>)}
              </ol>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{MORNING_ACTIVITIES.length} Morning Meeting Activities</h2>
              <ol className="mt-4 space-y-2 list-decimal pl-5">
                {MORNING_ACTIVITIES.map((a) => <li key={a.name}><strong className="text-[var(--text-primary)]">{a.name}.</strong> {a.how}</li>)}
              </ol>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Frequently Asked Questions</h2>
              {FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] pt-3">{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ClassroomToolLinks currentPath={PATH} />
        <ClassroomPackCard pack="question-of-the-day" page={PATH} />
      </main>
      <Footer />
    </>
  );
}
