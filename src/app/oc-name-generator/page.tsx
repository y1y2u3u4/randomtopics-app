import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import OcNameGenerator from "@/components/generators/OcNameGenerator";
import { OC_FIRST, OC_LAST, ocGenerator } from "@/lib/generators/oc";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/oc-name-generator";
const TITLE = `OC Name Generator — ${OC_FIRST.length + OC_LAST.length} Original Character Names + Quirk & Palette`;
const DESCRIPTION = `Free OC name generator: original character names for anime, fantasy, sci-fi, modern, gothic and cute OCs. Every name comes with its meaning, a personality trait, a quirk, a color palette and a signature item. 10 per click.`;

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "OC Name Generator — original character names with a quirk, palette and signature item" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["oc name generator", "oc names", "original character name generator", "anime oc name generator", "fantasy oc names", "female oc names", "male oc names", "oc ideas generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const EXAMPLES = [
  { label: "Anime OCs", results: ocGenerator.generate({ genre: ["anime"] }, 3, [], 41).results },
  { label: "Gothic OCs", results: ocGenerator.generate({ genre: ["gothic"] }, 3, [], 42).results },
  { label: "Sci-fi, female", results: ocGenerator.generate({ genre: ["scifi"], gender: ["female"] }, 3, [], 43).results },
];

const FAQ = [
  { question: "What is an OC name generator?", answer: "An OC name generator makes names for original characters, the characters you invent yourself for art, fiction, roleplay or fandom projects. This one also hands you a personality trait, a quirk, a color palette and a signature item, so you leave with the start of a design and not only a label." },
  { question: "What does OC stand for?", answer: "OC stands for original character: a character you created, as opposed to one that belongs to an existing show, game or book. People use OCs in fan art, fanfiction, tabletop roleplay, visual novels and webcomics." },
  { question: "Are the names original and safe to use?", answer: "The first names are real or invented words with a stated meaning, and the surnames are real surnames or invented compounds. Nothing is copied from a named character, but common names can match other characters by chance, so it is worth a quick search before you publish." },
  { question: "How do I pick the right genre for my OC?", answer: "Choose the world your OC lives in. Anime gives Japanese-style names, fantasy gives old-world and nature names, sci-fi gives star and tech names, modern gives everyday names, gothic gives night and thorn names, and cute gives soft, food and toy names. You can select several at once." },
  { question: "How do I use the quirk, palette and item?", answer: "Treat them as design constraints. Draw the palette as the character's main colors, put the item in every picture, and let the quirk show up in a scene. A trait and a contradicting quirk, like a calm character who counts stairs, often makes the character feel real." },
  { question: "Can I get a male, female or gender-neutral OC name?", answer: "Yes. Use the gender filter to pick one or several. Gender-neutral names, like Wren, Sora or Rue, are a separate group, so you can build a nonbinary OC or leave the gender open." },
];

export default function OcNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="OC Name Generator"
      heading={["OC Name", "Generator"]}
      intro={`Get original character names for any OC, each with its meaning, a trait, a quirk, a color palette and a signature item. Pick a genre and gender, then generate 10 at a time — free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          An OC name generator gives you a name for an original character. This one covers six genres (anime, fantasy, sci-fi, modern,
          gothic, cute), shows what each name means, and adds a personality trait, a quirk, a color palette and a signature item so the
          character is ready to draw or write. It is free, needs no sign-up and lets you copy any result.
        </>
      }
      related={[
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/fantasy-name-generator", label: "Fantasy name generator" },
        { href: "/username-generator", label: "Username generator" },
        { href: "/random-person-generator", label: "Random person generator" },
      ]}
      content={
        <>
          <SectionTitle>A name plus the seed of a design</SectionTitle>
          <p>
            Most <strong>OC name generators</strong> stop at the name. Each result here is a mini character sheet: a first name and surname
            with meanings, one personality trait, one quirk, a three-color palette and an item they never leave behind. Draw artists get a
            ready color scheme; writers get a habit that can appear in the first scene.
          </p>
          <SectionTitle>Six genres, six sounds</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Anime</strong> — Japanese-style names like Haruka Hoshikawa (&quot;distant&quot;, &quot;star river&quot;).</li>
            <li><strong>Fantasy</strong> — old-world and nature names, with Cornish, Welsh and Germanic roots.</li>
            <li><strong>Sci-fi</strong> — stars, constellations and tech words: Nova, Orion, Cipher.</li>
            <li><strong>Modern</strong> — everyday names from many cultures, for school, city and slice-of-life OCs.</li>
            <li><strong>Gothic / dark</strong> — night, thorn and raven names such as Vesper Blackwood.</li>
            <li><strong>Cute</strong> — soft names from food, flowers and toys: Mochi, Poppy, Pip.</li>
          </ul>
          <SectionTitle>Making the OC your own</SectionTitle>
          <p>
            Take the first name from one result and the surname from another, or rewrite the spelling. If you want a name with more
            fantasy-world structure, try the{" "}
            <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link> or the{" "}
            <Link prefetch={false} href="/fantasy-name-generator" className={linkClass}>fantasy name generator</Link>. Need a username
            for your OC&apos;s social account? The{" "}
            <Link prefetch={false} href="/username-generator" className={linkClass}>username generator</Link> helps, and the{" "}
            <Link prefetch={false} href="/random-person-generator" className={linkClass}>random person generator</Link> adds a job, a goal and a secret.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for three genres:"} sets={EXAMPLES} />
        </>
      }
    >
      <OcNameGenerator />
    </GeneratorPageShell>
  );
}
