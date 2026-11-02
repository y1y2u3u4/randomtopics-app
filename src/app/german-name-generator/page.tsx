import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import GermanNameGenerator from "@/components/generators/GermanNameGenerator";
import CompareTable, { no, yes } from "@/components/generators/CompareTable";
import { GERMAN_GIVEN, GERMAN_SURNAMES, germanGenerator } from "@/lib/generators/germanNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/german-name-generator";
const TITLE = `German Name Generator — ${GERMAN_GIVEN.length} First Names & ${GERMAN_SURNAMES.length} Surnames with Meanings`;
const DESCRIPTION = `Free German name generator with ${GERMAN_GIVEN.length} real German first names and ${GERMAN_SURNAMES.length} common surnames, each with its meaning. Filter by era — modern, classic 1930s–70s or old Germanic — and by gender, or make a noble "von" name. For characters, games and baby-name ideas.`;

const SOCIAL = generatorSocial({ card: "last-name-generator", title: TITLE, description: DESCRIPTION, alt: "German Name Generator — German first names and surnames with meanings" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["german name generator", "german names", "german last names", "german first names", "old german names", "german surnames meaning", "random german name", "german noble names"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Modern German names", results: germanGenerator.generate({ era: ["modern"] }, 4, [], 121).results },
  { label: "Classic names (born 1930s–70s)", results: germanGenerator.generate({ era: ["classic"] }, 4, [], 122).results },
  { label: "Old Germanic nobles", results: germanGenerator.generate({ era: ["old"], style: ["noble"] }, 4, [], 123).results },
];

const COMPARE: [string, React.ReactNode, React.ReactNode][] = [
  ["Meaning of every first name and surname", yes, "Rare"],
  ["Era filter: modern, classic, old Germanic", yes, "One mixed list, or a separate page"],
  ["Real names, correct umlauts (Müller, Jürgen)", yes, "Some drop the umlauts"],
  ["Noble “von” names", yes, "Some"],
  ["Lock names you like, re-roll the rest, share the list", yes, no],
  ["No sign-up, no AI credits", yes, "Some need an account"],
];

const FAQ = [
  {
    question: "What are common German names?",
    answer:
      "It depends on the generation. Babies in Germany today are often named Noah, Emil, Ben, Emilia, Mia or Sophia. Their grandparents are more likely Klaus, Jürgen, Wolfgang, Ursula, Helga or Ingrid. Pick the era that matches your character's birth year.",
  },
  {
    question: "What are the most common German surnames?",
    answer:
      "Müller (miller), Schmidt (smith), Schneider (tailor), Fischer (fisherman), Weber (weaver), Meyer (farm steward) and Wagner (wagon maker) top the list. Most German surnames come from a trade, a place or a feature like Klein (small) or Schwarz (black-haired). Every surname here shows its meaning.",
  },
  {
    question: "What does “von” mean in a German name?",
    answer:
      "\"Von\" means \"of\" or \"from\" and marked noble families tied to an estate or castle, as in von Falkenstein (\"of the falcon rock\"). Nobility was abolished in 1919 and \"von\" is now just part of the surname. Choose the Noble style for a von name; the place names here are invented but follow real patterns.",
  },
  {
    question: "What are old German names?",
    answer:
      "Old Germanic names were made of two meaningful parts: Siegfried is victory + peace, Hildegard is battle + enclosure, Wolfram is wolf + raven. They were common in the Middle Ages and suit historical or fantasy characters. Pick the Old Germanic era to get them.",
  },
  {
    question: "Are these real German names?",
    answer:
      "Yes. Every first name and surname is real and in use in Germany, now or in the past; only the noble \"von\" places are invented. Meanings come from the names' Germanic, Latin, Greek or Hebrew roots.",
  },
  {
    question: "How do you pronounce German names?",
    answer:
      "A few rules cover most names: W sounds like English V (Wolfgang = Volfgang), J like Y (Jürgen = Yürgen), ei like \"eye\" and ie like \"ee\" (Heinz, Dieter). Ü is like ee with rounded lips; you can write it ue (Mueller) when a form will not take umlauts.",
  },
];

export default function GermanNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="German Name Generator"
      heading={["German Name", "Generator"]}
      intro={`Get real German names with meanings: ${GERMAN_GIVEN.length} first names and ${GERMAN_SURNAMES.length} surnames. Pick an era and gender, then generate 10 at a time — free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A German name generator gives you realistic German first and last names. This one uses real names only, shows what every first name
          and surname means (Müller = miller), and lets you pick the era — modern, classic 1930s–70s or old Germanic — so a grandmother and a
          baby do not share the same name. A noble &quot;von&quot; style is included. Free, no sign-up.
        </>
      }
      related={[
        { href: "/english-name-generator", label: "English name generator" },
        { href: "/last-name-generator", label: "Last name generator" },
        { href: "/viking-name-generator", label: "Viking name generator" },
        { href: "/fake-name-generator", label: "Fake name generator" },
      ]}
      content={
        <>
          <SectionTitle>Real German names, sorted by era</SectionTitle>
          <p>
            A <strong>German name generator</strong> is only useful if the names fit the person. A Klaus is probably over 55; an Emil is probably
            under 10. Here every name is tagged with its era, so a 1960s Berlin detective gets a Jürgen or a Renate and a medieval knight gets a
            Konrad or a Mechthild.
          </p>
          <SectionTitle>Three eras</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Modern</strong> — names popular with babies now: Emil, Noah, Emilia, Mia, Frieda, Matteo.</li>
            <li><strong>Classic</strong> — the post-war generation: Klaus, Wolfgang, Jürgen, Ursula, Helga, Renate.</li>
            <li><strong>Old Germanic</strong> — two-part medieval names: Siegfried, Konrad, Adelheid, Hildegard, Kunigunde.</li>
          </ul>
          <SectionTitle>How this German name generator compares</SectionTitle>
          <CompareTable rows={COMPARE} them="Typical German name generators" note="Compared with the top results for “german name generator” in November 2026." />
          <SectionTitle>Names from other countries</SectionTitle>
          <p>
            For British and American names, use the <Link prefetch={false} href="/english-name-generator" className={linkClass}>English name generator</Link>;
            for surnames from more countries, the <Link prefetch={false} href="/last-name-generator" className={linkClass}>last name generator</Link>;
            for Norse names, the <Link prefetch={false} href="/viking-name-generator" className={linkClass}>Viking name generator</Link>. Need a full
            fake identity for testing? Try the <Link prefetch={false} href="/fake-name-generator" className={linkClass}>fake name generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for each era:"} sets={EXAMPLES} />
        </>
      }
    >
      <GermanNameGenerator />
    </GeneratorPageShell>
  );
}
