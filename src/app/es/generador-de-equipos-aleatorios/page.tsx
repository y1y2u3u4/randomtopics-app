import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import TeamGenerator from "@/components/generators/TeamGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/es/generador-de-equipos-aleatorios";
const TITLE = "Generador de Equipos Aleatorios — Equipos Justos en un Clic";
const DESCRIPTION =
  "Generador de equipos aleatorios gratis: pega una lista de nombres y divídela en equipos o grupos al azar, por número de equipos o personas por equipo. Equilibra por género y nivel, fija jugadores, pantalla completa. Sin registro.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["generador de equipos aleatorios", "generador de equipos", "hacer equipos al azar", "generador de grupos aleatorios", "sorteo de equipos", "dividir en grupos"],
  alternates: { canonical: PATH, languages: hreflangAlternates("/random-team-generator") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", locale: "es_ES", type: "website" },
};

const FAQ = [
  {
    question: "¿Cómo funciona el generador de equipos aleatorios?",
    answer:
      "Pega los nombres (uno por línea o separados por comas), elige el número de equipos o cuántas personas quieres por equipo y pulsa Hacer equipos. La lista se mezcla con un algoritmo aleatorio justo y se reparte de modo que los equipos nunca se diferencian en más de una persona.",
  },
  {
    question: "¿Puedo hacer equipos equilibrados?",
    answer:
      "Sí. Activa Equilibrar equipos, marca a cada persona como chica, chico u otro y dale un nivel del 1 al 5. Cada grupo se reparte por igual entre los equipos y los niveles se asignan como en un draft en serpiente, así la fuerza total queda pareja sin perder el azar.",
  },
  {
    question: "¿Cómo dejo a alguien fijo en su equipo?",
    answer:
      "Después de hacer los equipos, toca un nombre para fijarlo (aparece un 🔒). Al mezclar otra vez, las personas fijadas se quedan en su equipo y el resto se reparte a su alrededor. Vuelve a tocarlo para soltarlo.",
  },
  {
    question: "¿Se guarda o se sube mi lista de alumnos?",
    answer:
      "No se sube nada. Las listas guardadas viven solo en el almacenamiento local de tu navegador. El enlace para compartir lleva los equipos dentro de la propia URL, así quien lo abra ve exactamente los mismos equipos.",
  },
  {
    question: "¿Sirve para hacer grupos de trabajo en clase?",
    answer:
      "Sí. Usa Personas por equipo para parejas, tríos o grupos de cuatro, y Número de equipos cuando necesitas un número fijo de bandos, como dos equipos para un concurso o cuatro casas para la jornada deportiva.",
  },
];

export default function GeneradorDeEquiposPage() {
  return (
    <GeneratorPageShell
      locale="es"
      path={PATH}
      name="Generador de Equipos Aleatorios"
      heading={["Generador de Equipos", "Aleatorios"]}
      intro="Pega los nombres, elige cuántos equipos o cuántas personas por equipo y obtén equipos al azar y justos — equilibrados por género o nivel si quieres, con nombres de equipo divertidos."
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/es/icebreaker", label: "Preguntas rompehielos" },
        { href: "/es/debate", label: "Generador de temas de debate" },
        { href: "/es/spin-the-wheel", label: "Ruleta de temas" },
      ]}
      content={
        <>
          <SectionTitle>Divide cualquier lista en equipos en segundos</SectionTitle>
          <p>
            Elegir equipos a mano lleva tiempo y siempre hay alguien que queda el último. Un <strong>generador de equipos aleatorios</strong>{" "}
            decide por ti: pega la lista, elige cómo dividirla y cada persona se asigna con una mezcla justa. Los equipos siempre quedan lo
            más parejos posible — 23 alumnos en 4 equipos son 6, 6, 6 y 5, nunca 8 y 3.
          </p>
          <SectionTitle>Dos formas de dividir</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Número de equipos</strong> — cuando necesitas un número fijo de bandos: dos para un concurso, cuatro casas, seis estaciones.</li>
            <li><strong>Personas por equipo</strong> — cuando importa el tamaño: parejas para corregir, tríos para el laboratorio, cinco para baloncesto.</li>
          </ul>
          <SectionTitle>Equipos equilibrados sin discusiones</SectionTitle>
          <p>
            Los equipos totalmente al azar pueden quedar descompensados. Activa <strong>Equilibrar equipos</strong>, marca un grupo (por
            ejemplo chica o chico) y un nivel del 1 al 5. El generador reparte cada grupo por igual y asigna primero a los más fuertes, así
            la suma de niveles queda cerca. Toca cualquier nombre para <strong>fijarlo</strong> antes de mezclar de nuevo.
          </p>
          <SectionTitle>Pensado para proyectar en clase</SectionTitle>
          <p>
            Pulsa <strong>Pantalla completa</strong> para proyectar los equipos en letra grande, cópialos como texto, descarga un CSV o
            comparte un enlace. Cada equipo recibe un nombre divertido como &quot;Nutrias Cósmicas&quot;; desactívalo si prefieres Equipo 1,
            Equipo 2. Guarda tus listas en el navegador para la próxima semana.
          </p>
          <SectionTitle>Usos más comunes</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>Trabajo en grupo, debates y juegos de repaso — combínalo con el <Link href="/es/debate" className={linkClass}>generador de temas de debate</Link>.</li>
            <li>Educación física, fútbol sala, baloncesto y jornadas deportivas de empresa.</li>
            <li>Noches de trivia, escape rooms y juegos de fiesta como <Link href="/es/two-truths-and-a-lie" className={linkClass}>dos verdades y una mentira</Link>.</li>
            <li>Salas para grupos en reuniones online y mesas de taller.</li>
          </ul>
        </>
      }
    >
      <TeamGenerator locale="es" />
    </GeneratorPageShell>
  );
}
