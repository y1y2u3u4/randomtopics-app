import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import EnglishNameGenerator from "@/components/generators/EnglishNameGenerator";
import CompareTable, { no, yes } from "@/components/generators/CompareTable";
import { ENGLISH_GIVEN, ENGLISH_SURNAMES, englishGenerator } from "@/lib/generators/englishNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/english-name-generator";
const TITLE = `English Name Generator — ${ENGLISH_GIVEN.length} First Names & ${ENGLISH_SURNAMES.length} Surnames with Meanings`;
const DESCRIPTION = `Free English name generator with ${ENGLISH_GIVEN.length} real English first names and ${ENGLISH_SURNAMES.length} surnames, each with its meaning. Filter by era — modern, Victorian and classic, or Old English (Anglo-Saxon) — and by gender, or add a middle name. For characters, games and choosing an English name.`;

const SOCIAL = generatorSocial({ card: "random-name-generator", title: TITLE, description: DESCRIPTION, alt: "English Name Generator — English first names and surnames with meanings" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["english name generator", "english names", "british name generator", "old english names", "english surnames", "anglo saxon names", "victorian names", "random english name"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Modern English names", results: englishGenerator.generate({ era: ["modern"] }, 4, [], 131).results },
  { label: "Victorian names with a middle name", results: englishGenerator.generate({ era: ["classic"], style: ["middle"] }, 4, [], 132).results },
  { label: "Old English (Anglo-Saxon) names", results: englishGenerator.generate({ era: ["old"] }, 4, [], 133).results },
];

const COMPARE: [string, React.ReactNode, React.ReactNode][] = [
  ["Meaning of every first name and surname", yes, "Rare"],
  ["Era filter: modern, Victorian, Old English", yes, "One mixed list, or a separate page"],
  ["Real Anglo-Saxon names (Aethelflaed, Godric)", yes, "Often invented"],
  ["First + middle + last name style", yes, "Some"],
  ["Lock names you like, re-roll the rest, share the list", yes, no],
  ["No sign-up, no AI credits", yes, "Some need an account"],
];

const FAQ = [
  {
    question: "What are popular English names right now?",
    answer:
      "Recent top names in England and Wales include Oliver, Noah, George, Arthur, Leo and Theodore for boys and Olivia, Amelia, Isla, Ava, Lily and Freya for girls. Choose the Modern era to get them, each with its meaning.",
  },
  {
    question: "What are common English surnames and what do they mean?",
    answer:
      "Smith (metal worker), Jones (son of John), Taylor (tailor), Brown (brown-haired) and Williams (son of William) are the most common. English surnames usually come from a trade (Fletcher = arrow maker), a place (Ashford = ford by ash trees) or a father's name (Thompson = son of Thomas).",
  },
  {
    question: "What are Old English or Anglo-Saxon names?",
    answer:
      "Names used in England before 1066, built from two meaningful parts: Alfred is elf + counsel, Aethelflaed is noble + beauty, Wulfstan is wolf + stone. Most fell out of use after the Norman Conquest, which makes them good for historical fiction and fantasy. Pick the Old English era.",
  },
  {
    question: "Can I get a full name with a middle name?",
    answer:
      "Yes. Choose First + middle + last. The middle name comes from the modern and classic lists of the same gender, the way English families usually choose them, and every part shows its meaning.",
  },
  {
    question: "Are these real English names?",
    answer:
      "Yes. Every first name and surname here is real and has been used in England. Some were borrowed long ago from Latin, Greek, Hebrew or Norman French; the meaning notes say where a name comes from.",
  },
  {
    question: "How do I choose an English name for myself?",
    answer:
      "Pick a name that is easy to say in your own language, fits your age (modern names feel young, Victorian names feel classic or trendy-vintage), and has a meaning you like. Generate a list, lock the ones you like, and say each one out loud with your surname.",
  },
];

export default function EnglishNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="English Name Generator"
      heading={["English Name", "Generator"]}
      intro={`Get real English names with meanings: ${ENGLISH_GIVEN.length} first names and ${ENGLISH_SURNAMES.length} surnames. Pick an era and gender, then generate 10 at a time — free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          An English name generator gives you realistic English first and last names. This one uses real names only, shows what every first
          name and surname means (Fletcher = arrow maker), and lets you choose the era — modern, Victorian and classic, or Old English
          (Anglo-Saxon) — with an optional middle name. Free, no sign-up.
        </>
      }
      related={[
        { href: "/german-name-generator", label: "German name generator" },
        { href: "/western-baby-name-generator", label: "Western baby name generator" },
        { href: "/last-name-generator", label: "Last name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
      ]}
      content={
        <>
          <SectionTitle>Real English names, sorted by era</SectionTitle>
          <p>
            An <strong>English name generator</strong> should know that an Ethel and an Isla were born a century apart. Every name here is tagged
            with its era, so a Victorian maid gets a Mabel or an Agnes, a modern teenager an Ivy or an Archie, and a Saxon thane an Edmund or a
            Godric.
          </p>
          <SectionTitle>Three eras</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Modern</strong> — today&apos;s top UK and US names: Oliver, Theodore, Olivia, Isla, Freya.</li>
            <li><strong>Victorian &amp; classic</strong> — names from 1840–1940: William, Albert, Edith, Florence, Mabel.</li>
            <li><strong>Old English</strong> — Anglo-Saxon names before 1066: Alfred, Wulfstan, Aethelflaed, Mildred.</li>
          </ul>
          <SectionTitle>How this English name generator compares</SectionTitle>
          <CompareTable rows={COMPARE} them="Typical English name generators" note="Compared with the top results for “english name generator” in November 2026." />
          <SectionTitle>Names from other countries</SectionTitle>
          <p>
            For German names, use the <Link prefetch={false} href="/german-name-generator" className={linkClass}>German name generator</Link>;
            for baby names with a Western or cowboy feel, the <Link prefetch={false} href="/western-baby-name-generator" className={linkClass}>Western baby name generator</Link>;
            for surnames from more countries, the <Link prefetch={false} href="/last-name-generator" className={linkClass}>last name generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for each era:"} sets={EXAMPLES} />
        </>
      }
    >
      <EnglishNameGenerator />
    </GeneratorPageShell>
  );
}
