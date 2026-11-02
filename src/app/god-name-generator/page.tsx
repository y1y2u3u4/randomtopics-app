import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import GodNameGenerator from "@/components/generators/GodNameGenerator";
import CompareTable, { no, yes } from "@/components/generators/CompareTable";
import { GOD_DOMAINS, GOD_NAMES, godGenerator } from "@/lib/generators/god";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/god-name-generator";
const TITLE = `God Name Generator — ${GOD_NAMES.length} God & Goddess Names for ${GOD_DOMAINS.length} Domains`;
const DESCRIPTION = `Free god name generator with ${GOD_NAMES.length} original god, goddess and genderless deity names across ${GOD_DOMAINS.length} domains — war, death, sea, storm, sun, moon, nature, knowledge, trickery, love, forge and harvest. Every name has a meaning, an epithet and a holy symbol. For D&D pantheons, worldbuilding and fantasy writing.`;

const SOCIAL = generatorSocial({ card: "fantasy-name-generator", title: TITLE, description: DESCRIPTION, alt: "God Name Generator — gods and goddesses with domains and meanings" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["god name generator", "goddess name generator", "deity name generator", "fantasy god names", "dnd god name generator", "god names", "pantheon generator", "evil god name generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "A small pantheon (sun, moon, death, sea)", results: godGenerator.generate({ domain: ["sun", "moon", "death", "sea"] }, 4, [], 111).results },
  { label: "Goddesses of nature and love", results: godGenerator.generate({ domain: ["nature", "love"], gender: ["goddess"] }, 4, [], 112).results },
  { label: "Gods of war and storms, with title", results: godGenerator.generate({ domain: ["war", "storm"], style: ["title"] }, 4, [], 113).results },
];

const COMPARE: [string, React.ReactNode, React.ReactNode][] = [
  [`${GOD_DOMAINS.length} domains you can mix into a pantheon`, yes, "Few or none"],
  ["Meaning shown for every name", yes, "Rare"],
  ["Epithet and holy symbol with every deity", yes, "Some add a title"],
  ["God, goddess and genderless deities", yes, "Usually god/goddess only"],
  ["Original names, not copied from real religions", yes, "Often real mythology lists"],
  ["Lock names you like, re-roll the rest, share the list", yes, no],
  ["No sign-up, no AI credits", yes, "Some need an account"],
];

const FAQ = [
  {
    question: "How do I make up a god name?",
    answer:
      "Start from the god's domain, then add an ending that sounds divine. This generator does exactly that: the first root carries the domain (Sol = sun, Thal = sea, Mor = death), the ending marks god, goddess or neither (-oros = lord, -ara = lady, -is = spirit). Solara is \"sun + lady\". An epithet like \"the Ever-Burning\" finishes it.",
  },
  {
    question: "Can I build a whole pantheon with this?",
    answer:
      `Yes. Tick several domains at once — for example sun, moon, death and sea — and generate 10 or 20. Lock the gods you like and re-roll the rest until the pantheon feels complete, then share the link with your players. There are ${GOD_DOMAINS.length} domains, so a full pantheon of 12 needs one god per domain.`,
  },
  {
    question: "Does it make goddess names too?",
    answer:
      "Yes. Pick Goddess in the Deity filter for names ending in -ara, -ia, -ene, -ys or -ora (lady, queen, mother, grace, light). Pick Neither for genderless spirits and ancient powers, which end in -is, -eth or -umn.",
  },
  {
    question: "Are these real gods from mythology?",
    answer:
      "No. The names are invented, so you will not accidentally borrow a real religion's deity. Some roots echo old languages (Sol for sun, Thal for sea) so the names feel ancient, but the gods themselves are yours to define.",
  },
  {
    question: "How do I make an evil god name?",
    answer:
      "Choose the death, war or trickery domain. Those roots (death, night, grave, blood, chaos, mask) and epithets like \"Keeper of the Last Door\" or \"the Smiling Liar\" give a darker god. For a fallen god, combine a bright domain name with a dark epithet in your own notes.",
  },
  {
    question: "Can I use these god names in D&D or a book?",
    answer:
      "Yes. They are free to use in campaigns, novels and games. For D&D, each domain matches a cleric domain (war, death, tempest/storm, light/sun, nature, knowledge, trickery, forge, life/harvest), and the holy symbol is ready for your cleric's shield.",
  },
];

export default function GodNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="God Name Generator"
      heading={["God Name", "Generator"]}
      intro={`Get ${GOD_NAMES.length} god and goddess names across ${GOD_DOMAINS.length} domains, each with a meaning, epithet and holy symbol. Pick domains and a deity type, then generate 10 at a time — free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A god name generator gives you names for invented gods and goddesses. This one builds each name from its domain (Solara = sun + lady),
          adds an epithet such as &quot;the Ever-Burning&quot; and a holy symbol, covers {GOD_DOMAINS.length} domains you can mix into a
          pantheon, and makes god, goddess and genderless deities. All names are original, free, with no sign-up.
        </>
      }
      related={[
        { href: "/fantasy-name-generator", label: "Fantasy name generator" },
        { href: "/fantasy-world-generator", label: "Fantasy world generator" },
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/wizard-name-generator", label: "Wizard name generator" },
      ]}
      content={
        <>
          <SectionTitle>God names built from their domain</SectionTitle>
          <p>
            Most <strong>god name generators</strong> hand you a grand-sounding word with nothing behind it. Here the name tells you what the
            god rules: Thalora is &quot;sea + light&quot;, Morius is &quot;death + father&quot;. Every result also carries an epithet and a
            holy symbol, so you have what a cleric would pray to and what is carved over a temple door.
          </p>
          <SectionTitle>Twelve domains</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>War, death, trickery</strong> — the feared gods. Epithets like &quot;the Unconquered&quot; and &quot;the Pale Ferryman&quot;.</li>
            <li><strong>Sea, storm, sun, moon</strong> — the gods of the sky and water that sailors and farmers pray to.</li>
            <li><strong>Nature, harvest, love</strong> — the gods of life, plenty and the home.</li>
            <li><strong>Knowledge, forge</strong> — the makers and keepers, patrons of wizards and smiths.</li>
          </ul>
          <SectionTitle>How this god name generator compares</SectionTitle>
          <CompareTable rows={COMPARE} them="Typical god name generators" note="Compared with the top results for “god name generator” in November 2026." />
          <SectionTitle>Build the world around your gods</SectionTitle>
          <p>
            Give the pantheon a world with the <Link prefetch={false} href="/fantasy-world-generator" className={linkClass}>fantasy world generator</Link>,
            name its priests with the <Link prefetch={false} href="/wizard-name-generator" className={linkClass}>wizard name generator</Link>, and
            its worshippers with the <Link prefetch={false} href="/dwarf-name-generator" className={linkClass}>dwarf</Link> or{" "}
            <Link prefetch={false} href="/dragonborn-name-generator" className={linkClass}>dragonborn name generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for different domains:"} sets={EXAMPLES} />
        </>
      }
    >
      <GodNameGenerator />
    </GeneratorPageShell>
  );
}
