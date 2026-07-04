import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debate Topic Generator for Students — Middle & High School",
  description:
    "Random debate topic generator for students: age-appropriate topics with pro/con arguments for middle school, high school and college classrooms. Free for teachers, no signup.",
};

const FAQ_ITEMS = [
  {
    question: "What are good debate topics for middle school students?",
    answer:
      "Middle schoolers debate best on topics they experience directly: Should homework be abolished? Should school days start later? Should phones be allowed in class? Keep topics concrete and connected to daily life — abstract policy questions work better in high school.",
  },
  {
    question: "What are good debate topics for high school students?",
    answer:
      "High schoolers can handle nuance and evidence: social media regulation, AI in education, voting age, college costs, climate policy. The best high school topics have credible arguments on both sides and available research for citations.",
  },
  {
    question: "How do I run a classroom debate?",
    answer:
      "A simple format: split the class into pro and con teams, give 10 minutes of prep, then alternate 2-minute speeches (opening, rebuttal, closing) and finish with a class vote on the most persuasive side — not on personal opinion. Our generator's pro/con talking points double as prep scaffolding.",
  },
  {
    question: "Can students use this generator for debate practice at home?",
    answer:
      "Yes — generate a topic, take the side you disagree with, and argue it for two minutes. Practicing the opposite side is the fastest way to strengthen rebuttals and critical thinking.",
  },
  {
    question: "Is this free for teachers and schools?",
    answer:
      "Completely free with no signup and no ads. Teachers can project the generator in class, filter by category and depth for age-appropriateness, and generate up to 10 topics at once for group work.",
  },
];

export default function StudentDebatePage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Debate Topics", href: "/debate" },
            { label: "For Students" },
          ]}
        />
        <TopicGenerator
          initialMode="debate"
          title="Debate Topic Generator for Students"
          subtitle="Age-appropriate debate topics with pro and con arguments — built for classrooms, debate clubs, and homework practice."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Debate Topics That Work in Real Classrooms
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                The difference between a debate that catches fire and one that dies in two minutes is
                almost always the topic. <strong>Student debate topics</strong> need three things: both
                sides must be genuinely arguable, the subject must connect to students&apos; lives, and
                the language must match their grade level. This generator filters our 500+ topic database
                for exactly those qualities, and every topic ships with <strong>pro and con talking
                points</strong> students can use as prep scaffolding.
              </p>
              <p>
                Teachers use it three ways: projecting it live and generating topics until the class finds
                one they&apos;re split on; generating 10 topics for small-group parallel debates; or
                assigning it for homework rebuttal practice. Prefer a fixed list you can print? Our
                curated <Link href="/topics/debate-topics-for-students" className="text-[var(--neon-cyan)] hover:underline">75 debate topics for students</Link> is
                organized by grade band.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Matching Topics to Grade Level
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Grades 6-8:</strong> concrete, experience-near topics — school rules, homework, sports, technology at home. Use the &quot;light&quot; depth filter.</li>
                <li><strong>Grades 9-10:</strong> introduce evidence-based topics — social media, gaming, school policy — where students must cite at least one source per argument.</li>
                <li><strong>Grades 11-12 &amp; college:</strong> policy and ethics topics with real stakes — AI, climate, criminal justice, economics. Use &quot;medium&quot; and &quot;deep&quot; filters, and see our <Link href="/topics/controversial-topics-to-discuss" className="text-[var(--neon-cyan)] hover:underline">controversial topics</Link> collection for advanced classes.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                A 30-Minute Classroom Debate Plan
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Minutes 0-5:</strong> generate topics until the class is roughly split; assign pro/con teams (deliberately put some students on the side they disagree with).</li>
                <li><strong>Minutes 5-15:</strong> team prep using the talking points as starting leads — each speaker must add one original argument.</li>
                <li><strong>Minutes 15-27:</strong> alternating speeches: 2-minute openings, 1-minute rebuttals, 1-minute closings.</li>
                <li><strong>Minutes 27-30:</strong> class votes on the most persuasive team, then 2-minute debrief: which single argument moved the most votes, and why?</li>
              </ol>

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
