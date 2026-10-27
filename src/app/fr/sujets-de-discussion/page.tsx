import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { FR_CONVERSATION } from "@/data/frenchTopics";
import { FR_SIBLINGS, frCopy } from "@/data/frPageCopy";
import { hreflangAlternates } from "@/i18n/config";

const path = "/fr/sujets-de-discussion";
const COUNT = FR_CONVERSATION.reduce((n, g) => n + g.topics.length, 0);

export const metadata: Metadata = {
  title: { absolute: `Sujet de Discussion : ${COUNT} Idées pour Relancer la Conversation` },
  description: `Sujet de discussion aléatoire : ${COUNT} sujets et questions pour discuter entre amis, en famille ou au travail. Tire un sujet au hasard, sans répétition. Gratuit.`,
  alternates: { canonical: path, languages: hreflangAlternates("/conversation") },
};

export default function FrConversationPage() {
  return (
    <LocaleToolPage
      path={path}
      groups={FR_CONVERSATION}
      englishHref="/conversation"
      title="Sujets de discussion"
      lead={`Plus rien à dire ? Tire au sort un sujet parmi ${COUNT} idées en français — légères, personnelles, voyages, « et si… ? » et plus profondes — pour relancer la conversation entre amis, en famille ou avec un collègue.`}
      buttonLabel="Tirer un sujet"
      copy={frCopy("Conversation Starters", "Tirer un sujet")}
      siblings={FR_SIBLINGS}
      howTo={[
        "Choisis une catégorie ou laisse « Toutes ».",
        "Appuie sur « Tirer un sujet » : la question s'affiche dans la carte.",
        "Réponds en premier : cela met l'autre à l'aise avant de lui renvoyer la question.",
        "Quand la discussion s'essouffle, tire un nouveau sujet ; rien ne se répète avant la fin de la liste.",
      ]}
      faq={[
        { question: "Quel sujet de discussion pour briser le silence ?", answer: "Les questions ouvertes sur le quotidien marchent le mieux : plat préféré, séries, vacances, projets du week-end. Elles sont faciles à répondre et amènent des anecdotes." },
        { question: "Quels sujets de conversation avec quelqu'un qu'on vient de rencontrer ?", answer: "Commence par les sujets légers et les « et si… ? » : ils sont drôles et en disent beaucoup sans pression. Garde les questions plus profondes pour quand la conversation est lancée." },
        { question: "Peut-on l'utiliser dans une conversation WhatsApp ?", answer: "Oui. Appuie sur « Copier » et colle la question dans la discussion. Cela marche sur mobile, sans rien télécharger." },
        { question: "Les sujets se répètent-ils ?", answer: "Non. Le générateur mélange les questions et ne repasse sur un sujet qu'après les avoir toutes montrées." },
      ]}
    />
  );
}
