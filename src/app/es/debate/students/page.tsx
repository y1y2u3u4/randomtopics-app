import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Generador de Temas de Debate para Estudiantes — Secundaria y Bachillerato | Random Topics" },
  description:
    "Generador de temas de debate al azar para estudiantes: temas adecuados a la edad con argumentos a favor y en contra para aulas de secundaria, bachillerato y universidad. Gratis para profesores, sin registro.",
  alternates: {
    canonical: "/es/debate/students",
    languages: hreflangAlternates("/debate/students"),
  },
  openGraph: {
    title: "Generador de Temas de Debate para Estudiantes — Secundaria y Bachillerato",
    description:
      "Temas de debate adecuados a la edad con argumentos a favor y en contra para el aula, clubes de debate y práctica en casa. Gratis, sin registro.",
    url: `${SITE_URL}/es/debate/students`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Cuáles son buenos temas de debate para estudiantes de secundaria?",
    answer:
      "Los estudiantes de secundaria debaten mejor sobre temas que viven directamente: ¿Debería abolirse la tarea? ¿Deberían empezar más tarde las clases? ¿Deberían permitirse los móviles en clase? Mantén los temas concretos y ligados a la vida diaria — las preguntas de política abstracta funcionan mejor en bachillerato.",
  },
  {
    question: "¿Cuáles son buenos temas de debate para estudiantes de bachillerato?",
    answer:
      "El alumnado de bachillerato puede manejar matices y evidencia: regulación de las redes sociales, la IA en la educación, la edad para votar, el coste de la universidad, la política climática. Los mejores temas de bachillerato tienen argumentos creíbles en ambos bandos e investigación disponible para citar.",
  },
  {
    question: "¿Cómo organizo un debate en clase?",
    answer:
      "Un formato sencillo: divide la clase en equipos a favor y en contra, da 10 minutos de preparación, luego alterna discursos de 2 minutos (apertura, réplica, cierre) y termina con una votación de la clase al bando más persuasivo — no a la opinión personal. Los puntos a favor y en contra de nuestro generador sirven también de andamiaje para la preparación.",
  },
  {
    question: "¿Pueden los estudiantes usar este generador para practicar debate en casa?",
    answer:
      "Sí — genera un tema, ponte del lado con el que no estás de acuerdo y defiéndelo durante dos minutos. Practicar el bando contrario es la forma más rápida de reforzar las réplicas y el pensamiento crítico.",
  },
  {
    question: "¿Es gratis para profesores y centros educativos?",
    answer:
      "Completamente gratis, sin registro y sin anuncios. Los profesores pueden proyectar el generador en clase, filtrar por categoría y profundidad para adecuarlo a la edad, y generar hasta 10 temas a la vez para el trabajo en grupo.",
  },
];

export default function StudentDebatePageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Temas de Debate", href: "/es/debate" },
            { label: "Para Estudiantes" },
          ]}
        />
        <TopicGenerator
          locale="es"
          initialMode="debate"
          title="Generador de Temas de Debate para Estudiantes"
          subtitle="Temas de debate adecuados a la edad con argumentos a favor y en contra — pensados para el aula, los clubes de debate y la práctica en casa."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Temas de Debate que Funcionan en Aulas Reales
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                La diferencia entre un debate que prende y uno que muere a los dos minutos casi siempre
                está en el tema. Los <strong>temas de debate para estudiantes</strong> necesitan tres cosas:
                ambos bandos deben ser genuinamente defendibles, el asunto debe conectar con la vida del
                alumnado, y el lenguaje debe ajustarse a su curso. Este generador filtra nuestra base de más
                de 500 temas buscando exactamente esas cualidades, y cada tema viene con <strong>puntos a
                favor y en contra</strong> que el alumnado puede usar como andamiaje de preparación.
              </p>
              <p>
                Los profesores lo usan de tres maneras: proyectándolo en directo y generando temas hasta que
                la clase encuentra uno que la divide; generando 10 temas para debates paralelos en grupos
                pequeños; o asignándolo como tarea para practicar réplicas. ¿Prefieres una lista fija para
                imprimir? Nuestra selección de <Link href="/es/topics/debate-topics-for-students" className="text-[var(--neon-cyan)] hover:underline">75 temas de debate para estudiantes</Link> está
                organizada por franja de edad.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ajustar los Temas al Nivel Escolar
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>1.º-2.º de ESO (11-13 años):</strong> temas concretos y cercanos a su experiencia — normas del centro, tarea, deporte, tecnología en casa. Usa el filtro de profundidad «ligero».</li>
                <li><strong>3.º-4.º de ESO (14-15 años):</strong> introduce temas basados en evidencia — redes sociales, videojuegos, política escolar — donde el alumnado debe citar al menos una fuente por argumento.</li>
                <li><strong>Bachillerato y universidad:</strong> temas de política y ética con implicaciones reales — IA, clima, justicia penal, economía. Usa los filtros «medio» y «profundo», y consulta nuestra colección de <Link href="/es/topics/controversial-topics-to-discuss" className="text-[var(--neon-cyan)] hover:underline">temas controvertidos</Link> para clases avanzadas.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Un Plan de Debate en Clase de 30 Minutos
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Minutos 0-5:</strong> genera temas hasta que la clase quede más o menos dividida; asigna los equipos a favor y en contra (pon a propósito a algunos estudiantes en el bando con el que no están de acuerdo).</li>
                <li><strong>Minutos 5-15:</strong> preparación en equipo usando los puntos de conversación como puntos de partida — cada orador debe añadir un argumento original.</li>
                <li><strong>Minutos 15-27:</strong> discursos alternos: aperturas de 2 minutos, réplicas de 1 minuto, cierres de 1 minuto.</li>
                <li><strong>Minutos 27-30:</strong> la clase vota al equipo más persuasivo, luego un repaso de 2 minutos: ¿qué único argumento movió más votos, y por qué?</li>
              </ol>

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
