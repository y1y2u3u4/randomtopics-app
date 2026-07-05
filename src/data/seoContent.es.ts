import type { SeoArticle } from "./seoContent";
import { seoArticlesEsPart1 } from "./seoContent.es.part1";
import { seoArticlesEsPart2 } from "./seoContent.es.part2";
import { seoArticlesEsPart3 } from "./seoContent.es.part3";
import { seoArticlesEsPart4 } from "./seoContent.es.part4";

// Merged Spanish SEO articles (28), same slugs as the English source.
export const SEO_ARTICLES_ES: SeoArticle[] = [
  ...seoArticlesEsPart1,
  ...seoArticlesEsPart2,
  ...seoArticlesEsPart3,
  ...seoArticlesEsPart4,
];

export function getArticleEs(slug: string): SeoArticle | undefined {
  return SEO_ARTICLES_ES.find((a) => a.slug === slug);
}
