import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FourCharactersMaker from "@/components/generators/FourCharactersMaker";
import { EXAMPLES } from "@/lib/generators/fourCharacters";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/4-characters-i-like";
const TITLE = "4 Characters I Like Template — Free 2×2 Maker";
const DESCRIPTION =
  "Free 4 Characters I Like template: fill a 2×2 card with four favorite characters from anime, games, movies or books, add a one-line reason for each, then download a PNG or send a share link. No signup, no watermark.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "4 characters i like", "4 characters i like template", "4 characters i like maker", "four characters i like", "4 favorite characters",
    "2x2 characters template", "4 characters that describe me", "favorite characters template", "characters i like meme",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQ = [
  {
    question: "What is the “4 characters I like” trend?",
    answer: "It is a 2×2 picture of four fictional characters you like, posted on TikTok, X, Instagram and Tumblr. People often add why they like each one or what the four have in common, and friends reply with their own four.",
  },
  {
    question: "How do I make a 4 characters I like template?",
    answer: "Tap a square, then search an anime or manga character, upload a picture, or just type the name and pick an icon. Add where they are from and one line about why you like them. Repeat for all four, then press Download PNG or Copy share link.",
  },
  {
    question: "Can I add characters from games, movies, cartoons or books?",
    answer: "Yes. The search covers anime and manga characters (from AniList). For anyone else, type the name and either upload your own picture or use a generated card with an icon — it works for game, Disney, Marvel, book and TV characters alike.",
  },
  {
    question: "How does the share link work?",
    answer: "The names, sources, lines and icons are packed into the link after the # sign, which is never sent to a server. Characters picked from search reload their picture from AniList when your friend opens the link. Uploaded pictures stay on your device, so the link shows a generated card in their place.",
  },
  {
    question: "What size is the PNG?",
    answer: "1080×1350 pixels — the portrait size Instagram and TikTok photo posts use — with the four characters, their one-liners and the title. There is no watermark, only a small site address at the bottom.",
  },
  {
    question: "4 characters I like vs My 9 Characters — which should I use?",
    answer: "Use this 2×2 card when you want four picks with a reason for each. For a bigger 3×3 grid of nine favorites with character art, use the My 9 Characters template.",
  },
  {
    question: "Is this free? Do I need an account?",
    answer: "Free and unlimited with no account. This is an independent fan tool: character names belong to their creators, and the example cards use generated icons rather than official art.",
  },
];

export default function FourCharactersPage() {
  return (
    <GeneratorPageShell
      locale="en"
      compactHeroOnMobile
      path={PATH}
      name="4 Characters I Like"
      heading={["4 Characters", "I Like"]}
      intro="Fill a 2×2 card with four characters you like and why. Download a PNG or send a link. Free, no signup."
      description={DESCRIPTION}
      updated="2026-11-07"
      faq={FAQ}
      related={[
        { href: "/my-9-characters", label: "My 9 Characters (3×3)" },
        { href: "/my-9-anime", label: "My 9 Anime" },
        { href: "/my-9-games", label: "My 9 Games" },
        { href: "/my-9-shows", label: "My 9 Shows" },
      ]}
      inShort={
        <>
          A free <strong>4 characters I like</strong> template and maker: a 2×2 card with four favorite characters, where each is from and one line on why you
          like them, plus an optional “what they have in common”. Search anime and manga characters, upload any picture, or use a generated icon card for game,
          movie and book characters. Download a 1080×1350 PNG or copy a share link — the card is stored in the link itself, with no account and no watermark.
        </>
      }
      content={
        <>
          <SectionTitle>How to use the 4 characters I like maker</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Tap one of the four squares.</li>
            <li>Search an anime or manga character, upload a picture, or type any name and pick an icon.</li>
            <li>Add where they are from and one line about why you like them.</li>
            <li>Optionally write what the four have in common, then press <strong>Download PNG</strong> or <strong>Copy share link</strong>.</li>
          </ol>

          <SectionTitle>Examples</SectionTitle>
          <p>Tap an example above to load it, then swap in your own picks.</p>
          {EXAMPLES.map((ex) => (
            <div key={ex.id}>
              <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">{ex.card.title}</h3>
              <ul className="list-disc pl-5 text-sm">
                {ex.card.cells.map((c) => <li key={c.name}><strong>{c.name}</strong> ({c.from}) — {c.line}</li>)}
              </ul>
              {ex.card.common && <p className="text-sm italic">What they have in common: {ex.card.common}</p>}
            </div>
          ))}

          <SectionTitle>Ideas for your four</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>4 characters I relate to · 4 comfort characters · 4 characters that describe me</li>
            <li>4 villains I like · 4 side characters who deserved more · 4 characters I would trust with my life</li>
            <li>One character each from anime, a game, a movie and a book</li>
            <li>Four characters with the same trait — and say it in “what they have in common”</li>
          </ul>

          <SectionTitle>2×2 card or 3×3 grid?</SectionTitle>
          <p>
            Four squares leave room for a reason under every pick, which is what makes this format a conversation starter. If you would rather show nine favorites
            at a glance, use <Link prefetch={false} href="/my-9-characters" className={linkClass}>My 9 Characters</Link>, or the series grids for{" "}
            <Link prefetch={false} href="/my-9-anime" className={linkClass}>anime</Link>, <Link prefetch={false} href="/my-9-games" className={linkClass}>games</Link> and{" "}
            <Link prefetch={false} href="/my-9-shows" className={linkClass}>TV shows</Link>.
          </p>
        </>
      }
    >
      <FourCharactersMaker />
    </GeneratorPageShell>
  );
}
