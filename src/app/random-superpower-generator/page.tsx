import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import SuperpowerGenerator from "@/components/generators/SuperpowerGenerator";
import { POWERS, superpowerGenerator } from "@/lib/generators/superpower";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/random-superpower-generator";
const TITLE = `Random Superpower Generator — ${POWERS.length} Powers with Weaknesses & Power Levels`;
const DESCRIPTION = `Free random superpower generator: ${POWERS.length} superpowers, each explained in plain words, with a power level and a random weakness. Filter by elemental, mind, body, cosmic or weird & funny powers. Get 10 per click for characters, stories and games.`;

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "Random Superpower Generator — powers, levels and weaknesses" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random superpower generator", "superpower generator", "superpower generator with weaknesses", "random superpower", "superpower ideas", "superpower wheel", "superhero power generator", "funny superpowers", "superpowers and weaknesses"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "World-level powers", results: superpowerGenerator.generate({ tier: ["world"] }, 4, [], 61).results },
  { label: "Mind powers", results: superpowerGenerator.generate({ category: ["mind"] }, 4, [], 62).results },
  { label: "Weird & funny powers", results: superpowerGenerator.generate({ category: ["weird"] }, 4, [], 63).results },
];

const FAQ = [
  {
    question: "How does the random superpower generator work?",
    answer:
      `It draws from ${POWERS.length} hand-written powers in five categories. Each result tells you what the power actually lets you do, how strong it is (street, city or world level) and, if you leave weaknesses on, one random limitation. Results don't repeat until you have seen every power that matches your filters.`,
  },
  {
    question: "What is the best superpower?",
    answer:
      "It depends on the rules of your story or game. World-level powers like time stop, teleportation and reality warping are the most powerful, but a good weakness makes even a small power interesting. Many people pick healing factor or teleportation as the most useful in everyday life.",
  },
  {
    question: "Why add a weakness?",
    answer:
      "A weakness creates tension. A hero who can stop time but loses a memory each time has to choose when it is worth it. Weaknesses are drawn at random from a separate list, so the same power can play very differently each time. Turn them off if you only want the power.",
  },
  {
    question: "What are the power levels?",
    answer:
      "Street level powers help one person in a fight or a tough day (danger sense, wall crawling). City level powers can change a battle or save a building (telekinesis, flight). World level powers can change history (time travel, mind control, gravity control).",
  },
  {
    question: "Are there funny superpowers?",
    answer:
      "Yes. The Weird & funny category has 20 small, oddly specific powers, like always finding a parking space, perfect toast or being a cat magnet. They work well for party games, icebreakers and comedy characters.",
  },
  {
    question: "Can I use this for writing prompts or games?",
    answer:
      "Yes. Writers use it to build heroes and villains, teachers use it for creative writing, and friends use it for \"would you rather\" rounds: generate two powers each and argue who wins. You can copy one result or the whole list.",
  },
];

export default function RandomSuperpowerGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Superpower Generator"
      heading={["Random Superpower", "Generator"]}
      intro={`A superpower generator that gives you a random superpower from ${POWERS.length}, each with what it does, a power level and a weakness. Filter by category, then generate 10 at a time — free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A random superpower generator picks a superpower for you. This one gives 10 at a time from {POWERS.length} powers in five
          categories (elemental, mind, body, cosmic, weird &amp; funny), explains each in one line, rates it street, city or world level and
          can add a random weakness, like &quot;only works in the dark&quot;. Free, no sign-up.
        </>
      }
      related={[
        { href: "/fantasy-name-generator", label: "Fantasy name generator" },
        { href: "/username-generator", label: "Username generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/wizard-name-generator", label: "Wizard name generator" },
      ]}
      content={
        <>
          <SectionTitle>Superpowers you can actually use</SectionTitle>
          <p>
            A power name alone (&quot;Electrokinesis!&quot;) leaves the hard part to you. Each <strong>random superpower</strong> here comes
            with a plain description of what it does, a power level so you know how it compares, and an optional weakness that makes it
            interesting. That is everything you need for a hero, a villain or a sidekick.
          </p>
          <SectionTitle>Five categories of power</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Elemental</strong> — fire, ice, water, lightning, metal and weather.</li>
            <li><strong>Mind</strong> — telepathy, telekinesis, precognition, memory and illusions.</li>
            <li><strong>Body</strong> — strength, speed, healing, flight, invisibility and shape-shifting.</li>
            <li><strong>Cosmic</strong> — teleportation, time, gravity, portals and reality itself.</li>
            <li><strong>Weird &amp; funny</strong> — tiny, oddly specific powers like perfect toast and parking luck.</li>
          </ul>
          <SectionTitle>Ways to play with it</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Make a hero:</strong> roll one city-level power with a weakness, then give them a name with the <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link>.</li>
            <li><strong>Superpower battle:</strong> each player rolls three powers and picks one; the group votes on who would win.</li>
            <li><strong>Writing prompt:</strong> roll a weird power and write a scene where it saves the day.</li>
            <li><strong>Fantasy crossover:</strong> give a power to a mage from the <Link prefetch={false} href="/fantasy-name-generator" className={linkClass}>fantasy name generator</Link>, or turn it into a gamer tag with the <Link prefetch={false} href="/username-generator" className={linkClass}>username generator</Link>.</li>
          </ul>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output from three filters:"} sets={EXAMPLES} />
        </>
      }
    >
      <SuperpowerGenerator />
    </GeneratorPageShell>
  );
}
