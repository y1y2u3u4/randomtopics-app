import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Generador de Temas de Debate Divertidos — Discusiones Absurdas | Random Topics" },
  description:
    "Genera temas de debate divertidos: ¿es un perrito caliente un sándwich?, ¿son sopa los cereales?, y cientos de discusiones absurdas más con puntos a favor y en contra. Generador gratis para fiestas, aulas y rompehielos.",
  alternates: {
    canonical: "/es/debate/funny",
    languages: hreflangAlternates("/debate/funny"),
  },
  openGraph: {
    title: "Generador de Temas de Debate Divertidos — Discusiones Absurdas",
    description:
      "Genera temas de debate divertidos con puntos a favor y en contra: cientos de discusiones absurdas para fiestas, aulas y rompehielos. Gratis, sin registro.",
    url: `${SITE_URL}/es/debate/funny`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Qué son los temas de debate divertidos?",
    answer:
      "Los temas de debate divertidos son preguntas sin importancia sobre las que la gente discute con pasión precisamente porque no tienen consecuencias: ¿Es un perrito caliente un sándwich? ¿Son sopa los cereales? ¿Preferirías luchar contra un pato del tamaño de un caballo o contra cien caballos del tamaño de un pato? Desarrollan verdaderas habilidades de argumentación con cero tensión real.",
  },
  {
    question: "¿Cuándo usar temas de debate divertidos en lugar de temas serios?",
    answer:
      "Usa los temas divertidos para rompehielos, encuentros de equipo, juegos de fiesta, la primera reunión de un club de debate y cualquier aula donde el alumnado esté nervioso por hablar en público. Las apuestas absurdas reducen el miedo a equivocarse sin dejar de ejercitar la estructura, la réplica y la exposición.",
  },
  {
    question: "¿Son los debates divertidos buena práctica para debates reales?",
    answer:
      "Sorprendentemente buena. Como nadie investiga si los cereales son sopa, los debates divertidos obligan al razonamiento puro y a la improvisación — los mismos músculos que se usan al hablar de forma improvisada. Muchos entrenadores calientan con una ronda absurda antes de la práctica seria.",
  },
  {
    question: "¿Puedo usar estos temas con niños?",
    answer:
      "Sí — los temas de debate divertidos son naturalmente aptos para niños, y puedes añadir el filtro de profundidad «ligero» para grupos más jóvenes. Son populares para las noches de juegos en familia y las pausas mentales en aulas de primaria.",
  },
  {
    question: "¿Cuántos temas de debate divertidos tiene este generador?",
    answer:
      "Cientos de propuestas absurdas seleccionadas, más un modo con IA que genera un número ilimitado de temas nuevos. Cada uno viene con puntos a favor y en contra con humor para arrancar la discusión.",
  },
];

export default function FunnyDebatePageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Temas de Debate", href: "/es/debate" },
            { label: "Divertidos" },
          ]}
        />
        <TopicGenerator
          locale="es"
          initialMode="debate"
          initialCategory="weird-fun"
          title="Generador de Temas de Debate Divertidos"
          subtitle="Preguntas graciosamente debatibles con puntos a favor y en contra — perfectas para fiestas, rompehielos y calentamientos de club de debate."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Por Qué las Discusiones Absurdas Hacen Grandes Debates
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Pregunta a una sala si los impuestos deberían ser más altos y la mitad se queda callada.
                Pregunta si un <strong>perrito caliente es un sándwich</strong> y de repente todo el mundo
                tiene una postura apasionada y bien defendida, con un esquema de tres partes. Esa es la magia
                de los <strong>temas de debate divertidos</strong>: eliminan el riesgo social sin perder ni una
                sola de las habilidades mecánicas de la argumentación — afirmaciones, definiciones, evidencia,
                réplica y exposición.
              </p>
              <p>
                Este generador se centra en el extremo raro y divertido de nuestra base de datos de temas.
                ¿Quieres la versión seria para aulas y clubes? Usa el
                {" "}<Link href="/es/debate" className="text-[var(--neon-cyan)] hover:underline">generador de temas de debate</Link> principal
                o la <Link href="/es/debate/students" className="text-[var(--neon-cyan)] hover:underline">edición para estudiantes</Link>.
                Para preguntas de fiesta con formato de pregunta, prueba
                nuestras <Link href="/es/topics/would-you-rather-questions" className="text-[var(--neon-cyan)] hover:underline">preguntas de qué prefieres</Link>.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Formatos Clásicos de Debate Divertido
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Guerra gastronómica:</strong> peleas de definiciones sobre comida — perrito caliente vs. sándwich, cereales vs. sopa, si la piña va en la pizza. El truco es obligar a los debatientes a definir primero sus categorías.</li>
                <li><strong>Hipótesis absurdas:</strong> preguntas del pato del tamaño de un caballo. Geniales para la improvisación porque nadie puede prepararse.</li>
                <li><strong>Colinas insignificantes:</strong> el papel higiénico por encima o por debajo, si el kétchup debe vivir en la nevera — todos ya tienen una postura de por vida que defender.</li>
                <li><strong>Ruleta del abogado del diablo:</strong> genera un tema y luego lanza una moneda para decidir tu bando. Defender la postura que te parece ridícula es un entrenamiento de persuasión de élite.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
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
