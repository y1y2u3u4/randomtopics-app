import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100+ Group Discussion (GD) Topics for 2026 — With Prep Tips",
  description:
    "100+ group discussion topics organized by theme — current affairs, technology & AI, business, education, environment and abstract GD topics. For placement interviews, MBA admissions, classrooms and clubs.",
  keywords: [
    "group discussion topics",
    "gd topics",
    "topics for group discussion",
    "common gd topics",
    "gd topics for placements",
    "group discussion topics for students",
    "abstract gd topics",
    "current gd topics 2026",
  ],
  alternates: { canonical: "/group-discussion-topics" },
};

const TOPIC_SECTIONS: {
  theme: string;
  emoji: string;
  intro: string;
  href: string;
  topics: string[];
}[] = [
  {
    theme: "Current Affairs & Society",
    emoji: "🌐",
    intro:
      "The staple of placement and MBA GD rounds — assessors want awareness plus balance, not hot takes.",
    href: "/categories/politics",
    topics: [
      "Is social media strengthening or weakening democracy?",
      "Should voting be made compulsory?",
      "Work from home vs. return to office: what should the future workplace look like?",
      "Is cancel culture accountability or mob justice?",
      "Should governments regulate influencer marketing?",
      "Urbanization: engine of growth or crisis in the making?",
      "Is a cashless economy realistic for developing nations?",
      "Should the retirement age be raised as lifespans increase?",
      "Universal basic income: safety net or disincentive to work?",
      "Is nationalism helping or hurting global cooperation?",
      "Brain drain: should countries try to stop talent migration?",
      "Should healthcare be fully public, fully private, or hybrid?",
      "Is the 70-hour work week debate about productivity or exploitation?",
    ],
  },
  {
    theme: "Technology & AI",
    emoji: "🤖",
    intro:
      "The most-asked GD territory in 2026 — every panel wants to know if you can reason about AI beyond the headlines.",
    href: "/categories/technology",
    topics: [
      "Will AI create more jobs than it destroys?",
      "Should AI-generated content require mandatory labeling?",
      "ChatGPT in education: learning tool or shortcut to ignorance?",
      "Is data the new oil — and who should own it?",
      "Should social media platforms verify every user's identity?",
      "Automation and the future of blue-collar work.",
      "Is remote work technology making us more productive or more isolated?",
      "Digital privacy vs. national security: where's the line?",
      "Should there be a global regulator for artificial intelligence?",
      "Cryptocurrency: financial revolution or speculative bubble?",
      "Is the metaverse a real future or an expensive detour?",
      "Screen time in childhood: whose responsibility — parents, schools, or platforms?",
      "Electric vehicles: are we solving emissions or relocating them?",
    ],
  },
  {
    theme: "Business & Economy",
    emoji: "💼",
    intro:
      "B-school favorites — structure your points around stakeholders: firms, workers, consumers, government.",
    href: "/categories/business",
    topics: [
      "Startups vs. stable jobs: what should graduates choose?",
      "Is the gig economy empowering workers or exploiting them?",
      "Should CEO pay be capped relative to worker pay?",
      "Are unicorn valuations a sign of innovation or irrational exuberance?",
      "Family businesses vs. professional management: which scales better?",
      "Is advertising manipulating consumers or informing them?",
      "Should companies be forced to disclose their carbon footprint?",
      "Four-day work week: productivity breakthrough or luxury for the few?",
      "Globalization in reverse: is protectionism the new normal?",
      "Do loyalty programs actually create loyalty?",
      "Is 'quiet quitting' a worker problem or a management problem?",
      "Should internships always be paid?",
      "Small businesses vs. e-commerce giants: can both survive?",
    ],
  },
  {
    theme: "Education & Career",
    emoji: "🎓",
    intro:
      "Every participant has standing here — differentiation comes from evidence and structure, not passion.",
    href: "/categories/education",
    topics: [
      "Are degrees still worth it in the age of online learning?",
      "Marks vs. skills: what should hiring actually measure?",
      "Should coding be compulsory in school?",
      "Exams: necessary evil or outdated filter?",
      "Is coaching culture helping students or replacing real learning?",
      "Should universities teach entrepreneurship — can it even be taught?",
      "English-medium education: opportunity or erosion of local languages?",
      "Are extracurriculars as important as academics?",
      "Should attendance be mandatory in college?",
      "Reservation/affirmative action in education: leveling the field or lowering the bar?",
      "Is studying abroad overrated?",
      "AI tutors vs. human teachers: what's irreplaceable?",
      "Should schools grade students on emotional intelligence?",
    ],
  },
  {
    theme: "Environment & Sustainability",
    emoji: "🌱",
    intro:
      "Panels reward trade-off thinking here: development vs. conservation, present vs. future, local vs. global.",
    href: "/categories/nature",
    topics: [
      "Development vs. environment: is the conflict real or manufactured?",
      "Should plastic be banned outright or taxed heavily?",
      "Climate change: whose responsibility — individuals, corporations, or governments?",
      "Is nuclear energy the answer to the climate crisis?",
      "Should wealthy nations pay climate reparations?",
      "Electric vehicles in developing countries: leap forward or premature push?",
      "Fast fashion: can consumer choices actually change an industry?",
      "Is eco-tourism protecting nature or commercializing it?",
      "Water scarcity: the next global conflict trigger?",
      "Should environmental studies be compulsory in every degree?",
      "Green jobs vs. traditional industry jobs: managing the transition.",
      "Are climate summits producing action or just statements?",
    ],
  },
  {
    theme: "Abstract & Creative",
    emoji: "🧩",
    intro:
      "Abstract GD topics test structure under ambiguity — define the phrase, pick 2-3 lenses, and land a view.",
    href: "/categories/philosophy",
    topics: [
      "The best mirror is an old friend.",
      "Blue is better than red.",
      "Empty vessels make the most noise.",
      "A ship in harbor is safe, but that is not what ships are built for.",
      "The map is not the territory.",
      "Perfection is the enemy of progress.",
      "Silence is an argument.",
      "Zero: the most powerful number.",
      "Walls have ears, but do they listen?",
      "The middle of the ladder is the most crowded.",
      "Old keys don't open new doors.",
      "Speed thrills but kills.",
      "When the winds of change blow, some build walls, others build windmills.",
    ],
  },
  {
    theme: "Classroom & Club Discussions",
    emoji: "🗣️",
    intro:
      "Lower-stakes topics for teachers, ESL classes, and discussion clubs — everyone can contribute from experience.",
    href: "/categories/education",
    topics: [
      "Should homework be replaced with project work?",
      "Is it better to be a specialist or a generalist?",
      "Do movies based on books ever do them justice?",
      "Should school canteens be required to serve only healthy food?",
      "Is competition among friends healthy?",
      "Are heroes born or made?",
      "Should mobile phones be allowed in classrooms?",
      "Is it better to travel widely or read widely?",
      "Do uniforms create equality or erase individuality?",
      "Should every student learn a musical instrument?",
      "Is failure a better teacher than success?",
      "Can money buy happiness — and where does the research actually land?",
      "Should homework exist on weekends?",
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "What is a group discussion (GD)?",
    answer:
      "A group discussion is a structured conversation where 6-12 participants discuss a given topic for 10-20 minutes while assessors observe. GDs are standard in campus placements, MBA admissions, and civil service selection because they reveal skills a resume can't: communication, reasoning, listening, and the ability to disagree without derailing. There are no winners — panels select multiple strong participants.",
  },
  {
    question: "What are the most common GD topics?",
    answer:
      "GD topics fall into four families: current affairs (social media and democracy, remote work), knowledge-based (AI and jobs, the gig economy), opinion-based (marks vs. skills, money and happiness), and abstract (single phrases like 'Blue is better than red' that test structured thinking under ambiguity). Panels increasingly favor technology and AI topics — prepare at least three.",
  },
  {
    question: "How do I start a group discussion?",
    answer:
      "Open with a frame, not a position: define the topic in one sentence, name the two or three angles the group should cover, and offer your first point with one piece of evidence. Starting well earns visibility, but only if you add substance — a weak, generic opening ('This is a very important topic...') costs more than speaking third with a sharp point.",
  },
  {
    question: "How are group discussions evaluated?",
    answer:
      "Panels typically score four things: content (facts, examples, fresh angles), communication (clarity and concision, not volume), group behavior (building on others' points, bringing quiet members in, disagreeing respectfully), and leadership (structuring the discussion, summarizing, managing time). Interrupting aggressively or monopolizing time loses more marks than staying quiet.",
  },
  {
    question: "How should I handle abstract GD topics?",
    answer:
      "Use the define-lens-land method: define what the phrase could mean (literal and metaphorical), pick two or three lenses (personal, business, societal), and land a clear point of view with an example for each lens. Abstract topics like 'Old keys don't open new doors' aren't about the right answer — they test whether you can build structure where none is given.",
  },
];

export default function GroupDiscussionTopicsPage() {
  let counter = 0;
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Group Discussion Topics" },
          ]}
        />

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
          <h1
            className="text-3xl sm:text-5xl font-bold mb-4 text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            100+ Group Discussion <span className="gradient-text">Topics</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto">
            GD topics for placement rounds, MBA admissions, classrooms and clubs — organized by theme,
            current for 2026, with prep guidance from panel scoring criteria.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link href="/debate" className="btn-generate inline-flex items-center gap-2 text-sm px-6 py-3">
              <span>🎲</span> Random Debate Topic Generator
            </Link>
            <Link
              href="/conversation"
              className="inline-flex items-center gap-2 text-sm px-6 py-3 rounded-lg border border-[rgba(255,255,255,0.1)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-all"
            >
              💬 Conversation Topics
            </Link>
          </div>
        </section>

        {/* Quick nav */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {TOPIC_SECTIONS.map((s) => (
              <a
                key={s.theme}
                href={`#${s.theme.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="text-xs px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] text-[var(--text-muted)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-all"
              >
                {s.emoji} {s.theme}
              </a>
            ))}
          </div>
        </section>

        {/* Topics by theme */}
        {TOPIC_SECTIONS.map((section) => {
          const startAt = counter;
          counter += section.topics.length;
          return (
            <section
              key={section.theme}
              id={section.theme.toLowerCase().replace(/[^a-z]+/g, "-")}
              className="max-w-3xl mx-auto px-4 sm:px-6 pb-8"
            >
              <div className="glass-card p-8 sm:p-10">
                <h2
                  className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {section.emoji} GD Topics: {section.theme}
                </h2>
                <p className="text-[var(--text-muted)] text-sm mb-5">{section.intro}</p>
                <ol className="space-y-3">
                  {section.topics.map((topic, i) => (
                    <li key={topic} className="flex gap-3 items-start text-sm text-[var(--text-secondary)] leading-relaxed">
                      <span className="text-[var(--neon-cyan)] font-bold shrink-0">{startAt + i + 1}.</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-[var(--text-muted)] mt-5">
                  Want more angles?{" "}
                  <Link href={section.href} className="text-[var(--neon-cyan)] hover:underline">
                    Browse {section.theme.toLowerCase()} topics
                  </Link>{" "}
                  or practice both sides with the{" "}
                  <Link href="/debate" className="text-[var(--neon-cyan)] hover:underline">
                    debate generator
                  </Link>.
                </p>
              </div>
            </section>
          );
        })}

        {/* SEO content + FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              How to Prepare for a Group Discussion
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                A <strong>group discussion</strong> is won on structure and behavior, not volume.
                Panels score content, communication, group behavior, and leadership — which means
                the person who builds on others&apos; points and summarizes at the right moment
                usually outscores the person who spoke the most. Practice with a timer: pick a
                topic above, take two minutes to frame three points, then argue them aloud.
              </p>
              <p>
                Sharpen the underlying skills with our tools: the{" "}
                <Link href="/debate" className="text-[var(--neon-cyan)] hover:underline">debate topic generator</Link>{" "}
                gives you two-sided practice with pro/con talking points, the{" "}
                <Link href="/speech/persuasive" className="text-[var(--neon-cyan)] hover:underline">persuasive speech topics</Link>{" "}
                bank trains you to land a position, and the{" "}
                <Link href="/impromptu-speech-topics" className="text-[var(--neon-cyan)] hover:underline">impromptu speech tool</Link>{" "}
                adds the time pressure of a real GD round. For quieter practice groups, start with{" "}
                <Link href="/topics/controversial-topics-to-discuss" className="text-[var(--neon-cyan)] hover:underline">controversial topics to discuss</Link>.
              </p>

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
