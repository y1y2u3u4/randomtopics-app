import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import ClassroomQuestionGenerator from "@/components/ClassroomQuestionGenerator";
import ClassroomPackCard from "@/components/ClassroomPackCard";
import ClassroomToolLinks from "@/components/ClassroomToolLinks";
import ClassroomArt from "@/components/ClassroomArt";
import RiddleList from "@/components/RiddleList";
import { RIDDLES_FOR_KIDS, RIDDLE_LEVELS, RIDDLE_TYPES, type RiddleLevel } from "@/data/riddlesForKids";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const PATH = "/riddles-for-kids";
const TITLE = `${RIDDLES_FOR_KIDS.length} Riddles for Kids with Answers (Easy to Hard)`;
const DESCRIPTION = `${RIDDLES_FOR_KIDS.length} riddles for kids with answers, sorted easy, medium and hard. Tap to reveal the answer, filter by type, and project them for a classroom riddle race. Free, no sign-up.`;

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Random Topics` },
  description: DESCRIPTION,
  keywords: ["riddles for kids", "riddles for kids with answers", "easy riddles for kids", "hard riddles for kids", "funny riddles for kids", "riddles for the classroom"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Random Topics",
    type: "website",
    images: [{ url: "/og/riddles-for-kids.jpg", width: 1200, height: 630, alt: "Riddles for Kids with Answers" }],
  },
};

const FAQ_ITEMS = [
  {
    question: "What are good riddles for kids?",
    answer: "Good riddles for kids have one clear answer that a child already knows — a clock, a towel, a piano — and a clue that sounds impossible until it clicks. Start with easy riddles for ages 5–7, move to medium for ages 7–10, and save the hard ones (wordplay and logic) for ages 10–12.",
  },
  {
    question: "Do all the riddles have answers?",
    answer: `Yes. Every one of the ${RIDDLES_FOR_KIDS.length} riddles has an answer. On this page the answers stay hidden until you tap “Show answer”, so kids can guess first.`,
  },
  {
    question: "How do I use riddles in the classroom?",
    answer: "Try a riddle of the day at morning meeting, a riddle race in projector mode (teams whisper an answer before the reveal), or a riddle as an exit ticket. In projector mode the first press of Space or the arrow key reveals the answer and the second moves to the next riddle.",
  },
  {
    question: "Can I print the riddles?",
    answer: "Yes. Choose a level and type, then “Print the list” makes a printable page with each riddle and its answer. Cut the answers off for a guessing game, or fold the page.",
  },
  {
    question: "Why do riddles help kids learn?",
    answer: "Riddles train kids to read closely, notice double meanings and think flexibly — the same skills behind reading comprehension and problem solving. They are also a low-pressure way to get quiet kids talking, because guessing wrong is part of the fun.",
  },
];

const byLevel = (level: RiddleLevel) => RIDDLES_FOR_KIDS.filter((r) => r.level === level);

export default function RiddlesForKidsPage() {
  const questions = RIDDLES_FOR_KIDS.map((r) => ({ text: r.q, answer: r.a, audience: r.audience, grades: [r.level], theme: r.type }));
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Riddles for Kids" }]} />
        <ClassroomQuestionGenerator
          questions={questions}
          grades={RIDDLE_LEVELS}
          themes={RIDDLE_TYPES}
          title="Riddles for Kids"
          subtitle={`${RIDDLES_FOR_KIDS.length} riddles with answers, from easy (ages 5–7) to hard (ages 10–12). Guess first, then tap to reveal — or project a riddle race for the class.`}
          emoji="🧩"
          source="riddles_for_kids"
          printHeading="Riddles for Kids (with answers)"
          allGradesLabel="All levels"
          allThemesLabel="Any type"
          firstPrompt="Tap the button for a riddle"
        />
        <ClassroomArt src="/art/classroom/riddles-for-kids.jpg" alt="Illustrated kids puzzling over a projected riddle with a question mark and a lightbulb" />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-6 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">How to Run a Riddle Race</h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                A riddle is a tiny puzzle made of words. The fun is in the “aha!” — and in a class, that moment is even better when
                everyone gets it at once. Every riddle here has one clear answer a child already knows, and none of them are scary or gross.
              </p>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Split into teams</strong> of 3–5 and pick a level (easy for K–1, medium for grades 2–4, hard for grades 5–6).</li>
                <li><strong>Press “Project for the class”.</strong> Read the riddle aloud and start the 30-second timer (T).</li>
                <li><strong>Teams whisper</strong> and write their answer on a mini whiteboard or scrap paper.</li>
                <li><strong>Press Space to reveal</strong> the answer. One point per correct team, then Space again for the next riddle.</li>
              </ol>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-3" style={{ fontFamily: "var(--font-display)" }}>More ways to use riddles</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Riddle of the day:</strong> write one on the board in the morning and reveal the answer at the end of the day.</li>
                <li><strong>Write your own:</strong> after five riddles, kids write a “What am I?” riddle about an object in the classroom.</li>
                <li><strong>Brain break:</strong> two minutes, three riddles, back to work.</li>
                <li><strong>Car rides and dinner:</strong> one person reads, everyone else guesses — no screen needed after the first look.</li>
              </ul>
              <p>
                Pair riddles with <Link href="/morning-meeting-questions" className="text-[var(--neon-cyan)] hover:underline">morning meeting questions</Link>,
                quick <Link href="/this-or-that/kids" className="text-[var(--neon-cyan)] hover:underline">this or that for kids</Link> or
                silly <Link href="/would-you-rather/kids" className="text-[var(--neon-cyan)] hover:underline">would you rather questions for kids</Link>.
              </p>
            </div>
          </div>
        </section>

        {RIDDLE_LEVELS.map((level) => (
          <RiddleList
            key={level.id}
            heading={`${level.label} Riddles for Kids (${level.ages})`}
            riddles={byLevel(level.id).slice(0, level.id === "medium" ? 20 : 15)}
          />
        ))}

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
