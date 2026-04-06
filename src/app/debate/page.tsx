import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Debate Topic Generator | Argumentative & Pro/Con Topics",
  description:
    "Generate random debate topics with pro and con arguments for classroom discussions, debate clubs, and practice rounds. Controversial, persuasive, and thought-provoking topics for students and adults.",
};

export default function DebatePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Debate Topics" },
          ]}
        />
        <TopicGenerator
          initialMode="debate"
          title="Debate Topic Generator"
          subtitle="Find thought-provoking debate topics with clear arguments for both sides."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              What Makes a Good Debate Topic?
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                A strong <strong>debate topic</strong> has two essential qualities: it&apos;s genuinely
                arguable from both sides, and it matters to the audience. The best topics sit in a gray
                area where reasonable people disagree — not because they lack information, but because they
                hold different values or priorities. Topics like &quot;Should social media be regulated?&quot;
                or &quot;Is remote work better than office work?&quot; generate passionate arguments precisely
                because there&apos;s no objectively correct answer.
              </p>
              <p>
                Our generator curates <strong>argumentative topics</strong> across politics, technology,
                ethics, education, and more — each chosen because it supports compelling <strong>pro and
                con arguments</strong>. Whether you&apos;re preparing for a competitive debate tournament
                or leading a classroom discussion, these topics will challenge participants to think
                critically and articulate their positions clearly. For student-specific topics, see
                our <Link href="/topics/debate-topics-for-students" className="text-[var(--neon-cyan)] hover:underline">debate topics for students</Link> guide.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Debate Formats Explained
              </h3>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Lincoln-Douglas (LD)</h4>
              <p>
                A one-on-one format focused on values and philosophical principles. One debater argues
                the affirmative case while the other defends the negative. LD debates typically center
                on moral or ethical questions, making our ethics and philosophy topics particularly useful
                for this format. Each side gets structured speaking time with cross-examination periods.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Parliamentary Debate</h4>
              <p>
                Teams of two argue for or against a motion, with limited preparation time. This format
                rewards quick thinking and persuasive speaking. The government team proposes a case, and
                the opposition must counter it on the spot. Parliamentary debate is popular in universities
                worldwide and mirrors real legislative processes.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Policy Debate</h4>
              <p>
                A research-intensive format where teams argue whether a specific policy change should be
                adopted. Debaters must present evidence, address counterarguments, and demonstrate that
                their plan produces more benefits than harms. Our technology and government topics work
                especially well for policy debate practice.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Public Forum</h4>
              <p>
                Designed to be accessible to general audiences, Public Forum features two-person teams
                debating current events. The emphasis is on persuasion and clarity rather than technical
                jargon. This is one of the fastest-growing debate formats in high schools across the
                United States.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How to Prepare for a Debate
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Research both sides.</strong> Even if you know which side you&apos;ll argue, understanding the opposition&apos;s strongest points helps you prepare rebuttals and avoid being caught off guard.</li>
                <li><strong>Build a clear structure.</strong> Organize your argument into 2-3 main points, each supported by evidence. A logical flow — claim, warrant, impact — makes your case persuasive.</li>
                <li><strong>Anticipate counterarguments.</strong> For every point you make, ask &quot;How would the other side respond?&quot; and prepare your answer in advance.</li>
                <li><strong>Practice delivery.</strong> Strong arguments lose impact when delivered poorly. Practice speaking clearly, maintaining eye contact, and managing your time.</li>
                <li><strong>Stay calm under pressure.</strong> Competitive debates get heated. The debater who remains composed and responds to arguments — not emotions — usually wins.</li>
              </ol>
              <p>
                Want to explore topics that push boundaries? Browse
                our <Link href="/topics/controversial-topics-to-discuss" className="text-[var(--neon-cyan)] hover:underline">controversial topics to discuss</Link> for
                debates that really challenge conventional thinking.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Frequently Asked Questions
              </h3>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">What are the best debate topics for beginners?</h4>
              <p>
                Start with topics where both sides are intuitive and don&apos;t require specialized
                knowledge. Examples include &quot;Should homework be abolished?&quot; or &quot;Is social
                media doing more harm than good?&quot; These let beginners focus on argument structure
                rather than struggling with unfamiliar subject matter.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">How do I choose a debate topic for my class?</h4>
              <p>
                Consider your students&apos; age, interests, and the learning objectives. A good
                classroom debate topic is age-appropriate, connects to curriculum, and has enough
                nuance that students can&apos;t dismiss one side outright. Use our generator to
                browse categories and find one that fits.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">What&apos;s the difference between a debate topic and a discussion topic?</h4>
              <p>
                A debate topic takes a position (e.g., &quot;Social media should be banned for
                children under 16&quot;) that can be argued for or against. A discussion topic is
                more open-ended (e.g., &quot;How does social media affect children?&quot;). Our
                generator provides debate-ready propositions with clear sides.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">Can I use these topics for essay writing?</h4>
              <p>
                Absolutely. Every debate topic here doubles as an excellent <strong>argumentative
                essay topic</strong>. The pro/con structure maps directly to a five-paragraph
                persuasive essay format. Pick a side, use the talking points as paragraph themes,
                and build your argument.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">How often are new debate topics added?</h4>
              <p>
                We regularly update our topic database to reflect current events and emerging issues.
                You can also enable AI-powered topic generation for real-time, unique debate
                propositions on virtually any subject.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
