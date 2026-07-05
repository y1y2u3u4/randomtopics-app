import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Temas de Debate para Bachillerato — Generador al Azar | Random Topics" },
  description:
    "Generador de temas de debate al azar para bachillerato: temas listos para argumentar con evidencia y puntos a favor y en contra para debates de clase, clubes y práctica de torneos. Gratis, sin registro.",
  alternates: {
    canonical: "/es/debate/high-school",
    languages: hreflangAlternates("/debate/high-school"),
  },
  openGraph: {
    title: "Temas de Debate para Bachillerato — Generador al Azar",
    description:
      "Temas de debate listos para argumentar con evidencia para bachillerato — desde discusiones de clase hasta la preparación de torneos. Gratis, sin registro.",
    url: `${SITE_URL}/es/debate/high-school`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Cuáles son buenos temas de debate para estudiantes de bachillerato?",
    answer:
      "Los temas fuertes de bachillerato tienen evidencia creíble en ambos bandos: ¿Deberían las redes sociales exigir verificación de edad? ¿Debería ser gratuita la universidad? ¿Deberían permitirse las herramientas de IA en los trabajos escolares? ¿Debería bajarse la edad para votar a los 16? Los temas de actualidad con investigación disponible funcionan mejor en bachillerato.",
  },
  {
    question: "¿Qué formatos de debate usan los institutos?",
    answer:
      "Los más habituales son Lincoln-Douglas (centrado en valores, 1 contra 1), Public Forum (actualidad, 2 contra 2), Policy (intensivo en investigación, 2 contra 2) y parlamentario (preparación limitada). Este generador sirve para todos ellos — usa temas de filtro profundo para debates de valores tipo LD y categorías de actualidad para Public Forum.",
  },
  {
    question: "¿Cómo se preparan los estudiantes para un torneo de debate?",
    answer:
      "Construye casos en ambos bandos de la resolución, reúne evidencia con citas, practica discursos constructivos de 4 minutos y réplicas de 2 minutos contra compañeros, y entrena las preguntas de crossfire. Los temas sorpresa al azar de este generador son ideales para la práctica de preparación limitada.",
  },
  {
    question: "¿Se pueden usar estos temas para ensayos argumentativos?",
    answer:
      "Sí — cada propuesta de debate sirve también como tesis de ensayo argumentativo. Los puntos a favor y en contra se corresponden directamente con los párrafos del cuerpo y las secciones de contraargumento.",
  },
  {
    question: "¿Es gratis para centros educativos y clubes de debate?",
    answer:
      "Completamente gratis, sin registro y sin anuncios. Los entrenadores generan lotes de temas para rondas de práctica; los profesores lo proyectan en directo para debates de clase.",
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
            { label: "Bachillerato" },
          ]}
        />
        <TopicGenerator
          locale="es"
          initialMode="debate"
          title="Generador de Temas de Debate para Bachillerato"
          subtitle="Temas de debate listos para argumentar con evidencia para bachillerato — desde las discusiones de clase hasta la preparación de torneos."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Generador de Temas de Debate para Bachillerato: Cómo Usarlo
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>Quienes debaten en bachillerato pueden manejar lo que el alumnado de secundaria no puede: matices, investigación y temas con implicaciones reales. El bachillerato debate mejor sobre preguntas donde existe evidencia creíble en ambos bandos — regulación de las redes sociales, IA en la educación, justicia penal, política climática, admisiones universitarias. El techo de habilidad pasa de «¿sabes estructurar un argumento?» a «¿sabes sopesar valores en conflicto?».</p>
              <p>Este generador sirve propuestas con suficiente sustancia para el argumento basado en evidencia, cada una con puntos de partida a favor y en contra. Para formatos de torneo (LD, Public Forum, Policy), usa el filtro profundo y trata los puntos de conversación como lluvias de ideas para el caso, no como el caso en sí. Recursos relacionados: <Link href="/es/topics/debate-topics-for-students" className="text-[var(--neon-cyan)] hover:underline">75 temas de debate para estudiantes</Link>, <Link href="/es/topics/controversial-topics-to-discuss" className="text-[var(--neon-cyan)] hover:underline">temas controvertidos</Link> para clases avanzadas, y el <Link href="/es/debate/college" className="text-[var(--neon-cyan)] hover:underline">generador de nivel universitario</Link>.</p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cómo Subir de Nivel los Debates de Bachillerato
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Exige evidencia citada.</strong> Una fuente mínima por discurso constructivo. El debate sobre qué evidencia es más sólida es donde ocurre el verdadero aprendizaje.</li>
                <li><strong>Enseña a sopesar.</strong> Los grandes debates de bachillerato terminan con «incluso si mi oponente tiene razón sobre X, Y importa más porque...» — enseña explícitamente la comparación de impactos.</li>
                <li><strong>Rota los formatos.</strong> Alterna rondas parlamentarias rápidas con debates de política investigados; la improvisación y la profundidad son músculos distintos.</li>
                <li><strong>Analiza la calidad de los argumentos.</strong> Después de la votación, pregunta: ¿qué único argumento te convenció, y qué lo habría vencido?</li>
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
