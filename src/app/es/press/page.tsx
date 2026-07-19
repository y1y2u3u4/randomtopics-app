import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { hreflangAlternates } from "@/i18n/config";
import type { Metadata } from "next";
import CopyBlock from "../../press/CopyBlock";

export const metadata: Metadata = {
  title: { absolute: "Kit de Prensa y Medios | Random Topics" },
  description:
    "Kit de prensa, widget para insertar y recursos para medios de Random Topics: el generador de temas gratuito con IA.",
  alternates: {
    canonical: "/es/press",
    languages: hreflangAlternates("/press"),
  },
  robots: { index: true, follow: true },
};

const SITE_URL = "https://randomtopics.app";

const ABOUT_DESCRIPTION = `Random Topics es un generador de temas gratuito con IA que ofrece al instante iniciadores de conversación, ideas para escribir, mociones de debate, ideas para discursos y preguntas rompehielos, a partir de una biblioteca seleccionada de más de 500 temas en 16 categorías. Sin registro, sin anuncios, sin muros de pago — solo un clic y tienes un tema fresco listo para usar.`;

const EMBED_CODE = `<iframe
  src="${SITE_URL}/embed"
  width="400"
  height="500"
  style="border:none;border-radius:12px"
  title="Random Topics Generator"
></iframe>`;

const BADGE_CODE = `<a href="${SITE_URL}" target="_blank" rel="noopener noreferrer"
  style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;
         background:#0d0f17;border:1px solid rgba(255,255,255,0.08);
         border-radius:8px;font-family:sans-serif;font-size:13px;
         color:#c4cbde;text-decoration:none;"
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06d6a0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
  Powered by Random Topics
</a>`;

const QUICK_FACTS = [
  { label: "Herramienta", value: "Random Topics" },
  { label: "URL", value: "randomtopics.app", href: SITE_URL },
  { label: "Lanzamiento", value: "abril de 2026" },
  { label: "Precio", value: "Gratis" },
  { label: "Categorías", value: "16" },
  { label: "Temas", value: "500+" },
  { label: "Modos", value: "5" },
  { label: "Artículos", value: "22 colecciones" },
];

const KEY_FEATURES = [
  "Más de 500 temas seleccionados a mano en 16 categorías variadas",
  "5 modos especializados: Conversación, Escritura, Debate, Discurso y Rompehielos",
  "Generación de temas con IA mediante Gemini 2.5 Flash para ideas frescas ilimitadas",
  "Temporizador de discurso integrado con duración personalizable",
  "Widget para insertar en blogs y sitios web",
  "22 artículos de colecciones seleccionadas para explorar a fondo",
  "Completamente gratis — sin registro, sin anuncios, sin muros de pago",
  "Adaptado a móviles, rápido y accesible",
  "Compartir en redes integrado (Twitter, Facebook, LinkedIn, WhatsApp)",
];

export default function PressPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Prensa y Medios" },
          ]}
        />

        {/* Hero */}
        <div className="text-center pt-12 sm:pt-20 pb-8 max-w-4xl mx-auto px-4">
          <h1
            className="section-heading text-4xl sm:text-5xl font-extrabold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kit de <span className="gradient-text">Prensa y Medios</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-lg mx-auto">
            Todo lo que necesitas para escribir sobre Random Topics. Encuentra
            descripciones, estadísticas, códigos para insertar y distintivos más
            abajo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10 pb-16">
          {/* Quick Facts */}
          <section className="glass-card p-8">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Datos Rápidos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {QUICK_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center"
                >
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    {fact.label}
                  </p>
                  {fact.href ? (
                    <a
                      href={fact.href}
                      className="text-lg font-bold text-[var(--neon-cyan)] hover:underline"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {fact.value}
                    </a>
                  ) : (
                    <p
                      className="text-lg font-bold text-[var(--text-primary)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {fact.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* About — Copyable Description */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ¿Qué es Random Topics?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {ABOUT_DESCRIPTION}
            </p>
            <CopyBlock code={ABOUT_DESCRIPTION} label="Copiar descripción" />
          </section>

          {/* Key Features */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Características Principales
            </h2>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              {KEY_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "var(--neon-pink)" }}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Embed Widget */}
          <section id="embed" className="glass-card p-8 space-y-6">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Widget para Insertar
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Añade un generador de temas al azar directamente a tu sitio web o
              blog. Solo pega el código del iframe de abajo.
            </p>
            <div className="flex justify-center">
              <div
                className="rounded-xl overflow-hidden border border-white/10"
                style={{ width: 400, height: 500 }}
              >
                <iframe
                  src="/embed"
                  width="400"
                  height="500"
                  style={{ border: "none" }}
                  title="Random Topics Generator Preview"
                />
              </div>
            </div>
            <CopyBlock code={EMBED_CODE} label="Código para insertar" />
          </section>

          {/* Badge / Button */}
          <section className="glass-card p-8 space-y-6">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Distintivo &ldquo;Powered by&rdquo;
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Muestra a tus lectores de dónde vienen los temas. Coloca este
              distintivo en cualquier parte de tu página y enlazará de vuelta a
              Random Topics.
            </p>
            <div className="flex justify-center py-4">
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  background: "#0d0f17",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  fontFamily: "sans-serif",
                  fontSize: 13,
                  color: "#c4cbde",
                  textDecoration: "none",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#06d6a0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Powered by Random Topics
              </a>
            </div>
            <CopyBlock code={BADGE_CODE} label="HTML del distintivo" />
          </section>

          {/* Contact */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Consultas de Prensa
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              ¿Escribes sobre Random Topics o quieres colaborar? Nos encantaría
              saber de ti.
            </p>
            <p className="text-[var(--text-secondary)]">
              Escríbenos a{" "}
              <a
                href="mailto:zhanggongqing1314007@gmail.com"
                className="text-[var(--neon-cyan)] hover:underline"
              >
                zhanggongqing1314007@gmail.com
              </a>
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              Normalmente respondemos en menos de 24 horas. Puedes usar cualquier
              información de esta página sin aprobación previa &mdash; siempre se
              agradece un enlace de vuelta a{" "}
              <a
                href={SITE_URL}
                className="text-[var(--neon-cyan)] hover:underline"
              >
                randomtopics.app
              </a>
              .
            </p>
          </section>

          {/* CTA */}
          <section className="text-center space-y-4 pb-4">
            <p className="text-[var(--text-secondary)]">
              ¿Quieres probarlo tú mismo?
            </p>
            <a href="/es" className="btn-generate inline-block">
              Generar un Tema
            </a>
          </section>
        </div>
      </main>
      <Footer locale="es" />
    </>
  );
}
