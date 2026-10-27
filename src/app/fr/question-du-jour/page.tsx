import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { FR_QOTD } from "@/data/frenchTopics";
import { FR_SIBLINGS, frCopy } from "@/data/frPageCopy";
import { hreflangAlternates } from "@/i18n/config";

const path = "/fr/question-du-jour";
const COUNT = FR_QOTD.reduce((n, g) => n + g.topics.length, 0);

export const metadata: Metadata = {
  title: { absolute: `Question du Jour : ${COUNT} Questions pour la Classe et l'Équipe` },
  description: `Question du jour en français : ${COUNT} questions légères, de réflexion, pour la classe et pour l'équipe. Tire celle d'aujourd'hui et copie-la pour ton groupe. Gratuit.`,
  alternates: { canonical: path, languages: hreflangAlternates("/question-of-the-day") },
};

export default function FrQotdPage() {
  return (
    <LocaleToolPage
      path={path}
      groups={FR_QOTD}
      englishHref="/question-of-the-day"
      title="Question du jour"
      lead={`Démarre le cours, la réunion ou le groupe de discussion avec une question du jour. ${COUNT} questions en français — légères, de réflexion, pour la classe et pour l'équipe — sans répétition jusqu'à la fin.`}
      buttonLabel="Tirer une question"
      copy={frCopy("Question of the Day", "Tirer une question")}
      siblings={FR_SIBLINGS}
      howTo={[
        "Choisis le public : classe, équipe, réflexion ou légères.",
        "Appuie sur « Tirer une question » puis lis-la à voix haute ou copie-la dans le groupe.",
        "Laisse une minute à chacun pour réfléchir avant de répondre.",
        "Demain, tire-en une autre : la page garde en mémoire celles déjà sorties.",
      ]}
      faq={[
        { question: "Qu'est-ce qu'une question du jour ?", answer: "C'est une question courte posée en début de cours, de réunion ou dans un groupe, à laquelle chacun répond. Elle sert à briser la glace et à mieux connaître les gens." },
        { question: "Comment l'utiliser en classe ?", answer: "Écris la question au tableau à l'arrivée des élèves ou fais un tour de réponses de cinq minutes. La catégorie « Pour la classe » est faite pour cela." },
        { question: "Est-ce adapté aux réunions de travail ?", answer: "Oui. La catégorie « Pour l'équipe » propose des questions légères et professionnelles pour ouvrir un point d'équipe." },
        { question: "Est-ce gratuit ?", answer: "Oui, gratuit, sans inscription, et utilisable sur mobile." },
      ]}
    />
  );
}
