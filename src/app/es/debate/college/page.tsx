import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Temas de Debate para Universitarios — Generador al Azar | Random Topics" },
  description:
    "Generador de temas de debate al azar para la universidad: temas de política, ética y filosofía con puntos a favor y en contra para seminarios, sociedades de debate y debate parlamentario. Gratis, sin registro.",
  alternates: {
    canonical: "/es/debate/college",
    languages: hreflangAlternates("/debate/college"),
  },
  openGraph: {
    title: "Temas de Debate para Universitarios — Generador al Azar",
    description:
      "Propuestas de política, ética y filosofía para seminarios, sociedades de debate y práctica parlamentaria. Gratis, sin registro.",
    url: `${SITE_URL}/es/debate/college`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Cuáles son buenos temas de debate para universitarios?",
    answer:
      "Los temas de nivel universitario premian el matiz y el argumento de marco: ¿Debería pausarse el desarrollo de la IA? ¿Es un mito la meritocracia? ¿Debería protegerse el discurso de odio? ¿Es el crecimiento económico compatible con las metas climáticas? Los mejores obligan a debatir sobre valores, no solo sobre hechos.",
  },
  {
    question: "¿Qué es el debate parlamentario a nivel universitario?",
    answer:
      "El Parlamentario Británico (BP) es el formato universitario dominante en el mundo: cuatro equipos de dos, 15 minutos de preparación sobre una moción sorpresa y discursos de siete minutos. Practicar con mociones al azar de este generador reproduce las condiciones reales de preparación.",
  },
  {
    question: "¿Cómo se juzgan los debates universitarios?",
    answer:
      "La mayoría de los formatos universitarios juzgan la persuasión, el diálogo con los argumentos contrarios más fuertes y la ponderación de impactos, más que el pulido de la exposición. Una ronda la gana normalmente el equipo que mejor explica por qué sus argumentos importan más.",
  },
  {
    question: "¿Puedo usarlos para discusiones de seminario y ensayos?",
    answer:
      "Sí — quienes dirigen seminarios usan las propuestas generadas como anclas de discusión, y el alumnado pone a prueba sus tesis generando contraposturas antes de escribir.",
  },
  {
    question: "¿Es gratis este generador para universidades y sociedades?",
    answer:
      "Completamente gratis, sin registro. Las sociedades lo usan para mociones de práctica; los profesores lo proyectan en clase; el alumnado entrena por su cuenta.",
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
            { label: "Universidad" },
          ]}
        />
        <TopicGenerator
          locale="es"
          initialMode="debate"
          title="Generador de Temas de Debate para Universitarios"
          subtitle="Propuestas de política, ética y filosofía para seminarios, sociedades de debate y práctica parlamentaria."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Generador de Temas de Debate Universitario: Cómo Usarlo
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>El debate universitario funciona con otro combustible: precisión en las definiciones, choques de marcos y comodidad con la ambigüedad moral genuina. Los mejores temas de nivel universitario se resisten a una resolución fácil — obligan a debatir sobre cómo deberíamos decidir, no solo sobre qué deberíamos decidir. Piensa en la gobernanza de la IA, el altruismo eficaz, el decrecimiento, la teoría del castigo penal y los límites de la libertad de expresión.</p>
              <p>Este generador se apoya en nuestras categorías de filosofía, política, tecnología y ética a profundidad media-alta. Las sociedades de debate lo usan para mociones parlamentarias; quienes dirigen seminarios lo usan para sembrar la discusión; el alumnado lo usa para poner a prueba las tesis de sus ensayos antes de comprometerse. Recursos relacionados: <Link href="/es/topics/random-essay-topics-for-college" className="text-[var(--neon-cyan)] hover:underline">temas de ensayo para la universidad</Link>, <Link href="/es/topics/deep-philosophical-questions" className="text-[var(--neon-cyan)] hover:underline">preguntas filosóficas profundas</Link>, y el <Link href="/es/argument-generator" className="text-[var(--neon-cyan)] hover:underline">generador de argumentos</Link>.</p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cómo Sacar el Máximo Partido a los Debates Universitarios
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Pelea primero por las definiciones.</strong> La mitad de todo buen debate universitario es definicional. «¿Deberían existir los milmillonarios?» depende de qué cuenta como riqueza merecida — haz explícito el choque de marcos.</li>
                <li><strong>Argumenta el hombre de acero.</strong> Regla de la casa: solo puedes atacar la versión más fuerte del caso de tu oponente. Eleva la calidad de cada ronda.</li>
                <li><strong>Practica cambiando de bando.</strong> Debate la misma moción dos veces, intercambiando bandos. Nada expone los argumentos débiles más rápido.</li>
                <li><strong>Usa mociones sorpresa.</strong> Los formatos parlamentarios dan 15-20 minutos de preparación sobre una moción no vista — genera una, pon un cronómetro y simula la presión de un torneo.</li>
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
