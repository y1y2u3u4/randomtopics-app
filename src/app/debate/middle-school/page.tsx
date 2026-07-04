import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debate Topics for Middle School \u2014 Random Generator",
  description: "Random debate topic generator for middle school (grades 6-8): age-appropriate topics with pro/con points for first-time debaters. Free for teachers, no signup.",
  alternates: { canonical: "/debate/middle-school" },
};

const FAQ_ITEMS = [
  {
    question: "What are good debate topics for middle school students?",
    answer:
      "The best middle school debate topics are concrete and experience-near: Should homework be banned? Should school start later? Should phones be allowed at school? Should junk food be sold in cafeterias? Students argue best about things they experience daily.",
  },
  {
    question: "How long should a middle school debate be?",
    answer:
      "Keep the full format under 20 minutes: 90-second openings, 60-second rebuttals, 60-second closings, then a class vote. Short speeches keep all students engaged and reduce anxiety for first-time speakers.",
  },
  {
    question: "How do I make debate less scary for 6th graders?",
    answer:
      "Start with pair debates instead of solo speeches, use silly topics first (is cereal soup?), provide sentence starters, and grade preparation rather than winning. Confidence comes before skill.",
  },
  {
    question: "Are these topics appropriate for grades 6-8?",
    answer:
      "Yes \u2014 use the 'light' depth filter for the most age-appropriate topics. The generator avoids graphic and adult themes, and teachers can preview up to 10 topics at once before class.",
  },
  {
    question: "Is this free for classroom use?",
    answer:
      "Completely free with no signup and no ads. Project it live in class or generate a topic list before the lesson.",
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
            { label: "Middle School" },
          ]}
        />
        <TopicGenerator
          initialMode="debate"
          title="Middle School Debate Topic Generator"
          subtitle="Age-appropriate debate topics for grades 6-8 — concrete, arguable, and connected to students' daily lives."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Middle School Debate Topic Generator: How to Use It
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>Middle school is where most students argue for the first time in a structured way, and the topic makes or breaks the experience. Grades 6-8 debate best on questions they live every day: school rules, homework, phones, sports, food. Abstract policy questions (“should the federal reserve...”) lose the room in seconds; “should your school ban phones during lunch?” starts a riot of raised hands.</p>
              <p>This generator pre-filters our database toward concrete, experience-near propositions, and every topic comes with simple pro and con talking points that first-time debaters can build from. Use the ‘light’ depth filter for 6th graders and ‘medium’ for 8th. Related resources: <Link href="/topics/debate-topics-for-middle-school" className="text-[var(--neon-cyan)] hover:underline">50 debate topics for middle school</Link> (printable list), the <Link href="/debate/high-school" className="text-[var(--neon-cyan)] hover:underline">high school generator</Link> for older students, and <Link href="/debate/funny" className="text-[var(--neon-cyan)] hover:underline">funny debate topics</Link> for low-stakes warm-ups.</p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Running Debates with Grades 6-8
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Keep speeches short.</strong> 60-90 second speeches keep every student engaged and lower the fear barrier. Total format should fit in 20 minutes.</li>
                <li><strong>Assign sides randomly.</strong> Middle schoolers take arguments personally; random side assignment teaches that defending a position is a skill, not an identity.</li>
                <li><strong>Use a sentence-starter wall.</strong> Post frames like ‘My opponent claims..., however...’ â scaffolding turns nervous speakers into participants.</li>
                <li><strong>Grade preparation, not victory.</strong> Score evidence, structure, and listening. If only winners get As, shy students stop trying.</li>
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
