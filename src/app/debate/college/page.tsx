import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debate Topics for College Students \u2014 Random Generator",
  description: "Random debate topic generator for college: policy, ethics and philosophy topics with pro/con arguments for seminars, societies and parliamentary debate. Free, no signup.",
  alternates: { canonical: "/debate/college" },
};

const FAQ_ITEMS = [
  {
    question: "What are good debate topics for college students?",
    answer:
      "College-level topics reward nuance and framework argument: Should AI development be paused? Is meritocracy a myth? Should hate speech be protected? Is economic growth compatible with climate goals? The best ones force debaters to argue about values, not just facts.",
  },
  {
    question: "What is parliamentary debate at the college level?",
    answer:
      "British Parliamentary (BP) is the dominant university format worldwide: four teams of two, 15 minutes of prep on a surprise motion, seven-minute speeches. Practicing with random motions from this generator mirrors real prep conditions.",
  },
  {
    question: "How are college debates judged?",
    answer:
      "Most university formats judge persuasion, engagement with the strongest opposing arguments, and impact weighing rather than delivery polish. A round is usually won by the team that best explains why their arguments matter more.",
  },
  {
    question: "Can I use these for seminar discussions and essays?",
    answer:
      "Yes \u2014 seminar leaders use generated propositions as discussion anchors, and students stress-test thesis statements by generating counter-positions before writing.",
  },
  {
    question: "Is this generator free for universities and societies?",
    answer:
      "Completely free with no signup. Societies use it for practice motions; professors project it in class; students drill solo.",
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
            { label: "College" },
          ]}
        />
        <TopicGenerator
          initialMode="debate"
          title="College Debate Topic Generator"
          subtitle="Policy, ethics, and philosophy propositions for seminars, debating societies, and parliamentary practice."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              College Debate Topic Generator: How to Use It
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>College debate runs on a different fuel: definitional precision, framework clashes, and comfort with genuine moral ambiguity. The best college-level topics resist easy resolution â they force debaters to argue about how we should decide, not just what we should decide. Think AI governance, effective altruism, degrowth, criminal punishment theory, and the limits of free expression.</p>
              <p>This generator leans on our philosophy, politics, technology and ethics categories at medium-to-deep depth. Debating societies use it for parliamentary motions; seminar leaders use it to seed discussion; students use it to stress-test essay theses before committing. Related resources: <Link href="/topics/random-essay-topics-for-college" className="text-[var(--neon-cyan)] hover:underline">essay topics for college</Link>, <Link href="/topics/deep-philosophical-questions" className="text-[var(--neon-cyan)] hover:underline">deep philosophical questions</Link>, and the <Link href="/argument-generator" className="text-[var(--neon-cyan)] hover:underline">argument generator</Link>.</p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Getting the Most from College Debates
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Fight about definitions first.</strong> Half of every good college debate is definitional. ‘Should billionaires exist’ turns on what counts as deserving wealth â make the framework clash explicit.</li>
                <li><strong>Argue the steelman.</strong> House rule: you may only attack the strongest version of your opponent’s case. It raises the quality of every round.</li>
                <li><strong>Switch-side practice.</strong> Debate the same motion twice, swapping sides. Nothing exposes weak arguments faster.</li>
                <li><strong>Use surprise motions.</strong> Parliamentary formats give 15-20 minutes prep on an unseen motion â generate one, start a timer, and simulate tournament pressure.</li>
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
