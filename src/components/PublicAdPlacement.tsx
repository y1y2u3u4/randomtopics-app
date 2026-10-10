import ArticleAdvertisement from "@/components/ArticleAdvertisement";
import { adConfiguration, adPageAllowed } from "@/lib/adsense";

// Shared templates may call this for other routes: the whitelist fails closed.
export default function PublicAdPlacement({ path }: { path: string }) {
  const config = adPageAllowed(path) ? adConfiguration(process.env.NEXT_PUBLIC_ADSENSE_ROLLOUT,
    process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT) : null;
  return config ? <ArticleAdvertisement path={path} slot={config.slot} /> : null;
}
