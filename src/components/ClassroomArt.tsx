import { existsSync } from "node:fs";
import { join } from "node:path";

// Page illustration requested in docs/art-requests.json (made in ChatGPT web).
// Renders nothing until the file lands in public/, so pages ship before the art.
export default function ClassroomArt({ src, alt }: { src: string; alt: string }) {
  if (!existsSync(join(process.cwd(), "public", src))) return null;
  return (
    <figure className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized jpg, no optimizer needed */}
      <img src={src} alt={alt} width={1600} height={900} loading="lazy" decoding="async" className="w-full h-auto rounded-2xl border border-white/10" />
    </figure>
  );
}
