import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FantasyWorldGenerator from "@/components/generators/FantasyWorldGenerator";
import { WORLD_NAMES, worldGenerator } from "@/lib/generators/fantasyWorld";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/fantasy-world-generator";
const TITLE = `Fantasy World Generator — Full World Ideas with Magic, Factions & Story Hooks`;
const DESCRIPTION = `Free fantasy world generator: ${WORLD_NAMES.length} world names with meanings, plus land, climate, a magic system with a cost, a central conflict, two factions, a wonder and a story hook. Choose the tone and the size. 10 worlds per click, no sign-up.`;

const SOCIAL = generatorSocial({ card: "fantasy-name-generator", title: TITLE, description: DESCRIPTION, alt: "Fantasy World Generator — world name, magic, factions and story hook" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["fantasy world generator", "fantasy world builder", "world building generator", "random fantasy world", "fantasy setting generator", "magic system generator", "dnd world generator", "worldbuilding ideas"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const EXAMPLES = [
  { label: "Dark fantasy", results: worldGenerator.generate({ genre: ["dark"] }, 1, [], 31).results },
  { label: "Steampunk archipelago", results: worldGenerator.generate({ genre: ["steam"], size: ["archipelago"] }, 1, [], 32).results },
  { label: "Whimsical kingdom", results: worldGenerator.generate({ genre: ["whimsy"], size: ["kingdom"] }, 1, [], 33).results },
];

const FAQ = [
  {
    question: "What does the fantasy world generator give me?",
    answer:
      "Every result is a starter kit for a whole setting: a world name with its meaning, the shape of the land, the climate, a magic system with both a source and a cost, one big conflict, two factions, one strange wonder and a hook for a first story or session.",
  },
  {
    question: "Can I use these worlds for D&D or other tabletop games?",
    answer:
      "Yes. They are system-neutral, so the magic source and the cost can be translated into any ruleset. Treat the conflict and the factions as the campaign's backbone, and the hook as the first session. Use the D&D name generator for the characters who live there.",
  },
  {
    question: "What do the tone options change?",
    answer:
      "Tone chooses the whole palette, not just the name. A dark fantasy world draws from plagues, bargains and burned-out cities; steampunk draws on guilds, railways and aether engines; mythic worlds feature gods and heroes; whimsical worlds run on tea, jam and talking geese; high fantasy has swords, oaths and ancient elves.",
  },
  {
    question: "How are the magic systems built?",
    answer:
      "Each one has a source (where the power comes from) and a cost (what the user gives up). Fantasy worlds feel richer when magic has a price, because the price creates choices and conflicts for the story. You can swap the source and cost between worlds to make your own.",
  },
  {
    question: "Are the worlds repeated or copied from books?",
    answer:
      "The names, factions and hooks are written for this tool and do not copy any novel, game or film setting. The pools are large and combine at random, and the tool avoids repeating a world name until it has gone through the full list, so ten worlds in a row will not feel the same.",
  },
  {
    question: "Can I draw a map of the world I get?",
    answer:
      "Yes. Take the geography line (a continent, a chain of islands or a single kingdom) and use it as your brief for the fantasy map maker, which makes the coastlines and mountains for you. The result is a world with a name, a history and a map in under a minute.",
  },
];

export default function FantasyWorldGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Fantasy World Generator"
      heading={["Fantasy World", "Generator"]}
      intro={`Generate a complete fantasy world in one click: a name with its meaning, the land, a magic system with a cost, a conflict, two factions, a wonder and a story hook. Pick a tone, then draw ${WORLD_NAMES.length} different worlds from a hand-written library.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A fantasy world generator creates a setting you can build a story or campaign on. This one gives each world a name with a meaning, a
          geography, a climate, a magic system with a source and a price, a conflict, two factions, a strange wonder and a first story hook,
          in five tones from high fantasy to whimsical. It is free, needs no sign-up, and you can copy any world.
        </>
      }
      related={[
        { href: "/fantasy-map-maker", label: "Fantasy map maker" },
        { href: "/fantasy-name-generator", label: "Fantasy name generator" },
        { href: "/city-name-generator", label: "City name generator" },
        { href: "/dnd-name-generator", label: "D&D name generator" },
      ]}
      content={
        <>
          <SectionTitle>What a world generator is good for</SectionTitle>
          <p>
            Worldbuilding stalls when you start with a blank page. A <strong>fantasy world generator</strong> gives you something to react to:
            a strong first draft with a conflict and a hook, so you can say &quot;yes, but make the magic cost memories&quot; instead of
            starting from nothing. Use it for novels, tabletop campaigns, video-game settings, or simply as a prompt for your next sketch.
          </p>
          <SectionTitle>The eight parts of every world</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Name:</strong> with a meaning, so you can invent a language around it.</li>
            <li><strong>Land:</strong> the shape of the world, picked from continent, archipelago or single-kingdom pools.</li>
            <li><strong>Climate:</strong> a weather pattern that affects how people live and travel.</li>
            <li><strong>Magic:</strong> a source and a cost, in a style that fits the tone.</li>
            <li><strong>Conflict:</strong> the problem the world cannot ignore.</li>
            <li><strong>Factions:</strong> two groups with their own goals, so any plot has a side to choose.</li>
            <li><strong>Wonder:</strong> one location that makes the world memorable on a postcard.</li>
            <li><strong>Hook:</strong> an opening scene for a story or the first session.</li>
          </ul>
          <SectionTitle>Choose a tone</SectionTitle>
          <p>
            <strong>High fantasy</strong> means oaths, ancient elves and a good king in danger. <strong>Dark fantasy</strong> offers plagues,
            bargains and rotten crowns. <strong>Steampunk &amp; flintlock</strong> swaps swords for guilds, railways and aether. <strong>Mythic
            &amp; ancient</strong> is the age of gods and heroes. <strong>Whimsical</strong> is for cozy, funny, child-friendly adventures.
            Select several tones at once to get a mixed batch.
          </p>
          <SectionTitle>From a world to a whole project</SectionTitle>
          <p>
            Once you like a world, sketch its coasts with the{" "}
            <Link prefetch={false} href="/fantasy-map-maker" className={linkClass}>fantasy map maker</Link>, name its capitals with the{" "}
            <Link prefetch={false} href="/city-name-generator" className={linkClass}>city name generator</Link>, and name its people with the{" "}
            <Link prefetch={false} href="/fantasy-name-generator" className={linkClass}>fantasy name generator</Link> or the{" "}
            <Link prefetch={false} href="/dnd-name-generator" className={linkClass}>D&amp;D name generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note="Real output for three tones:" sets={EXAMPLES} />
        </>
      }
    >
      <FantasyWorldGenerator />
    </GeneratorPageShell>
  );
}
