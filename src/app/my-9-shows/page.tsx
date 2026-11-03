import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import NineGridTabs from "@/components/generators/NineGridTabs";
import NineGridExamples from "@/components/generators/NineGridExamples";
import EXAMPLES from "@/data/generators/my9Examples.json";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-shows";
const TITLE = "My 9 Shows Template — Make a 3×3 Grid of Your 9 Favorite TV Shows";
const DESCRIPTION =
  "Free My 9 Shows template: search any TV series, pick your 9 favorite shows and download a 1080×1080 3×3 poster grid or story image. Posters from TVmaze, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-shows", title: TITLE, description: DESCRIPTION, alt: "My 9 Shows template — a 3×3 grid" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 shows", "my9shows", "my 9 shows template", "my 9 favorite tv shows", "9 shows that made me", "favorite tv shows grid", "3x3 tv show grid"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 shows grid?", answer: "Search a series, tap a poster to drop it into the next empty square and fill all nine. Then press Download PNG, or Share image on a phone." },
  { question: "Which shows can I find?", answer: "Any series listed on TVmaze: network and streaming dramas, sitcoms, reality TV, K-dramas, cartoons and older classics. If a poster is missing, upload a screenshot or photo instead." },
  { question: "Can I add anime or movies?", answer: "Most anime series are on TVmaze too, but the My 9 Anime template has better anime posters. Films live in My 9 Movies. Use My 9 grid from your own pictures to mix anything." },
  { question: "What size is the image?", answer: "1080×1080 pixels by default, the square size Instagram, X and Threads show best. Tick Story size for a 1080×1920 image for Instagram or TikTok stories. There is no watermark." },
  { question: "Can I share the grid as a link?", answer: "Copy link keeps your nine picks in the page address, so anyone who opens it sees the same grid and can download it too. Pictures you upload stay on your device and are not part of the link." },
];

export default function MyNineShowsPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="My 9 Shows"
      heading={["My 9", "Shows"]}
      intro="Pick the 9 TV shows that made you and download a square or story-size poster grid. No signup, no watermark."
      description={DESCRIPTION}
      updated="2026-11-03"
      faq={FAQ}
      related={[{ href: "/my-9-movies", label: "My 9 Movies" }, { href: "/my-9-anime", label: "My 9 Anime" }, { href: "/my-9-books", label: "My 9 Books" }, { href: "/my-9-characters", label: "My 9 Characters" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }]}
      inShort="Search any TV series, tap nine posters into the 3×3 grid, reorder them, and download a 1080×1080 PNG or a story-size image. Posters come from TVmaze, which covers streaming, network and international shows; upload your own picture for anything missing."
      afterTool={<NineGridExamples kind="shows" path={PATH} examples={EXAMPLES.shows} />}
      content={
        <>
          <SectionTitle>What is My 9 Shows?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Shows</strong> is a 3×3 grid of the nine TV series that define your taste — a staple of TikTok, X and Threads. Choose your nine and the template lines the posters up into one shareable image." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p>9 shows that made me · my comfort sitcoms · 9 shows I'd rewatch forever · my favorite K-dramas · shows I grew up with · 9 shows to understand me · best finales I've seen.</p>
        </>
      }
    >
      <NineGridTabs current="shows" />
      <NineGridMaker kind="shows" />
    </GeneratorPageShell>
  );
}
