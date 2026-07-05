import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hreflangAlternates } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Términos del Servicio | Random Topics" },
  description:
    "Términos del servicio de randomtopics.app: Generador de Temas al Azar.",
  alternates: {
    canonical: "/es/terms",
    languages: hreflangAlternates("/terms"),
  },
};

export default function TermsPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-12" lang="es">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Header */}
          <section className="text-center space-y-4">
            <h1
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Términos del <span className="gradient-text">Servicio</span>
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Última actualización: abril de 2026
            </p>
          </section>

          {/* Acceptance */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Aceptación de los Términos
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Al acceder y utilizar{" "}
              <strong className="text-[var(--text-primary)]">randomtopics.app</strong>,
              aceptas quedar vinculado por estos Términos del Servicio. Si no
              estás de acuerdo con alguna parte de estos términos, por favor no
              utilices el sitio web.
            </p>
          </section>

          {/* Description of Service */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Descripción del Servicio
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Random Topics es una herramienta online gratuita que genera temas
              al azar para conversaciones, ideas para escribir, debates, discursos
              y rompehielos. El servicio se ofrece &quot;tal cual&quot; sin
              ninguna garantía ni compromiso de disponibilidad.
            </p>
          </section>

          {/* Use of Content */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Uso del Contenido
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Los temas generados por esta herramienta pueden usarse gratis con
              fines personales, educativos y comerciales. Puedes usar los temas
              generados en tus clases, presentaciones, entradas de blog, redes
              sociales y cualquier otro contenido sin necesidad de atribución,
              aunque siempre se agradece un enlace de vuelta a randomtopics.app.
            </p>
          </section>

          {/* AI-Generated Content */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contenido Generado por IA
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Algunos temas se generan mediante inteligencia artificial. Aunque
              nos esforzamos por la calidad y la precisión, el contenido generado
              por IA puede ser en ocasiones inexacto, repetitivo o inapropiado.
              No nos hacemos responsables de las consecuencias que puedan
              derivarse del uso de temas generados por IA.
            </p>
          </section>

          {/* Prohibited Use */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Uso Prohibido
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Aceptas no utilizar este servicio para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>Infringir cualquier ley o normativa aplicable</li>
              <li>Intentar interrumpir o sobrecargar el servicio</li>
              <li>Extraer o recopilar datos de forma automatizada más allá de un uso personal razonable</li>
              <li>Redistribuir en masa las bases de datos de contenido seleccionado del servicio</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Limitación de Responsabilidad
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Random Topics y sus creadores no serán responsables de ningún daño
              directo, indirecto, incidental o consecuente que surja del uso de
              este servicio. El servicio se ofrece únicamente con fines
              informativos y de entretenimiento.
            </p>
          </section>

          {/* Changes */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Cambios en los Términos
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Los cambios se publicarán en esta página con una fecha
              actualizada. El uso continuado del servicio tras los cambios
              constituye la aceptación de los nuevos términos.
            </p>
          </section>

          {/* Contact */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contacto
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Si tienes preguntas sobre estos términos, visítanos en{" "}
              <a
                href="https://randomtopics.app"
                className="text-[var(--accent-blue)] hover:underline"
              >
                randomtopics.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer locale="es" />
    </>
  );
}
