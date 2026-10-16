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
import { KIDS_GRADES_ES, KIDS_WOULD_YOU_RATHER_ES } from "@/data/kidsQuestions.es";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const PATH = "/es/would-you-rather/kids";
const TITLE = `¿Qué Prefieres? para Niños: ${KIDS_WOULD_YOU_RATHER_ES.length} Preguntas Divertidas`;
const DESCRIPTION = `${KIDS_WOULD_YOU_RATHER_ES.length} preguntas de «¿qué prefieres?» para niños de primaria: divertidas, sin temas incómodos y con modo proyector para clase. Imprime una hoja en un clic. Gratis, sin registro.`;

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Random Topics` },
  description: DESCRIPTION,
  keywords: ["qué prefieres para niños", "preguntas qué prefieres para niños", "preguntas divertidas para niños", "juego qué prefieres", "qué prefieres preguntas para clase"],
  alternates: { canonical: PATH, languages: hreflangAlternates("/would-you-rather/kids") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
    images: [{ url: "/og/would-you-rather-kids.jpg", width: 1200, height: 630, alt: "¿Qué prefieres? para niños" }],
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Son aptas para niños todas las preguntas?",
    answer: "Sí. Están escritas para primaria (5–12 años) y revisadas para clase: sin temas de pareja, miedo, peleas, dinero ni nada que pueda incomodar. Son tontas y divertidas, como un dragón del tamaño de un gato o un gato del tamaño de un dragón.",
  },
  {
    question: "¿Cómo se juega a «¿Qué prefieres?» en clase?",
    answer: "Lee o proyecta una pregunta y cada niño elige una opción: levantando la mano, yendo a un lado del aula o escribiendo su respuesta. Lo importante es el «¿por qué?»: pide una razón con una frase completa. Así practican expresión oral y argumentación sin darse cuenta.",
  },
  {
    question: "¿Cómo funciona el modo proyector?",
    answer: "Pulsa «Proyectar en clase». Cada opción aparece en un lado de la pantalla con letra grande. Avanza con las flechas o la barra espaciadora, F para pantalla completa, T para un temporizador y Esc para cerrar. No hace falta cuenta.",
  },
  {
    question: "¿Puedo imprimir una hoja de preguntas?",
    answer: "Sí. El botón de imprimir crea una hoja con 20 preguntas del curso elegido, lista para fotocopiar o guardar como PDF. Va genial para un rincón de lectura, un viaje en autobús o como tarea de escritura.",
  },
  {
    question: "¿Qué diferencia hay con esto o aquello?",
    answer: "Esto o aquello usa elecciones rápidas del día a día (pizza o tacos). «¿Qué prefieres?» plantea situaciones imaginarias más grandes que dan más para hablar y escribir.",
  },
];

export default function WouldYouRatherKidsPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "¿Qué Prefieres?", href: "/es/would-you-rather" }, { label: "Para niños" }]} />
        <KidsVersionSwitch general="/es/would-you-rather" kids={PATH} active="kids" locale="es" />
        <ClassroomQuestionGenerator
          questions={KIDS_WOULD_YOU_RATHER_ES}
          grades={KIDS_GRADES_ES}
          title="¿Qué Prefieres? para Niños"
          subtitle={`${KIDS_WOULD_YOU_RATHER_ES.length} dilemas divertidos para primaria (5–12 años). Una pregunta por clic, proyéctala para toda la clase o imprime una hoja.`}
          emoji="🤔"
          source="kids_would_you_rather_es"
          split
          printCount={20}
          printHeading="¿Qué prefieres? Preguntas para niños"
          locale="es"
        />
        <ClassroomArt src="/art/classroom/would-you-rather-kids.jpg" alt="Ilustración de niños votando entre dos opciones divertidas proyectadas en la pizarra" />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-6 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">Por qué «¿Qué prefieres?» funciona tan bien con niños</h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Las preguntas de <strong>«¿Qué prefieres?»</strong> obligan a elegir entre dos opciones imposibles, y eso hace que hasta el niño
                más callado quiera dar su opinión. No hay respuesta correcta, así que nadie se equivoca, y cada elección viene con un
                «porque…» que practica la expresión oral, el vocabulario y la argumentación.
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Infantil a 2.º:</strong> dilemas sencillos y visuales; que respondan señalando o yendo a un lado del aula.</li>
                <li><strong>3.º a 6.º:</strong> preguntas que piden imaginar más (viajar al pasado, inventar un deporte); pide dos razones.</li>
                <li><strong>Escritura:</strong> elige una pregunta y que escriban un párrafo de opinión con introducción, dos razones y cierre.</li>
                <li><strong>Debate exprés:</strong> divide la clase en dos lados y da un minuto a cada lado para convencer al otro.</li>
              </ul>
              <p>
                Para elecciones rápidas del día a día, usa <Link href="/es/this-or-that/kids" className="text-[var(--neon-cyan)] hover:underline">esto o aquello para niños</Link>.
                Para adolescentes y adultos, el <Link href="/es/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">generador de qué prefieres</Link> tiene preguntas más atrevidas.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-6 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-5" style={{ fontFamily: "var(--font-display)" }}>30 preguntas de «¿Qué prefieres?» para niños</h2>
            <ol className="space-y-2 list-decimal pl-6 text-sm text-[var(--text-secondary)]" data-question-list>
              {KIDS_WOULD_YOU_RATHER_ES.slice(0, 30).map((q) => <li key={q.text}>{q.text}</li>)}
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
