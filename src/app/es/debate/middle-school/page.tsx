import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Temas de Debate para Secundaria — Generador al Azar | Random Topics" },
  description:
    "Generador de temas de debate al azar para secundaria (1.º-3.º de ESO): temas adecuados a la edad con puntos a favor y en contra para quienes debaten por primera vez. Gratis para profesores, sin registro.",
  alternates: {
    canonical: "/es/debate/middle-school",
    languages: hreflangAlternates("/debate/middle-school"),
  },
  openGraph: {
    title: "Temas de Debate para Secundaria — Generador al Azar",
    description:
      "Temas de debate adecuados a la edad para secundaria — concretos, debatibles y ligados a la vida diaria del alumnado. Gratis, sin registro.",
    url: `${SITE_URL}/es/debate/middle-school`,
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
      "Los mejores temas de debate para secundaria son concretos y cercanos a la experiencia: ¿Debería prohibirse la tarea? ¿Debería empezar más tarde la escuela? ¿Deberían permitirse los móviles en el centro? ¿Debería venderse comida basura en las cafeterías? El alumnado argumenta mejor sobre cosas que vive a diario.",
  },
  {
    question: "¿Cuánto debería durar un debate de secundaria?",
    answer:
      "Mantén el formato completo por debajo de 20 minutos: aperturas de 90 segundos, réplicas de 60 segundos, cierres de 60 segundos y luego una votación de la clase. Los discursos cortos mantienen a todo el alumnado implicado y reducen la ansiedad de quienes hablan por primera vez.",
  },
  {
    question: "¿Cómo hago que el debate dé menos miedo a estudiantes de 11-12 años?",
    answer:
      "Empieza con debates en parejas en lugar de discursos individuales, usa primero temas absurdos (¿son sopa los cereales?), proporciona inicios de frase y evalúa la preparación en lugar de la victoria. La confianza va antes que la destreza.",
  },
  {
    question: "¿Son adecuados estos temas para 1.º-3.º de ESO?",
    answer:
      "Sí — usa el filtro de profundidad «ligero» para los temas más adecuados a la edad. El generador evita contenido explícito y temas para adultos, y los profesores pueden previsualizar hasta 10 temas a la vez antes de la clase.",
  },
  {
    question: "¿Es gratis para uso en el aula?",
    answer:
      "Completamente gratis, sin registro y sin anuncios. Proyéctalo en directo en clase o genera una lista de temas antes de la lección.",
  },
];

export default function Page() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Temas de Debate", href: "/es/debate" },
            { label: "Secundaria" },
          ]}
        />
        <TopicGenerator
          locale="es"
          initialMode="debate"
          title="Generador de Temas de Debate para Secundaria"
          subtitle="Temas de debate adecuados a la edad para 1.º-3.º de ESO — concretos, debatibles y conectados con la vida diaria del alumnado."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Generador de Temas de Debate para Secundaria: Cómo Usarlo
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>La secundaria es donde la mayoría del alumnado argumenta por primera vez de forma estructurada, y el tema hace o deshace la experiencia. Los cursos de secundaria debaten mejor sobre preguntas que viven cada día: normas del centro, tarea, móviles, deporte, comida. Las preguntas de política abstracta («¿debería el banco central...?») pierden a la clase en segundos; «¿debería tu centro prohibir los móviles en el recreo?» desata un aluvión de manos levantadas.</p>
              <p>Este generador prefiltra nuestra base de datos hacia propuestas concretas y cercanas a la experiencia, y cada tema viene con puntos a favor y en contra sencillos a partir de los cuales pueden construir quienes debaten por primera vez. Usa el filtro de profundidad «ligero» para los más pequeños y «medio» para 3.º de ESO. Recursos relacionados: <Link href="/es/topics/debate-topics-for-middle-school" className="text-[var(--neon-cyan)] hover:underline">50 temas de debate para secundaria</Link> (lista imprimible), el <Link href="/es/debate/high-school" className="text-[var(--neon-cyan)] hover:underline">generador para bachillerato</Link> para estudiantes mayores, y los <Link href="/es/debate/funny" className="text-[var(--neon-cyan)] hover:underline">temas de debate divertidos</Link> para calentamientos sin presión.</p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cómo Dirigir Debates en Secundaria
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Mantén los discursos cortos.</strong> Los discursos de 60-90 segundos mantienen implicado a todo el alumnado y bajan la barrera del miedo. El formato completo debería caber en 20 minutos.</li>
                <li><strong>Asigna los bandos al azar.</strong> En secundaria se toman los argumentos de forma personal; asignar el bando al azar enseña que defender una postura es una habilidad, no una identidad.</li>
                <li><strong>Usa un mural de inicios de frase.</strong> Publica marcos como «Mi oponente afirma..., sin embargo...» — el andamiaje convierte a los oradores nerviosos en participantes.</li>
                <li><strong>Evalúa la preparación, no la victoria.</strong> Puntúa la evidencia, la estructura y la escucha. Si solo los ganadores sacan buena nota, el alumnado tímido deja de intentarlo.</li>
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
