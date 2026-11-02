import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import AestheticUsernameGenerator from "@/components/generators/AestheticUsernameGenerator";
import { AESTHETIC_HANDLES, AESTHETIC_VIBES, aestheticGenerator } from "@/lib/generators/aestheticUsername";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/aesthetic-username-generator";
const COUNT = AESTHETIC_HANDLES.length.toLocaleString("en-US");
const TITLE = `Aesthetic Username Generator — ${COUNT} Soft, Dark & Y2K Handles`;
const DESCRIPTION = `Free aesthetic username generator with ${COUNT} handles in ${AESTHETIC_VIBES.length} vibes: cottagecore, dark academia, kawaii, Y2K, ocean, celestial and grunge. Each one shows its length and whether it fits Instagram, TikTok, Pinterest and Discord.`;

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "Aesthetic Username Generator — handles checked for Instagram, TikTok, Pinterest and Discord" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["aesthetic username generator", "aesthetic usernames", "aesthetic usernames for instagram", "aesthetic tiktok usernames", "cottagecore username ideas", "dark academia usernames", "soft aesthetic usernames", "cute username generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Soft cottagecore", results: aestheticGenerator.generate({ vibe: ["soft"], format: ["dot"] }, 4, [], 21).results },
  { label: "Dark academia", results: aestheticGenerator.generate({ vibe: ["academia"], format: ["underscore"] }, 4, [], 22).results },
  { label: "Kawaii with a cute suffix", results: aestheticGenerator.generate({ vibe: ["kawaii"], format: ["suffix"] }, 4, [], 23).results },
];

const FAQ = [
  {
    question: "What makes a username aesthetic?",
    answer:
      "Two soft or moody words that paint one picture, kept lowercase and easy to read: velvet and lantern, lunar and moth. Short beats long, and a single clear mood works better than mixing three. Each vibe here draws from its own word list, so a cottagecore name never ends up with a grunge word.",
  },
  {
    question: "Can I use periods and underscores in an Instagram username?",
    answer:
      "Yes. Instagram usernames can contain letters, numbers, periods and underscores, and they cannot end with a period or use two periods in a row. Instagram is commonly cited as allowing up to 30 characters, though its help pages do not state the limit clearly, so keep names well under it. Every result here is checked against these rules.",
  },
  {
    question: "What are the TikTok username rules?",
    answer:
      "TikTok usernames use letters, numbers, underscores and periods, are between 2 and 24 characters, and cannot end with a period. The generator marks any result that would be too long for TikTok. With the longer suffix formats it is worth glancing at the character count shown under each name.",
  },
  {
    question: "Why does a name say it does not fit Pinterest?",
    answer:
      "Pinterest usernames allow letters, numbers and underscores, but not periods, and run 3 to 30 characters. So a dotted name like soft.petals fits Instagram, TikTok and Discord but not Pinterest. Pick the underscore or joined format if you want one handle that works on all four.",
  },
  {
    question: "Does it add symbols like stars, hearts or sparkles?",
    answer:
      "No, on purpose. Instagram, TikTok, Pinterest and Discord reject most symbols in the username itself, so a name with a star in it would simply fail to save. Put decorative symbols in your display name or bio instead, where they are allowed. If you want styled letters for that, the fancy text generator can do it.",
  },
  {
    question: "How do I know the username is not already taken?",
    answer:
      "A generator cannot see which handles are free, and nobody can promise that from outside the app. Paste your pick into the platform's sign-up or change-username screen to check. If it is taken, generate another from the same vibe, or switch the format, for example from joined to a dot or a cute suffix.",
  },
];

export default function AestheticUsernameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Aesthetic Username Generator"
      heading={["Aesthetic Username", "Generator"]}
      intro={`Get aesthetic usernames from ${COUNT} word pairings in seven vibes, with the length and platform fit shown for every one. Free, no sign-up, 10 per click.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          An aesthetic username generator pairs two mood words into a lowercase handle such as soft.petals or lunar_moth. This one covers
          cottagecore, dark academia, kawaii, Y2K, ocean, celestial and grunge, offers joined, dotted, underscored or cute-suffix formats,
          and shows the character count plus whether each name fits Instagram, TikTok, Pinterest and Discord. It is free and needs no
          sign-up.
        </>
      }
      related={[
        { href: "/username-generator", label: "Username generator" },
        { href: "/xbox-username-generator", label: "Xbox username generator" },
        { href: "/fancy-text-generator", label: "Fancy text generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/oc-name-generator", label: "OC name generator" },
      ]}
      content={
        <>
          <SectionTitle>Seven aesthetics, seven word lists</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Soft cottagecore</strong> — honey, clover, linen, bramble. Gentle names for cozy, plant-and-tea profiles.</li>
            <li><strong>Dark academia</strong> — ink, vellum, chapel, sonnet. Candlelit, bookish handles.</li>
            <li><strong>Kawaii</strong> — mochi, boba, bunny, pudding. Sweet and round, great for art and pet accounts.</li>
            <li><strong>Y2K</strong> — chrome, gloss, pixel, mixtape. Shiny early-2000s nostalgia.</li>
            <li><strong>Ocean</strong> — tide, coral, seaglass, lagoon. Salty, sun-faded and beachy.</li>
            <li><strong>Celestial</strong> — lunar, nebula, vesper, comet. Night-sky names for moon and star lovers.</li>
            <li><strong>Grunge</strong> — static, flannel, cassette, ember. Worn-in, noisy and a bit rebellious.</li>
          </ul>
          <SectionTitle>Platform rules the tool checks</SectionTitle>
          <p>
            Names are always lowercase, with no spaces or emoji. Instagram accepts letters, numbers, periods and underscores (30 characters is
            the commonly cited limit). TikTok accepts the same characters, up to 24, and no trailing period. Pinterest takes letters,
            numbers and underscores, 3 to 30. Discord usernames are 2 to 32 characters, lowercase, with letters, numbers, periods and
            underscores. These rules come from the platforms and from third-party guides, and platforms can change them, so treat the
            fit notes as a strong guide and let the sign-up screen have the last word.
          </p>
          <SectionTitle>Pick a format that travels</SectionTitle>
          <p>
            The joined format (<em>softmoonlit</em>) and the underscore format (<em>soft_moonlit</em>) work on all four platforms. The dotted
            format (<em>soft.moonlit</em>) looks lighter but misses Pinterest. The cute-suffix format adds <em>xo</em> or <em>uwu</em>, which
            suits kawaii and soft accounts and is easy to remember. Use the <em>Short</em> length filter if you want a handle that fits in
            a tag or caption without wrapping.
          </p>
          <SectionTitle>More ways to name yourself online</SectionTitle>
          <p>
            Want something more general? Try the{" "}
            <Link prefetch={false} href="/username-generator" className={linkClass}>username generator</Link>. For a gamer tag, the{" "}
            <Link prefetch={false} href="/xbox-username-generator" className={linkClass}>Xbox username generator</Link> keeps names within console limits.
            For a display name with styled letters, use the{" "}
            <Link prefetch={false} href="/fancy-text-generator" className={linkClass}>fancy text generator</Link>, and if your profile is
            for a character you drew or play, the{" "}
            <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link> can seed the first word.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note="Real output for three vibes and formats:" sets={EXAMPLES} />
        </>
      }
    >
      <AestheticUsernameGenerator />
    </GeneratorPageShell>
  );
}
