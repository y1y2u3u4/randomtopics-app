import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WarriorCatNameGenerator from "@/components/generators/WarriorCatNameGenerator";
import { CAT_CLANS, CAT_PREFIXES, CAT_SUFFIXES, catGenerator } from "@/lib/generators/warriorCat";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/warrior-cat-name-generator";
const TITLE = `Warrior Cat Name Generator — ${CAT_PREFIXES.length} Prefixes, ${CAT_SUFFIXES.length} Suffixes & Ranks`;
const DESCRIPTION = `Free warrior cat name generator: ${CAT_PREFIXES.length} prefixes and ${CAT_SUFFIXES.length} suffixes in seven themes, with kit (-kit), apprentice (-paw), warrior and leader (-star) ranks, plus ${CAT_CLANS.length} clan names. Every name explains its look or meaning.`;

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "Warrior Cat Name Generator — clan cat names by rank and theme" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["warrior cat name generator", "warrior cats name generator", "warrior cat names", "clan cat names", "warrior cat kit names", "warrior cat leader names", "cat clan name generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Warriors", results: catGenerator.generate({ rank: ["warrior"] }, 4, [], 61).results },
  { label: "Kits and apprentices", results: [...catGenerator.generate({ rank: ["kit"] }, 2, [], 62).results, ...catGenerator.generate({ rank: ["apprentice"] }, 2, [], 63).results] },
  { label: "Leaders with a clan", results: catGenerator.generate({ rank: ["leader"], clan: ["clan"] }, 4, [], 64).results },
];

const FAQ = [
  {
    question: "How do warrior cat names work?",
    answer:
      "A cat's name is a prefix plus a rank-based ending. Kits end in -kit, apprentices in -paw, and leaders in -star. Full warriors take a free-form suffix such as -pelt, -tail, -heart or -fur. When a cat is promoted the ending changes but the prefix stays, so Ashkit becomes Ashpaw, then Ashfur, and finally Ashstar.",
  },
  {
    question: "Are these names from the Warriors books?",
    answer:
      "No. The generator uses the naming pattern that fans of the series know, but every prefix, suffix and clan name here is original, so you can use them for fan fiction, roleplay, art and your own clan worlds.",
  },
  {
    question: "How do I pick a good warrior cat name?",
    answer:
      "Start from the cat's pelt, personality or skill. A grey tabby with a calm voice might be Mistyvoice; a reckless tortoiseshell might be Thornflame. The theme filter keeps names consistent, for example water-and-marsh names for a river-style clan.",
  },
  {
    question: "Can I get only kit, apprentice or leader names?",
    answer:
      "Yes. The rank filter forces the ending for every result: -kit, -paw, -star, or a varied warrior suffix. Use it to rename a whole litter, give a roleplay character their next rank, or pick a leader name that sounds earned.",
  },
  {
    question: "Does it make clan names too?",
    answer:
      `Yes, switch on the clan option and each cat gets a home from ${CAT_CLANS.length} clan names, each with a short description of its territory. Mix and match to build a whole forest, moor or marsh setting.`,
  },
  {
    question: "Can I keep the names I like?",
    answer:
      "Every result has a copy and share button, and you can save favourites. A shared link reopens the exact name, rank, suffix and clan you picked.",
  },
];

export default function WarriorCatNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Warrior Cat Name Generator"
      heading={["Warrior Cat Name", "Generator"]}
      intro={`${CAT_PREFIXES.length} prefixes, ${CAT_SUFFIXES.length} suffixes and four ranks — filter by rank and theme, with ${CAT_CLANS.length} clan names to go with them.`}
      description={DESCRIPTION}
      updated="2026-10-22"
      faq={FAQ}
      related={[
        { href: "/dragon-name-generator", label: "Dragon name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/gnome-name-generator", label: "Gnome name generator" },
      ]}
      content={
        <>
          <SectionTitle>How warrior cat names are built</SectionTitle>
          <p>
            A <strong>warrior cat name</strong> has two halves. The prefix says what the cat looks like or what the clan values: a colour, a
            plant, a bird, a stretch of water. The ending says where the cat stands in the clan. This generator keeps that logic, so every
            result reads like it belongs in a clan camp rather than a pet shop.
          </p>
          <SectionTitle>The four ranks and their endings</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Kit (-kit)</strong> — a cub under six moons, still in the nursery.</li>
            <li><strong>Apprentice (-paw)</strong> — in training, with a mentor and a first set of duties.</li>
            <li><strong>Warrior</strong> — a full hunter and fighter with a free-form suffix such as -pelt, -tail, -heart or -storm.</li>
            <li><strong>Leader (-star)</strong> — the head of the clan, who takes the -star ending when they are chosen.</li>
          </ul>
          <p>
            Because only the ending changes, you can follow a single cat from kit to leader by keeping the same prefix and switching the
            rank filter. Pick a prefix you like in one rank, then roll again with another rank to see how it ages.
          </p>
          <SectionTitle>Choose a theme to match your clan</SectionTitle>
          <p>
            Seven themes cover the usual clan identities: pelt and colour, plants and forest, water and marsh, sky and night, fire and embers,
            stone and earth, and wild animals. Combine themes to blend a woodland clan with a river clan, or use only one to give a group of
            cats a strong shared feel. Every prefix comes with a short note about what it suggests, so you can match a name to a cat's fur,
            temperament or backstory.
          </p>
          <p>
            Need names for other fantasy creatures? Try the <Link prefetch={false} href="/dragon-name-generator" className={linkClass}>dragon name
            generator</Link> or the <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link> for people.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output at each rank:"} sets={EXAMPLES} />
        </>
      }
    >
      <WarriorCatNameGenerator />
    </GeneratorPageShell>
  );
}
