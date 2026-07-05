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
  title: { absolute: "Generador de Table Topics — Preguntas de Toastmasters + Temporizador | Random Topics" },
  description:
    "Generador gratuito de Table Topics para Toastmasters con temporizador de discurso de 1-2 minutos integrado. Genera preguntas de oratoria improvisada al azar, practica contra el reloj y nunca te quedes sin ideas para Table Topics.",
  alternates: {
    canonical: "/es/table-topics-generator",
    languages: hreflangAlternates("/table-topics-generator"),
  },
  openGraph: {
    title: "Generador de Table Topics — Preguntas de Toastmasters + Temporizador",
    description:
      "Generador gratuito de Table Topics para Toastmasters con temporizador integrado. Genera preguntas de oratoria improvisada al azar y practica contra el reloj.",
    url: `${SITE_URL}/es/table-topics-generator`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Qué son los Table Topics en Toastmasters?",
    answer:
      "Table Topics es la sección de oratoria improvisada de una reunión de Toastmasters. El maestro de Table Topics lanza una pregunta sorpresa y un miembro responde con un discurso de 1 a 2 minutos sin preparación. Entrena tu capacidad de pensar sobre la marcha y hablar con confianza sin apuntes.",
  },
  {
    question: "¿Cuánto debe durar una respuesta de Table Topics?",
    answer:
      "El tiempo estándar de Toastmasters es de 1 a 2 minutos: luz verde a los 1:00, ámbar a los 1:30 y roja a los 2:00. Nuestro temporizador de discurso integrado tiene ajustes preestablecidos exactamente para este formato, así que puedes practicar acertando la franja de verde a rojo.",
  },
  {
    question: "¿Cómo puedo mejorar en Table Topics?",
    answer:
      "Practica una estructura sencilla: responde la pregunta directamente en tu primera frase, da una razón o anécdota que la respalde y cierra reafirmando tu punto. Genera una pregunta al azar aquí, pon en marcha el temporizador y repite el ejercicio 3-5 veces por sesión: la mejora llega rápido.",
  },
  {
    question: "¿Puedo usar este generador para dirigir los Table Topics de mi club?",
    answer:
      "Sí: muchos maestros de Table Topics generan un lote de hasta 10 preguntas antes de la reunión, o proyectan esta página en vivo. Puedes filtrar por categoría y profundidad para adaptarlo al tema del día de tu club.",
  },
  {
    question: "¿Este generador de Table Topics es gratis?",
    answer:
      "Completamente gratis, sin registro ni anuncios. Incluye más de 500 preguntas seleccionadas, filtros de categoría y profundidad, un modo con IA para preguntas nuevas ilimitadas y el temporizador de práctica integrado.",
  },
];

export default function TableTopicsPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Generador de Table Topics" },
          ]}
        />
        <TopicGenerator
          initialMode="speech"
          locale="es"
          title="Generador de Table Topics"
          subtitle="Preguntas de oratoria improvisada al azar para Toastmasters: genera una pregunta, pon en marcha el temporizador y practica pensar sobre la marcha."
        />

        {/* Speech Timer */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
          <SpeechTimer locale="es" />
        </section>

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Practica Table Topics como un Toastmaster
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Los <strong>Table Topics</strong> son donde la mayoría de los Toastmasters sienten más miedo,
                y donde más crecen. A diferencia de los discursos preparados, recibes una pregunta sorpresa y
                unos 60 a 120 segundos para dar una respuesta coherente. La única forma de ganar soltura es la
                repetición: escucha una pregunta al azar, ponte de pie, habla, repite. Para eso está pensado
                exactamente este <strong>generador de Table Topics</strong> y, a diferencia de las listas de
                preguntas imprimibles, viene con un <strong>temporizador de discurso integrado</strong> que
                imita la secuencia de tarjetas verde-ámbar-roja de las reuniones reales.
              </p>
              <p>
                La base de datos de preguntas abarca 16 categorías, desde propuestas ligeras estilo
                &quot;¿qué prefieres?&quot; hasta preguntas más profundas sobre valores y experiencias, para que
                puedas simular de todo, desde una noche informal de club hasta un concurso de distrito.
                ¿Necesitas una lista completa de preguntas para imprimir? Consulta nuestras{" "}
                <Link href="/es/topics/toastmasters-table-topics" className="text-[var(--neon-cyan)] hover:underline">70 preguntas de Table Topics de Toastmasters</Link>.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Una Estructura Sencilla que Siempre Funciona (PREP)
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Punto.</strong> Responde la pregunta directamente en tu primera frase. No calientes motores: fija tu postura de inmediato.</li>
                <li><strong>Razón.</strong> Da la única razón más sólida por la que sostienes ese punto de vista.</li>
                <li><strong>Ejemplo.</strong> Cuenta una anécdota o un ejemplo concreto de 30 segundos. Las historias son lo que el público recuerda.</li>
                <li><strong>Punto (de nuevo).</strong> Reafirma tu respuesta en una frase de cierre. Un final limpio supera a una buena apertura.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ejercicios para Practicar en Solitario
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>El ejercicio 5×2:</strong> cinco preguntas al azar, dos minutos cada una, una tras otra. Sin saltarte ninguna: las preguntas que quieres saltarte son las que necesitas.</li>
                <li><strong>El ancla de una palabra:</strong> responde cualquier pregunta a través del prisma de una sola palabra (valentía, curiosidad, familia). Esto te entrena para enlazar cualquier pregunta con material que dominas.</li>
                <li><strong>El ejercicio del silencio:</strong> obligate a hacer una pausa completa de dos segundos en lugar de decir &quot;eh&quot;. Grábate y cuenta las muletillas por minuto.</li>
                <li><strong>Simulación de concurso:</strong> genera una pregunta, espera 5 segundos y luego habla durante exactamente 1:30. Repítelo cada semana y anota cuántas veces aciertas la franja válida.</li>
              </ol>
              <p>
                ¿Buscas práctica de formato más largo? Nuestro{" "}
                <Link href="/es/speech" className="text-[var(--neon-cyan)] hover:underline">generador de temas para discursos</Link>{" "}
                cubre ideas de discursos preparados, y la página de{" "}
                <Link href="/es/impromptu-speech-topics" className="text-[var(--neon-cyan)] hover:underline">temas de discurso improvisado</Link>{" "}
                se centra en formatos de aula y de competición de oratoria.
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
