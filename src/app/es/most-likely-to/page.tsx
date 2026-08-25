import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { MOST_LIKELY_TO_ES } from "@/data/partyGames.es";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

export const metadata: Metadata = {
  title: { absolute: "Preguntas de Quién Es Más Probable — Generador Gratis | Random Topics" },
  description:
    "Preguntas de quién es más probable que para fiestas, amigos, clases y equipos. Generador gratis, divertido, sin repeticiones y sin registro.",
  alternates: { canonical: "/es/most-likely-to", languages: hreflangAlternates("/most-likely-to") },
  openGraph: {
    title: "Generador de Quién Es Más Probable",
    description: "Prompts limpios y divertidos de '¿quién es más probable que…?' para fiestas y clases. Un clic por pregunta.",
    url: `${SITE_URL}/es/most-likely-to`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Cómo se juega a Quién Es Más Probable?",
    answer:
      "Se lee un prompt en voz alta y todos señalan a la persona que creen que es 'más probable que' lo haga. Quien reciba más votos gana (o pierde) la ronda. Es rápido, divertido y revela cómo se ve un grupo entre sí.",
  },
  {
    question: "¿Los prompts son limpios y aptos para todos?",
    answer:
      "Sí — cada prompt de este mazo es ligero y adecuado para aulas, noches de juegos en familia, team building y compañía mixta.",
  },
  {
    question: "¿Cuántos jugadores hacen falta?",
    answer:
      "Quién Es Más Probable funciona mejor con tres o más personas para que haya a quién señalar. Es ideal para fiestas, clases, viajes y dinámicas de equipo en el trabajo.",
  },
  {
    question: "¿Puedo usarlo para team building en el trabajo?",
    answer:
      "Por supuesto. Mantén los prompts positivos y amistosos y se convierte en una forma rápida y sin presión de que los compañeros rían juntos y se conozcan mejor.",
  },
  {
    question: "¿El mazo se repite?",
    answer:
      "No — el generador recorre todos los prompts antes de repetir ninguno, así que puedes jugar una partida larga sin ver la misma pregunta dos veces seguidas.",
  },
];

export default function MostLikelyToPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "Quién Es Más Probable" }]} />
        <PartyGenerator
          questions={MOST_LIKELY_TO_ES}
          title="Preguntas de Quién Es Más Probable"
          subtitle="Prompts limpios y divertidos de '¿quién es más probable que…?' — un clic por pregunta, sin repeticiones hasta ver todo el mazo."
          emoji="👉"
          locale="es"
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Elige preguntas para tu grupo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Para parejas", detail: "Románticas y divertidas", href: "/es/topics/quien-es-mas-probable-parejas" },
              { label: "Preguntas fuertes", detail: "Intensas y reveladoras", href: "/es/topics/quien-es-mas-probable-preguntas-fuertes" },
              { label: "Para amigos", detail: "Fiestas, viajes y risas", href: "/es/topics/quien-es-mas-probable-amigos" },
            ].map((collection) => (
              <Link key={collection.href} href={collection.href} className="glass-card p-4 hover:border-[var(--neon-cyan)]/30 transition-colors">
                <p className="text-sm font-bold text-[var(--text-primary)]">{collection.label}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{collection.detail}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              El juego que revela cómo te ve de verdad tu grupo
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Quién Es Más Probable</strong> convierte un prompt sencillo en risas inmediatas:
                todos señalan a la vez y de repente descubres a quién cree el grupo que sobreviviría a un
                apocalipsis zombi o llegaría tarde a su propia boda. Este generador reparte de un mazo cuidado
                de prompts limpios y divertidos, uno por clic, sin repeticiones hasta agotar el mazo.
              </p>
              <p>
                Sigue la fiesta con{" "}
                <Link href="/es/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">Qué Prefieres</Link>,{" "}
                <Link href="/es/truth-or-dare" className="text-[var(--neon-cyan)] hover:underline">Verdad o Reto</Link>,{" "}
                <Link href="/es/this-or-that" className="text-[var(--neon-cyan)] hover:underline">Esto o Aquello</Link> y{" "}
                <Link href="/es/two-truths-and-a-lie" className="text-[var(--neon-cyan)] hover:underline">Dos Verdades y una Mentira</Link>.
              </p>
              <p>
                ¿Prefieres elegir por categoría o imprimir las preguntas? Consulta nuestra{" "}
                <Link href="/es/topics/most-likely-to-questions" className="text-[var(--neon-cyan)] hover:underline">
                  lista de 100 preguntas de Quién Es Más Probable para amigos, fiestas y familia
                </Link>.
              </p>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-3" style={{ fontFamily: "var(--font-display)" }}>
                Preguntas Frecuentes
              </h3>
              {FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h4>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
