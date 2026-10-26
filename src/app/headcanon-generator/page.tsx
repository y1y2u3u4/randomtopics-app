import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import HeadcanonGenerator from "@/components/generators/HeadcanonGenerator";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { HEADCANONS, headcanonGenerator } from "@/lib/generators/headcanons";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/headcanon-generator";
const TITLE = `Headcanon Generator — ${HEADCANONS.length} Headcanons for Any Character`;
const DESCRIPTION = `Free headcanon generator with ${HEADCANONS.length} original headcanons for any character. Type a name or leave it blank. Wholesome, funny, angsty-lite, habits, found family and modern AU. Copy or reroll.`;

const SOCIAL = generatorSocial({ card: "headcanon-generator", title: TITLE, description: DESCRIPTION, alt: "Headcanon Generator — headcanons for any character" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["headcanon generator", "headcanons", "random headcanon generator", "oc headcanons", "character headcanon ideas", "found family headcanons"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const EXAMPLES = [
  { label: "Wholesome", results: headcanonGenerator.generate({ cat: ["wholesome"] }, 3, [], 71).results },
  { label: "Funny", results: headcanonGenerator.generate({ cat: ["funny"] }, 3, [], 72).results },
  { label: "Modern AU", results: headcanonGenerator.generate({ cat: ["modern-au"] }, 3, [], 73).results },
];

const FAQ = [
  { question: "What is a headcanon?", answer: "A headcanon is a detail about a character that fans imagine and treat as true for themselves, even though the original story never says it, such as a favourite food, a nervous habit or what they do on weekends." },
  { question: "How do I use it for my own character?", answer: "Type your character's name in the box and every headcanon is rewritten with it. Leave the box empty and they read as 'Your character...' so you can copy them for anyone." },
  { question: "How many headcanons are there?", answer: `There are ${HEADCANONS.length} original headcanons in six categories: wholesome, funny, angsty-lite, habits and quirks, found family and modern AU.` },
  { question: "What does angsty-lite mean?", answer: "Soft sad: the emotional, rainy-day side of a character, such as keeping an old letter or hating goodbyes. It stays gentle and never graphic, so it suits all readers." },
  { question: "Can I use them for fanfiction or an OC?", answer: "Yes. They are written for this site and free to use as prompts, character sheet notes or social posts. Edit them to fit your story." },
  { question: "Do they mention specific shows or books?", answer: "No. They are fandom-neutral, so they fit any character from any series or one you invented." },
];

export default function HeadcanonGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Headcanon Generator"
      heading={["Headcanon", "Generator"]}
      intro={`${HEADCANONS.length} original headcanons for any character — type a name or leave it blank.`}
      description={DESCRIPTION}
      updated="2026-10-22"
      faq={FAQ}
      related={[
        { href: "/incorrect-quote-generator", label: "Incorrect quote generator" },
        { href: "/random-character-generator", label: "Random character generator" },
        { href: "/character-name-generator", label: "Character name generator" },
      ]}
      content={
        <>
          <SectionTitle>Headcanons that feel like a person, not a list</SectionTitle>
          <p>
            Good headcanons are small and specific: how a character takes their tea, who they call at night, what they do when they are
            nervous. This <strong>headcanon generator</strong> writes in that voice, so each result can drop straight into a character sheet,
            a fic or a fan post.
          </p>
          <SectionTitle>Six categories</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Wholesome</strong> — quiet kindnesses and comfort habits.</li>
            <li><strong>Funny</strong> — harmless chaos and running gags.</li>
            <li><strong>Angsty-lite</strong> — tender and a little sad, never graphic.</li>
            <li><strong>Habits and quirks</strong> — the tiny routines that make a character feel real.</li>
            <li><strong>Found family</strong> — how they act with friends, rivals and chosen family.</li>
            <li><strong>Modern AU</strong> — what they would be like with phones, jobs and rent.</li>
          </ul>
          <SectionTitle>Using headcanons in your writing</SectionTitle>
          <p>
            Roll five at a time, keep the ones that surprise you and rewrite the rest in your own words. For dialogue to go with them, try the{" "}
            <Link prefetch={false} href="/incorrect-quote-generator" className={linkClass}>incorrect quote generator</Link>, or start a new cast with the{" "}
            <Link prefetch={false} href="/random-character-generator" className={linkClass}>random character generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output, no name entered:"} sets={EXAMPLES} />
        </>
      }
    >
      <HeadcanonGenerator />
    </GeneratorPageShell>
  );
}
