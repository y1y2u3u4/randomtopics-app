import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { TWO_TRUTHS_AND_A_LIE_ES } from "@/data/partyGames.es";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

export const metadata: Metadata = {
  title: { absolute: "Dos Verdades y una Mentira — Generador de Ideas y Prompts | Random Topics" },
  description:
    "Generador de ideas para Dos Verdades y una Mentira: prompts temáticos que te ayudan a crear rondas convincentes rápido. Ideal para rompehielos, clases, team building y fiestas. Sin registro.",
  alternates: { canonical: "/es/two-truths-and-a-lie", languages: hreflangAlternates("/two-truths-and-a-lie") },
  openGraph: {
    title: "Dos Verdades y una Mentira",
    description: "Prompts temáticos para crear rondas convincentes rápido. Ideal para rompehielos, clases y fiestas.",
    url: `${SITE_URL}/es/two-truths-and-a-lie`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Cómo se juega a Dos Verdades y una Mentira?",
    answer:
      "Cada jugador comparte tres afirmaciones sobre sí mismo — dos verdaderas y una falsa — y los demás adivinan cuál es la mentira. Las mejores mentiras son creíbles y las verdades sorprendentes, y ahí es donde ayuda un prompt temático.",
  },
  {
    question: "¿Qué me da este generador?",
    answer:
      "Te da un prompt temático en cada clic — por ejemplo, 'haz tus afirmaciones sobre lugares que has visitado' — para que puedas crear rápidamente una ronda sólida y convincente en lugar de mirar una página en blanco.",
  },
  {
    question: "¿Sirve como rompehielos en el trabajo o la escuela?",
    answer:
      "Sí. Dos Verdades y una Mentira es un rompehielos clásico para aulas, equipos nuevos, onboarding y reuniones virtuales, porque ayuda a que la gente comparta algo real sobre sí misma de forma divertida y sin presión.",
  },
  {
    question: "¿Qué hace buena a una mentira?",
    answer:
      "La mejor mentira es aburridamente creíble y va junto a dos verdades sorprendentes. Iguala el tono y el nivel de detalle de tus afirmaciones verdaderas para que la mentira no destaque: los prompts temáticos te ayudan a mantener las tres coherentes.",
  },
  {
    question: "¿Cuántas personas hacen falta?",
    answer:
      "Funciona con cualquier grupo de tres o más. Cada uno presenta por turnos sus tres afirmaciones mientras los demás votan cuál es la mentira.",
  },
];

export default function TwoTruthsAndALiePageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "Dos Verdades y una Mentira" }]} />
        <PartyGenerator
          questions={TWO_TRUTHS_AND_A_LIE_ES}
          title="Dos Verdades y una Mentira"
          subtitle="Prompts temáticos para crear una ronda convincente — un clic por idea, sin repeticiones hasta ver todo el mazo."
          emoji="🕵️"
          locale="es"
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              El rompehielos que todos ya saben jugar
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Dos Verdades y una Mentira</strong> es un rompehielos básico, pero lo difícil es
                pensar tres buenas afirmaciones sobre la marcha. Este generador te da un enfoque temático en
                cada clic para que montes una ronda creíble en segundos. Saca un tema, anota dos verdades
                sorprendentes y una mentira aburridamente creíble, y deja que el grupo adivine.
              </p>
              <p>
                Combínalo con más juegos de grupo:{" "}
                <Link href="/es/most-likely-to" className="text-[var(--neon-cyan)] hover:underline">Quién Es Más Probable</Link>,{" "}
                <Link href="/es/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">Qué Prefieres</Link>,{" "}
                <Link href="/es/this-or-that" className="text-[var(--neon-cyan)] hover:underline">Esto o Aquello</Link> o{" "}
                <Link href="/es/icebreaker" className="text-[var(--neon-cyan)] hover:underline">preguntas rompehielos</Link> para el trabajo.
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
