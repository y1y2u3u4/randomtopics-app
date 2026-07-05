import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

// Default Spanish-branded OG card. Inherited by every /es page that doesn't
// define its own opengraph-image (home, mode landings, tool pages, static,
// index pages), mirroring how the root opengraph-image covers English pages.
export const alt = "Generador de Temas al Azar — Temas Gratis para Conversar, Escribir y Debatir";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return renderOgImage({
    emoji: "🎲",
    title: "Generador de Temas al Azar",
    subtitle: "Más de 500 temas para conversaciones, escritura, debates, discursos y rompehielos",
  });
}
