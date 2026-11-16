import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { NEW_YEAR_QOTD_CONFIG } from "@/data/seasonalQotd";
import { SITE_URL } from "@/i18n/config";

export const revalidate = 3600;
const config = NEW_YEAR_QOTD_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "new year question of the day",
    "new year questions",
    "new years eve questions",
    "new year resolution questions",
    "new year questions for kids",
    "new year questions for work",
  ],
  alternates: { canonical: config.path },
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    url: `${SITE_URL}${config.path}`,
    siteName: "Random Topics",
    type: "website",
  },
};

export default function NewYearQuestionOfTheDayPage() {
  return <PremiumCollectionPage config={config} />;
}
