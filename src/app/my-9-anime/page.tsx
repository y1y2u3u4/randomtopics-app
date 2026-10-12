import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import NineGridTabs from "@/components/generators/NineGridTabs";
import NineGridExamples from "@/components/generators/NineGridExamples";
import EXAMPLES from "@/data/generators/my9Examples.json";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-anime";
const TITLE = "My 9 Anime Template — Make a 3×3 Grid of the 9 Anime That Made You";
const DESCRIPTION =
  "Free My 9 Anime template: search any anime series or film, pick the 9 anime that made you and download a 1080×1080 3×3 grid or story image. English or romaji titles, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-anime", title: TITLE, description: DESCRIPTION, alt: "My 9 Anime template — a 3×3 grid of anime posters" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 anime", "my9anime", "my 9 animes", "my 9 anime template", "9 anime that made me", "favorite anime grid", "3x3 anime grid"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 anime grid?", answer: "Search an anime in English or romaji, tap a poster to drop it into the next empty square, and fill all nine. Then press Download PNG or Share image." },
  { question: "Where do the posters come from?", answer: "Posters come from AniList's public database and load directly in your browser. Nothing is uploaded or stored by us." },
  { question: "Can I rearrange or replace a pick?", answer: "Tap a square and then another to swap them, or drag on a computer. To replace one, tap its square first and choose the new anime, or press × to empty it." },
  { question: "What size is the image?", answer: "1080×1080 pixels by default — the square size Instagram, X and Threads show best. Tick Story size for a 1080×1920 image for Instagram or TikTok stories. There is no watermark." },
  { question: "Can I share the grid as a link?", answer: "Copy link keeps your nine picks in the page address, so anyone who opens it sees the same grid and can download it too. Pictures you upload stay on your device and are not part of the link." },
];

export default function MyNineAnimePage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="My 9 Anime"
      heading={["My 9", "Anime"]}
      intro="Pick the 9 anime that made you — series and films — and download a square or story-size grid. No signup, no watermark."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ}
      related={[{ href: "/my-9-albums", label: "My 9 Albums" }, { href: "/my-9-games", label: "My 9 Games" }, { href: "/my-9-movies", label: "My 9 Movies" }, { href: "/my-9-books", label: "My 9 Books" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }, { href: "/japanese-name-generator", label: "Japanese name generator" }]}
      inShort="Search any anime in English or romaji, tap nine posters into the 3×3 grid, reorder them, and download a 1080×1080 PNG or a story-size image. Posters come from AniList and load straight into your browser; nothing is stored."
      afterTool={<NineGridExamples kind="anime" path={PATH} examples={EXAMPLES.anime} />}
      content={
        <>
          <SectionTitle>What is My 9 Anime?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Anime</strong> is a 3×3 grid of the nine anime that define your taste — a favorite way to introduce yourself on anime Twitter, Threads and Reddit. Pick your nine and the template lines up the posters for you." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "Nine anime that made me · my comfort anime · 9 anime that got me into anime · nine perfect openings · my top 9 anime films · 9 underrated anime." }} />
        </>
      }
    >
      <NineGridTabs current="anime" />
      <NineGridMaker kind="anime" />
    </GeneratorPageShell>
  );
}
