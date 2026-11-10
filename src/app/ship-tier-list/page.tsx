import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import ShipTierListMaker from "@/components/generators/ShipTierListMaker";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/ship-tier-list";
const TITLE = "Ship Tier List Maker — Rank Your Ships & Moe Types Free";
const DESCRIPTION =
  "Free ship tier list maker: add your ships (A × B), characters or moe archetypes, drag them into S, A, B, C, D and F rows, and download the tier list as a PNG or send a link. Works on phones. No signup, no watermark.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "ship tier list", "ship tier list maker", "ships tier list", "otp tier list", "ship dynamics tier list", "moe tier list",
    "romance tropes tier list", "character tier list maker", "tier list template", "anime ship tier list",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQ = [
  {
    question: "How do I make a ship tier list?",
    answer: "Type the two names of each ship and press Add — it appears as “A × B” in the unranked area. Drag each ship into a tier (S is best, F is worst). On a phone, tap a ship and then tap the row. When you are done, press Download PNG or Copy link.",
  },
  {
    question: "Can I rank characters or moe archetypes instead of ships?",
    answer: "Yes. Switch to “Characters / moe” and type names separated by commas, or load the Moe archetypes template (tsundere, kuudere, dandere, yandere and more). You can also rank ship dynamics or romance tropes with the built-in templates.",
  },
  {
    question: "Can I add pictures?",
    answer: "Yes — press Add pictures and choose one or more images; each becomes a tile named after its file, which you can rank like any other item. Pictures are only used on your device and inside the PNG you download.",
  },
  {
    question: "How does the share link work?",
    answer: "The title, item names and their tiers are packed into the link after the # sign, which is never sent to a server. Friends who open it see your tier list and can press “Rank them yourself” to make their own from the same items. Uploaded pictures are not included in links.",
  },
  {
    question: "What do S, A, B, C, D and F mean?",
    answer: "S is the top tier — your absolute favorites or OTPs. A and B are ships you like, C is neutral, D is ones you would skip and F is the bottom: ships you actively dislike. The letters come from school grades plus the gaming “S rank”.",
  },
  {
    question: "Is it free?",
    answer: "Yes, free with no account and no watermark beyond a small site address at the bottom of the image. It is an independent fan tool; character names belong to their creators.",
  },
];

const TEMPLATES = [
  { name: "Ship dynamics", items: "grumpy × sunshine, enemies to lovers, tall × short, rivals to lovers, golden retriever × black cat, mutual pining, bodyguard × prince, childhood friends, fake dating, chaos × calm" },
  { name: "Romance tropes", items: "only one bed, forced proximity, second chance, slow burn, love triangle, arranged marriage, secret identity, hurt / comfort, soulmates, time travel" },
  { name: "Moe archetypes", items: "tsundere, kuudere, dandere, yandere, deredere, genki girl, onee-san, imouto, ojou-sama, meganekko, chuunibyou, himedere" },
];

export default function ShipTierListPage() {
  return (
    <GeneratorPageShell
      locale="en"
      compactHeroOnMobile
      path={PATH}
      name="Ship Tier List Maker"
      heading={["Ship Tier", "List Maker"]}
      intro="Drag your ships, characters or moe types into S–F tiers. Download the image or send a link. Free, no signup."
      description={DESCRIPTION}
      updated="2026-11-10"
      faq={FAQ}
      related={[
        { href: "/ship-dynamic-template", label: "My Favorite Ship Dynamic" },
        { href: "/4-characters-i-like", label: "4 Characters I Like" },
        { href: "/my-9-characters", label: "My 9 Characters" },
        { href: "/my-9-anime", label: "My 9 Anime" },
      ]}
      inShort={
        <>
          A free <strong>ship tier list maker</strong>: add ships as “A × B”, characters, moe archetypes or pictures, then drag them into S, A, B, C, D and F rows
          (tap-to-place on phones). Start from templates for ship dynamics, romance tropes or moe types. Download a PNG or copy a link that stores the whole tier
          list — no account, no watermark, and pictures never leave your device.
        </>
      }
      content={
        <>
          <SectionTitle>How to use the ship tier list maker</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Pick a template, or press Clear and add your own ships (two names each) or characters.</li>
            <li>Drag every item from the unranked area into a tier. On a phone: tap the item, then tap the row.</li>
            <li>Drag an item onto another to put it in front of it; press × to delete it.</li>
            <li>Rename the title, then press <strong>Download PNG</strong> or <strong>Copy link</strong>.</li>
          </ol>

          <SectionTitle>Built-in tier list templates</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            {TEMPLATES.map((t) => <li key={t.name}><strong>{t.name}</strong> — {t.items}</li>)}
          </ul>

          <SectionTitle>Ideas for your tier list</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>Every ship in one fandom, from OTP to “absolutely not”</li>
            <li>Your friends’ ships ranked by how canon they are</li>
            <li>Moe archetypes you fall for vs ones you can’t stand</li>
            <li>Romance tropes in the books or dramas you read this year</li>
          </ul>

          <SectionTitle>Show your favorite dynamic</SectionTitle>
          <p>
            Your S-tier pick deserves a picture: draw it as a stick-figure meme with the{" "}
            <Link prefetch={false} href="/ship-dynamic-template" className={linkClass}>my favorite ship dynamic template</Link>, or post your favorite characters
            with <Link prefetch={false} href="/4-characters-i-like" className={linkClass}>4 Characters I Like</Link>.
          </p>
        </>
      }
    >
      <ShipTierListMaker />
    </GeneratorPageShell>
  );
}
