import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { FR_WOULD_YOU_RATHER } from "@/data/frenchTopics";
import { FR_SIBLINGS, frCopy } from "@/data/frPageCopy";
import { hreflangAlternates } from "@/i18n/config";

const path = "/fr/tu-preferes";
const COUNT = FR_WOULD_YOU_RATHER.reduce((n, g) => n + g.topics.length, 0);

export const metadata: Metadata = {
  title: { absolute: `Tu Préfères : ${COUNT} Questions Drôles et Dilemmes (2026)` },
  description: `Questions « Tu préfères » : ${COUNT} dilemmes classiques, drôles, difficiles, entre amis et en couple. Tire un dilemme au hasard et fais voter tout le monde. Gratuit.`,
  alternates: { canonical: path, languages: hreflangAlternates("/would-you-rather") },
};

export default function FrWouldYouRatherPage() {
  return (
    <LocaleToolPage
      path={path}
      groups={FR_WOULD_YOU_RATHER}
      englishHref="/would-you-rather"
      title="Tu préfères ? Questions et dilemmes"
      lead={`Deux options, un seul choix. Tire au sort parmi ${COUNT} questions « Tu préfères » en français — classiques, drôles, difficiles, entre amis et en couple — et départage tout le monde.`}
      buttonLabel="Tirer un dilemme"
      copy={frCopy("Would You Rather", "Tirer un dilemme")}
      siblings={FR_SIBLINGS}
      howTo={[
        "Choisis une catégorie : classiques, drôles, dilemmes, amis ou couple.",
        "Appuie sur « Tirer un dilemme » et lis la question à voix haute.",
        "Chacun répond, puis explique son choix : c'est là que la discussion devient amusante.",
        "Tire un nouveau dilemme quand tout le monde a répondu.",
      ]}
      faq={[
        { question: "Comment jouer à Tu préfères ?", answer: "Une personne lit une question avec deux choix, chacun doit en choisir un et justifier sa réponse. Il n'y a ni gagnant ni perdant : le but est de discuter." },
        { question: "Quelles questions Tu préfères entre amis ?", answer: "La catégorie « Entre amis » est faite pour les soirées. Les « Drôles » fonctionnent très bien avec un grand groupe." },
        { question: "Y a-t-il des questions pour les couples ?", answer: "Oui, la catégorie « En couple » propose des choix pour mieux se connaître sans pression." },
        { question: "Les dilemmes se répètent-ils ?", answer: "Non, la liste est mélangée et un dilemme ne revient qu'après avoir tout parcouru." },
      ]}
    />
  );
}
