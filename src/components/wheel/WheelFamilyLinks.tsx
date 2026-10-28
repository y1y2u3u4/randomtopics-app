import Link from "next/link";
import { WHEEL_FAMILY } from "@/data/wheelTemplates";

/** Grid of every wheel tool and template. Static server HTML: crawlable links, no JS. */
export default function WheelFamilyLinks({ path, heading = "Wheel templates and tools", compact = false }: { path?: string; heading?: string; compact?: boolean }) {
  const items = WHEEL_FAMILY.filter((w) => w.href !== path);
  return (
    <section aria-labelledby="wheel-templates" className={compact ? "" : "max-w-4xl mx-auto px-4 sm:px-6 py-8"}>
      <h2 id="wheel-templates" className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3" style={{ fontFamily: "var(--font-display)" }}>{heading}</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-4">Each template opens a ready-made wheel you can edit, spin and share.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((w) => (
          <Link prefetch={false} key={w.href} href={w.href} className="glass-card p-4 hover:border-[var(--neon-cyan)]/30 transition-all group">
            <span className="text-2xl" aria-hidden="true">{w.emoji}</span>
            <span className="block text-sm font-bold text-[var(--text-primary)] mt-2 group-hover:text-[var(--neon-cyan)]">{w.label}</span>
            <span className="block text-xs text-[var(--text-muted)] mt-1">{w.blurb}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
