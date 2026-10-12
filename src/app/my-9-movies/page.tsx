import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import NineGridTabs from "@/components/generators/NineGridTabs";
import NineGridExamples from "@/components/generators/NineGridExamples";
import EXAMPLES from "@/data/generators/my9Examples.json";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-movies";
const TITLE = "My 9 Movies Template — Make a 3×3 Grid of the 9 Movies That Made You";
const DESCRIPTION =
  "Free My 9 Movies template: search any film, pick the 9 movies that made you and download a 1080×1080 3×3 poster grid or story image. Posters from Wikipedia, reorder by tapping, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-movies", title: TITLE, description: DESCRIPTION, alt: "My 9 Movies template — a 3×3 grid of movie posters" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 movies", "my9movies", "my 9 films", "my 9 movies template", "9 movies that made me", "favorite movies grid", "3x3 movie grid"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 movies grid?", answer: "Search a movie, tap its poster to drop it into the next empty square, and fill all nine. Then press Download PNG, or Share image on a phone." },
  { question: "Which movies can I find?", answer: "Any film with a Wikipedia article — new releases, classics, animation and international cinema. Add the year (\"Dune 2021\") if a title has several films." },
  { question: "Can I rearrange the movies?", answer: "Tap one square and then another to swap them, or drag on a computer. Tap a square first to put the next movie exactly there." },
  { question: "What size is the image?", answer: "1080×1080 pixels by default — the square size Instagram, X and Threads show best. Tick Story size for a 1080×1920 image for Instagram or TikTok stories. There is no watermark." },
  { question: "Can I share the grid as a link?", answer: "Copy link keeps your nine picks in the page address, so anyone who opens it sees the same grid and can download it too. Pictures you upload stay on your device and are not part of the link." },
];

export default function MyNineMoviesPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="My 9 Movies"
      heading={["My 9", "Movies"]}
      intro="Pick the 9 movies that made you and download a square or story-size poster grid. No signup, no watermark."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ}
      related={[{ href: "/my-9-albums", label: "My 9 Albums" }, { href: "/my-9-games", label: "My 9 Games" }, { href: "/my-9-anime", label: "My 9 Anime" }, { href: "/my-9-books", label: "My 9 Books" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }, { href: "/random-character-generator", label: "Random character generator" }]}
      inShort="Search any film, tap nine posters into the 3×3 grid, reorder them, and download a 1080×1080 PNG or a story-size image. Posters come from each film's Wikipedia article and load in your browser; upload your own picture for anything missing."
      afterTool={<NineGridExamples kind="movies" path={PATH} examples={EXAMPLES.movies} />}
      content={
        <>
          <SectionTitle>What is My 9 Movies?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Movies</strong> (also called my 9 films) is a 3×3 grid of the nine films that define your taste. Choose your nine, and the template lines up the posters into one image ready for your feed or story." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "Nine movies that made me · my comfort movies · 9 films I can rewatch forever · my 9 animated favorites · nine movies that scared me as a kid · 9 films to understand me." }} />
        </>
      }
    >
      <NineGridTabs current="movies" />
      <NineGridMaker kind="movies" />
    </GeneratorPageShell>
  );
}
