import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Spin the Wheel — Random Topic Wheel Generator";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return renderOgImage({
    emoji: "🎡",
    title: "Spin the Wheel",
    subtitle: "A free random topic wheel across 16 categories — one spin, one topic",
  });
}
