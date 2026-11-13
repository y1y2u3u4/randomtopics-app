import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WheelOfNames from "@/components/generators/WheelOfNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/es/ruleta-de-numeros";
const TITLE = "Ruleta de Números — Gira y Saldrá un Número al Azar";
const DESCRIPTION =
  "Ruleta de números para sorteos, juegos y clase. Empieza del 1 al 20 y cambia a del 1 al 10, del 1 al 36 o del 0 al 9. Quita el número ganador para no repetir. Gratis y sin registro.";

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i)).join("\n");
const ONE_TO_10 = range(1, 10);
const ONE_TO_20 = range(1, 20);
const ONE_TO_36 = range(1, 36);
const ZERO_TO_9 = range(0, 9);

const SOCIAL = generatorSocial({ card: "random-number-generator", title: TITLE, description: DESCRIPTION, alt: "Ruleta de números — casillas del 1 al 20" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["ruleta de numeros", "ruleta de números", "ruleta de numeros aleatorios", "numero al azar", "ruleta del 1 al 10", "ruleta del 1 al 100", "girar ruleta de numeros"],
  alternates: { canonical: PATH, languages: hreflangAlternates("/random-number-generator") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", locale: "es_ES", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "¿Cómo elijo un número al azar con la ruleta?", answer: "La ruleta abre del 1 al 20. Pulsa Girar y el número ganador aparece debajo. Cada número de la lista tiene la misma probabilidad, sin importar en qué casilla está." },
  { question: "¿Puedo cambiar el rango?", answer: "Sí. Los botones cargan del 1 al 10, del 1 al 20, del 1 al 36 y del 0 al 9. Para otro rango, borra la caja y escribe tus números, uno por línea: por ejemplo del 1 al 50, o solo pares. La ruleta se redibuja al escribir." },
  { question: "¿Cómo hago un sorteo sin repetir?", answer: "Deja marcada la opción de quitar al ganador. El número que sale se elimina hasta que pulses Restablecer. Sirve para rifar puestos, turnos o papeletas." },
  { question: "¿Hasta qué número llega?", answer: "Hasta 200 entradas. Del 1 al 36 todavía se lee en la casilla. Con listas más largas, como del 1 al 100, la casilla puede ir sin texto y el número ganador se anuncia abajo en grande. Pega la lista o impórtala desde un archivo de texto." },
  { question: "¿Es lo mismo que una ruleta de casino?", answer: "No paga ni simula una mesa. Es un sorteo justo de los números que tú pongas. Del 1 al 36 se parece al tablero solo en el rango; no hay cero doble ni apuestas." },
  { question: "¿Los números salen de mi navegador?", answer: "No se envían a un servidor. Puedes copiar un enlace con la lista para que otra persona abra la misma ruleta." },
  { question: "¿Y si quiero un número dentro de un rango enorme, sin ver todas las casillas?", answer: "Para un rango muy amplio la lista visual estorba. Esta ruleta es para que el grupo vea las opciones. Si necesitas muchos números de una vez, escribe solo los que de verdad están en juego." },
];

export default function RuletaDeNumerosPage() {
  return (
    <GeneratorPageShell
      locale="es"
      path={PATH}
      name="Ruleta de números"
      heading={["Ruleta de", "números"]}
      intro="Gira y cae un número al azar. Cambia el rango, quita ganadores y comparte la misma ruleta."
      description={DESCRIPTION}
      updated="2026-11-13"
      faq={FAQ}
      inShort="La ruleta empieza del 1 al 20. Pulsa Girar y cada número tiene la misma probabilidad. Los botones cambian a del 1 al 10, del 1 al 36 o del 0 al 9, y puedes escribir cualquier otra lista. Quitar al ganador evita repeticiones. Es gratis, no pide registro y la lista se queda en tu navegador."
      related={[
        { href: "/es/ruleta-de-nombres", label: "Ruleta de nombres" },
        { href: "/es/ruleta-de-letras", label: "Ruleta de letras" },
        { href: "/es/ruleta-si-o-no", label: "Ruleta sí o no" },
        { href: "/es/spin-the-wheel", label: "Ruleta de temas" },
        { href: "/es/generador-de-equipos-aleatorios", label: "Generador de equipos" },
      ]}
      content={
        <>
          <SectionTitle>Para qué girar una ruleta de números</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Turnos</strong> — numera a las personas y gira para ver quién sigue. Con quitar al ganador, nadie repite hasta que pasen todas.</li>
            <li><strong>Clase</strong> — del 1 al 10 para un ejercicio, o los números de lista del grupo si los pegas en la caja.</li>
            <li><strong>Juegos de mesa</strong> — cuando el dado no llega al rango que necesitan, la ruleta cubre del 1 al 20 o del 1 al 36.</li>
            <li><strong>Rifas cortas</strong> — un número por papeleta, un giro en pantalla, y el historial queda a la vista.</li>
          </ul>
          <SectionTitle>Elige un rango que se pueda leer</SectionTitle>
          <p>
            Del 1 al 20 se lee bien en la casilla. Del 1 al 36 también, en letra más chica. A partir de ahí la ruleta sigue siendo justa, pero el anuncio de abajo importa más que la casilla.
            Escribe solo números que de verdad puedan ganar: una ruleta del 1 al 100 con noventa números imposibles no ayuda a nadie.
          </p>
          <p>
            Para sortear personas en vez de números, usa la <Link prefetch={false} href="/es/ruleta-de-nombres" className={linkClass}>ruleta de nombres</Link>.
            Para una letra, la <Link prefetch={false} href="/es/ruleta-de-letras" className={linkClass}>ruleta de letras</Link>.
          </p>
        </>
      }
    >
      <WheelOfNames extended={{
        pageId: "ruleta_de_numeros",
        pro: true,
        locale: "es",
        preset: ONE_TO_20,
        removeDefault: true,
        quick: [
          { label: "1 al 10", text: ONE_TO_10 },
          { label: "1 al 20", text: ONE_TO_20 },
          { label: "1 al 36", text: ONE_TO_36 },
          { label: "0 al 9", text: ZERO_TO_9 },
        ],
      }} />
    </GeneratorPageShell>
  );
}
