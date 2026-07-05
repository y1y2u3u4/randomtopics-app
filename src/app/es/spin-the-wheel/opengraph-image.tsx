import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Gira la Ruleta — Generador de Ruleta de Temas al Azar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return renderOgImage({
    emoji: "🎡",
    title: "Gira la Ruleta",
    subtitle: "Una ruleta de temas al azar gratis con 16 categorías — un giro, un tema",
  });
}
