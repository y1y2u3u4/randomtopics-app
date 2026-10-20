import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { PT_SPEECH } from "@/data/portugueseTopics";
import { PT_SIBLINGS, ptCopy } from "@/data/ptPageCopy";
import { hreflangAlternates } from "@/i18n/config";

const path = "/pt/temas-para-apresentacao";
const COUNT = PT_SPEECH.reduce((n, g) => n + g.topics.length, 0);

export const metadata: Metadata = {
  title: { absolute: `Temas para Apresentação: ${COUNT} Ideias com Cronômetro (2026)` },
  description: `${COUNT} temas para apresentação oral e trabalho escolar, com cronômetro de 1 minuto para treinar improviso. Experiências pessoais, atualidades, persuasivos e criativos. Grátis.`,
  alternates: { canonical: path, languages: hreflangAlternates("/speech") },
};

export default function PtSpeechPage() {
  return (
    <LocaleToolPage
      path={path}
      groups={PT_SPEECH}
      mode="timer"
      englishHref="/speech"
      title="Temas para Apresentação"
      lead={`Sorteie um entre ${COUNT} temas para apresentação oral, seminário ou treino de oratória e use o cronômetro de 1 minuto para praticar falar de improviso — ideal para escola, faculdade e entrevistas.`}
      buttonLabel="Sortear tema"
      copy={ptCopy("Speech Topic Generator", "Sortear tema")}
      siblings={PT_SIBLINGS}
      howTo={[
        "Escolha uma categoria ou deixe em «Todos».",
        "Aperte «Sortear tema» e pense 30 segundos.",
        "Aperte «Começar 1 minuto» e fale até o tempo acabar.",
        "Repita com outro tema; em sala, cada aluno sorteia o seu.",
      ]}
      faq={[
        { question: "Quais são bons temas para apresentação escolar?", answer: "Temas que você consegue explicar com exemplos próprios: uma experiência pessoal, um problema da sua cidade ou uma curiosidade científica. Eles soam naturais e são fáceis de estruturar." },
        { question: "Como treinar falar em público?", answer: "Fale de improviso por um minuto todos os dias. Use a estrutura ideia principal, dois exemplos e conclusão. O cronômetro ajuda a controlar o tempo e o nervosismo." },
        { question: "Quanto tempo deve durar uma apresentação?", answer: "Para treino, um a dois minutos. Em sala, apresentações costumam ter de cinco a dez minutos; comece curto e vá aumentando." },
        { question: "Funciona no projetor?", answer: "Sim. Abra a página no computador da sala, sorteie o tema e mostre o cronômetro para todos." },
      ]}
    />
  );
}
