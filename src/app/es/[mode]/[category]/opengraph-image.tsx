import { CATEGORIES, MODES } from "@/data/types";
import type { Category } from "@/data/types";
import { MODE_LABELS, CATEGORY_LABELS } from "@/i18n/dictionaries";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Generador de Temas al Azar";
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

  const title =
    modeInfo && catInfo
      ? `${CATEGORY_LABELS.es[catInfo.id].label}: ${MODE_LABELS.es[modeInfo.id].label}`
      : "Generador de Temas al Azar";
  const subtitle = catInfo
    ? `${CATEGORY_LABELS.es[catInfo.id].description} — gratis, al instante`
    : "Más de 500 temas gratis para cualquier ocasión";

  return renderOgImage({ emoji: catInfo?.emoji || "🎲", title, subtitle });
}
