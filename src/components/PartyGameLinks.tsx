import Link from "next/link";

const PARTY_GAMES = [
  { href: "/truth-or-dare", emoji: "🎭", label: "Truth or Dare", detail: "Clean truths and dares" },
  { href: "/would-you-rather", emoji: "🤔", label: "Would You Rather", detail: "Impossible either/or choices" },
  { href: "/paranoia-questions", emoji: "🤫", label: "Paranoia Questions", detail: "Whisper-and-reveal prompts" },
  { href: "/this-or-that", emoji: "⚖️", label: "This or That", detail: "Fast everyday choices" },
  { href: "/most-likely-to", emoji: "👉", label: "Most Likely To", detail: "Vote on the group" },
];

export default function PartyGameLinks({ currentPath }: { currentPath: string }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
        More Party Game Generators
      </h2>
      <p className="text-sm text-center text-[var(--text-muted)] mt-2 mb-6">
        Switch games without losing the group&apos;s momentum.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PARTY_GAMES.filter((game) => game.href !== currentPath).map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="glass-card p-4 flex items-center gap-3 hover:border-[var(--neon-cyan)]/30 transition-all group"
          >
            <span className="text-2xl" aria-hidden="true">{game.emoji}</span>
            <span>
              <span className="block text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)]">
                {game.label}
              </span>
              <span className="block text-xs text-[var(--text-muted)] mt-0.5">{game.detail}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
