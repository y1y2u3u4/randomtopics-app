import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { FR_DEBATE } from "@/data/frenchTopics";
import { FR_SIBLINGS, frCopy } from "@/data/frPageCopy";
import { hreflangAlternates } from "@/i18n/config";

const path = "/fr/sujets-de-debat";
const COUNT = FR_DEBATE.reduce((n, g) => n + g.topics.length, 0);

export const metadata: Metadata = {
  title: { absolute: `Sujets de Débat : ${COUNT} Idées pour l'École et les Clubs (2026)` },
  description: `Sujets de débat en français : ${COUNT} questions sur l'école, la technologie, la société et l'environnement. Tire un sujet au hasard, sans répétition. Gratuit.`,
  alternates: { canonical: path, languages: hreflangAlternates("/debate") },
};

export default function FrDebatePage() {
  return (
    <LocaleToolPage
      path={path}
      groups={FR_DEBATE}
      englishHref="/debate"
      title="Sujets de débat"
      lead={`Un débat sans sujet, ça n'existe pas. Tire au sort parmi ${COUNT} sujets de débat en français — école, technologie, société, environnement et sujets pour rire — pour la classe, un club ou un oral.`}
      buttonLabel="Tirer un sujet"
      copy={frCopy("Debate Topics", "Tirer un sujet")}
      siblings={FR_SIBLINGS}
      howTo={[
        "Choisis une catégorie ou laisse « Toutes ».",
        "Appuie sur « Tirer un sujet » : la question de débat s'affiche.",
        "Répartis les rôles : un camp pour, un camp contre, parfois tirés au sort.",
        "Prévois deux minutes de préparation, une minute d'ouverture par camp, puis des réponses croisées.",
      ]}
      faq={[
        { question: "Comment choisir un bon sujet de débat ?", answer: "Un bon sujet est une question à laquelle on peut répondre oui ou non et où les deux camps ont de vrais arguments. Évite les sujets dont la réponse est évidente." },
        { question: "Combien de personnes pour un débat ?", answer: "Deux suffisent. En classe, on forme souvent deux équipes de trois ou quatre, avec quelques élèves comme jury et chronométreur." },
        { question: "Ces sujets conviennent-ils au collège et au lycée ?", answer: "Oui. Ils sont actuels et adaptés au cadre scolaire ; la catégorie « Pour rire » sert d'échauffement." },
        { question: "Est-ce gratuit ?", answer: "Oui, sans inscription, sur ordinateur comme sur mobile." },
      ]}
    />
  );
}
