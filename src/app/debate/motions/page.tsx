import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100+ Debate Motions — This House Would… (BP & Parliamentary Format)",
  description:
    "100+ ready-to-run debate motions in This House Would format, organized by theme — politics, technology, ethics, education, economics, environment and more. Free motions bank for BP, parliamentary and club debate.",
  keywords: [
    "debate motions",
    "debate motion",
    "this house would motions",
    "this house believes motions",
    "parliamentary debate motions",
    "bp debate motions",
    "debate motions list",
    "debate motion generator",
  ],
  alternates: { canonical: "/debate/motions" },
};

// Hand-written motions bank. Each theme maps to a category page for internal links.
const MOTION_SECTIONS: {
  theme: string;
  emoji: string;
  intro: string;
  href: string;
  motions: string[];
}[] = [
  {
    theme: "Politics & Governance",
    emoji: "🏛️",
    intro:
      "Classic parliamentary territory: state power, rights, and democratic design. These run well at every level from club nights to BP finals.",
    href: "/categories/politics",
    motions: [
      "This House would make voting compulsory.",
      "This House would lower the voting age to 16.",
      "This House would impose term limits on all elected offices.",
      "This House believes that referendums do more harm than good.",
      "This House would abolish the electoral college.",
      "This House would ban private donations to political campaigns.",
      "This House believes that career politicians should be replaced by citizen assemblies chosen by lot.",
      "This House would require politicians to pass a policy literacy exam before taking office.",
      "This House believes that small states should form political unions to survive great-power competition.",
      "This House would grant cities independence from their national governments.",
      "This House believes that the international community should recognize governments based on democratic legitimacy, not effective control.",
      "This House would make lying in political advertising a criminal offence.",
      "This House believes that open borders would do more good than harm.",
    ],
  },
  {
    theme: "Technology & AI",
    emoji: "💻",
    intro:
      "The fastest-moving motion territory in modern debate — AI, platforms, and privacy motions reward debaters who keep up with the news cycle.",
    href: "/categories/technology",
    motions: [
      "This House would ban targeted political advertising on social media.",
      "This House believes that AI development should be paused until safety standards are established.",
      "This House would hold social media companies legally liable for harms caused by their algorithms.",
      "This House would ban smartphones for children under 14.",
      "This House believes that AI-generated art should not be eligible for copyright.",
      "This House would require all AI-generated content to carry a visible label.",
      "This House would nationalize the leading artificial intelligence laboratories.",
      "This House believes that anonymity online does more harm than good.",
      "This House would ban facial recognition technology in public spaces.",
      "This House believes that Big Tech companies should be broken up.",
      "This House would grant workers the legal right to disconnect after working hours.",
      "This House believes that the gig economy exploits more than it empowers.",
      "This House would replace human drivers with autonomous vehicles as soon as they are statistically safer.",
    ],
  },
  {
    theme: "Ethics & Philosophy",
    emoji: "🤔",
    intro:
      "Principle-heavy motions where the burden falls on frameworks rather than facts — ideal for teaching weighing and clash.",
    href: "/categories/philosophy",
    motions: [
      "This House believes that it is morally wrong to eat meat.",
      "This House would legalize assisted dying for the terminally ill.",
      "This House believes that individuals in wealthy nations have a moral duty to give away surplus income.",
      "This House would allow parents to genetically enhance their children.",
      "This House believes that punishment should aim at rehabilitation, never retribution.",
      "This House would abolish the insanity defence.",
      "This House believes that lying to protect someone's feelings is morally justified.",
      "This House would legalize the sale of human organs.",
      "This House believes that humans have a moral obligation to become vegetarian as lab-grown meat becomes viable.",
      "This House regrets the glorification of forgiveness.",
      "This House believes that no belief deserves protection from ridicule.",
      "This House would judge historical figures by the moral standards of their own time.",
      "This House believes that a life of comfortable illusion is preferable to a life of painful truth.",
    ],
  },
  {
    theme: "Education",
    emoji: "📚",
    intro:
      "Schools motions are the backbone of student debate — everyone has standing, and the clash is concrete.",
    href: "/categories/education",
    motions: [
      "This House would abolish standardized testing.",
      "This House would ban homework in primary schools.",
      "This House believes that university education should be free.",
      "This House would make financial literacy a compulsory school subject.",
      "This House would abolish private schools.",
      "This House believes that grades do more harm than good.",
      "This House would allow students to use AI tools in all assignments.",
      "This House would replace lectures with project-based learning.",
      "This House believes that gap years should be the default before university.",
      "This House would pay students to attend school.",
      "This House would teach coding before foreign languages.",
      "This House believes that elite universities should admit students by lottery among qualified applicants.",
      "This House would make debate a compulsory subject in secondary school.",
    ],
  },
  {
    theme: "Economics & Work",
    emoji: "💼",
    intro:
      "Money motions demand mechanisms: who pays, who benefits, and what breaks. Great for training analytical depth.",
    href: "/categories/business",
    motions: [
      "This House would introduce a universal basic income.",
      "This House would implement a four-day working week.",
      "This House believes that billionaires should not exist.",
      "This House would cap CEO pay at a fixed multiple of the median worker's salary.",
      "This House would abolish inheritance beyond a modest threshold.",
      "This House believes that economic growth should no longer be the primary goal of policy.",
      "This House would ban unpaid internships.",
      "This House believes that automation should be taxed to fund worker retraining.",
      "This House would give employees seats on corporate boards.",
      "This House believes that remote work has done more good than harm.",
      "This House would forgive all student loan debt.",
      "This House believes that advertising does more harm than good.",
      "This House would nationalize public utilities.",
    ],
  },
  {
    theme: "Environment & Climate",
    emoji: "🌿",
    intro:
      "High-stakes trade-off motions — climate debates force teams to weigh present costs against future harms.",
    href: "/categories/nature",
    motions: [
      "This House would ban short-haul flights where rail alternatives exist.",
      "This House believes that nuclear power is essential to fighting climate change.",
      "This House would grant legal personhood to rivers and forests.",
      "This House would make ecocide an international crime.",
      "This House believes that climate activism should prioritize disruption over persuasion.",
      "This House would ban the advertising of fossil fuel products.",
      "This House believes that wealthy nations should pay climate reparations to developing nations.",
      "This House would ration meat consumption.",
      "This House believes that geoengineering research does more harm than good.",
      "This House would ban single-use plastics entirely.",
      "This House believes that economic degrowth is the only honest climate policy.",
      "This House would prioritize climate adaptation over emissions reduction.",
      "This House believes that individual carbon footprints are a distraction from corporate responsibility.",
    ],
  },
  {
    theme: "Science & Health",
    emoji: "🔬",
    intro:
      "Evidence-forward motions where scientific literacy wins rounds — vaccines, space, and public health.",
    href: "/categories/science",
    motions: [
      "This House would make vaccination compulsory.",
      "This House believes that space exploration is worth the cost.",
      "This House would legalize all recreational drugs.",
      "This House would ban tobacco sales to anyone born after 2010.",
      "This House believes that healthcare should be entirely free at the point of use.",
      "This House would allow human gene editing for disease prevention.",
      "This House believes that sugar should be taxed like tobacco.",
      "This House would make organ donation opt-out rather than opt-in.",
      "This House believes that private space companies do more good than national space agencies.",
      "This House would ban cosmetic surgery advertising.",
      "This House believes that mental health days should be a legal right for workers and students.",
      "This House would fund life extension research over disease research.",
      "This House believes that professional sport does more harm than good to public health culture.",
    ],
  },
  {
    theme: "Fun & Accessible",
    emoji: "🤪",
    intro:
      "Low-stakes motions for icebreakers, novice nights, and ending practice with a laugh — the clash is real even when the topic is silly.",
    href: "/categories/weird-fun",
    motions: [
      "This House believes that pineapple belongs on pizza.",
      "This House would rather be a superhero with a useless power than have no power at all.",
      "This House believes that cats are better companions than dogs.",
      "This House would ban reply-all in workplace email.",
      "This House believes that breakfast food should be acceptable at every meal.",
      "This House would rather fight one horse-sized duck than a hundred duck-sized horses.",
      "This House believes that board games are better than video games.",
      "This House would make daylight saving time permanent.",
      "This House believes that the book is always better than the movie.",
      "This House would ban spoilers for one year after a show's release.",
      "This House believes that hot dogs are sandwiches.",
      "This House would require all meetings to be walking meetings.",
      "This House believes that karaoke is the highest form of courage.",
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "What is a debate motion?",
    answer:
      "A debate motion is the formal proposition a debate is fought over — the statement one side must defend and the other must oppose. In parliamentary formats it is traditionally phrased as 'This House would...' (a policy action) or 'This House believes that...' (a value judgement). A good motion is balanced, precise, and gives both sides genuine ground to argue.",
  },
  {
    question: "What do 'This House would' and 'This House believes that' mean?",
    answer:
      "'This House' refers to the debating chamber itself, echoing the language of the British Parliament. 'This House would...' (THW) proposes an action or policy, so the debate is about consequences and implementation. 'This House believes that...' (THBT) asserts a value or judgement, so the debate is about principles. 'This House regrets...' (THR) asks whether something that already happened made the world worse.",
  },
  {
    question: "How do I choose a good debate motion?",
    answer:
      "Test it three ways. Balance: could a strong team happily take either side? Clarity: is there exactly one reasonable interpretation of what the motion demands? Depth: does it sustain 30-60 minutes of clash without running dry? If a motion fails any test, tighten the wording or add context. For beginners, choose motions about everyday experience; save dense policy motions for experienced teams.",
  },
  {
    question: "What are the standard debate motion formats?",
    answer:
      "British Parliamentary (BP/WUDC) uses four teams of two with 15-minute prep and unseen motions. World Schools mixes prepared and impromptu motions with teams of three. Public Forum and Policy debate use a single resolution for a whole tournament cycle. The motions on this page work for all of them — for prepared formats, give teams the motion in advance; for impromptu practice, draw one at random.",
  },
  {
    question: "Can I generate random debate motions?",
    answer:
      "Yes — our debate topic generator works as a random motion generator: every result is a two-sided proposition you can read as a motion directly or flip into This-House wording. Generate ten at once to build a motions bank for a tournament, or use random draws in practice so neither side can prepare in advance.",
  },
];

export default function DebateMotionsPage() {
  let counter = 0;
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Debate Topics", href: "/debate" },
            { label: "Debate Motions" },
          ]}
        />

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
          <h1
            className="text-3xl sm:text-5xl font-bold mb-4 text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            100+ Debate <span className="gradient-text">Motions</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto">
            A ready-to-run motions bank in This House Would format — organized by theme, balanced for
            real clash, and suitable for BP, parliamentary, World Schools, and club debate.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link href="/debate" className="btn-generate inline-flex items-center gap-2 text-sm px-6 py-3">
              <span>🎲</span> Random Motion Generator
            </Link>
            <Link
              href="/debate/questions"
              className="inline-flex items-center gap-2 text-sm px-6 py-3 rounded-lg border border-[rgba(255,255,255,0.1)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-all"
            >
              💬 Debate Question Generator
            </Link>
          </div>
        </section>

        {/* Quick nav */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {MOTION_SECTIONS.map((s) => (
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

        {/* Motions by theme */}
        {MOTION_SECTIONS.map((section) => {
          const startAt = counter;
          counter += section.motions.length;
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
                  {section.emoji} {section.theme} Motions
                </h2>
                <p className="text-[var(--text-muted)] text-sm mb-5">{section.intro}</p>
                <ol className="space-y-3">
                  {section.motions.map((motion, i) => (
                    <li key={motion} className="flex gap-3 items-start text-sm text-[var(--text-secondary)] leading-relaxed">
                      <span className="text-[var(--neon-cyan)] font-bold shrink-0">{startAt + i + 1}.</span>
                      <span>{motion}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-[var(--text-muted)] mt-5">
                  Want more like these?{" "}
                  <Link href={section.href} className="text-[var(--neon-cyan)] hover:underline">
                    Browse {section.theme.toLowerCase()} topics
                  </Link>{" "}
                  or spin the{" "}
                  <Link href="/debate" className="text-[var(--neon-cyan)] hover:underline">
                    debate generator
                  </Link>{" "}
                  filtered to this category.
                </p>
              </div>
            </section>
          );
        })}

        {/* SEO content + FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              How to Use This Motions Bank
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Every <strong>debate motion</strong> above passes the three tests coaches actually care
                about: both sides have genuine ground, the wording has one reasonable interpretation, and
                the clash sustains a full round. Themes map to skill levels — start novices on the fun and
                education motions, move to technology and economics as teams learn mechanisms, and save
                the philosophy motions for training weighing and framework debates.
              </p>
              <p>
                For impromptu practice, do not pick — draw. Random selection is the point: it forces
                debaters to build cases from scratch under time pressure, exactly like a real round. Our{" "}
                <Link href="/debate" className="text-[var(--neon-cyan)] hover:underline">debate topic generator</Link>{" "}
                deals random propositions with pro/con talking points, the{" "}
                <Link href="/debate/questions" className="text-[var(--neon-cyan)] hover:underline">question generator</Link>{" "}
                phrases them as direct questions, and the{" "}
                <Link href="/argument-generator" className="text-[var(--neon-cyan)] hover:underline">argument generator</Link>{" "}
                helps build out full cases. Teaching a class? The{" "}
                <Link href="/debate/students" className="text-[var(--neon-cyan)] hover:underline">student debate generator</Link>{" "}
                keeps motions age-appropriate.
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
