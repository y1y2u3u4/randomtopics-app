import type { Metadata } from "next";
import { withSocial } from "@/lib/metadata/social";
import SpanishMostLikelyCollectionPage from "@/components/SpanishMostLikelyCollectionPage";
import { SPANISH_MOST_LIKELY_CLUSTERS } from "@/data/mostLikelySpanishClusters";
import { SITE_URL } from "@/i18n/config";

const config = SPANISH_MOST_LIKELY_CLUSTERS.girlfriends;
const canonical = `/es/topics/${config.slug}`;

export const metadata: Metadata = withSocial({
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  alternates: { canonical, languages: { es: `${SITE_URL}${canonical}`, "x-default": `${SITE_URL}${canonical}` } },
});

export default function MostLikelyGirlfriendsPage() {
  return <SpanishMostLikelyCollectionPage config={config} />;
}
