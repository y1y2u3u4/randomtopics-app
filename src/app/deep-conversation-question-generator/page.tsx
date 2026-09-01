import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { DEEP_CONVERSATION_CONFIG } from "@/data/premiumDeepConversation";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const config = DEEP_CONVERSATION_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "deep conversation question generator",
    "deep conversation questions",
    "random deep question generator",
    "meaningful conversation questions",
    "deep questions to ask",
  ],
  alternates: {
    canonical: config.path,
    languages: hreflangAlternates(config.path),
  },
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    url: `${SITE_URL}${config.path}`,
    siteName: "Random Topics",
    type: "website",
  },
};

export default function DeepConversationQuestionGeneratorPage() {
  return <PremiumCollectionPage config={config} />;
}
