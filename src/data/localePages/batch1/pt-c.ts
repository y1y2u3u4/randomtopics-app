import type { LocalePageConfig } from "../types";

export const PT_C: LocalePageConfig[] = [
  {
    path: "/pt/eu-nunca",
    enPath: "/never-have-i-ever",
    englishLabel: "Never Have I Ever",
    metaTitle: "Eu Nunca: {n} Perguntas para o Jogo (Amigos e Casais)",
    description:
      "Jogo Eu Nunca com {n} frases prontas: para amigos, escola, viagem, comida, situações engraçadas e casais. Sorteie uma e descubra quem já fez o quê. Grátis.",
    title: "Perguntas para o jogo Eu Nunca",
    lead: "Sorteie uma frase do Eu Nunca e veja quem do grupo já passou por aquilo. São {n} perguntas separadas por tema, de amigos e escola a viagem, comida e casais, todas leves e sem constrangimento pesado. Funciona em churrasco, resenha, festa do pijama ou chamada de vídeo.",
    buttonLabel: "Sortear frase",
    mode: "card",
    sibling: { label: "Eu Nunca", detail: "Frases para jogar em grupo", emoji: "🙊" },
    groups: [
      {
        id: "amigos",
        label: "Para amigos",
        topics: [
          "Eu nunca esqueci o aniversário de um amigo próximo.",
          "Eu nunca visualizei uma mensagem e fingi que não vi.",
          "Eu nunca fiquei no grupo da família só para não dar bola.",
          "Eu nunca cancelei um rolê em cima da hora dizendo que estava passando mal.",
          "Eu nunca mandei mensagem para a pessoa errada.",
          "Eu nunca dormi na casa de um amigo e fui embora sem me despedir de ninguém.",
          "Eu nunca contei um segredo que prometi guardar.",
          "Eu nunca chamei alguém de “amigo” sem lembrar o nome da pessoa.",
          "Eu nunca fingi que tinha visto uma série só para entrar na conversa.",
          "Eu nunca chorei de rir em um momento totalmente inadequado.",
          "Eu nunca fiquei olhando o story de alguém sem querer curtir.",
          "Eu nunca emprestei dinheiro a um amigo e fiquei com vergonha de cobrar."
        ]
      },
      {
        id: "escola",
        label: "Escola e faculdade",
        topics: [
          "Eu nunca colei em uma prova.",
          "Eu nunca fingi estar doente para faltar à aula.",
          "Eu nunca dormi durante uma aula e acordei com todo mundo olhando.",
          "Eu nunca fiz um trabalho em grupo sozinho enquanto os outros só assinavam.",
          "Eu nunca copiei o dever de casa no recreio.",
          "Eu nunca tive um crush no professor ou na professora.",
          "Eu nunca esqueci de estudar e só lembrei na véspera da prova.",
          "Eu nunca fui chamado à coordenação.",
          "Eu nunca respondi “presente” pelo colega que faltou.",
          "Eu nunca passei a noite em claro fazendo um trabalho para entregar de manhã.",
          "Eu nunca fiquei de recuperação em alguma matéria.",
          "Eu nunca decorei a letra de uma música de propósito só para tirar sarro dela na sala."
        ]
      },
      {
        id: "viagem",
        label: "Viagem e rolês",
        topics: [
          "Eu nunca perdi um ônibus ou um voo.",
          "Eu nunca viajei sem ter a menor ideia de onde ia ficar.",
          "Eu nunca tomei banho de mar de madrugada.",
          "Eu nunca peguei um engarrafamento de mais de três horas indo para a praia.",
          "Eu nunca me perdi em uma cidade que não conhecia.",
          "Eu nunca esqueci algo essencial em casa e só percebi na estrada.",
          "Eu nunca dormi em rodoviária ou aeroporto.",
          "Eu nunca fui a um show e fiquei sem voz no dia seguinte.",
          "Eu nunca peguei uma carona com um desconhecido de aplicativo e me arrependi no meio do caminho.",
          "Eu nunca viajei de ônibus leito e dormi muito melhor do que esperava.",
          "Eu nunca pulei Carnaval de bloco de rua.",
          "Eu nunca passei um réveillon em um lugar totalmente diferente do planejado."
        ]
      },
      {
        id: "comida",
        label: "Comida",
        topics: [
          "Eu nunca comi pizza com ketchup.",
          "Eu nunca comi um pacote inteiro de bolacha recheada sozinho.",
          "Eu nunca queimei a comida tentando fazer algo simples, como arroz.",
          "Eu nunca comi o último pedaço de um doce que era para dividir.",
          "Eu nunca pedi delivery duas vezes no mesmo dia.",
          "Eu nunca joguei fora a marmita da semana inteira porque estragou na geladeira.",
          "Eu nunca comi miojo de madrugada e achei o melhor jantar da vida.",
          "Eu nunca coloquei leite condensado em algo que não combinava.",
          "Eu nunca fingi gostar de uma comida só para não ofender quem fez.",
          "Eu nunca comi farofa sem nada para acompanhar, só na colher.",
          "Eu nunca peguei comida da geladeira do trabalho achando que era minha.",
          "Eu nunca comi tanto no rodízio que passei mal."
        ]
      },
      {
        id: "engracadas",
        label: "Engraçadas",
        topics: [
          "Eu nunca cantei errado uma música durante anos sem perceber.",
          "Eu nunca caí em público e fingi que estava tudo bem.",
          "Eu nunca falei sozinho em voz alta achando que ninguém estava ouvindo.",
          "Eu nunca ri na hora errada, como em um velório ou numa reunião séria.",
          "Eu nunca empurrei uma porta que era para puxar na frente de todo mundo.",
          "Eu nunca acenei para alguém que, na verdade, estava acenando para outra pessoa.",
          "Eu nunca fiquei preso do lado de fora de casa.",
          "Eu nunca procurei o celular enquanto falava nele.",
          "Eu nunca dei “tchau, você também” para o garçom que disse “bom apetite”.",
          "Eu nunca dancei sozinho no quarto com a porta trancada.",
          "Eu nunca soltei um espirro tão alto que assustou a sala inteira.",
          "Eu nunca pesquisei meu próprio nome na internet."
        ]
      },
      {
        id: "casais",
        label: "Para casais (leve)",
        topics: [
          "Eu nunca stalkeei o perfil de ex-namorado ou ex-namorada depois de terminar.",
          "Eu nunca fingi gostar de um presente.",
          "Eu nunca fiquei com ciúme de uma curtida em foto.",
          "Eu nunca escrevi uma mensagem apaixonada e apaguei antes de enviar.",
          "Eu nunca me apaixonei por alguém logo depois de conhecer.",
          "Eu nunca esperei mais de uma hora por alguém em um encontro.",
          "Eu nunca levei um bolo em um primeiro encontro.",
          "Eu nunca chamei alguém pelo nome do ex.",
          "Eu nunca chorei vendo um filme romântico e neguei depois.",
          "Eu nunca deixei de responder uma mensagem para parecer ocupado.",
          "Eu nunca mudei meu estilo só para impressionar alguém.",
          "Eu nunca mandei uma música para dizer o que não conseguia falar."
        ]
      }
    ],
    howTo: [
      "Todo mundo levanta a mão com os cinco dedos abertos (ou pega cinco fichas, tampinhas ou palitos).",
      "Sorteie uma frase e leia em voz alta para o grupo.",
      "Quem já fez aquilo dobra um dedo (ou entrega uma ficha) e, se quiser, conta a história.",
      "Quem ficar sem dedos primeiro perde, ou simplesmente continue até acabar o assunto e as risadas."
    ],
    faq: [
      {
        question: "Como jogar Eu Nunca?",
        answer:
          "Cada jogador começa com cinco dedos levantados. Alguém diz “Eu nunca…” e completa a frase. Quem já fez aquilo baixa um dedo. Quando o último dedo cair, a pessoa sai da rodada. A graça está nas histórias que aparecem depois de cada frase."
      },
      {
        question: "Quantas pessoas precisam para jogar Eu Nunca?",
        answer:
          "A partir de três pessoas já funciona, mas o ideal fica entre cinco e dez. Em chamada de vídeo também dá certo: cada um mostra os dedos na câmera."
      },
      {
        question: "Dá para jogar Eu Nunca sem beber?",
        answer:
          "Dá, e é assim que a maioria joga. Todas as frases desta página são leves e servem para qualquer ocasião. Troque a bebida por dedos, fichas ou pontos."
      },
      {
        question: "Tem perguntas de Eu Nunca para casais?",
        answer:
          "Tem. O grupo “Para casais (leve)” traz frases sobre encontros, ciúme e mensagens, sem nada explícito, para jogar com o namorado ou a namorada e se conhecer melhor."
      },
      {
        question: "O que fazer quando a pessoa não quer contar a história?",
        answer:
          "Sem pressão. Quem baixou o dedo não precisa explicar nada. Combine antes que o jogo é leve e que dá para pular qualquer frase que deixe alguém desconfortável."
      }
    ]
  },
  {
    path: "/pt/verdade-ou-desafio",
    enPath: "/truth-or-dare",
    englishLabel: "Truth or Dare",
    metaTitle: "Verdade ou Desafio: {n} Perguntas e Desafios Prontos",
    description:
      "Perguntas e desafios de verdade ou desafio: {n} ideias para amigos, casais, crianças e online, todas seguras e sem nada perigoso. Sorteie e jogue agora, grátis.",
    title: "Perguntas e desafios de Verdade ou Desafio",
    lead: "Sorteie uma verdade ou um desafio e role a brincadeira. São {n} ideias organizadas por situação: amigos, casal, crianças, desafios engraçados e jogos pelo celular. Tudo pode ser feito dentro de casa, sem perigo e sem humilhar ninguém.",
    buttonLabel: "Sortear verdade ou desafio",
    mode: "card",
    sibling: { label: "Verdade ou Desafio", detail: "Perguntas e desafios seguros", emoji: "🎲" },
    groups: [
      {
        id: "verdades-amigos",
        label: "Verdades para amigos",
        topics: [
          "Verdade: qual foi a maior mentira que você já contou para fugir de um compromisso?",
          "Verdade: qual música você ama, mas tem vergonha de admitir?",
          "Verdade: qual foi o momento mais constrangedor que você passou na escola?",
          "Verdade: quem do grupo você acha que ficaria mais rico?",
          "Verdade: qual é a última coisa que você pesquisou no Google?",
          "Verdade: que apelido você tinha na infância e detestava?",
          "Verdade: já fingiu que sabia de algo só para não passar vergonha? O quê?",
          "Verdade: qual pessoa do grupo você levaria para uma ilha deserta e por quê?",
          "Verdade: qual foi o presente mais estranho que você já recebeu?",
          "Verdade: qual série ou novela você assiste escondido?",
          "Verdade: qual é o seu maior medo bobo?",
          "Verdade: qual hábito seu irrita mais as pessoas que moram com você?"
        ]
      },
      {
        id: "desafios-amigos",
        label: "Desafios para amigos",
        topics: [
          "Desafio: imite a voz de alguém do grupo até a próxima rodada.",
          "Desafio: fale só em rimas por dois minutos.",
          "Desafio: faça sua melhor imitação de uma celebridade brasileira.",
          "Desafio: cante o refrão da última música que você ouviu, com muito sentimento.",
          "Desafio: ande como um modelo na passarela pela sala.",
          "Desafio: conte uma piada e só pare quando alguém rir.",
          "Desafio: fique 1 minuto sem rir enquanto o grupo tenta te fazer rir.",
          "Desafio: faça 10 polichinelos contando em outro idioma.",
          "Desafio: dê um elogio sincero e criativo para cada pessoa da roda.",
          "Desafio: descreva seu dia inteiro como se fosse narrador de futebol.",
          "Desafio: dance 30 segundos sem música.",
          "Desafio: equilibre um livro na cabeça e dê uma volta pela sala."
        ]
      },
      {
        id: "casal",
        label: "Verdades para casal",
        topics: [
          "Verdade: qual foi sua primeira impressão de mim?",
          "Verdade: qual detalhe meu você acha mais bonito?",
          "Verdade: qual foi o momento em que você percebeu que estava gostando de mim?",
          "Verdade: qual hábito meu você acha mais engraçado?",
          "Verdade: qual é a coisa mais romântica que você já sonhou em fazer comigo?",
          "Verdade: tem algo que você sempre quis me perguntar e nunca teve coragem?",
          "Verdade: qual música te lembra de mim?",
          "Verdade: o que você faria se ganhasse um dia livre só para nós dois?",
          "Verdade: qual foi nosso encontro favorito até agora?",
          "Verdade: qual apelido meu você mais gosta?",
          "Verdade: o que eu faço que sempre te faz sorrir?",
          "Verdade: onde você gostaria de passar nossas próximas férias?"
        ]
      },
      {
        id: "criancas",
        label: "Para crianças",
        topics: [
          "Verdade: qual é o seu desenho animado preferido e por quê?",
          "Verdade: qual comida você nunca mais quer comer na vida?",
          "Verdade: se você pudesse ter um superpoder, qual seria?",
          "Verdade: qual foi a coisa mais engraçada que já aconteceu na sua escola?",
          "Verdade: com qual animal você gostaria de conversar?",
          "Desafio: faça o barulho de cinco animais diferentes.",
          "Desafio: caminhe como um robô até a porta e volte.",
          "Desafio: desenhe um bicho que não existe e dê um nome a ele.",
          "Desafio: conte até dez de trás para frente, rápido.",
          "Desafio: faça uma careta bem engraçada e segure por cinco segundos.",
          "Desafio: pule em um pé só da cadeira até o sofá.",
          "Desafio: invente uma música sobre o seu lanche favorito."
        ]
      },
      {
        id: "engracados",
        label: "Desafios engraçados",
        topics: [
          "Desafio: fale com sotaque de outro estado (mineiro, carioca, gaúcho) até a próxima rodada.",
          "Desafio: faça uma propaganda de 30 segundos para um objeto que está na sua frente.",
          "Desafio: coloque uma meia em cada mão e faça um teatro de fantoches.",
          "Desafio: conte uma história sem usar a letra A.",
          "Desafio: faça sua melhor cara de choro de novela mexicana.",
          "Desafio: responda tudo com “sim, senhor” pelos próximos três minutos.",
          "Desafio: anuncie o jantar como se fosse apresentador de programa de culinária.",
          "Desafio: fique de “estátua” por 30 segundos enquanto o grupo tenta te distrair.",
          "Desafio: faça um discurso de agradecimento como se tivesse ganhado um Oscar.",
          "Desafio: recite o alfabeto de trás para frente.",
          "Desafio: ande de lado como caranguejo pela sala.",
          "Desafio: descreva um filme famoso usando só mímica."
        ]
      },
      {
        id: "online",
        label: "Pelo celular e online",
        topics: [
          "Desafio: mostre o último print que você tirou (você escolhe se mostra ou troca por uma verdade).",
          "Desafio: grave um áudio de 10 segundos cantando parabéns de forma dramática.",
          "Desafio: troque a foto do seu perfil por uma foto de infância por uma hora.",
          "Desafio: mande um emoji aleatório para o último contato com quem você conversou, sem explicar.",
          "Desafio: mostre a lista das suas últimas cinco músicas tocadas.",
          "Desafio: faça uma selfie com a cara mais engraçada que conseguir e mande no grupo.",
          "Verdade: qual é o aplicativo que você mais usa e quanto tempo por dia?",
          "Verdade: qual é o último vídeo que você mandou para alguém do grupo?",
          "Verdade: qual foi o meme que mais te fez rir esse mês?",
          "Verdade: qual é o seu jogo de celular viciante que você finge que não joga?",
          "Desafio: leia em voz alta a mensagem mais antiga que aparece no seu WhatsApp.",
          "Desafio: mande um elogio sincero para alguém do grupo no privado agora."
        ]
      }
    ],
    howTo: [
      "Sentem em roda e escolham quem começa; cada um responde a uma pergunta quando chegar a vez.",
      "A pessoa da vez escolhe verdade ou desafio, e você sorteia uma opção no botão.",
      "Cumpra o desafio ou responda com sinceridade. Pulou? Fica sem um ponto ou paga uma prenda leve.",
      "Combine uma regra de ouro: ninguém é obrigado a fazer algo que o deixe desconfortável."
    ],
    faq: [
      {
        question: "Como jogar verdade ou desafio?",
        answer:
          "A pessoa da vez escolhe entre responder uma verdade com sinceridade ou cumprir um desafio. O grupo define a pergunta ou a tarefa. Aqui você sorteia as duas opções, o que evita aquele momento de ninguém saber o que perguntar."
      },
      {
        question: "Quais são boas perguntas de verdade ou desafio para amigos?",
        answer:
          "As melhores são as que geram história, como o momento mais constrangedor na escola, a mentira mais ousada ou a música que você ama em segredo. Veja o grupo “Verdades para amigos”."
      },
      {
        question: "Tem verdade ou desafio para crianças?",
        answer:
          "Tem. O grupo “Para crianças” traz perguntas e desafios simples, com bichos, caretas e músicas, sem nada que possa machucar ou envergonhar."
      },
      {
        question: "Dá para jogar verdade ou desafio online?",
        answer:
          "Dá. Em chamada de vídeo ou no grupo do WhatsApp, use o grupo “Pelo celular e online”, com desafios de áudio, selfies e perguntas sobre o que você faz no celular."
      },
      {
        question: "O que fazer se eu não quiser cumprir o desafio?",
        answer:
          "Qualquer um pode pular. Combine uma prenda leve, como contar uma piada ou responder uma verdade extra, e todo mundo continua se divertindo sem pressão."
      }
    ]
  },
  {
    path: "/pt/duas-verdades-e-uma-mentira",
    enPath: "/two-truths-and-a-lie",
    englishLabel: "Two Truths and a Lie",
    metaTitle: "Duas Verdades e uma Mentira: {n} Exemplos para Jogar",
    description:
      "Exemplos de duas verdades e uma mentira: {n} frases prontas sobre escola, trabalho, viagem, comida, infância e talentos. Adapte para você e surpreenda o grupo.",
    title: "Exemplos de Duas Verdades e uma Mentira",
    lead: "Sem ideias para o seu jogo? Sorteie um dos {n} exemplos e adapte para a sua vida: troque o detalhe, mantenha o formato e deixe o grupo adivinhar qual é a mentira. Ótimo para quebrar o gelo em sala de aula, reunião, treinamento ou encontro de amigos.",
    buttonLabel: "Sortear exemplo",
    mode: "card",
    sibling: { label: "Duas Verdades e uma Mentira", detail: "Exemplos prontos para adaptar", emoji: "🤥" },
    groups: [
      {
        id: "escola",
        label: "Escola e faculdade",
        topics: [
          "Já fui eleito representante de turma. / Nunca tirei zero em prova. / Já dormi na biblioteca e perdi a hora da aula.",
          "Estudei em três escolas diferentes. / Sei decorar o alfabeto grego. / Já ganhei medalha em olimpíada de matemática.",
          "Já participei de uma peça de teatro da escola. / Nunca colei na vida. / Já fiz um trabalho inteiro na véspera.",
          "Fui monitor de uma disciplina. / Já briguei com um professor. / Meu primeiro crush foi colega de classe.",
          "Já fiz intercâmbio. / Nunca repeti de ano. / Já cantei em festa junina na frente de todo mundo.",
          "Aprendi a tocar flauta doce na escola e ainda lembro uma música. / Sou ótimo em xadrez. / Já fui expulso da sala por rir demais.",
          "Fiz faculdade em outra cidade. / Já virei a noite estudando três vezes seguidas. / Nunca fui a uma festa universitária.",
          "Já tirei nota máxima na redação do vestibular. / Nunca usei calculadora em prova. / Já fiz amizade com o porteiro da faculdade.",
          "Já participei de um grêmio estudantil. / Fui o último a ser escolhido no time de vôlei. / Nunca entreguei um trabalho atrasado.",
          "Já fui eleito o mais engraçado da turma. / Estudei francês por dois anos. / Nunca perdi a hora de uma prova.",
          "Já organizei uma formatura. / Sei recitar um poema inteiro de cabeça. / Nunca esqueci o material em casa.",
          "Fui o orador da turma. / Já apresentei um seminário com a voz tremendo. / Já participei de uma feira de ciências com um vulcão de vinagre."
        ]
      },
      {
        id: "trabalho",
        label: "Trabalho",
        topics: [
          "Meu primeiro emprego foi em uma padaria. / Já trabalhei em três cidades. / Nunca faltei a uma reunião.",
          "Já atendi cliente por telefone por mais de um ano. / Sou bom em planilhas. / Já fui promovido no primeiro ano de empresa.",
          "Já trabalhei de madrugada. / Nunca perdi um prazo. / Já esqueci de desligar o microfone numa reunião online.",
          "Comecei como estagiário e hoje lidero uma equipe. / Já abri um negócio próprio. / Nunca tomei café no trabalho.",
          "Já dei uma palestra para mais de 100 pessoas. / Odeio e-mails. / Já fiz um trabalho voluntário.",
          "Meu primeiro salário foi gasto todo em um tênis. / Nunca fiz hora extra. / Já fui entrevistado para um emprego por vídeo.",
          "Trabalho remoto há mais de dois anos. / Já mudei de carreira por completo. / Nunca atrasei na vida.",
          "Já vendi produtos de porta em porta. / Falo três idiomas no trabalho. / Nunca errei um número em um relatório.",
          "Já fui garçom ou garçonete. / Sou o primeiro a chegar no escritório. / Nunca usei a impressora errada.",
          "Já recusei uma proposta de emprego melhor por gostar da equipe. / Já trabalhei em um aeroporto. / Nunca fui a um happy hour da empresa.",
          "Meu emprego dos sonhos na infância era ser veterinário. / Já fiz um curso de oratória. / Nunca me atrapalhei em uma apresentação.",
          "Já trabalhei com meu melhor amigo. / Já fui demitido. / Nunca usei um atalho no teclado."
        ]
      },
      {
        id: "viagem",
        label: "Viagem",
        topics: [
          "Já visitei Foz do Iguaçu. / Nunca andei de avião. / Já vi o nascer do sol na praia.",
          "Já fui a Fernando de Noronha. / Já viajei sozinho para outro país. / Nunca peguei estrada com mais de 10 horas.",
          "Já fiz trilha até uma cachoeira. / Falo espanhol fluente. / Nunca fiquei em hostel.",
          "Já vi o Cristo Redentor de perto. / Já perdi uma mala. / Nunca viajei de trem.",
          "Já pulei Carnaval em Salvador. / Já andei de teleférico. / Nunca fui para o Nordeste.",
          "Já atravessei de balsa. / Já viajei de navio. / Nunca conheci a neve.",
          "Já visitei o Pantanal. / Já dormi em uma barraca de camping. / Nunca passei mais de uma semana fora de casa.",
          "Já fui a um show internacional em outra cidade. / Já acampei na praia. / Nunca me perdi em uma cidade nova.",
          "Já comi tapioca em Fortaleza. / Já visitei Gramado no frio. / Nunca viajei de ônibus à noite.",
          "Já conheci os Lençóis Maranhenses. / Já viajei com meus avós. / Nunca tirei foto de um ponto turístico famoso.",
          "Já peguei um voo cancelado. / Já fiz um mochilão. / Nunca viajei para o exterior.",
          "Já nadei em um rio de água cristalina em Bonito. / Já andei de bicicleta em Paraty. / Nunca vi uma cidade histórica de perto."
        ]
      },
      {
        id: "comida",
        label: "Comida",
        topics: [
          "Já comi açaí com farinha e peixe. / Nunca provei jiló. / Sei fazer pão de queijo do zero.",
          "Já fiz feijoada para mais de 10 pessoas. / Nunca comi sushi. / Já fiz um bolo que deu errado de propósito.",
          "Já comi acarajé na Bahia. / Já comi um pastel de feira gigante. / Nunca tomei caipirinha.",
          "Odeio coentro. / Já provei carne de jacaré. / Já comi pizza de chocolate com morango.",
          "Já comi churrasco todo domingo por um ano. / Já fiz brigadeiro de panela mais de 20 vezes. / Nunca comi pamonha.",
          "Já tomei um suco de caju fresquinho. / Sei fazer risoto. / Nunca provei pão de queijo.",
          "Já fiz uma torta de limão perfeita. / Já comi tanta pipoca no cinema que passei mal. / Nunca tomei guaraná Jesus.",
          "Já comi tapioca recheada de queijo coalho. / Nunca tomei café sem açúcar. / Já fiz uma receita de família passada pela minha avó.",
          "Já provei uma comida picante demais e chorei. / Já fiz cuscuz no café da manhã. / Nunca comi uma coxinha.",
          "Amo pizza com catupiry. / Já comi mais de 20 pães de queijo de uma vez. / Nunca provei nenhuma fruta tropical.",
          "Já preparei uma ceia de Natal completa. / Já fiz pamonha em casa. / Odeio chocolate.",
          "Já comi um prato típico mineiro direto da panela de ferro. / Já fiz farofa que ficou crua. / Nunca tomei sorvete no inverno."
        ]
      },
      {
        id: "infancia",
        label: "Infância",
        topics: [
          "Eu tinha um amigo imaginário. / Já quebrei o braço brincando. / Nunca fui ao parquinho.",
          "Joguei bolinha de gude todo dia. / Já me perdi em um shopping. / Nunca ganhei um presente de Natal que odiei.",
          "Já criei um bichinho virtual. / Nunca andei de bicicleta sem rodinhas. / Já fiz uma casinha na árvore.",
          "Cresci em uma cidade pequena. / Já escondi o prato de comida atrás do sofá. / Nunca assisti Chaves.",
          "Já tive um apelido que eu odiava. / Brinquei de pique-esconde na rua até escurecer. / Nunca tomei banho de chuva.",
          "Já aprendi a assoviar muito cedo. / Já tive um cachorro chamado Rex. / Nunca perdi um dente brincando.",
          "Já assisti Xuxa todos os dias. / Já ganhei um concurso de desenho na escola. / Nunca dormi na casa dos meus avós.",
          "Já brinquei de elástico por horas. / Colecionei figurinhas do álbum da Copa. / Nunca comi bala escondido.",
          "Já fiz uma peça de teatro para a família. / Já cantei no karaokê da festa de aniversário. / Nunca joguei videogame.",
          "Já brinquei de pular corda por horas. / Já tive medo do escuro até os 12. / Nunca tive um bicho de estimação.",
          "Já fiz uma festa de aniversário com tema de super-herói. / Já dormi no carro no meio de uma viagem. / Nunca fui a uma festa junina.",
          "Tinha um cobertor favorito e levava para todo lado. / Já fiz uma poção com ingredientes da cozinha. / Nunca desenhei na parede."
        ]
      },
      {
        id: "talentos",
        label: "Talentos e curiosidades",
        topics: [
          "Sei tocar violão. / Já ganhei um concurso de dança. / Não sei nadar.",
          "Sei fazer um cubo mágico em menos de dois minutos. / Já apareci na TV local. / Nunca cantei em público.",
          "Falo mais de dois idiomas. / Já fiz um curso de culinária. / Não sei andar de bicicleta.",
          "Sei fazer origami de grou. / Já corri uma meia maratona. / Nunca assisti a um filme inteiro no cinema.",
          "Já escrevi um livro ou conto. / Sei tocar piano. / Nunca joguei futebol.",
          "Consigo fazer o som de vários animais. / Já mergulhei com cilindro. / Tenho medo de altura e nunca superei.",
          "Sei dançar forró. / Já pintei um quadro. / Nunca aprendi a assoviar.",
          "Sei andar de skate. / Já participei de um programa de auditório. / Nunca consegui estalar os dedos.",
          "Consigo mexer as orelhas. / Já fiz tatuagem. / Nunca quebrei nenhum osso.",
          "Sei fazer malabares com três bolinhas. / Já cantei no coral da igreja. / Não sei amarrar o tênis sem olhar.",
          "Sei fazer um truque de mágica. / Já fiz bungee jump. / Nunca comi pimenta.",
          "Sei tocar bateria. / Já fui assistente de palco em um show. / Nunca fui a um parque de diversões."
        ]
      }
    ],
    howTo: [
      "Sorteie um exemplo para se inspirar e troque os detalhes pelos fatos reais da sua vida.",
      "Escolha duas verdades e uma mentira que soe tão crível quanto as verdades, sem exagero.",
      "Fale as três frases em ordem aleatória, com o mesmo tom de voz e sem rir.",
      "O grupo debate e vota em qual é a mentira; depois você revela e conta a história por trás das verdades."
    ],
    faq: [
      {
        question: "Como jogar duas verdades e uma mentira?",
        answer:
          "Cada pessoa diz três frases sobre si mesma: duas verdadeiras e uma falsa. O grupo tenta adivinhar a mentira. Quem acertar ganha ponto, e quem enganar o grupo também."
      },
      {
        question: "Quais são bons exemplos de duas verdades e uma mentira?",
        answer:
          "Os melhores misturam algo surpreendente que é verdade com uma mentira plausível, como “já visitei Fernando de Noronha” ou “sei fazer um cubo mágico em dois minutos”. Use os exemplos desta página como modelo."
      },
      {
        question: "Como fazer uma mentira convincente?",
        answer:
          "Use detalhes específicos e um tom natural, como nas verdades. Evite mentiras absurdas demais e escolha algo que alguém possa acreditar sobre você."
      },
      {
        question: "Dá para usar duas verdades e uma mentira no trabalho?",
        answer:
          "Dá, é uma dinâmica clássica de integração. Use o grupo “Trabalho” para ideias leves e evite temas pessoais demais, como saúde, dinheiro ou relacionamentos."
      },
      {
        question: "Quantas pessoas podem jogar?",
        answer:
          "De duas a vinte pessoas, em sala de aula, treinamento ou chamada de vídeo. Em grupos grandes, divida em times menores para todo mundo ter a vez."
      }
    ]
  },
  {
    path: "/pt/perguntas-para-casais",
    enPath: "/topics/conversation-starters-for-couples",
    englishLabel: "Conversation Starters for Couples",
    metaTitle: "Perguntas para Casais: {n} Ideias para Conversar a Dois",
    description:
      "{n} perguntas para casais e para o namorado ou namorada: para se conhecer, profundas, divertidas, sobre o futuro, namoro à distância e românticas. Sorteie e converse.",
    title: "Perguntas para casais e para o namorado",
    lead: "Sorteie uma pergunta e transforme o jantar, a viagem de carro ou a chamada de vídeo em uma conversa de verdade. São {n} perguntas para casais, de namoro novo a relacionamento antigo, entre leves, profundas, divertidas e românticas.",
    buttonLabel: "Sortear pergunta",
    mode: "card",
    sibling: { label: "Perguntas para casais", detail: "Conversas para namorados", emoji: "💞" },
    groups: [
      {
        id: "conhecer",
        label: "Para se conhecer",
        topics: [
          "Qual é a sua lembrança favorita da infância?",
          "Qual foi o melhor dia da sua vida até hoje?",
          "O que te fazia rir sem parar quando criança?",
          "Qual é o seu maior sonho que poucas pessoas sabem?",
          "Qual é a sua comida de conforto?",
          "Qual foi a viagem mais marcante que você já fez?",
          "O que você faz para relaxar depois de um dia ruim?",
          "Qual é o seu filme ou série para ver quando está triste?",
          "Como era o seu quarto quando você era adolescente?",
          "Qual é a primeira coisa que você notou em mim?",
          "Quais três palavras te descrevem melhor?",
          "Qual foi a maior mudança que você já viveu?"
        ]
      },
      {
        id: "profundas",
        label: "Profundas",
        topics: [
          "O que o amor significa para você, na prática?",
          "Qual foi o momento mais difícil da sua vida e o que ele te ensinou?",
          "Do que você tem medo quando pensa em relacionamentos?",
          "O que eu posso fazer para você se sentir mais amado?",
          "Quando você se sentiu mais compreendido por alguém?",
          "O que você precisa ouvir de mim nos dias ruins?",
          "Qual valor é inegociável para você em um relacionamento?",
          "Como você prefere resolver uma discussão: conversando na hora ou depois de esfriar a cabeça?",
          "Qual é um erro que você cometeu e aprendeu com ele?",
          "Do que você mais se orgulha em você mesmo?",
          "O que você gostaria que eu entendesse melhor sobre você?",
          "O que você acha que cada um de nós aprendeu com o outro?"
        ]
      },
      {
        id: "divertidas",
        label: "Divertidas",
        topics: [
          "Se fôssemos personagens de um filme, quem seríamos?",
          "Qual apelido meu você acha mais engraçado?",
          "Qual é a coisa mais boba que a gente já discutiu?",
          "Se a gente abrisse um negócio juntos, qual seria?",
          "Qual superpoder você escolheria para nós dois?",
          "Qual é o meu hábito mais engraçado?",
          "Quem de nós dois seria o primeiro a sobreviver a um apocalipse zumbi?",
          "Qual é o pior filme que já vimos juntos?",
          "Qual música seria a trilha sonora do nosso relacionamento?",
          "Se tivéssemos um programa de culinária, como ele se chamaria?",
          "Quem de nós dois é mais teimoso, de verdade?",
          "Qual foi a coisa mais aleatória que já compramos juntos?"
        ]
      },
      {
        id: "futuro",
        label: "Futuro",
        topics: [
          "Onde você se imagina morando daqui a cinco anos?",
          "Como seria o nosso fim de semana ideal daqui a dez anos?",
          "Que viagem você sonha em fazer comigo?",
          "Qual meta você gostaria de realizar junto comigo?",
          "Como você imagina a nossa casa dos sonhos?",
          "O que você gostaria de nunca mudar entre nós?",
          "Que tradição você quer criar só nossa?",
          "Como você quer lidar com dinheiro quando morarmos juntos?",
          "Qual projeto pessoal você gostaria de ter o meu apoio?",
          "Qual aventura você quer viver antes de completar 40 anos?",
          "Como você quer que a gente comemore nossas datas especiais?",
          "O que te anima mais quando pensa no nosso futuro?"
        ]
      },
      {
        id: "distancia",
        label: "Namoro à distância",
        topics: [
          "Qual é a coisa que você mais sente falta quando estamos longe?",
          "Qual horário do dia você mais gosta de conversar comigo?",
          "O que podemos fazer juntos por vídeo para parecer que estamos perto?",
          "Qual será a primeira coisa que faremos quando nos vermos?",
          "Como você se sente quando passamos dias sem nos falar?",
          "O que te ajuda a lidar com a saudade?",
          "Qual foi a nossa chamada de vídeo mais engraçada?",
          "Que filme ou série podemos assistir ao mesmo tempo?",
          "Quais regras de comunicação funcionam melhor para você?",
          "Qual cidade você gostaria que fosse a nossa para morar juntos?",
          "Qual presente simples você gostaria de receber pelo correio?",
          "O que você mais admira em como a gente se mantém firme?"
        ]
      },
      {
        id: "romanticas",
        label: "Românticas",
        topics: [
          "Qual foi o momento em que você percebeu que estava apaixonado por mim?",
          "O que eu faço que faz seu coração acelerar?",
          "Qual é a nossa memória favorita juntos?",
          "Que gesto de carinho vale mais para você que mil palavras?",
          "Qual é o seu lugar favorito para estar comigo?",
          "O que te faz sentir mais seguro ao meu lado?",
          "Que música te lembra de mim?",
          "Qual foi o melhor presente que eu já te dei?",
          "O que você mais ama nas nossas manhãs de domingo?",
          "Qual elogio meu você nunca esquece?",
          "Como você descreveria nosso primeiro encontro?",
          "Se pudesse reviver um dia nosso, qual seria?"
        ]
      }
    ],
    howTo: [
      "Escolha um momento sem pressa: jantar, estrada, sofá ou chamada de vídeo, sem celular por perto.",
      "Sorteie uma pergunta e responda primeiro, para o outro se sentir à vontade.",
      "Escute de verdade, faça uma pergunta de volta e não corrija a resposta do outro.",
      "Se a pergunta não for a do dia, sorteie outra. Não precisa responder tudo na mesma noite."
    ],
    faq: [
      {
        question: "Quais perguntas fazer ao namorado ou namorada?",
        answer:
          "Comece com as leves: infância, sonhos e comidas favoritas. Quando a conversa fluir, vá para as profundas, como o que significa amor e do que cada um tem medo. O grupo “Para se conhecer” é um bom começo."
      },
      {
        question: "Que perguntas fazer em um namoro novo?",
        answer:
          "Perguntas sobre gostos, família, sonhos e como a pessoa imagina o fim de semana ideal. Evite as que cobram o futuro logo no começo, como filhos e morar junto."
      },
      {
        question: "O que perguntar para o parceiro em um namoro à distância?",
        answer:
          "Foque em saudade, rotina e planos de reencontro. O grupo “Namoro à distância” traz perguntas e ideias de coisas para fazer juntos por vídeo."
      },
      {
        question: "Como puxar assunto com a pessoa que eu amo quando a conversa esfria?",
        answer:
          "Tire o celular da mão, sorteie uma pergunta divertida e ria junto. Perguntas leves como “quem seria o primeiro a sobreviver a um apocalipse zumbi” funcionam bem para reaquecer."
      },
      {
        question: "Casais que estão juntos há muito tempo ainda precisam dessas perguntas?",
        answer:
          "Sim. As pessoas mudam, e perguntas sobre sonhos, medos e futuro mostram versões novas de quem você já conhece. Tente uma por semana."
      }
    ]
  },
  {
    path: "/pt/perguntas-para-conhecer-alguem",
    enPath: "/21-questions",
    englishLabel: "21 Questions",
    metaTitle: "Perguntas para Conhecer Alguém: {n} Ideias e 21 Perguntas",
    description:
      "{n} perguntas para conhecer alguém a dois: primeiro encontro, amizade nova, as 21 perguntas clássicas, valores, gostos e histórias. Sorteie uma e comece a conversar.",
    title: "Perguntas para conhecer alguém de verdade",
    lead: "Conhecer uma pessoa nova pede perguntas melhores do que “o que você faz da vida?”. Sorteie entre {n} perguntas para primeiro encontro, amizade nova, as 21 perguntas clássicas, valores, gostos e histórias, e transforme a conversa em algo que vale a pena.",
    buttonLabel: "Sortear pergunta",
    mode: "card",
    sibling: { label: "Conhecer alguém", detail: "21 perguntas e mais", emoji: "🤝" },
    groups: [
      {
        id: "primeiro-encontro",
        label: "Primeiro encontro",
        topics: [
          "Qual é o seu plano perfeito para um sábado sem compromissos?",
          "O que você estava fazendo antes de a gente se encontrar hoje?",
          "Qual foi o melhor lugar que você já conheceu na cidade?",
          "O que você pediria para comer agora, sem se preocupar com o preço?",
          "Qual foi a última coisa que te fez rir de verdade?",
          "Você é mais de manhã ou de noite?",
          "Qual série ou filme você recomendaria hoje?",
          "Qual foi o último show ou evento que você foi?",
          "O que você faz quando tem um dia de folga inesperado?",
          "Quais três lugares você quer conhecer antes de fazer 40 anos?",
          "Qual é um hábito seu que as pessoas acham estranho?",
          "O que te atraiu a vir aqui hoje?"
        ]
      },
      {
        id: "amizade",
        label: "Amizade nova",
        topics: [
          "O que você faz que te deixa tão focado que o tempo passa sem perceber?",
          "Qual é um hobby que você começou há pouco tempo?",
          "Como você conheceu seus melhores amigos?",
          "Qual é o seu jeito favorito de passar tempo com amigos?",
          "O que você valoriza mais em uma amizade?",
          "Qual foi a última coisa que você aprendeu e achou incrível?",
          "Você prefere conversas longas ou rolês cheios de gente?",
          "Qual é o seu podcast, canal ou perfil favorito agora?",
          "Que tipo de música você ouve quando está de bom humor?",
          "Qual foi a melhor festa a que você já foi?",
          "Qual lugar da cidade você levaria um amigo novo?",
          "O que você gostaria de fazer mais com amigos?"
        ]
      },
      {
        id: "21-perguntas",
        label: "21 perguntas clássicas",
        topics: [
          "Qual é o seu nome completo e a história por trás dele?",
          "Onde você nasceu e como era crescer lá?",
          "Qual é o seu maior sonho?",
          "Qual é o seu maior medo?",
          "Se pudesse jantar com qualquer pessoa, viva ou não, quem seria?",
          "Qual foi a última vez que você chorou?",
          "Qual é o seu talento escondido?",
          "O que você faria se ganhasse na loteria?",
          "Qual foi a melhor decisão que você já tomou?",
          "Qual é a sua maior qualidade e o seu maior defeito?",
          "Qual é a lembrança mais antiga que você tem?",
          "Que conselho você daria para o seu eu de 15 anos?"
        ]
      },
      {
        id: "valores",
        label: "Valores e visão de mundo",
        topics: [
          "O que significa uma vida bem vivida para você?",
          "Qual valor você nunca abriria mão?",
          "Qual foi a mudança de opinião mais importante que você já teve?",
          "O que você acha mais importante: dinheiro, tempo ou saúde?",
          "O que te dá sensação de propósito?",
          "Qual problema do mundo você gostaria de ajudar a resolver?",
          "Quem foi a pessoa que mais influenciou o seu jeito de pensar?",
          "Quando você sente que está sendo a melhor versão de si?",
          "O que você acha que as pessoas entendem errado sobre você?",
          "Como você lida com o fracasso?",
          "O que você considera sucesso?",
          "Em que você acredita, mesmo sem poder provar?"
        ]
      },
      {
        id: "gostos",
        label: "Gostos e preferências",
        topics: [
          "Qual é a música que você ouviria repetidamente por uma semana?",
          "Praia, campo ou cidade grande?",
          "Qual é a sua comida favorita de infância?",
          "Cachorro ou gato, e por quê?",
          "Qual livro ou filme mudou sua forma de ver o mundo?",
          "Qual é o seu esporte favorito, para jogar ou assistir?",
          "Se pudesse ter uma habilidade de graça, qual seria?",
          "Você prefere planejar a viagem ou improvisar?",
          "Qual jogo (de tabuleiro, celular ou videogame) você nunca enjoa?",
          "Doce ou salgado?",
          "Qual cheiro te lembra de casa?",
          "Qual é a sua estação do ano favorita?"
        ]
      },
      {
        id: "historias",
        label: "Histórias e memórias",
        topics: [
          "Qual foi a viagem mais maluca que você já fez?",
          "Qual é a história mais engraçada da sua família?",
          "Qual foi o maior perrengue que você passou e hoje dá risada?",
          "Qual foi o seu primeiro emprego e o que você aprendeu nele?",
          "Qual é a melhor lembrança que você tem com seus avós?",
          "Qual foi a maior surpresa que você já recebeu?",
          "Qual foi o melhor presente que você já deu?",
          "Qual foi o momento mais orgulhoso da sua vida?",
          "Qual foi a vez em que você mais passou vergonha?",
          "Qual foi a coisa mais corajosa que você já fez?",
          "Qual foi o professor ou a pessoa que marcou sua vida?",
          "Qual foi o dia mais perfeito que você já teve?"
        ]
      }
    ],
    howTo: [
      "Sorteie uma pergunta e faça com curiosidade, sem cara de entrevista.",
      "Escute a resposta inteira e faça uma pergunta de acompanhamento antes de passar para a próxima.",
      "Responda também. Uma conversa boa é troca, não interrogatório.",
      "Se o assunto não rolar, sorteie outra ou troque de grupo; nem toda pergunta serve para toda hora."
    ],
    faq: [
      {
        question: "Que perguntas fazer para conhecer alguém?",
        answer:
          "As melhores são abertas e pedem uma história, como “qual foi a viagem mais maluca que você já fez?”. Evite as que têm resposta de uma palavra e comece pelo que é leve."
      },
      {
        question: "Quais são as 21 perguntas para conhecer alguém?",
        answer:
          "O jogo das 21 perguntas mistura sonhos, medos, gostos e histórias. O grupo “21 perguntas clássicas” traz as mais usadas, e você pode combinar com os outros grupos para completar as 21."
      },
      {
        question: "O que perguntar em um primeiro encontro?",
        answer:
          "Foque em prazer e curiosidade: o plano perfeito de sábado, a última coisa que fez rir e o que a pessoa pediria para comer. Evite ex-relacionamentos e salário."
      },
      {
        question: "Como puxar assunto com uma pessoa nova sem ser estranho?",
        answer:
          "Comece pelo contexto, como o lugar onde estão, e pergunte algo pequeno. Depois passe para gostos e histórias. Sorrir e responder também ajuda a conversa fluir."
      },
      {
        question: "Qual é a diferença entre essas perguntas e as de quebra-gelo?",
        answer:
          "As de quebra-gelo são para grupos, como turmas e reuniões. Estas são para conversar com uma pessoa só, com mais calma e mais profundidade."
      }
    ]
  }
];
