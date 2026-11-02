import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import CatchphraseGenerator from "@/components/generators/CatchphraseGenerator";
import { CATCH_CATS, CATCH_TOTAL, catchGenerator } from "@/lib/generators/catchphrase";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/catchphrase-generator";
const TITLE = `Catchphrase Generator — ${CATCH_TOTAL.toLocaleString("en-US")} Original Catchphrases for Any Character`;
const DESCRIPTION = `Free catchphrase generator with ${CATCH_TOTAL.toLocaleString("en-US")} original lines in ${CATCH_CATS.length} categories: hero, villain, funny sidekick, streamer sign-off, sports announcer, personal motto and brand slogan. Each shows who would say it.`;

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "Catchphrase Generator — signature lines for characters, streamers and brands" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["catchphrase generator", "catchphrase ideas", "character catchphrase generator", "funny catchphrases", "streamer catchphrase", "hero catchphrases", "villain catchphrases", "slogan ideas"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Hero lines", results: catchGenerator.generate({ category: ["hero"] }, 3, [], 31).results },
  { label: "Streamer sign-offs", results: catchGenerator.generate({ category: ["streamer"] }, 3, [], 32).results },
  { label: "Villain lines", results: catchGenerator.generate({ category: ["villain"] }, 3, [], 33).results },
];

const FAQ = [
  {
    question: "What makes a good catchphrase?",
    answer:
      "A good catchphrase is short enough to say in one breath, fits the speaker's personality and is easy to repeat. It works best when the same words can show up in different situations. Test yours by saying it out loud: if it sounds natural coming from that character, streamer or brand, keep it.",
  },
  {
    question: "Who is this catchphrase generator for?",
    answer:
      "Writers and game masters who need a signature line for a hero or villain, streamers and YouTubers looking for a sign-off, sports and event hosts who want an announcer call, teams that need a motto, and small brands brainstorming a slogan. Each result tells you the kind of speaker it suits.",
  },
  {
    question: "Are these catchphrases original?",
    answer:
      "Yes. Every line is built from hand-written templates and word pools, not copied from films, shows or ads. That means you can adapt them freely, but also run a quick search before you print one on merchandise or register it as a trademark, since a short phrase can accidentally match an existing one.",
  },
  {
    question: "How many different catchphrases can it make?",
    answer:
      `There are ${CATCH_TOTAL.toLocaleString("en-US")} distinct lines across ${CATCH_CATS.length} categories. Each template has one or two slots that are filled from a pool, so the same structure produces many different lines, and generating again gives you ten new ones without repeats in the same session.`,
  },
  {
    question: "Is this the same as the party game Catch Phrase?",
    answer:
      "No. Catch Phrase is a word-guessing party game where you describe a word without saying it. This tool makes signature lines for characters, streamers and brands. If you are looking for party-game prompts to act out, the charades page has word lists made for that.",
  },
  {
    question: "How do I make a catchphrase my own?",
    answer:
      "Swap in words from your own world: a place, a nickname, an inside joke. Change the rhythm so it sounds like how you actually talk, and say it the same way every time. A catchphrase becomes memorable through repetition, not through clever wording alone.",
  },
];

export default function CatchphraseGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Catchphrase Generator"
      heading={["Catchphrase", "Generator"]}
      intro={`Generate original catchphrases for heroes, villains, streamers, announcers and brands, each with a note on who would say it. ${CATCH_TOTAL.toLocaleString("en-US")} lines, free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A catchphrase generator creates a signature line a character, streamer, mascot or brand can repeat. This one writes original
          lines in seven categories (hero, villain, funny sidekick, streamer sign-off, sports announcer, personal motto, brand slogan)
          from hand-written templates, and every result says who would say it. It is free, shows 10 lines per click and needs no
          sign-up.
        </>
      }
      related={[
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/username-generator", label: "Username generator" },
        { href: "/charades", label: "Charades word generator" },
        { href: "/random-superpower-generator", label: "Random superpower generator" },
      ]}
      content={
        <>
          <SectionTitle>Seven kinds of catchphrase</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Hero</strong> — steady, protective lines for the character who steps forward.</li>
            <li><strong>Villain</strong> — smug, theatrical lines for the monologue and the finale.</li>
            <li><strong>Funny sidekick</strong> — nervous, snack-loving, always-right-about-the-bad-feeling humor.</li>
            <li><strong>Streamer sign-off</strong> — greetings and goodbyes for a channel that wants a repeatable ending.</li>
            <li><strong>Sports announcer</strong> — big calls for a fast break, a last-second finish or a roaring crowd.</li>
            <li><strong>Personal motto</strong> — short rules to live by, for a bio, a desk card or a team wall.</li>
            <li><strong>Brand slogan</strong> — benefit-first taglines for a shop, app or service.</li>
          </ul>
          <SectionTitle>How the lines are made</SectionTitle>
          <p>
            Each category has several templates written to sound like that kind of speaker. A template has a slot or two, and each slot
            draws from a short word pool picked so that every combination still reads naturally, for example <em>&quot;Hold the
            line. The old bridge is counting on us.&quot;</em> or <em>&quot;Real flavor, for real life.&quot;</em> Because the
            structure is fixed and the words change, you get hundreds of variations without gibberish.
          </p>
          <SectionTitle>Using a catchphrase well</SectionTitle>
          <p>
            Pick the version that sounds most like how the speaker already talks, then use it consistently. A streamer might say the
            same sign-off every night, a villain should deliver the line at the same dramatic moment, and a brand should print it in the
            same place. If you are building the character first, the{" "}
            <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link> and the{" "}
            <Link prefetch={false} href="/random-superpower-generator" className={linkClass}>random superpower generator</Link> give you a name and an ability to build the
            voice around.
          </p>
          <SectionTitle>Streamer and online-handle ideas</SectionTitle>
          <p>
            Building a channel? Pair your sign-off with a handle from the{" "}
            <Link prefetch={false} href="/username-generator" className={linkClass}>username generator</Link>. And if you were looking for
            the party game with a similar name, where you describe a word without saying it, the{" "}
            <Link prefetch={false} href="/charades" className={linkClass}>charades word generator</Link> has prompts for that.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note="Real output for three categories:" sets={EXAMPLES} />
        </>
      }
    >
      <CatchphraseGenerator />
    </GeneratorPageShell>
  );
}
