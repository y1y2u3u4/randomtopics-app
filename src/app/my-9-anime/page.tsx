import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-anime";
const TITLE = "My 9 Anime — Make Your 3×3 Favorite Anime Grid, Free Template";
const DESCRIPTION =
  "Free My 9 Anime maker: search any anime series or film, tap 9 posters and download your 3×3 favorite anime grid as a PNG — the 9 anime that define you. English or romaji titles, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-anime", title: TITLE, description: DESCRIPTION, alt: "My 9 Anime template — a 3×3 grid of anime posters" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 anime", "my9anime", "my 9 animes", "9 anime that define me", "favorite anime grid", "3x3 anime grid", "anime grid template"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 anime grid?", answer: "Search an anime in English or romaji, tap a poster to drop it into the next empty square, and fill all nine. Then press Download PNG or Share image." },
  { question: "Where do the posters come from?", answer: "Posters come from AniList's public database and load directly in your browser. Nothing is uploaded or stored by us." },
  { question: "Can I rearrange or replace a pick?", answer: "Tap a square and then another to swap them, or drag on a computer. To replace one, tap its square first and choose the new anime, or press \u00d7 to empty it." },
  { question: "Is there a watermark?", answer: "No \u2014 the image has only your title, optional name and the nine posters." },
  { question: "Can I share my grid as a link?", answer: "Copy link stores your nine picks in the page address so anyone can open the same grid. Uploaded pictures stay on your device." },
];

export default function MyNineAnimePage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="My 9 Anime"
      heading={["My 9", "Anime"]}
      intro="Search any anime, tap 9 posters, download your 3×3 grid. Series and films, no signup, no watermark."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ}
      related={[{ href: "/my-9-albums", label: "My 9 Albums" }, { href: "/my-9-games", label: "My 9 Games" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }, { href: "/japanese-name-generator", label: "Japanese name generator" }]}
      content={
        <>
          <SectionTitle>What is My 9 Anime?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Anime</strong> is a 3\u00d73 grid of the nine anime that define your taste \u2014 a favorite way to introduce yourself on anime Twitter, Threads and Reddit. Pick your nine and the template lines up the posters for you." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "Nine anime that define me \u00b7 my comfort anime \u00b7 9 anime that got me into anime \u00b7 nine perfect openings \u00b7 my top 9 anime films \u00b7 9 underrated anime." }} />
        </>
      }
    >
      <NineGridMaker kind="anime" />
    </GeneratorPageShell>
  );
}
