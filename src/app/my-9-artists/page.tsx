import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import NineGridTabs from "@/components/generators/NineGridTabs";
import NineGridExamples from "@/components/generators/NineGridExamples";
import EXAMPLES from "@/data/generators/my9Examples.json";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-artists";
const TITLE = "My 9 Artists Template — Make a 3×3 Grid of Your 9 Favorite Artists";
const DESCRIPTION =
  "Free My 9 Artists template: search any singer, band or rapper, pick your 9 favorite artists and download a 1080×1080 3×3 photo grid or story image. Photos from Wikipedia, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-artists", title: TITLE, description: DESCRIPTION, alt: "My 9 Artists template — a 3×3 grid" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 artists", "my 9 favorite artists", "my9artists", "my 9 artists template", "9 artists that made me", "favorite artists grid", "favorite bands grid"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 artists grid?", answer: "Search an artist or band, tap their photo to drop it into the next empty square and fill all nine. Then press Download PNG, or Share image on a phone." },
  { question: "Where do the artist photos come from?", answer: "From each musician's Wikipedia article, usually a freely licensed concert or portrait photo. If an artist has no photo there, upload your own picture or an album cover." },
  { question: "Can I use album covers instead of photos?", answer: "Yes — use My 9 Albums for covers, or My 9 Songs for single tracks. All three use the same maker and the same image sizes." },
  { question: "What size is the image?", answer: "1080×1080 pixels by default. Tick Story size for a 1080×1920 image for Instagram or TikTok stories. There is no watermark." },
  { question: "Can I share the grid as a link?", answer: "Copy link keeps your nine artists in the page address, so anyone who opens it sees the same grid. Uploaded pictures are not part of the link." },
];

export default function MyNineArtistsPage() {
  return (
    <GeneratorPageShell
      locale="en"
      compactHeroOnMobile
      path={PATH}
      name="My 9 Artists"
      heading={["My 9", "Artists"]}
      intro="Pick your 9 favorite singers, bands and rappers and download a square or story-size photo grid. No signup, no watermark."
      description={DESCRIPTION}
      updated="2026-11-03"
      faq={FAQ}
      related={[{ href: "/my-9-albums", label: "My 9 Albums" }, { href: "/my-9-songs", label: "My 9 Songs" }, { href: "/my-9-movies", label: "My 9 Movies" }, { href: "/my-9-games", label: "My 9 Games" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }]}
      inShort="Search any singer, band, rapper or DJ, tap nine photos into the 3×3 grid, reorder them, and download a 1080×1080 PNG or a story-size image. Photos come from each artist's Wikipedia article; upload a picture for anyone missing."
      afterTool={<NineGridExamples kind="artists" path={PATH} examples={EXAMPLES.artists} />}
      content={
        <>
          <SectionTitle>What is My 9 Artists?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Artists</strong> (or my 9 favorite artists) is a 3×3 grid of the musicians who define your taste, shared on X, TikTok and Instagram as a quick music-taste card." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p>my 9 favorite artists · 9 bands that made me · my rap top 9 · artists I've seen live · 9 artists I'd save from a fire · my most-played artists this year.</p>
        </>
      }
    >
      <NineGridTabs current="artists" />
      <NineGridMaker kind="artists" />
    </GeneratorPageShell>
  );
}
