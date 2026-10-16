import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import ClassroomTimer from "@/components/ClassroomTimer";
import ClassroomPackCard from "@/components/ClassroomPackCard";
import ClassroomToolLinks from "@/components/ClassroomToolLinks";
import ClassroomArt from "@/components/ClassroomArt";
import { BRAIN_BREAKS, TIMER_ROUTINES, clock, routineLength } from "@/data/classroomTimer";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const PATH = "/classroom-timer";
const TITLE = "Classroom Timer — Free Full-Screen Countdown with Routines";
const DESCRIPTION = "A free classroom timer for the board: big full-screen countdown, 30-second to 20-minute presets, a chime, and ready-made routines (think–pair–share, group discussion, quick write, brain break) with a random question for each. No sign-up.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Random Topics` },
  description: DESCRIPTION,
  keywords: ["classroom timer", "timer for classroom", "online classroom timer", "countdown timer for teachers", "think pair share timer", "brain break timer", "5 minute timer for class"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Random Topics",
    type: "website",
    images: [{ url: "/og/classroom-timer.jpg", width: 1200, height: 630, alt: "Classroom Timer" }],
  },
};

const FAQ_ITEMS = [
  {
    question: "Is this classroom timer free?",
    answer: "Yes. The timer, every routine, the questions and full-screen mode are free with no sign-up and no download. It runs in any browser on a laptop, interactive whiteboard, Chromebook or phone.",
  },
  {
    question: "How do I make the timer full screen on the board?",
    answer: "Press “Full screen for the board” or the F key. The countdown fills the screen with a color ring that goes green, then yellow, then red as time runs out. Press Esc or Close to go back.",
  },
  {
    question: "Does the timer keep counting if I switch tabs?",
    answer: "Yes. The timer counts against the clock, not against the page, so it stays accurate if you open your slides or another tab. The remaining time also shows in the browser tab title.",
  },
  {
    question: "What is a think–pair–share timer?",
    answer: "Think–pair–share is a three-step discussion routine: students think alone (1 minute), talk with a partner (2 minutes), then a few pairs share with the class (1 minute). The routine here runs all three steps back to back with a chime between them and shows a question to talk about.",
  },
  {
    question: "Can I turn the sound off?",
    answer: "Yes. Use the “Sound on / Sound off” button. With sound on, three short beeps play when each step ends. The sound is made in your browser, so it works offline once the page is open.",
  },
  {
    question: "What keyboard shortcuts does the timer have?",
    answer: "Space starts and pauses, R resets, F opens full screen, N shows a new question, and the up and down arrows add or take away a minute before you start.",
  },
];

export default function ClassroomTimerPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Classroom Timer" }]} />
        <ClassroomTimer />
        <ClassroomArt src="/art/classroom/classroom-timer.jpg" alt="Illustrated classroom with a big countdown ring on the board while pairs of students talk" />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-6 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">Timer Routines for the Classroom</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              A plain countdown tells students how long they have. A routine also tells them what to do. Pick one above and the timer
              runs each step for you, with a chime when it is time to switch.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              {TIMER_ROUTINES.filter((r) => r.id !== "timer").map((r) => (
                <div key={r.id} data-routine={r.id}>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{r.emoji} {r.name} ({clock(routineLength(r))})</h3>
                  <ol className="mt-1 space-y-1 list-decimal pl-5">
                    {r.phases.map((p) => <li key={p.label}><strong className="text-[var(--text-primary)]">{p.label}</strong> ({clock(p.seconds)}): {p.instruction}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="glass-card p-6 sm:p-10 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>How Long Should a Classroom Timer Be?</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong className="text-[var(--text-primary)]">30 seconds–1 minute:</strong> think time, a quick vote, lining up, a brain break.</li>
              <li><strong className="text-[var(--text-primary)]">2–3 minutes:</strong> partner talk, clean-up, a warm-up question on the board.</li>
              <li><strong className="text-[var(--text-primary)]">5 minutes:</strong> a quick write, a bell-ringer, a short group task.</li>
              <li><strong className="text-[var(--text-primary)]">10–20 minutes:</strong> independent work, centers and stations, a test section.</li>
            </ul>
            <p>
              A good rule for younger students: about one to two minutes of focused work per year of age, then a short break.
              Show the timer where everyone can see it, say the instruction once, and let the timer do the reminding.
            </p>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-2" style={{ fontFamily: "var(--font-display)" }}>{BRAIN_BREAKS.length} One-Minute Brain Breaks</h3>
            <ol className="space-y-1 list-decimal pl-5">
              {BRAIN_BREAKS.map((b) => <li key={b}>{b}</li>)}
            </ol>
            <p>
              Need something to talk about while the timer runs? Try a <Link href="/morning-meeting-questions" className="text-[var(--neon-cyan)] hover:underline">morning meeting question</Link>,
              a <Link href="/riddles-for-kids" className="text-[var(--neon-cyan)] hover:underline">riddle for kids</Link> or
              a <Link href="/would-you-rather/kids" className="text-[var(--neon-cyan)] hover:underline">would you rather question</Link>. To call on students,
              use the <Link href="/random-name-picker" className="text-[var(--neon-cyan)] hover:underline">random name picker</Link>.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="glass-card p-6 sm:p-10 space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Frequently Asked Questions</h2>
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <ClassroomToolLinks currentPath={PATH} />
        <ClassroomPackCard pack="question-of-the-day" page={PATH} />
      </main>
      <Footer />
    </>
  );
}
