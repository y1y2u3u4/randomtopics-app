import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import ShipDynamicMaker from "@/components/generators/ShipDynamicMaker";
import { PRESETS } from "@/lib/generators/shipDynamic";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/ship-dynamic-template";
const TITLE = "My (Least) Favorite Ship Dynamic Template — Free Maker";
const DESCRIPTION =
  "Free “my favorite ship dynamic” and “my least favorite ship dynamic” template: pick a stick-figure dynamic (grumpy × sunshine, enemies to lovers, tall × short…), type the two names, add face pictures if you like, and download a PNG. No signup, no watermark.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "my favorite ship dynamic", "my least favorite ship dynamic", "ship dynamic template", "ship dynamic meme", "favorite ship dynamic template",
    "ship dynamics", "ship dynamic maker", "stick figure ship dynamic", "otp template", "ship meme template",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQ = [
  {
    question: "What is the “my favorite ship dynamic” meme?",
    answer: "A fan-art format that started on Twitter around 2019: two stick figures act out a romantic dynamic — one grumpy and one sunny, one tall and one tiny, one chaotic and one holding the leash — under the words “my favorite ship dynamic”. People reply with their own pair, or post a “my least favorite ship dynamic” panel next to it.",
  },
  {
    question: "How do I make my own ship dynamic picture?",
    answer: "Choose 1, 2 or 4 panels, pick a dynamic for each panel, type the two names and (optionally) upload a face picture for each stick figure. The preview updates as you type. Press Download PNG to save it, or Copy link to send the text version to a friend.",
  },
  {
    question: "Can I do favorite and least favorite side by side?",
    answer: "Yes — that is the default. Pick 2 panels: the top one is headed “My favorite ship dynamic” and the bottom one “My least favorite ship dynamic”. Use the heart buttons to switch a panel’s heading, or type your own heading such as “My OTP”.",
  },
  {
    question: "Which ship dynamics are included?",
    answer: `${PRESETS.length} classic dynamics: ${PRESETS.map((p) => p.label).join(", ")}. Each one comes with a stick-figure pose and a caption you can rewrite.`,
  },
  {
    question: "Are my uploaded face pictures uploaded anywhere?",
    answer: "No. Pictures are drawn on your device and only end up inside the PNG you download. The share link carries the text only (headings, dynamics, names, captions), so friends who open it see plain stick-figure heads.",
  },
  {
    question: "What size is the image?",
    answer: "One panel is a 1080×1080 square; two or four panels make a 1080×1350 portrait, the size Instagram, TikTok and X photo posts use. There is no watermark, only a small site address at the bottom.",
  },
  {
    question: "How do I rank all my ships instead?",
    answer: "Use the Ship Tier List Maker: type your ships (A × B) or characters, then drag them into S, A, B, C, D and F rows and download the tier list as an image.",
  },
];

export default function ShipDynamicPage() {
  return (
    <GeneratorPageShell
      locale="en"
      compactHeroOnMobile
      path={PATH}
      name="Ship Dynamic Template"
      heading={["My Favorite", "Ship Dynamic"]}
      intro="Pick a stick-figure dynamic, type two names, download the picture. Favorite and least favorite. Free, no signup."
      description={DESCRIPTION}
      updated="2026-11-10"
      faq={FAQ}
      related={[
        { href: "/ship-tier-list", label: "Ship Tier List Maker" },
        { href: "/4-characters-i-like", label: "4 Characters I Like" },
        { href: "/my-9-characters", label: "My 9 Characters" },
        { href: "/my-9-anime", label: "My 9 Anime" },
      ]}
      inShort={
        <>
          A free <strong>ship dynamic template</strong> for the “my favorite ship dynamic” / “my least favorite ship dynamic” meme: two stick figures per panel
          acting out a dynamic such as grumpy × sunshine, enemies to lovers, tall × short or golden retriever × black cat, with the two names under their feet.
          Make 1, 2 or 4 panels, add face pictures if you like, and download a 1080-pixel PNG — no account, no watermark, pictures stay on your device.
        </>
      }
      content={
        <>
          <SectionTitle>How to make a ship dynamic meme</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Choose how many panels you want — 2 gives the classic favorite vs least favorite layout.</li>
            <li>For each panel, tap a dynamic below the preview (or press 🎲 Random).</li>
            <li>Type the two names — characters, your friends, or “me” and “my crush”.</li>
            <li>Optionally add a face picture for each stick figure and rewrite the caption.</li>
            <li>Press <strong>Download PNG</strong>, or <strong>Copy link</strong> to send it.</li>
          </ol>

          <SectionTitle>All ship dynamics in the template</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            {PRESETS.map((p) => (
              <li key={p.id}><strong>{p.emoji} {p.label}</strong> — “{p.caption}”</li>
            ))}
          </ul>

          <SectionTitle>Favorite vs least favorite ship dynamic</SectionTitle>
          <p>
            The meme works best as a pair: the dynamic you would read a 200-chapter fic about, and the one you scroll past. Common “least favorite” picks are
            falls first × doesn’t notice, protective-to-the-point-of-controlling, and constant bickering with no payoff — but a dynamic one person hates is someone
            else’s OTP, which is why the replies are the fun part.
          </p>

          <SectionTitle>Rank your ships next</SectionTitle>
          <p>
            Got more than four ships? Put them all in the <Link prefetch={false} href="/ship-tier-list" className={linkClass}>ship tier list maker</Link>. Want
            to show off characters instead of pairs? Try <Link prefetch={false} href="/4-characters-i-like" className={linkClass}>4 Characters I Like</Link> or the
            3×3 <Link prefetch={false} href="/my-9-characters" className={linkClass}>My 9 Characters</Link> grid.
          </p>
        </>
      }
    >
      <ShipDynamicMaker />
    </GeneratorPageShell>
  );
}
