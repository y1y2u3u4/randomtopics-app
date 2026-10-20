import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { PT_SUBJECTS } from "@/data/portugueseTopics";
import { PT_SIBLINGS, ptCopy } from "@/data/ptPageCopy";
import { hreflangAlternates } from "@/i18n/config";

const path = "/pt/gerador-de-materias-aleatorias";
const COUNT = PT_SUBJECTS.reduce((n, g) => n + g.topics.length, 0);

export const metadata: Metadata = {
  title: { absolute: `Gerador de Matérias Aleatórias: Sorteie entre 16 Matérias (2026)` },
  description: `Gerador de matérias aleatórias: sorteie entre 16 matérias escolares, cada uma com um tema concreto para estudar, revisar ou apresentar. Grátis e sem cadastro.`,
  alternates: { canonical: path, languages: hreflangAlternates("/random-subject-generator") },
};

export default function PtSubjectPage() {
  return (
    <LocaleToolPage
      path={path}
      groups={PT_SUBJECTS}
      englishHref="/random-subject-generator"
      title="Gerador de Matérias Aleatórias"
      lead={`Não sabe o que estudar hoje? Sorteie uma entre 16 matérias escolares, cada uma com um tema concreto — de Matemática a Filosofia — para estudar, revisar para a prova ou preparar um seminário.`}
      buttonLabel="Sortear matéria"
      copy={ptCopy("Random Subject Generator", "Sortear matéria")}
      siblings={PT_SIBLINGS}
      howTo={[
        "Escolha uma matéria específica ou deixe em «Todos».",
        "Aperte «Sortear matéria»: aparece a matéria com um tema.",
        "Estude o tema por 25 minutos e faça uma pausa.",
        "Sorteie de novo para a próxima sessão; nada se repete.",
      ]}
      faq={[
        { question: "Para que serve um gerador de matérias aleatórias?", answer: "Para acabar com a indecisão: qual matéria revisar hoje, que tema apresentar ou quem fica com cada parte de um trabalho em grupo. O sorteio evita discussões e a procrastinação." },
        { question: "Quais matérias estão incluídas?", answer: "Matemática, Língua Portuguesa, Literatura, História, Geografia, Biologia, Química, Física, Ciências, Inglês, Filosofia, Sociologia, Artes, Música, Educação Física e Tecnologia — com temas do ensino fundamental e médio." },
        { question: "Serve para estudar para o ENEM?", answer: "Sim. Os temas cobrem conteúdos clássicos do ensino médio; sortear ajuda a revisar várias áreas sem ficar só nas favoritas." },
        { question: "É grátis?", answer: "Sim, é grátis, funciona no celular e não precisa de cadastro." },
      ]}
    />
  );
}
