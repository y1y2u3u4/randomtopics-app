import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import PirateNameGenerator from "@/components/generators/PirateNameGenerator";
import { PIRATE_FIRST, PIRATE_NICKNAMES, PIRATE_SURNAMES, SHIP_COUNT, pirateGenerator } from "@/lib/generators/pirate";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/pirate-name-generator";
const TITLE = `Pirate Name Generator — ${PIRATE_FIRST.length} Names, ${PIRATE_NICKNAMES.length} Nicknames & Ship Names`;
const DESCRIPTION = `Free pirate name generator: ${PIRATE_FIRST.length} first names, ${PIRATE_NICKNAMES.length} nicknames and ${PIRATE_SURNAMES.length} surnames in fearsome or funny style, each with how it was earned, plus ${SHIP_COUNT} ship names. Filter by gender.`;

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "Pirate Name Generator — pirate names, nicknames and ship names" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["pirate name generator", "pirate names", "female pirate names", "funny pirate names", "pirate nickname generator", "pirate ship name generator", "pirate captain names"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Fearsome", results: pirateGenerator.generate({ style: ["fearsome"] }, 4, [], 91).results },
  { label: "Funny", results: pirateGenerator.generate({ style: ["funny"] }, 4, [], 92).results },
  { label: "Captains with a ship", results: pirateGenerator.generate({ style: ["fearsome"], ship: ["ship"], gender: ["female"] }, 4, [], 93).results },
];

const FAQ = [
  {
    question: "How are pirate names structured?",
    answer:
      "Historically pirates had a given name and a nickname that stuck, often about a body feature, a habit or a famous deed. This generator follows that pattern: a first name, a nickname in quotation marks, and a surname. Each nickname and surname includes a short explanation of how it was earned.",
  },
  {
    question: "What is the difference between fearsome and funny?",
    answer:
      "Fearsome names are for villains, rivals and serious captains, with nicknames like Dead-Eye and surnames like Blackwater. Funny names suit comedy crews, children's parties and silly role-play, with nicknames like Pudding and surnames like Soggybottom. The style filter changes both parts and the ship name at once.",
  },
  {
    question: "Does it generate ship names?",
    answer:
      `Yes. Turn on Add a ship name and each pirate captains a vessel such as The Black Revenge or The Tipsy Pudding. There are ${SHIP_COUNT} possible ship names across the two styles, matched to the style you choose.`,
  },
  {
    question: "Can I get female pirate names?",
    answer:
      "Yes. The gender filter has male, female and neutral first names, and you can mix them. Nicknames and surnames fit any pirate.",
  },
  {
    question: "Are these real pirate names?",
    answer:
      "The nicknames, surnames and ship names are original. Some first names are common historical names, but the full combinations are made for this tool, so they are safe for stories, games and parties.",
  },
  {
    question: "What can I use pirate names for?",
    answer:
      "Tabletop campaigns, video-game characters, birthday parties, costumes, fan fiction and boat or team names. Roll as many as you like and use the copy and share buttons for your favourites.",
  },
];

export default function PirateNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Pirate Name Generator"
      heading={["Pirate Name", "Generator"]}
      intro={`${PIRATE_FIRST.length} first names, ${PIRATE_NICKNAMES.length} nicknames and ${PIRATE_SURNAMES.length} surnames — fearsome or funny, with a ship name if you like.`}
      description={DESCRIPTION}
      updated="2026-10-22"
      faq={FAQ}
      related={[
        { href: "/viking-name-generator", label: "Viking name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/band-name-generator", label: "Band name generator" },
      ]}
      content={
        <>
          <SectionTitle>A nickname for every sea dog</SectionTitle>
          <p>
            On a pirate ship, the nickname matters more than the name. This <strong>pirate name generator</strong> gives each sailor a first
            name, a nickname and a surname, and tells you how the nickname was earned: a lost eye, an unlucky wager, a very loud sneeze. That
            one line is often all you need to write the character.
          </p>
          <SectionTitle>Fearsome or funny</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Fearsome</strong> — villains, rival captains and gritty campaigns: Dead-Eye, Bloodtide, Ravenscar.</li>
            <li><strong>Funny</strong> — comedy crews and children's parties: Pudding, Hiccup, Soggybottom.</li>
          </ul>
          <p>
            Pick the tone once and every part follows it, so you never get a ruthless captain with a custard surname unless that is what
            you want, in which case roll again with the other style.
          </p>
          <SectionTitle>Name the ship too</SectionTitle>
          <p>
            A crew needs a vessel. Turn on the ship option and each pirate also captains a ship built from an adjective and a noun, from The
            Black Revenge to The Wobbling Teacup. Ships follow the same tone as the sailor, and you can reuse the ship name for a boat, a
            team or a game server.
          </p>
          <p>
            Want something from colder seas? Try the <Link href="/viking-name-generator" className={linkClass}>Viking name generator</Link>, or
            the <Link href="/character-name-generator" className={linkClass}>character name generator</Link> for more genres.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output in each mode:"} sets={EXAMPLES} />
        </>
      }
    >
      <PirateNameGenerator />
    </GeneratorPageShell>
  );
}
