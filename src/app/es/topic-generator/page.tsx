import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute:
      "Generador de Temas Gratis — Consigue un Tema al Azar al Instante (Sin Registro)",
  },
  description:
    "¿Necesitas un tema? Nuestro generador de temas gratis crea temas al azar para conversaciones, ensayos, discursos, debates y escritura creativa. Más de 500 temas en 16 categorías. Un clic, resultados al instante.",
  alternates: {
    canonical: "/es/topic-generator",
    languages: hreflangAlternates("/topic-generator"),
  },
  openGraph: {
    title:
      "Generador de Temas Gratis — Consigue un Tema al Azar al Instante (Sin Registro)",
    description:
      "Nuestro generador de temas gratis crea temas al azar para conversaciones, ensayos, discursos, debates y escritura creativa. Más de 500 temas en 16 categorías.",
    url: `${SITE_URL}/es/topic-generator`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

export default function TopicGeneratorPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Generador de Temas" },
          ]}
        />
        <TopicGenerator
          locale="es"
          title="Generador de Temas"
          subtitle="Genera temas al azar al instante para cualquier propósito. Pulsa el botón, obtén un tema y empieza a crear."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]"
            >
              El Generador de Temas Gratis Definitivo
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Tanto si necesitas un <strong>tema para un ensayo</strong>, un{" "}
                <strong>iniciador de conversación</strong>, una <strong>propuesta de debate</strong> o
                una <strong>idea para un discurso</strong>, nuestro generador de temas te ofrece
                inspiración al instante. Con más de 500 temas seleccionados en 16 categorías, nunca
                más te quedarás mirando una página en blanco.
              </p>
              <p>
                A diferencia de los simples generadores de palabras al azar, cada tema aquí está
                elaborado a mano para provocar una conversación de verdad. Cada uno viene con puntos
                de conversación que te ayudan a desarrollar tus ideas más a fondo. Filtra por
                categoría, nivel de profundidad o modo para encontrar exactamente el tema adecuado
                para lo que necesitas.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ¿Para Qué Puedes Usar Este Generador de Temas?
              </h3>

              <ul className="space-y-3 list-none pl-0">
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">1.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Ensayos y Escritura Académica</strong>
                    <p className="mt-1">¿No sabes sobre qué escribir? Genera temas filtrados por categoría para que encajen con tu área de estudio. Ideal para trabajos de investigación, artículos de opinión y tareas de clase.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">2.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Conversaciones y Rompehielos</strong>
                    <p className="mt-1">Perfecto para primeras citas, reuniones de equipo, cenas familiares o cualquier momento en que necesites <Link href="/es/conversation" className="text-[var(--neon-cyan)] hover:underline">iniciar una conversación</Link>. Nuestros temas están pensados para hacer hablar a la gente.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">3.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Debates y Discusiones</strong>
                    <p className="mt-1">Encuentra <Link href="/es/debate" className="text-[var(--neon-cyan)] hover:underline">temas de debate</Link> que invitan a reflexionar y con varias perspectivas. Cada tema está equilibrado para defender ambos lados del argumento.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">4.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Discursos y Presentaciones</strong>
                    <p className="mt-1">¿Necesitas un <Link href="/es/speech" className="text-[var(--neon-cyan)] hover:underline">tema para un discurso</Link>? Genera ideas atractivas, relevantes y con suficiente profundidad para llenar tu tiempo asignado.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">5.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Escritura Creativa y Diario</strong>
                    <p className="mt-1">Usa los temas como <Link href="/es/writing" className="text-[var(--neon-cyan)] hover:underline">ideas para escribir</Link> y supera el bloqueo del escritor. Perfecto para el diario diario, la escritura de ficción o ideas de contenido para blogs.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">6.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Diversión y Entretenimiento</strong>
                    <p className="mt-1">¿Quieres algo <Link href="/es/funny" className="text-[var(--neon-cyan)] hover:underline">divertido y raro</Link>? Genera temas graciosos y disparatados perfectos para fiestas, noches de juegos y viajes por carretera.</p>
                  </div>
                </li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cómo Funciona
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Elige tus filtros</strong> (opcional) &mdash; selecciona una categoría, un modo o un nivel de profundidad</li>
                <li><strong>Pulsa generar</strong> &mdash; obtén un tema al azar al instante</li>
                <li><strong>Explora los puntos de conversación</strong> &mdash; cada tema incluye ideas de partida para desarrollar</li>
                <li><strong>Genera otra vez</strong> &mdash; ¿no es del todo lo que buscabas? Un clic más para un tema nuevo</li>
              </ol>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Preguntas Frecuentes
              </h3>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿De verdad es gratis este generador de temas?</h4>
              <p>
                Sí, 100% gratis, sin registro, sin cuenta y sin límites. Genera todos los temas que
                quieras, cuando quieras.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Cuántos temas hay disponibles?</h4>
              <p>
                Nuestra biblioteca seleccionada incluye más de 500 temas escritos a mano en 16
                categorías. Con la generación por IA activada, además obtienes temas nuevos y únicos
                cada vez que pulsas.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Puedo usar estos temas para la escuela o el trabajo?</h4>
              <p>
                Por supuesto. Nuestros temas están pensados para ensayos académicos, debates en clase,
                reuniones de equipo, presentaciones y desarrollo profesional. Filtra por categoría y
                profundidad para encontrar el adecuado.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Qué lo hace mejor que simplemente buscar temas en Google?</h4>
              <p>
                Nuestro generador te da un único tema enfocado cada vez &mdash; sin scroll infinito por
                listados. Cada tema incluye puntos de conversación que te ayudan a empezar de inmediato.
                Y el factor aleatorio hace que descubras temas que nunca habrías buscado.
              </p>
            </div>
          </div>
        </section>

        {/* JSON-LD FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              inLanguage: "es",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "¿De verdad es gratis este generador de temas?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sí, 100% gratis, sin registro, sin cuenta y sin límites. Genera todos los temas que quieras, cuando quieras.",
                  },
                },
                {
                  "@type": "Question",
                  name: "¿Cuántos temas hay disponibles?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Nuestra biblioteca seleccionada incluye más de 500 temas escritos a mano en 16 categorías. Con la generación por IA activada, además obtienes temas nuevos y únicos cada vez que pulsas.",
                  },
                },
                {
                  "@type": "Question",
                  name: "¿Puedo usar estos temas para la escuela o el trabajo?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Por supuesto. Nuestros temas están pensados para ensayos académicos, debates en clase, reuniones de equipo, presentaciones y desarrollo profesional.",
                  },
                },
                {
                  "@type": "Question",
                  name: "¿Qué lo hace mejor que simplemente buscar temas en Google?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Nuestro generador te da un único tema enfocado cada vez, con puntos de conversación que te ayudan a empezar de inmediato. El factor aleatorio hace que descubras temas que nunca habrías buscado.",
                  },
                },
              ],
            }),
          }}
        />
      </main>
      <Footer locale="es" />
    </>
  );
}
