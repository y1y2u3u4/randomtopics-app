import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { DECEMBER_QOTD_CONFIG } from "@/data/seasonalQotd";
import { SITE_URL } from "@/i18n/config";

export const revalidate = 3600;
const config = DECEMBER_QOTD_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "december question of the day",
    "december questions of the day",
    "december qotd",
    "december questions for kids",
    "december questions for work",
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

export default function DecemberQuestionOfTheDayPage() {
  return <PremiumCollectionPage config={config} />;
}
