import { CATEGORIES } from "@/data/types";
import type { Category } from "@/data/types";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Random Topic Generator category";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OgImage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const catInfo = CATEGORIES.find((c) => c.id === (category as Category));

  const title = catInfo ? `${catInfo.label} Topics` : "Random Topics";
  const subtitle = catInfo
    ? `${catInfo.description} — conversation, writing, debate & speech topics`
    : "500+ free topics for any occasion";

  return renderOgImage({
    emoji: catInfo?.emoji || "🎲",
    title,
    subtitle,
  });
}
