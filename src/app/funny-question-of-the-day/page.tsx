import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { FUNNY_QOTD_CONFIG } from "@/data/premiumFunnyQotd";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

export const revalidate = 3600;
const config = FUNNY_QOTD_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "funny question of the day",
    "funny questions of the day",
    "funny qotd",
    "fun question of the day for kids",
    "funny question of the day for work",
    "daily funny questions",
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

export default function FunnyQuestionOfTheDayPage() {
  return <PremiumCollectionPage config={config} />;
}
