import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import MegacorpNameGenerator from "@/components/generators/MegacorpNameGenerator";
import { CORP_GENRES, CORP_SECTORS, megacorpGenerator } from "@/lib/generators/megacorpNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/megacorp-name-generator";
const TITLE = "Megacorp Name Generator — Cyberpunk & Sci-Fi Corporation Names";
const DESCRIPTION = `Free megacorp name gen: evil corporation names for cyberpunk, space, dystopian and retro-futurist settings across ${CORP_SECTORS.length} sectors, each with a stock ticker and a slogan. 10 per click, shareable links, no sign-up.`;

const SOCIAL = generatorSocial({ card: "random-name-generator", title: TITLE, description: DESCRIPTION, alt: "Megacorp Name Generator — fictional corporation names" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["megacorp name generator", "megacorp name gen", "megacorporation name generator", "cyberpunk corporation name generator", "evil corporation name generator", "sci-fi company name generator", "fictional company name generator", "stellaris megacorp names", "shadowrun megacorp names", "cyberpunk red corporation names"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const EXAMPLES = [
  { label: "Cyberpunk, cybernetics", results: megacorpGenerator.generate({ genre: ["cyberpunk"], sector: ["cybernetics"] }, 4, [], 71).results },
  { label: "Space, mining & shipping", results: megacorpGenerator.generate({ genre: ["space"], sector: ["mining"] }, 4, [], 72).results },
  { label: "Friendly dystopia, food", results: megacorpGenerator.generate({ genre: ["dystopian"], sector: ["consumer"] }, 4, [], 73).results },
];

const FAQ = [
  {
    question: "What is a megacorp name gen?",
    answer: "A megacorp name gen (megacorp name generator) makes names for huge fictional corporations: the kind that own the city in a cyberpunk story, run a star system in a sci-fi campaign or sell you breakfast in a dystopia. This one gives each name a stock ticker, a sector and a slogan so you can drop it straight into your game or story.",
  },
  {
    question: "How are the names built?",
    answer: "Each name starts with a root word that sets the sound of the setting (Kessler for cyberpunk, Aphelion for space, Benevolent for a friendly dystopia, Atomic for retro-futurist) and adds a sector word, a corporate suffix like Holdings or Conglomerate, or a blended ending like -tek. Old-money mergers join two founder surnames, as in Ashcroft-Vance Capital.",
  },
  {
    question: "Can I use these names in my game, book or Stellaris empire?",
    answer: "Yes, use them freely in tabletop games (Cyberpunk RED, Shadowrun, Starfinder), video game empires such as a Stellaris megacorporation, novels and screenplays. The roots are original words and ordinary surnames. We leave out famous fictional corporations, but a name can still match a real company by chance, so search it before you publish commercially.",
  },
  {
    question: "Why do they come with a ticker and a slogan?",
    answer: "A ticker on a newsfeed or a slogan on a billboard makes a corporation feel real in two seconds. Use the ticker in market reports and hacker screens, and the slogan for ads, propaganda posters or the first line an NPC says.",
  },
  {
    question: "Do you store the names I generate?",
    answer: "No. Names are generated in your browser and are not saved. Copy one name, copy the whole list or share a link that shows exactly the same corporations.",
  },
];

export default function MegacorpNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Megacorp Name Generator"
      heading={["Megacorp Name", "Generator"]}
      intro={`Evil corporation names for ${CORP_GENRES.length} settings and ${CORP_SECTORS.length} sectors, each with a stock ticker and a slogan. 10 per click, free, nothing saved.`}
      description={DESCRIPTION}
      updated="2026-11-26"
      faq={FAQ}
      inShort={
        <>
          A megacorp name generator invents names for giant fictional corporations. This one mixes a genre root (cyberpunk, space,
          friendly dystopia, retro-futurist or an old-money merger) with one of {CORP_SECTORS.length} sectors from weapons to
          breakfast cereal, and adds a ticker and a slogan to every name so it is ready for your campaign or story.
        </>
      }
      related={[
        { href: "/business-name-generator", label: "Business name generator" },
        { href: "/country-name-generator", label: "Country name generator" },
        { href: "/city-name-generator", label: "City name generator" },
        { href: "/fantasy-world-generator", label: "Fantasy world generator" },
      ]}
      content={
        <>
          <SectionTitle>Five megacorp sounds</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cyberpunk</strong> — hard consonants and Japanese-style founder names: &quot;Kessler Augmentics&quot;, &quot;Hexacoretek&quot;.</li>
            <li><strong>Space &amp; sci-fi</strong> — astronomy words for star-spanning shippers and miners: &quot;Aphelion Orbital Group&quot;.</li>
            <li><strong>Friendly dystopia</strong> — warm words on a cold company. The nicer it sounds, the worse it is: &quot;Gentle Hand Nutrition&quot;.</li>
            <li><strong>Retro-futurist</strong> — 1950s atomic-age optimism: &quot;Atomic Reactors Unlimited&quot;, &quot;Orbitrondyne&quot;.</li>
            <li><strong>Old-money merger</strong> — two founding families joined by a hyphen: &quot;Thorne-Halvorsen Capital&quot;.</li>
          </ul>
          <SectionTitle>Make your megacorp feel real</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Give it one thing everybody uses, like water, implants or the news, so the players can&apos;t avoid it.</li>
            <li>Put the slogan somewhere public: a billboard, a vending machine, a security drone.</li>
            <li>Show the ticker moving when the players hurt the company. Markets are a great scoreboard.</li>
            <li>Need a rival? Generate a second corp in another sector and let them fight over the city.</li>
          </ol>
          <SectionTitle>Build the rest of the world</SectionTitle>
          <p>
            Name the city it owns with the <Link prefetch={false} href="/city-name-generator" className={linkClass}>city name generator</Link>, the
            nation it lobbies with the <Link prefetch={false} href="/country-name-generator" className={linkClass}>country name generator</Link>, and the
            CEO with the <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link>. Starting a real
            company instead? Try the <Link prefetch={false} href="/business-name-generator" className={linkClass}>business name generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output from three filters:"} sets={EXAMPLES} />
        </>
      }
    >
      <MegacorpNameGenerator />
    </GeneratorPageShell>
  );
}
