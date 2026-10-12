import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import NineGridTabs from "@/components/generators/NineGridTabs";
import NineGridExamples from "@/components/generators/NineGridExamples";
import EXAMPLES from "@/data/generators/my9Examples.json";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-albums";
const TITLE = "My 9 Albums Template — 3×3 Album Grid Maker for Your 9 Favorite Albums";
const DESCRIPTION =
  "Free My 9 Albums template: search any album, pick the 9 albums that made you and download a 1080×1080 3×3 album grid (or a story-size poster). Real album art, reorder by tapping, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-albums", title: TITLE, description: DESCRIPTION, alt: "My 9 Albums template — a 3×3 grid of album covers" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 albums", "my 9 albums template", "my9albums", "my 9 favorite albums", "3x3 album grid maker", "9 albums that made me", "9 albums that define me", "album grid maker"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 albums grid?", answer: "Type an album or artist into the search box and tap a cover to drop it into the next empty square. When all nine squares are filled, press Download PNG (or Share image on your phone) and post it." },
  { question: "Can I change the order?", answer: "Yes. Tap one square, then tap another to swap them, or drag a cover onto another square on a computer. To replace a cover, tap its square first and then pick the new album." },
  { question: "What size is the image?", answer: "1080×1080 pixels by default — the square size Instagram, X and Threads show best. Tick Story size for a 1080×1920 image for Instagram or TikTok stories. There is no watermark." },
  { question: "Where do the covers come from?", answer: "Album art comes from Deezer's and Apple's public music catalogs and loads straight into your browser. We don't upload or store your grid. If an album is missing, upload your own picture for that square." },
  { question: "Can I share the grid as a link?", answer: "Copy link keeps your nine picks in the page address, so anyone who opens it sees the same grid and can download it too. Pictures you upload stay on your device and are not part of the link." },
];

export default function MyNineAlbumsPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="My 9 Albums"
      heading={["My 9", "Albums"]}
      intro="Pick the 9 albums that made you, then download a square or story-size grid. Real album art, no signup, no watermark."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ}
      related={[{ href: "/my-9-games", label: "My 9 Games" }, { href: "/my-9-movies", label: "My 9 Movies" }, { href: "/my-9-anime", label: "My 9 Anime" }, { href: "/my-9-books", label: "My 9 Books" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }, { href: "/random-word-generator", label: "Random word generator" }]}
      inShort="Search any album, tap nine covers into the 3×3 grid, reorder them by tapping two squares, then download a 1080×1080 PNG (or a 1080×1920 story). It is free, needs no account, adds no watermark, and the covers load straight from Deezer's and Apple's music catalogs into your browser."
      afterTool={<NineGridExamples kind="albums" path={PATH} examples={EXAMPLES.albums} />}
      content={
        <>
          <SectionTitle>What is My 9 Albums?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Albums</strong> is a social trend: a 3×3 grid of the nine albums that made you, shared on X, Threads, Instagram and Reddit. This free template does the fiddly part — finding clean square cover art and lining it up — so you only have to choose." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "Nine albums that made me · nine albums I'd take to a desert island · my 9 albums of the year · my 9 albums from high school · nine perfect albums with no skips · 9 albums to introduce someone to a genre." }} />
        </>
      }
    >
      <NineGridTabs current="albums" />
      <NineGridMaker kind="albums" />
    </GeneratorPageShell>
  );
}
