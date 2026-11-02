import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import OrcNameGenerator from "@/components/generators/OrcNameGenerator";
import { ORC_CLANS, ORC_NAMES, orcGenerator } from "@/lib/generators/orc";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/orc-name-generator";
const TITLE = `Orc Name Generator — ${ORC_NAMES.length} Orc Names & ${ORC_CLANS.length} Clans with Meanings`;
const DESCRIPTION = `Free orc name generator with ${ORC_NAMES.length} orc names and ${ORC_CLANS.length} clan names, each with its meaning. Filter by war band, mountain, swamp or ash-waste clan and by gender, or add a title like "Skull-Taker". For D&D, WoW-style games and fantasy writing.`;

const SOCIAL = generatorSocial({ card: "fantasy-name-generator", title: TITLE, description: DESCRIPTION, alt: "Orc Name Generator — orc names and clans with meanings" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["orc name generator", "orc names", "female orc names", "male orc names", "half orc name generator", "orc clan names", "dnd orc names", "warcraft orc name generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "War band orcs", results: orcGenerator.generate({ clan: ["warband"] }, 4, [], 81).results },
  { label: "Female swamp orcs", results: orcGenerator.generate({ clan: ["swamp"], gender: ["female"] }, 4, [], 82).results },
  { label: "Orcs with titles", results: orcGenerator.generate({ clan: ["mountain", "ash"], style: ["title"] }, 4, [], 83).results },
];

const FAQ = [
  {
    question: "What is a good orc name?",
    answer:
      "A good orc name is short, hard to say quietly and means something. Most work as one or two harsh syllables, like Gorok or Thrakka, followed by a clan name that says what the orc is known for. This generator gives you both, with the meaning of each part, so the name already hints at the character.",
  },
  {
    question: "How are these orc names made?",
    answer:
      "Every name joins a clan-flavored root (blood, stone, mire, ash…) to an ending that carries a second meaning (fist, axe, claw, tusk…). The result shows the meaning, for example \"blood + axe\". Clan names come from a hand-written list where each clan has its own custom or reputation.",
  },
  {
    question: "Can I make female orc names?",
    answer:
      "Yes. Use the gender filter. Female orc names here end in sounds like -sha, -ka and -gra (blade, claw, oath), male names in -ok, -ash or -gul (fist, axe, fang), and neutral names in -nak or -ug (scar, tusk). Mix the filters to get a whole war band at once.",
  },
  {
    question: "Do the names work for half-orcs in D&D?",
    answer:
      "Yes. In D&D, half-orcs raised among orcs usually carry an orc name, and these fit the 5e style. If your half-orc grew up among humans, give them an orc first name from here and a human surname from the character name generator.",
  },
  {
    question: "Are these names from World of Warcraft or Warhammer?",
    answer:
      "No. They are original and do not copy any game's characters, so you can use them freely in campaigns, books and games. They follow the same rough sound that orcs have in most fantasy, so they still fit those worlds.",
  },
  {
    question: "What is the difference between the clan types?",
    answer:
      "War band orcs are raiders, with drum-like names and clans like Bloodtusk. Mountain orcs are miners and smiths with blunt names and clans like Ironpeak. Swamp orcs are ambush hunters with wet, hissing names. Ash-waste orcs live in deserts of fire and dust, and their clans are named for heat and smoke.",
  },
];

export default function OrcNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Orc Name Generator"
      heading={["Orc Name", "Generator"]}
      intro={`Get ${ORC_NAMES.length} orc names and ${ORC_CLANS.length} clans, each with a meaning. Pick a clan type and gender, then generate 10 at a time — free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          An orc name generator gives you harsh, short names for orc characters. This one shows what every name means (e.g. Gorok = blood +
          fist), pairs it with a clan that has its own custom, and lets you filter by four clan types and by gender. It is free and has no
          sign-up, and you can copy or save any name.
        </>
      }
      related={[
        { href: "/fantasy-name-generator", label: "Fantasy name generator" },
        { href: "/username-generator", label: "Username generator" },
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/wizard-name-generator", label: "Wizard name generator" },
      ]}
      content={
        <>
          <SectionTitle>Orc names that mean something</SectionTitle>
          <p>
            Most <strong>orc name generators</strong> stack hard consonants and stop there. Here each name is built from two word-roots and
            the meaning comes with it: Kragmar is &quot;cliff + howl&quot;, Ozzha is &quot;fog + blade&quot;. The clan name adds a custom
            or reputation (the Ironjaw clan makes its chiefs bite through a chain), so one result gives you a name, a culture and a story hook.
          </p>
          <SectionTitle>Four kinds of orc clan</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>War band</strong> — raiders and conquerors. Drum-beat names, clans like Bloodtusk, Warhowl and Brokenchain.</li>
            <li><strong>Mountain clan</strong> — miners, smiths and pass-guards. Blunt, stony names; clans like Ironpeak and Grimforge.</li>
            <li><strong>Swamp clan</strong> — patient ambush hunters. Wet, hissing names; clans like Bogfang and Mirestalker.</li>
            <li><strong>Ash-waste clan</strong> — desert and volcano dwellers. Dry, burning names; clans like Emberborn and Dustrider.</li>
          </ul>
          <SectionTitle>Clan name, title or name only</SectionTitle>
          <p>
            Choose <em>Name + clan</em> for a full name, <em>Name + title</em> for a name earned in battle (&quot;Vragesh the
            Twice-Scarred&quot;), or <em>Name only</em> for minor characters. A warlord might use all three in different scenes.
          </p>
          <SectionTitle>Naming the rest of the party</SectionTitle>
          <p>
            Orcs rarely travel alone in a story. For elves, dwarves and other races, try the{" "}
            <Link prefetch={false} href="/fantasy-name-generator" className={linkClass}>fantasy name generator</Link>; for a spellcaster
            rival, the <Link prefetch={false} href="/wizard-name-generator" className={linkClass}>wizard name generator</Link>. Want the orc
            as your online handle? The <Link prefetch={false} href="/username-generator" className={linkClass}>username generator</Link>{" "}
            checks length rules for each platform.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for each clan type:"} sets={EXAMPLES} />
        </>
      }
    >
      <OrcNameGenerator />
    </GeneratorPageShell>
  );
}
