import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import RandomCharacterGenerator from "@/components/generators/RandomCharacterGenerator";
import { TRAITS } from "@/lib/generators/characters";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { randomCharacterGenerator } from "@/lib/generators/characters";
import RankBoost, { faqForSchema } from "@/components/RankBoost";
import type { BoostSection } from "@/components/RankBoost";
import { CHARACTER_BOOST } from "@/data/rankBoost";

const PATH = "/random-character-generator";
const TITLE = "Random Character Generator — Name, Personality, Secret & More";
const DESCRIPTION =
  "Free random character generator for writers and role-players: each character gets a name, occupation, personality, distinctive look, motivation, secret, quirk and flaw. Fantasy, sci-fi, modern or historical. No signup.";

const SOCIAL = generatorSocial({ card: "random-character-generator", title: TITLE, description: DESCRIPTION, alt: "Random Character Generator — character cards and dice" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random character generator", "character generator", "random character", "character idea generator", "oc generator", "npc generator", "character creator for writers"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Fantasy", results: randomCharacterGenerator.generate({ genre: ["fantasy"] }, 1, [], 31).results },
  { label: "Modern", results: randomCharacterGenerator.generate({ genre: ["modern"] }, 1, [], 32).results },
  { label: "Sci-fi", results: randomCharacterGenerator.generate({ genre: ["scifi"] }, 1, [], 33).results },
];

const FAQ = [
  {
    question: "What does the random character generator create?",
    answer:
      "Each character comes with a full name, an occupation, a personality, one distinctive physical detail, what they want, a secret they're keeping, a quirk and a flaw — enough to start writing a scene or play an NPC straight away.",
  },
  {
    question: "Can I choose the genre?",
    answer:
      "Yes. Pick fantasy, sci-fi, modern or historical to get a name that fits the setting, and optionally a gender. The traits are written to work across genres, so a 'secret' or 'motivation' can be read in any world.",
  },
  {
    question: "How many different characters can it make?",
    answer: `Billions of combinations: ${TRAITS.personality.length} personalities × ${TRAITS.appearance.length} looks × ${TRAITS.motivation.length} motivations × ${TRAITS.secret.length} secrets and more, multiplied by hundreds of names. You will not run out.`,
  },
  {
    question: "How do writers use random characters?",
    answer:
      "As writing exercises (write the moment the secret comes out), to break writer's block, to populate a background cast, or to create original characters (OCs) for art and fan fiction. Many writers generate five and combine the best parts of two.",
  },
  {
    question: "Is it useful for D&D and other role-playing games?",
    answer:
      "Very. Dungeon Masters use it to create memorable NPCs on the spot — the quirk and flaw give you an instant voice and a hook. For race-specific fantasy names, use the D&D name generator.",
  },
];

const PARTS_SECTION: BoostSection = {
  h2: "What Every Random Character Includes",
  id: "character-parts",
  blocks: [
    { t: "p", x: "Each character is assembled from seven pools of hand-written traits plus a name that fits the genre you choose. This is the size of each pool." },
    {
      t: "table",
      head: ["Part", "Options", "What it gives you"],
      rows: [
        ["Occupation", String(TRAITS.occupation.length), "Where they spend their days and who they know"],
        ["Personality", String(TRAITS.personality.length), "How they behave under pressure"],
        ["Appearance", String(TRAITS.appearance.length), "One detail a reader will remember"],
        ["Motivation", String(TRAITS.motivation.length), "The goal that drives the plot"],
        ["Secret", String(TRAITS.secret.length), "What they hide, and what happens if it comes out"],
        ["Quirk", String(TRAITS.quirk.length), "A habit that makes them human"],
        ["Flaw", String(TRAITS.flaw.length), "The weakness that trips them up"],
      ],
    },
  ],
};

export default function RandomCharacterGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Character Generator"
      heading={["Random Character", "Generator"]}
      intro="A complete character in one click: name, occupation, personality, looks, motivation, secret, quirk and flaw. Pick a genre or leave it open."
      description={DESCRIPTION}
      hero={{ src: "/generators/hero/character.webp", alt: "Character cards with a sword, rocket, magnifying glass and crown, next to a pair of dice" }}
      updated="2026-10-10"
      faq={[...FAQ, ...faqForSchema(CHARACTER_BOOST.faq)]}
      related={[
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/writing", label: "Writing prompt generator" },
        { href: "/random-marvel-character-generator", label: "Random Marvel character generator" },
      ]}
      content={
        <>
          <SectionTitle>Characters with something to hide</SectionTitle>
          <p>
            Flat characters want nothing and hide nothing. This <strong>random character generator</strong> gives every character a want and
            a secret — the two things that create conflict — plus a personality, a job, a detail a reader will remember, a quirk and a flaw.
            It&apos;s a starting point, not a cage: keep what sparks an idea and regenerate the rest.
          </p>
          <SectionTitle>What each part does</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Occupation</strong> — where they spend their days, and who they know.</li>
            <li><strong>Personality</strong> — how they react under pressure.</li>
            <li><strong>Looks</strong> — one specific detail beats a paragraph of description.</li>
            <li><strong>Motivation</strong> — the goal that drives the plot.</li>
            <li><strong>Secret</strong> — the thing that will hurt when it comes out.</li>
            <li><strong>Quirk &amp; flaw</strong> — the habits that make them human and the weakness that trips them up.</li>
          </ul>
          <SectionTitle>Exercises to try</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Generate two characters and write the first conversation between them.</li>
            <li>Write the scene where the character&apos;s secret is discovered — from someone else&apos;s point of view.</li>
            <li>Give the character a <Link prefetch={false} href="/writing" className={linkClass}>random writing prompt</Link> and let their flaw ruin the plan.</li>
          </ol>
          <p>
            Want just a name? Use the <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link>, or the{" "}
            <Link prefetch={false} href="/dnd-name-generator" className={linkClass}>D&amp;D name generator</Link> for elves, dwarves and tieflings.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Three complete characters generated with the genre filter — each comes with a job, personality, motivation, secret, quirk and flaw:"} sets={EXAMPLES} />
          <RankBoost variant="inline" sections={[PARTS_SECTION, ...CHARACTER_BOOST.sections]} />
        </>
      }
    >
      <RandomCharacterGenerator />
    </GeneratorPageShell>
  );
}
