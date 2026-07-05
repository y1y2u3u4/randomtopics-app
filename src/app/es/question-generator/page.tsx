import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute:
      "Generador de Preguntas al Azar — Más de 500 Preguntas para Cualquier Grupo",
  },
  description:
    "Generador de preguntas al azar gratis: rompehielos, preguntas profundas, propuestas graciosas y preguntas de debate en 16 categorías. Filtra por profundidad, genera hasta 10 a la vez, sin registro.",
  alternates: {
    canonical: "/es/question-generator",
    languages: hreflangAlternates("/question-generator"),
  },
  openGraph: {
    title:
      "Generador de Preguntas al Azar — Más de 500 Preguntas para Cualquier Grupo",
    description:
      "Generador de preguntas al azar gratis: rompehielos, preguntas profundas, propuestas graciosas y preguntas de debate en 16 categorías. Sin registro.",
    url: `${SITE_URL}/es/question-generator`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Qué es un generador de preguntas al azar?",
    answer:
      "Un generador de preguntas al azar produce preguntas al momento —rompehielos, preguntas profundas de conversación, propuestas graciosas, preguntas de discusión— para que nunca tengas que idearlas tú. El nuestro parte de más de 500 preguntas seleccionadas a mano en 16 categorías, con un modo de IA para conseguir infinitas nuevas.",
  },
  {
    question: "¿Para qué puedo usar las preguntas al azar?",
    answer:
      "Los usos más comunes: rompehielos para reuniones y clases, juegos para conocerse en fiestas, práctica de conversación para estudiantes de idiomas, ideas para el diario, conversación en primeras citas, sesiones de trabajo en equipo y preguntas para cenas familiares.",
  },
  {
    question: "¿Puedo controlar qué tipo de preguntas obtengo?",
    answer:
      "Sí: filtra por categoría (ciencia, relaciones, comida, filosofía y 12 más), por profundidad (ligera, media, profunda) y por modo (conversación, rompehielos, estilo debate). Genera 1, 3, 5 o 10 preguntas a la vez.",
  },
  {
    question: "¿Son apropiadas las preguntas para el trabajo y la escuela?",
    answer:
      "La base de datos seleccionada es apta para el trabajo y el aula. Usa el filtro de profundidad «ligera» para las preguntas de rompehielos más seguras y el modo rompehielos para entornos de equipo.",
  },
  {
    question: "¿Es gratis este generador de preguntas?",
    answer:
      "Completamente gratis: sin registro, sin anuncios, sin límites. Se apoya en la misma base de datos de temas que impulsa nuestros generadores de conversación, debate y discursos.",
  },
];

export default function QuestionGeneratorPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Generador de Preguntas" },
          ]}
        />
        <TopicGenerator
          initialMode="icebreaker"
          locale="es"
          title="Generador de Preguntas al Azar"
          subtitle="Preguntas al instante para cualquier grupo: rompehielos, preguntas profundas, propuestas graciosas y todo lo que haya en medio."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              La Pregunta Adecuada para Cada Situación
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Una buena pregunta es una herramienta social: puede romper un silencio incómodo,
                convertir la charla superficial en una conversación de verdad o hacer hablar a una
                clase callada. Este <strong>generador de preguntas al azar</strong> te da un
                suministro inagotable, organizado para que puedas ajustar la pregunta al momento:{" "}
                <strong>preguntas ligeras</strong> para grupos nuevos, <strong>medias</strong> para
                el intercambio distendido y <strong>preguntas profundas</strong> para las
                conversaciones que importan.
              </p>
              <p>
                Está construido sobre la misma base de datos de más de 500 temas que nuestras otras
                herramientas, así que si necesitas un matiz más específico, salta al generador
                dedicado: <Link href="/es/icebreaker" className="text-[var(--neon-cyan)] hover:underline">preguntas rompehielos</Link> para
                equipos, <Link href="/es/conversation" className="text-[var(--neon-cyan)] hover:underline">iniciadores de conversación</Link> para
                entornos sociales o <Link href="/es/debate" className="text-[var(--neon-cyan)] hover:underline">preguntas de debate</Link> cuando
                quieras un desacuerdo estructurado.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Estilos de Preguntas y Cuándo Usarlos
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Rompehielos</strong> — primeras reuniones, incorporaciones, arranques de clase. Bajo riesgo, todos pueden responder. Prueba nuestros <Link href="/es/topics/icebreaker-questions-for-work" className="text-[var(--neon-cyan)] hover:underline">50 rompehielos para el trabajo</Link>.</li>
                <li><strong>Preguntas para conocerse</strong> — fiestas y nuevas amistades. Mira las <Link href="/es/topics/get-to-know-you-questions-for-adults" className="text-[var(--neon-cyan)] hover:underline">preguntas para adultos</Link>.</li>
                <li><strong>Preguntas profundas</strong> — amigos cercanos, parejas, diario. Explora las <Link href="/es/topics/deep-questions-to-ask-your-partner" className="text-[var(--neon-cyan)] hover:underline">preguntas profundas para tu pareja</Link>.</li>
                <li><strong>Preguntas graciosas</strong> — noches de juegos y chats de grupo. El <Link href="/es/funny" className="text-[var(--neon-cyan)] hover:underline">generador de temas divertidos</Link> se especializa en ellas.</li>
                <li><strong>Preguntas de discusión</strong> — aulas y clubes de lectura. Filtra por categorías académicas como ciencia, historia o filosofía.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tres Reglas para Hacer Mejores Preguntas
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Pregunta abierto, no cerrado.</strong> «¿Qué fue lo mejor de tu fin de semana?» supera a «¿Tuviste un buen fin de semana?»: la primera invita a contar una historia, la segunda invita a un «sí».</li>
                <li><strong>Sigue la energía.</strong> La pregunta generada es una puerta, no un guion. Si la respuesta abre un hilo más interesante, abandona el plan y tira de él.</li>
                <li><strong>Responde también a tu propia pregunta.</strong> La reciprocidad evita que las preguntas parezcan un interrogatorio: después de que respondan, comparte tu respuesta.</li>
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
