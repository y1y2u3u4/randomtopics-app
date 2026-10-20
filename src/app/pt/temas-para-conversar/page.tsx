import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { PT_CONVERSATION } from "@/data/portugueseTopics";
import { PT_SIBLINGS, ptCopy } from "@/data/ptPageCopy";
import { hreflangAlternates } from "@/i18n/config";

const path = "/pt/temas-para-conversar";
const COUNT = PT_CONVERSATION.reduce((n, g) => n + g.topics.length, 0);

export const metadata: Metadata = {
  title: { absolute: `Assuntos para Conversar: ${COUNT} Temas e Perguntas (2026)` },
  description: `Assuntos para conversar com amigos, crush, colegas ou família: ${COUNT} temas e perguntas por categoria. Sorteie um tema, nada se repete. Grátis e sem cadastro.`,
  alternates: { canonical: path, languages: hreflangAlternates("/conversation") },
};

export default function PtConversationPage() {
  return (
    <LocaleToolPage
      path={path}
      groups={PT_CONVERSATION}
      englishHref="/conversation"
      title="Assuntos para Conversar"
      lead={`Sem assunto? Sorteie um entre ${COUNT} temas e perguntas em português — leves, pessoais, viagens, hipotéticos e profundos — para puxar papo com amigos, colegas, família ou aquela pessoa especial.`}
      buttonLabel="Sortear assunto"
      copy={ptCopy("Conversation Starters", "Sortear assunto")}
      siblings={PT_SIBLINGS}
      howTo={[
        "Escolha uma categoria ou deixe em «Todos».",
        "Aperte «Sortear assunto»: a pergunta aparece no cartão.",
        "Responda você primeiro — isso deixa a outra pessoa à vontade.",
        "Sorteie de novo quando a conversa esfriar; nada se repete até o fim.",
      ]}
      faq={[
        { question: "Qual é um bom assunto para puxar conversa?", answer: "Perguntas abertas sobre coisas do dia a dia funcionam melhor: comida favorita, viagens, séries, planos para o fim de semana. Elas são fáceis de responder e abrem espaço para histórias." },
        { question: "Que assuntos conversar com o crush?", answer: "Comece pelos leves e pelos «E se…?» — são divertidos e revelam muito sem pressão. Deixe os profundos para quando a conversa já estiver fluindo." },
        { question: "Funciona para conversa por WhatsApp?", answer: "Sim. Aperte «Copiar» e cole a pergunta na conversa. Funciona no celular, sem baixar nada." },
        { question: "Os temas se repetem?", answer: "Não. O gerador embaralha as perguntas e só repete depois de mostrar todas." },
      ]}
    />
  );
}
