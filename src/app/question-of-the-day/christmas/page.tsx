import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { CHRISTMAS_QOTD_CONFIG } from "@/data/seasonalQotd";
import { SITE_URL } from "@/i18n/config";

export const revalidate = 3600;
const config = CHRISTMAS_QOTD_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "christmas question of the day",
    "christmas questions of the day",
    "christmas qotd",
    "christmas questions for kids",
    "christmas questions for work",
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

export default function ChristmasQuestionOfTheDayPage() {
  return <PremiumCollectionPage config={config} />;
}
