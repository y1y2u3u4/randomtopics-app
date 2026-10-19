import type { ReactNode } from "react";

/**
 * A 40–60 word direct answer placed right below a page's tool, so search
 * snippets and AI answers can quote it. Added below the first screen; it
 * never replaces existing copy.
 */
export default function DirectAnswer({ question, children }: { question: string; children: ReactNode }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-6" aria-labelledby="direct-answer">
      <div className="glass-card p-5 sm:p-6">
        <h2 id="direct-answer" className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">{question}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{children}</p>
      </div>
    </section>
  );
}
