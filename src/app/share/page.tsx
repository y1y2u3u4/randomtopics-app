import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Category, Depth, Mode, Topic } from "@/data/types";
import { CATEGORIES, DEPTHS, MODES } from "@/data/types";
import type { Locale } from "@/i18n/config";
import SharedTopicView from "@/components/SharedTopicView";

export const metadata: Metadata = {
  title: { absolute: "Shared Random Topic | RandomTopics" },
  description: "A random topic shared from RandomTopics, with talking points included.",
  robots: { index: false, follow: true },
};

interface CustomSharePageProps {
  searchParams: Promise<{
    text?: string;
    category?: string;
    modes?: string;
    depth?: string;
    points?: string;
    lang?: string;
  }>;
}

function buildTopic(params: Awaited<CustomSharePageProps["searchParams"]>): { topic: Topic; locale: Locale } | null {
  const text = params.text?.trim().slice(0, 300);
  if (!text) return null;

  const validCategories = new Set(CATEGORIES.map((category) => category.id));
  const validModes = new Set(MODES.map((mode) => mode.id));
  const validDepths = new Set(DEPTHS.map((depth) => depth.id));
  const category = validCategories.has(params.category as Category)
    ? (params.category as Category)
    : "weird-fun";
  const modes = (params.modes || "")
    .split(",")
    .filter((mode): mode is Mode => validModes.has(mode as Mode))
    .slice(0, 5);
  const depth = validDepths.has(params.depth as Depth) ? (params.depth as Depth) : "medium";
  const talkingPoints = (params.points || "")
    .split("|")
    .map((point) => point.trim().slice(0, 220))
    .filter(Boolean)
    .slice(0, 4);

  return {
    locale: params.lang === "es" ? "es" : "en",
    topic: {
      id: `shared-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}`,
      text,
      category,
      modes: modes.length > 0 ? modes : ["conversation"],
      depth,
      talkingPoints,
    },
  };
}

export default async function CustomSharedTopicPage({ searchParams }: CustomSharePageProps) {
  const shared = buildTopic(await searchParams);
  if (!shared) notFound();
  return <SharedTopicView topic={shared.topic} locale={shared.locale} />;
}
