import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import HistoricalEventGenerator from "@/components/generators/HistoricalEventGenerator";
import { HISTORICAL_EVENTS, historicalEventGenerator } from "@/lib/generators/historicalEvents";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/random-historical-event-generator";
const TITLE = `Random Historical Event Generator — ${HISTORICAL_EVENTS.length} Events with Dates`;
const DESCRIPTION = `Free random historical event generator: ${HISTORICAL_EVENTS.length} well-known events from ancient times to today, each with its date, region and why it matters. Filter by era or region for history topics, quizzes and research.`;

const SOCIAL = generatorSocial({ card: "random-country-generator", title: TITLE, description: DESCRIPTION, alt: "Random Historical Event Generator — events with dates" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random historical event generator", "random history generator", "random historical event", "history generator", "random event in history", "random history topic", "random historical events", "history topic generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const EXAMPLES = [
  { label: "Ancient history", results: historicalEventGenerator.generate({ era: ["ancient"] }, 4, [], 81).results },
  { label: "The 1900s", results: historicalEventGenerator.generate({ era: ["1900s"] }, 4, [], 82).results },
  { label: "Africa", results: historicalEventGenerator.generate({ where: ["africa"] }, 4, [], 83).results },
];

const FAQ = [
  {
    question: "How does the random historical event generator work?",
    answer: `It picks from ${HISTORICAL_EVENTS.length} well-known events, from the Great Pyramid (c. 2560 BCE) to 2023. Each result shows the date, the region and one line on why the event matters. Filter by era or region; events don't repeat until you have seen every match.`,
  },
  {
    question: "Are the dates accurate?",
    answer: "We only include events with widely agreed dates. \"c.\" (circa) marks dates that are approximate or traditional, such as the founding of Rome. Always check a source such as an encyclopedia before citing a date in schoolwork.",
  },
  {
    question: "How can teachers use it?",
    answer: "Use it for a quick \"guess the year\" warm-up (read the event, students guess the century), for picking research topics fairly, or for a timeline game where students put five random events in order.",
  },
  {
    question: "Can I get events from one part of the world?",
    answer: "Yes. Filter by Europe, Asia, the Americas, Africa, the Middle East or worldwide events like the Moon landing. You can combine a region with an era, for example Asia in the 1800s.",
  },
  {
    question: "Where can I find more history topics?",
    answer: "For essay and discussion topics about history, see the history category page. For a research question, try the research topic generator.",
  },
];

export default function RandomHistoricalEventGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Historical Event Generator"
      heading={["Random Historical Event", "Generator"]}
      intro={`Get a random event in history with its date, region and why it matters — ${HISTORICAL_EVENTS.length} well-known events from ancient Egypt to 2023. Filter by era or region. Free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-08"
      faq={FAQ}
      inShort={
        <>
          A random historical event generator picks an event from history for you. This one draws from {HISTORICAL_EVENTS.length} well-known
          events with agreed dates, from ancient times to the 2000s, and shows the year, the region and a one-line reason it matters. Filter
          by six eras and six regions; get 10 per click.
        </>
      }
      related={[
        { href: "/categories/history", label: "History topics" },
        { href: "/research-topic-generator", label: "Research topic generator" },
        { href: "/random-country-generator", label: "Random country generator" },
        { href: "/trivia-questions", label: "Trivia questions" },
      ]}
      content={
        <>
          <SectionTitle>Real events, with dates you can trust</SectionTitle>
          <p>
            Every <strong>random historical event</strong> on this page is a well-known moment that textbooks agree on. We skip disputed dates
            and add &quot;c.&quot; where historians only know the approximate year, so you can use the results in class without spreading
            mistakes.
          </p>
          <SectionTitle>Six eras</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Ancient (before 500)</strong> — pyramids, Greece, Rome, Qin China.</li>
            <li><strong>Medieval (500–1499)</strong> — Vikings, crusades, the Mongols, Mali, the printing press.</li>
            <li><strong>1500–1799</strong> — the Reformation, science, the American and French revolutions.</li>
            <li><strong>1800s</strong> — industry, empires, abolition and invention.</li>
            <li><strong>1900s</strong> — two world wars, independence movements, the space race.</li>
            <li><strong>2000s</strong> — the internet age, pandemics and space telescopes.</li>
          </ul>
          <SectionTitle>Classroom games</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Timeline race:</strong> generate 5 events, hide the dates and have teams put them in order.</li>
            <li><strong>Guess the century:</strong> read the event name and give a point for the right century.</li>
            <li><strong>Research pick:</strong> each student gets one event to present; for deeper questions, use the <Link prefetch={false} href="/research-topic-generator" className={linkClass}>research topic generator</Link>.</li>
            <li><strong>Debate:</strong> pair an event with a prompt from the <Link prefetch={false} href="/categories/history" className={linkClass}>history topics</Link> page.</li>
          </ul>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output from three filters:"} sets={EXAMPLES} />
        </>
      }
    >
      <HistoricalEventGenerator />
    </GeneratorPageShell>
  );
}
