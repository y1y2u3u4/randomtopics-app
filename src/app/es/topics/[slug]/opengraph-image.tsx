import { SEO_ARTICLES_ES } from "@/data/seoContent.es";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Artículo de Random Topics";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = SEO_ARTICLES_ES.find((a) => a.slug === slug);
  return renderOgImage({
    emoji: "🎲",
    title: article?.heroTitle || "Random Topics",
    subtitle: article?.heroSubtitle || "",
  });
}
