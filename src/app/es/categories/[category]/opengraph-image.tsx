import { CATEGORIES } from "@/data/types";
import type { Category } from "@/data/types";
import { CATEGORY_LABELS } from "@/i18n/dictionaries";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Categoría del Generador de Temas al Azar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OgImage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const catInfo = CATEGORIES.find((c) => c.id === (category as Category));
  const catL = catInfo ? CATEGORY_LABELS.es[catInfo.id] : null;

  const title = catL ? `Temas de ${catL.label}` : "Temas al Azar";
  const subtitle = catL
    ? `${catL.description} — conversación, escritura, debate y discursos`
    : "Más de 500 temas gratis";

  return renderOgImage({ emoji: catInfo?.emoji || "🎲", title, subtitle });
}
