// Per-page share card + Twitter metadata for the random generator pages. The
// card images are built by scripts/og/render-generator-og.mjs into public/og.
export function generatorSocial(opts: { card: string; title: string; description: string; alt: string }) {
  const image = { url: `/og/${opts.card}.jpg`, width: 1200, height: 630, alt: opts.alt, type: "image/jpeg" };
  return {
    images: [image],
    twitter: {
      card: "summary_large_image" as const,
      title: opts.title,
      description: opts.description,
      images: [{ url: image.url, alt: opts.alt }],
    },
  };
}
