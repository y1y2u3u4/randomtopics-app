// French decks for the standalone /fr pages (2026-10-27). Written in French
// from scratch (not translated from the English decks) around the phrasings
// French users search for: sujet de discussion, question du jour, tu préfères,
// idées de mime, sujets de débat.

import type { LocaleTopicGroup } from "@/components/LocaleTopicPicker";

export const FR_CONVERSATION: LocaleTopicGroup[] = [
  {
    id: "legers",
    label: "Légers et drôles",
    topics: [
      "Quel plat pourrais-tu manger toute la semaine sans t'en lasser ?",
      "Quel super-pouvoir complètement inutile aimerais-tu avoir ?",
      "Quelle est la dernière chose qui t'a fait pleurer de rire ?",
      "Quelle série conseillerais-tu à n'importe qui ?",
      "Quel est ton snack préféré à minuit ?",
      "Quelle chanson ne quitte jamais ta playlist ?",
      "Si ta journée était un film, quel serait son genre ?",
      "Quelle appli utilises-tu le plus sans vouloir l'admettre ?",
    ],
  },
  {
    id: "se-connaitre",
    label: "Pour mieux se connaître",
    topics: [
      "Que voulais-tu faire plus tard quand tu étais enfant ?",
      "Quel endroit te donne l'impression d'être chez toi, même loin de la maison ?",
      "Quelle est la meilleure décision que tu aies prise ces dernières années ?",
      "Quelle habitude t'a changé la vie ?",
      "Qui t'a le plus influencé dans ta vie ?",
      "Quel est ton meilleur souvenir d'école ?",
      "Que fais-tu quand tu as besoin de recharger tes batteries ?",
      "Quel conseil donnerais-tu à toi-même il y a dix ans ?",
    ],
  },
  {
    id: "voyages",
    label: "Voyages et vacances",
    topics: [
      "Quel voyage ferais-tu si l'argent n'était pas un problème ?",
      "Mer ou montagne ? Pourquoi ?",
      "Quelle région de France tout le monde devrait découvrir ?",
      "Quel est le plat le plus étrange que tu aies goûté en voyage ?",
      "Tu préfères un programme millimétré ou partir à l'aventure ?",
      "Dans quel pays vivrais-tu un an ?",
      "Quel a été ton pire souvenir de vacances ?",
      "Quel endroit près de chez toi reste sur ta liste ?",
    ],
  },
  {
    id: "hypotheses",
    label: "Et si… ?",
    topics: [
      "Si tu gagnais au Loto demain, que changerais-tu en premier ?",
      "Si tu pouvais dîner avec n'importe qui dans l'histoire, qui choisirais-tu ?",
      "Si tu pouvais maîtriser une compétence d'un claquement de doigts, laquelle ?",
      "Si tu pouvais vivre à une autre époque, laquelle choisirais-tu ?",
      "Si tu devais ouvrir un commerce demain, ce serait quoi ?",
      "Si les animaux parlaient, lequel serait le plus agaçant ?",
      "Si tu pouvais effacer une invention de l'histoire, laquelle ?",
      "Si tu pouvais lire dans les pensées pendant une journée, en profiterais-tu ?",
    ],
  },
  {
    id: "profonds",
    label: "Plus profonds",
    topics: [
      "Qu'est-ce qui compte le plus pour toi dans une amitié ?",
      "De quoi es-tu le plus fier aujourd'hui ?",
      "Faut-il toujours dire la vérité, même quand elle fait mal ?",
      "Qu'est-ce qui te fait vraiment peur à l'idée de grandir ?",
      "À quel moment as-tu senti que tu avais changé ?",
      "Que voudrais-tu qu'on retienne de toi ?",
      "Le bonheur dépend-il plus de nous ou des circonstances ?",
      "Quel risque regrettes-tu de ne pas avoir pris ?",
    ],
  },
];

export const FR_QOTD: LocaleTopicGroup[] = [
  {
    id: "legeres",
    label: "Légères",
    topics: [
      "Quel est ton petit-déjeuner idéal ?",
      "Quelle est la dernière chose qui t'a fait sourire ?",
      "Quel animal serais-tu pour une journée ?",
      "Quelle odeur te rappelle l'enfance ?",
      "Quelle est ta chanson du moment ?",
      "Quel dessert choisirais-tu pour ton dernier repas ?",
      "Quel est le meilleur film à regarder sous un plaid ?",
      "Quel mot français aimes-tu le plus prononcer ?",
    ],
  },
  {
    id: "classe",
    label: "Pour la classe",
    topics: [
      "Quelle matière aimerais-tu étudier plus longtemps ?",
      "Quel est le meilleur conseil qu'un prof t'ait donné ?",
      "Quel livre pourrait être étudié en cours selon toi ?",
      "Qu'est-ce qui t'aide à te concentrer ?",
      "Quelle est la chose la plus utile apprise cette année ?",
      "Si tu devais enseigner une heure, ce serait sur quel sujet ?",
      "Quel est ton meilleur souvenir de sortie scolaire ?",
      "Qu'aimerais-tu changer dans ta salle de classe idéale ?",
    ],
  },
  {
    id: "equipe",
    label: "Pour l'équipe",
    topics: [
      "Quelle est ta meilleure astuce pour bien démarrer la journée ?",
      "Quel outil au travail ne pourrais-tu plus quitter ?",
      "Quel a été ton premier job ?",
      "Qu'est-ce qui te motive le plus le lundi matin ?",
      "Quelle compétence aimerais-tu apprendre cette année ?",
      "Quelle réussite récente de l'équipe t'a rendu fier ?",
      "Quel est ton rituel pour décompresser après une journée chargée ?",
      "Quel collègue imaginaire serait idéal pour un projet ?",
    ],
  },
  {
    id: "reflexion",
    label: "Pour réfléchir",
    topics: [
      "Qu'est-ce qui te donne de l'énergie en ce moment ?",
      "Pour quoi te sens-tu reconnaissant aujourd'hui ?",
      "Quelle petite victoire as-tu eue cette semaine ?",
      "Quelle peur aimerais-tu dépasser ?",
      "Quelle valeur guide tes choix au quotidien ?",
      "Quel moment de ta journée est le plus calme ?",
      "Qu'as-tu appris sur toi récemment ?",
      "Si tu pouvais refaire une journée de ta vie, laquelle ?",
    ],
  },
];

export const FR_WOULD_YOU_RATHER: LocaleTopicGroup[] = [
  {
    id: "classiques",
    label: "Classiques",
    topics: [
      "Tu préfères pouvoir voler ou être invisible ?",
      "Tu préfères ne plus jamais avoir froid ou ne plus jamais avoir chaud ?",
      "Tu préfères voyager dans le passé ou dans le futur ?",
      "Tu préfères parler toutes les langues ou parler aux animaux ?",
      "Tu préfères vivre à la mer ou à la montagne ?",
      "Tu préfères savoir quand tu mourras ou comment tu mourras ?",
      "Tu préfères être très riche mais seul, ou avoir une vie simple et entouré ?",
      "Tu préfères ne plus jamais dormir ou ne plus jamais manger ?",
    ],
  },
  {
    id: "droles",
    label: "Drôles",
    topics: [
      "Tu préfères avoir des mains de géant ou des pieds de nain ?",
      "Tu préfères que ta voix soit celle d'un dessin animé ou que tu marches toujours à reculons ?",
      "Tu préfères manger des pâtes à tous les repas ou des crêpes à tous les repas ?",
      "Tu préfères avoir un perroquet qui répète tes secrets ou un chat qui juge tout ?",
      "Tu préfères danser à chaque fois que tu entends de la musique ou chanter à chaque fois que tu es stressé ?",
      "Tu préfères que tout le monde lise tes SMS ou ton historique de recherche ?",
      "Tu préfères transpirer du sirop d'érable ou pleurer du chocolat ?",
      "Tu préfères te réveiller chaque matin avec une coiffure folle ou des chaussettes dépareillées pour toujours ?",
    ],
  },
  {
    id: "dilemmes",
    label: "Dilemmes difficiles",
    topics: [
      "Tu préfères dire une vérité qui blesse ou un mensonge qui protège ?",
      "Tu préfères réussir grâce à la chance ou échouer après avoir tout donné ?",
      "Tu préfères tout oublier de ton passé ou tout savoir de ton avenir ?",
      "Tu préfères être admiré de tous ou aimé de quelques personnes ?",
      "Tu préfères perdre tous tes souvenirs photo ou tous tes contacts ?",
      "Tu préfères un métier passionnant mal payé ou un métier ennuyeux très bien payé ?",
      "Tu préfères que le monde n'ait plus de guerre ou plus de maladie ?",
      "Tu préfères pouvoir changer ton passé ou connaître ton avenir ?",
    ],
  },
  {
    id: "amis",
    label: "Entre amis",
    topics: [
      "Tu préfères une soirée jeux de société ou une soirée karaoké ?",
      "Tu préfères partir une semaine en road trip ou en croisière avec tes amis ?",
      "Tu préfères que tes amis choisissent ta tenue ou ton prochain voyage ?",
      "Tu préfères organiser la fête ou être l'invité d'honneur ?",
      "Tu préfères un barbecue entre voisins ou un apéro sur la terrasse ?",
      "Tu préfères gagner une partie de Monopoly ou de Mario Kart ?",
      "Tu préfères offrir un cadeau parfait ou en recevoir un ?",
      "Tu préfères refaire ta chambre toi-même ou la laisser à tes amis ?",
    ],
  },
  {
    id: "couple",
    label: "En couple",
    topics: [
      "Tu préfères un dîner aux chandelles à la maison ou un grand restaurant ?",
      "Tu préfères un week-end surprise ou un voyage planifié des mois à l'avance ?",
      "Tu préfères recevoir un mot écrit à la main ou une chanson dédiée ?",
      "Tu préfères regarder un film ensemble ou cuisiner ensemble ?",
      "Tu préfères vivre dans une petite maison à la campagne ou un appartement en ville ?",
      "Tu préfères une relation sans disputes mais sans surprises ou pleine de surprises avec quelques disputes ?",
      "Tu préfères que ton partenaire soit plus drôle ou plus attentionné ?",
      "Tu préfères fêter chaque anniversaire de rencontre ou un seul grand jour par an ?",
    ],
  },
];

export const FR_CHARADES: LocaleTopicGroup[] = [
  {
    id: "animaux",
    label: "Animaux",
    topics: ["Un flamant rose", "Un kangourou", "Un chat qui tombe", "Un pingouin", "Une grenouille", "Un éléphant", "Un singe", "Un serpent", "Un chien qui rapporte la balle", "Un escargot"],
  },
  {
    id: "metiers",
    label: "Métiers",
    topics: ["Boulanger", "Pompier", "Coiffeur", "Chef d'orchestre", "Dentiste", "Serveur de café", "Footballeur", "Astronaute", "Jardinier", "Cascadeur"],
  },
  {
    id: "actions",
    label: "Actions du quotidien",
    topics: ["Se brosser les dents", "Faire une crêpe", "Prendre le métro bondé", "Attendre le bus sous la pluie", "Faire du vélo", "Monter un meuble", "Chercher ses clés", "Éternuer en public", "Repasser une chemise", "Porter des courses lourdes"],
  },
  {
    id: "films",
    label: "Films et séries",
    topics: ["Le Roi Lion", "Titanic", "Astérix et Obélix", "Harry Potter", "Intouchables", "Les Minions", "La Reine des neiges", "Spider-Man", "Le Seigneur des anneaux", "Shrek"],
  },
  {
    id: "objets",
    label: "Objets et lieux",
    topics: ["La tour Eiffel", "Un parapluie", "Un aspirateur", "Une montgolfière", "Un frigo", "Un piano", "Un ascenseur en panne", "Une piscine", "Un marché", "Un train à grande vitesse"],
  },
];

export const FR_DEBATE: LocaleTopicGroup[] = [
  {
    id: "ecole",
    label: "École et éducation",
    topics: [
      "Faut-il supprimer les notes à l'école ?",
      "Le portable doit-il être interdit au collège et au lycée ?",
      "L'uniforme scolaire devrait-il être obligatoire ?",
      "Les devoirs à la maison sont-ils utiles ?",
      "Faut-il commencer l'école plus tard le matin ?",
      "L'intelligence artificielle a-t-elle sa place dans les devoirs ?",
      "Le redoublement est-il une bonne solution ?",
      "L'éducation financière devrait-elle être enseignée à l'école ?",
    ],
  },
  {
    id: "technologie",
    label: "Technologie",
    topics: [
      "Les réseaux sociaux rendent-ils les gens plus seuls ?",
      "L'intelligence artificielle va-t-elle détruire plus d'emplois qu'elle n'en crée ?",
      "Faut-il limiter le temps d'écran des enfants par la loi ?",
      "Les jeux vidéo devraient-ils être considérés comme un sport ?",
      "La voiture électrique est-elle vraiment écologique ?",
      "Peut-on tout partager en ligne sans conséquences ?",
      "Le télétravail doit-il devenir la norme ?",
      "Les robots devraient-ils avoir des droits ?",
    ],
  },
  {
    id: "societe",
    label: "Société",
    topics: [
      "Faut-il instaurer la semaine de quatre jours ?",
      "Le vote devrait-il être obligatoire ?",
      "Faut-il autoriser le vote à seize ans ?",
      "La célébrité donne-t-elle le droit de tout dire ?",
      "Est-il juste que les riches paient davantage d'impôts ?",
      "Les zoos ont-ils encore leur place aujourd'hui ?",
      "Le sport professionnel est-il trop payé ?",
      "La télé-réalité reflète-t-elle la société ?",
    ],
  },
  {
    id: "environnement",
    label: "Environnement",
    topics: [
      "Faut-il interdire les vols courts quand le train existe ?",
      "Chaque citoyen doit-il trier ses déchets sous peine d'amende ?",
      "Le nucléaire est-il la solution pour le climat ?",
      "Faut-il réduire notre consommation de viande ?",
      "Les grandes entreprises sont-elles les premières responsables du réchauffement ?",
      "Faut-il taxer le plastique à usage unique ?",
      "La ville de demain doit-elle bannir les voitures du centre ?",
      "Peut-on concilier croissance économique et écologie ?",
    ],
  },
  {
    id: "fun",
    label: "Pour rire",
    topics: [
      "Le pain au chocolat ou la chocolatine : qui a raison ?",
      "L'ananas a-t-il sa place sur une pizza ?",
      "Vaut-il mieux être un lève-tôt ou un oiseau de nuit ?",
      "Le livre est-il toujours meilleur que le film ?",
      "Les chats sont-ils meilleurs que les chiens ?",
      "Faut-il mettre le lait avant ou après les céréales ?",
      "Le fromage ou le dessert : lequel termine un vrai repas ?",
      "Peut-on être ami avec son ex ?",
    ],
  },
];

function prefixed(groups: LocaleTopicGroup[], prefix: string, take: number): LocaleTopicGroup[] {
  return groups.map((g) => ({ ...g, id: `${prefix}-${g.id}`, topics: g.topics.slice(0, take) }));
}

/** Home page deck: a spread of conversation, debate and everyday-question topics. */
export const FR_GENERAL: LocaleTopicGroup[] = [
  ...prefixed(FR_CONVERSATION.slice(0, 3), "conv", 8),
  ...prefixed(FR_DEBATE.slice(0, 3), "debat", 8),
  ...prefixed(FR_QOTD.slice(3), "reflexion", 8),
];
