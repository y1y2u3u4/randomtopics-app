import ArticleAdvertisement, { type AdPlacement } from "@/components/ArticleAdvertisement";
import { adConfiguration, adInlinePageAllowed } from "@/lib/adsense";

// Shared templates may call this for other routes: the whitelist fails closed.
// `placement` only labels the unit (data-ad-placement) for 7-day comparisons.
export default function PublicAdPlacement({ path, placement = "content" }: { path: string; placement?: AdPlacement }) {
  const config = adInlinePageAllowed(path) ? adConfiguration(process.env.NEXT_PUBLIC_ADSENSE_ROLLOUT,
    process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT) : null;
  return config ? <ArticleAdvertisement path={path} slot={config.slot} placement={placement} /> : null;
}
