import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WordGenerator from "@/components/generators/WordGenerator";
import { WORDS } from "@/lib/generators/words";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/es/generador-de-palabras-aleatorias";
const TITLE = "Generador de Palabras Aleatorias — Sustantivos, Verbos y Adjetivos";
const DESCRIPTION = `Generador de palabras aleatorias gratis con más de ${WORDS.es.length} palabras en español. Filtra por sustantivo, verbo o adjetivo, dificultad, longitud y letra inicial, o solo palabras para dibujar y hacer mímica. Hasta 50 a la vez, sin repetir.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["generador de palabras aleatorias", "palabras aleatorias", "palabra al azar", "generador de palabras", "palabras para pictionary", "palabras para mímica", "sustantivos aleatorios"],
  alternates: { canonical: PATH, languages: hreflangAlternates("/random-word-generator") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", locale: "es_ES", type: "website" },
};

const FAQ = [
  {
    question: "¿Cómo funciona el generador de palabras aleatorias?",
    answer: `Elige los filtros que quieras — categoría gramatical, dificultad, longitud, letra inicial o solo palabras para dibujar — y pulsa Generar. Las palabras salen al azar de una lista revisada de más de ${WORDS.es.length} palabras en español y no se repiten hasta que hayas visto todas las que coinciden.`,
  },
  {
    question: "¿Puedo sacar solo sustantivos, verbos o adjetivos?",
    answer:
      "Sí. Marca Sustantivos, Verbos, Adjetivos o Adverbios (o varios a la vez). Los verbos salen en infinitivo y los adjetivos en masculino singular, listos para clase de lengua o juegos de completar frases.",
  },
  {
    question: "¿Qué palabras sirven para Pictionary o mímica?",
    answer:
      "Activa 'Solo para dibujar / mímica'. Solo saldrán cosas concretas y acciones que se pueden dibujar o representar, como jirafa, paraguas o nadar. Combínalo con Fácil para niños o Difícil para una ronda más dura.",
  },
  {
    question: "¿Sirve para jugar a Basta o Stop?",
    answer:
      "Sí: usa el filtro Empieza por para elegir una letra, o deja que el generador de letras aleatorias la elija por ti, y saca palabras de ejemplo para comprobar respuestas.",
  },
  {
    question: "¿Cómo uso palabras aleatorias para escribir?",
    answer:
      "Genera tres palabras y escribe un cuento, un poema o un párrafo que las incluya todas. Los adjetivos difíciles son un buen calentamiento de vocabulario y un verbo al azar ayuda a desbloquear la escritura.",
  },
];

export default function GeneradorDePalabrasPage() {
  return (
    <GeneratorPageShell
      locale="es"
      path={PATH}
      name="Generador de Palabras Aleatorias"
      heading={["Generador de Palabras", "Aleatorias"]}
      intro={`Más de ${WORDS.es.length} palabras en español elegidas a mano. Filtra por categoría, dificultad, longitud o letra inicial — o solo palabras para dibujar o hacer mímica.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/es/writing", label: "Temas para escribir" },
        { href: "/es/generador-de-apellidos", label: "Generador de apellidos" },
        { href: "/es/generador-de-animales-aleatorios", label: "Generador de animales" },
      ]}
      content={
        <>
          <SectionTitle>Palabras al azar que de verdad se usan</SectionTitle>
          <p>
            Muchos generadores sacan palabras de un diccionario enorme y te salen términos que nadie conoce. Este{" "}
            <strong>generador de palabras aleatorias</strong> usa una lista elegida a mano de palabras cotidianas y avanzadas del español,
            cada una marcada con su categoría gramatical, su dificultad y si se puede dibujar o representar — así la palabra encaja con tu
            juego, tu clase o tu historia.
          </p>
          <SectionTitle>Filtros</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Categoría</strong> — sustantivos, verbos (en infinitivo), adjetivos, adverbios o una mezcla.</li>
            <li><strong>Dificultad</strong> — palabras fáciles para niños, cotidianas o vocabulario avanzado como &quot;efímero&quot;.</li>
            <li><strong>Longitud</strong> — cortas (3–4 letras), medias (5–7) o largas (8+), útil para ortografía y crucigramas.</li>
            <li><strong>Empieza por</strong> — cualquier letra de la A a la Z, incluida la Ñ.</li>
            <li><strong>Para dibujar / mímica</strong> — solo sustantivos concretos y acciones.</li>
          </ul>
          <SectionTitle>Ideas para usar palabras aleatorias</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Pictionary y mímica</strong> — palabras dibujables y fáciles, una por turno.</li>
            <li><strong>Cuentos de tres palabras</strong> — genera tres y escribe una historia con todas; más ideas en <Link href="/es/writing" className={linkClass}>temas para escribir</Link>.</li>
            <li><strong>Vocabulario</strong> — adjetivos difíciles: defínelos, úsalos en una frase y busca un sinónimo.</li>
            <li><strong>Basta / Stop</strong> — elige letra y saca ejemplos para comprobar respuestas.</li>
          </ul>
        </>
      }
    >
      <WordGenerator locale="es" />
    </GeneratorPageShell>
  );
}
