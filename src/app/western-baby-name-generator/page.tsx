import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WesternNameGenerator from "@/components/generators/WesternNameGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import { STYLE_LABELS, WESTERN_NAMES, type Style } from "@/lib/generators/westernNames";

const PATH = "/western-baby-name-generator";
const TITLE = "Western Baby Name Generator — Cowboy, Country & Yellowstone-Style Names";
const DESCRIPTION =
  `Free Western baby name generator: ${WESTERN_NAMES.length} cowboy, country, Southern and vintage Western names for boys, girls and gender-neutral babies — including Yellowstone-style ranch names like Kayce, Rip, Beth and Laramie — each with its meaning or origin.`;

const SOCIAL = generatorSocial({ card: "western-baby-name-generator", title: TITLE, description: DESCRIPTION, alt: "Western baby name generator — cowboy and country names with meanings" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["western baby names", "cowboy baby names", "yellowstone baby names", "country baby names", "southern baby names generator", "western baby name generator", "cowboy names for boys", "western girl names"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "What are Western baby names?", answer: "Western or cowboy baby names are names with a ranch, frontier or country-music feel — trail and rodeo names like Colt, Wyatt and Maverick, place names like Dallas, Cheyenne and Laramie, and vintage favourites like Annie, Clementine and Gus. This generator also covers Southern classics and gender-neutral nature names such as Sage and Aspen." },
  { question: "What are Yellowstone-style baby names?", answer: "Ranch dramas such as Yellowstone brought names like Dutton, Kayce, Rip, Beth, Lloyd, Tate and Laramie back into conversation. Pick the “Yellowstone-style ranch” style to see them. They are ordinary given names; the meanings shown are their usual origins, not anything from the show." },
  { question: "Can I filter by boy, girl or gender-neutral?", answer: "Yes. Choose one or more genders and one or more styles — Yellowstone-style ranch, cowboy & frontier, country music, vintage Western or Southern — then generate. Leave a filter empty to include everything." },
  { question: "Where do the meanings come from?", answer: "Each meaning is the name's usual etymology, or the well-known reason it feels Western (a frontier figure, a place or a country singer). Name meanings are often debated, so treat them as a starting point and look up a name you love in more depth." },
  { question: "Can I share a list of names?", answer: "Yes — every result list has a share link that reopens exactly the same names, so you can send a shortlist to your partner or family." },
];

const STYLES = Object.keys(STYLE_LABELS) as Style[];

export default function WesternBabyNamePage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Western Baby Name Generator"
      heading={["Western Baby Name", "Generator"]}
      intro="Cowboy, country, Southern and Yellowstone-style names for boys, girls and gender-neutral babies — each with its meaning."
      description={DESCRIPTION}
      updated="2026-10-13"
      faq={FAQ}
      inShort={`Pick boy, girl or gender-neutral and a style — Yellowstone-style ranch, cowboy & frontier, country music, vintage Western or Southern — and get random Western baby names from a hand-picked list of ${WESTERN_NAMES.length}, each with a one-line meaning or origin. Save a shortlist with the share link. It is free and needs no signup.`}
      related={[
        { href: "/last-name-generator", label: "Last name generator" },
        { href: "/country-name-generator", label: "Country name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/viking-name-generator", label: "Viking name generator" },
      ]}
      content={
        <>
          <SectionTitle>Western names by style</SectionTitle>
          {STYLES.map((s) => (
            <p key={s}>
              <strong>{STYLE_LABELS[s]}:</strong>{" "}
              {WESTERN_NAMES.filter((w) => w.styles.includes(s)).slice(0, 14).map((w) => w.name).join(", ")}.
            </p>
          ))}
          <SectionTitle>Choosing a Western name</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Say it with the last name.</strong> One-syllable names (Colt, Wade, Rose) pair well with longer surnames; longer ones (Clementine, Augustus) with short surnames. Try surnames in the <Link href="/last-name-generator" className={linkClass}>last name generator</Link>.</li>
            <li><strong>Nickname test.</strong> Augustus becomes Gus, Josephine becomes Josie, Wesley becomes Wes — check you like both.</li>
            <li><strong>Place names</strong> such as Dallas, Cheyenne, Montana or Laramie carry the West without sounding like a costume.</li>
            <li>Writing a Western story instead? The <Link href="/character-name-generator" className={linkClass}>character name generator</Link> and <Link href="/country-name-generator" className={linkClass}>country name generator</Link> help with the rest of the cast and the world.</li>
          </ul>
        </>
      }
    >
      <WesternNameGenerator />
    </GeneratorPageShell>
  );
}
