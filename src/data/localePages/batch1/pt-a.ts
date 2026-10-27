import type { LocalePageConfig } from "../types";

export const PT_A: LocalePageConfig[] = [
  {
    path: "/pt/roleta-de-temas",
    enPath: "/spin-the-wheel",
    englishLabel: "Spin the Wheel",
    metaTitle: "Roleta de Temas: {n} Assuntos e Desafios para Girar (Grátis)",
    description:
      "Roleta de temas online e grátis: gire e receba um de {n} assuntos para conversar, desafios, temas de debate e curiosidades. Ótima para rodas de amigos e aulas.",
    title: "Roleta de temas aleatória",
    lead: "Gire a roleta de temas e deixe a sorte escolher o próximo assunto, desafio ou debate. Serve para rodinha de amigos, sala de aula, live e aquele momento em que a conversa trava.",
    buttonLabel: "Girar a roleta",
    mode: "wheel",
    sibling: { label: "Roleta de temas", detail: "Gire e receba um assunto", emoji: "🎡" },
    groups: [
      {
        id: "conversa",
        label: "Conversa",
        topics: [
          "O melhor lanche de padaria que existe",
          "A música que você sabe cantar inteira sem errar",
          "Uma viagem que você ainda quer fazer no Brasil",
          "O app do celular que você mais usa e por quê",
          "A coisa mais engraçada que já aconteceu na sua escola",
          "Qual é o seu pedido fixo no delivery",
          "O melhor churrasco ou almoço de família que você já viveu",
          "Um filme ou série que você assistiria de novo hoje",
          "O apelido mais inusitado que já te deram",
          "A lembrança de infância que mais cheira a saudade",
          "O dia em que você chegou atrasado e inventou uma desculpa épica",
          "Qual novela marcou a sua família",
          "O que você faz num domingo perfeito",
          "Uma habilidade inútil que você tem",
          "O sonho mais estranho de que você se lembra"
        ]
      },
      {
        id: "desafios",
        label: "Desafios rápidos",
        topics: [
          "Fale por 30 segundos sem usar a palavra \"tipo\"",
          "Imite a voz de um locutor de futebol narrando a sua última refeição",
          "Cite 5 marcas de biscoito em 10 segundos",
          "Conte uma história de 1 minuto usando as palavras banana, chuva e ônibus",
          "Vá de A a Z dizendo uma fruta para cada letra",
          "Desenhe com o dedo no ar um animal e deixe a turma adivinhar",
          "Faça uma propaganda de 20 segundos para uma caneta",
          "Cante o refrão de uma música sem fazer som, só com a boca",
          "Diga três coisas boas sobre a pessoa à sua direita",
          "Descreva o seu dia usando só emojis falados (sem dizer as palavras)",
          "Fale como se estivesse dando a notícia no Jornal Nacional",
          "Invente um slogan para a sua cidade em 15 segundos",
          "Explique como se faz brigadeiro sem usar as mãos",
          "Dê três motivos para o seu time ser o melhor, mesmo que não seja"
        ]
      },
      {
        id: "debate",
        label: "Debate leve",
        topics: [
          "Farofa no churrasco: essencial ou opcional?",
          "Pão de queijo é lanche ou café da manhã?",
          "Celular na mesa durante a refeição: pode ou não pode?",
          "Aula de manhã ou à tarde: qual rende mais?",
          "Praia ou campo para as férias?",
          "Mensagem de áudio no WhatsApp: prático ou irritante?",
          "Uniforme escolar: ajuda ou atrapalha?",
          "Férias longas ou vários feriadões?",
          "Ouvir música alto no ônibus: tudo bem?",
          "Trabalhar em casa ou no escritório?",
          "Verão ou inverno: qual estação ganha?",
          "Estudar em grupo funciona de verdade?"
        ]
      },
      {
        id: "curiosidades",
        label: "Curiosidades",
        topics: [
          "Por que o céu fica laranja no fim da tarde?",
          "Como as abelhas sabem voltar para a colmeia?",
          "De onde vem a expressão \"quebrar o gelo\"?",
          "Por que o Brasil tem tantos feriados?",
          "Como nasceu o futebol e como ele chegou ao Brasil?",
          "Por que bocejar é contagioso?",
          "O que torna o café brasileiro tão famoso no mundo?",
          "Como funciona um eclipse solar?",
          "Por que a gente tem soluço?",
          "Qual é o animal mais rápido do Brasil?",
          "De onde veio o carnaval e por que ele é tão grande aqui?",
          "Como os golfinhos dormem sem se afogar?"
        ]
      },
      {
        id: "criatividade",
        label: "Criatividade",
        topics: [
          "Invente um superpoder inútil e explique quando ele ajuda",
          "Crie o nome de uma banda de pagode formada por animais",
          "Se o seu bairro virasse um filme, qual seria o título?",
          "Invente uma regra nova para o futebol",
          "Descreva um sabor de sorvete que ainda não existe",
          "Crie uma gíria nova e use numa frase",
          "Imagine o app que resolveria o seu maior problema do dia a dia",
          "Monte o cardápio de uma lanchonete em Marte"
        ]
      }
    ],
    howTo: [
      "Toque em \"Girar a roleta\" e espere ela parar em um tema.",
      "Escolha uma categoria nos botões acima se quiser só conversa, desafio, debate ou curiosidade.",
      "Leia o tema em voz alta para o grupo e deem um tempo, por exemplo 1 a 2 minutos por resposta.",
      "Não gostou do resultado? Gire de novo, ou copie o tema e mande no grupo do WhatsApp."
    ],
    faq: [
      {
        question: "Como usar a roleta de temas numa roda de amigos?",
        answer:
          "Deixe a tela visível para todos e gire uma vez por pessoa. Quem recebe o tema fala por cerca de um minuto, e os outros podem complementar ou discordar. Se travar, gire de novo sem culpa."
      },
      {
        question: "A roleta de temas serve para sala de aula?",
        answer:
          "Sim. Professores usam para aquecer a turma, sortear quem fala primeiro ou propor um debate curto. Escolha as categorias de curiosidades ou debate leve para manter o foco no conteúdo."
      },
      {
        question: "Os temas se repetem quando eu giro várias vezes?",
        answer:
          "Como o sorteio é aleatório, um tema pode voltar de vez em quando, principalmente em sessões longas. Trocar de categoria ou girar mais algumas vezes costuma resolver."
      },
      {
        question: "Posso usar a roleta aleatória em uma live ou vídeo?",
        answer:
          "Pode. Compartilhe a tela, gire ao vivo e peça sugestões no chat para cada tema. É uma ótima forma de manter o ritmo e envolver quem está assistindo."
      },
      {
        question: "Como transformar a roleta em um jogo com pontos?",
        answer:
          "Combine que cada tema cumprido vale um ponto e que desafios rápidos valem dois. Quem chegar primeiro a dez pontos ganha. Dê um tempo fixo para cada resposta para o jogo não se arrastar."
      }
    ]
  },
  {
    path: "/pt/dilemas-eticos",
    enPath: "/topics/ethical-dilemma-questions",
    englishLabel: "Ethical Dilemma Questions",
    metaTitle: "Dilemas Éticos: {n} Exemplos para Debater em Aula e Grupo",
    description:
      "Dilemas éticos e morais para debater: {n} exemplos com contexto curto sobre saúde, trabalho, tecnologia, amizade e sociedade. Sorteie um e discuta com a turma.",
    title: "Dilemas éticos para debater",
    lead: "Cada dilema traz uma situação curta em que não existe resposta fácil. Use em aulas de filosofia e sociologia, redação, rodas de conversa ou para treinar argumentação com amigos.",
    buttonLabel: "Sortear dilema",
    sibling: { label: "Dilemas éticos", detail: "Situações sem resposta fácil", emoji: "⚖️" },
    groups: [
      {
        id: "vida-saude",
        label: "Vida e saúde",
        topics: [
          "Um hospital tem um único respirador e dois pacientes graves. Um é um senhor de 80 anos, o outro, um jovem. Quem deve recebê-lo e com que critério?",
          "Seu melhor amigo pediu segredo sobre uma doença grave, mas a família dele está planejando uma viagem arriscada. Você conta ou guarda o segredo?",
          "Um remédio caro salva vidas, mas só quem pode pagar tem acesso. É justo que o preço seja definido apenas pela empresa?",
          "Uma pessoa recusa uma transfusão por motivos religiosos e corre risco de morte. O médico deve respeitar a decisão?",
          "Você descobre que um parente próximo tem doença genética. Vale avisar os outros parentes, mesmo que ele não queira?",
          "Um estudante consegue vaga na universidade em curso de saúde, mas sabe que não tem paciência com pessoas. Deve desistir?",
          "Um motorista de aplicativo percebe que a passageira passa mal no banco de trás, mas isso vai cancelar a corrida e prejudicar a avaliação dele. O que ele faz?",
          "Uma família pode usar o dinheiro da casa própria para um tratamento incerto no exterior. Vale o risco?"
        ]
      },
      {
        id: "trabalho",
        label: "Trabalho e dinheiro",
        topics: [
          "Você nota que o seu chefe está arredondando números do relatório para cima. Todo mundo se beneficia com o bônus. Você denuncia?",
          "Um colega novo comete um erro grave e você poderia corrigir sem ninguém saber. Isso o ajuda ou o impede de aprender?",
          "Você recebe uma proposta melhor, mas aceitar significa deixar a equipe em apuros num projeto importante. Você fica ou vai?",
          "Uma loja pequena do bairro pode sobreviver contratando sem registro. Fechar as portas seria melhor?",
          "O caixa devolve troco a mais para você e ninguém viu. Você devolve?",
          "Você encontra uma carteira com dinheiro e documentos. Quanto vale a recompensa que a pessoa promete, se é que deve existir?",
          "Uma empresa descobre que um funcionário muito querido espalhou segredos para a concorrência. Demitir ou dar outra chance?",
          "Um gerente tem que cortar uma vaga e escolher entre quem é mais produtivo e quem tem mais tempo de casa e família grande para sustentar. Como decidir?"
        ]
      },
      {
        id: "tecnologia",
        label: "Tecnologia e internet",
        topics: [
          "Seu filho de 12 anos insiste em ter rede social. Monitorar as mensagens dele protege ou invade a privacidade?",
          "Um app de IA escreve redações prontas. Um aluno usa só para ter ideias, outro copia tudo. Onde fica a linha?",
          "Você acha no celular emprestado uma conversa que mostra um crime. Você tem o direito de usá-la?",
          "Um carro autônomo precisa escolher entre desviar e atingir um pedestre ou seguir e machucar o passageiro. Quem programa essa decisão?",
          "Um print de conversa privada viraliza e expõe uma pessoa injustamente. Compartilhar é errado mesmo que seja verdade?",
          "Uma câmera de reconhecimento facial reduz roubos na rua, mas registra todo mundo. Vale a troca por segurança?",
          "Você descobre um erro no sistema da escola que permite alterar notas. Você avisa ou testa só para ver?",
          "Um influenciador faz propaganda de um produto que ele não usa. Os seguidores confiam nele. Isso é só trabalho ou é enganação?"
        ]
      },
      {
        id: "amizade-familia",
        label: "Amizade e família",
        topics: [
          "Você viu o namorado da sua melhor amiga com outra pessoa. Conta imediatamente, espera ter certeza ou fica quieto?",
          "Seu irmão pegou dinheiro da sua mãe sem pedir. Ela suspeita de outra pessoa. O que você faz?",
          "Um amigo te pede para dizer à professora que ele estava com você, e não estava. Vale mentir por ele?",
          "Seus pais estão se separando e pedem que você escolha com quem morar. É justo esperar isso de um adolescente?",
          "Você é convidado para duas festas no mesmo dia: o aniversário de um amigo antigo e uma festa que pode mudar sua turma. Qual escolher?",
          "Sua avó, com Alzheimer, pergunta sempre pelo marido que já morreu. Você diz a verdade ou entra no mundo dela?",
          "Seu melhor amigo vai prestar o mesmo concurso que você e só uma vaga está aberta. Você divulga seus macetes de estudo para ele?",
          "Um amigo vai fazer uma tatuagem de nome de namorado com 17 anos. Você aconselha ou deixa quieto?"
        ]
      },
      {
        id: "sociedade",
        label: "Sociedade e meio ambiente",
        topics: [
          "Uma fábrica gera mil empregos na cidade, mas polui o rio que abastece os moradores. Ela deve continuar funcionando?",
          "Você vê alguém passar à frente na fila do posto de saúde dizendo que está com pressa. Você interfere?",
          "Uma pessoa dirige sem habilitação para levar o filho doente ao hospital. Merece ser punida?",
          "O governo pode limitar a venda de comida ultraprocessada para reduzir doenças? Até onde vai a liberdade individual?",
          "Um grupo de moradores ocupa um terreno abandonado para morar. O dono tem direito de retirá-los?",
          "É certo que uma cidade proíba fogos de artifício com barulho por causa dos animais e das pessoas autistas, mesmo que seja tradição?",
          "Um turista deixa lixo em uma praia paradisíaca e você vê. Você chama a atenção dele?",
          "Se uma única pessoa rica doasse metade da fortuna para a educação, isso resolveria o problema ou só adiaria uma solução do Estado?"
        ]
      },
      {
        id: "escola",
        label: "Escola e estudos",
        topics: [
          "Você descobre que a sala toda combinou \"colar\" na prova. Se denunciar, a turma vai te evitar. O que você faz?",
          "O professor erra a correção e te dá um ponto a mais. Você avisa?",
          "Seu colega de grupo não fez nada no trabalho, mas vai tirar a mesma nota. Você reclama ou deixa passar?",
          "Para entrar numa faculdade pública, um aluno usa o endereço de um parente. Isso é esperteza ou fraude?",
          "A diretora quer proibir celulares em toda a escola, inclusive no intervalo. Os alunos têm direito de reclamar?",
          "Você vê um colega sofrendo bullying, mas o agressor é seu amigo. Você se manifesta?"
        ]
      }
    ],
    howTo: [
      "Sorteie um dilema e leia o contexto em voz alta para todo mundo.",
      "Peça que cada pessoa escolha um lado e dê pelo menos um argumento antes de ouvir os outros.",
      "Depois da primeira rodada, mude uma condição (e se fosse seu amigo? e se ninguém descobrisse?) e veja quem muda de opinião.",
      "Para redação ou prova, escreva a posição, dois argumentos e um contra-argumento que você consegue rebater."
    ],
    faq: [
      {
        question: "O que é um dilema ético?",
        answer:
          "É uma situação em que duas ou mais escolhas têm razões morais válidas, mas não dá para seguir todas ao mesmo tempo. Por isso, qualquer decisão tem um custo. O objetivo é justificar bem a escolha, não achar uma resposta única."
      },
      {
        question: "Qual a diferença entre dilema ético e dilema moral?",
        answer:
          "No dia a dia, os dois termos são usados como sinônimos. Em geral, \"moral\" fala de valores pessoais ou culturais, e \"ético\" de princípios aplicados a profissões ou à sociedade, como ética médica ou jurídica."
      },
      {
        question: "Existem exemplos de dilemas éticos para usar em sala de aula?",
        answer:
          "Sim. Os dilemas acima trazem contexto curto e servem para aulas de filosofia, sociologia e redação. Peça que a turma se divida em lados e depois escreva um parágrafo defendendo a posição contrária."
      },
      {
        question: "Existe resposta certa em um dilema ético?",
        answer:
          "Normalmente não. O que se avalia é a qualidade do raciocínio: princípios claros, consequências consideradas e coerência. Mudar de ideia depois de ouvir um bom argumento também é sinal de maturidade."
      },
      {
        question: "Como argumentar bem em um debate sobre dilemas morais?",
        answer:
          "Comece pela decisão, explique o motivo principal e cite quem seria afetado. Depois, reconheça o melhor argumento do outro lado. Isso mostra segurança e costuma convencer mais do que levantar o tom de voz."
      }
    ]
  },
  {
    path: "/pt/palavras-para-mimica",
    enPath: "/charades",
    englishLabel: "Charades Generator",
    metaTitle: "Palavras para Mímica: {n} Ideias para Jogar em Grupo",
    description:
      "Palavras para mímica prontas para jogar em grupo: {n} ideias de filmes, novelas, animais, profissões, ações, músicas brasileiras e esportes. Sorteie e atue!",
    title: "Palavras para mímica",
    lead: "Sorteie uma palavra, represente sem falar e deixe o grupo adivinhar. Com filmes, novelas, artistas e esportes que todo brasileiro conhece, é um jogo para festa, família e sala de aula.",
    buttonLabel: "Sortear palavra",
    sibling: { label: "Palavras para mímica", detail: "Atue sem falar e adivinhem", emoji: "🎭" },
    groups: [
      {
        id: "filmes-series",
        label: "Filmes e séries",
        topics: [
          "Homem-Aranha",
          "Tropa de Elite",
          "Cidade de Deus",
          "Procurando Nemo",
          "O Rei Leão",
          "Os Vingadores",
          "Harry Potter",
          "Titanic",
          "Frozen",
          "Turma da Mônica",
          "Chaves",
          "Round 6",
          "Stranger Things",
          "Ainda Estou Aqui",
          "Shrek",
          "Toy Story"
        ]
      },
      {
        id: "novelas-tv",
        label: "Novelas e TV",
        topics: [
          "Avenida Brasil",
          "Carrossel",
          "Sítio do Picapau Amarelo",
          "Pantanal",
          "Big Brother Brasil",
          "Programa do Faustão",
          "Chaves e Chiquinha",
          "Mulheres de Areia",
          "Jornal Nacional",
          "Roda a Roda Jequiti",
          "Domingão",
          "Malhação"
        ]
      },
      {
        id: "animais",
        label: "Animais",
        topics: [
          "Preguiça",
          "Tucano",
          "Onça-pintada",
          "Capivara",
          "Tamanduá",
          "Arara-azul",
          "Cavalo-marinho",
          "Tatu-bola",
          "Pinguim",
          "Camaleão",
          "Macaco-prego",
          "Jacaré"
        ]
      },
      {
        id: "profissoes",
        label: "Profissões",
        topics: [
          "Motoboy",
          "Cabeleireira",
          "Pedreiro",
          "Professor",
          "Padeiro",
          "Garçom",
          "Médica",
          "Dentista",
          "Jogador de futebol",
          "Caminhoneiro",
          "Youtuber",
          "Bombeiro"
        ]
      },
      {
        id: "acoes",
        label: "Ações e situações",
        topics: [
          "Esperar o ônibus lotado",
          "Descascar um abacaxi",
          "Tentar acordar de manhã",
          "Fazer fila no banco",
          "Pegar um mosquito no escuro",
          "Dançar forró",
          "Tomar café quente demais",
          "Lavar a louça",
          "Fazer um bolo e queimar",
          "Procurar o celular que está na mão",
          "Dar um mergulho no mar gelado",
          "Falar com a sogra ao telefone"
        ]
      },
      {
        id: "musicas-esportes",
        label: "Músicas, artistas e esportes",
        topics: [
          "Anitta",
          "Gilberto Gil",
          "Ivete Sangalo",
          "Pelé",
          "Neymar",
          "Marta",
          "Vôlei de praia",
          "Capoeira",
          "Surfe",
          "Futevôlei",
          "Garota de Ipanema",
          "Ai se eu te pego",
          "Evidências",
          "Asa Branca"
        ]
      }
    ],
    howTo: [
      "Divida o grupo em duas equipes e escolham quem começa a representar.",
      "Sorteie uma palavra e mostre apenas para quem vai atuar. Nada de falar, apontar para objetos ou fazer sons.",
      "Marque 1 minuto no cronômetro. Se a equipe acertar, ganha um ponto; se não, a outra equipe pode tentar roubar.",
      "Alterne os atores e use as categorias para ajustar a dificuldade: ações e profissões para crianças, filmes e músicas para adultos."
    ],
    faq: [
      {
        question: "Como jogar mímica em grupo?",
        answer:
          "Uma pessoa recebe a palavra e representa sem falar, enquanto o grupo tenta adivinhar. Combinem um tempo fixo, por exemplo 1 minuto, e alternem as equipes. Vence quem somar mais acertos ao final das rodadas."
      },
      {
        question: "Quais são boas palavras para mímica com crianças?",
        answer:
          "Prefira animais, ações do dia a dia e personagens de desenho animado. Evite títulos longos e profissões muito abstratas. Aos poucos, vá aumentando a dificuldade com filmes e músicas."
      },
      {
        question: "Dá para jogar mímica sem preparar nada antes?",
        answer:
          "Dá. É só abrir esta página, sortear uma palavra no celular e mostrar apenas para o ator. Não precisa de papel, caneta ou baralho, o que é ótimo para festas e viagens."
      },
      {
        question: "Quais regras tornam a mímica mais justa?",
        answer:
          "Proibir falar, apontar para objetos da sala e escrever no ar. Permitir gestos de \"quantas palavras\" e \"quantas sílabas\". Trocar de palavra só uma vez por rodada ajuda a manter o jogo rápido."
      },
      {
        question: "Posso usar a mímica em sala de aula?",
        answer:
          "Sim, funciona bem para revisar vocabulário, profissões, verbos e personagens de livros. Peça para os alunos criarem as próprias palavras depois de jogar uma rodada para treinar leitura e escrita."
      }
    ]
  },
  {
    path: "/pt/temas-para-discurso-improvisado",
    enPath: "/impromptu-speech-topics",
    englishLabel: "Impromptu Speech Topics",
    metaTitle: "Temas para Discurso Improvisado: {n} Assuntos com Timer",
    description:
      "Temas para discurso improvisado e treino de oratória: {n} assuntos para falar em público com timer de 1 minuto. Sorteie um tema e fale sem preparar.",
    title: "Temas para discurso improvisado",
    lead: "Sorteie um tema, ligue o timer de 1 minuto e fale sem roteiro. Uma forma simples de perder o medo de falar em público, treinar oratória para o trabalho, a escola ou apresentações.",
    buttonLabel: "Sortear tema",
    mode: "timer",
    sibling: { label: "Discurso improvisado", detail: "Fale 1 minuto sem preparar", emoji: "🎤" },
    groups: [
      {
        id: "cotidiano",
        label: "Dia a dia",
        topics: [
          "Fale sobre a importância de um bom café da manhã",
          "Por que o trânsito da sua cidade testa a paciência de qualquer um?",
          "Defenda o transporte público como melhor opção para o dia a dia",
          "Fale sobre a coisa mais valiosa que você tem na mochila ou na bolsa",
          "Explique por que o domingo à noite dá aquela tristeza",
          "Descreva o que torna uma casa realmente aconchegante",
          "Fale sobre o valor de acordar cedo (ou de dormir até tarde)",
          "Por que cumprimentar os vizinhos faz diferença?",
          "Conte como você organiza o seu tempo em uma semana corrida"
        ]
      },
      {
        id: "estudo-trabalho",
        label: "Estudo e trabalho",
        topics: [
          "Fale sobre como preparar-se para o ENEM sem entrar em desespero",
          "Convença a turma de que ler vale mais do que parece",
          "Defenda o estágio como o melhor começo de carreira",
          "O que um bom líder faz que um chefe não faz?",
          "Como dar feedback sem magoar ninguém?",
          "Fale sobre o que você diria em uma entrevista de emprego sobre os seus pontos fracos",
          "Apresente-se em 1 minuto como se fosse o primeiro dia em um novo trabalho",
          "Por que errar faz parte de aprender?",
          "Explique como trabalhar em equipe quando alguém não ajuda"
        ]
      },
      {
        id: "sociedade",
        label: "Sociedade e atualidades",
        topics: [
          "O que as redes sociais mudaram na forma como conversamos?",
          "Fale sobre o valor do voluntariado na sua comunidade",
          "Defenda a importância de manter as praças limpas e cuidadas",
          "Como a inteligência artificial pode ajudar os estudantes?",
          "Fale sobre a importância da coleta seletiva em casa",
          "O que o Brasil tem de melhor para mostrar ao mundo?",
          "Por que o futebol une tantas pessoas diferentes?",
          "Explique por que a leitura de notícias exige senso crítico",
          "O que cada um pode fazer para reduzir o desperdício de comida?"
        ]
      },
      {
        id: "pessoal",
        label: "Pessoal e reflexão",
        topics: [
          "Fale sobre alguém que mudou a sua vida",
          "O melhor conselho que você já recebeu",
          "Descreva uma vez em que você teve coragem de fazer algo difícil",
          "O que significa sucesso para você?",
          "Conte sobre uma tradição de família que você quer manter",
          "Fale sobre um lugar que você chama de seu refúgio",
          "Fale sobre um erro que virou uma boa lição",
          "O que você diria ao seu eu de dez anos atrás?",
          "Por que a gratidão faz bem?"
        ]
      },
      {
        id: "criativo",
        label: "Criativos e divertidos",
        topics: [
          "Venda um guarda-chuva para quem mora no deserto",
          "Faça um discurso de posse como presidente da cantina da escola",
          "Apresente um prêmio para o melhor chinelo do Brasil",
          "Fale como se estivesse inaugurando um parque de diversões no seu bairro",
          "Defenda a criação de um feriado de cochilo nacional",
          "Faça um discurso de formatura de um robô",
          "Convença o grupo de que o pastel de feira é patrimônio nacional",
          "Narre como se fosse um documentário a rotina de um gato de casa"
        ]
      }
    ],
    howTo: [
      "Toque em \"Sortear tema\" e leia o assunto em silêncio por alguns segundos.",
      "Inicie o timer de 1 minuto e comece a falar, sem escrever nada antes.",
      "Use uma estrutura simples: abertura com uma frase forte, dois pontos principais e um fechamento curto.",
      "No fim, repita com outro tema e tente reduzir as pausas e os vícios de linguagem como \"né\" e \"tipo\"."
    ],
    faq: [
      {
        question: "Como fazer um discurso improvisado sem travar?",
        answer:
          "Respire fundo, escolha um ponto principal e fale devagar. Use a estrutura abertura, dois argumentos e fechamento. Se esquecer algo, faça uma pausa curta: a plateia entende como ênfase, não como erro."
      },
      {
        question: "Qual a melhor forma de treinar oratória sozinho?",
        answer:
          "Sorteie um tema, grave um áudio ou vídeo de 1 minuto no celular e ouça depois. Observe ritmo, volume e vícios de linguagem. Repetir esse exercício algumas vezes por semana traz melhora visível."
      },
      {
        question: "Quanto tempo deve durar um discurso improvisado?",
        answer:
          "Para treino, de 1 a 2 minutos é suficiente. Em concursos e entrevistas, costuma haver limite de tempo, então praticar com o timer ajuda a terminar no ponto certo, sem correr nem enrolar."
      },
      {
        question: "Esses temas servem para perder o medo de falar em público?",
        answer:
          "Sim. Por serem curtos e sem preparo, ajudam a se acostumar com o nervosismo. Comece falando para um amigo ou para o espelho e aos poucos aumente o público."
      },
      {
        question: "Dá para usar os temas em sala de aula ou em grupos de estudo?",
        answer:
          "Dá. O professor sorteia um tema para cada aluno, que fala por 1 minuto, e a turma dá um retorno positivo e uma sugestão. Isso exercita argumentação e escuta, também útil para o ENEM e para apresentações."
      }
    ]
  },
  {
    path: "/pt/perguntas-engracadas",
    enPath: "/funny",
    englishLabel: "Funny Topics",
    metaTitle: "Perguntas Engraçadas: {n} Ideias para Amigos e WhatsApp",
    description:
      "Perguntas engraçadas e divertidas para fazer a amigos, no WhatsApp ou na rodinha: {n} ideias criativas e sem pegadinha maldosa. Sorteie uma e comece a rir.",
    title: "Perguntas engraçadas para amigos",
    lead: "Perguntas bobas, absurdas e muito divertidas para animar a rodinha, o grupo de WhatsApp ou o intervalo. Sorteie uma, responda sem pensar demais e veja quem tem a resposta mais criativa.",
    buttonLabel: "Sortear pergunta",
    sibling: { label: "Perguntas engraçadas", detail: "Para rir com os amigos", emoji: "😂" },
    groups: [
      {
        id: "absurdas",
        label: "Absurdas",
        topics: [
          "Se os pombos pagassem aluguel, quanto custaria um ponto na praça?",
          "Qual animal seria o pior motorista de ônibus?",
          "Se você tivesse que trocar de nome com um objeto da sua casa, qual escolheria?",
          "Se a geladeira falasse, qual seria a primeira reclamação dela sobre você?",
          "Que sabor de pizza você inventaria para ser o mais polêmico do Brasil?",
          "Quem ganharia numa luta: cem patos do tamanho de um cavalo ou um cavalo do tamanho de um pato?",
          "Se o seu bairro fosse um personagem, quem seria?",
          "O que o gato da sua casa faria se pudesse usar o celular por um dia?",
          "Se existisse um Oscar da preguiça, qual seria a sua categoria?",
          "Qual o pior lugar do mundo para ficar preso num elevador com uma banda de forró?"
        ]
      },
      {
        id: "dia-a-dia",
        label: "Situações do dia a dia",
        topics: [
          "Qual foi a desculpa mais criativa que você já deu por ter chegado atrasado?",
          "Qual foi o maior mico que você já pagou em público?",
          "Qual é a sua pior habilidade para esperar na fila?",
          "Que mentira você já contou no WhatsApp para fugir de um compromisso?",
          "Qual alimento você finge gostar só para não dar trabalho?",
          "Qual foi o momento mais constrangedor que já viveu no ônibus?",
          "Qual objeto você já perdeu e achou no lugar mais óbvio?",
          "Quantas vezes por dia você abre a geladeira sem saber o que procura?",
          "Qual foi o pior presente de amigo secreto que você já recebeu?",
          "Qual foi a última coisa que você pesquisou no Google e ficou com vergonha?"
        ]
      },
      {
        id: "imaginacao",
        label: "Imaginação e hipóteses",
        topics: [
          "Se você virasse presidente por um dia, qual seria a primeira lei?",
          "Se você pudesse falar com um animal, qual escolheria e o que perguntaria?",
          "Se a sua vida virasse novela, qual seria o título e quem faria o vilão?",
          "Se você tivesse um bordão, qual seria?",
          "Se pudesse acordar com um novo talento amanhã, qual escolheria?",
          "O que você colocaria no cardápio de um restaurante que só serve comida da sua infância?",
          "Se o Brasil tivesse um novo feriado inventado por você, o que seria celebrado?",
          "Se você fosse um personagem de desenho animado, qual seria o seu bordão e a sua fraqueza?",
          "Se pudesse trocar de vida por um dia com um famoso, quem seria e o que faria primeiro?",
          "Se você tivesse que explicar o pão de queijo a um alienígena, o que diria?"
        ]
      },
      {
        id: "preferencias-bobas",
        label: "Preferências bobas",
        topics: [
          "Time chinelo ou time tênis?",
          "Cuscuz com ovo ou tapioca com queijo?",
          "Dormir de meia ou de pé descalço?",
          "Farofa ou vinagrete?",
          "Pastel de feira ou coxinha de festa?",
          "Música alta na estrada ou silêncio total?",
          "Ser sempre o primeiro a chegar ou o último a sair?",
          "Banho frio no inverno ou banho quente no verão?",
          "Ouvir áudio de 5 minutos ou ler texto enorme no WhatsApp?",
          "Rir sem parar na hora errada ou nunca mais rir na hora certa?"
        ]
      },
      {
        id: "rodinha",
        label: "Para a rodinha de amigos",
        topics: [
          "Qual é o apelido do grupo que ninguém mais quer usar?",
          "Quem do grupo seria o primeiro a se perder em uma cidade nova?",
          "Qual amigo falaria mais alto numa biblioteca?",
          "Quem ganharia um prêmio de melhor desculpa para faltar?",
          "Qual amigo sobreviveria por mais tempo numa ilha deserta e por quê?",
          "Quem do grupo seria o pior ator de novela?",
          "Qual foi a viagem mais engraçada que vocês já fizeram juntos?",
          "Quem manda os áudios mais longos do grupo?"
        ]
      }
    ],
    howTo: [
      "Sorteie uma pergunta e leia em voz alta ou mande no grupo do WhatsApp.",
      "Cada pessoa responde com a primeira ideia que vier, sem corrigir nem explicar demais.",
      "Votem na resposta mais criativa ou mais engraçada da rodada e deem um ponto.",
      "Use as categorias para ajustar o clima: absurdas para rir, rodinha para quando todos já se conhecem bem."
    ],
    faq: [
      {
        question: "Quais são boas perguntas engraçadas para fazer a amigos?",
        answer:
          "As que misturam o absurdo com o cotidiano funcionam melhor, como \"qual foi o maior mico que você já pagou?\". Dê um tempo curto para a resposta e peça um exemplo concreto, porque o detalhe é o que dá graça."
      },
      {
        question: "Dá para usar essas perguntas no grupo do WhatsApp?",
        answer:
          "Dá. Copie a pergunta, mande no grupo e peça que cada um responda em áudio curto ou texto. Para manter a conversa viva, combine uma enquete ou eleja a melhor resposta no fim do dia."
      },
      {
        question: "As perguntas engraçadas servem para quebrar o gelo?",
        answer:
          "Servem bem, principalmente em reuniões de turma ou festas. Escolha as da categoria \"Absurdas\" para quem não se conhece, pois elas não pedem nenhuma informação pessoal."
      },
      {
        question: "Como evitar que a brincadeira fique constrangedora?",
        answer:
          "Prefira perguntas sobre situações e hipóteses, e não sobre defeitos de pessoas. Combine que quem não quiser responder pode passar a vez, e nunca use as respostas para zoar alguém depois."
      },
      {
        question: "Posso usar as perguntas em festa de aniversário ou de família?",
        answer:
          "Sim, a maioria é adequada para todas as idades. Sorteie perguntas uma por vez durante o bolo ou o almoço e deixe cada convidado responder em sua vez, assim todos participam."
      }
    ]
  },
  {
    path: "/pt/voce-prefere",
    enPath: "/would-you-rather",
    englishLabel: "Would You Rather",
    metaTitle: "Você Prefere? {n} Perguntas para Jogar com Amigos e Casal",
    description:
      "Jogo você prefere com {n} perguntas: clássicos, engraçados, difíceis, para amigos e para casal. Sorteie um dilema e descubra o que cada um escolheria.",
    title: "Você prefere: perguntas para jogar",
    lead: "Duas opções, nenhuma é fácil e todo mundo precisa escolher. Jogue o você prefere com amigos, família ou no encontro a dois e descubra o lado mais surpreendente de cada pessoa.",
    buttonLabel: "Sortear pergunta",
    sibling: { label: "Você prefere", detail: "Escolha entre duas opções", emoji: "🤔" },
    groups: [
      {
        id: "classicos",
        label: "Clássicos",
        topics: [
          "Você prefere poder voar ou ficar invisível?",
          "Você prefere viver sem internet ou sem ar-condicionado?",
          "Você prefere ler mentes ou viajar no tempo?",
          "Você prefere nunca mais comer doce ou nunca mais comer salgado?",
          "Você prefere ser rico e infeliz ou pobre e feliz?",
          "Você prefere saber a data da sua morte ou a causa?",
          "Você prefere falar todos os idiomas ou tocar todos os instrumentos?",
          "Você prefere ter sempre sorte nos jogos ou no amor?",
          "Você prefere viver cem anos no passado ou cem anos no futuro?",
          "Você prefere nunca mais dormir ou nunca mais comer?"
        ]
      },
      {
        id: "engracados",
        label: "Engraçados",
        topics: [
          "Você prefere ter pés de pato ou mãos de macaco?",
          "Você prefere ser perseguido por um pombo gigante ou por uma galinha irritada?",
          "Você prefere cantar tudo o que fala ou dançar toda vez que ouvir um som?",
          "Você prefere ter o cabelo de cor diferente cada dia ou a voz de um desenho?",
          "Você prefere que todo o seu hálito cheire a chiclete ou a coxinha?",
          "Você prefere que o seu celular só toque funk ou só forró?",
          "Você prefere ter um mordomo cantor ou um gato que fala?",
          "Você prefere andar sempre de chinelo de dedo ou sempre de salto alto?",
          "Você prefere que sua sombra fale ou que seu reflexo faça caretas?",
          "Você prefere tomar banho de gelo todo dia ou de lama?"
        ]
      },
      {
        id: "dificeis",
        label: "Difíceis",
        topics: [
          "Você prefere perder todas as suas fotos ou todas as suas mensagens do celular?",
          "Você prefere esquecer o seu passado ou nunca poder planejar o futuro?",
          "Você prefere ter um emprego dos sonhos longe da família ou um emprego comum perto dela?",
          "Você prefere saber todas as verdades ou ser feliz com uma ilusão?",
          "Você prefere ter um grande amor que dure pouco ou uma amizade comum que dure a vida toda?",
          "Você prefere que todo mundo saiba o que você pensa ou saber o que todo mundo pensa de você?",
          "Você prefere abrir mão da sua casa ou da sua privacidade?",
          "Você prefere ter sucesso e ser esquecido ou ser querido sem nunca ter sucesso?",
          "Você prefere recomeçar do zero com tudo o que aprendeu ou continuar do ponto onde está?",
          "Você prefere ganhar na loteria e perder os amigos ou continuar como está?"
        ]
      },
      {
        id: "amigos",
        label: "Para amigos",
        topics: [
          "Você prefere ter que contar um segredo seu ou um segredo de um amigo?",
          "Você prefere viajar com os amigos de ônibus ou ficar em casa com todos?",
          "Você prefere que o grupo de WhatsApp nunca mais fale com você ou que todo mundo leia suas mensagens sem responder?",
          "Você prefere ser o amigo que sempre atrasa ou o que sempre apressa?",
          "Você prefere ganhar uma festa surpresa ou organizar uma?",
          "Você prefere jogar videogame o dia todo ou fazer um churrasco o dia todo?",
          "Você prefere ser o mais engraçado ou o mais inteligente da turma?",
          "Você prefere que seu melhor amigo se mude de cidade ou que você mude para uma cidade nova sem ele?",
          "Você prefere um amigo que fala toda a verdade ou um que sempre te anima?",
          "Você prefere nunca esquecer um aniversário ou nunca esquecer um nome?"
        ]
      },
      {
        id: "casal",
        label: "Para casal",
        topics: [
          "Você prefere um jantar romântico em casa ou um passeio ao ar livre?",
          "Você prefere receber um bilhete escrito à mão ou uma mensagem longa?",
          "Você prefere viajar com o seu par para um lugar caro ou conhecer vários baratos?",
          "Você prefere que seu par cozinhe mal, mas com carinho, ou peça comida sempre?",
          "Você prefere ficar uma semana sem se falar ou uma semana sem se ver?",
          "Você prefere assistir a uma série juntos todo dia ou sair uma vez por semana?",
          "Você prefere uma proposta de casamento em público ou só os dois?",
          "Você prefere que seu par seja organizado demais ou bagunceiro demais?",
          "Você prefere ganhar um presente caro ou uma experiência simples?",
          "Você prefere dividir tudo ou manter um espaço só seu?"
        ]
      },
      {
        id: "comida",
        label: "Comida e rotina",
        topics: [
          "Você prefere comer pizza todo dia ou feijoada toda semana?",
          "Você prefere nunca mais tomar café ou nunca mais tomar refrigerante?",
          "Você prefere comer arroz sem feijão ou feijão sem arroz?",
          "Você prefere cozinhar todos os dias ou lavar louça todos os dias?",
          "Você prefere dormir tarde e acordar tarde ou dormir cedo e acordar cedo?",
          "Você prefere acordar às 5h todos os dias ou ir dormir às 3h todos os dias?"
        ]
      }
    ],
    howTo: [
      "Sorteie uma pergunta e leia as duas opções em voz alta.",
      "Todo mundo escolhe ao mesmo tempo, apontando ou levantando a mão, para ninguém copiar o amigo.",
      "Peça que cada um explique o motivo em uma frase. É nessa explicação que o jogo fica interessante.",
      "Mantenha uma pontuação: quem pensou diferente da maioria ganha um ponto de \"mais original\"."
    ],
    faq: [
      {
        question: "Como jogar você prefere?",
        answer:
          "Alguém lê uma pergunta com duas opções e cada pessoa escolhe a sua. Depois, todos explicam o motivo. Não existe resposta certa, o divertido é justificar e ouvir os argumentos dos outros."
      },
      {
        question: "Quais são boas perguntas de você prefere para casal?",
        answer:
          "Perguntas sobre viagens, rotinas e demonstrações de carinho funcionam bem, pois mostram preferências sem criar discussão. Evite as de ciúme ou de ex, e use a categoria \"Para casal\" desta página."
      },
      {
        question: "Dá para jogar você prefere no WhatsApp?",
        answer:
          "Dá. Copie uma pergunta, envie no grupo e peça que cada um responda com A ou B e uma explicação curta. Também funciona como enquete: a maioria define quem ganha a rodada."
      },
      {
        question: "Quais perguntas servem para adolescentes?",
        answer:
          "As categorias \"Clássicos\", \"Engraçados\", \"Comida e rotina\" e \"Para amigos\" são adequadas para quase qualquer idade. Os dilemas difíceis podem ser usados com adolescentes em debates sérios."
      },
      {
        question: "O que fazer quando a pessoa não consegue escolher?",
        answer:
          "Dê um tempo de 10 segundos e peça um critério: o que você perderia menos? Se ainda assim travar, vale pular e sortear outra. O jogo funciona melhor quando a decisão é rápida."
      }
    ]
  },
  {
    path: "/pt/assuntos-para-adolescentes",
    enPath: "/topics/conversation-topics-for-teens",
    englishLabel: "Conversation Topics for Teens",
    metaTitle: "Assuntos para Conversar com Adolescentes: {n} Ideias",
    description:
      "Assuntos para conversar com adolescentes e amigos: {n} ideias sobre escola, amizade, internet, futuro e hobbies. Sorteie um e puxe papo sem ficar constrangedor.",
    title: "Assuntos para conversar com adolescentes",
    lead: "Uma lista de assuntos leves e sinceros para pais, professores e amigos puxarem papo com adolescentes. Sorteie um tema, deixe a conversa fluir e evite o clássico \"como foi a escola?\" com resposta de uma palavra.",
    buttonLabel: "Sortear assunto",
    sibling: { label: "Assuntos para adolescentes", detail: "Para puxar papo de verdade", emoji: "💬" },
    groups: [
      {
        id: "escola",
        label: "Escola e estudos",
        topics: [
          "Qual matéria te faz perder a noção do tempo e qual dá mais sono?",
          "Qual professor explica de um jeito que você realmente entende?",
          "Se você pudesse inventar uma matéria nova na escola, qual seria?",
          "O que você acha do ENEM e das provas de vestibular?",
          "O que mudaria no horário da escola se fosse você que decidisse?",
          "Qual foi o trabalho em grupo mais caótico (ou mais legal) que você já fez?",
          "Como você estuda quando precisa se concentrar de verdade?",
          "Qual foi a aula mais interessante da semana?"
        ]
      },
      {
        id: "amizade",
        label: "Amizade e turma",
        topics: [
          "O que faz alguém ser um bom amigo para você?",
          "Qual foi a melhor memória que você tem com a sua turma?",
          "Como você faz para entrar em um grupo novo sem ficar travado?",
          "Você prefere ter poucos amigos próximos ou uma turma grande?",
          "Qual é o seu lugar favorito para ficar com os amigos?",
          "O que você faria se dois amigos seus brigassem e ambos pedissem apoio?",
          "Qual é a sua opinião sobre grupos de WhatsApp da sala?",
          "Como você reage quando um amigo muda de comportamento do nada?"
        ]
      },
      {
        id: "internet",
        label: "Internet e redes sociais",
        topics: [
          "Qual rede social você mais usa e o que gosta nela?",
          "Qual criador de conteúdo você acompanha e por que ele é bom?",
          "Quanto tempo de tela por dia você acha razoável?",
          "Você já viu uma notícia falsa circulando? Como percebeu?",
          "O que você nunca postaria na internet?",
          "Qual foi a última tendência de vídeo curto que você achou divertida?",
          "Jogos online: qual é o seu favorito e o que o torna especial?",
          "Como você diferencia amizade online de amizade presencial?"
        ]
      },
      {
        id: "futuro",
        label: "Futuro e sonhos",
        topics: [
          "O que você gostaria de ser daqui a dez anos?",
          "Qual curso ou profissão te deixa curioso, mesmo sem saber se é pra você?",
          "Se dinheiro não fosse problema, o que você faria no dia a dia?",
          "Em qual cidade ou país você gostaria de morar um dia?",
          "O que você quer aprender fora da escola?",
          "Qual desafio você quer vencer neste ano?",
          "O que você diria para o você de cinco anos atrás?",
          "Qual mudança no mundo você gostaria de ver nos próximos anos?"
        ]
      },
      {
        id: "hobbies",
        label: "Hobbies e diversão",
        topics: [
          "Qual série ou anime você indicaria sem pensar duas vezes?",
          "Qual música não sai da sua cabeça nesta semana?",
          "Qual esporte você gostaria de aprender?",
          "Você prefere filme no cinema ou maratona em casa?",
          "Qual jogo (de tabuleiro, celular ou console) te faz perder a noção do tempo?",
          "Qual foi o último livro, mangá ou HQ que você gostou?",
          "Se você pudesse ir a qualquer show, qual escolheria?",
          "Qual é a sua comida favorita para dividir com amigos?"
        ]
      },
      {
        id: "dia-a-dia",
        label: "Sentimentos e rotina",
        topics: [
          "O que te ajuda a relaxar depois de um dia puxado?",
          "Qual foi a coisa mais legal que aconteceu esta semana?",
          "O que te deixa mais ansioso antes de uma prova ou apresentação?",
          "Qual é a sua rotina favorita nos fins de semana?",
          "Qual foi a última vez que você riu até doer a barriga?",
          "O que te inspira a continuar tentando quando algo dá errado?",
          "Há algo em que você gostaria de ajuda, mas ainda não sabe como pedir?",
          "Qual é um hábito pequeno que te faz bem?"
        ]
      }
    ],
    howTo: [
      "Sorteie um assunto e escolha um momento tranquilo, como no carro, no lanche ou durante um passeio.",
      "Faça a pergunta com curiosidade, sem julgar ou corrigir a resposta. Perguntas abertas funcionam melhor do que sim ou não.",
      "Compartilhe também a sua resposta: conversa de mão dupla deixa o adolescente mais à vontade.",
      "Se não quiser falar sobre aquele assunto, respeite e sorteie outro. A ideia é criar o hábito de conversar."
    ],
    faq: [
      {
        question: "Como puxar assunto com um adolescente que fala pouco?",
        answer:
          "Evite perguntas de sim ou não e escolha momentos sem pressão, como no trajeto de carro. Comece por interesses dele, como jogos, música ou séries. Mostre curiosidade verdadeira e não faça interrogatório."
      },
      {
        question: "Quais assuntos para conversar com amigos funcionam melhor?",
        answer:
          "Memórias engraçadas, hobbies, séries, música e planos para as férias sempre rendem. Perguntas hipotéticas, como \"se você pudesse...\", também ajudam a conhecer melhor a pessoa."
      },
      {
        question: "O que evitar ao conversar com adolescentes?",
        answer:
          "Sermões, comparações com outras pessoas e interrupções. Se o assunto for delicado, ouça primeiro e pergunte como ele se sente antes de dar conselhos. Confiança constrói conversa."
      },
      {
        question: "Esses assuntos servem para sala de aula ou rodas de conversa?",
        answer:
          "Sim, em especial os de escola, internet e futuro. O professor pode sortear um assunto por dia como aquecimento ou usar a categoria \"Sentimentos e rotina\" para criar um espaço de acolhimento."
      },
      {
        question: "Como incentivar o adolescente a falar de sentimentos?",
        answer:
          "Comece por assuntos leves e vá aprofundando aos poucos. Valide o que ele diz sem minimizar, e conte como você lidou com algo parecido na sua adolescência. Se perceber sofrimento intenso, procure apoio de um profissional."
      }
    ]
  },
  {
    path: "/pt/gerador-de-perguntas",
    enPath: "/question-generator",
    englishLabel: "Question Generator",
    metaTitle: "Gerador de Perguntas Aleatórias: {n} Perguntas Grátis",
    description:
      "Gerador de perguntas aleatórias grátis: {n} perguntas rompe-gelo, profundas, divertidas, de debate e pessoais. Sorteie e use em reuniões, encontros e aulas.",
    title: "Gerador de perguntas aleatórias",
    lead: "Clique e receba uma pergunta pronta para quebrar o gelo, aprofundar uma conversa ou animar um grupo. Funciona para encontro, reunião de equipe, sala de aula e papo com a família.",
    buttonLabel: "Gerar pergunta",
    sibling: { label: "Gerador de perguntas", detail: "Perguntas prontas para qualquer ocasião", emoji: "❓" },
    groups: [
      {
        id: "rompe-gelo",
        label: "Rompe-gelo",
        topics: [
          "Qual é o seu lanche favorito para uma tarde de chuva?",
          "Qual é o melhor lugar em que você já comeu na vida?",
          "Qual foi o último vídeo que te fez rir de verdade?",
          "Se pudesse jantar com qualquer pessoa, viva ou não, quem seria?",
          "Qual é a sua música de fim de semana?",
          "Qual foi a sua primeira lembrança de escola?",
          "Praia, serra ou cidade grande: qual é o seu cenário de férias?",
          "Qual aplicativo você não consegue ficar sem?",
          "Qual é o seu prato típico favorito de uma região do Brasil?",
          "O que você sempre pede quando vai a uma padaria?"
        ]
      },
      {
        id: "profundas",
        label: "Profundas",
        topics: [
          "O que você faria diferente se soubesse que ninguém vai julgar?",
          "Qual foi a decisão mais difícil que você já tomou e o que aprendeu?",
          "O que te faz sentir que a vida vale a pena?",
          "Do que você mais se orgulha, e que ninguém sabe?",
          "Qual medo você gostaria de vencer?",
          "O que significa \"ter sucesso\" para você hoje, comparado a cinco anos atrás?",
          "Que conselho você daria a alguém que está começando do zero?",
          "Que memória você gostaria de guardar para sempre?",
          "Em quem você mais confia e por quê?",
          "O que você gostaria que as pessoas lembrassem de você?"
        ]
      },
      {
        id: "divertidas",
        label: "Divertidas",
        topics: [
          "Se você fosse um prato de comida, qual seria e por quê?",
          "Qual superpoder inútil você gostaria de ter?",
          "Qual seria o título da sua autobiografia?",
          "Que talento escondido você tem que ninguém imagina?",
          "Se você pudesse ter um animal de estimação exótico, qual escolheria?",
          "Se sua vida tivesse uma trilha sonora, qual seria a música de abertura?",
          "Qual foi a pior fantasia que você já usou?",
          "Qual palavra você sempre troca ou fala errado?",
          "Que mania sua você acha que é a mais estranha?",
          "Qual jogo da infância você gostaria de jogar de novo?"
        ]
      },
      {
        id: "debate",
        label: "Debate",
        topics: [
          "Os estudantes deveriam aprender educação financeira na escola?",
          "O trabalho remoto deveria ser a regra para quem pode?",
          "Dinheiro traz felicidade ou apenas ajuda a evitar problemas?",
          "A inteligência artificial vai criar mais empregos do que eliminar?",
          "O voto deveria ser facultativo para todos?",
          "Devemos usar o celular em sala de aula como ferramenta de estudo?",
          "É melhor morar em cidade pequena ou em metrópole?",
          "O futebol ainda é o esporte que mais une o país?",
          "Redes sociais aproximam ou afastam as pessoas?",
          "Faculdade ainda é o melhor caminho para ter uma boa carreira?"
        ]
      },
      {
        id: "pessoais",
        label: "Pessoais",
        topics: [
          "Como é a sua rotina ideal de uma segunda-feira?",
          "Qual foi o melhor presente que você já recebeu e por quê?",
          "Qual foi o trabalho mais diferente que você já teve?",
          "O que você faz quando está estressado?",
          "Quem foi a pessoa que mais te ensinou sobre a vida?",
          "O que você mais admira na sua família?",
          "Se tivesse uma semana livre e dinheiro, para onde iria?",
          "Qual hábito você quer criar neste ano?",
          "Qual foi a viagem que mais mudou seu jeito de pensar?",
          "Qual foi o melhor conselho que você já deu?"
        ]
      }
    ],
    howTo: [
      "Escolha o tipo de pergunta que combina com a situação: rompe-gelo para quem acabou de se conhecer, profundas para amigos próximos.",
      "Clique em \"Gerar pergunta\" e leia em voz alta ou envie por mensagem.",
      "Dê tempo para a pessoa pensar e responda também: perguntas funcionam melhor quando todo mundo participa.",
      "Use o botão de copiar para enviar a pergunta no WhatsApp, no grupo da turma ou no chat da reunião."
    ],
    faq: [
      {
        question: "Para que serve um gerador de perguntas aleatórias?",
        answer:
          "Para quando você precisa de uma boa pergunta na hora: quebrar o gelo em uma reunião, animar uma festa, começar um encontro ou propor uma atividade em sala. Você ganha variedade sem pensar muito."
      },
      {
        question: "Quais perguntas são boas para um primeiro encontro?",
        answer:
          "Comece pelas rompe-gelo, que falam de comida, música e viagens. Depois, passe para algumas perguntas pessoais e leves. Evite as muito profundas até que exista mais confiança."
      },
      {
        question: "Dá para usar o gerador em reuniões de trabalho?",
        answer:
          "Dá. Uma pergunta rompe-gelo nos primeiros minutos ajuda o time a relaxar. Escolha as divertidas ou de debate, e mantenha as respostas curtas para não atrasar a pauta."
      },
      {
        question: "As perguntas se repetem?",
        answer:
          "O sorteio é aleatório e uma pergunta pode voltar. Mude de categoria ou gere de novo para continuar a conversa. Para uma lista fixa, copie as perguntas que mais gostou."
      },
      {
        question: "Como tornar a conversa mais interessante depois da resposta?",
        answer:
          "Faça uma pergunta de acompanhamento simples, como \"por quê?\" ou \"como foi isso?\". Mostre interesse no que a pessoa disse antes de passar para a pergunta seguinte."
      }
    ]
  }
];
