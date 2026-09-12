"use client";

import { track } from "@/lib/track";
import type { Locale } from "@/i18n/config";

export default function ArticleGeneratorEntry({ source, locale = "en", surface, description, actionLabel, generateOnClick = true }: {
  source: string; locale?: Locale; surface: "article_middle" | "article_end";
  description?: string; actionLabel?: string; generateOnClick?: boolean;
}) {
  const isSpanish = locale === "es";
  return (
    <div className="glass-card my-6 p-5 text-center border-[var(--neon-cyan)]/20">
      <p className="mb-3 text-sm text-[var(--text-secondary)]">
        {description ?? (isSpanish ? "¿Listos para jugar? Saca una pregunta de la categoría que elegiste." : "Ready to try one? Draw a prompt from your selected category.")}
      </p>
      <a href={`#generator-${source}`} className="btn-generate inline-flex min-h-11 text-sm" onClick={(event) => {
        const generator = document.getElementById(`generator-${source}`);
        const button = generator?.querySelector<HTMLButtonElement>("[data-generate-button]");
        if (!button) return;
        event.preventDefault();
        track("article_generate_entry", { content_source: source, entry_surface: surface, locale });
        // Reuse the existing component state, pool, and success instrumentation.
        if (generateOnClick) button.click();
        generator?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
        button.focus({ preventScroll: true });
      }}>
        <span aria-hidden="true">🎲</span> {actionLabel ?? (isSpanish ? "Sacar la siguiente pregunta" : "Draw the next prompt")}
      </a>
    </div>
  );
}
