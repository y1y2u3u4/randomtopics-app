import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import NineGridTabs from "@/components/generators/NineGridTabs";
import NineGridExamples from "@/components/generators/NineGridExamples";
import EXAMPLES from "@/data/generators/my9Examples.json";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-books";
const TITLE = "My 9 Books Template — Make a 3×3 Grid of the 9 Books That Made You";
const DESCRIPTION =
  "Free My 9 Books template: search any novel or book, pick the 9 books that made you and download a 1080×1080 3×3 cover grid or story image. Covers from Wikipedia, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-books", title: TITLE, description: DESCRIPTION, alt: "My 9 Books template — a 3×3 grid of book covers" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 books", "my9books", "my 9 books template", "9 books that made me", "favorite books grid", "3x3 book grid", "bookstagram grid"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 books grid?", answer: "Search a title or author, tap a cover to drop it into the next empty square and fill all nine. Then press Download PNG, or Share image on a phone." },
  { question: "Which books can I find?", answer: "Books with a Wikipedia article — classics, bestsellers, fantasy and sci-fi series, nonfiction. For a small-press or very new book, upload a photo of the cover instead." },
  { question: "Can I rearrange the books?", answer: "Tap one square and then another to swap them, or drag on a computer. Tap a square first to put the next book exactly there." },
  { question: "What size is the image?", answer: "1080×1080 pixels by default — the square size Instagram, X and Threads show best. Tick Story size for a 1080×1920 image for Instagram or TikTok stories. There is no watermark." },
  { question: "Can I share the grid as a link?", answer: "Copy link keeps your nine picks in the page address, so anyone who opens it sees the same grid and can download it too. Pictures you upload stay on your device and are not part of the link." },
];

export default function MyNineBooksPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="My 9 Books"
      heading={["My 9", "Books"]}
      intro="Pick the 9 books that made you and download a square or story-size cover grid. No signup, no watermark."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ}
      related={[{ href: "/my-9-albums", label: "My 9 Albums" }, { href: "/my-9-games", label: "My 9 Games" }, { href: "/my-9-movies", label: "My 9 Movies" }, { href: "/my-9-anime", label: "My 9 Anime" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }, { href: "/random-word-generator", label: "Random word generator" }]}
      inShort="Search any book or author, tap nine covers into the 3×3 grid, reorder them, and download a 1080×1080 PNG or a story-size image. Covers come from each book's Wikipedia article; upload a photo of your own copy for anything missing."
      afterTool={<NineGridExamples kind="books" path={PATH} examples={EXAMPLES.books} />}
      content={
        <>
          <SectionTitle>What is My 9 Books?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Books</strong> is a 3×3 grid of the nine books that shaped you — popular on Bookstagram, BookTok and Threads. Choose your nine and the template lines up the covers into one shareable image." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "Nine books that made me · my 9 comfort reads · 9 books I'd save from a fire · my favorite fantasy series · nine books I read in school and still love · 9 books to understand me." }} />
        </>
      }
    >
      <NineGridTabs current="books" />
      <NineGridMaker kind="books" />
    </GeneratorPageShell>
  );
}
