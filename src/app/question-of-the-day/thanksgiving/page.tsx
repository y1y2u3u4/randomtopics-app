import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { THANKSGIVING_QOTD_CONFIG } from "@/data/seasonalQotd";
import { SITE_URL } from "@/i18n/config";

export const revalidate = 3600;
const config = THANKSGIVING_QOTD_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "thanksgiving question of the day",
    "thanksgiving questions of the day",
    "thanksgiving qotd",
    "thanksgiving questions for kids",
    "thanksgiving questions for work",
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

export default function ThanksgivingQuestionOfTheDayPage() {
  return <PremiumCollectionPage config={config} />;
}
