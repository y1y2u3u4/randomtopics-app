import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import CityNameGenerator from "@/components/generators/CityNameGenerator";
import { CITY_STYLES, cityGenerator } from "@/lib/generators/cityNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/city-name-generator";
const TITLE = "City Name Generator — Fantasy, Sci-Fi & Real-Style Town Names";
const DESCRIPTION = `Free city name generator: fantasy, dark fantasy, sci-fi and real-world style (English, Spanish, German, Nordic, Italian) city and town names. Pick a size from village to capital — every name comes with a population and a one-line story hook.`;

const SOCIAL = generatorSocial({ card: "dnd-name-generator", title: TITLE, description: DESCRIPTION, alt: "City Name Generator — fantasy, sci-fi and real-style town names" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["city name generator", "fantasy city name generator", "town name generator", "fantasy town names", "sci-fi city names", "village name generator", "kingdom city names", "dnd city names"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Fantasy", results: cityGenerator.generate({ style: ["fantasy"] }, 4, [], 51).results },
  { label: "Dark fantasy villages", results: cityGenerator.generate({ style: ["dark"], size: ["village"] }, 4, [], 52).results },
  { label: "Sci-fi", results: cityGenerator.generate({ style: ["scifi"] }, 4, [], 53).results },
  { label: "Real-world style", results: cityGenerator.generate({ style: ["english", "german", "nordic", "italian", "spanish"] }, 4, [], 54).results },
];

const FAQ = [
  {
    question: "How does this city name generator work?",
    answer:
      "Each name joins a root and an ending from the same tradition — Silver + haven, Grim + moor, Nova + Prime, Lang + ford, Linden + burg — so the two parts always sound like one place. It then gives the place a size, a population that matches that size, and a one-line hook you can build a story or map around.",
  },
  {
    question: "Can I use these names for D&D or a fantasy novel?",
    answer:
      "Yes. The names are made for games, stories and worldbuilding, and you can use them freely. Fantasy and Dark fantasy suit D&D and Pathfinder maps; the hooks (\"Mining town that dug too deep\") are ready-made adventure seeds.",
  },
  {
    question: "Are the real-world style names real places?",
    answer:
      "They follow the real naming patterns of each country — -ton and -ford for English, -burg and -dorf for German, -vik and -fjord for Nordic — but they are generated, not looked up. Some may match a real small town by chance; search the name first if that matters for your project.",
  },
  {
    question: "How do I name a kingdom's capital?",
    answer:
      "Set Size to Capital. Capitals get populations in the hundreds of thousands to millions. Short, strong names (two syllables plus a clear ending like -hold or -spire) read best on a map and in dialogue.",
  },
  {
    question: "What makes a good fantasy town name?",
    answer:
      "It hints at the land or its history: a river (-ford, -brook), a hill (-crest, -berg), a wall (-hold, -burg) or a ruler (Kings-). Keep a region consistent by sticking to one style, so towns in the same land sound related.",
  },
  {
    question: "Can I keep the names I like and re-roll the rest?",
    answer:
      "Yes. Lock any name with the lock button and press Generate again — locked names stay, the rest change. The share link saves the exact list so you can send it to your group or come back to it later.",
  },
];

const yes = <span className="text-[var(--neon-cyan)]">Yes</span>;
const no = <span className="text-[var(--text-muted)]">No</span>;
const COMPARE: [string, React.ReactNode, React.ReactNode][] = [
  ["Fantasy, dark fantasy, sci-fi and 5 real-world styles on one page", yes, "One style per page"],
  ["Size filter: village, town, city, capital", yes, no],
  ["Population that matches the size", yes, no],
  ["One-line story hook with every name", yes, "Rare — usually names only"],
  ["Root and ending from the same tradition (no mixed-up names)", yes, "Often random syllables"],
  ["Lock the names you like, re-roll the rest", yes, no],
  ["Share link to the exact list", yes, no],
];

export default function CityNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="City Name Generator"
      heading={["City Name", "Generator"]}
      intro="Fantasy, sci-fi and real-world style city and town names — each with a size, a population and a story hook."
      description={DESCRIPTION}
      updated="2026-10-22"
      faq={FAQ}
      hero={{ src: "/generators/hero/city-name-generator.webp", alt: "Hand-drawn fantasy map dotted with little towns and roads" }}
      inShort="Pick one or more styles and a size, then tap Generate. Every city name comes with its size, a matching population and a one-line hook, so you can drop it straight onto a map or into a story."
      related={[
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/elf-name-generator", label: "Elf name generator" },
        { href: "/username-generator", label: "Username generator" },
      ]}
      content={
        <>
          <SectionTitle>City names that come with a place</SectionTitle>
          <p>
            A name on its own is only half the job. This <strong>city name generator</strong> also tells you what kind of place it is: a
            village of a few hundred people, a market town, a city or a capital. Each name gets a population in the right range and a
            one-line hook — a mining town that dug too deep, an orbital ring city above a gas giant — so you can start writing right away.
          </p>
          <SectionTitle>Styles</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">Style</th>
                  <th className="py-2 pr-3">Group</th>
                  <th className="py-2 pr-3">Sounds like</th>
                </tr>
              </thead>
              <tbody>
                {CITY_STYLES.map((s) => (
                  <tr key={s.id} className="border-b border-white/10 align-top">
                    <td className="py-2 pr-3 font-medium">{s.label}</td>
                    <td className="py-2 pr-3">{s.group}</td>
                    <td className="py-2 pr-3">{cityGenerator.generate({ style: [s.id] }, 3, [], 60).results.map((r) => r.title).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SectionTitle>Tips for naming places in your world</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>One region, one style.</strong> Towns in the same kingdom should share endings, so a map feels like one country.</li>
            <li><strong>Size matters.</strong> Villages can have plain names (Ashford); capitals deserve a grander one (Starfall Spire).</li>
            <li><strong>Use the hook.</strong> The one-line hook is a free plot point — why is the town walled, who rules it, what went wrong?</li>
            <li><strong>Mix for borderlands.</strong> Pick two styles at once for a frontier where two cultures meet.</li>
          </ul>
          <p>
            Need people to live there? The <Link href="/character-name-generator" className={linkClass}>character name generator</Link>{" "}
            and <Link href="/dnd-name-generator" className={linkClass}>D&amp;D name generator</Link> give you townsfolk, and the{" "}
            <Link href="/fancy-text-generator" className={linkClass}>fancy text generator</Link> turns a city name into a title for a map or a
            Discord server.
          </p>
          <SectionTitle>How this city name generator compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">Feature</th>
                  <th className="py-2 pr-3">This page</th>
                  <th className="py-2 pr-3">Typical city name generators</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([f, us, them]) => (
                  <tr key={f} className="border-b border-white/10 align-top">
                    <td className="py-2 pr-3">{f}</td>
                    <td className="py-2 pr-3">{us}</td>
                    <td className="py-2 pr-3">{them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Compared with the top results for “city name generator” in October 2026.</p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for each style:"} sets={EXAMPLES} />
        </>
      }
    >
      <CityNameGenerator />
    </GeneratorPageShell>
  );
}
