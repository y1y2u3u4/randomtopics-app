import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debate Topics for High School \u2014 Random Generator",
  description: "Random debate topic generator for high school (grades 9-12): evidence-ready topics with pro/con arguments for class debates, clubs and tournament practice. Free, no signup.",
  alternates: { canonical: "/debate/high-school" },
};

const FAQ_ITEMS = [
  {
    question: "What are good debate topics for high school students?",
    answer:
      "Strong high school topics have credible evidence on both sides: Should social media require age verification? Should college be free? Should AI tools be allowed in schoolwork? Should the voting age be lowered to 16? Current-events topics with available research work best for grades 9-12.",
  },
  {
    question: "What debate formats do high schools use?",
    answer:
      "The most common are Lincoln-Douglas (values-focused, 1v1), Public Forum (current events, 2v2), Policy (research-intensive, 2v2), and parliamentary (limited prep). This generator works for all of them \u2014 use deep-filter topics for LD values debates and current-events categories for Public Forum.",
  },
  {
    question: "How do students prepare for a debate tournament?",
    answer:
      "Build cases on both sides of the resolution, collect evidence with citations, practice 4-minute constructives and 2-minute rebuttals against teammates, and drill crossfire questions. Random surprise topics from this generator are ideal for limited-prep practice.",
  },
  {
    question: "Can these topics be used for argumentative essays?",
    answer:
      "Yes \u2014 every debate proposition doubles as an argumentative essay thesis. The pro/con talking points map directly onto body paragraphs and counterargument sections.",
  },
  {
    question: "Is this free for schools and debate clubs?",
    answer:
      "Completely free, no signup, no ads. Coaches generate topic batches for practice rounds; teachers project it live for classroom debates.",
  },
];

export default function Page() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Debate Topics", href: "/debate" },
            { label: "High School" },
          ]}
        />
        <TopicGenerator
          initialMode="debate"
          title="High School Debate Topic Generator"
          subtitle="Evidence-ready debate topics for grades 9-12 — from classroom discussions to tournament prep."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              High School Debate Topic Generator: How to Use It
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>High school debaters can handle what middle schoolers can’t: nuance, research, and topics with real stakes. Grades 9-12 debate best on questions where credible evidence exists on both sides â social media regulation, AI in education, criminal justice, climate policy, college admissions. The skill ceiling moves from ‘can you structure an argument’ to ‘can you weigh competing values.’</p>
              <p>This generator serves propositions with enough meat for evidence-based argument, each with pro and con starting points. For tournament formats (LD, Public Forum, Policy), use the deep filter and treat the talking points as case brainstorms, not cases. Related resources: <Link href="/topics/debate-topics-for-students" className="text-[var(--neon-cyan)] hover:underline">75 debate topics for students</Link>, <Link href="/topics/controversial-topics-to-discuss" className="text-[var(--neon-cyan)] hover:underline">controversial topics</Link> for advanced classes, and the <Link href="/debate/college" className="text-[var(--neon-cyan)] hover:underline">college-level generator</Link>.</p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Leveling Up Grade 9-12 Debates
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Require cited evidence.</strong> One source minimum per constructive speech. The debate about whose evidence is stronger is where the real learning happens.</li>
                <li><strong>Teach weighing.</strong> Great high school debates end with ‘even if my opponent is right about X, Y matters more because...’ â explicitly teach impact comparison.</li>
                <li><strong>Rotate formats.</strong> Alternate quick parliamentary rounds with researched policy debates; improvisation and depth are different muscles.</li>
                <li><strong>Debrief argument quality.</strong> After the vote, ask: which single argument moved you, and what would have beaten it?</li>
              </ul>

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
