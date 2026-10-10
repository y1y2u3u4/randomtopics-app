import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import AnimalGenerator from "@/components/generators/AnimalGenerator";
import { ANIMALS } from "@/lib/generators/animals";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/es/generador-de-animales-aleatorios";
const TITLE = "Generador de Animales Aleatorios — Con Dibujo y Dato Curioso";
const DESCRIPTION = `Generador de animales aleatorios gratis: más de ${ANIMALS.length} animales, cada uno con ilustración y un dato curioso. Filtra por mamíferos, aves, mar, granja o animales fáciles para niños. Ideal para dibujar y jugar a adivinar.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["generador de animales aleatorios", "animal aleatorio", "animal al azar", "generador de animales", "animales para dibujar", "datos curiosos de animales"],
  alternates: { canonical: PATH, languages: hreflangAlternates("/random-animal-generator") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", locale: "es_ES", type: "website" },
};

const FAQ = [
  {
    question: "¿Cómo funciona el generador de animales aleatorios?",
    answer: `Pulsa Generar y la herramienta elige animales al azar de una lista revisada de más de ${ANIMALS.length} animales reales. Cada resultado muestra el nombre, qué tipo de animal es, dónde vive y un dato curioso. No se repite ninguno hasta que hayas visto todos los que coinciden con tus filtros.`,
  },
  {
    question: "¿Puedo sacar solo animales marinos, de granja o mamíferos?",
    answer:
      "Sí. Usa el filtro Tipo para mamíferos, aves, reptiles, anfibios, peces o insectos e invertebrados, y el filtro Dónde vive para mar, granja, mascotas, selva, sabana, zonas polares y más. Puedes marcar varias opciones a la vez.",
  },
  {
    question: "¿Sirve para niños?",
    answer:
      "Elige Fáciles (para niños) para que salgan animales que casi todos los niños reconocen, como el elefante, el pingüino o la mariquita. Los datos son cortos y aptos para clase. Elige Difíciles para alumnos mayores: okapi, ajolote, pangolín…",
  },
  {
    question: "¿Cómo lo uso para dibujar?",
    answer:
      "Genera un animal, pon un temporizador de cinco o diez minutos y dibújalo — o genera dos y dibuja una mezcla de ambos. También sirve para diseño de personajes y retos diarios de boceto.",
  },
  {
    question: "¿Puedo compartir los animales que me salieron?",
    answer:
      "Sí. La dirección de la página se actualiza con tus filtros y resultados, así que Copiar enlace envía exactamente los mismos animales. Copiar resultados te da una lista en texto para una ficha o un chat.",
  },
];

export default function GeneradorDeAnimalesPage() {
  return (
    <GeneratorPageShell
      locale="es"
      path={PATH}
      name="Generador de Animales Aleatorios"
      heading={["Generador de Animales", "Aleatorios"]}
      intro={`Más de ${ANIMALS.length} animales reales con dibujo y dato curioso. Filtra por tipo o hábitat, genera uno o una docena, sin repetir.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/es/would-you-rather", label: "¿Qué prefieres?" },
        { href: "/es/this-or-that", label: "Esto o aquello" },
        { href: "/es/generador-de-temas-para-exponer", label: "Temas para exponer" },
      ]}
      content={
        <>
          <SectionTitle>Un animal al azar, y algo que aprender</SectionTitle>
          <p>
            La mayoría de selectores solo te dan un nombre. Este <strong>generador de animales aleatorios</strong> te da el animal, una
            ilustración simpática y un dato que dan ganas de contar — que el pulpo tiene tres corazones o que las nutrias marinas se dan la mano para dormir. Todos son animales reales y los datos están revisados, así que funciona tanto en clase como en una fiesta.
          </p>
          <SectionTitle>Filtros pensados para el uso real</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Tipo</strong> — mamíferos, aves, reptiles, anfibios, peces o insectos e invertebrados.</li>
            <li><strong>Dónde vive</strong> — mar, granja, mascotas, selva, sabana, bosque, desierto, polar, ríos, montaña y más.</li>
            <li><strong>Dificultad</strong> — animales fáciles que conocen los niños, o difíciles para concursos y alumnos mayores.</li>
          </ul>
          <SectionTitle>Ideas para usar animales aleatorios</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Retos de dibujo</strong> — dibuja el animal en dos minutos y luego en diez; o combina dos animales en una criatura nueva.</li>
            <li><strong>Juegos de adivinar</strong> — alguien lee el dato curioso en voz alta y el resto adivina el animal, o lo representa con mímica.</li>
            <li><strong>Investigación en clase</strong> — asigna a cada alumno un animal al azar para una ficha o una exposición; mira los <Link href="/es/generador-de-temas-para-exponer" className={linkClass}>temas para exponer</Link>.</li>
            <li><strong>Nombres de equipo</strong> — nuestro <Link href="/es/generador-de-equipos-aleatorios" className={linkClass}>generador de equipos</Link> ya pone nombres de animales a los equipos.</li>
          </ul>
          <p>
            La lista incluye más de cien mamíferos, decenas de aves, vida marina desde el pez payaso hasta la ballena azul, y los insectos y
            arañas que a los niños les encanta encontrar. Genera todos los que quieras: ningún animal se repite hasta que los hayas visto todos.
          </p>
        </>
      }
    >
      <AnimalGenerator locale="es" />
    </GeneratorPageShell>
  );
}
