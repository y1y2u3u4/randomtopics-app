import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { FR_CHARADES } from "@/data/frenchTopics";
import { FR_SIBLINGS, frCopy } from "@/data/frPageCopy";
import { hreflangAlternates } from "@/i18n/config";

const path = "/fr/idees-de-mime";
const COUNT = FR_CHARADES.reduce((n, g) => n + g.topics.length, 0);

export const metadata: Metadata = {
  title: { absolute: `Idées de Mime : ${COUNT} Mots pour le Jeu du Mime (2026)` },
  description: `Idées de mime pour le jeu du mime : ${COUNT} mots à faire deviner — animaux, métiers, films, actions et objets. Tire un mot au hasard, sans répétition. Gratuit.`,
  alternates: { canonical: path, languages: hreflangAlternates("/charades") },
};

export default function FrCharadesPage() {
  return (
    <LocaleToolPage
      path={path}
      groups={FR_CHARADES}
      englishHref="/charades"
      title="Idées de mime"
      lead={`À court d'idées pour le jeu du mime ? Tire au sort un mot parmi ${COUNT} idées — animaux, métiers, actions du quotidien, films et objets — et fais-le deviner à ton équipe sans dire un mot.`}
      buttonLabel="Tirer un mime"
      copy={frCopy("Charades Generator", "Tirer un mime")}
      siblings={FR_SIBLINGS}
      howTo={[
        "Choisis une catégorie, ou laisse « Toutes » pour un mélange.",
        "Appuie sur « Tirer un mime » et garde le mot secret : montre l'écran uniquement au mimeur.",
        "Mime sans parler ni écrire. Ton équipe a une minute pour deviner.",
        "Passe au joueur suivant et tire un nouveau mot.",
      ]}
      faq={[
        { question: "Comment jouer au jeu du mime ?", answer: "Deux équipes s'affrontent. Un joueur tire un mot et le fait deviner uniquement avec des gestes ; l'équipe a un temps limité (souvent une minute) pour trouver." },
        { question: "Quelles idées de mime pour les enfants ?", answer: "Les animaux et les actions du quotidien sont les plus simples. Les films sont plutôt pour les plus grands." },
        { question: "Peut-on jouer en famille ou entre amis ?", answer: "Oui. Les catégories sont mixtes, sans mot compliqué, et le jeu marche aussi bien à deux qu'en grand groupe." },
        { question: "Faut-il un chronomètre ?", answer: "Pas obligatoire, mais une minute par mot rend la partie plus rythmée. Utilise le minuteur de ton téléphone." },
      ]}
    />
  );
}
