import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import { CATEGORIES, MODES } from "@/data/types";
import type { Category, Mode } from "@/data/types";
import { getLocalizedTopics } from "@/data/topics.es";
import { categorySeoContentEs } from "@/data/categorySeoContent.es";
import { MODE_LABELS, CATEGORY_LABELS } from "@/i18n/dictionaries";
import { SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const MODE_ANGLES: Record<Mode, (cat: string) => string> = {
  conversation: (cat) =>
    `Como iniciadores de conversación, los temas de ${cat.toLowerCase()} funcionan mejor cuando dejas que la curiosidad guíe: plantea la pregunta, comparte brevemente tu punto de vista y luego profundiza en por qué la otra persona lo ve distinto. Usa el filtro de profundidad Ligero para contextos informales y Profundo cuando el grupo esté listo para un intercambio más largo.`,
  writing: (cat) =>
    `Como ideas para escribir, los temas de ${cat.toLowerCase()} te dan un ángulo listo para ensayos, artículos de blog y entradas de diario. Trata los puntos de conversación como un esquema instantáneo: cada uno puede convertirse en un párrafo, y el más fuerte en tu tesis.`,
  debate: (cat) =>
    `Como temas de debate, las propuestas de ${cat.toLowerCase()} vienen con posturas naturales a favor y en contra. Asigna los bandos, da a ambos equipos dos minutos de preparación con los puntos de conversación y evalúa por la evidencia y la réplica, no por el volumen.`,
  speech: (cat) =>
    `Como temas para discursos, los asuntos de ${cat.toLowerCase()} sirven tanto para charlas preparadas como para práctica improvisada. Genera uno, tómate 30 segundos para elegir tu idea principal y habla durante dos minutos: los puntos de conversación incluidos hacen de esqueleto del discurso.`,
  icebreaker: (cat) =>
    `Como rompehielos, las preguntas de ${cat.toLowerCase()} hacen hablar a los grupos sin poner a nadie en un aprieto. Mantén la profundidad en Ligero para equipos nuevos y deja que respondan primero los voluntarios: el impulso hace el resto.`,
};

interface ComboPageProps {
  params: Promise<{ mode: string; category: string }>;
}

const VALID_MODES = MODES.map((m) => m.slug);
const VALID_CATEGORIES = CATEGORIES.map((c) => c.id);

export function generateStaticParams() {
  const params: { mode: string; category: string }[] = [];
  for (const mode of MODES) {
    for (const cat of CATEGORIES) {
      params.push({ mode: mode.slug, category: cat.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: ComboPageProps): Promise<Metadata> {
  const { mode, category } = await params;
  if (!VALID_MODES.includes(mode) || !VALID_CATEGORIES.includes(category as Category)) return {};

  const modeInfo = MODES.find((m) => m.slug === mode)!;
  const catL = CATEGORY_LABELS.es[category as Category];
  const modeL = MODE_LABELS.es[modeInfo.id];

  const title = `${catL.label}: ${modeL.label} al Azar`;
  const description = `Genera ${modeL.label.toLowerCase()} de ${catL.label.toLowerCase()} al instante. ${catL.description}. Gratis, sin registro.`;

  return {
    title: { absolute: `${title} | Random Topics` },
    description,
    // Google crawled these 80 Spanish permutations and declined to index them.
    // Saying so explicitly stops the re-crawl attempts from eating budget the
    // /es hubs and topic articles need. The English combos stay indexable.
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/es/${mode}/${category}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/es/${mode}/${category}`,
      siteName: "Random Topics",
      locale: "es_ES",
      type: "website",
    },
  };
}

export default async function ModeCategoryPageEs({ params }: ComboPageProps) {
  const { mode, category } = await params;

  if (!VALID_MODES.includes(mode) || !VALID_CATEGORIES.includes(category as Category)) {
    notFound();
  }

  const modeInfo = MODES.find((m) => m.slug === mode)!;
  const catInfo = CATEGORIES.find((c) => c.id === category)!;
  const catL = CATEGORY_LABELS.es[category as Category];
  const modeL = MODE_LABELS.es[modeInfo.id];

  const relatedModes = MODES.filter((m) => m.slug !== mode);
  const relatedCategories = CATEGORIES.filter((c) => c.id !== category).slice(0, 8);

  const sampleTopics = getLocalizedTopics("es")
    .filter((t) => t.modes.includes(modeInfo.id) && t.category === (category as Category))
    .slice(0, 6);
  const catSeo = categorySeoContentEs[category as Category];

  return (
    <>
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: modeL.label, href: `/es/${mode}` },
            { label: catL.label },
          ]}
        />
        <TopicGenerator
          initialMode={mode as Mode}
          initialCategory={category as Category}
          locale="es"
          title={`${catL.label}: ${modeL.label}`}
          subtitle={`Genera ${modeL.label.toLowerCase()} de ${catL.label.toLowerCase()} para cualquier ocasión. ${catL.description}.`}
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              {catInfo.emoji} {catL.label}: {modeL.label}
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                ¿Buscas <strong>{modeL.label.toLowerCase()} de {catL.label.toLowerCase()}</strong>? Nuestro
                generador combina una base de datos seleccionada de más de 500 temas para ofrecerte {modeL.label.toLowerCase()} de {catL.label.toLowerCase()} siempre frescos.
                Ya necesites temas para una clase, una reunión, una sesión de escritura o simplemente por diversión,
                genera todos los que quieras, totalmente gratis.
              </p>
              <p>{catSeo.intro}</p>
              <p>{MODE_ANGLES[modeInfo.id](catL.label)}</p>
              <p>
                Cada tema generado incluye puntos de conversación que te ayudan a explorar el asunto en profundidad.
                Filtra por nivel de profundidad (Ligero, Medio o Profundo) para adaptarlo a tu público y contexto.
              </p>
            </div>
          </div>
        </section>

        {sampleTopics.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
            <div className="glass-card p-8 sm:p-10">
              <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Ejemplos de {catL.label}: {modeL.label}
              </h2>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                {sampleTopics.map((t) => (
                  <li key={t.id} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--neon-cyan)" }} />
                    <span>{t.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[var(--text-muted)] mt-5">
                Están tomados directamente de la base de datos del generador: pulsa Generar arriba para ver el conjunto completo con puntos de conversación.
              </p>
            </div>
          </section>
        )}

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Más Generadores de {catL.label}
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedModes.map((m) => (
                <Link
                  key={m.slug}
                  href={`/es/${m.slug}/${category}`}
                  className="text-sm px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 hover:bg-[rgba(0,229,255,0.05)] transition-all"
                >
                  {m.emoji} {catL.label}: {MODE_LABELS.es[m.id].label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Más {modeL.label}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/es/${mode}/${c.id}`}
                  className="text-sm p-3 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-pink)] hover:border-[var(--neon-pink)]/30 hover:bg-[rgba(255,45,120,0.05)] transition-all text-center"
                >
                  {c.emoji} {CATEGORY_LABELS.es[c.id].label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              inLanguage: "es",
              name: `${catL.label}: ${modeL.label}`,
              description: `Genera ${modeL.label.toLowerCase()} de ${catL.label.toLowerCase()}. ${catL.description}.`,
              url: `${SITE_URL}/es/${mode}/${category}`,
              isPartOf: { "@type": "WebSite", name: "Random Topics", url: SITE_URL },
              breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/es` },
                  { "@type": "ListItem", position: 2, name: modeL.label, item: `${SITE_URL}/es/${mode}` },
                  { "@type": "ListItem", position: 3, name: catL.label },
                ],
              },
            }),
          }}
        />
      </main>
      <Footer locale="es" />
    </>
  );
}
