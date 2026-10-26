import Link from "next/link";

// Spanish counterpart of ClassroomToolLinks: only pages that exist in Spanish.
export const CLASSROOM_TOOLS_ES = [
  { href: "/es/this-or-that/kids", emoji: "⚖️", label: "Esto o aquello para niños", detail: "Elige un lado del aula · primaria" },
  { href: "/es/would-you-rather/kids", emoji: "🤔", label: "¿Qué prefieres? para niños", detail: "Dilemas divertidos y aptos para clase" },
  { href: "/es/topics/writing-prompts-for-kids", emoji: "✏️", label: "Temas para escribir para niños", detail: "Ideas de diario por edad y tema" },
  { href: "/es/generador-de-equipos-aleatorios", emoji: "👥", label: "Generador de equipos aleatorios", detail: "Grupos justos en un clic" },
  { href: "/es/topics/debate-topics-for-students", emoji: "🎤", label: "Temas de debate para estudiantes", detail: "Para practicar argumentos" },
];

export default function ClassroomToolLinksEs({ currentPath }: { currentPath?: string }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-6" data-classroom-tools lang="es">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Más herramientas gratis para clase</h2>
      <p className="text-sm text-center text-[var(--text-muted)] mt-2 mb-6">Todas funcionan en la pizarra digital o en el móvil, sin registro.</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {CLASSROOM_TOOLS_ES.filter((t) => t.href !== currentPath).map((t) => (
          <li key={t.href}>
            <Link prefetch={false} href={t.href} className="glass-card flex items-start gap-3 p-4 h-full hover:border-[var(--neon-cyan)]/40 transition-colors">
              <span className="text-2xl" aria-hidden="true">{t.emoji}</span>
              <span>
                <span className="block text-sm font-semibold text-[var(--text-primary)]">{t.label}</span>
                <span className="block text-xs text-[var(--text-muted)] mt-0.5">{t.detail}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
