import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WheelOfNames from "@/components/generators/WheelOfNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/es/ruleta-de-letras";
const TITLE = "Ruleta de Letras — Gira y Saldrá una Letra al Azar";
const DESCRIPTION =
  "Ruleta del abecedario en español, con la Ñ incluida. Gira para Basta, Stop, categorías o una palabra que empiece por esa letra. Quita la letra ganadora para no repetir. Gratis y sin registro.";

const LETTERS = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nÑ\nO\nP\nQ\nR\nS\nT\nU\nV\nW\nX\nY\nZ";
const EASY = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nL\nM\nN\nÑ\nO\nP\nR\nS\nT\nU\nV";
const VOWELS = "A\nE\nI\nO\nU";

const SOCIAL = generatorSocial({ card: "random-letter-generator", title: TITLE, description: DESCRIPTION, alt: "Ruleta de letras — el abecedario en una ruleta de colores" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["ruleta de letras", "ruleta del abecedario", "letra al azar", "ruleta para basta", "ruleta de letras para stop", "girar ruleta de letras"],
  alternates: { canonical: PATH, languages: hreflangAlternates("/random-letter-generator") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", locale: "es_ES", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "¿Cómo saco una letra al azar?", answer: "La ruleta empieza con las 27 letras, de la A a la Z y la Ñ. Pulsa Girar. Cada letra tiene la misma probabilidad. El resultado sale debajo en grande para que toda la mesa lo vea." },
  { question: "¿Sirve para Basta, Stop o Tutti Frutti?", answer: "Sí. Para una ronda más justa, pulsa «Sin letras difíciles»: se quitan K, Q, W, X, Y y Z, que en español dan muy pocas palabras. Si el grupo quiere el reto completo, vuelve a «A–Z y Ñ»." },
  { question: "¿Cómo evito que se repita la letra?", answer: "Marca «Quitar al ganador después de cada giro». La letra sale de la ruleta hasta que pulses Restablecer. Así una partida de varias rondas no cae otra vez en la A." },
  { question: "¿Puedo dejar solo las vocales?", answer: "Sí. El botón Vocales deja A, E, I, O y U. También puedes borrar líneas a mano y escribir el conjunto que quieras, por ejemplo solo las letras de un nombre." },
  { question: "¿La Ñ entra en el sorteo?", answer: "Sí, en la lista completa y en la lista sin letras difíciles. Si tu versión de Basta no usa Ñ, bórrala antes de girar. El cambio se ve en la ruleta al momento." },
  { question: "¿Se guarda la lista?", answer: "En este navegador, sí, como el resto de ruletas de nombres. No se sube a un servidor. Copiar enlace guarda las letras dentro del enlace para abrir la misma ruleta en otro dispositivo." },
  { question: "¿En qué se diferencia de una ruleta de nombres?", answer: "Es la misma ruleta, cargada con letras en lugar de personas. Si quieres sortear gente, abre la ruleta de nombres. Si quieres un número, la ruleta de números." },
];

export default function RuletaDeLetrasPage() {
  return (
    <GeneratorPageShell
      locale="es"
      path={PATH}
      name="Ruleta de letras"
      heading={["Ruleta de", "letras"]}
      intro="Gira el abecedario, con Ñ, y usa la letra para Basta, categorías o una palabra nueva."
      description={DESCRIPTION}
      updated="2026-11-13"
      faq={FAQ}
      inShort="Pulsa Girar y la ruleta cae en una letra de la A a la Z, Ñ incluida. El botón sin letras difíciles quita K, Q, W, X, Y y Z para que Basta o Stop tenga respuestas. Puedes dejar solo vocales, quitar la letra ganadora para no repetir y compartir el enlace. Gratis y sin registro."
      related={[
        { href: "/es/ruleta-de-nombres", label: "Ruleta de nombres" },
        { href: "/es/ruleta-de-numeros", label: "Ruleta de números" },
        { href: "/es/ruleta-si-o-no", label: "Ruleta sí o no" },
        { href: "/es/generador-de-palabras-aleatorias", label: "Palabras aleatorias" },
        { href: "/es/palabras-para-pictionary", label: "Palabras para Pictionary" },
      ]}
      content={
        <>
          <SectionTitle>Cómo usar la ruleta en un juego de letras</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Basta o Stop</strong> — un giro, todos escriben nombre, animal, cosa y fruta con esa letra, y quien termina dice basta.</li>
            <li><strong>Categorías en clase</strong> — la letra manda la ronda: un país, un verbo, una profesión. Quitar al ganador evita repetir la misma inicial.</li>
            <li><strong>Calentamiento de palabras</strong> — di en veinte segundos todas las palabras que puedas con la letra que salió.</li>
            <li><strong>Solo vocales</strong> — útil para un juego corto con niñas y niños que todavía están con el abecedario.</li>
          </ul>
          <SectionTitle>Qué letras conviene quitar</SectionTitle>
          <p>
            K, Q, W, X, Y y Z existen en español, pero abren muy pocas respuestas en un minuto. La lista «Sin letras difíciles» las quita y conserva la Ñ.
            Si alguien del grupo quiere el reto, un solo giro con la lista completa basta para esa ronda. Después pueden volver a la lista fácil sin recargar la página.
          </p>
          <p>
            ¿La ronda pide una palabra entera y no una letra? Usa el <Link prefetch={false} href="/es/generador-de-palabras-aleatorias" className={linkClass}>generador de palabras aleatorias</Link> o las <Link prefetch={false} href="/es/palabras-para-pictionary" className={linkClass}>palabras para Pictionary</Link>.
          </p>
        </>
      }
    >
      <WheelOfNames extended={{
        pageId: "ruleta_de_letras",
        pro: true,
        locale: "es",
        preset: LETTERS,
        removeDefault: true,
        quick: [
          { label: "A–Z y Ñ", text: LETTERS },
          { label: "Sin letras difíciles", text: EASY },
          { label: "Vocales", text: VOWELS },
        ],
      }} />
    </GeneratorPageShell>
  );
}
