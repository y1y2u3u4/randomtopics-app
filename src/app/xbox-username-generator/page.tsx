import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import XboxUsernameGenerator from "@/components/generators/XboxUsernameGenerator";
import { XBOX_TAGS, xboxGenerator } from "@/lib/generators/xbox";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/xbox-username-generator";
const TITLE = "Xbox Username Generator — Xbox Name & Gamertag Ideas (12-Character Rule)";
const DESCRIPTION = `Free Xbox username and Xbox name generator: ${XBOX_TAGS.length}+ gamertag ideas that all fit Xbox rules (12 characters or fewer, letters, numbers and spaces only). Pick sweaty, funny, OG or chill, short or full length, with or without numbers. Character count shown.`;

const SOCIAL = generatorSocial({ card: "fantasy-name-generator", title: TITLE, description: DESCRIPTION, alt: "Xbox Username Generator — gamertag ideas" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["xbox username generator", "xbox name generator", "xbox gamertag generator", "gamertag ideas", "xbox gamertag ideas", "cool xbox names", "funny gamertags", "sweaty gamertags", "og gamertags"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Sweaty", results: xboxGenerator.generate({ vibe: ["sweaty"] }, 4, [], 51).results },
  { label: "Funny", results: xboxGenerator.generate({ vibe: ["funny"] }, 4, [], 52).results },
  { label: "Short OG & chill", results: xboxGenerator.generate({ vibe: ["og", "chill"], length: ["short"] }, 4, [], 53).results },
];

const FAQ = [
  {
    question: "How long can an Xbox gamertag be?",
    answer:
      "A modern Xbox gamertag can be up to 12 characters, and if someone already has your name Xbox adds a # and a few digits to make it unique (the full tag is capped at 16 characters, so a 12-character name gets a 3-digit suffix). Older \"classic\" gamertags allowed up to 15 characters. Every name from this generator is 12 characters or fewer, so it fits both.",
  },
  {
    question: "What characters are allowed in an Xbox gamertag?",
    answer:
      "Letters, numbers and spaces are always safe. Classic gamertags allow only those; modern gamertags also accept letters from other alphabets. This generator uses only English letters, numbers and an optional single space, so the names work on every Xbox, PC and Xbox app.",
  },
  {
    question: "What if the gamertag I like is taken?",
    answer:
      "On a modern gamertag, Xbox gives you the name anyway with a number suffix, like LazyOtter#482. If you want a name without a suffix, try the With a space format, add your own numbers, or generate a few more: there are hundreds of combinations per vibe. Xbox's own change-gamertag page shows whether a name is available before you claim it.",
  },
  {
    question: "What is a sweaty or OG gamertag?",
    answer:
      "Sweaty gamertags sound like a competitive player: cold, short words like Void, Frag, Wraith or Viper. OG gamertags use the classic 2000s style: Dark, Shadow, Wolf, Dragon. Funny gamertags pair a silly adjective with a food or animal, and chill ones sound cozy and soft.",
  },
  {
    question: "How do I change my Xbox gamertag?",
    answer:
      "Go to your profile on Xbox (or the Xbox app), choose Customize profile, then select the gamertag and enter a new one. Your first change is free; later changes may cost a small fee. Copy a name from this generator, then check it there.",
  },
  {
    question: "Can I use these names on PlayStation, Steam or Discord too?",
    answer:
      "Yes. Short names made of letters and numbers work almost everywhere. For platform-specific limits (Discord, Twitch, Roblox, Fortnite), use the username generator, which checks the rules for each platform.",
  },
];

export default function XboxUsernameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Xbox Username Generator"
      heading={["Xbox Username", "Generator"]}
      intro="An Xbox name generator for gamertag ideas that already fit Xbox rules: 12 characters or fewer, letters, numbers and spaces only. Pick a vibe and generate 10 at a time — free, no sign-up."
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          An Xbox username generator suggests gamertags you can use on Xbox. Every name here is checked against Xbox&apos;s limits (12
          characters or fewer, English letters, numbers and spaces), shows its character count, and comes in four vibes: sweaty, funny,
          classic OG and chill. Choose short names, joined words, a space or numbers. Free, no sign-up.
        </>
      }
      related={[
        { href: "/username-generator", label: "Username generator" },
        { href: "/fantasy-name-generator", label: "Fantasy name generator" },
        { href: "/orc-name-generator", label: "Orc name generator" },
        { href: "/random-superpower-generator", label: "Random superpower generator" },
      ]}
      content={
        <>
          <SectionTitle>Gamertags that pass the Xbox rules</SectionTitle>
          <p>
            Plenty of name lists hand you tags that Xbox will reject because they are too long or use symbols. This{" "}
            <strong>Xbox gamertag generator</strong> only builds names that fit: at most 12 characters, using English letters, digits and
            at most one space. Each result shows its length (for example 11/12) and how it would look with Xbox&apos;s number suffix if the
            name is already taken.
          </p>
          <SectionTitle>Pick a vibe</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Sweaty / competitive</strong> — short and cold, for ranked and shooters: Void Wraith, FragViper.</li>
            <li><strong>Funny</strong> — the tag that makes a lobby laugh: SoggyWaffle, Sir Noodle.</li>
            <li><strong>Classic OG</strong> — the 2000s Xbox Live style: DarkPhoenix, IronBandit.</li>
            <li><strong>Chill / aesthetic</strong> — soft and cozy for casual games: LazyOtter, Misty Fern.</li>
          </ul>
          <SectionTitle>Short, spaced or with numbers</SectionTitle>
          <p>
            Short names (8 characters or fewer) are easiest for friends to type and search. <em>With a space</em> often gets you a name
            others haven&apos;t claimed, since many players skip spaces. <em>Add numbers</em> appends 2–3 digits only when there is
            room left under the 12-character limit, so nothing gets cut off.
          </p>
          <SectionTitle>More name ideas</SectionTitle>
          <p>
            Need the same name for Discord, Twitch or Roblox? The{" "}
            <Link prefetch={false} href="/username-generator" className={linkClass}>username generator</Link> checks each platform&apos;s
            rules. For a character-style tag, borrow a name from the{" "}
            <Link prefetch={false} href="/fantasy-name-generator" className={linkClass}>fantasy name generator</Link> or the{" "}
            <Link prefetch={false} href="/orc-name-generator" className={linkClass}>orc name generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for each vibe:"} sets={EXAMPLES} />
        </>
      }
    >
      <XboxUsernameGenerator />
    </GeneratorPageShell>
  );
}
