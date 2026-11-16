import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Random Scenario Generator — OC, roleplay and writing scenarios";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return renderOgImage({
    emoji: "🎬",
    title: "Random Scenario Generator",
    subtitle: "OC, roleplay and writing scenarios by genre, tone and cast, with a twist and a daily scenario",
  });
}
