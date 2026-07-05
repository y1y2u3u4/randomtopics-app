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
      "Generador de Argumentos al Azar — Temas Gratis a Favor y en Contra",
  },
  description:
    "Genera argumentos al azar con posturas claras a favor y en contra. Generador de argumentos gratis para practicar debates, ensayos persuasivos, ejercicios de pensamiento crítico y disputas amistosas. Sin registro.",
  alternates: {
    canonical: "/es/argument-generator",
    languages: hreflangAlternates("/argument-generator"),
  },
  openGraph: {
    title:
      "Generador de Argumentos al Azar — Temas Gratis a Favor y en Contra",
    description:
      "Genera argumentos al azar con posturas claras a favor y en contra. Para practicar debates, ensayos persuasivos, pensamiento crítico y disputas amistosas. Sin registro.",
    url: `${SITE_URL}/es/argument-generator`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Qué es un generador de argumentos al azar?",
    answer:
      "Un generador de argumentos al azar produce afirmaciones debatibles —tesis que personas razonables pueden defender o rebatir— junto con puntos de conversación para ambos bandos. Se usa para practicar debates, generar ideas para ensayos persuasivos, hacer ejercicios de pensamiento crítico y organizar discusiones estructuradas.",
  },
  {
    question: "¿En qué se diferencia un argumento de un tema de debate?",
    answer:
      "Están muy relacionados: un tema de debate suele plantearse como una resolución formal («Esta cámara cree que...»), mientras que un argumento es cualquier afirmación con dos posturas defendibles. Cada argumento que produce nuestro generador puede usarse como tema de debate, como tesis de un ensayo o como iniciador de discusión.",
  },
  {
    question: "¿Puedo usar los argumentos generados para ensayos persuasivos?",
    answer:
      "Sí: cada argumento viene con puntos de conversación a favor y en contra que encajan directamente en la estructura del ensayo persuasivo: elige un bando, usa los puntos de conversación como párrafos del cuerpo y aborda los puntos contrarios en tu sección de refutación.",
  },
  {
    question: "¿Son adecuados los argumentos para el aula?",
    answer:
      "Sí. Puedes filtrar por categoría (ciencia, educación, tecnología, ética y más) y por nivel de profundidad para mantener los argumentos adecuados a cada edad. Los profesores usan el generador para debates en clase, seminarios socráticos y calentamientos de pensamiento crítico.",
  },
  {
    question: "¿Es gratis este generador de argumentos?",
    answer:
      "Completamente gratis: sin registro, sin anuncios, sin límites de uso. Puedes generar hasta 10 argumentos a la vez y activar la generación por IA para obtener argumentos nuevos ilimitados.",
  },
];

export default function ArgumentGeneratorPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Generador de Argumentos" },
          ]}
        />
        <TopicGenerator
          initialMode="debate"
          locale="es"
          title="Generador de Argumentos al Azar"
          subtitle="Genera afirmaciones debatibles con puntos de conversación listos a favor y en contra: para debates, ensayos y afinar tu razonamiento."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              ¿Qué Hace Fuerte a un Argumento?
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Un <strong>argumento</strong> fuerte es una afirmación que se puede defender de verdad
                —y rebatir de verdad— con razones y pruebas. «El chocolate está rico» es una opinión;
                «los colegios deberían sustituir las notas por comentarios escritos» es un argumento.
                Nuestro <strong>generador de argumentos al azar</strong> produce cientos de
                afirmaciones como esta última, cada una con puntos de conversación para ambos bandos,
                para que puedas ponerte a razonar directamente en lugar de buscar sobre qué discutir.
              </p>
              <p>
                La gente usa argumentos generados al azar en más sitios de los que imaginas: los
                equipos de debate practican réplicas contra afirmaciones sorpresa, los profesores de
                escritura los asignan como tesis de ensayos persuasivos, los preparadores de
                entrevistas los usan para practicar el pensamiento estructurado y los amigos amenizan
                los viajes largos en coche con ellos. Si prefieres resoluciones planteadas de forma
                más formal, prueba nuestro{" "}
                <Link href="/es/debate" className="text-[var(--neon-cyan)] hover:underline">generador de temas de debate</Link>:
                parte de la misma base de datos seleccionada con un planteamiento de torneo.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cómo Argumentar Bien (un Marco de 4 Pasos)
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Enuncia la afirmación con precisión.</strong> Las afirmaciones vagas producen argumentos vagos. Acota «la tecnología es mala» hasta «hay que prohibir los móviles en las aulas de secundaria».</li>
                <li><strong>Da razones y luego pruebas.</strong> Una razón explica por qué tu afirmación es cierta; las pruebas lo demuestran. «Los móviles perjudican la concentración (razón): un estudio de 2024 halló que las notas subieron un 6% tras prohibirlos (prueba).»</li>
                <li><strong>Refuerza el otro lado.</strong> Antes de descartar una objeción, formúlala en su versión más fuerte. Vencer a una versión débil del contraargumento no convence a nadie.</li>
                <li><strong>Cierra con el impacto.</strong> Explica por qué importa tu argumento: quién sale beneficiado, qué cambia y qué está en juego si te equivocas.</li>
              </ol>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Formas Populares de Usar Este Generador
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Práctica de debate:</strong> genera un argumento sorpresa, toma el bando con el que no estás de acuerdo y date dos minutos para defenderlo.</li>
                <li><strong>Ensayos persuasivos:</strong> usa una afirmación generada como tu tesis y los puntos de conversación como esquemas de párrafo. Mira también nuestros <Link href="/es/topics/random-essay-topics-for-college" className="text-[var(--neon-cyan)] hover:underline">temas de ensayo para la universidad</Link>.</li>
                <li><strong>Discusiones en clase:</strong> pon un argumento generado en la pizarra y haz que los estudiantes se coloquen en el espectro de acuerdo/desacuerdo y luego defiendan su postura.</li>
                <li><strong>Ejercicios de pensamiento crítico:</strong> para cualquier argumento generado, enumera las tres objeciones más fuertes antes de mirar los puntos de conversación en contra.</li>
                <li><strong>Disputas amistosas:</strong> nuestro modo de <Link href="/es/funny" className="text-[var(--neon-cyan)] hover:underline">temas divertidos</Link> produce argumentos de bajo riesgo como «un perrito caliente es un sándwich»: perfectos para fiestas.</li>
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
