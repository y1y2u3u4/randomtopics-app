import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { FR_GENERAL } from "@/data/frenchTopics";
import { frCopy } from "@/data/frPageCopy";
import { allLocaleSiblings } from "@/lib/localePages";
import { hreflangAlternates } from "@/i18n/config";

const path = "/fr";
const COUNT = FR_GENERAL.reduce((n, g) => n + g.topics.length, 0);

export const metadata: Metadata = {
  title: { absolute: "Générateur de Sujet Aléatoire : Tire un Sujet Gratuit | Random Topics" },
  description: `Générateur de sujet aléatoire en français : un sujet de discussion, de débat ou de réflexion en un clic. ${COUNT} sujets par catégorie, sans répétition. Gratuit, sans inscription.`,
  alternates: { canonical: path, languages: hreflangAlternates("/") },
};

export default function FrHomePage() {
  return (
    <LocaleToolPage
      path={path}
      groups={FR_GENERAL}
      englishHref="/"
      title="Générateur de sujet aléatoire"
      lead={`Appuie sur le bouton et reçois un sujet tout de suite. ${COUNT} sujets en français pour lancer une discussion, ouvrir un débat ou nourrir une réflexion — choisis une catégorie ou tire un peu de tout.`}
      buttonLabel="Tirer un sujet"
      copy={frCopy("Random Topic Generator", "Tirer un sujet")}
      siblings={allLocaleSiblings("fr")}
      howTo={[
        "Choisis une catégorie (discussion, débat ou réflexion) ou laisse « Toutes ».",
        "Appuie sur « Tirer un sujet » : le sujet s'affiche dans la carte.",
        "Il ne te plaît pas ? Tire-en un autre ; rien ne se répète avant la fin de la liste.",
        "Utilise « Copier » pour l'envoyer à ton groupe, ou ouvre l'une des pages ci-dessous pour des sujets plus ciblés.",
      ]}
      faq={[
        { question: "Qu'est-ce qu'un générateur de sujet aléatoire ?", answer: "C'est un outil qui tire un sujet au hasard dans une liste prête à l'emploi. Il sert quand il te faut un sujet de discussion, de débat ou de réflexion et que tu ne sais pas par où commencer." },
        { question: "Les sujets se répètent-ils ?", answer: "Non. La liste est mélangée et un sujet ne revient qu'après avoir tout parcouru dans la catégorie choisie." },
        { question: "Peut-on s'en servir en classe ?", answer: "Oui. Les sujets de débat et les questions de réflexion échauffent bien un groupe. Projette la page et laisse les élèves tirer eux-mêmes." },
        { question: "Faut-il s'inscrire ou payer ?", answer: "Non. C'est gratuit, sans inscription, sur mobile comme sur ordinateur." },
      ]}
    />
  );
}
