import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import CharadesGenerator from "@/components/CharadesGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { CHARADES_WORDS_ES, CHARADES_CATEGORIES_ES } from "@/data/charades.es";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const TITLE = "Generador de Mímica — Palabras para Charadas con Cronómetro y Categorías";
const DESCRIPTION =
  "Generador de palabras para jugar a la mímica (charadas): 247 palabras y refranes en 9 categorías, de fácil a difícil, con cronómetro y tarjetas para imprimir. Para fiestas, clase y familia. Gratis y sin registro.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Random Topics` },
  description: DESCRIPTION,
  keywords: [
    "generador de mímica",
    "juego de mímica",
    "palabras para mímica",
    "palabras para charadas",
    "charadas",
    "mímica para niños",
    "películas para mímica",
    "dígalo con mímica",
    "adivinar con mímica",
    "ideas para mímica",
  ],
  alternates: { canonical: "/es/charades", languages: hreflangAlternates("/charades") },
  openGraph: {
    title: "Generador de Mímica — Palabras para Charadas",
    description: "247 palabras y refranes para jugar a la mímica, con cronómetro y tarjetas para imprimir.",
    url: `${SITE_URL}/es/charades`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Cómo se juega a la mímica (charadas)?",
    answer:
      "Se forman dos equipos. Por turnos, una persona saca una palabra y la representa sin hablar ni señalar objetos de la habitación, mientras su equipo intenta adivinarla antes de que se acabe el tiempo (lo habitual es un minuto). Cada acierto suma un punto y después juega el otro equipo. Con este generador ya no hace falta escribir papelitos: pasa el móvil a quien actúa, saca una palabra y pulsa Empezar ronda, que oculta la respuesta al grupo.",
  },
  {
    question: "¿Qué palabras son buenas para jugar a la mímica?",
    answer:
      "Las que se pueden representar y casi todos conocen: acciones (cepillarse los dientes), animales (pingüino), películas (Titanic), profesiones (bombero) y objetos (paraguas). Para rondas difíciles, los refranes y expresiones como «llover a cántaros» o «matar dos pájaros de un tiro» obligan a actuar por partes. Cada palabra del generador está marcada como fácil, media o difícil.",
  },
  {
    question: "¿Sirve para jugar con niños?",
    answer:
      "Sí. Elige la categoría Niños y familia o la dificultad Fácil en cualquier categoría. Todas las palabras son aptas para todas las edades, así que puedes jugar en familia con cualquier ajuste.",
  },
  {
    question: "¿Qué gestos se usan en la mímica?",
    answer:
      "Los más comunes: levantar tantos dedos como palabras tiene el título y luego indicar cuál vas a representar; tocarte el antebrazo con los dedos para contar sílabas; llevarte la mano a la oreja para «suena como»; juntar los dedos para una palabra corta y separar las manos para una larga; girar una manivela imaginaria para una película, abrir las manos como un libro para un libro y dibujar un rectángulo para una serie.",
  },
  {
    question: "¿Puedo imprimir las palabras?",
    answer:
      "Sí. Elige categoría y dificultad y pulsa «Imprimir tarjetas»: tendrás una hoja con todas las palabras del mazo para recortar, doblar y sacar de un bol, sin pantallas.",
  },
];

const CATEGORY_GUIDES: Record<string, string> = {
  actions: "Empieza por el movimiento conocido y añade el detalle difícil. Para «doblar una sábana bajera», representa cómo se escapan las esquinas.",
  animals: "Usa la postura, el ritmo y un rasgo característico: los pasitos del pingüino o la trompa del elefante. Nada de sonidos.",
  movies: "Haz primero el gesto de película y luego representa el título o una escena conocida, sin citar diálogos.",
  "tv-books": "Abre las manos como un libro o dibuja un rectángulo para una serie. Elige un personaje o una escena que el grupo reconozca.",
  objects: "Muestra la forma del objeto y cómo se usa: el paraguas se abre sobre la cabeza y la grapadora aprieta papeles.",
  "people-jobs": "Representa el trabajo, no el aspecto de nadie: el bombero sujeta la manguera y el director de orquesta mueve la batuta.",
  "sports-games": "Enseña primero el material y después el movimiento: una raqueta imaginaria y luego el saque.",
  "kids-family": "Empieza con palabras fáciles y deja que los niños pasen las que no conozcan. Usa 90 o 120 segundos, o quita el cronómetro.",
  phrases: "Indica cuántas palabras tiene la expresión y represéntala al pie de la letra. Para refranes, pon más tiempo.",
};

const DIFF = ["", "Fácil", "Media", "Difícil"];

export default function CharadesPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "Generador de mímica" }]} />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
          <h1 className="section-heading text-4xl sm:text-6xl font-extrabold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Generador de <span className="gradient-text">Mímica</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            {CHARADES_WORDS_ES.length} palabras para charadas en {CHARADES_CATEGORIES_ES.length} categorías. Saca una palabra, deja que quien actúa la lea y empieza el cronómetro: la respuesta se oculta al grupo. Gratis y sin registro.
          </p>
        </section>

        <CharadesGenerator locale="es" />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { emoji: "🗂️", label: `${CHARADES_CATEGORIES_ES.length} categorías` },
              { emoji: "⏱️", label: "Cronómetro incluido" },
              { emoji: "🔁", label: "Sin repeticiones" },
              { emoji: "🖨️", label: "Tarjetas imprimibles" },
            ].map((f) => (
              <div key={f.label} className="glass-card p-4">
                <div className="text-2xl mb-1">{f.emoji}</div>
                <div className="text-xs text-[var(--text-secondary)]">{f.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="charades-word-bank" className="max-w-3xl mx-auto px-4 sm:px-6 py-8 scroll-mt-24">
          <h2 className="text-2xl font-bold">{`Las ${CHARADES_WORDS_ES.length} palabras para mímica, por categoría`}</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">Esta es la lista completa del generador. Cada palabra lleva su dificultad. Las películas, libros y refranes dependen de lo que conozca tu grupo: elige categorías que todos compartan.</p>
          <nav aria-label="Categorías de palabras" className="my-5 flex flex-wrap gap-2">
            {CHARADES_CATEGORIES_ES.map((cat) => <a key={cat.id} href={`#charades-${cat.id}`} className="inline-flex min-h-11 items-center rounded-xl border border-white/10 px-3 py-2 text-sm text-[var(--neon-cyan)]">{cat.emoji} {cat.label} · {CHARADES_WORDS_ES.filter((word) => word.c === cat.id).length}</a>)}
          </nav>
          <div className="space-y-4">
            {CHARADES_CATEGORIES_ES.map((cat) => <details key={cat.id} id={`charades-${cat.id}`} className="glass-card p-5 sm:p-6 scroll-mt-24">
              <summary className="cursor-pointer text-lg font-semibold">{cat.emoji} {cat.label} — {CHARADES_WORDS_ES.filter((word) => word.c === cat.id).length} palabras</summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{CATEGORY_GUIDES[cat.id]}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {CHARADES_WORDS_ES.filter((word) => word.c === cat.id).map((word) => <li key={word.w} data-charades-word="true" className="rounded-lg border border-white/10 p-3 text-sm">
                  <span className="text-[var(--text-secondary)]">{word.w}</span><span className="ml-2 text-xs text-[var(--text-muted)]">· {DIFF[word.d]}</span>
                </li>)}
              </ul>
              <a href="#charades-generator" className="mt-4 inline-flex min-h-11 items-center text-sm text-[var(--neon-cyan)] underline underline-offset-4">Volver a tu palabra y al cronómetro ↑</a>
            </details>)}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">Cómo jugar a la mímica (reglas rápidas)</h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Formad dos equipos</strong> y decidid el tiempo por ronda: un minuto es lo clásico.</li>
                <li><strong>Pasa la pantalla a quien actúa</strong>, saca una palabra y deja que la lea. Pulsa Empezar ronda para ocultarla y empezar a contar.</li>
                <li><strong>Representa sin hablar</strong>: sin mover los labios, sin señalar objetos reales y sin escribir letras en el aire.</li>
                <li><strong>El equipo adivina</strong> hasta que se acabe el tiempo. Cada acierto es un punto.</li>
                <li><strong>Turnaos</strong>: gana el primer equipo que llegue a la puntuación acordada (por ejemplo, 10).</li>
              </ol>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-3" style={{ fontFamily: "var(--font-display)" }}>Una noche de juegos completa</h3>
              <p>
                Combina la mímica con otros juegos: <Link prefetch={false} href="/es/truth-or-dare" className="text-[var(--neon-cyan)] hover:underline">Verdad o Reto</Link> entre rondas,{" "}
                <Link prefetch={false} href="/es/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">¿Qué prefieres?</Link> o{" "}
                <Link prefetch={false} href="/es/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">Yo nunca</Link> para empezar, la{" "}
                <Link prefetch={false} href="/es/spin-the-wheel" className="text-[var(--neon-cyan)] hover:underline">ruleta</Link> para decidir quién actúa primero y{" "}
                <Link prefetch={false} href="/es/this-or-that" className="text-[var(--neon-cyan)] hover:underline">Esto o Aquello</Link> para terminar. ¿Preferís dibujar? Usa el{" "}
                <Link prefetch={false} href="/es/generador-de-palabras-aleatorias" className="text-[var(--neon-cyan)] hover:underline">generador de palabras aleatorias</Link>.
                ¿Jugáis en inglés? Prueba el <Link prefetch={false} href="/charades" className="text-[var(--neon-cyan)] hover:underline">charades generator</Link> con 528 palabras.
              </p>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-3" style={{ fontFamily: "var(--font-display)" }}>Preguntas frecuentes</h3>
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
      <Footer />
    </>
  );
}
