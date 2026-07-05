import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import SpeechTimer from "@/components/SpeechTimer";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Generador de Temas de Discurso Improvisado — Practica con Temporizador | Random Topics" },
  description:
    "Genera temas de discurso improvisado al azar y practica contra un temporizador integrado. Herramienta gratuita para clase de oratoria, competición, Toastmasters y preparación de entrevistas: más de 500 temas, sin registro.",
  alternates: {
    canonical: "/es/impromptu-speech-topics",
    languages: hreflangAlternates("/impromptu-speech-topics"),
  },
  openGraph: {
    title: "Generador de Temas de Discurso Improvisado — Practica con Temporizador",
    description:
      "Genera temas de discurso improvisado al azar y practica contra un temporizador integrado. Gratis para clase de oratoria, competición, Toastmasters y entrevistas.",
    url: `${SITE_URL}/es/impromptu-speech-topics`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Qué es un discurso improvisado?",
    answer:
      "Un discurso improvisado se pronuncia con poca o ninguna preparación: recibes un tema y hablas en cuestión de segundos o minutos. Es una prueba habitual en clase de oratoria, en competiciones de debate (pruebas de preparación limitada), en los Table Topics de Toastmasters y en muchas entrevistas de trabajo.",
  },
  {
    question: "¿Cuánto dura un discurso improvisado?",
    answer:
      "Formatos habituales: 1-2 minutos para los Table Topics de Toastmasters, 3-5 minutos para el improvisado de aula y 5-7 minutos (con hasta 2 minutos de preparación) para el improvisado competitivo de la NSDA. Nuestro temporizador integrado cubre todos estos ajustes preestablecidos.",
  },
  {
    question: "¿Cuáles son buenos temas de discurso improvisado?",
    answer:
      "Los mejores temas para improvisar son aquellos sobre los que cualquiera puede hablar sin documentarse: experiencias personales, opiniones sobre preguntas cotidianas, palabras abstractas (valentía, fracaso, suerte), refranes e hipótesis ligeras. Nuestro generador te permite filtrar por categoría y profundidad para adaptarlo a tu público.",
  },
  {
    question: "¿Cómo estructuro un discurso improvisado rápidamente?",
    answer:
      "Usa PREP: Punto (di tu respuesta), Razón (por qué lo crees), Ejemplo (una anécdota breve o un dato) y Punto (reafírmalo para cerrar). Con 30 segundos para pensar, decide tu Punto y tu Ejemplo: el resto se completa solo mientras hablas.",
  },
  {
    question: "¿Este generador de discursos improvisados es gratis?",
    answer:
      "Sí: más de 500 temas seleccionados, filtros de categoría y profundidad, generación ilimitada con IA y el temporizador de práctica son todos gratis, sin registro ni anuncios.",
  },
];

export default function ImpromptuSpeechPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Temas de Discurso Improvisado" },
          ]}
        />
        <TopicGenerator
          initialMode="speech"
          locale="es"
          title="Generador de Temas de Discurso Improvisado"
          subtitle="Recibe un tema sorpresa, pon en marcha el temporizador y practica hablar sobre la marcha, tal como ocurre en clase, en concursos y en entrevistas."
        />

        {/* Speech Timer */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
          <SpeechTimer />
        </section>

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Cómo Practicar la Oratoria Improvisada
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Hablar de forma improvisada parece un don, pero es una habilidad entrenable con una fórmula
                sencilla: <strong>repeticiones bajo presión de tiempo</strong>. Leer consejos no te hace
                mejorar; hablar sí. Esta página combina un <strong>generador de temas de discurso improvisado
                al azar</strong> con un <strong>temporizador de práctica</strong> para que puedas hacer
                ejercicios realistas: genera un tema, date 15-30 segundos para pensar y luego habla hasta que
                suene el temporizador.
              </p>
              <p>
                Los formatos improvisados aparecen por todas partes: tareas de clase de oratoria, pruebas de
                preparación limitada de la NSDA y competiciones de debate, los{" "}
                <Link href="/es/table-topics-generator" className="text-[var(--neon-cyan)] hover:underline">Table Topics</Link>{" "}
                de Toastmasters, las respuestas de crisis en simulacros de la ONU y la clásica pregunta trampa
                de entrevista (&quot;Cuéntame de una vez que...&quot;). El hilo común: una estructura que puedes
                desplegar en segundos y una entrega serena mientras tu mente se pone al día.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                La Rutina de Preparación de 30 Segundos
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Segundos 0-10 — Elige tu punto.</strong> Decide la única frase que dirías si solo pudieras decir una. Esa es tu apertura y tu cierre.</li>
                <li><strong>Segundos 10-25 — Elige dos apoyos.</strong> Una razón y una anécdota, o dos ejemplos. No esquematices más de dos: en los discursos cortos la profundidad supera a la amplitud.</li>
                <li><strong>Segundos 25-30 — Fija tu primera frase.</strong> Saber exactamente cómo vas a empezar elimina el silencio más peligroso: el primero.</li>
              </ol>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Plan de Práctica Semanal (15 Minutos al Día)
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Lun/Mié/Vie:</strong> 4 temas × discursos de 2 minutos con 30 segundos de preparación. Graba uno y cuenta las muletillas.</li>
                <li><strong>Mar/Jue:</strong> 2 temas × discursos de 5 minutos con 2 minutos de preparación, para ganar resistencia y una estructura más profunda.</li>
                <li><strong>Fin de semana:</strong> un &quot;arranque en frío&quot;: habla en el instante en que leas el tema, con cero preparación. Es el ejercicio más difícil y el de mayor rendimiento.</li>
              </ul>
              <p>
                ¿Preparas una presentación completa en su lugar? Explora nuestro{" "}
                <Link href="/es/speech" className="text-[var(--neon-cyan)] hover:underline">generador de temas para discursos</Link>{" "}
                para ideas de discursos preparados, o toma listas ya hechas como{" "}
                <Link href="/es/topics/presentation-ideas-for-school" className="text-[var(--neon-cyan)] hover:underline">ideas de presentación para la escuela</Link>.
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
