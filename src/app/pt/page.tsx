import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { PT_CONVERSATION, PT_DEBATE, PT_QOTD } from "@/data/portugueseTopics";
import { PT_SIBLINGS, ptCopy } from "@/data/ptPageCopy";
import { hreflangAlternates } from "@/i18n/config";

const path = "/pt";

// Home deck: a spread of the conversation, debate and question-of-the-day
// decks already used by the inner /pt pages, so the first screen works at once.
const prefixed = (groups: typeof PT_CONVERSATION, prefix: string) => groups.map((g) => ({ ...g, id: `${prefix}-${g.id}` }));
const GROUPS = [...prefixed(PT_CONVERSATION, "conversa"), ...prefixed(PT_DEBATE, "debate"), ...prefixed(PT_QOTD, "pergunta")];
const COUNT = GROUPS.reduce((n, g) => n + g.topics.length, 0);

export const metadata: Metadata = {
  title: { absolute: "Gerador de Temas Aleatórios: Sorteie um Tema Grátis | Random Topics" },
  description: `Gerador de temas aleatórios em português: sorteie um assunto para conversar, debater, escrever ou apresentar. ${COUNT} temas por categoria, sem repetir. Grátis e sem cadastro.`,
  alternates: { canonical: path, languages: hreflangAlternates("/") },
};

export default function PtHomePage() {
  return (
    <LocaleToolPage
      path={path}
      groups={GROUPS}
      englishHref="/"
      title="Gerador de Temas Aleatórios"
      lead={`Aperte o botão e receba um tema na hora. São ${COUNT} temas em português para puxar conversa, abrir um debate, treinar uma apresentação ou escrever uma redação — escolha a categoria ou sorteie de tudo um pouco.`}
      buttonLabel="Sortear tema"
      copy={ptCopy("Random Topic Generator", "Sortear tema")}
      siblings={PT_SIBLINGS}
      howTo={[
        "Escolha uma categoria (conversa, debate ou pergunta do dia) ou deixe em «Todos».",
        "Aperte «Sortear tema»: o tema aparece no cartão.",
        "Não gostou? Sorteie de novo; nada se repete até acabar a lista.",
        "Use «Copiar» para mandar o tema para o grupo ou abra uma das páginas abaixo para temas mais específicos.",
      ]}
      faq={[
        { question: "O que é um gerador de temas aleatórios?", answer: "É uma ferramenta que sorteia um tema de uma lista pronta com um clique. Serve para quando você precisa de assunto para conversar, de um tema de debate, redação ou apresentação e não sabe por onde começar." },
        { question: "Os temas se repetem?", answer: "Não. O gerador embaralha a lista e só repete um tema depois de mostrar todos da categoria escolhida." },
        { question: "Posso usar na sala de aula?", answer: "Sim. Os temas de debate e as perguntas do dia funcionam bem para aquecer a turma. Projete a página e deixe os alunos sortearem." },
        { question: "Precisa de cadastro ou pagamento?", answer: "Não. É grátis, sem cadastro, e funciona no celular e no computador." },
      ]}
    />
  );
}
