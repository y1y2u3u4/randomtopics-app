import { existsSync } from "node:fs";
import { join } from "node:path";
import type { TriviaQuestion } from "@/lib/trivia";

/**
 * Hero illustration slot. The art is requested in docs/art-requests.json and
 * generated locally; until the jpg lands in public/ an SVG placeholder with the
 * same 16:9 box is shown, so adding the file causes no layout shift.
 */
export function TriviaHero({ src, alt, variant }: { src: string; alt: string; variant: "party" | "halloween" | "christmas" }) {
  const hasArt = existsSync(join(process.cwd(), "public", src));
  return (
    <figure className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
        {hasArt ? (
          // eslint-disable-next-line @next/next/no-img-element -- pre-sized jpg, no optimizer needed
          <img src={src} alt={alt} width={1600} height={900} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : (
          <Placeholder variant={variant} label={alt} />
        )}
      </div>
    </figure>
  );
}

function Placeholder({ variant, label }: { variant: "party" | "halloween" | "christmas"; label: string }) {
  const accent = { party: "#00e5ff", halloween: "#ff8a1f", christmas: "#ff4d5e" }[variant];
  const second = { party: "#ff4fd8", halloween: "#8bff6a", christmas: "#5dff9a" }[variant];
  return (
    <svg viewBox="0 0 1600 900" role="img" aria-label={label} className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`tg-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={{ party: "#0b0f1a", halloween: "#1a0f24", christmas: "#0f1a14" }[variant]} />
          <stop offset="1" stopColor="#08080f" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#tg-${variant})`} />
      {[-14, -4, 6].map((r, i) => (
        <g key={r} transform={`translate(${430 + i * 70} ${450 - i * 10}) rotate(${r})`}>
          <rect x="-190" y="-250" width="380" height="500" rx="36" fill="#121226" stroke={i === 2 ? accent : "#2a2a44"} strokeWidth="6" />
          {i === 2 && <text x="0" y="70" textAnchor="middle" fontSize="260" fontWeight="800" fill={accent} fontFamily="system-ui, sans-serif">?</text>}
        </g>
      ))}
      <g transform="translate(1080 210)">
        <rect width="380" height="480" rx="32" fill="#121226" stroke="#2a2a44" strokeWidth="6" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(36 ${48 + i * 106})`}>
            <rect width="308" height="78" rx="18" fill={i === 1 ? `${second}22` : "#1a1a33"} />
            <circle cx="44" cy="39" r="22" fill="none" stroke={i === 1 ? second : "#3a3a5a"} strokeWidth="5" />
            <rect x="96" y="30" width={[110, 150, 80, 120][i]} height="18" rx="9" fill="#3a3a5a" />
            <text x="282" y="54" textAnchor="end" fontSize="40" fontWeight="800" fill={i === 1 ? second : "#c9c9e0"} fontFamily="system-ui, sans-serif">{[3, 5, 2, 4][i]}</text>
          </g>
        ))}
      </g>
      <g transform="translate(870 720)">
        <circle r="72" fill="none" stroke="#2a2a44" strokeWidth="14" />
        <path d="M0 -72 A72 72 0 1 1 -62 36" fill="none" stroke={accent} strokeWidth="14" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** The readable questions-and-answers list: answers are in the HTML, collapsed per question. */
export function TriviaList({ groups, heading, intro }: {
  heading: string;
  intro: string;
  groups: { id: string; title: string; questions: TriviaQuestion[] }[];
}) {
  const offsets = groups.map((_, i) => groups.slice(0, i).reduce((sum, g) => sum + g.questions.length, 0));
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10" aria-labelledby="trivia-list">
      <div className="glass-card p-6 sm:p-10">
        <h2 id="trivia-list" className="section-heading text-2xl sm:text-3xl mb-3 text-[var(--text-primary)]">{heading}</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">{intro}</p>
        {groups.map((g, gi) => (
          <div key={g.id} id={`trivia-${g.id}`} className="mb-8 last:mb-0">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3" style={{ fontFamily: "var(--font-display)" }}>
              {g.title}
            </h3>
            <ol className="space-y-2">
              {g.questions.map((q, qi) => {
                const n = offsets[gi] + qi + 1;
                return (
                  <li key={q.id}>
                    <details className="group rounded-xl border border-white/5 px-4 py-3 open:border-[var(--neon-cyan)]/30">
                      <summary className="cursor-pointer list-none text-sm text-[var(--text-primary)]">
                        <span className="text-[var(--text-muted)] mr-1.5">{n}.</span>
                        {q.question}
                        <span className="ml-2 text-xs text-[var(--neon-cyan)] group-open:hidden">Show answer</span>
                      </summary>
                      <p className="mt-2 text-sm">
                        <strong className="text-[var(--neon-cyan)]">{q.answer}</strong>
                        <span className="text-[var(--text-secondary)]"> — {q.explanation}</span>
                      </p>
                    </details>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
