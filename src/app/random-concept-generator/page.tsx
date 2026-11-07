import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import ConceptGenerator from "@/components/generators/ConceptGenerator";
import { CONCEPTS, conceptGenerator } from "@/lib/generators/concepts";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/random-concept-generator";
const TITLE = `Random Concept Generator — ${CONCEPTS.length} Concepts for Art, Stories & Games`;
const DESCRIPTION = `Free random concept generator: ${CONCEPTS.length} hand-written concepts for drawing, story writing, game design, inventions and abstract ideas, each with a "try this" prompt. Filter by type and get 10 random concepts per click.`;

const SOCIAL = generatorSocial({ card: "book-idea-generator", title: TITLE, description: DESCRIPTION, alt: "Random Concept Generator — art, story, game and product concepts" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random concept generator", "give me a random concept", "random concepts", "concept generator", "art concept generator", "story concept generator", "game concept generator", "abstract concept generator", "random concept ideas"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const EXAMPLES = [
  { label: "Art concepts", results: conceptGenerator.generate({ type: ["art"] }, 4, [], 71).results },
  { label: "Story concepts", results: conceptGenerator.generate({ type: ["story"] }, 4, [], 72).results },
  { label: "Game concepts", results: conceptGenerator.generate({ type: ["game"] }, 4, [], 73).results },
];

const FAQ = [
  {
    question: "What is a random concept generator?",
    answer: `It gives you a ready-made idea to start from when you don't know what to make. This one draws from ${CONCEPTS.length} hand-written concepts in five types (story, art, game design, product and abstract) and adds a short "try this" step to each one, so you can start right away.`,
  },
  {
    question: "Can it give me a random concept to draw?",
    answer: "Yes. Pick Art & drawing and you get scenes like \"a city built inside a teacup\" or \"a whale swimming through clouds\", each with one detail to include. Many artists use it for daily sketch practice or to break art block.",
  },
  {
    question: "What is an abstract concept?",
    answer: "An abstract concept is an idea you can't touch, like time, freedom, nostalgia or trust. Choose Abstract idea to get one with a concrete exercise, such as \"describe a smell that takes you back\" for nostalgia. They work well for poetry, art class and philosophy warm-ups.",
  },
  {
    question: "Are the concepts repeated?",
    answer: "No. Results don't repeat until you have seen every concept that matches your filters. Generate 10 at a time, copy the ones you like or share a link to the exact list.",
  },
  {
    question: "Can I use these for game jams or design class?",
    answer: "Yes. The game design concepts are small enough to build in a weekend, and the product concepts suit design thinking and invention lessons. For a jam theme in one or two words, try the random theme generator.",
  },
];

export default function RandomConceptGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Concept Generator"
      heading={["Random Concept", "Generator"]}
      intro={`Give me a random concept: get 10 at a time from ${CONCEPTS.length} hand-written ideas for art, stories, games, inventions and abstract themes — each with a "try this" prompt. Free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-08"
      faq={FAQ}
      inShort={
        <>
          A random concept generator gives you an idea to start creating. This one picks from {CONCEPTS.length} concepts in five types (story,
          art &amp; drawing, game design, product &amp; invention, abstract idea) and adds one concrete step to each, like &quot;draw it from above
          with tiny lit windows&quot;. Filter by type, get 10 per click, free and with no sign-up.
        </>
      }
      related={[
        { href: "/random-theme-generator", label: "Random theme generator" },
        { href: "/book-idea-generator", label: "Book idea generator" },
        { href: "/writing", label: "Random writing prompts" },
        { href: "/random-superpower-generator", label: "Random superpower generator" },
      ]}
      content={
        <>
          <SectionTitle>Concepts you can start on today</SectionTitle>
          <p>
            A single word (&quot;ocean&quot;) is a theme, not a concept. A <strong>random concept</strong> here is a specific situation or object with
            a twist, plus one next step, so the blank page problem is already solved. Every concept was written by hand; nothing is
            stitched together at random.
          </p>
          <SectionTitle>Five types of concept</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Story</strong> — a premise with a character and a problem, ready for a short story or a novel.</li>
            <li><strong>Art &amp; drawing</strong> — a scene or character to sketch, paint or render.</li>
            <li><strong>Game design</strong> — one core mechanic small enough for a game jam.</li>
            <li><strong>Product &amp; invention</strong> — an everyday problem and a product that solves it.</li>
            <li><strong>Abstract idea</strong> — a big idea like time or trust, with a concrete exercise.</li>
          </ul>
          <SectionTitle>Ways to use it</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Daily sketch:</strong> roll one art concept each morning and give yourself 20 minutes.</li>
            <li><strong>Writing class:</strong> give each student a different story concept, then swap halfway. More prompts are on the <Link prefetch={false} href="/writing" className={linkClass}>writing prompts</Link> page.</li>
            <li><strong>Game jam:</strong> combine one game concept with a theme from the <Link prefetch={false} href="/random-theme-generator" className={linkClass}>random theme generator</Link>.</li>
            <li><strong>Character building:</strong> add a power from the <Link prefetch={false} href="/random-superpower-generator" className={linkClass}>random superpower generator</Link> to any story concept.</li>
          </ul>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output from three filters:"} sets={EXAMPLES} />
        </>
      }
    >
      <ConceptGenerator />
    </GeneratorPageShell>
  );
}
