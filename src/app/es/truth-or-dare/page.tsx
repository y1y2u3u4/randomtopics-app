import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { TRUTH_OR_DARE_ES } from "@/data/partyGames.es";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

export const metadata: Metadata = {
  title: { absolute: "Generador de Verdad o Reto — Preguntas y Retos Limpios | Random Topics" },
  description:
    "Generador de Verdad o Reto gratis con preguntas y retos limpios y aptos para todos. Un clic por prompt, sin repeticiones — perfecto para fiestas, pijamadas y noches de juegos en familia. Sin registro.",
  alternates: { canonical: "/es/truth-or-dare", languages: hreflangAlternates("/truth-or-dare") },
  openGraph: {
    title: "Generador de Verdad o Reto",
    description: "Preguntas y retos limpios para fiestas, pijamadas y noches de juegos. Un clic por prompt, sin repeticiones.",
    url: `${SITE_URL}/es/truth-or-dare`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Cómo se juega a Verdad o Reto?",
    answer:
      "Por turnos, cada jugador elige 'verdad' o 'reto'. Si eliges verdad, respondes la pregunta con sinceridad; si eliges reto, completas el desafío. Este generador reparte una verdad o un reto limpio en cada clic, así nadie tiene que inventarlos sobre la marcha.",
  },
  {
    question: "¿Estas preguntas de Verdad o Reto son aptas para todos?",
    answer:
      "Sí — cada verdad y cada reto de este mazo es apto para todos los públicos y adecuado para fiestas mixtas, pijamadas, aulas y noches de juegos en familia. Sin temas para adultos.",
  },
  {
    question: "¿Puedo usarlo en una fiesta de niños o adolescentes?",
    answer:
      "Por supuesto. El mazo está pensado para ser divertido e inofensivo: retos tontos y verdades ligeras que funcionan para adolescentes, preadolescentes y reuniones familiares.",
  },
  {
    question: "¿Por qué es útil el mazo sin repeticiones?",
    answer:
      "El generador recorre todos los prompts antes de repetir ninguno, así que una partida larga nunca se vuelve aburrida y no te tocará el mismo reto dos veces seguidas.",
  },
  {
    question: "¿Y si alguien no quiere hacer un reto?",
    answer:
      "Las reglas de la casa varían — opciones habituales son una pequeña prenda, cambiar a una verdad o pasar una vez por jugador. Manténlo amistoso y deja que cualquiera se salte algo con lo que no se sienta cómodo.",
  },
];

export default function TruthOrDarePageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "Verdad o Reto" }]} />
        <PartyGenerator
          questions={TRUTH_OR_DARE_ES}
          title="Generador de Verdad o Reto"
          subtitle="Verdades y retos limpios y aptos para todos — un clic por prompt, sin repeticiones hasta ver todo el mazo."
          emoji="🎭"
          locale="es"
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              El juego de fiesta de siempre, sin los silencios incómodos
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Verdad o Reto</strong> depende de tener buenos prompts, y pensarlos sobre la marcha
                es donde se apagan casi todas las rondas. Este generador te da un mazo cuidado de verdades
                limpias y retos divertidos, uno por clic, sin repeticiones hasta agotar el mazo. Elige verdad
                para una pregunta reveladora o reto para un desafío inofensivo, y deja que el juego siga solo.
              </p>
              <p>
                ¿Más munición para la fiesta? Prueba{" "}
                <Link href="/es/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">Qué Prefieres</Link>,{" "}
                <Link href="/es/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">Yo Nunca</Link>,{" "}
                <Link href="/es/most-likely-to" className="text-[var(--neon-cyan)] hover:underline">Quién Es Más Probable</Link> o el{" "}
                <Link href="/es/question-generator" className="text-[var(--neon-cyan)] hover:underline">generador de preguntas</Link>.
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
