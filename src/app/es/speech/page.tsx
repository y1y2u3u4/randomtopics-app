import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import SpeechTimer from "@/components/SpeechTimer";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Generador de Temas para Discursos al Azar — Ideas de Oratoria y Cronómetro de Práctica | Random Topics" },
  description:
    "Genera temas para discursos al azar para presentaciones, práctica de oratoria y Toastmasters. Cronómetro de discurso integrado para practicar la improvisación. Encuentra tu próxima gran idea de discurso al instante.",
  keywords: [
    "generador de temas para discursos",
    "temas para discursos al azar",
    "temas de discurso improvisado",
    "temas de oratoria",
    "table topics de toastmasters",
    "generador de table topics",
    "ideas para discursos",
    "temas de discurso extemporáneo",
  ],
  alternates: {
    canonical: "/es/speech",
    languages: hreflangAlternates("/speech"),
  },
  openGraph: {
    title: "Generador de Temas para Discursos al Azar — Ideas de Oratoria y Cronómetro de Práctica",
    description:
      "Genera temas para discursos al azar para presentaciones, práctica de oratoria y Toastmasters. Cronómetro de discurso integrado para practicar la improvisación. Encuentra tu próxima gran idea de discurso al instante.",
    url: `${SITE_URL}/es/speech`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

export default function SpeechPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Temas para Discursos" },
          ]}
        />
        <TopicGenerator
          initialMode="speech"
          locale="es"
          title="Generador de Temas para Discursos"
          subtitle="Descubre el tema perfecto para tu próxima presentación, discurso o práctica de oratoria."
        />

        {/* Speech Timer Section */}
        <section className="max-w-md mx-auto px-4 sm:px-6 py-10">
          <SpeechTimer />
        </section>

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Practica el Discurso Improvisado con Nuestro Cronómetro
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Nuestro <strong>cronómetro de práctica de discursos</strong> integrado te ayuda a desarrollar
                habilidades de oratoria improvisada. Genera un tema para discurso al azar, pon el cronómetro en
                marcha y practica pronunciar un discurso de 1, 2, 3 o 5 minutos sobre la marcha. Es la misma
                técnica que usan los Table Topics de Toastmasters y las competiciones de oratoria de todo el mundo.
              </p>
              <p>
                Practicar con regularidad la oratoria improvisada refuerza la confianza, mejora tu capacidad de
                organizar ideas con rapidez y te convierte en un comunicador más eficaz en reuniones,
                presentaciones y conversaciones cotidianas. Tanto si te preparas para una competición de oratoria,
                una entrevista de trabajo o simplemente quieres hablar mejor en público, combinar temas al azar con
                práctica cronometrada es uno de los métodos más eficaces que existen.
              </p>
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cómo Practicar el Discurso Improvisado
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li>Genera un tema para discurso al azar con el generador de arriba</li>
                <li>Ajusta el cronómetro a la duración que quieras (empieza con 1 minuto)</li>
                <li>Tómate de 10 a 15 segundos para organizar tus ideas</li>
                <li>Pronuncia tu discurso hasta que se agote el tiempo</li>
                <li>Aumenta la duración poco a poco a medida que mejores</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
