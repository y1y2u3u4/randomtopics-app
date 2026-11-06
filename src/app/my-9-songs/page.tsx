import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import NineGridTabs from "@/components/generators/NineGridTabs";
import NineGridExamples from "@/components/generators/NineGridExamples";
import EXAMPLES from "@/data/generators/my9Examples.json";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-songs";
const TITLE = "My 9 Songs Template — Make a 3×3 Grid of Your 9 Favorite Songs";
const DESCRIPTION =
  "Free My 9 Songs template: search any song or track, pick your 9 favorite songs and download a 1080×1080 3×3 cover-art grid or story image. Art from iTunes, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-songs", title: TITLE, description: DESCRIPTION, alt: "My 9 Songs template — a 3×3 grid" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 songs", "my 9 tracks", "my9songs", "my 9 songs template", "my 9 favorite songs", "9 songs that made me", "favorite songs grid"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 songs grid?", answer: "Search a song title, ideally with the artist, tap the result to drop it into the next empty square and fill all nine. Then press Download PNG, or Share image on a phone." },
  { question: "Is this the same as My 9 Albums?", answer: "It uses the same maker, but searches single tracks, so a song shows the cover of the release it is on and the caption shows the song title, not the album name." },
  { question: "Why do two songs have the same cover?", answer: "Songs from the same album share its artwork. Pick a single or live version from the results if you want different covers, or upload your own picture." },
  { question: "What size is the image?", answer: "1080×1080 pixels by default. Tick Story size for a 1080×1920 image for Instagram or TikTok stories. There is no watermark." },
  { question: "Can I share the grid as a link?", answer: "Copy link keeps your nine songs in the page address, so anyone who opens it sees the same grid. Uploaded pictures are not part of the link." },
];

export default function MyNineSongsPage() {
  return (
    <GeneratorPageShell
      locale="en"
      compactHeroOnMobile
      path={PATH}
      name="My 9 Songs"
      heading={["My 9", "Songs"]}
      intro="Pick the 9 songs that made you and download a square or story-size grid of their cover art. No signup, no watermark."
      description={DESCRIPTION}
      updated="2026-11-03"
      faq={FAQ}
      related={[{ href: "/my-9-albums", label: "My 9 Albums" }, { href: "/my-9-artists", label: "My 9 Artists" }, { href: "/my-9-movies", label: "My 9 Movies" }, { href: "/my-9-shows", label: "My 9 Shows" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }]}
      inShort="Search any song, tap nine tracks into the 3×3 grid, reorder them, and download a 1080×1080 PNG or a story-size image with song titles as captions. Cover art comes from the iTunes catalog; upload your own picture for anything missing."
      afterTool={<NineGridExamples kind="songs" path={PATH} examples={EXAMPLES.songs} />}
      content={
        <>
          <SectionTitle>What is My 9 Songs?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Songs</strong> (also called my 9 tracks) is a 3×3 grid of the nine songs you could not live without, shown as their cover art with song-title captions." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p>9 songs that made me · my summer playlist in 9 tracks · 9 songs I'd play at my wedding · my all-time karaoke picks · 9 songs from my childhood · this year's top 9.</p>
        </>
      }
    >
      <NineGridTabs current="songs" />
      <NineGridMaker kind="songs" />
    </GeneratorPageShell>
  );
}
