import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import LastNameGenerator from "@/components/generators/LastNameGenerator";
import { LAST_NAMES, ORIGIN_LABELS } from "@/lib/generators/lastNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/es/generador-de-apellidos";
const TITLE = "Generador de Apellidos — Apellidos al Azar con Significado";
const DESCRIPTION = `Generador de apellidos gratis: más de ${LAST_NAMES.length} apellidos reales de ${Object.keys(ORIGIN_LABELS).length} culturas — español, italiano, inglés, irlandés, japonés, coreano y más — cada uno con su significado y origen.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["generador de apellidos", "apellidos aleatorios", "apellidos al azar", "apellidos con significado", "generador de apellidos españoles", "apellidos japoneses"],
  alternates: { canonical: PATH, languages: hreflangAlternates("/last-name-generator") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", locale: "es_ES", type: "website" },
};

const FAQ = [
  {
    question: "¿Cómo funciona el generador de apellidos?",
    answer: `Elige uno o varios orígenes (o déjalo en Todos) y pulsa Generar. Obtienes apellidos reales elegidos al azar de una lista de más de ${LAST_NAMES.length}, cada uno con su origen y lo que significaba. No se repiten hasta que hayas visto todos los que coinciden con tus filtros.`,
  },
  {
    question: "¿Son apellidos reales?",
    answer:
      "Sí. Todos son apellidos reales que se usan hoy, desde muy comunes como García, Smith o Kim hasta otros menos frecuentes que funcionan muy bien para personajes. El significado sigue la etimología más aceptada; cuando hay dudas se indica con 'posiblemente'.",
  },
  {
    question: "¿Qué tipos de apellidos españoles hay?",
    answer:
      "Los más comunes son patronímicos (Fernández, 'hijo de Fernando'; Martínez, 'hijo de Martín'), toponímicos que indican un lugar (Castillo, Rivera, Toledo), de oficio (Herrero, Molina) y descriptivos o apodos (Delgado, Moreno, Rubio).",
  },
  {
    question: "¿Cómo elijo un buen apellido para un personaje?",
    answer:
      "Haz que el origen encaje con la historia del personaje, busca en el significado una pista oculta y di el nombre completo en voz alta. En el mundo hispano recuerda que se usan dos apellidos: el paterno y el materno.",
  },
  {
    question: "¿Puedo compartir los apellidos que me salieron?",
    answer:
      "Sí. Copiar resultados te da los apellidos con su significado en texto, y Copiar enlace crea una URL que muestra exactamente los mismos apellidos a quien la abra.",
  },
];

export default function GeneradorDeApellidosPage() {
  return (
    <GeneratorPageShell
      locale="es"
      path={PATH}
      name="Generador de Apellidos"
      heading={["Generador de", "Apellidos"]}
      intro={`Más de ${LAST_NAMES.length} apellidos reales de ${Object.keys(ORIGIN_LABELS).length} culturas, con su significado y origen. Filtra por país y genera hasta 20 a la vez.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/es/writing", label: "Generador de temas para escribir" },
        { href: "/es/generador-de-equipos-aleatorios", label: "Generador de equipos" },
        { href: "/es/generador-de-animales-aleatorios", label: "Generador de animales" },
      ]}
      content={
        <>
          <SectionTitle>Apellidos reales, con su historia</SectionTitle>
          <p>
            Un apellido guarda un trocito de historia: el oficio de un antepasado (Herrero, Molina, Ferrari), el lugar donde vivía (Rivera,
            Yamamoto, Costa), el nombre de su padre (Fernández, Johnson, O&apos;Brien) o un apodo que se quedó (Rubio, Moreno, Russo). Este{" "}
            <strong>generador de apellidos</strong> muestra esa historia junto a cada nombre, para que no elijas solo un sonido sino un origen.
          </p>
          <SectionTitle>Apellidos por origen</SectionTitle>
          <p>
            Filtra por {Object.values(ORIGIN_LABELS).slice(0, 12).map((o) => o.es.toLowerCase()).join(", ")} y más. Marca varios orígenes a
            la vez para una familia mixta, o déjalo en Todos para sorprenderte. Cada lista mezcla apellidos muy comunes con otros más
            originales.
          </p>
          <SectionTitle>¿Para qué sirve un generador de apellidos?</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Escritores</strong> que necesitan nombrar a su reparto — combínalo con el <Link href="/es/writing" className={linkClass}>generador de temas para escribir</Link>.</li>
            <li><strong>Jugadores de rol y videojuegos</strong> que buscan nombres creíbles para ambientaciones modernas o históricas.</li>
            <li><strong>Docentes</strong> que preparan nombres de ejemplo para fichas, problemas y juicios simulados.</li>
            <li><strong>Curiosos</strong> que quieren saber qué significan los apellidos más comunes.</li>
          </ul>
          <SectionTitle>Consejos para elegir</SectionTitle>
          <p>
            Lee el nombre completo en voz alta: un nombre corto suele quedar mejor con un apellido largo y al revés. Evita la aliteración salvo
            que busques un tono de cómic, y busca el nombre completo una vez para comprobar que no es alguien famoso.
          </p>
        </>
      }
    >
      <LastNameGenerator locale="es" />
    </GeneratorPageShell>
  );
}
