import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import WheelGenerator from "@/components/WheelGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Gira la Ruleta — Ruleta de Temas al Azar, Gratis y Sin Registro | Random Topics" },
  description:
    "Gira la ruleta para conseguir un tema al azar. Una ruleta de temas gratis con 16 categorías — perfecta para conversaciones, calentamientos en clase, debates y rompehielos. Un clic, resultado al instante, sin registro.",
  alternates: {
    canonical: "/es/spin-the-wheel",
    languages: hreflangAlternates("/spin-the-wheel"),
  },
  openGraph: {
    title: "Gira la Ruleta — Ruleta de Temas al Azar, Gratis y Sin Registro",
    description:
      "Gira la ruleta para conseguir un tema al azar en 16 categorías. Perfecta para conversaciones, clase, debates y rompehielos. Un clic, sin registro.",
    url: `${SITE_URL}/es/spin-the-wheel`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Qué es la ruleta de temas?",
    answer:
      "La ruleta de temas es un selector aleatorio gratuito que gira entre 16 categorías de temas — desde ciencia y tecnología hasta comida, relaciones y lo raro y divertido. Cuando la ruleta se detiene, te entrega un tema real de esa categoría, con puntos de conversación en los que puedes profundizar de inmediato.",
  },
  {
    question: "¿La ruleta es realmente aleatoria?",
    answer:
      "Sí. Cada giro selecciona una categoría con la misma probabilidad y luego elige un tema nuevo de la base de datos seleccionada de esa categoría, al azar. No hay ponderaciones ni registro — solo gira y listo.",
  },
  {
    question: "¿Para qué puedo usar la ruleta de temas?",
    answer:
      "Funciona como iniciador de conversación en fiestas y cenas, como pregunta de arranque o disparador de discusión en el aula, como calentamiento para Toastmasters y práctica de oratoria, y como desempate cuando un grupo no se decide de qué hablar.",
  },
  {
    question: "¿En qué se diferencia la ruleta del generador de temas?",
    answer:
      "Misma base de datos, distinta sensación. La ruleta añade ese momento de girar y revelar que encanta a los grupos, mientras que el generador clásico te deja filtrar por modo, categoría y profundidad y sacar varios temas a la vez. Usa la ruleta para diversión y sorpresa, y el generador para tener control.",
  },
  {
    question: "¿Necesito descargar algo o crear una cuenta?",
    answer:
      "No. La ruleta de temas funciona por completo en tu navegador, es totalmente gratis y nunca te pide registrarte ni instalar nada.",
  },
];

export default function SpinTheWheelPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "Gira la Ruleta" }]} />
        <WheelGenerator
          locale="es"
          title="Gira la Ruleta"
          subtitle="Gira la ruleta de temas al azar entre 16 categorías — un clic, un tema, combinaciones infinitas."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Una Ruleta de Temas al Azar que de Verdad te Da Algo que Decir
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                La mayoría de las herramientas de <strong>girar la ruleta</strong> se quedan en una palabra o un
                nombre. Esta aterriza en un <strong>tema completo al azar</strong> — un disparador real con puntos
                de conversación incluidos — así que en cuanto la ruleta se detiene, ya sabes de qué hablar, escribir
                o debatir. Dieciséis categorías ocupan la ruleta, desde ciencia y tecnología hasta comida y viajes,
                relaciones, historia y lo maravillosamente raro. Dale un giro y deja que el azar rompa el punto muerto.
              </p>
              <p>
                La ruleta es la prima juguetona de nuestro{" "}
                <Link href="/es" className="text-[var(--neon-cyan)] hover:underline">
                  generador de temas al azar
                </Link>
                . Ambos beben de la misma base de datos seleccionada de más de 500 temas, pero la ruleta añade el
                suspense de girar y revelar que encanta a los grupos. ¿Prefieres control en lugar de azar? El
                generador te deja filtrar por modo, categoría y profundidad, y sacar varios temas a la vez.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Formas de Usar la Ruleta de Temas
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <strong>Fiestas y cenas:</strong> gira cuando la conversación se estanque — el factor sorpresa
                  hace el trabajo pesado.
                </li>
                <li>
                  <strong>Aulas:</strong> úsala como pregunta de arranque o calentamiento de discusión. Combínala con el{" "}
                  <Link href="/es/debate/middle-school" className="text-[var(--neon-cyan)] hover:underline">
                    generador de debate para secundaria
                  </Link>{" "}
                  como semilla rápida de escritura persuasiva.
                </li>
                <li>
                  <strong>Oratoria:</strong> gira, tómate 30 segundos y da una charla improvisada de dos minutos —
                  ideal para practicar los{" "}
                  <Link href="/es/table-topics-generator" className="text-[var(--neon-cyan)] hover:underline">
                    Table Topics de Toastmasters
                  </Link>
                  .
                </li>
                <li>
                  <strong>Rompehielos:</strong> deja que cada persona gire una vez y responda lo que le toque en la ruleta.
                </li>
              </ul>

              <p>
                ¿Prefieres un mazo fijo? Prueba{" "}
                <Link href="/es/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">
                  Qué Prefieres
                </Link>
                ,{" "}
                <Link href="/es/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">
                  Yo Nunca
                </Link>
                , o el{" "}
                <Link href="/es/question-generator" className="text-[var(--neon-cyan)] hover:underline">
                  generador de preguntas al azar
                </Link>
                .
              </p>

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
