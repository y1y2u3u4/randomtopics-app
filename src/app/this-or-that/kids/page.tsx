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
import { KIDS_GRADES, KIDS_THEMES, KIDS_THIS_OR_THAT } from "@/data/kidsQuestions";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const PATH = "/this-or-that/kids";
const TITLE = `This or That for Kids: ${KIDS_THIS_OR_THAT.length} Questions + Projector Mode`;
const DESCRIPTION = `${KIDS_THIS_OR_THAT.length} kid-friendly this or that questions for grades K–6 (ages 5–12). One click per question, filter by grade and theme, and project it so kids pick a side of the room. Free, no sign-up.`;

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Random Topics` },
  description: DESCRIPTION,
  keywords: ["this or that for kids", "this or that questions for kids", "this or that game for kids", "this or that questions for students", "classroom this or that"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Random Topics",
    type: "website",
    images: [{ url: "/og/this-or-that-kids.jpg", width: 1200, height: 630, alt: "This or That for Kids — pick a side of the room" }],
  },
};

const FAQ_ITEMS = [
  {
    question: "What ages are these this or that questions for?",
    answer: "Grades K–6, roughly ages 5 to 12. Pick “Grades K–2” for picture-easy choices like slide or swings, or “Grades 3–6” for a few that need a little more thinking, like science fair or spelling bee. Every question was reviewed for a mixed classroom: no dating, scary, grown-up or political topics.",
  },
  {
    question: "How do you play this or that in the classroom?",
    answer: "Project a question, then students walk to the left side of the room for the first choice and the right side for the second. Ask one or two kids from each side why they picked it, then go to the next question. It takes about a minute per question and works as a brain break, a morning meeting game or a first-day icebreaker.",
  },
  {
    question: "How does projector mode work?",
    answer: "Press “Project for the class”. The question fills the screen in big text, with the first choice on the left and the second on the right, matching the sides of the room. Use the arrow keys or space bar to move, F for full screen, T for an optional timer and Esc to close. It works on any laptop connected to a projector or smart board and needs no account.",
  },
  {
    question: "Can I play this or that with kids at home or on a road trip?",
    answer: "Yes. Read the question out loud, everyone shouts their pick, and the person with the most different answer explains theirs. The no-repeat deck means you can keep going for a whole car ride without hearing the same question twice.",
  },
  {
    question: "Can I print the questions?",
    answer: "Yes. “Print the list” makes a clean printable page of the questions for the grade and theme you picked; choose “Save as PDF” in the print window to keep a copy. The full list is also on this page below.",
  },
  {
    question: "Is there a version for teens or adults?",
    answer: "Yes — the main this or that generator has everyday choices for teens and adults, like coffee or tea and window seat or aisle seat.",
  },
];

// Interleave themes so the visible list is not 20 food questions in a row.
function mixed(n: number) {
  const byTheme = KIDS_THEMES.map((t) => KIDS_THIS_OR_THAT.filter((q) => q.theme === t.id));
  const out: string[] = [];
  for (let i = 0; out.length < n && byTheme.some((l) => l[i]); i++) {
    for (const list of byTheme) if (list[i] && out.length < n) out.push(list[i].text);
  }
  return out;
}

export default function ThisOrThatKidsPage() {
  const list = mixed(50);
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "This or That", href: "/this-or-that" }, { label: "For Kids" }]} />
        <KidsVersionSwitch general="/this-or-that" kids="/this-or-that/kids" active="kids" />
        <ClassroomQuestionGenerator
          questions={KIDS_THIS_OR_THAT}
          grades={KIDS_GRADES}
          themes={KIDS_THEMES}
          title="This or That for Kids"
          subtitle={`${KIDS_THIS_OR_THAT.length} kid-friendly choices for grades K–6 (ages 5–12). One click per question — or project it and let kids pick a side of the room.`}
          emoji="⚖️"
          source="kids_this_or_that"
          split
          printHeading="This or That Questions for Kids"
        />
        <ClassroomArt src="/art/classroom/this-or-that-kids.jpg" alt="Illustrated classroom where kids stand on two sides of the room under a projected this-or-that question" />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-6 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">How to Play This or That with a Class</h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>This or that</strong> is the fastest game there is: two choices, no wrong answer, and everyone gets to pick.
                That makes it perfect for kids who are shy about talking — they can answer with their feet before they answer with words.
                Every question here was picked or written for grades K–6, then checked so nothing in it would be awkward in front of a class.
              </p>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Pick a grade band</strong> (and a theme if you like — food, animals, school, play, seasons, silly or everyday).</li>
                <li><strong>Press “Project for the class”.</strong> The left choice and right choice appear on the matching sides of the screen.</li>
                <li><strong>Kids walk to their side.</strong> No middle allowed! Count each side, or just eyeball it.</li>
                <li><strong>Ask “why?”</strong> Let one student from each side explain in a full sentence. Then press → for the next question.</li>
              </ol>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-3" style={{ fontFamily: "var(--font-display)" }}>Five ways teachers use it</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>First day of school:</strong> five questions and you already know who loves dogs, who reads and who wants outdoor recess.</li>
                <li><strong>Brain break:</strong> two minutes of standing up and moving between lessons, no materials needed.</li>
                <li><strong>Morning meeting:</strong> one question as the greeting — “Good morning, I picked pancakes because…”.</li>
                <li><strong>Opinion writing warm-up:</strong> pick a side, then write three reasons. A gentle start before <Link href="/debate/middle-school" className="text-[var(--neon-cyan)] hover:underline">real debate topics</Link>.</li>
                <li><strong>Data and graphing:</strong> tally both sides for five questions and make a bar graph as a class.</li>
              </ul>
              <p>
                Want bigger dilemmas for older kids? Try <Link href="/would-you-rather/kids" className="text-[var(--neon-cyan)] hover:underline">would you rather questions for kids</Link>.
                Starting a new class? Use <Link href="/topics/get-to-know-you-questions-for-students" className="text-[var(--neon-cyan)] hover:underline">get to know you questions for students</Link>.
                For teens and adults, the main <Link href="/this-or-that" className="text-[var(--neon-cyan)] hover:underline">this or that generator</Link> has everyday choices.
              </p>
            </div>
          </div>
        </section>

        <QuestionBank
          heading="50 This or That Questions for Kids"
          intro="A mix from every theme, all suitable for grades K–6. Copy one, or copy the whole list for your slides."
          questions={list}
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
