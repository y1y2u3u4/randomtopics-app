export interface SpanishMostLikelyConfig {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  intro: string;
  sections: { heading: string; description: string; items: string[] }[];
  faq: { question: string; answer: string }[];
  relatedLinks: { label: string; href: string }[];
  /** Publication line under the hero; the first three pages keep the original August dates. */
  dateLine?: string;
  datePublished?: string;
}

export const SPANISH_MOST_LIKELY_CLUSTERS = {
  couples: {
    slug: "quien-es-mas-probable-parejas",
    title: "45 preguntas de Quién es más probable para parejas",
    metaTitle: "45 Preguntas de Quién Es Más Probable para Parejas",
    metaDescription:
      "45 preguntas de Quién es más probable para parejas: divertidas, románticas y reveladoras. Lista limpia para novios, esposos y citas, más generador gratis.",
    heroSubtitle:
      "Preguntas divertidas, románticas y un poco reveladoras para descubrir quién conoce mejor la relación sin convertir el juego en una pelea.",
    intro:
      "Esta versión de Quién es más probable está pensada solo para parejas. Empieza con hábitos cotidianos, pasa a comunicación y complicidad, y termina con planes de futuro. Lean una pregunta, cuenten hasta tres y señalen a la persona que mejor encaja. Si no coinciden, expliquen la elección con una anécdota: ahí suele estar la mejor parte del juego.",
    sections: [
      {
        heading: "Preguntas divertidas para parejas",
        description: "Hábitos cotidianos y pequeñas manías para empezar con risas.",
        items: [
          "¿Quién es más probable que se robe toda la cobija sin darse cuenta?",
          "¿Quién es más probable que diga que no tiene hambre y termine comiendo del plato del otro?",
          "¿Quién es más probable que tarde más en elegir una película que en verla?",
          "¿Quién es más probable que invente un apodo que nadie más entiende?",
          "¿Quién es más probable que pierda las llaves justo cuando van tarde?",
          "¿Quién es más probable que convierta una compra rápida en una excursión de dos horas?",
          "¿Quién es más probable que se quede dormido a mitad de una conversación nocturna?",
          "¿Quién es más probable que empiece a cantar una canción y obligue al otro a terminarla?",
          "¿Quién es más probable que mande un meme en lugar de explicar cómo se siente?",
          "¿Quién es más probable que recuerde exactamente qué pidió la otra persona en la primera cita?",
          "¿Quién es más probable que se ría en el momento menos apropiado?",
          "¿Quién es más probable que planee un día entero alrededor de una comida?",
          "¿Quién es más probable que pida indicaciones aunque el GPS diga que todo va bien?",
          "¿Quién es más probable que convierta una tarea doméstica en una competencia?",
          "¿Quién es más probable que haga las paces primero después de una discusión tonta?",
        ],
      },
      {
        heading: "Preguntas románticas y de complicidad",
        description: "Para hablar de cariño, comunicación y las formas de cuidarse.",
        items: [
          "¿Quién es más probable que organice una cita sorpresa con todos los detalles?",
          "¿Quién es más probable que note primero que el otro ha tenido un mal día?",
          "¿Quién es más probable que guarde entradas, notas y recuerdos de momentos juntos?",
          "¿Quién es más probable que escriba un mensaje largo para arreglar un malentendido?",
          "¿Quién es más probable que dé el mejor abrazo cuando no hay palabras?",
          "¿Quién es más probable que recuerde una frase bonita dicha hace años?",
          "¿Quién es más probable que ceda su parte favorita del postre?",
          "¿Quién es más probable que convierta un día común en una ocasión especial?",
          "¿Quién es más probable que diga en voz alta lo que admira del otro?",
          "¿Quién es más probable que proponga apagar los teléfonos para pasar tiempo juntos?",
          "¿Quién es más probable que pida perdón con hechos además de palabras?",
          "¿Quién es más probable que sepa exactamente qué regalo alegraría al otro?",
          "¿Quién es más probable que defienda a su pareja cuando no está presente?",
          "¿Quién es más probable que recuerde celebrar una pequeña victoria?",
          "¿Quién es más probable que inicie una conversación difícil con cariño y honestidad?",
        ],
      },
      {
        heading: "Preguntas sobre planes y futuro",
        description: "Decisiones, sueños y aventuras para parejas con confianza.",
        items: [
          "¿Quién es más probable que proponga mudarse a otra ciudad por una nueva oportunidad?",
          "¿Quién es más probable que haga una hoja de cálculo para planear las vacaciones?",
          "¿Quién es más probable que prefiera ahorrar para una gran meta antes que gastar ahora?",
          "¿Quién es más probable que quiera adoptar una mascota primero?",
          "¿Quién es más probable que empiece una tradición que dure muchos años?",
          "¿Quién es más probable que aprenda una habilidad nueva para compartirla con su pareja?",
          "¿Quién es más probable que convierta un sueño lejano en un plan con fecha?",
          "¿Quién es más probable que se adapte mejor si los planes cambian de repente?",
          "¿Quién es más probable que elija vivir cerca de la familia?",
          "¿Quién es más probable que reserve un viaje espontáneo para el fin de semana?",
          "¿Quién es más probable que imagine cómo será la vida dentro de diez años?",
          "¿Quién es más probable que cuide mejor las plantas de una casa compartida?",
          "¿Quién es más probable que se anime a construir o renovar algo juntos?",
          "¿Quién es más probable que recuerde equilibrar el trabajo con el tiempo en pareja?",
          "¿Quién es más probable que mantenga la calma durante un cambio importante?",
        ],
      },
    ],
    faq: [
      { question: "¿Cómo se juega a Quién es más probable en pareja?", answer: "Lean una pregunta, cuenten hasta tres y señalen al mismo tiempo a quien encaje mejor. Si las respuestas no coinciden, cada uno explica su elección con una anécdota. No hace falta llevar puntos." },
      { question: "¿Estas preguntas sirven para una primera cita?", answer: "Las preguntas divertidas del primer bloque funcionan bien cuando ya hay confianza básica. Dejen las preguntas de futuro para una relación más estable y eviten cualquier prompt que haga sentir incómoda a la otra persona." },
      { question: "¿Cómo evitar que el juego termine en discusión?", answer: "Empiecen con preguntas ligeras, no usen las respuestas como reproches y permitan pasar cualquier pregunta. El objetivo es reír y conocerse, no demostrar quién tiene razón." },
    ],
    relatedLinks: [
      { label: "100 preguntas de Quién es más probable", href: "/es/topics/most-likely-to-questions" },
      { label: "Preguntas profundas para tu pareja", href: "/es/topics/deep-questions-to-ask-your-partner" },
      { label: "Preguntas chistosas de Quién es más probable", href: "/es/topics/quien-es-mas-probable-preguntas-chistosas" },
      { label: "Generador de Quién es más probable", href: "/es/most-likely-to" },
    ],
  },
  strong: {
    slug: "quien-es-mas-probable-preguntas-fuertes",
    title: "45 preguntas fuertes de Quién es más probable",
    metaTitle: "45 Preguntas Fuertes de Quién Es Más Probable",
    metaDescription:
      "45 preguntas fuertes de Quién es más probable para amigos con confianza: reveladoras, intensas y profundas, sin contenido ofensivo. Lista y generador gratis.",
    heroSubtitle:
      "Preguntas intensas y reveladoras para grupos con confianza: suficientemente fuertes para abrir conversación, sin humillar ni atacar a nadie.",
    intro:
      "Las mejores preguntas fuertes no son las más crueles: son las que obligan a pensar y revelan cómo ve el grupo a cada persona. Esta colección evita ataques al cuerpo, secretos privados y acusaciones. Aun así, acuerden una regla de 'paso libre' y no pidan explicaciones cuando alguien prefiera no responder.",
    sections: [
      {
        heading: "Preguntas reveladoras sobre personalidad",
        description: "Rasgos, decisiones y verdades que el grupo quizá ya sospecha.",
        items: [
          "¿Quién es más probable que oculte que está pasando por un momento difícil?",
          "¿Quién es más probable que cambie por completo de opinión después de escuchar buena evidencia?",
          "¿Quién es más probable que diga una verdad incómoda cuando todos prefieren callar?",
          "¿Quién es más probable que perdone, pero no vuelva a confiar igual?",
          "¿Quién es más probable que aparente seguridad mientras duda por dentro?",
          "¿Quién es más probable que ponga las necesidades de los demás antes que las suyas?",
          "¿Quién es más probable que recuerde durante años una crítica pequeña?",
          "¿Quién es más probable que admita primero que se equivocó?",
          "¿Quién es más probable que se aleje en silencio en lugar de discutir?",
          "¿Quién es más probable que dé un consejo que también necesita seguir?",
          "¿Quién es más probable que sorprenda a todos tomando una decisión valiente?",
          "¿Quién es más probable que mantenga la calma cuando el resto entra en pánico?",
          "¿Quién es más probable que proteja un secreto aunque le cueste?",
          "¿Quién es más probable que dé una segunda oportunidad que nadie más daría?",
          "¿Quién es más probable que defienda a alguien aunque el grupo no esté de acuerdo?",
        ],
      },
      {
        heading: "Preguntas intensas sobre amistad y relaciones",
        description: "Para grupos cercanos que pueden responder sin usar el juego como reproche.",
        items: [
          "¿Quién es más probable que termine una amistad si se rompe la confianza?",
          "¿Quién es más probable que vuelva a hablar con alguien después de años sin contacto?",
          "¿Quién es más probable que se enamore de una amistad cercana?",
          "¿Quién es más probable que reconozca una relación poco sana antes que los demás?",
          "¿Quién es más probable que haga un gran sacrificio por un amigo?",
          "¿Quién es más probable que se quede demasiado tiempo intentando arreglar una relación?",
          "¿Quién es más probable que diga exactamente lo que necesita en una relación?",
          "¿Quién es más probable que note primero que dos personas se gustan?",
          "¿Quién es más probable que perdone una cancelación importante si la explicación es honesta?",
          "¿Quién es más probable que mantenga una amistad a distancia durante décadas?",
          "¿Quién es más probable que ponga un límite aunque la otra persona se moleste?",
          "¿Quién es más probable que se arrepienta de no haber dicho lo que sentía?",
          "¿Quién es más probable que reúna al grupo después de un conflicto?",
          "¿Quién es más probable que vea el potencial de alguien antes que nadie?",
          "¿Quién es más probable que elija una amistad honesta sobre una popular?",
        ],
      },
      {
        heading: "Preguntas fuertes sobre decisiones y futuro",
        description: "Escenarios difíciles que revelan prioridades y tolerancia al riesgo.",
        items: [
          "¿Quién es más probable que renuncie sin tener otro trabajo preparado?",
          "¿Quién es más probable que empiece de cero en otro país?",
          "¿Quién es más probable que rechace mucho dinero por no traicionar sus valores?",
          "¿Quién es más probable que siga una carrera que su familia no comprende?",
          "¿Quién es más probable que convierta un fracaso grande en una nueva dirección?",
          "¿Quién es más probable que tome una decisión importante sin contársela a nadie?",
          "¿Quién es más probable que cambie comodidad por una oportunidad incierta?",
          "¿Quién es más probable que denuncie algo injusto aunque tenga consecuencias?",
          "¿Quién es más probable que cumpla una promesa difícil muchos años después?",
          "¿Quién es más probable que acepte que un sueño ya no le pertenece?",
          "¿Quién es más probable que elija tiempo libre antes que un ascenso?",
          "¿Quién es más probable que vuelva a estudiar a una edad inesperada?",
          "¿Quién es más probable que transforme una afición en su trabajo?",
          "¿Quién es más probable que haga algo que todos consideran imposible?",
          "¿Quién es más probable que tome la decisión correcta aunque nadie se entere?",
        ],
      },
    ],
    faq: [
      { question: "¿Qué significa que una pregunta sea fuerte?", answer: "Una pregunta fuerte revela prioridades, miedos, límites o decisiones importantes. No necesita ser sexual, ofensiva o humillante para generar una conversación intensa." },
      { question: "¿Cómo usar estas preguntas de forma segura?", answer: "Aseguren que todos puedan pasar, no exijan explicaciones y no conviertan una respuesta en acusación. Si alguien se incomoda, cambien de pregunta sin discutirlo." },
      { question: "¿Son preguntas fuertes para adolescentes?", answer: "La lista evita contenido explícito, pero varias preguntas requieren confianza y madurez. Para clase o grupos nuevos conviene usar primero la colección general o la lista para amigos." },
    ],
    relatedLinks: [
      { label: "Quién es más probable para amigos", href: "/es/topics/quien-es-mas-probable-amigos" },
      { label: "Preguntas de dilemas éticos", href: "/es/topics/ethical-dilemma-questions" },
      { label: "Preguntas incómodas de Quién es más probable", href: "/es/topics/quien-es-mas-probable-preguntas-incomodas" },
      { label: "Generador de Quién es más probable", href: "/es/most-likely-to" },
    ],
  },
  friends: {
    slug: "quien-es-mas-probable-amigos",
    title: "45 preguntas de Quién es más probable para amigos",
    metaTitle: "45 Preguntas de Quién Es Más Probable para Amigos",
    metaDescription:
      "45 preguntas de Quién es más probable para amigos: graciosas, de aventuras y de amistad. Lista limpia para fiestas, viajes y reuniones, con generador gratis.",
    heroSubtitle:
      "Preguntas graciosas, de aventuras y de amistad para una fiesta, viaje, noche de juegos o cualquier grupo que quiera reír y conocerse mejor.",
    intro:
      "Esta lista para amigos funciona con grupos nuevos y amistades de toda la vida. Empiecen con preguntas graciosas, sigan con aventuras y terminen con las que celebran la amistad. Todos señalan al mismo tiempo a la cuenta de tres; la persona con más votos puede contar la historia que demuestra por qué el grupo la eligió.",
    sections: [
      {
        heading: "Preguntas graciosas para amigos",
        description: "Prompts ligeros para que todos entren al juego desde la primera ronda.",
        items: [
          "¿Quién es más probable que salude a alguien pensando que lo conoce?",
          "¿Quién es más probable que envíe un mensaje al chat equivocado?",
          "¿Quién es más probable que llegue con hambre aunque acabe de comer?",
          "¿Quién es más probable que invente una excusa demasiado elaborada?",
          "¿Quién es más probable que tenga una captura de pantalla para demostrar cualquier historia?",
          "¿Quién es más probable que convierta una foto normal en una sesión profesional?",
          "¿Quién es más probable que se aprenda el baile de moda cuando ya pasó de moda?",
          "¿Quién es más probable que olvide dónde dejó el coche?",
          "¿Quién es más probable que haga amistad con un desconocido en una fila?",
          "¿Quién es más probable que lleve una botana para cinco minutos fuera de casa?",
          "¿Quién es más probable que cuente un chiste tan malo que termine siendo bueno?",
          "¿Quién es más probable que tenga una teoría absurda para explicar algo sencillo?",
          "¿Quién es más probable que se ría antes de terminar su propia historia?",
          "¿Quién es más probable que responda con un audio de siete minutos?",
          "¿Quién es más probable que convierta un pequeño error en la anécdota del año?",
        ],
      },
      {
        heading: "Preguntas de aventuras y planes",
        description: "Viajes, fiestas y decisiones espontáneas para imaginar la próxima historia del grupo.",
        items: [
          "¿Quién es más probable que proponga un viaje y compre el billete esa misma noche?",
          "¿Quién es más probable que encuentre el mejor lugar que no aparece en las guías?",
          "¿Quién es más probable que lleve una maleta enorme para un fin de semana?",
          "¿Quién es más probable que convenza al grupo de probar una actividad nueva?",
          "¿Quién es más probable que se pierda y descubra algo mejor que el plan original?",
          "¿Quién es más probable que organice una fiesta temática con un mes de anticipación?",
          "¿Quién es más probable que se apunte a cantar frente a desconocidos?",
          "¿Quién es más probable que recuerde llevar cargadores, agua y protector solar para todos?",
          "¿Quién es más probable que sobreviva mejor un viaje sin itinerario?",
          "¿Quién es más probable que aprenda frases del idioma antes de viajar?",
          "¿Quién es más probable que se levante para ver el amanecer después de dormir dos horas?",
          "¿Quién es más probable que convierta una reunión tranquila en una noche inolvidable?",
          "¿Quién es más probable que encuentre una oferta imposible para las próximas vacaciones?",
          "¿Quién es más probable que haga la lista de canciones del viaje?",
          "¿Quién es más probable que vuelva con un nuevo amigo de otra ciudad?",
        ],
      },
      {
        heading: "Preguntas sobre la amistad",
        description: "Preguntas positivas para reconocer lo que cada persona aporta al grupo.",
        items: [
          "¿Quién es más probable que recuerde una fecha importante para un amigo?",
          "¿Quién es más probable que conteste una llamada a cualquier hora?",
          "¿Quién es más probable que diga lo que necesitas escuchar y no solo lo que quieres oír?",
          "¿Quién es más probable que organice una reunión cuando el grupo se distancia?",
          "¿Quién es más probable que guarde el secreto de una sorpresa durante meses?",
          "¿Quién es más probable que celebre tus logros como si fueran propios?",
          "¿Quién es más probable que note que alguien está callado y pregunte cómo está?",
          "¿Quién es más probable que ayude en una mudanza sin poner excusas?",
          "¿Quién es más probable que recuerde una historia del grupo con todos los detalles?",
          "¿Quién es más probable que medie cuando dos amigos no se entienden?",
          "¿Quién es más probable que mantenga la amistad aunque vivan muy lejos?",
          "¿Quién es más probable que prepare el regalo más personal?",
          "¿Quién es más probable que anime al grupo a hacer algo bueno por otra persona?",
          "¿Quién es más probable que haga sentir incluida a una persona nueva?",
          "¿Quién es más probable que siga reuniendo al grupo dentro de veinte años?",
        ],
      },
    ],
    faq: [
      { question: "¿Cuáles son buenas preguntas de Quién es más probable para amigos?", answer: "Las mejores preguntas son reconocibles, inofensivas y capaces de provocar una historia: hábitos graciosos, aventuras, talentos y cualidades de amistad. Eviten preguntas que expongan secretos o avergüencen a alguien." },
      { question: "¿Se puede jugar con un grupo nuevo?", answer: "Sí. Empiecen con la sección de preguntas graciosas y no pidan justificar cada voto. Las preguntas sobre amistad funcionan mejor cuando el grupo ya se conoce un poco." },
      { question: "¿Cuántas personas hacen falta?", answer: "Funciona desde tres personas, aunque cinco a diez produce votos más variados. En grupos grandes, lean una pregunta por turno y señalen a la cuenta de tres." },
    ],
    relatedLinks: [
      { label: "Preguntas fuertes de Quién es más probable", href: "/es/topics/quien-es-mas-probable-preguntas-fuertes" },
      { label: "Preguntas para fiestas", href: "/es/topics/questions-to-ask-at-a-party" },
      { label: "Quién es más probable para amigas", href: "/es/topics/quien-es-mas-probable-amigas" },
      { label: "Generador de Quién es más probable", href: "/es/most-likely-to" },
    ],
  },
  awkward: {
    slug: "quien-es-mas-probable-preguntas-incomodas",
    dateLine: "Publicado el 19 de octubre de 2026",
    datePublished: "2026-10-19",
    title: "45 preguntas incómodas de Quién es más probable",
    metaTitle: "45 Preguntas Incómodas de Quién Es Más Probable",
    metaDescription:
      "45 preguntas incómodas de Quién es más probable: vergonzosas, comprometedoras y reveladoras, sin contenido explícito. Para amigos con confianza, con generador gratis.",
    heroSubtitle:
      "Preguntas que ponen a alguien en un pequeño aprieto: momentos vergonzosos, secretos inofensivos y confesiones que el grupo no esperaba.",
    intro:
      "Las preguntas incómodas funcionan porque nadie quiere ser el elegido, pero todos tienen un candidato. Empiecen por los momentos vergonzosos, sigan con secretos y redes sociales, y terminen con las que tocan amistad y relaciones. Antes de jugar acuerden una regla: cualquiera puede decir «paso» sin explicar nada. Así la incomodidad queda en risa y no en mal rato.",
    sections: [
      {
        heading: "Preguntas vergonzosas para empezar",
        description: "Situaciones que dan pena ajena pero que a todos nos han pasado alguna vez.",
        items: [
          "¿Quién es más probable que salude a alguien que en realidad saludaba a otra persona?",
          "¿Quién es más probable que se caiga en público y finja que fue a propósito?",
          "¿Quién es más probable que mande un audio larguísimo al chat equivocado?",
          "¿Quién es más probable que llame «mamá» a un profesor o a su jefe?",
          "¿Quién es más probable que se quede dormido en el cine y ronque?",
          "¿Quién es más probable que olvide el nombre de alguien justo al presentarlo?",
          "¿Quién es más probable que tenga comida entre los dientes toda una cita sin saberlo?",
          "¿Quién es más probable que empuje una puerta que claramente dice «jalar»?",
          "¿Quién es más probable que se ría en un momento serio y no pueda parar?",
          "¿Quién es más probable que cante a todo volumen con audífonos sin darse cuenta?",
          "¿Quién es más probable que conteste «tú también» cuando el mesero dice «buen provecho»?",
          "¿Quién es más probable que se equivoque de baño en un restaurante?",
          "¿Quién es más probable que se tropiece al entrar a una entrevista de trabajo?",
          "¿Quién es más probable que deje la cámara encendida en una videollamada sin querer?",
          "¿Quién es más probable que pregunte a alguien por su embarazo y no esté embarazada?",
        ],
      },
      {
        heading: "Secretos, chismes y redes sociales",
        description: "Para descubrir quién guarda capturas, quién stalkea y quién no sabe guardar un secreto.",
        items: [
          "¿Quién es más probable que dé «me gusta» por accidente a una foto de hace cinco años?",
          "¿Quién es más probable que tenga una cuenta secreta para ver historias?",
          "¿Quién es más probable que lea un mensaje y responda tres días después?",
          "¿Quién es más probable que cuente un secreto diciendo «pero no le digas a nadie»?",
          "¿Quién es más probable que tenga capturas de pantalla de todos los chats importantes?",
          "¿Quién es más probable que revise el perfil de su ex más de una vez por semana?",
          "¿Quién es más probable que finja no haber visto un mensaje que sí vio?",
          "¿Quién es más probable que se entere del chisme antes que la persona involucrada?",
          "¿Quién es más probable que borre una publicación porque no tuvo suficientes likes?",
          "¿Quién es más probable que tenga una búsqueda en su historial que le dé vergüenza explicar?",
          "¿Quién es más probable que invente una excusa para no ir a un plan y luego aparezca en fotos?",
          "¿Quién es más probable que lea los mensajes del celular de alguien por encima del hombro?",
          "¿Quién es más probable que deje en visto al grupo pero publique historias al mismo tiempo?",
          "¿Quién es más probable que tenga un apodo secreto para alguien de este grupo?",
          "¿Quién es más probable que sepa la contraseña del celular de su pareja?",
        ],
      },
      {
        heading: "Amistad, citas y confesiones",
        description: "Las más comprometedoras: úsenlas solo cuando el grupo ya está en confianza.",
        items: [
          "¿Quién es más probable que haya tenido un crush con alguien de este grupo?",
          "¿Quién es más probable que vuelva con su ex aunque todos le digan que no?",
          "¿Quién es más probable que coquetee sin darse cuenta?",
          "¿Quién es más probable que cancele una cita a último minuto con una excusa rara?",
          "¿Quién es más probable que se haya quedado con algo prestado y nunca lo devolvió?",
          "¿Quién es más probable que finja que le gusta un regalo que odió?",
          "¿Quién es más probable que haya mentido sobre su edad en una app de citas?",
          "¿Quién es más probable que se enamore de alguien a quien acaba de conocer?",
          "¿Quién es más probable que confiese algo importante solo porque se lo preguntaron directo?",
          "¿Quién es más probable que tenga una conversación pendiente con alguien de esta mesa?",
          "¿Quién es más probable que haya hablado mal de alguien y luego lo haya abrazado?",
          "¿Quién es más probable que llore viendo una película romántica y lo niegue?",
          "¿Quién es más probable que mande un mensaje a su ex a las 3 de la mañana?",
          "¿Quién es más probable que se haya hecho pasar por otra persona en una llamada?",
          "¿Quién es más probable que guarde un secreto de este grupo durante años?",
        ],
      },
    ],
    faq: [
      {
        question: "¿Qué son las preguntas incómodas de Quién es más probable?",
        answer:
          "Son preguntas que ponen al elegido en un pequeño aprieto: momentos vergonzosos, secretos inofensivos, redes sociales y citas. Generan risa porque todos reconocen la situación. Esta lista no incluye contenido sexual explícito.",
      },
      {
        question: "¿Cómo jugar con preguntas incómodas sin que nadie se moleste?",
        answer:
          "Acuerden antes que cualquiera puede decir «paso» sin explicar. Empiecen por la sección vergonzosa y dejen la de confesiones para el final. Si alguien se incomoda de verdad, cambien de pregunta: el objetivo es reír juntos, no exponer a nadie.",
      },
      {
        question: "¿En qué se diferencian de las preguntas fuertes?",
        answer:
          "Las preguntas fuertes tocan decisiones y valores. Las incómodas buscan el «trágame tierra»: situaciones de pena ajena y pequeños secretos. Puedes combinar ambas listas en una misma noche.",
      },
      {
        question: "¿Hay más preguntas para seguir jugando?",
        answer:
          "Sí. Abre el generador gratis de Quién es más probable para sacar preguntas al azar sin repeticiones, o mira las colecciones para amigos, amigas, parejas y preguntas chistosas.",
      },
    ],
    relatedLinks: [
      { label: "Preguntas fuertes de Quién es más probable", href: "/es/topics/quien-es-mas-probable-preguntas-fuertes" },
      { label: "Preguntas chistosas de Quién es más probable", href: "/es/topics/quien-es-mas-probable-preguntas-chistosas" },
      { label: "Quién es más probable para amigas", href: "/es/topics/quien-es-mas-probable-amigas" },
      { label: "Generador de Quién es más probable", href: "/es/most-likely-to" },
    ],
  },
  girlfriends: {
    slug: "quien-es-mas-probable-amigas",
    dateLine: "Publicado el 19 de octubre de 2026",
    datePublished: "2026-10-19",
    title: "45 preguntas de Quién es más probable para amigas",
    metaTitle: "45 Preguntas de Quién Es Más Probable para Amigas",
    metaDescription:
      "45 preguntas de Quién es más probable para amigas: divertidas, de chismes y de amistad. Para pijamadas, despedidas, cumpleaños y noches de chicas, con generador gratis.",
    heroSubtitle:
      "Preguntas para noches de chicas, pijamadas, despedidas de soltera o el grupo de WhatsApp: risas, chismes inocentes y momentos para celebrar la amistad.",
    intro:
      "Esta lista está pensada para un grupo de amigas. Empiecen con las divertidas sobre hábitos y estilo, sigan con citas y chismes, y cierren con las que celebran la amistad. A la cuenta de tres todas señalan a la vez. La que reciba más votos cuenta la historia que lo demuestra; si alguien no está de acuerdo, que defienda a su candidata.",
    sections: [
      {
        heading: "Preguntas divertidas para amigas",
        description: "Estilo, manías y costumbres para arrancar la noche con risas.",
        items: [
          "¿Quién es más probable que tarde dos horas en arreglarse y luego diga «ya casi»?",
          "¿Quién es más probable que tome 50 fotos para subir solo una?",
          "¿Quién es más probable que se compre algo que no necesita solo porque estaba en oferta?",
          "¿Quién es más probable que lleve en la bolsa todo lo que el grupo necesite?",
          "¿Quién es más probable que se corte el fleco sola y se arrepienta?",
          "¿Quién es más probable que pierda un arete en cada fiesta?",
          "¿Quién es más probable que se quede dormida antes de la medianoche en una pijamada?",
          "¿Quién es más probable que pida «lo mismo que ella» en todos los restaurantes?",
          "¿Quién es más probable que tenga más pestañas abiertas que horas de sueño?",
          "¿Quién es más probable que organice el clóset por colores un domingo?",
          "¿Quién es más probable que llore en una boda aunque apenas conozca a los novios?",
          "¿Quién es más probable que se ponga tacones y termine descalza en la pista?",
          "¿Quién es más probable que se sepa todos los bailes de TikTok?",
          "¿Quién es más probable que haga un horóscopo de compatibilidad para todo el grupo?",
          "¿Quién es más probable que invente una coreografía en medio de la fiesta?",
        ],
      },
      {
        heading: "Citas, crushes y chismes",
        description: "Para pijamadas y noches de chicas en las que ya hay confianza.",
        items: [
          "¿Quién es más probable que investigue a un crush hasta encontrar a su tía en Facebook?",
          "¿Quién es más probable que pida al grupo que le ayude a contestar un mensaje?",
          "¿Quién es más probable que se enamore en la primera cita?",
          "¿Quién es más probable que haga un análisis de cada emoji que le mandaron?",
          "¿Quién es más probable que tenga una lista de requisitos imposibles para su pareja ideal?",
          "¿Quién es más probable que vuelva con su ex y lo cuente después de un mes?",
          "¿Quién es más probable que sepa el chisme antes que nadie?",
          "¿Quién es más probable que se haga amiga del mesero, el chofer y la vecina en un día?",
          "¿Quién es más probable que tenga una cita con alguien que conoció en un viaje?",
          "¿Quién es más probable que mande una captura al grupo antes de responderle al chico?",
          "¿Quién es más probable que finja que no le importa y lo revise cada cinco minutos?",
          "¿Quién es más probable que tenga un plan B si la cita sale mal?",
          "¿Quién es más probable que se case primero?",
          "¿Quién es más probable que tenga la boda más grande y elaborada?",
          "¿Quién es más probable que termine con alguien famoso?",
        ],
      },
      {
        heading: "Preguntas sobre la amistad",
        description: "Para cerrar la ronda celebrando lo que cada una aporta al grupo.",
        items: [
          "¿Quién es más probable que llegue a ayudarte a las 2 de la mañana sin preguntar?",
          "¿Quién es más probable que recuerde el cumpleaños de todas sin calendario?",
          "¿Quién es más probable que te diga la verdad aunque no quieras escucharla?",
          "¿Quién es más probable que organice el viaje de amigas y lo haga realidad?",
          "¿Quién es más probable que guarde todas las fotos del grupo desde hace años?",
          "¿Quién es más probable que dé el mejor consejo después de una ruptura?",
          "¿Quién es más probable que defienda a una amiga aunque no esté presente?",
          "¿Quién es más probable que haga reír a todas cuando alguien está triste?",
          "¿Quién es más probable que siga siendo amiga de todas dentro de 30 años?",
          "¿Quién es más probable que prepare un regalo hecho a mano?",
          "¿Quién es más probable que proponga una tradición nueva para el grupo?",
          "¿Quién es más probable que sea la madrina de los hijos de alguien aquí?",
          "¿Quién es más probable que viva en otro país y aun así no falte a ninguna reunión?",
          "¿Quién es más probable que lleve comida casera cuando alguien se enferma?",
          "¿Quién es más probable que escriba el mensaje más bonito en un cumpleaños?",
        ],
      },
    ],
    faq: [
      {
        question: "¿Cómo se juega Quién es más probable con amigas?",
        answer:
          "Una lee la pregunta, cuentan hasta tres y todas señalan a la vez a la amiga que mejor encaja. La más votada cuenta la anécdota o bebe un sorbo de su bebida si juegan en versión fiesta. Con 45 preguntas tienen para una noche completa.",
      },
      {
        question: "¿Sirven para una despedida de soltera o una pijamada?",
        answer:
          "Sí. La sección de citas y chismes funciona muy bien en despedidas y pijamadas, y la de amistad sirve para cerrar la noche con un momento bonito. Para un grupo nuevo empieza por las divertidas.",
      },
      {
        question: "¿Se pueden jugar por WhatsApp o videollamada?",
        answer:
          "Sí. Manda una pregunta al grupo y cada una responde con el nombre o con una encuesta. El generador gratis saca preguntas al azar para copiarlas al chat.",
      },
      {
        question: "¿Hay versión con preguntas más atrevidas?",
        answer:
          "Mira las preguntas incómodas para momentos vergonzosos y secretos, o las preguntas fuertes para temas más intensos. Para grupos mixtos usa la colección para amigos.",
      },
    ],
    relatedLinks: [
      { label: "Quién es más probable para amigos", href: "/es/topics/quien-es-mas-probable-amigos" },
      { label: "Preguntas incómodas de Quién es más probable", href: "/es/topics/quien-es-mas-probable-preguntas-incomodas" },
      { label: "Preguntas chistosas de Quién es más probable", href: "/es/topics/quien-es-mas-probable-preguntas-chistosas" },
      { label: "Generador de Quién es más probable", href: "/es/most-likely-to" },
    ],
  },
  funny: {
    slug: "quien-es-mas-probable-preguntas-chistosas",
    dateLine: "Publicado el 19 de octubre de 2026",
    datePublished: "2026-10-19",
    title: "45 preguntas chistosas de Quién es más probable",
    metaTitle: "45 Preguntas Chistosas de Quién Es Más Probable",
    metaDescription:
      "45 preguntas chistosas de Quién es más probable: graciosas, absurdas y aptas para todos. Para fiestas, familia, clase y reuniones, con generador gratis y sin registro.",
    heroSubtitle:
      "Preguntas graciosas y absurdas que hacen reír a cualquier grupo: amigos, familia, compañeros de clase o de trabajo. Sin preguntas incómodas.",
    intro:
      "Esta lista es para reír sin poner a nadie en aprietos. Empiecen con situaciones cotidianas, pasen a escenarios absurdos y terminen con preguntas de superpoderes y futuro. Son aptas para familia, clase o trabajo. Lean la pregunta, cuenten hasta tres y señalen; si hay empate, los empatados defienden su caso en 10 segundos y el grupo vota otra vez.",
    sections: [
      {
        heading: "Preguntas chistosas del día a día",
        description: "Situaciones cotidianas que todos reconocen y que siempre sacan una anécdota.",
        items: [
          "¿Quién es más probable que busque sus lentes mientras los lleva puestos?",
          "¿Quién es más probable que le hable a su mascota como si fuera una persona?",
          "¿Quién es más probable que se coma la comida de otro en el refrigerador de la oficina?",
          "¿Quién es más probable que apague la alarma diez veces y aun así llegue a tiempo?",
          "¿Quién es más probable que se pierda usando el GPS?",
          "¿Quién es más probable que se ría de su propio chiste antes de terminarlo?",
          "¿Quién es más probable que se meta a la regadera con los calcetines puestos?",
          "¿Quién es más probable que discuta con un asistente de voz?",
          "¿Quién es más probable que ponga el cereal antes que la leche y lo defienda a muerte?",
          "¿Quién es más probable que se quede encerrado fuera de su casa en pijama?",
          "¿Quién es más probable que use el mismo chiste en cada reunión familiar?",
          "¿Quién es más probable que salude con la mano a alguien que no lo estaba saludando?",
          "¿Quién es más probable que se coma un postre entero «solo para probarlo»?",
          "¿Quién es más probable que pierda el celular mientras habla por el celular?",
          "¿Quién es más probable que se duerma en el transporte y se pase de parada?",
        ],
      },
      {
        heading: "Escenarios absurdos",
        description: "Preguntas imposibles para imaginar quién sobreviviría (o no) a cada situación.",
        items: [
          "¿Quién es más probable que sobreviva un apocalipsis zombi escondido en un supermercado?",
          "¿Quién es más probable que se haga amigo de un mapache?",
          "¿Quién es más probable que gane un concurso de comer picante y luego llore?",
          "¿Quién es más probable que sea abducido por extraterrestres y los convenza de traerlo de vuelta?",
          "¿Quién es más probable que adopte una gallina como mascota?",
          "¿Quién es más probable que se pierda en un IKEA durante tres días?",
          "¿Quién es más probable que intente entrar a un lugar con un disfraz para que no lo reconozcan?",
          "¿Quién es más probable que entre a un reality show y lo saquen el primer día?",
          "¿Quién es más probable que se vuelva viral por bailar en una boda?",
          "¿Quién es más probable que intente cortarse el pelo con unas tijeras de cocina?",
          "¿Quién es más probable que le ponga nombre a todas sus plantas?",
          "¿Quién es más probable que pida una pizza en medio de una película de terror?",
          "¿Quién es más probable que confunda sal con azúcar en un pastel de cumpleaños?",
          "¿Quién es más probable que intente acariciar a un animal salvaje en un viaje?",
          "¿Quién es más probable que termine en el noticiero local por algo ridículo?",
        ],
      },
      {
        heading: "Superpoderes, fama y futuro",
        description: "Para cerrar imaginando el futuro más gracioso de cada persona del grupo.",
        items: [
          "¿Quién es más probable que use un superpoder solo para no hacer fila?",
          "¿Quién es más probable que se haga famoso por una razón totalmente inesperada?",
          "¿Quién es más probable que viaje en el tiempo y cambie algo sin querer?",
          "¿Quién es más probable que abra un restaurante que solo sirve un plato?",
          "¿Quién es más probable que tenga 15 gatos dentro de 20 años?",
          "¿Quién es más probable que escriba un libro de autoayuda sin seguir sus propios consejos?",
          "¿Quién es más probable que gane la lotería y pierda el boleto?",
          "¿Quién es más probable que se convierta en influencer de su mascota?",
          "¿Quién es más probable que invente algo inútil y se haga millonario?",
          "¿Quién es más probable que sea presidente de su colonia por accidente?",
          "¿Quién es más probable que viva en una casa del árbol de adulto?",
          "¿Quién es más probable que se vuelva experto en un tema rarísimo?",
          "¿Quién es más probable que gane un concurso de imitaciones?",
          "¿Quién es más probable que tenga un canal de cocina donde todo sale mal?",
          "¿Quién es más probable que siga contando el mismo chiste a los 90 años?",
        ],
      },
    ],
    faq: [
      {
        question: "¿Cuáles son preguntas chistosas de Quién es más probable?",
        answer:
          "Son preguntas graciosas sobre hábitos, despistes y escenarios absurdos, como «¿quién es más probable que busque sus lentes mientras los lleva puestos?». No ponen a nadie en aprietos, así que sirven para cualquier grupo.",
      },
      {
        question: "¿Son aptas para niños, familia o clase?",
        answer:
          "Sí. Esta lista no tiene preguntas de citas, alcohol ni secretos, así que funciona en reuniones familiares, en el salón de clases y en el trabajo. Para adultos con confianza mira las preguntas incómodas o las fuertes.",
      },
      {
        question: "¿Cómo hacer el juego más divertido?",
        answer:
          "Pide que la persona más votada cuente la historia que lo demuestra, y si hay empate que cada uno defienda su caso en 10 segundos. También pueden escribir sus propias preguntas chistosas sobre recuerdos del grupo.",
      },
      {
        question: "¿Dónde saco más preguntas al azar?",
        answer:
          "En el generador gratis de Quién es más probable: una pregunta por clic, sin repeticiones y sin registro. También hay colecciones para amigos, amigas y parejas.",
      },
    ],
    relatedLinks: [
      { label: "Quién es más probable para amigos", href: "/es/topics/quien-es-mas-probable-amigos" },
      { label: "Quién es más probable para amigas", href: "/es/topics/quien-es-mas-probable-amigas" },
      { label: "Preguntas incómodas de Quién es más probable", href: "/es/topics/quien-es-mas-probable-preguntas-incomodas" },
      { label: "Generador de Quién es más probable", href: "/es/most-likely-to" },
    ],
  },
} satisfies Record<string, SpanishMostLikelyConfig>;
