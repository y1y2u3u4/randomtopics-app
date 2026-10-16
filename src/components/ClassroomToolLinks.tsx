import Link from "next/link";

// Free classroom tools strip: shown on the kids / student pages and on
// /classroom-packs so teachers can hop between them.
export const CLASSROOM_TOOLS = [
  { href: "/this-or-that/kids", emoji: "⚖️", label: "This or That for Kids", detail: "Pick a side of the room · grades K–6" },
  { href: "/would-you-rather/kids", emoji: "🤔", label: "Would You Rather for Kids", detail: "Silly dilemmas + a 1-page printable" },
  { href: "/topics/get-to-know-you-questions-for-students", emoji: "👋", label: "Get to Know You Questions for Students", detail: "K–5, 6–8 and 9–12" },
  { href: "/question-of-the-day-for-students", emoji: "📅", label: "Question of the Day for Students", detail: "A bell-ringer for every day" },
  { href: "/random-name-picker", emoji: "🎯", label: "Random Name Picker", detail: "Call on students fairly" },
  { href: "/random-team-generator", emoji: "👥", label: "Random Team Generator", detail: "Balanced groups in one click" },
];

export default function ClassroomToolLinks({ currentPath, heading = "More free classroom tools", intro = "Every tool works on the board in projector mode or on a phone — no sign-up." }: { currentPath?: string; heading?: string; intro?: string }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-6" data-classroom-tools>
      <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{heading}</h2>
      <p className="text-sm text-center text-[var(--text-muted)] mt-2 mb-6">{intro}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CLASSROOM_TOOLS.filter((t) => t.href !== currentPath).map((t) => (
          <Link key={t.href} href={t.href} className="glass-card p-4 flex items-center gap-3 hover:border-[var(--neon-cyan)]/30 transition-all group">
            <span className="text-2xl" aria-hidden="true">{t.emoji}</span>
            <span>
              <span className="block text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)]">{t.label}</span>
              <span className="block text-xs text-[var(--text-muted)] mt-0.5">{t.detail}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
