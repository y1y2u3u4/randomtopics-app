import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import PokemonGenerator from "@/components/generators/PokemonGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import { GEN_COUNTS, GEN_REGION, GEN_START, POKEMON, POKEMON_TYPES } from "@/lib/pokemon";

const PATH = "/random-pokemon-generator";
const TITLE = "Random Pokémon Generator — All 9 Generations, Types & Teams";
const DESCRIPTION =
  "Get random Pokémon from all 1025 species. Filter by generation 1-9 and type, draw 1 to 24, lock favourites, reroll one card or build a random team of six. Share the exact result by link or image.";

const SOCIAL = generatorSocial({ card: "random-pokemon-generator", title: TITLE, description: DESCRIPTION, alt: "Random Pokémon Generator — type-colour cards for all nine generations" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "random pokemon generator", "random pokemon", "random pokemon team generator", "random pokemon picker",
    "pokemon randomizer", "random pokemon by generation", "random pokemon by type", "random pokemon team",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const N = POKEMON.length;

const FAQ = [
  {
    question: "How do I get a random Pokémon?",
    answer: "Press Generate. You get cards showing each Pokémon's name, Pokédex number, generation and type. Leave the filters open for a draw from all species, or narrow by generation and type first. Choose from 1 to 24 Pokémon per draw.",
  },
  {
    question: "How many Pokémon are in the generator?",
    answer: `All ${N} species from Bulbasaur (#0001) to Pecharunt (#1025), covering generations 1 to 9: ${GEN_COUNTS.join(", ")} species per generation. Alternate forms such as Mega evolutions, regional variants and Gigantamax are not separate entries. Each species appears once.`,
  },
  {
    question: "Can I get a random Pokémon from only one generation?",
    answer: "Yes. Tick one or more generations (Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar and Hisui, Paldea). You can pick several at once, for example generations 1 and 3 only, and the draw stays inside those species.",
  },
  {
    question: "Can I filter by type?",
    answer: "Yes, choose one or more of the 18 types. A Pokémon matches if it has any selected type, so picking Fire and Water returns both. You can also ask for single-type or dual-type Pokémon only.",
  },
  {
    question: "How does the random Pokémon team generator work?",
    answer: "Switch to Team mode and press Generate. You get six different Pokémon. The generator tries to give the team a spread of types instead of six of the same kind, and still respects your generation and type filters. Reroll the whole team, or lock members and reroll the rest.",
  },
  {
    question: "Can I exclude legendary and mythical Pokémon?",
    answer: "Yes. The legendary filter has three settings: include them, exclude them or show only them. The list counts the sub-legendaries, legendaries and mythicals. Ultra Beasts and Paradox Pokémon are not counted as legendary.",
  },
  {
    question: "Can I do a Nuzlocke or challenge run with it?",
    answer: "That is a common use. Draw a team of six, lock the ones you keep, reroll the rest, and share the link so a friend gets the same team. Check the type spread shown under the team before you start.",
  },
  {
    question: "How do I share my result?",
    answer: "Use the share link. It stores the seed and filters, so anyone who opens it sees the same Pokémon. You can also save an image card or copy a text list. The image uses type colours and names only.",
  },
  {
    question: "Does it show Pokémon pictures?",
    answer: "No. To stay clear of official artwork and sprites, cards use type colours, the name and the Pokédex number. This is an unofficial fan tool, not affiliated with Nintendo, Game Freak or The Pokémon Company.",
  },
  {
    question: "Do I need an account or an app?",
    answer: "No. It works in your browser, on a phone or computer, with nothing to install and no sign-in.",
  },
];

export default function RandomPokemonGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Pokémon Generator"
      heading={["Random Pokémon", "Generator"]}
      intro={`Press Generate to draw random Pokémon from all ${N} species across generations 1 to 9. Filter by generation and type, pick 1 to 24, lock the ones you like, reroll a single card, or switch to Team mode for a balanced team of six. Share the exact result by link or image.`}
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort={`This random Pokémon generator draws from all ${N} species in generations 1 to 9. Filter by generation, type, single or dual type and legendary status, draw up to 24, lock cards and reroll the rest, or build a random team of six with a spread of types. The share link reproduces the same result.`}
      related={[
        { href: "/random-team-generator", label: "Random team generator" },
        { href: "/random-name-picker", label: "Random name picker" },
        { href: "/wheel-of-names", label: "Wheel of names" },
        { href: "/dice-roller", label: "Dice roller" },
        { href: "/random-nba-player-generator", label: "Random NBA player generator" },
        { href: "/categories", label: "All topic categories" },
      ]}
      content={
        <>
          <SectionTitle>Ways to use a random Pokémon picker</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Challenge runs and Nuzlockes</strong> — draw a team of six from the region you are playing, lock the keepers and reroll the rest.</li>
            <li><strong>Draft with friends</strong> — draw 12 or 18, take turns locking one each, then compare teams.</li>
            <li><strong>Drawing prompts</strong> — draw one Pokémon and sketch it, or draw two and mix them.</li>
            <li><strong>Quiz rounds</strong> — hide the type and let others guess it from the name and number.</li>
            <li><strong>Single-type themes</strong> — pick one type, such as Ghost or Steel, to get themed teams.</li>
            <li><strong>Settling who goes first</strong> — draw one Pokémon each; the higher Pokédex number starts. For other ways to decide, use the <Link prefetch={false} href="/dice-roller" className={linkClass}>dice roller</Link> or <Link prefetch={false} href="/wheel-of-names" className={linkClass}>wheel of names</Link>.</li>
          </ul>

          <SectionTitle>How the filters work</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Generation</strong> — any mix of generations 1 to 9. No selection means all.</li>
            <li><strong>Type</strong> — one or more of the {POKEMON_TYPES.length} types; a Pokémon matches if it has any chosen type.</li>
            <li><strong>Single or dual</strong> — limit to one-type or two-type Pokémon.</li>
            <li><strong>Legendary</strong> — include, exclude, or only legendary and mythical.</li>
            <li><strong>How many</strong> — 1 to 24. No repeats until every matching Pokémon has appeared.</li>
            <li><strong>Lock and reroll</strong> — lock cards to keep them, reroll one card, or reroll everything unlocked.</li>
            <li><strong>Team mode</strong> — six Pokémon with a spread of types.</li>
          </ul>

          <SectionTitle>Pokémon by generation</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" data-pokemon-gens>
              <thead>
                <tr className="text-[var(--text-primary)]">
                  <th className="py-2 pr-4 font-semibold">Gen</th>
                  <th className="py-2 pr-4 font-semibold">Region</th>
                  <th className="py-2 pr-4 font-semibold">Species</th>
                  <th className="py-2 font-semibold">Dex numbers</th>
                </tr>
              </thead>
              <tbody>
                {GEN_COUNTS.map((c, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="py-2 pr-4">{i + 1}</td>
                    <td className="py-2 pr-4">{GEN_REGION[i]}</td>
                    <td className="py-2 pr-4">{c}</td>
                    <td className="py-2">#{GEN_START[i]}–#{GEN_START[i] + c - 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>That is {N} species in total, each listed once with its main types. Regional forms and Mega evolutions are not separate entries.</p>

          <SectionTitle>Why this one is different</SectionTitle>
          <p>
            Most pickers hand you a list and stop. This one lets you lock cards and reroll the rest, reroll a single card, builds type-balanced teams of six, and makes the share link reproduce your exact result. It works on a phone and needs no account.
            Looking for something else to randomise? Try the <Link prefetch={false} href="/random-team-generator" className={linkClass}>random team generator</Link> or the <Link prefetch={false} href="/random-name-picker" className={linkClass}>random name picker</Link>.
          </p>
          <p className="rounded-xl border border-white/10 p-3 text-xs" data-pokemon-disclaimer>
            <strong className="text-[var(--text-primary)]">Disclaimer:</strong> Unofficial fan tool. Not affiliated with, endorsed by or sponsored by Nintendo, Game Freak, Creatures or The Pokémon Company. Pokémon and Pokémon character names are trademarks of their owners and are used here only to identify species. No official artwork or sprites are used.
          </p>
        </>
      }
    >
      <PokemonGenerator />
    </GeneratorPageShell>
  );
}
