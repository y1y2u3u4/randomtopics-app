import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { THIS_OR_THAT_ES } from "@/data/partyGames.es";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

export const metadata: Metadata = {
  title: { absolute: "Generador de Esto o Aquello — Más de 60 Preguntas | Random Topics" },
  description:
    "Generador de preguntas Esto o Aquello: prompts de o/o divertidos para fiestas, clases, viajes y rompehielos. Un clic por pregunta, sin repeticiones — limpio y apto para todos. Sin registro.",
  alternates: { canonical: "/es/this-or-that", languages: hreflangAlternates("/this-or-that") },
  openGraph: {
    title: "Generador de Esto o Aquello",
    description: "Prompts de o/o divertidos para fiestas, clases y rompehielos. Un clic por pregunta, sin repeticiones.",
    url: `${SITE_URL}/es/this-or-that`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Qué es el juego de Esto o Aquello?",
    answer:
      "Esto o Aquello es un juego rápido en el que los jugadores eligen entre dos opciones — café o té, playa o montaña — y a menudo explican por qué. Es una forma ágil y sin presión de romper el hielo y conocer a un grupo.",
  },
  {
    question: "¿Cómo se juega a Esto o Aquello?",
    answer:
      "Genera un prompt, que todos respondan a la vez (señalando, gritando o levantando la mano) y luego deja que algunos defiendan su elección. En clase, úsalo como actividad de 'ponte en este lado del aula'.",
  },
  {
    question: "¿Son preguntas aptas para niños?",
    answer:
      "Sí — cada prompt es limpio y apto para todos, adecuado para aulas, noches de juegos en familia y compañía mixta.",
  },
  {
    question: "¿En qué se diferencia de Qué Prefieres?",
    answer:
      "Esto o Aquello usa elecciones cotidianas rápidas para rondas ágiles, mientras que Qué Prefieres se apoya en hipótesis más grandes y divertidas. Ambos son geniales como rompehielos: elige Esto o Aquello cuando quieras velocidad.",
  },
  {
    question: "¿Los profesores pueden usarlo en clase?",
    answer:
      "Sin duda. Esto o Aquello funciona como actividad de inicio, como calentamiento de expresión oral en inglés (ESL) y como actividad de 'cuatro esquinas' en la que los estudiantes eligen físicamente un lado y explican su razonamiento.",
  },
];

export default function ThisOrThatPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "Esto o Aquello" }]} />
        <PartyGenerator
          questions={THIS_OR_THAT_ES}
          title="Preguntas de Esto o Aquello"
          subtitle="Más de 60 prompts de o/o divertidos — un clic por pregunta, sin repeticiones hasta ver todo el mazo."
          emoji="⚖️"
          locale="es"
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              El rompehielos más rápido que existe
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Esto o Aquello</strong> funciona porque exige una elección instantánea. No hay
                respuesta incorrecta ni largas preparaciones: solo dos opciones y una decisión rápida, que
                es justo lo que despierta las aulas dormidas y anima las fiestas silenciosas. Este generador
                reparte de un mazo cuidado de prompts limpios de o/o, uno por clic, sin repeticiones hasta
                agotar el mazo.
              </p>
              <p>
                Más juegos de fiesta:{" "}
                <Link href="/es/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">Qué Prefieres</Link>,{" "}
                <Link href="/es/truth-or-dare" className="text-[var(--neon-cyan)] hover:underline">Verdad o Reto</Link>,{" "}
                <Link href="/es/most-likely-to" className="text-[var(--neon-cyan)] hover:underline">Quién Es Más Probable</Link> y{" "}
                <Link href="/es/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">Yo Nunca</Link>.
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
