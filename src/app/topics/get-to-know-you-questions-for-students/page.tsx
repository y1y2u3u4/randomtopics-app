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
import { STUDENT_GET_TO_KNOW_YOU, STUDENT_GRADES, type StudentGrade } from "@/data/kidsQuestions";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const PATH = "/topics/get-to-know-you-questions-for-students";
const TITLE = `${STUDENT_GET_TO_KNOW_YOU.length} Get to Know You Questions for Students (K–12)`;
const DESCRIPTION = `${STUDENT_GET_TO_KNOW_YOU.length} get to know you questions for students, sorted by grade: K–5, 6–8 and 9–12. A one-click generator, projector mode for the first day of school and free printable lists.`;

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Random Topics` },
  description: DESCRIPTION,
  keywords: ["get to know you questions for students", "first day of school questions", "get to know you questions for kids", "icebreaker questions for students", "back to school questions"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Random Topics",
    type: "article",
    images: [{ url: "/og/get-to-know-you-questions-for-students.jpg", width: 1200, height: 630, alt: "Get to Know You Questions for Students" }],
  },
};

const FAQ_ITEMS = [
  {
    question: "What are good get to know you questions for the first day of school?",
    answer: "Start with easy, low-risk questions everyone can answer, like a favorite animal, food or way to spend a Saturday. Save questions about goals and how students like to learn for the end of the first week, once the room feels safer. The grade filters above keep the questions at the right level.",
  },
  {
    question: "How do I use these with elementary, middle and high school students?",
    answer: "K–5 questions are concrete and playful (What would you name a pet dragon?). Grades 6–8 add interests, friendships and goals. Grades 9–12 lean on independence, learning style and plans after high school. Pick the band that matches your class; every question is safe to ask out loud in front of the group.",
  },
  {
    question: "How does the projector mode work?",
    answer: "Press “Project for the class” to show one question at a time in large text on your board or screen. Use the arrow keys or space bar to move, F for full screen, T for a timer and Esc to close. It runs in the browser with no sign-up, so it works on a school laptop.",
  },
  {
    question: "Can students answer these online or in writing?",
    answer: "Yes. In an online class, post one question in the chat and have everyone answer at once, or use breakout rooms with three questions each. For a quieter start, print the list and let students pick five to answer on paper.",
  },
  {
    question: "Are any of these questions too personal?",
    answer: "They were written to avoid family situations, money, health, appearance and politics, so no student is put on the spot. Still, let students pass on any question — “pass” is always a fine answer.",
  },
];

const USES: { title: string; when: string; tip: string; picks: string[] }[] = [
  {
    title: "First week of school",
    when: "Day one to day five",
    tip: "Keep it light on day one; ask about learning and goals by Friday.",
    picks: [
      "What is your favorite animal, and why?",
      "What is something you are really into right now?",
      "What is something you are looking forward to this year?",
      "What is one goal you have for this school year?",
      "What is one thing you want your teacher to know about you?",
    ],
  },
  {
    title: "After a seating change",
    when: "New table groups or partners",
    tip: "Give new partners two minutes and one question, then switch.",
    picks: [
      "If you could have any pet, what would it be?",
      "What is your go-to snack?",
      "Do you prefer working alone, with a partner or in a group?",
      "What is a skill you have that does not show up on a report card?",
      "What is a hobby you would recommend to everyone?",
    ],
  },
  {
    title: "Online or hybrid class",
    when: "Chat, breakout rooms, discussion boards",
    tip: "Ask everyone to answer in the chat at the same time so nobody waits.",
    picks: [
      "What is your favorite place in your home?",
      "What is a song you have had on repeat lately?",
      "What is the best book, show or game you have found recently?",
      "What do you do to recharge after a long day?",
      "How do you like to get feedback — written, spoken or in a quick check-in?",
    ],
  },
];

const byGrade = (g: StudentGrade) => STUDENT_GET_TO_KNOW_YOU.filter((q) => q.grades.includes(g)).map((q) => q.text);

export default function GetToKnowYouStudentsPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Topics", href: "/topics" }, { label: "Get to Know You Questions for Students" }]} />
        <ClassroomQuestionGenerator
          questions={STUDENT_GET_TO_KNOW_YOU}
          grades={STUDENT_GRADES}
          title="Get to Know You Questions for Students"
          subtitle={`${STUDENT_GET_TO_KNOW_YOU.length} questions for K–5, 6–8 and 9–12. Pick a grade, click for a question, or project them for the first day of school.`}
          emoji="👋"
          source="student_get_to_know_you"
          printHeading="Get to Know You Questions"
        />
        <ClassroomArt src="/art/classroom/get-to-know-you-students.jpg" alt="Illustrated students in a circle sharing answers on the first day of school" />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-6 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">Three Times You Need Them (and Which Questions to Use)</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              The first day of school is not the only time students need to get to know each other. New table groups, a new
              semester or a move online all reset the room. Here is a short starter set for each — or use the generator above to pull
              questions for your exact grade.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {USES.map((u) => (
                <div key={u.title} className="rounded-xl border border-white/10 p-4">
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{u.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{u.when}</p>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] list-disc pl-4">
                    {u.picks.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                  <p className="text-xs text-[var(--text-muted)] mt-3"><strong>Tip:</strong> {u.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {STUDENT_GRADES.map((g) => (
          <QuestionBank
            key={g.id}
            heading={`${byGrade(g.id).length} Get to Know You Questions for ${g.label} (${g.ages})`}
            intro={g.id === "k5" ? "Concrete and playful — easy for young students to answer out loud." : g.id === "g68" ? "Interests, friendships and goals for middle schoolers." : "Independence, learning style and what comes next for high schoolers."}
            questions={byGrade(g.id)}
          />
        ))}

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="glass-card p-6 sm:p-10 space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Activities That Go Beyond Taking Turns</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Inside–outside circle:</strong> two circles face each other, answer one question, then the outer circle moves one step.</li>
              <li><strong>Find someone who:</strong> turn five answers into a scavenger hunt (“find someone whose favorite season is winter”).</li>
              <li><strong>Four corners:</strong> for either/or questions, students walk to a corner — or project <Link prefetch={false} href="/this-or-that/kids" className="text-[var(--neon-cyan)] hover:underline">this or that for kids</Link>.</li>
              <li><strong>Exit ticket:</strong> one question on a sticky note on the way out; you learn something about every student in a minute.</li>
              <li><strong>Random partners:</strong> pair students with the <Link prefetch={false} href="/random-team-generator" className="text-[var(--neon-cyan)] hover:underline">random team generator</Link> and give each pair three questions.</li>
            </ul>
            <p>
              For adults and staff meetings, see <Link prefetch={false} href="/topics/get-to-know-you-questions-for-adults" className="text-[var(--neon-cyan)] hover:underline">get to know you questions for adults</Link>.
              After the first week, keep the conversation going with a <Link prefetch={false} href="/question-of-the-day-for-students" className="text-[var(--neon-cyan)] hover:underline">question of the day for students</Link>.
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] pt-4" style={{ fontFamily: "var(--font-display)" }}>Frequently Asked Questions</h2>
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
