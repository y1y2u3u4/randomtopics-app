import type { LocalePageConfig } from "../types";

const P1: LocalePageConfig = {
  path: "/fr/roue-des-sujets",
  enPath: "/spin-the-wheel",
  englishLabel: "Spin the Wheel",
  metaTitle: "Roue des sujets : {n} idées à tirer au sort (gratuit, 2026)",
  description:
    "Roue des sujets aléatoire : lance la roue et tombe sur un sujet de discussion, un défi, un débat ou une curiosité. {n} idées, gratuit, sans inscription.",
  title: "Roue des sujets",
  lead: "Une roue aléatoire de {n} sujets pour relancer une conversation, animer un apéro, une pause en classe ou une soirée entre potes. Lance la roue, laisse le hasard choisir et enchaîne.",
  buttonLabel: "Lancer la roue",
  mode: "wheel",
  sibling: { label: "Roue des sujets", detail: "Le hasard choisit pour toi", emoji: "🎡" },
  groups: [
    {
      id: "discussion",
      label: "Sujets de discussion",
      topics: [
        "Le meilleur repas que tu aies mangé de ta vie",
        "Le dernier fou rire que tu as eu et pourquoi",
        "Une appli que tu ne pourrais plus supprimer",
        "Le souvenir de vacances que tu racontes à chaque fois",
        "Le film que tu peux revoir mille fois",
        "Ton plus gros fail en cuisine",
        "La chanson qui te met de bonne humeur à coup sûr",
        "Ce que tu ferais d'une journée entière sans écran",
        "Le pire cadeau que tu aies reçu",
        "Une habitude bizarre que tu as depuis tout petit",
        "Le métier que tu aurais voulu faire à 8 ans",
        "Le voisin ou la voisine le/la plus marquant(e) de ta vie",
        "Ta recette de pâtes (ou de crêpes) imbattable",
        "Le meilleur conseil qu'on t'ait donné",
        "Un endroit en France que tout le monde devrait visiter",
        "La série que tu as regardée d'une traite",
      ],
    },
    {
      id: "defis",
      label: "Défis et gages",
      topics: [
        "Raconte ta journée en parlant comme un présentateur météo",
        "Fais une imitation d'un membre du groupe pendant 20 secondes",
        "Décris ta pièce préférée sans prononcer le mot « maison »",
        "Chante le refrain d'une chanson de ton enfance",
        "Parle pendant 30 secondes sans dire « euh »",
        "Invente une pub pour un objet qui traîne autour de toi",
        "Mime un film, les autres ont une minute pour deviner",
        "Fais un compliment sincère à chaque personne présente",
        "Dessine ton animal préféré les yeux fermés",
        "Raconte une blague, sans rire avant la fin",
        "Prononce trois fois vite « les chaussettes de l'archiduchesse »",
        "Explique les règles d'un sport à quelqu'un qui n'en a jamais entendu parler",
        "Fais deviner un plat uniquement avec des gestes",
        "Invente un slogan pour ta ville ou ton quartier",
      ],
    },
    {
      id: "debat",
      label: "Débats amicaux",
      topics: [
        "Pain au chocolat ou chocolatine : qui a raison ?",
        "Faut-il mettre l'ananas sur la pizza ?",
        "Les devoirs à la maison devraient-ils exister ?",
        "Vaut-il mieux vivre à la campagne ou en ville ?",
        "Le livre est-il toujours meilleur que le film ?",
        "Le dessert est-il le vrai plat principal du repas ?",
        "Les réseaux sociaux rapprochent-ils vraiment les gens ?",
        "Peut-on rester ami(e) avec son ex ?",
        "Le télétravail est-il l'avenir ou une fausse bonne idée ?",
        "Les vacances à la mer valent-elles mieux que celles à la montagne ?",
        "Faut-il porter un uniforme à l'école ?",
        "Le tutoiement devrait-il être généralisé au travail ?",
        "Un bon film doit-il avoir une fin heureuse ?",
        "Vaut-il mieux se lever tôt ou se coucher tard ?",
      ],
    },
    {
      id: "curiosites",
      label: "Curiosités et culture générale",
      topics: [
        "Pourquoi le ciel est-il bleu ? Essaie d'expliquer en 30 secondes",
        "Combien de pays parlent français, d'après toi ?",
        "Pourquoi dit-on « poser un lapin » à quelqu'un ?",
        "À ton avis, qui a construit la tour Eiffel et pourquoi l'a-t-on gardée ?",
        "Comment fonctionne un arc-en-ciel ?",
        "D'où vient l'expression « avoir le cafard » ?",
        "Pourquoi les flamants roses sont-ils roses ?",
        "Quel est le plus petit pays du monde et que sais-tu de lui ?",
        "Qu'est-ce qui fait qu'une baguette est « tradition » ?",
        "Quel animal a la meilleure mémoire, selon toi ?",
        "Pourquoi bâille-t-on quand quelqu'un bâille ?",
        "Que sais-tu du Tour de France et de son maillot jaune ?",
        "Comment les GPS savent-ils où nous sommes ?",
        "Quelle est l'origine du mot « bistrot » ?",
      ],
    },
  ],
  howTo: [
    "Choisis une catégorie (ou laisse « Toutes ») puis appuie sur « Lancer la roue ».",
    "Lis le sujet à voix haute et laisse chacun répondre à tour de rôle, sans interrompre.",
    "Pour un défi, fixe une limite de temps avant de commencer. Ça garde le rythme.",
    "Pas envie du sujet ? Relance la roue : le tirage évite les répétitions jusqu'à la fin de la liste.",
  ],
  faq: [
    {
      question: "À quoi sert une roue des sujets ?",
      answer:
        "Elle sert à choisir un thème sans se disputer : pour lancer une discussion, trouver un défi, un débat ou une curiosité quand le groupe manque d'inspiration. C'est pratique en soirée, en classe, en visio avec l'équipe ou en famille.",
    },
    {
      question: "Comment utiliser la roue en classe ?",
      answer:
        "Projette la page au tableau et fais tourner la roue pour désigner le sujet d'un tour de parole ou d'un petit débat de 5 minutes. Les catégories « débats » et « curiosités » marchent bien pour s'échauffer avant un oral.",
    },
    {
      question: "La roue peut-elle donner deux fois le même sujet ?",
      answer:
        "Non, tant que tu n'as pas fait le tour de la liste affichée, les sujets déjà tirés ne reviennent pas. Si tu veux repartir de zéro, recharge simplement la page.",
    },
    {
      question: "Est-ce adapté aux enfants et aux ados ?",
      answer:
        "Oui, les sujets restent légers et sans contenu choquant. Pour des plus jeunes, choisis les catégories « discussion » et « défis » et adapte la difficulté des questions de culture générale.",
    },
    {
      question: "Peut-on jouer en ligne avec des amis à distance ?",
      answer:
        "Oui : partage ton écran sur Discord, Teams ou WhatsApp, lance la roue et laisse chacun répondre. Le bouton « Copier » permet aussi d'envoyer le sujet tiré dans la conversation.",
    },
  ],
};

const P2: LocalePageConfig = {
  path: "/fr/sujets-de-discours",
  enPath: "/speech",
  englishLabel: "Speech Topic Generator",
  metaTitle: "Sujets de discours : {n} idées pour l'oral, un exposé ou un toast",
  description:
    "{n} sujets de discours pour un exposé, le grand oral du bac, un toast de mariage ou une présentation. Tire un sujet au hasard et parle 1 minute, gratuit.",
  title: "Sujets de discours",
  lead: "{n} idées de discours pour t'entraîner à l'oral : exposés de classe, grand oral, toasts, prises de parole en association. Tire un sujet, lance le chrono d'une minute et parle sans notes.",
  buttonLabel: "Tirer un sujet",
  mode: "timer",
  sibling: { label: "Sujets de discours", detail: "Exposé, oral, toast", emoji: "🎤" },
  groups: [
    {
      id: "ecole",
      label: "Exposé et oral de classe",
      topics: [
        "Pourquoi il faut apprendre une deuxième langue dès le collège",
        "Le téléphone portable a-t-il sa place en classe ?",
        "Un héros de l'histoire de France qui mérite plus de place dans les manuels",
        "Ce que les jeux vidéo m'ont appris",
        "Pourquoi le sport devrait compter autant que les maths",
        "La cantine scolaire : peut-on la rendre meilleure ?",
        "Les devoirs servent-ils vraiment à apprendre ?",
        "Mon livre préféré et pourquoi je le recommande",
        "Comment l'intelligence artificielle change la façon d'étudier",
        "Une invention qui a changé la vie quotidienne",
        "Faut-il supprimer les notes à l'école ?",
        "Le métier que je rêve de faire plus tard",
      ],
    },
    {
      id: "grand-oral",
      label: "Grand oral et lycée",
      topics: [
        "En quoi les mathématiques permettent-elles de comprendre le monde ?",
        "Peut-on tout prévoir avec des statistiques ?",
        "L'énergie nucléaire est-elle une solution pour le climat ?",
        "La liberté d'expression a-t-elle des limites ?",
        "Que nous apprend la littérature sur l'être humain ?",
        "Les réseaux sociaux transforment-ils notre rapport à la vérité ?",
        "Faut-il avoir peur de l'intelligence artificielle ?",
        "La technologie nous rend-elle plus libres ?",
        "Pourquoi étudier l'histoire pour comprendre le présent ?",
        "Peut-on être heureux sans réussir ?",
        "L'art est-il nécessaire à la société ?",
        "Comment préserver la biodiversité près de chez nous ?",
      ],
    },
    {
      id: "persuader",
      label: "Convaincre et informer",
      topics: [
        "Pourquoi tout le monde devrait apprendre les premiers secours",
        "Les bienfaits de la lecture avant de dormir",
        "Pourquoi il faut trier ses déchets, même quand c'est pénible",
        "Les vélos en ville : un vrai progrès ou un problème de plus ?",
        "Pourquoi adopter un animal de refuge",
        "Le bénévolat comme première expérience professionnelle",
        "Cuisiner soi-même : plus sain et moins cher",
        "Pourquoi voyager seul(e) au moins une fois",
        "Dormir 8 heures n'est pas du luxe",
        "Ce que l'on peut apprendre en regardant des matchs de foot",
        "Pourquoi le jeu de société est un excellent antidote aux écrans",
        "Le bruit des villes : comment le réduire ?",
      ],
    },
    {
      id: "ceremonie",
      label: "Mariage, anniversaire, toast",
      topics: [
        "Un toast pour le mariage de ton meilleur ami",
        "Un petit mot pour les 60 ans de ta mère",
        "Un discours de départ à la retraite pour un collègue",
        "Un hommage à ta grand-mère et à ses recettes",
        "Des vœux pour le Nouvel An devant toute la famille",
        "Un discours de remerciement après un événement réussi",
        "Un toast pour un anniversaire de 30 ans",
        "Un mot de bienvenue pour un nouveau voisin",
        "Un discours pour un pot de départ en fin d'année scolaire",
        "Le témoin de mariage qui raconte comment il a rencontré le marié",
      ],
    },
    {
      id: "asso",
      label: "Association, club, équipe",
      topics: [
        "Présenter ton association de quartier en une minute",
        "Convaincre de nouveaux membres de rejoindre ton club de sport",
        "Un discours de capitaine avant un match important",
        "Candidature pour devenir délégué(e) de classe",
        "Remercier les bénévoles après une kermesse",
        "Proposer une idée pour la fête du village",
        "Motiver l'équipe avant un gros projet",
        "Annoncer la collecte pour une bonne cause",
      ],
    },
  ],
  howTo: [
    "Appuie sur « Tirer un sujet » : tu peux filtrer par catégorie (école, grand oral, toast, association).",
    "Prends 30 secondes pour noter trois idées : une accroche, un exemple concret, une conclusion.",
    "Lance le chrono d'une minute et parle à voix haute, debout si possible, sans lire tes notes.",
    "Recommence avec le même sujet en changeant d'exemple : c'est comme ça qu'on gagne en fluidité.",
  ],
  faq: [
    {
      question: "Comment trouver un sujet de discours ?",
      answer:
        "Pars de ce qui te touche ou de ce que tu maîtrises, puis choisis un angle précis plutôt qu'un thème large. Si tu hésites, tire un sujet au hasard ici et défends-le : tu verras vite si l'inspiration vient.",
    },
    {
      question: "Quels sujets pour le grand oral du bac ?",
      answer:
        "Le grand oral porte sur tes spécialités : une question qui relie un point du programme à un enjeu actuel, comme « L'énergie nucléaire est-elle une solution ? ». Les sujets de la catégorie « Grand oral et lycée » sont de bons exercices d'entraînement, à adapter à tes spés.",
    },
    {
      question: "Comment structurer un discours court ?",
      answer:
        "Utilise trois temps : une accroche (anecdote, question, chiffre), deux ou trois arguments avec un exemple chacun, puis une conclusion qui rappelle ton idée principale. En une minute, un seul exemple bien choisi suffit.",
    },
    {
      question: "Comment réussir un toast de mariage ?",
      answer:
        "Reste bref (2 à 3 minutes), raconte une anecdote sincère, évite les blagues qui pourraient gêner la famille et termine en levant ton verre. Entraîne-toi à voix haute plusieurs fois, ça enlève le trac.",
    },
    {
      question: "Comment gérer le stress avant de prendre la parole ?",
      answer:
        "Respire lentement avant de commencer, parle un peu plus doucement que d'habitude et fixe quelques visages bienveillants. S'entraîner avec le chrono d'une minute rend la vraie prise de parole beaucoup plus facile.",
    },
  ],
};

const P3: LocalePageConfig = {
  path: "/fr/plutot-ceci-ou-cela",
  enPath: "/this-or-that",
  englishLabel: "This or That",
  metaTitle: "Plutôt ceci ou cela : {n} questions à poser entre amis (2026)",
  description:
    "Jeu « plutôt ceci ou cela » : {n} paires de choix rapides sur la nourriture, le quotidien, les voyages et la pop culture. Tire une paire au hasard, gratuit.",
  title: "Plutôt ceci ou cela",
  lead: "{n} paires de choix rapides pour un jeu « plutôt ceci ou cela » entre amis, en famille ou en classe. Pas de dilemme compliqué : tu réponds au feeling, puis tu justifies.",
  buttonLabel: "Tirer une paire",
  mode: "card",
  sibling: { label: "Plutôt ceci ou cela", detail: "Des choix rapides à deux options", emoji: "⚖️" },
  groups: [
    {
      id: "nourriture",
      label: "Nourriture",
      topics: [
        "Croissant ou pain au chocolat ?",
        "Sucré ou salé ?",
        "Frites ou pâtes ?",
        "Camembert ou chèvre ?",
        "Café ou thé ?",
        "Crêpes ou gaufres ?",
        "Pizza ou burger ?",
        "Nutella ou beurre de cacahuète ?",
        "Glace vanille ou glace chocolat ?",
        "Baguette croustillante ou pain de mie ?",
        "Raclette ou fondue ?",
        "Petit-déjeuner copieux ou juste un café ?",
        "Ketchup ou mayonnaise ?",
        "Poulet rôti ou steak-frites ?",
      ],
    },
    {
      id: "quotidien",
      label: "Vie quotidienne",
      topics: [
        "Lève-tôt ou couche-tard ?",
        "Douche le matin ou le soir ?",
        "Appel ou message vocal ?",
        "Métro ou vélo ?",
        "Appartement en ville ou maison à la campagne ?",
        "Chaussettes dépareillées ou chaussettes assorties ?",
        "Grasse mat' ou balade matinale ?",
        "Livre papier ou liseuse ?",
        "Ranger tout de suite ou plus tard ?",
        "Télé le soir ou jeu de société ?",
        "Pull ou veste ?",
        "Écouter de la musique ou du silence ?",
        "Faire les courses en magasin ou en drive ?",
        "Cuisiner ou commander ?",
      ],
    },
    {
      id: "voyages",
      label: "Voyages",
      topics: [
        "Mer ou montagne ?",
        "Train ou avion ?",
        "Camping ou hôtel ?",
        "Week-end à Paris ou week-end en Provence ?",
        "Ville historique ou plage tranquille ?",
        "Voyage organisé ou itinéraire improvisé ?",
        "Road trip entre amis ou séjour en famille ?",
        "Partir l'été ou partir l'hiver ?",
        "Rome ou Barcelone ?",
        "Voir le coucher du soleil ou le lever du soleil ?",
        "Gîte à la campagne ou appart' en centre-ville ?",
        "Valise légère ou valise pleine ?",
        "Découvrir un pays lointain ou explorer le sien ?",
      ],
    },
    {
      id: "pop-culture",
      label: "Culture pop",
      topics: [
        "Film ou série ?",
        "Cinéma ou canapé ?",
        "Marvel ou Star Wars ?",
        "Rap ou pop ?",
        "Concert ou festival ?",
        "Netflix ou YouTube ?",
        "Manga ou BD franco-belge ?",
        "Astérix ou Tintin ?",
        "Jeux vidéo ou jeux de société ?",
        "Disney ou Pixar ?",
        "Lire le livre ou voir l'adaptation ?",
        "Podcast ou radio ?",
        "Playlist ou album complet ?",
        "Match en direct ou rediffusion ?",
      ],
    },
    {
      id: "droles",
      label: "Pour rire",
      topics: [
        "Avoir des mains de géant ou des pieds de géant ?",
        "Parler comme un pirate ou marcher comme un robot ?",
        "Un chat qui parle ou un chien qui vole ?",
        "Manger un citron entier ou une cuillère de moutarde ?",
        "Toujours avoir un peu froid ou toujours un peu chaud ?",
        "Une télécommande qui rembobine ou qui met en pause ?",
        "Dormir dans un hamac ou dans un lit à baldaquin ?",
        "Un déguisement de licorne ou de dinosaure ?",
        "Rire comme un âne ou éternuer comme une souris ?",
        "Un super pouvoir inutile mais drôle ou un petit pouvoir pratique ?",
        "Chanter sous la douche ou danser en faisant la vaisselle ?",
        "Une soirée pyjama ou une soirée déguisée ?",
        "Un vélo à roues carrées ou une voiture en forme de banane ?",
      ],
    },
  ],
  howTo: [
    "Appuie sur « Tirer une paire » pour afficher deux options.",
    "Réponds tout de suite, sans réfléchir : le jeu marche mieux au feeling.",
    "Explique ton choix en une phrase. C'est souvent là que les discussions deviennent drôles.",
    "En groupe, tout le monde répond en même temps en montrant la gauche ou la droite, puis on compare.",
  ],
  faq: [
    {
      question: "Comment jouer à « plutôt ceci ou cela » ?",
      answer:
        "On propose deux options et chaque joueur choisit la sienne, puis explique pourquoi. Il n'y a pas de bonne ou de mauvaise réponse : le but est de se découvrir et de rigoler des choix des autres.",
    },
    {
      question: "Quelle est la différence avec « Tu préfères » ?",
      answer:
        "« Plutôt ceci ou cela » propose des paires courtes et légères (café ou thé ?), alors que « Tu préfères » mise plus souvent sur des dilemmes et des situations absurdes. Les deux se jouent très bien l'un après l'autre.",
    },
    {
      question: "Peut-on y jouer en classe ou avec des enfants ?",
      answer:
        "Oui, c'est un bon brise-glace pour la rentrée ou une fin de cours. Garde les catégories « nourriture », « voyages » et « pour rire », puis demande aux élèves de justifier leur choix en une phrase pour pratiquer l'oral.",
    },
    {
      question: "Comment rendre le jeu plus drôle ?",
      answer:
        "Chronomètre 5 secondes pour répondre, interdis de dire « les deux » et demande des arguments absurdes. Tu peux aussi inventer ta propre paire à la suite de chaque tirage.",
    },
    {
      question: "Peut-on partager une paire avec quelqu'un ?",
      answer:
        "Oui, le bouton « Copier » permet de coller la paire dans WhatsApp, Discord ou Instagram pour lancer le débat à distance.",
    },
  ],
};

const P4: LocalePageConfig = {
  path: "/fr/dilemmes-ethiques",
  enPath: "/topics/ethical-dilemma-questions",
  englishLabel: "Ethical Dilemma Questions",
  metaTitle: "Dilemmes éthiques : {n} exemples pour la philo et le débat",
  description:
    "{n} exemples de dilemmes éthiques et moraux : vie et santé, travail, technologie, amitié, société. Une situation, une question, idéal pour la philo ou un débat.",
  title: "Dilemmes éthiques",
  lead: "{n} dilemmes éthiques et moraux avec une situation concrète et une vraie question. Utilise-les en cours de philo, pour un débat en classe ou pour discuter autour d'un café.",
  buttonLabel: "Tirer un dilemme",
  mode: "card",
  sibling: { label: "Dilemmes éthiques", detail: "Situations pour débattre", emoji: "🧭" },
  groups: [
    {
      id: "vie-sante",
      label: "Vie et santé",
      topics: [
        "Un hôpital n'a qu'un seul respirateur pour deux patients : un jeune adulte et une personne âgée. Qui doit en bénéficier, et sur quel critère ?",
        "Ton ami te confie qu'il cache une maladie grave à sa famille. Dois-tu respecter son secret ?",
        "Un médicament coûte une fortune mais sauverait un enfant. Faut-il que l'État paie à n'importe quel prix ?",
        "Un parent refuse un traitement pour son enfant pour des raisons de croyance. Le médecin doit-il passer outre ?",
        "Tu découvres qu'un proche malade fait un régime dangereux. Tu t'en mêles ou tu respectes son choix ?",
        "On peut désormais choisir certaines caractéristiques d'un futur bébé. Où poser la limite ?",
        "Un patient demande à son médecin de l'aider à mourir. Que doit répondre le médecin ?",
        "Un vaccin protège la société mais présente un risque minuscule. Peut-on l'imposer ?",
        "Tu es secouriste : une seule personne peut être sauvée à temps, une inconnue ou ta voisine. Qui choisis-tu ?",
      ],
    },
    {
      id: "travail",
      label: "Travail",
      topics: [
        "Tu vois un collègue sympathique gonfler ses notes de frais. Tu le signales ou tu fermes les yeux ?",
        "Ton patron te demande d'arrondir un chiffre pour ne pas perdre un client. Que fais-tu ?",
        "Tu découvres qu'une collègue est payée moins que toi pour le même poste. Tu en parles ?",
        "On te propose un poste mieux payé dans une entreprise polluante. Tu acceptes ?",
        "Un candidat a menti sur son CV mais est excellent. Le recrutes-tu quand même ?",
        "Tu dois licencier une personne pour sauver cinq emplois. Comment choisis-tu ?",
        "Un client t'offre un cadeau de valeur. Peut-on l'accepter ?",
        "Tu surprends ton manager à parler mal d'un collègue absent. Tu interviens ?",
        "Ton équipe a fait une erreur, mais on t'attribue tout le mérite. Tu corriges ?",
      ],
    },
    {
      id: "technologie",
      label: "Technologie",
      topics: [
        "Une voiture autonome doit choisir entre percuter un obstacle et blesser son passager ou dévier et blesser un piéton. Comment la programmer ?",
        "Une appli te rend plus productif mais lit tes messages. L'utilises-tu ?",
        "Une IA peut écrire ton devoir en 10 secondes. Est-ce de la triche ou un outil comme un autre ?",
        "Une caméra de surveillance réduit la délinquance dans ton quartier mais filme tout le monde. Pour ou contre ?",
        "Un site a fuité les données privées de milliers de personnes. Dois-tu les consulter par curiosité ?",
        "Un robot de compagnie remplace les visites à une personne âgée seule. Est-ce un progrès ?",
        "Tu trouves une faille de sécurité dans le site de ton lycée. Tu la signales ou tu l'utilises ?",
        "Une entreprise propose de recréer la voix d'un proche décédé grâce à l'IA. Faut-il le faire ?",
        "Un algorithme décide qui obtient un prêt. Est-il plus juste qu'un conseiller humain ?",
      ],
    },
    {
      id: "amitie-famille",
      label: "Amitié et famille",
      topics: [
        "Tu apprends que le conjoint de ton meilleur ami le trompe. Tu lui dis ou tu te tais ?",
        "Ta sœur t'a confié un secret qui pourrait la mettre en danger. Le gardes-tu ?",
        "Ton ami triche pendant un examen. Tu le dénonces ?",
        "Tu as promis d'aider un ami à déménager, mais on t'invite à un concert dont tu rêves. Que fais-tu ?",
        "Tes parents veulent que tu choisisses des études qui ne te plaisent pas. Leur obéis-tu ?",
        "Un grand-parent perd la tête et refuse de quitter sa maison. Faut-il le placer ?",
        "Tu trouves un portefeuille avec 300 € et la carte d'identité d'un voisin que tu n'aimes pas. Tu fais quoi ?",
        "Ton amie te demande ton avis sur son projet qui, selon toi, va échouer. Tu mens pour la ménager ?",
        "Tu as cassé un objet précieux chez un ami et personne ne le sait. Tu avoues ?",
      ],
    },
    {
      id: "societe",
      label: "Société",
      topics: [
        "Peut-on sacrifier un bien-être individuel pour le bien commun ?",
        "Faut-il autoriser un sans-abri à dormir dans un bâtiment public vide ?",
        "Un journaliste obtient un document volé qui prouve une fraude. Doit-il le publier ?",
        "Est-il acceptable d'enfreindre une loi injuste pacifiquement ?",
        "Doit-on aider un pays en difficulté avant de résoudre nos propres problèmes ?",
        "Faut-il imposer plus fortement les très hauts revenus ?",
        "Une usine fait vivre toute une ville mais pollue la rivière. Faut-il la fermer ?",
        "Peut-on juger les actes d'une personne du passé avec les valeurs d'aujourd'hui ?",
        "Un lanceur d'alerte révèle des secrets d'entreprise pour protéger le public. Héros ou traître ?",
        "Faut-il limiter la vitesse ou les voyages en avion pour sauver le climat ?",
        "Que doit-on aux générations futures ?",
      ],
    },
  ],
  howTo: [
    "Appuie sur « Tirer un dilemme » et lis toute la situation avant de répondre.",
    "Choisis une option puis écris la raison principale de ton choix en une phrase.",
    "Change un détail (la personne concernée, le coût, le temps) et regarde si ta réponse tient toujours.",
    "En classe de philo, défends d'abord une position, puis son contraire : c'est l'exercice parfait pour la dissertation.",
  ],
  faq: [
    {
      question: "Qu'est-ce qu'un dilemme éthique ?",
      answer:
        "C'est une situation où tu dois choisir entre plusieurs options, et chacune coûte quelque chose du point de vue moral : loyauté contre honnêteté, liberté contre sécurité, par exemple. Il n'y a pas de solution parfaite, et c'est ce qui rend la discussion intéressante.",
    },
    {
      question: "Quelle est la différence entre dilemme éthique et dilemme moral ?",
      answer:
        "Dans l'usage courant, les deux se confondent. En philosophie, la morale désigne plutôt les principes personnels du bien et du mal, alors que l'éthique renvoie souvent à des règles professionnelles ou collectives (éthique médicale, éthique du journalisme).",
    },
    {
      question: "Comment utiliser ces dilemmes en cours de philo ?",
      answer:
        "Pars d'un dilemme, identifie les valeurs en conflit, puis appuie-toi sur un auteur (Kant, Mill, Arendt…) pour argumenter. C'est un bon entraînement pour la dissertation et le grand oral.",
    },
    {
      question: "Comment répondre à un dilemme éthique ?",
      answer:
        "Commence par reformuler le problème, liste les conséquences de chaque option, puis justifie ton choix en reconnaissant ce que tu sacrifies. Une bonne réponse n'est pas forcément la bonne solution, mais elle est argumentée.",
    },
    {
      question: "Ces dilemmes peuvent-ils servir en entretien ou en équipe ?",
      answer:
        "Oui, la catégorie « Travail » sert de base à des discussions de valeurs en équipe ou à se préparer aux questions de mise en situation en entretien. Garde l'esprit ouvert et écoute les arguments contraires.",
    },
  ],
};

const P5: LocalePageConfig = {
  path: "/fr/idees-d-ecriture",
  enPath: "/writing",
  englishLabel: "Writing Prompt Generator",
  metaTitle: "Idées d'écriture : {n} sujets d'écriture créative à tirer au sort",
  description:
    "{n} idées d'écriture créative : débuts d'histoire, personnages, lieux, dialogues et sujets de rédaction. Tire un prompt au hasard et écris, gratuit.",
  title: "Idées d'écriture",
  lead: "{n} idées d'écriture pour débloquer ta plume : débuts d'histoire, personnages, lieux, dialogues et sujets de rédaction scolaire. Tire un prompt et écris pendant dix minutes sans t'arrêter.",
  buttonLabel: "Tirer un prompt",
  mode: "card",
  sibling: { label: "Idées d'écriture", detail: "Prompts pour écrire", emoji: "✍️" },
  groups: [
    {
      id: "debuts",
      label: "Débuts d'histoire",
      topics: [
        "Ce matin-là, la boulangerie du village était fermée pour la première fois depuis cinquante ans, et personne ne savait pourquoi.",
        "Le train de 7 h 42 est parti sans moi, mais il est revenu cinq minutes plus tard, vide.",
        "En vidant le grenier de mon grand-père, j'ai trouvé une clé qui n'ouvrait aucune porte de la maison.",
        "La nuit où les lampadaires se sont éteints, un à un, tout le long de la rue des Tilleuls.",
        "Quand j'ai ouvert mon casier au lycée, il y avait un mot : « Ne fais confiance à personne de la classe. »",
        "Le premier jour des vacances, le facteur m'a remis une lettre adressée à quelqu'un qui n'existait pas encore.",
        "Mon voisin jurait que sa tortue lui parlait. Ce soir-là, je l'ai entendue aussi.",
        "Il y avait un seul croissant sur le comptoir, et deux personnes l'avaient remarqué en même temps.",
        "Au bord du canal, un carnet flottait encore, parfaitement sec.",
        "La tempête avait coupé le village du reste du monde ; c'est là que le vieux téléphone a sonné.",
        "Le jour de la rentrée, la nouvelle élève est entrée en classe avec une valise.",
        "J'ai réalisé que tout le monde dans mon immeuble avait le même rêve cette nuit-là.",
      ],
    },
    {
      id: "personnages",
      label: "Personnages",
      topics: [
        "Un facteur qui connaît tous les secrets d'un quartier mais ne dit jamais rien",
        "Une grand-mère qui était espionne, mais personne ne le sait",
        "Un lycéen qui a peur de tout sauf des fantômes",
        "Une boulangère qui lit l'avenir dans la pâte à pain",
        "Un chat de gare qui connaît tous les horaires par cœur",
        "Un chef étoilé qui a perdu le goût des aliments",
        "Une adolescente capable de rendre les objets muets bavards",
        "Un vieux marin qui refuse de quitter son bateau échoué dans les champs",
        "Une professeure de physique qui s'est trompée de salle depuis dix ans",
        "Un garçon qui collectionne les mots rares et les utilise pour se défendre",
        "Un robot qui a appris à cuisiner en regardant des émissions de pâtisserie",
        "Deux frères jumeaux dont l'un ne ment jamais et l'autre jamais la vérité",
      ],
    },
    {
      id: "lieux",
      label: "Lieux et ambiances",
      topics: [
        "Un marché du dimanche où les vendeurs vendent des souvenirs",
        "Une gare de campagne où plus aucun train ne s'arrête, sauf ce soir",
        "Un phare breton qui change de couleur selon l'humeur de la mer",
        "Un café de Paris ouvert uniquement à 3 h du matin",
        "Une petite école de montagne coupée du monde par la neige",
        "Une bibliothèque municipale dont les livres changent de rayon chaque nuit",
        "Un village où il pleut seulement sur une maison",
        "Un cinéma abandonné qui passe encore un film tous les soirs",
        "Une ferme au fin fond de l'Ardèche où le temps s'est arrêté",
        "Un ascenseur qui s'arrête toujours à un étage qui n'existe pas",
        "Un camping hors saison, avec une seule caravane allumée",
        "Un grand parc à la périphérie d'une ville, juste après l'orage",
      ],
    },
    {
      id: "dialogues",
      label: "Dialogues",
      topics: [
        "Deux inconnus attendent un bus qui ne vient pas. L'un d'eux a quelque chose à avouer.",
        "Une dispute entre un père et sa fille à propos d'une casserole qui a disparu",
        "Un client veut rendre un objet qu'il n'a pas acheté dans ce magasin",
        "Une conversation entre deux fantômes qui se plaignent des vivants",
        "Un prof et un élève se croisent en dehors de l'école et ne savent plus comment se parler",
        "Une demande en mariage qui tourne mal à cause d'un chien",
        "Deux vieux amis se retrouvent après trente ans, mais un seul se souvient de leur brouille",
        "Un dialogue uniquement fait de questions, de la première à la dernière ligne",
        "Un guide de musée refuse de dire ce que contient la salle numéro 12",
        "Un texto envoyé au mauvais numéro et les réponses étranges qui suivent",
        "Un contrôleur de train face à un voyageur sans billet qui prétend être un roi",
        "Deux enfants qui planifient une évasion de la cour de récréation",
      ],
    },
    {
      id: "redaction",
      label: "Sujets de rédaction scolaire",
      topics: [
        "Décris le plus beau jour de ta vie en insistant sur les sensations",
        "Raconte une rencontre inattendue pendant un trajet en bus",
        "Écris la lettre d'un élève à l'enseignant qui lui a donné confiance",
        "Imagine que tu retrouves ton objet préféré d'enfance : qu'éprouves-tu ?",
        "Rédige un texte argumenté : faut-il interdire les téléphones au collège ?",
        "Raconte une journée où tout s'est passé à l'envers",
        "Décris un paysage vu d'une fenêtre à quatre moments de la journée",
        "Écris le journal d'un adolescent en 1914 ou en 1944",
        "Imagine la fin alternative de ton livre préféré",
        "Rédige une lettre à ta future toi dans dix ans",
        "Raconte un souvenir de cuisine avec ta famille en utilisant les cinq sens",
        "Écris un récit à la première personne du point de vue d'un objet du quotidien",
      ],
    },
  ],
  howTo: [
    "Appuie sur « Tirer un prompt » (choisis une catégorie si tu veux un type précis).",
    "Mets un minuteur de 10 minutes et écris sans t'arrêter ni te relire : l'objectif est de remplir la page.",
    "Relis ensuite, souligne la phrase que tu préfères et construis ta suite à partir d'elle.",
    "Pour un sujet de rédaction, fais d'abord un plan en trois lignes (début, milieu, fin) avant d'écrire.",
  ],
  faq: [
    {
      question: "Comment trouver des idées d'écriture quand on est bloqué ?",
      answer:
        "Pars d'une contrainte plutôt que d'une page blanche : un lieu, un objet, une phrase d'ouverture. Tire un prompt au hasard et écris dix minutes sans te juger, tu retrouveras vite le rythme.",
    },
    {
      question: "Ces prompts servent-ils pour les rédactions scolaires ?",
      answer:
        "Oui, la catégorie « Sujets de rédaction scolaire » propose des consignes de narration, de description et d'argumentation comme au collège ou au lycée. Fais un plan, soigne l'introduction et garde dix minutes pour te relire.",
    },
    {
      question: "Quelle longueur donner à un texte d'écriture créative ?",
      answer:
        "Pour t'entraîner, vise 150 à 300 mots en quinze minutes. Pour une nouvelle, prévois quelques pages avec un événement déclencheur, un obstacle et une fin qui résonne avec le début.",
    },
    {
      question: "Peut-on utiliser ces idées pour un atelier d'écriture ?",
      answer:
        "Oui. Tire un prompt pour le groupe, laisse dix minutes d'écriture, puis lis à voix haute en retenant ce qui fonctionne bien. Alterner les catégories (personnage, lieu, dialogue) donne beaucoup de variété.",
    },
    {
      question: "Comment éviter les clichés dans une histoire ?",
      answer:
        "Remplace les adjectifs vagues par des détails précis (une odeur, un bruit, un geste), évite les débuts « Il était une fois » ou « Je me réveille » et surprends le lecteur avec un détail inattendu dans la première phrase.",
    },
  ],
};

const P6: LocalePageConfig = {
  path: "/fr/generateur-de-matieres",
  enPath: "/random-subject-generator",
  englishLabel: "Random Subject Generator",
  metaTitle: "Générateur de matière aléatoire : quelle matière réviser ? ({n} idées)",
  description:
    "Quelle matière réviser aujourd'hui ? Tire une matière au hasard (collège, lycée, fac) avec une mini-tâche de révision à faire tout de suite. {n} idées, gratuit.",
  title: "Générateur de matière aléatoire",
  lead: "Tu ne sais pas quelle matière réviser ? Ce générateur choisit une matière au hasard parmi {n} idées du collège, du lycée et de la fac, avec une mini-tâche concrète pour te mettre au travail.",
  buttonLabel: "Choisir une matière",
  mode: "card",
  sibling: { label: "Matière au hasard", detail: "Quelle matière réviser ?", emoji: "📚" },
  groups: [
    {
      id: "maths-sciences",
      label: "Maths et sciences",
      topics: [
        "Mathématiques : refais 10 exercices du chapitre qui t'a le plus posé problème",
        "Physique-chimie : refais un exercice de cours avec un schéma complet",
        "SVT : résume en 5 lignes un chapitre sur la génétique ou l'écologie",
        "Numérique et sciences informatiques : écris un petit programme qui résout un problème de ta semaine",
        "Mathématiques : apprends 5 formules par cœur et teste-les sur un exemple",
        "Physique-chimie : liste les unités du chapitre et leurs conversions",
        "SVT : dessine un schéma annoté de la dernière leçon sans regarder le cours",
        "Mathématiques : explique à voix haute une démonstration comme si tu l'enseignais",
        "Technologie : décris le fonctionnement d'un objet de la maison avec ses étapes",
        "Statistiques : calcule la moyenne et la médiane de tes dernières notes",
      ],
    },
    {
      id: "lettres-langues",
      label: "Français et langues",
      topics: [
        "Français : relis un texte étudié et note trois figures de style avec leurs effets",
        "Français : rédige l'introduction d'un commentaire de texte en 10 minutes",
        "Anglais : écris 10 phrases avec le vocabulaire de la dernière unité",
        "Anglais : regarde 5 minutes d'une série en VO avec sous-titres anglais",
        "Espagnol : conjugue 5 verbes irréguliers au présent et au passé",
        "Allemand : apprends 15 mots de vocabulaire avec leur déterminant",
        "Français : fais la fiche de lecture d'une œuvre au programme",
        "Latin : traduis une phrase courte et note les mots que tu ne connaissais pas",
        "Français : prépare une question de grammaire (fonction, subordonnée) et réponds sans le cours",
        "Anglais : entraîne-toi à parler 2 minutes sur ta journée en anglais",
        "Orthographe : fais une dictée de 10 lignes et corrige-toi",
        "Français : lis à voix haute un poème et explique-le en une phrase",
      ],
    },
    {
      id: "sciences-humaines",
      label: "Histoire-géo et sciences humaines",
      topics: [
        "Histoire : fais une frise chronologique des dates clés du dernier chapitre",
        "Géographie : apprends à situer 10 pays ou régions sur une carte muette",
        "EMC : prépare un argument pour et contre sur un sujet d'actualité",
        "Philosophie : formule une dissertation en trois parties sur la notion du jour",
        "SES : explique un graphique du manuel en 3 phrases",
        "Histoire : résume un événement en 5 lignes comme pour le journal du soir",
        "Géographie : fais un croquis simple d'un territoire étudié en classe",
        "Droit ou économie : définis cinq termes clés du chapitre avec un exemple",
        "Histoire des arts : décris une œuvre en 5 phrases (époque, auteur, technique)",
        "Philosophie : trouve une citation d'auteur pour illustrer ta notion",
      ],
    },
    {
      id: "arts-sport-autres",
      label: "Arts, sport et autres",
      topics: [
        "Arts plastiques : dessine un objet du quotidien en trois styles différents",
        "Musique : écoute un morceau classique et note les instruments que tu reconnais",
        "EPS : prépare une routine d'échauffement de 5 minutes et fais-la",
        "Éducation musicale : apprends un rythme simple en frappant des mains",
        "Économie : fais le budget d'une semaine avec ton argent de poche",
        "Théâtre : lis une scène à voix haute avec trois intonations différentes",
        "Technologie : conçois un petit prototype sur papier pour résoudre un souci de ton quotidien",
        "Cinéma : analyse une scène d'un film en repérant le cadrage et la musique",
        "Éducation civique : prépare un exposé de 2 minutes sur une institution française",
      ],
    },
    {
      id: "methodes",
      label: "Méthodes de travail",
      topics: [
        "Organisation : fais le planning de ta semaine de révisions en 10 minutes",
        "Méthode : refais une fiche de révision pour le contrôle le plus proche",
        "Mémoire : récite à voix haute le dernier cours sans regarder",
        "Concentration : travaille 25 minutes sans téléphone, puis 5 minutes de pause",
        "Auto-évaluation : fais-toi un quiz de 10 questions sur la dernière leçon",
        "Révision active : explique un chapitre à quelqu'un de ta famille",
        "Cartes mentales : résume un chapitre en une seule page",
        "Prise de notes : relis tes cours et surligne 3 points essentiels par page",
      ],
    },
  ],
  howTo: [
    "Appuie sur « Choisir une matière » : tu peux filtrer par catégorie (maths et sciences, français et langues, etc.).",
    "Lis la mini-tâche proposée et lance un minuteur de 25 minutes pour la faire sans distraction.",
    "Si la matière ne te correspond pas aujourd'hui, retire une fois : le tirage évite de proposer la même deux fois de suite.",
    "Note à la fin ce que tu as appris ou ce qu'il te reste à revoir, pour savoir quoi faire demain.",
  ],
  faq: [
    {
      question: "Comment choisir quelle matière réviser en premier ?",
      answer:
        "Commence par la matière dont le contrôle est le plus proche, ou celle où tu as le plus de lacunes. Si tu hésites ou procrastines, laisse le hasard choisir : le plus dur est souvent de s'y mettre.",
    },
    {
      question: "Ce générateur convient-il au collège, au lycée et à la fac ?",
      answer:
        "Oui, les matières couvrent le collège (maths, SVT, technologie, français), le lycée (spécialités, philosophie, SES) et le supérieur. Les tâches sont assez générales pour s'adapter à ton niveau.",
    },
    {
      question: "Combien de temps faut-il consacrer à une matière ?",
      answer:
        "Des sessions de 25 à 45 minutes avec une courte pause sont plus efficaces qu'un long bloc. Alterner deux ou trois matières dans la soirée aide aussi à mieux mémoriser.",
    },
    {
      question: "Est-ce utile pour préparer le bac ou le brevet ?",
      answer:
        "Oui : en variant les matières, tu évites de négliger les moins aimées. Utilise-le comme point de départ, puis ajoute les annales et fiches officielles de ton programme.",
    },
    {
      question: "Puis-je utiliser ce générateur pour choisir un sujet d'exposé ?",
      answer:
        "Bien sûr. Tire une matière, puis cherche un angle concret (une personne, un événement, une expérience) et propose-le à ton prof. Un exposé précis est toujours mieux noté qu'un exposé trop vaste.",
    },
  ],
};

const P7: LocalePageConfig = {
  path: "/fr/sujets-de-discours-improvise",
  enPath: "/impromptu-speech-topics",
  englishLabel: "Impromptu Speech Topics",
  metaTitle: "Sujets de discours improvisé : {n} idées pour parler 1 minute",
  description:
    "{n} sujets de discours improvisé pour s'entraîner à parler en public : tire un sujet, lance 1 minute et improvise sans notes. Idéal oral, club, formation, gratuit.",
  title: "Sujets de discours improvisé",
  lead: "{n} sujets de discours improvisé à tirer au sort pour t'entraîner à parler en public. Tu as une minute : pas de préparation, juste ton idée, un exemple et une conclusion.",
  buttonLabel: "Tirer un sujet",
  mode: "timer",
  sibling: { label: "Discours improvisé", detail: "Parle 1 minute sans notes", emoji: "⏱️" },
  groups: [
    {
      id: "quotidien",
      label: "Quotidien",
      topics: [
        "Ta routine du matin idéale",
        "Le meilleur moyen de se détendre après une longue journée",
        "Pourquoi le dimanche soir a mauvaise réputation",
        "Un objet que tu ne pourrais pas quitter",
        "Ce que tu ferais avec une journée libre à Paris",
        "Le rituel du café ou du thé dans ta vie",
        "Pourquoi les gens parlent tant de la météo",
        "Ta façon préférée d'occuper un trajet en train",
        "Le meilleur souvenir d'un repas de famille",
        "Pourquoi la boulangerie du coin est un lieu précieux",
      ],
    },
    {
      id: "opinions",
      label: "Opinions",
      topics: [
        "Les écrans à table : oui ou non ?",
        "Faut-il apprendre à cuisiner à l'école ?",
        "Pourquoi les vacances scolaires sont importantes",
        "Le vélo devrait-il avoir plus de place en ville ?",
        "Un jour férié en plus : lequel et pourquoi ?",
        "Le silence est-il sous-estimé ?",
        "Faut-il garder les billets en papier ?",
        "Les notifications nous rendent-elles moins libres ?",
        "Le meilleur âge pour apprendre une langue",
        "Pourquoi tout le monde devrait lire plus de BD",
      ],
    },
    {
      id: "hypotheses",
      label: "Et si… ?",
      topics: [
        "Et si on pouvait voyager dans le temps pour une seule journée ?",
        "Et si les animaux pouvaient voter ?",
        "Et si tu dirigeais ton lycée pendant une semaine ?",
        "Et si tu devais vivre sans électricité un mois ?",
        "Et si les chats avaient inventé Internet ?",
        "Et si tu pouvais parler toutes les langues ?",
        "Et si on supprimait les examens ?",
        "Et si tu étais invisible pendant une heure ?",
        "Et si chaque rue avait son propre jour de fête ?",
        "Et si on pouvait lire dans les pensées de nos amis ?",
      ],
    },
    {
      id: "personnel",
      label: "Raconte-moi",
      topics: [
        "Un moment où tu as eu très peur, et ce que tu en as retenu",
        "Une personne qui t'a inspiré(e)",
        "Une erreur dont tu es presque fier(fière)",
        "Ton plus beau voyage ou celui dont tu rêves",
        "Une tradition de ta famille que tu veux garder",
        "Un défi que tu as relevé cette année",
        "Le meilleur conseil que tu donnerais à ton toi de 10 ans",
        "Un lieu qui compte beaucoup pour toi",
        "Une chose que tu as apprise toute seule",
        "Un jour où tu as été vraiment fier(fière)",
      ],
    },
    {
      id: "defis",
      label: "Défis d'improvisation",
      topics: [
        "Vends un stylo à bille à un astronaute en 60 secondes",
        "Présente ton objet le plus banal comme une invention révolutionnaire",
        "Fais l'éloge de la tartine de beurre",
        "Défends l'idée que le lundi est le meilleur jour de la semaine",
        "Explique à un extraterrestre ce qu'est un apéro",
        "Annonce les actualités du jour comme un journaliste de JT",
        "Fais une publicité pour la ville où tu habites",
        "Donne un conseil de vie en n'utilisant que des proverbes",
        "Présente-toi comme si tu postulais au poste de roi ou de reine de France",
        "Raconte une journée de ta vie comme un documentaire animalier",
      ],
    },
  ],
  howTo: [
    "Appuie sur « Tirer un sujet » et lis-le à voix haute. Ne prépare rien : c'est le principe de l'improvisation.",
    "Lance le chrono de 1 minute et commence par une phrase claire qui répond directement au sujet.",
    "Donne un exemple concret ou une anecdote, puis conclus par une phrase qui reprend ton idée de départ.",
    "Si tu bloques, utilise la structure « point, raison, exemple » ou reformule le sujet pour gagner du temps.",
  ],
  faq: [
    {
      question: "Comment s'entraîner au discours improvisé ?",
      answer:
        "Tire un sujet, lance un chrono d'une minute et parle sans notes. Enregistre-toi avec ton téléphone pour repérer les « euh » et les silences, puis recommence avec un autre sujet chaque jour.",
    },
    {
      question: "Quelle est la différence avec les sujets de discours ?",
      answer:
        "Ici, les sujets sont courts, spontanés et ne demandent aucune préparation : on parle une minute, point. La page « Sujets de discours » propose des thèmes plus travaillés (exposé, grand oral, toast) qui se préparent à l'avance.",
    },
    {
      question: "Quelle structure utiliser pour improviser ?",
      answer:
        "La plus simple est « point, raison, exemple, point » : tu donnes ton idée, tu l'expliques, tu illustres par un fait vécu, puis tu la répètes pour conclure. Elle fonctionne pour presque tous les sujets.",
    },
    {
      question: "Comment éviter les « euh » ?",
      answer:
        "Remplace-les par une courte pause : un silence de deux secondes fait plus sérieux qu'un « euh ». Ralentir légèrement le rythme aide aussi à trouver ses mots.",
    },
    {
      question: "Peut-on s'en servir en groupe ou en club ?",
      answer:
        "Oui : chacun tire un sujet à tour de rôle et parle une minute, puis le groupe donne un point fort et un point à améliorer. C'est un exercice classique de clubs d'éloquence, d'ateliers de formation et de cours de langue.",
    },
  ],
};

const P8: LocalePageConfig = {
  path: "/fr/questions-droles",
  enPath: "/funny",
  englishLabel: "Funny Topics",
  metaTitle: "Questions drôles : {n} questions marrantes à poser entre amis",
  description:
    "{n} questions drôles et rigolotes à poser entre amis, en famille ou en soirée : hypothèses absurdes, souvenirs gênants, goûts bizarres. Tire une question, gratuit.",
  title: "Questions drôles",
  lead: "{n} questions drôles, marrantes et rigolotes pour animer un repas, une soirée entre amis ou un trajet en voiture. Tire une question au hasard et prépare-toi à rire.",
  buttonLabel: "Tirer une question",
  mode: "card",
  sibling: { label: "Questions drôles", detail: "Pour rire entre amis", emoji: "😂" },
  groups: [
    {
      id: "absurde",
      label: "Hypothèses absurdes",
      topics: [
        "Si tous les pigeons de ta ville portaient un chapeau, quel chapeau serait le plus ridicule ?",
        "Si les fromages avaient un caractère, lequel serait le plus bavard ?",
        "Si tu devais remplacer ta voix par un bruitage pour la journée, lequel choisirais-tu ?",
        "Si ton chat ou ton chien écrivait un blog, quel en serait le titre ?",
        "Si on ouvrait un musée de la chaussette perdue, quelle serait la pièce maîtresse ?",
        "Si tu pouvais ajouter un bouton à la télécommande de la vie, il ferait quoi ?",
        "Si ton meilleur ami était un plat, lequel serait-il et pourquoi ?",
        "Si les nuages avaient des noms, comment appellerais-tu celui qui est au-dessus de toi ?",
        "Si on organisait les Jeux olympiques des tâches ménagères, dans quelle épreuve gagnerais-tu ?",
        "Si le frigo pouvait parler, quel serait son premier reproche ?",
        "Si tu devais baptiser ta voiture (ou ton vélo), quel prénom lui donnerais-tu ?",
        "Si tu étais un personnage secondaire d'un film, quelle serait ta réplique culte ?",
      ],
    },
    {
      id: "souvenirs",
      label: "Souvenirs et honte",
      topics: [
        "Quelle est ta pire coupe de cheveux, et qui l'a faite ?",
        "Quel est le truc le plus gênant que tu aies fait en public ?",
        "Quelle est la dernière fois que tu as ri jusqu'aux larmes ?",
        "Quel surnom ridicule t'a-t-on donné petit(e) ?",
        "As-tu déjà dit « et toi aussi ! » à quelqu'un qui te disait bon appétit ?",
        "Quelle mauvaise excuse as-tu déjà donnée à un prof ?",
        "Quelle chanson te fait danser même dans la rue ?",
        "Quelle a été ta pire idée de déguisement ?",
        "Quel est le pire cadeau que tu aies offert (ou reçu) ?",
        "Quelle gaffe as-tu faite en parlant à la mauvaise personne ?",
        "Qu'as-tu déjà confondu de façon spectaculaire ?",
        "Quel est ton plus beau fail en cuisine ?",
      ],
    },
    {
      id: "gouts",
      label: "Goûts et petites manies",
      topics: [
        "Quelle est ta combinaison alimentaire la plus bizarre mais délicieuse ?",
        "Quel mot français adores-tu prononcer ?",
        "Quelle est la manie la plus étrange que tu as à table ?",
        "Dans quel ordre manges-tu une tartine de Nutella ?",
        "Quel est le dessin animé que tu défendrais jusqu'au bout ?",
        "Quelle est ta façon préférée de procrastiner ?",
        "Quel est ton rituel d'anniversaire un peu ridicule ?",
        "Quel bruit du quotidien te fait le plus rire ?",
        "As-tu un faux talent que tu aimes exhiber ?",
        "Quelle chanson de variété connais-tu par cœur sans l'avouer ?",
        "Quel est ton avis sur les chaussettes dans les sandales ?",
        "Quel accessoire inutile ne quitterais-tu jamais ?",
      ],
    },
    {
      id: "entre-amis",
      label: "Entre amis",
      topics: [
        "Qui, dans le groupe, serait le premier à se perdre en randonnée ?",
        "Quel ami serait le plus drôle en professeur de yoga ?",
        "Qui, parmi nous, ferait le meilleur détective et qui le pire ?",
        "Quelle serait la bande-son de ce groupe d'amis ?",
        "Qui d'entre nous survivrait le plus longtemps dans une émission de télé-réalité ?",
        "À quelle série ressemble notre groupe d'amis ?",
        "Qui répondrait « je suis en route » en étant encore dans son lit ?",
        "Quel est le surnom le plus drôle que tu donnerais à quelqu'un ici ?",
        "Qui est le plus susceptible d'oublier ses clés trois fois dans la même journée ?",
        "Quelle activité de groupe finirait forcément en fou rire ?",
        "Qui gagnerait un concours du pire danseur ?",
        "Qui d'entre nous serait le plus mauvais en cachette pendant un cache-cache ?",
      ],
    },
    {
      id: "famille-ecole",
      label: "Famille, école et boulot",
      topics: [
        "Quelle phrase de ta mère ou de ton père as-tu entendue cent fois ?",
        "Quel est le pire cours que tu aies suivi, mais dont tu as appris quelque chose ?",
        "Quel prof imitais-tu le mieux ?",
        "Quelle est la réunion la plus longue de ta vie et à quoi pensais-tu ?",
        "Quel est le pire message envoyé dans le mauvais groupe WhatsApp ?",
        "Qu'est-ce que ta grand-mère t'a dit de faire et que tu n'as jamais compris ?",
        "Quel est ton plus gros fail sur un exposé ou une présentation ?",
        "Quelle règle absurde existait dans ton école ?",
        "Quelle est la phrase la plus bizarre que ton ordinateur t'a dite ?",
        "Quel souvenir de colonie de vacances te fait encore rire ?",
      ],
    },
  ],
  howTo: [
    "Appuie sur « Tirer une question » et lis-la à voix haute devant tout le monde.",
    "Chacun répond à son tour en moins de 30 secondes : plus c'est court, plus c'est drôle.",
    "Rebondis sur les réponses des autres avec des questions de suivi (« Attends, c'était quand ? »).",
    "Pour pimenter, vote pour la réponse la plus drôle et désigne le gagnant de la partie.",
  ],
  faq: [
    {
      question: "Quelles questions drôles poser entre amis ?",
      answer:
        "Les hypothèses absurdes, les souvenirs gênants et les petites manies marchent à tous les coups. Elles mettent tout le monde à l'aise et font apparaître des histoires qu'on ne connaissait pas.",
    },
    {
      question: "Comment lancer une soirée avec des questions marrantes ?",
      answer:
        "Pose la première question à voix haute, laisse chacun répondre rapidement, puis enchaîne. Prévois un petit gage ou un point par réponse pour entretenir l'ambiance.",
    },
    {
      question: "Ces questions sont-elles adaptées à la famille et aux enfants ?",
      answer:
        "Oui, tout reste propre et sans sous-entendus. Pour des plus jeunes, choisis la catégorie « Hypothèses absurdes » ou « Goûts et petites manies », et reformule si besoin.",
    },
    {
      question: "Peut-on s'en servir en classe ou en équipe ?",
      answer:
        "Oui, c'est un bon brise-glace pour une rentrée, un séminaire d'équipe ou un cours de langue. Évite les sujets qui pourraient mettre quelqu'un mal à l'aise et laisse chacun libre de passer.",
    },
    {
      question: "Comment répondre à une question drôle quand on n'a pas d'idée ?",
      answer:
        "Pars du premier détail qui te vient en tête et exagère-le. Une réponse un peu absurde et sincère fait toujours plus rire qu'une réponse parfaite.",
    },
  ],
};

export const FR_A: LocalePageConfig[] = [P1, P2, P3, P4, P5, P6, P7, P8];
