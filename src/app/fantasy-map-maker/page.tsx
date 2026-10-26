import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FantasyMapMaker from "@/components/generators/FantasyMapMaker";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/fantasy-map-maker";
const TITLE = "Fantasy Map Maker — Random Fantasy Map Generator, Free PNG";
const DESCRIPTION =
  "Free random fantasy map generator: one click makes a new continent, island chain or supercontinent with coasts, forests, mountains and named realms. Colored or parchment style, download as PNG, share by map number. No signup.";

const SOCIAL = generatorSocial({ card: "fantasy-map-maker", title: TITLE, description: DESCRIPTION, alt: "Fantasy Map Maker — parchment map with compass" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["fantasy map maker", "fantasy map generator", "random fantasy map", "random map generator", "dnd map generator", "world map generator", "fantasy world map"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How does the fantasy map maker work?",
    answer:
      "Each map is grown from a number (the map seed) using layered noise for height and rainfall. Low ground becomes sea, the coast is outlined, high ground becomes hills and snowy peaks, and wetter land becomes forest. Five realms, the highest mountain and a sea are named automatically.",
  },
  {
    question: "Can I get the same map again?",
    answer:
      "Yes. Every map has a number shown under it and in the page address. Copy the share link, or note the number, and the exact same world — coastline, names and all — appears again.",
  },
  {
    question: "Can I use the maps in my D&D campaign or book?",
    answer:
      "Yes, download the PNG and use it for tabletop campaigns, worldbuilding notes, story drafts or classroom geography games. For detailed hand-placed cities and roads you will want a full map-drawing tool; this generator is for a fast starting world.",
  },
  {
    question: "What is the difference between the land types?",
    answer:
      "Continent makes one main landmass surrounded by sea, Islands makes a scattered archipelago, and Supercontinent makes a large land-heavy world with inland seas.",
  },
];

export default function FantasyMapMakerPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Fantasy Map Maker"
      heading={["Fantasy Map", "Maker"]}
      intro="A new fantasy world in one click — coasts, forests, mountains and named realms. Colored or parchment, download as PNG."
      description={DESCRIPTION}
      updated="2026-10-11"
      faq={FAQ}
      related={[
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/viking-name-generator", label: "Viking name generator" },
        { href: "/country-name-generator", label: "Country name generator" },
        { href: "/random-character-generator", label: "Random character generator" },
      ]}
      content={
        <>
          <SectionTitle>A starting world in seconds</SectionTitle>
          <p>
            Blank-page worldbuilding is slow. This <strong>fantasy map maker</strong> gives you a believable coastline and terrain instantly,
            names the realms, and lets you keep regenerating until a world sparks an idea. It runs entirely in your browser, so maps appear
            immediately and nothing is uploaded.
          </p>
          <SectionTitle>Make it your own</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Land type</strong> — one continent, a chain of islands, or a supercontinent.</li>
            <li><strong>Style</strong> — colored terrain, or a sepia parchment look for handouts.</li>
            <li><strong>Names</strong> — realms, the tallest mountain and a sea are named for you; rename them with the <Link prefetch={false} href="/dnd-name-generator" className={linkClass}>D&amp;D name generator</Link> or the <Link prefetch={false} href="/country-name-generator" className={linkClass}>country name generator</Link>.</li>
            <li><strong>Download</strong> — save a PNG and draw your own cities and roads on top.</li>
          </ul>
          <SectionTitle>Ideas</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>Generate a world for a one-shot campaign, then roll NPCs with the <Link prefetch={false} href="/random-character-generator" className={linkClass}>random character generator</Link>.</li>
            <li>Writing prompt: describe a journey from the westernmost realm to the named mountain.</li>
            <li>Classroom: label climate zones, invent trade routes, or write a travel guide for one realm.</li>
          </ul>
        </>
      }
    >
      <FantasyMapMaker />
    </GeneratorPageShell>
  );
}
