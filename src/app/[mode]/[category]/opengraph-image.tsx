import { CATEGORIES, MODES } from "@/data/types";
import type { Category } from "@/data/types";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Random Topic Generator";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OgImage({
  params,
}: {
  params: Promise<{ mode: string; category: string }>;
}) {
  const { mode, category } = await params;
  const modeInfo = MODES.find((m) => m.slug === mode);
  const catInfo = CATEGORIES.find((c) => c.id === (category as Category));

  const title = modeInfo && catInfo ? `${catInfo.label} ${modeInfo.label}` : "Random Topic Generator";
  const subtitle = catInfo
    ? `${catInfo.description} — free, instant, no signup`
    : "500+ free topics for any occasion";

  return renderOgImage({
    emoji: catInfo?.emoji || "🎲",
    title,
    subtitle,
  });
}
