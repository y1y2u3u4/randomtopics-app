import Link from "next/link";

// "Everyone / Kids" switch at the top of the party-game pages that have a
// classroom version. A plain link pair: the general page keeps its own copy.
export default function KidsVersionSwitch({ general, kids, active, locale = "en" }: { general: string; kids: string; active: "general" | "kids"; locale?: "en" | "es" }) {
  const es = locale === "es";
  const pill = (on: boolean) => `rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${on ? "bg-[rgba(0,229,255,0.12)] text-[var(--neon-cyan)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`;
  return (
    <nav aria-label={es ? "Tipo de preguntas" : "Question set"} className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 flex justify-center">
      <div className="inline-flex gap-1 rounded-full border border-white/10 p-1">
        <Link prefetch={false} href={general} aria-current={active === "general" ? "page" : undefined} className={pill(active === "general")}>{es ? "Para todos" : "Everyone"}</Link>
        <Link prefetch={false} href={kids} aria-current={active === "kids" ? "page" : undefined} className={pill(active === "kids")}>{es ? "🧒 Versión niños · aula" : "🧒 Kids version · classroom"}</Link>
      </div>
    </nav>
  );
}
