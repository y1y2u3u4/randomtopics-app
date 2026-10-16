import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import ClassroomQuestionGenerator from "@/components/ClassroomQuestionGenerator";
import ClassroomToolLinksEs from "@/components/ClassroomToolLinksEs";
import ClassroomArt from "@/components/ClassroomArt";
import KidsVersionSwitch from "@/components/KidsVersionSwitch";
import { KIDS_GRADES_ES, KIDS_THEMES_ES, KIDS_THIS_OR_THAT_ES } from "@/data/kidsQuestions.es";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const PATH = "/es/this-or-that/kids";
const TITLE = `Esto o Aquello para Niños: ${KIDS_THIS_OR_THAT_ES.length} Preguntas + Modo Proyector`;
const DESCRIPTION = `${KIDS_THIS_OR_THAT_ES.length} preguntas de esto o aquello para niños de primaria (5–12 años). Filtra por curso y tema y proyéctalas para que elijan un lado del aula. Gratis, sin registro.`;

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Random Topics` },
  description: DESCRIPTION,
  keywords: ["esto o aquello para niños", "preguntas esto o aquello para niños", "juego esto o aquello", "esto o aquello para clase", "preguntas para niños"],
  alternates: { canonical: PATH, languages: hreflangAlternates("/this-or-that/kids") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
    images: [{ url: "/og/this-or-that-kids.jpg", width: 1200, height: 630, alt: "Esto o aquello para niños" }],
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Para qué edades son estas preguntas?",
    answer: "Para primaria, de 5 a 12 años. Elige «Infantil a 2.º» para opciones muy sencillas como tobogán o columpios, o «3.º a 6.º» para algunas que piden pensar un poco más, como feria de ciencias o concurso de ortografía. Todas están revisadas para clase: nada de temas de pareja, miedo, dinero ni política.",
  },
  {
    question: "¿Cómo se juega a esto o aquello en clase?",
    answer: "Proyecta una pregunta: quien elige la primera opción va al lado izquierdo del aula y quien elige la segunda, al derecho. Pide a uno o dos niños de cada lado que expliquen por qué y pasa a la siguiente. Cada pregunta lleva un minuto y sirve como pausa activa, juego de asamblea o rompehielos el primer día.",
  },
  {
    question: "¿Cómo funciona el modo proyector?",
    answer: "Pulsa «Proyectar en clase». La pregunta ocupa toda la pantalla con letra grande: la primera opción a la izquierda y la segunda a la derecha, igual que los lados del aula. Avanza con las flechas o la barra espaciadora, F para pantalla completa, T para un temporizador y Esc para cerrar. Funciona en cualquier portátil conectado a un proyector o pizarra digital.",
  },
  {
    question: "¿Puedo imprimir las preguntas?",
    answer: "Sí. «Imprimir la lista» crea una hoja limpia con las preguntas del curso y tema elegidos; en la ventana de impresión puedes elegir «Guardar como PDF».",
  },
  {
    question: "¿Hay una versión para adolescentes o adultos?",
    answer: "Sí: el generador principal de esto o aquello tiene opciones cotidianas para adolescentes y adultos, como café o té.",
  },
];

// Interleave themes so the visible list is not 16 food questions in a row.
function mixed(n: number) {
  const byTheme = KIDS_THEMES_ES.map((t) => KIDS_THIS_OR_THAT_ES.filter((q) => q.theme === t.id));
  const out: string[] = [];
  for (let i = 0; out.length < n && byTheme.some((l) => l[i]); i++) {
    for (const list of byTheme) if (list[i] && out.length < n) out.push(list[i].text);
  }
  return out;
}

export default function ThisOrThatKidsPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "Esto o Aquello", href: "/es/this-or-that" }, { label: "Para niños" }]} />
        <KidsVersionSwitch general="/es/this-or-that" kids={PATH} active="kids" locale="es" />
        <ClassroomQuestionGenerator
          questions={KIDS_THIS_OR_THAT_ES}
          grades={KIDS_GRADES_ES}
          themes={KIDS_THEMES_ES}
          title="Esto o Aquello para Niños"
          subtitle={`${KIDS_THIS_OR_THAT_ES.length} opciones para primaria (5–12 años). Una pregunta por clic, o proyéctala y que cada niño elija un lado del aula.`}
          emoji="⚖️"
          source="kids_this_or_that_es"
          split
          printHeading="Preguntas de esto o aquello para niños"
          locale="es"
        />
        <ClassroomArt src="/art/classroom/this-or-that-kids.jpg" alt="Ilustración de un aula donde los niños se colocan a cada lado bajo una pregunta de esto o aquello proyectada" />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-6 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">Cómo jugar a esto o aquello con la clase</h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Esto o aquello</strong> es el juego más rápido que existe: dos opciones, ninguna respuesta incorrecta y todos participan.
                Por eso funciona tan bien con los niños tímidos: primero responden con los pies y después con palabras. Cada pregunta
                está pensada para primaria y revisada para que nada resulte incómodo delante de la clase.
              </p>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Elige el curso</strong> y, si quieres, un tema: comida, animales, escuela, juegos, estaciones, locuras o día a día.</li>
                <li><strong>Pulsa «Proyectar en clase».</strong> Cada opción aparece en el lado de la pantalla que le corresponde.</li>
                <li><strong>Los niños van a su lado.</strong> ¡No vale quedarse en medio! Contad cuántos hay en cada lado.</li>
                <li><strong>Pregunta «¿por qué?».</strong> Un niño de cada lado lo explica con una frase completa. Luego pulsa → para la siguiente.</li>
              </ol>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-3" style={{ fontFamily: "var(--font-display)" }}>Cinco formas de usarlo en el aula</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Primer día de clase:</strong> con cinco preguntas ya sabes a quién le encantan los perros y quién prefiere leer.</li>
                <li><strong>Pausa activa:</strong> dos minutos de moverse entre una clase y otra, sin materiales.</li>
                <li><strong>Asamblea de la mañana:</strong> una pregunta como saludo: «Buenos días, elegí tortitas porque…».</li>
                <li><strong>Antes de escribir una opinión:</strong> elegir un lado y dar tres razones. Un buen paso previo a los <Link href="/es/topics/debate-topics-for-students" className="text-[var(--neon-cyan)] hover:underline">temas de debate para estudiantes</Link>.</li>
                <li><strong>Matemáticas:</strong> contad los dos lados en cinco preguntas y haced un gráfico de barras.</li>
              </ul>
              <p>
                ¿Buscas dilemas más grandes? Prueba las <Link href="/es/would-you-rather/kids" className="text-[var(--neon-cyan)] hover:underline">preguntas de qué prefieres para niños</Link>.
                Para adolescentes y adultos, el <Link href="/es/this-or-that" className="text-[var(--neon-cyan)] hover:underline">generador de esto o aquello</Link> tiene opciones cotidianas.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-6 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-5" style={{ fontFamily: "var(--font-display)" }}>40 preguntas de esto o aquello para niños</h2>
            <ol className="space-y-2 list-decimal pl-6 text-sm text-[var(--text-secondary)]" data-question-list>
              {mixed(40).map((q) => <li key={q}>{q}</li>)}
            </ol>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="glass-card p-6 sm:p-10 space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Preguntas frecuentes</h2>
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <ClassroomToolLinksEs currentPath={PATH} />
      </main>
      <Footer locale="es" />
    </>
  );
}
