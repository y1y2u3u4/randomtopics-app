import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Roast Me in One Sentence — free one-line roast generator";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return renderOgImage({
    emoji: "🔥",
    title: "Roast Me in One Sentence",
    subtitle: "Pick your habits, choose Mild, Spicy or Savage, get one line that hurts",
  });
}
