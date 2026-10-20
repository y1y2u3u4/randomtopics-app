import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { PT_QOTD } from "@/data/portugueseTopics";
import { PT_SIBLINGS, ptCopy } from "@/data/ptPageCopy";
import { hreflangAlternates } from "@/i18n/config";

const path = "/pt/pergunta-do-dia";
const COUNT = PT_QOTD.reduce((n, g) => n + g.topics.length, 0);

export const metadata: Metadata = {
  title: { absolute: `Pergunta do Dia: ${COUNT} Perguntas para Turma e Equipe (2026)` },
  description: `Pergunta do dia em português: ${COUNT} perguntas leves, reflexivas, para a sala de aula, para a equipe e «isso ou aquilo». Sorteie a de hoje e copie para o grupo. Grátis.`,
  alternates: { canonical: path, languages: hreflangAlternates("/question-of-the-day") },
};

export default function PtQotdPage() {
  return (
    <LocaleToolPage
      path={path}
      groups={PT_QOTD}
      englishHref="/question-of-the-day"
      title="Pergunta do Dia"
      lead={`Comece a aula, a reunião ou o grupo da família com uma pergunta do dia. São ${COUNT} perguntas em português — leves, para refletir, para a turma, para a equipe e «isso ou aquilo» — sem repetir até acabar.`}
      buttonLabel="Sortear pergunta"
      copy={ptCopy("Question of the Day", "Sortear pergunta")}
      siblings={PT_SIBLINGS}
      howTo={[
        "Escolha o público: turma, equipe, reflexão ou leves.",
        "Aperte «Sortear pergunta» e leia em voz alta ou copie para o grupo.",
        "Dê um minuto para todos pensarem antes de responder.",
        "Amanhã, sorteie outra; a página lembra quais já saíram.",
      ]}
      faq={[
        { question: "O que é a pergunta do dia?", answer: "É uma pergunta curta feita no começo da aula, da reunião ou no grupo de mensagens para todo mundo responder. Ajuda a quebrar o gelo e a conhecer melhor as pessoas." },
        { question: "Como usar a pergunta do dia na sala de aula?", answer: "Escreva a pergunta no quadro na chegada dos alunos ou faça uma roda rápida de respostas de 5 minutos. As perguntas da categoria «Para a sala de aula» foram pensadas para isso." },
        { question: "Serve para reuniões de trabalho?", answer: "Sim. A categoria «Para a equipe» tem perguntas leves e profissionais para abrir reuniões e dailies." },
        { question: "É grátis?", answer: "Sim, é grátis e funciona no celular, sem cadastro." },
      ]}
    />
  );
}
