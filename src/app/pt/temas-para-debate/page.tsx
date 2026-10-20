import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { PT_DEBATE } from "@/data/portugueseTopics";
import { PT_SIBLINGS, ptCopy } from "@/data/ptPageCopy";
import { hreflangAlternates } from "@/i18n/config";

const path = "/pt/temas-para-debate";
const COUNT = PT_DEBATE.reduce((n, g) => n + g.topics.length, 0);

export const metadata: Metadata = {
  title: { absolute: `Temas para Debate: ${COUNT} Temas Polêmicos para a Sala de Aula (2026)` },
  description: `${COUNT} temas para debate em português: educação, tecnologia, sociedade, meio ambiente, saúde e temas divertidos. Sorteie uma moção para a aula ou o clube de debate. Grátis.`,
  alternates: { canonical: path, languages: hreflangAlternates("/debate") },
};

export default function PtDebatePage() {
  return (
    <LocaleToolPage
      path={path}
      groups={PT_DEBATE}
      englishHref="/debate"
      title="Temas para Debate"
      lead={`Sorteie uma moção entre ${COUNT} temas para debate em português, prontos para a sala de aula, o clube de debate ou a preparação para a redação do ENEM: educação, tecnologia, sociedade, meio ambiente, saúde e até temas divertidos para aquecer.`}
      buttonLabel="Sortear tema"
      copy={ptCopy("Debate Topic Generator", "Sortear tema")}
      siblings={PT_SIBLINGS}
      howTo={[
        "Escolha uma área ou deixe em «Todos».",
        "Aperte «Sortear tema» e leia a moção em voz alta.",
        "Divida a turma em a favor e contra; dê 5 minutos de preparação.",
        "Cada lado fala 2 minutos, depois há réplica e votação.",
      ]}
      faq={[
        { question: "Quais são bons temas para debate na escola?", answer: "Temas próximos da realidade dos alunos funcionam melhor: celular na escola, lição de casa, redes sociais, IA nos trabalhos. Eles têm argumentos claros dos dois lados." },
        { question: "Esses temas servem para a redação do ENEM?", answer: "Sim. Muitos temas de sociedade, tecnologia e meio ambiente são próximos dos que aparecem em redações e permitem treinar argumentação e proposta de intervenção." },
        { question: "Como organizar um debate em sala?", answer: "Sorteie o tema, divida em dois grupos, dê tempo de preparação e defina tempos de fala iguais. Termine com votação ou um juiz que avalia argumentos, não opiniões." },
        { question: "É grátis?", answer: "Sim, é grátis, funciona no celular e no projetor e não precisa de cadastro." },
      ]}
    />
  );
}
