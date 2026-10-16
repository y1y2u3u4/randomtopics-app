import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import QuestionBank from "@/components/QuestionBank";
import ClassroomQuestionGenerator from "@/components/ClassroomQuestionGenerator";
import ClassroomPackCard from "@/components/ClassroomPackCard";
import ClassroomToolLinks from "@/components/ClassroomToolLinks";
import ClassroomArt from "@/components/ClassroomArt";
import KidsVersionSwitch from "@/components/KidsVersionSwitch";
import { KIDS_GRADES, KIDS_WOULD_YOU_RATHER } from "@/data/kidsQuestions";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const PATH = "/would-you-rather/kids";
const TITLE = `Would You Rather Questions for Kids: ${KIDS_WOULD_YOU_RATHER.length} Clean & Silly Picks`;
const DESCRIPTION = `${KIDS_WOULD_YOU_RATHER.length} would you rather questions for kids in grades K–6 (ages 5–12). One click per question, projector mode for the classroom and a free 1-page printable. Clean, silly, no sign-up.`;

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Random Topics` },
  description: DESCRIPTION,
  keywords: ["would you rather questions for kids", "would you rather for kids", "funny would you rather questions for kids", "would you rather questions for students", "clean would you rather questions"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Random Topics",
    type: "website",
    images: [{ url: "/og/would-you-rather-kids.jpg", width: 1200, height: 630, alt: "Would You Rather Questions for Kids" }],
  },
};

const FAQ_ITEMS = [
  {
    question: "Are these would you rather questions appropriate for kids?",
    answer: "Yes. Every question was written or re-checked for grades K–6 (about ages 5 to 12): silly, imaginative and food-and-animal heavy, with no dating, scary, gross-out, grown-up or political topics. Questions that need a bit more thinking — like stopping time or rewinding it — are tagged for grades 3–6.",
  },
  {
    question: "How do you play would you rather in a classroom?",
    answer: "Project the question, give everyone ten seconds to decide, then students move to the left or right side of the room (or hold up one or two fingers). Ask a volunteer from each side to explain their choice with “because”. The minority side often has the most interesting reasons.",
  },
  {
    question: "Is there a printable would you rather worksheet?",
    answer: "Yes. “Print 10 (1 page)” makes a one-page sheet with ten questions for the grade band you picked. Kids circle their choice and write one reason for each — a ready-made opinion writing warm-up. Choose “Save as PDF” in the print window to keep it.",
  },
  {
    question: "What is the difference between would you rather and this or that?",
    answer: "This or that is a quick pick between two things (pizza or tacos?). Would you rather adds an imaginary situation (would you rather have a pet dragon or a pet robot?), so it gets kids explaining and imagining. Use this or that for warm-ups and would you rather when you want more talking.",
  },
  {
    question: "Can I use these at home, at parties or on road trips?",
    answer: "Absolutely. They work at birthday parties, sleepovers, family dinners and in the car. The generator never repeats a question until you have seen them all.",
  },
];

export default function WouldYouRatherKidsPage() {
  const younger = KIDS_WOULD_YOU_RATHER.filter((q) => q.grades.length === 2).slice(0, 30).map((q) => q.text);
  const older = KIDS_WOULD_YOU_RATHER.filter((q) => q.grades.length === 1 && q.grades[0] === "g36").slice(0, 15).map((q) => q.text);
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Would You Rather", href: "/would-you-rather" }, { label: "For Kids" }]} />
        <KidsVersionSwitch general="/would-you-rather" kids="/would-you-rather/kids" active="kids" />
        <ClassroomQuestionGenerator
          questions={KIDS_WOULD_YOU_RATHER}
          grades={KIDS_GRADES}
          title="Would You Rather Questions for Kids"
          subtitle={`${KIDS_WOULD_YOU_RATHER.length} clean, silly dilemmas for grades K–6 (ages 5–12). One click per question, a projector mode for the board and a free 1-page printable.`}
          emoji="🤔"
          source="kids_would_you_rather"
          split
          printCount={10}
          printHeading="Would You Rather? (circle one and say why)"
        />
        <ClassroomArt src="/art/classroom/would-you-rather-kids.jpg" alt="Illustrated kids imagining a pet dragon on one side and a pet robot on the other" />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-6 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">How to Play Would You Rather with Kids</h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Kids love <strong>would you rather</strong> because there is no wrong answer — just a choice and a reason.
                That is exactly what makes it useful in class: it gets quiet students talking, practices “because” sentences and
                fills the five awkward minutes before the bell. The questions here are imaginative rather than gross or scary,
                so you can project any of them without checking first.
              </p>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Choose a grade band</strong> — K–2 keeps to simple, concrete choices; 3–6 adds a few that need more thinking.</li>
                <li><strong>Project it</strong> with “Project for the class”. The two choices sit on the left and right of the screen.</li>
                <li><strong>Vote with your feet</strong> (or with one or two fingers if there is no room to move).</li>
                <li><strong>Explain it:</strong> “I would rather… because…”. Then press → for the next one.</li>
              </ol>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-3" style={{ fontFamily: "var(--font-display)" }}>Classroom ideas</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Opinion writing:</strong> print the 10-question sheet; kids circle a choice and write one reason for each.</li>
                <li><strong>Speaking practice (ESL / ELL):</strong> model the sentence frame “I would rather ___ because ___” and go around the circle.</li>
                <li><strong>Partner talk:</strong> pairs guess each other&apos;s answer first, then reveal.</li>
                <li><strong>Indoor recess:</strong> a student “host” runs the projector while the class plays.</li>
              </ul>
              <p>
                Need faster warm-ups? Try <Link href="/this-or-that/kids" className="text-[var(--neon-cyan)] hover:underline">this or that for kids</Link>.
                For teens and adults, the main <Link href="/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">would you rather generator</Link> has
                grown-up dilemmas, and <Link href="/question-of-the-day-for-students" className="text-[var(--neon-cyan)] hover:underline">question of the day for students</Link> gives
                you a bell-ringer for every day.
              </p>
            </div>
          </div>
        </section>

        <QuestionBank
          heading="30 Would You Rather Questions for Kids (All Ages)"
          intro="Good for every grade from kindergarten up. Copy one, or copy the whole list for your slides."
          questions={younger}
        />
        <QuestionBank
          heading="15 Would You Rather Questions for Older Kids (Grades 3–6)"
          intro="A little more to think about — great for opinion writing."
          questions={older}
        />

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
