import type { Metadata } from "next";
import LocaleToolPage, { type LocalePageCopy } from "@/components/LocaleToolPage";
import { ES_SUBJECTS } from "@/data/esExtraPages";
import { hreflangAlternates } from "@/i18n/config";

const path = "/es/random-subject-generator";

export const metadata: Metadata = {
  title: { absolute: `Generador de Asignaturas Aleatorias: ${ES_SUBJECTS.length} Materias (2026)` },
  description: `Generador de asignaturas y materias aleatorias: elige entre ${ES_SUBJECTS.length} materias escolares con un tema concreto para estudiar, exponer o repasar. Gratis y sin registro.`,
  alternates: { canonical: path, languages: hreflangAlternates("/random-subject-generator") },
};

const COPY: LocalePageCopy = {
  lang: "es",
  currency: "EUR",
  homeHref: "/es",
  homeLabel: "Inicio",
  meta: "Gratis · sin registro · {n} temas por asignatura · actualizado en octubre de 2026",
  siblingsHeading: "Más generadores en español",
  howToHeading: "Cómo se usa",
  listHeading: "Asignaturas y temas",
  faqHeading: "Preguntas frecuentes",
  englishNote: "Versión en inglés:",
  englishLabel: "Random Subject Generator",
  ui: {
    chooseCategory: "Elegir asignatura",
    all: "Todas",
    spinning: "Girando…",
    prompt: "Pulsa el botón para elegir una asignatura.",
    timeUp: "¡Tiempo!",
    spin: "Girar la ruleta",
    startTimer: "Empezar 1 minuto",
    restartTimer: "Reiniciar tiempo",
    copied: "Copiado ✓",
    copy: "Copiar",
    topicsWord: "temas",
    shownWord: "vistos",
    noRepeat: "sin repeticiones hasta terminar",
    defaultButton: "Elegir asignatura al azar",
  },
};

export default function RandomSubjectPageEs() {
  return (
    <LocaleToolPage
      path={path}
      groups={ES_SUBJECTS}
      showLocaleSwitcher
      englishHref="/random-subject-generator"
      title="Generador de Asignaturas Aleatorias"
      lead={`Elige una asignatura al azar entre ${ES_SUBJECTS.length} materias escolares, cada una con un tema concreto: ideal para decidir qué estudiar hoy, preparar una exposición o repasar antes de un examen.`}
      buttonLabel="Elegir asignatura al azar"
      copy={COPY}
      siblings={[
        { href: "/es/generador-de-temas-para-estudiar", label: "Temas para estudiar", detail: "Qué repasar hoy" },
        { href: "/es/generador-de-temas-para-exponer", label: "Temas para exponer", detail: "Exposiciones en clase" },
        { href: "/es/generador-de-temas-para-investigar", label: "Temas para investigar", detail: "Trabajos y proyectos" },
        { href: "/es/question-of-the-day", label: "Pregunta del día", detail: "Una pregunta nueva cada día" },
      ]}
      howTo={[
        "Elige una asignatura concreta o deja «Todas».",
        "Pulsa «Elegir asignatura al azar»: aparece la materia con un tema.",
        "Usa el tema para estudiar, exponer o escribir; vuelve a pulsar para el siguiente.",
        "En clase, proyecta la página para que cada alumno saque su asignatura.",
      ]}
      faq={[
        {
          question: "¿Para qué sirve un generador de asignaturas aleatorias?",
          answer: "Para quitar la decisión de encima: qué materia repasar hoy, qué tema exponer o a quién le toca cada asignatura en un trabajo en grupo. El azar evita discusiones y la parálisis de elegir.",
        },
        {
          question: "¿Qué asignaturas incluye?",
          answer: `Incluye ${ES_SUBJECTS.length} materias habituales en primaria, secundaria y bachillerato: ciencias, matemáticas, historia, lengua, geografía, tecnología, filosofía, psicología, biología, química, física, arte, música, economía, educación cívica y educación física.`,
        },
        {
          question: "¿Se repiten las asignaturas?",
          answer: "No. El generador baraja el mazo y no repite ningún tema hasta haberlos mostrado todos.",
        },
        {
          question: "¿Es gratis?",
          answer: "Sí, es gratis, funciona en el móvil y no necesita registro.",
        },
      ]}
    />
  );
}
