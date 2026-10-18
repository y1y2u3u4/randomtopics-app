import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { withSocial } from "@/lib/metadata/social";

export const metadata: Metadata = withSocial({
  title: { absolute: "Debate Topics for High School: 60 Resolutions + Random Generator" },
  description: "60 debate topics for high school (grades 9-12) by subject, each tagged Public Forum, Lincoln-Douglas, Policy or parli, plus a random generator with pro/con points.",
  alternates: { canonical: "/debate/high-school" },
});

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
      "Completely free with no signup. Coaches generate topic batches for practice rounds; teachers project it live for classroom debates.",
  },
];

// Crawlable bank: resolutions written for grades 9-12, each with the format it suits.
const HS_TOPICS: { heading: string; note: string; items: [string, string][] }[] = [
  { heading: "Technology and AI", note: "Fast-moving topics with plenty of recent evidence on both sides.", items: [
    ["Schools should allow students to use generative AI for homework.", "Public Forum"],
    ["Social media platforms should verify the age of every user.", "Public Forum"],
    ["Smartphones should be banned during the school day.", "Parliamentary"],
    ["Governments should require labels on all AI-generated images and video.", "Policy"],
    ["The benefits of facial recognition in public places outweigh the harms.", "Lincoln-Douglas"],
    ["Teenagers should have a legal right to delete their childhood social media posts.", "Lincoln-Douglas"],
    ["Self-driving cars should be allowed on public roads without a safety driver.", "Public Forum"],
    ["Video game loot boxes should be regulated as gambling.", "Parliamentary"],
    ["Coding should be a graduation requirement.", "Parliamentary"],
    ["Algorithms should not be used to decide college admissions.", "Lincoln-Douglas"],
  ] },
  { heading: "Education and School Policy", note: "Topics students know first-hand; ask for evidence beyond personal experience.", items: [
    ["High schools should start no earlier than 8:30 a.m.", "Public Forum"],
    ["Standardized tests should be optional for college admission.", "Public Forum"],
    ["Homework should be limited to one hour per night.", "Parliamentary"],
    ["Public college tuition should be free.", "Policy"],
    ["Personal finance should be a required high school course.", "Parliamentary"],
    ["Schools should replace letter grades with written feedback.", "Lincoln-Douglas"],
    ["Students should be able to graduate after three years.", "Parliamentary"],
    ["School uniforms do more good than harm.", "Parliamentary"],
    ["Schools should not remove books from libraries because of parent complaints.", "Lincoln-Douglas"],
    ["Every high school student should complete community service to graduate.", "Public Forum"],
  ] },
  { heading: "Government and Civic Life", note: "Good for Public Forum and Policy rounds; pair with current data.", items: [
    ["The voting age should be lowered to 16.", "Public Forum"],
    ["Voting should be compulsory.", "Lincoln-Douglas"],
    ["The Electoral College should be abolished.", "Policy"],
    ["Members of Congress should have term limits.", "Public Forum"],
    ["Election Day should be a national holiday.", "Parliamentary"],
    ["Ranked-choice voting should be used in national elections.", "Policy"],
    ["Political ads on social media should be banned in the month before an election.", "Public Forum"],
    ["Civic education should include a required mock legislature.", "Parliamentary"],
    ["Citizens should be able to vote online.", "Public Forum"],
    ["National service should be required for 18-year-olds.", "Lincoln-Douglas"],
  ] },
  { heading: "Ethics and Values", note: "Built for Lincoln-Douglas: argue from a value and a criterion, not only from outcomes.", items: [
    ["It is morally permissible to break an unjust law.", "Lincoln-Douglas"],
    ["Privacy is more important than national security.", "Lincoln-Douglas"],
    ["Wealthy nations have a moral obligation to accept climate refugees.", "Lincoln-Douglas"],
    ["Zoos do more good than harm.", "Parliamentary"],
    ["Animal testing for medicine is justified.", "Lincoln-Douglas"],
    ["Athletes who use performance-enhancing drugs should be banned for life.", "Parliamentary"],
    ["Rehabilitation should be the primary goal of criminal justice.", "Lincoln-Douglas"],
    ["Celebrities have a duty to be role models.", "Parliamentary"],
    ["Lying is sometimes the right thing to do.", "Lincoln-Douglas"],
    ["Individuals have a moral duty to reduce their carbon footprint.", "Lincoln-Douglas"],
  ] },
  { heading: "Economics and Work", note: "Push debaters to weigh who pays and who benefits.", items: [
    ["The federal minimum wage should be raised to $15 an hour.", "Policy"],
    ["A four-day work week should become the standard.", "Public Forum"],
    ["Universal basic income would do more good than harm.", "Policy"],
    ["College athletes should be paid by their schools.", "Public Forum"],
    ["Tipping should be replaced by higher menu prices.", "Parliamentary"],
    ["Teenagers should be allowed to work more hours during the school year.", "Parliamentary"],
    ["Large tech companies should be broken up.", "Policy"],
    ["Plastic bags should be banned nationwide.", "Public Forum"],
    ["Unpaid internships should be illegal.", "Public Forum"],
    ["Cities should ban single-family-only zoning.", "Policy"],
  ] },
  { heading: "Environment, Health and Science", note: "Require at least one study or data set per speech.", items: [
    ["Nuclear power should replace coal in the energy mix.", "Policy"],
    ["Sugary drinks should carry a health tax.", "Public Forum"],
    ["Junk-food advertising aimed at teenagers should be banned.", "Public Forum"],
    ["Genetic engineering of human embryos to prevent disease should be legal.", "Lincoln-Douglas"],
    ["Space exploration is worth its cost.", "Parliamentary"],
    ["Fast fashion should be taxed to cover its environmental cost.", "Policy"],
    ["Organ donation should be opt-out rather than opt-in.", "Lincoln-Douglas"],
    ["Schools should serve only plant-based lunches one day a week.", "Parliamentary"],
    ["Electric cars should replace gas cars in new sales by 2035.", "Public Forum"],
    ["Daylight saving time should be abolished.", "Parliamentary"],
  ] },
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

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-3 text-[var(--text-primary)]">60 Debate Topics for High School Students</h2>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">Every resolution is phrased so either side can win with evidence. The tag shows the format it suits best: Public Forum (current events, 2v2), Lincoln-Douglas (values, 1v1), Policy (research-heavy plans) or parliamentary (limited prep).</p>
            <div className="mt-6 space-y-8">
              {HS_TOPICS.map((group) => (
                <div key={group.heading}>
                  <h3 className="text-lg font-semibold text-[var(--neon-cyan)]">{group.heading} Debate Topics</h3>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{group.note}</p>
                  <ol className="mt-3 space-y-2">
                    {group.items.map(([topic, format]) => (
                      <li key={topic} className="flex flex-wrap items-baseline gap-x-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        <span>{topic}</span>
                        <span className="rounded-full border border-white/10 px-2 text-[11px] text-[var(--text-muted)]">{format}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              High School Debate Topic Generator: How to Use It
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>High school debaters can handle what middle schoolers can’t: nuance, research, and topics with real stakes. Grades 9-12 debate best on questions where credible evidence exists on both sides — social media regulation, AI in education, criminal justice, climate policy, college admissions. The skill ceiling moves from ‘can you structure an argument’ to ‘can you weigh competing values.’</p>
              <p>This generator serves propositions with enough meat for evidence-based argument, each with pro and con starting points. For tournament formats (LD, Public Forum, Policy), use the deep filter and treat the talking points as case brainstorms, not cases. Related resources: <Link href="/topics/debate-topics-for-students" className="text-[var(--neon-cyan)] hover:underline">75 debate topics for students</Link>, <Link href="/topics/controversial-topics-to-discuss" className="text-[var(--neon-cyan)] hover:underline">controversial topics</Link> for advanced classes, and the <Link href="/debate/college" className="text-[var(--neon-cyan)] hover:underline">college-level generator</Link>.</p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Leveling Up Grade 9-12 Debates
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Require cited evidence.</strong> One source minimum per constructive speech. The debate about whose evidence is stronger is where the real learning happens.</li>
                <li><strong>Teach weighing.</strong> Great high school debates end with ‘even if my opponent is right about X, Y matters more because...’ — explicitly teach impact comparison.</li>
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
