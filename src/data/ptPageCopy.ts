import type { LocalePageCopy } from "@/components/LocaleToolPage";

// Shared Brazilian Portuguese chrome for the standalone /pt pages (2026-10-21).
export function ptCopy(englishLabel: string, buttonLabel: string, listHeading = "Lista completa"): LocalePageCopy {
  return {
    lang: "pt-BR",
    currency: "BRL",
    homeHref: "/pt",
    homeLabel: "Início",
    meta: "Grátis · sem cadastro · {n} opções · atualizado em outubro de 2026",
    siblingsHeading: "Mais geradores em português",
    howToHeading: "Como usar",
    listHeading,
    faqHeading: "Perguntas frequentes",
    englishNote: "Versão em inglês:",
    englishLabel,
    ui: {
      chooseCategory: "Escolher categoria",
      all: "Todos",
      spinning: "Girando…",
      prompt: "Aperte o botão para sortear.",
      timeUp: "Tempo esgotado!",
      spin: "Girar a roleta",
      startTimer: "Começar 1 minuto",
      restartTimer: "Reiniciar tempo",
      copied: "Copiado ✓",
      copy: "Copiar",
      topicsWord: "opções",
      shownWord: "vistas",
      noRepeat: "sem repetir até acabar",
      defaultButton: buttonLabel,
    },
  };
}

export const PT_SIBLINGS = [
  { href: "/pt", label: "Gerador de temas aleatórios", detail: "Um tema na hora, para qualquer ocasião" },
  { href: "/pt/temas-para-conversar", label: "Assuntos para conversar", detail: "Puxar papo sem silêncio" },
  { href: "/pt/temas-para-debate", label: "Temas para debate", detail: "Polêmicas para a sala de aula" },
  { href: "/pt/temas-para-apresentacao", label: "Temas para apresentação", detail: "Com cronômetro de 1 minuto" },
  { href: "/pt/pergunta-do-dia", label: "Pergunta do dia", detail: "Uma pergunta nova todo dia" },
  { href: "/pt/gerador-de-materias-aleatorias", label: "Gerador de matérias", detail: "Sorteie o que estudar" },
  { href: "/pt/roleta-de-temas", label: "Roleta de temas", detail: "Gire e descubra o tema" },
  { href: "/pt/perguntas-engracadas", label: "Perguntas engraçadas", detail: "Para rir em grupo" },
  { href: "/pt/voce-prefere", label: "Você prefere?", detail: "Dilemas para escolher um lado" },
];
