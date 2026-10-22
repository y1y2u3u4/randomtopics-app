import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import UsernameGenerator from "@/components/generators/UsernameGenerator";
import { PLATFORM_RULES, USERNAME_NOUNS, usernameGenerator } from "@/lib/generators/username";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/username-generator";
const TITLE = "Username Generator — Gaming, Cute, Cool & Instagram Names";
const DESCRIPTION = `Free username generator: ${USERNAME_NOUNS.length * 30}+ gaming, cute, cool and Instagram-style usernames. Pick a length, add numbers, choose a format, and see which platforms (Instagram, TikTok, Roblox, Xbox, Discord) each name fits.`;

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "Username Generator — gaming, cute, cool and Instagram usernames" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["username generator", "gaming username generator", "cute usernames", "cool usernames", "instagram username ideas", "username ideas", "roblox username generator", "aesthetic usernames"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Gaming", results: usernameGenerator.generate({ style: ["gaming"] }, 4, [], 41).results },
  { label: "Cute, short", results: usernameGenerator.generate({ style: ["cute"], length: ["short"] }, 4, [], 42).results },
  { label: "Instagram / aesthetic", results: usernameGenerator.generate({ style: ["aesthetic"], format: ["dot"] }, 4, [], 43).results },
  { label: "Cool, with numbers", results: usernameGenerator.generate({ style: ["cool"], numbers: ["on"] }, 4, [], 44).results },
];

const FAQ = [
  {
    question: "How does this username generator work?",
    answer:
      "Each username pairs a style word (like Sniper, Mochi, Echo or Velvet) with a matching adjective, then applies the format you pick: CamelCase, lowercase, under_score or dot.ted. You can add numbers and limit the length. Every result shows its character count and the platforms whose username rules it fits.",
  },
  {
    question: "Does it check if a username is taken?",
    answer:
      "No site can check every platform's database without logging in, so this page checks the part it can: the character and length rules of Instagram, TikTok, Roblox, Twitch, Xbox and Discord. If a name fits, try it in the platform's sign-up or rename screen — that screen gives the real answer in a second.",
  },
  {
    question: "What makes a good gaming username?",
    answer:
      "Short, easy to say on voice chat, and with no hard-to-type characters. Two words in CamelCase (like SilentReaper) read well on a scoreboard. Avoid long number strings — they look like a default name. Xbox gamertags are capped at 12 characters, so use the Short filter if you play there.",
  },
  {
    question: "What is a good Instagram username?",
    answer:
      "Aesthetic usernames are usually lowercase with a dot or underscore, like soft.meadow or golden_cove. Instagram allows up to 30 letters, numbers, dots and underscores, but no dot at the end. Pick the Instagram / aesthetic style and the dot.ted format to get names in that look.",
  },
  {
    question: "Can I use these names for Roblox?",
    answer:
      "Yes. Roblox usernames must be 3 to 20 characters, using letters, numbers and at most one underscore that is not at the start or end. Each result tells you if it fits Roblox, so you can skip the ones that don't.",
  },
  {
    question: "How do I make a username unique if it's taken?",
    answer:
      "Turn on Add numbers for a short suffix like 77 or 404, switch the format (a name taken as CamelCase may be free with an underscore), or roll again with the same filters. A small change you like is better than a long string of random digits.",
  },
];

const yes = <span className="text-[var(--neon-cyan)]">Yes</span>;
const no = <span className="text-[var(--text-muted)]">No</span>;
const COMPARE: [string, React.ReactNode, React.ReactNode][] = [
  ["Platform fit shown on every name (Instagram, TikTok, Roblox, Twitch, Xbox, Discord)", yes, no],
  ["Gaming, cute, cool and Instagram styles you can mix", yes, "One style, or a keyword box only"],
  ["Length filter (short, medium, long)", yes, "Rare"],
  ["Format choice: CamelCase, lowercase, under_score, dot.ted", yes, "Rare"],
  ["Numbers on or off", yes, "Sometimes"],
  ["Character count on every result", yes, no],
  ["Lock the names you like, re-roll the rest", yes, no],
  ["Share link to the exact list", yes, no],
  ["No sign-up, no email, no ads in the result list", yes, "Often asks for an email or shows ads between names"],
];

export default function UsernameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Username Generator"
      heading={["Username", "Generator"]}
      intro="Gaming, cute, cool and Instagram usernames — pick a length and format, and see which platforms each name fits."
      description={DESCRIPTION}
      updated="2026-10-22"
      faq={FAQ}
      inShort="Pick a style (gaming, cute, cool or Instagram), set the length, numbers and format, then tap Generate. Every username shows its length and which platforms' rules it fits, so you only try names that will be accepted."
      related={[
        { href: "/fancy-text-generator", label: "Fancy text generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/glitch-text-generator", label: "Glitch text generator" },
        { href: "/city-name-generator", label: "City name generator" },
      ]}
      content={
        <>
          <SectionTitle>Usernames that fit where you’ll use them</SectionTitle>
          <p>
            Most <strong>username generators</strong> give you a list of names and leave you to find out at sign-up that half of them are too
            long or use a character the platform rejects. This one checks each name against the rules of six platforms as it generates it.
            The line under each name tells you where it fits — so an 11-character CamelCase name is flagged as too long for an Xbox
            gamertag, and a dotted name is flagged as not allowed on Roblox.
          </p>
          <SectionTitle>Platform username rules</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">Platform</th>
                  <th className="py-2 pr-3">Length and allowed characters</th>
                </tr>
              </thead>
              <tbody>
                {PLATFORM_RULES.map((p) => (
                  <tr key={p.name} className="border-b border-white/10 align-top">
                    <td className="py-2 pr-3 font-medium">{p.name}</td>
                    <td className="py-2 pr-3">{p.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Rules as published by each platform, checked October 2026.</p>
          <SectionTitle>How to check if a username is available</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Generate a list and lock the three or four names you like most.</li>
            <li>Look at the “Fits the rules on” line — skip any name that doesn’t list your platform.</li>
            <li>Open the platform’s sign-up or change-username screen and type the name. It tells you right away if it’s taken.</li>
            <li>If it’s taken, switch the format or add numbers and try again. Names that differ only by an underscore are often free.</li>
          </ol>
          <SectionTitle>Pick a style</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Gaming</strong> — tough, fast names like SilentReaper or toxic_viper that read well on a kill feed.</li>
            <li><strong>Cute</strong> — soft, friendly names like sleepy.mochi or fluffybunny for Discord, TikTok and pets of the internet.</li>
            <li><strong>Cool</strong> — short, sleek names like LunarEcho or static_drift that suit any platform.</li>
            <li><strong>Instagram / aesthetic</strong> — calm, lowercase names like soft.meadow or golden_cove.</li>
          </ul>
          <p>
            Want your name to stand out in a bio or a Discord nickname? Paste it into the{" "}
            <Link href="/fancy-text-generator" className={linkClass}>fancy text generator</Link> for 30+ font styles, or the{" "}
            <Link href="/glitch-text-generator" className={linkClass}>glitch text generator</Link> for a corrupted look. For characters in a
            story, the <Link href="/character-name-generator" className={linkClass}>character name generator</Link> is a better fit.
          </p>
          <SectionTitle>How this username generator compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">Feature</th>
                  <th className="py-2 pr-3">This page</th>
                  <th className="py-2 pr-3">Typical username generators</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([f, us, them]) => (
                  <tr key={f} className="border-b border-white/10 align-top">
                    <td className="py-2 pr-3">{f}</td>
                    <td className="py-2 pr-3">{us}</td>
                    <td className="py-2 pr-3">{them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Compared with the top results for “username generator” in October 2026.</p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for each style:"} sets={EXAMPLES} />
        </>
      }
    >
      <UsernameGenerator />
    </GeneratorPageShell>
  );
}
