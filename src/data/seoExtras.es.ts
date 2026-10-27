// Extra Spanish content blocks appended to already-ranking /es pages (2026-10-28).
// The original article objects (title, H1, intro, sections, existing FAQ) are left
// untouched; these blocks render after the main lists and their FAQ entries are
// appended to the existing FAQ. Text is neutral Latin-American Spanish (tú).
// Inline links use [texto](/es/ruta) and are parsed by EsRich.

export interface ExtraBlock {
  id: string;
  heading: string;
  intro?: string;
  groups?: { title: string; items: string[] }[];
  items?: string[];
  ordered?: boolean;
  outro?: string;
}

export interface ArticleExtras {
  blocks: ExtraBlock[];
  faq: { question: string; answer: string }[];
  tryNext: { href: string; label: string; emoji: string }[];
}

export const ES_ARTICLE_EXTRAS: Record<string, ArticleExtras> = {
  // ---------------------------------------------------------------------------
  "conversation-starters-for-couples": {
    blocks: [
      {
        id: "temas-para-hablar-con-mi-novia",
        heading: "Temas para hablar con mi novia",
        intro:
          "Cuando ya se conocen lo básico, lo que mantiene viva la conversación es preguntar por lo concreto: lo que pasó hoy, lo que le preocupa y lo que le ilusiona. Estas ideas funcionan en persona, en una llamada o durante una caminata.",
        items: [
          "¿Cuál fue el mejor momento de tu semana y cuál el más pesado? Me gustaría saber de los dos.",
          "¿Qué proyecto o sueño tienes en pausa y qué necesitarías para retomarlo? Quiero ayudarte a que pase.",
          "¿Qué recuerdo de tu infancia te hace sonreír cada vez que lo cuentas?",
          "¿Cómo te gusta que te apoyen cuando tienes un mal día: con consejos, con compañía o con silencio?",
          "¿Qué lugar del mundo te gustaría conocer conmigo y qué haríamos el primer día?",
          "¿Qué canción te recuerda a nosotros y por qué?",
          "¿Hay algo que te gustaría que hiciéramos más seguido, aunque sea una tontería?",
          "¿Qué cosa pequeña que hago te hace sentir querida?",
          "¿Cómo te imaginas un domingo perfecto de aquí a cinco años?",
          "¿Cuál es tu mayor miedo con respecto a tu futuro profesional y cómo puedo acompañarte?",
        ],
        outro:
          "Si prefieres una lista más amplia para cualquier ocasión, mira los [temas de conversación](/es/conversation) generales y elige los que mejor encajen con ella.",
      },
      {
        id: "temas-para-hablar-con-mi-novio",
        heading: "Temas para hablar con mi novio",
        intro:
          "A muchas personas les cuesta más hablar de emociones que de planes o de gustos. Empieza por lo que le apasiona y ve acercándote poco a poco a lo personal.",
        items: [
          "¿Qué te gustaría haber aprendido de más joven y todavía podrías aprender?",
          "¿Cuál fue la decisión más difícil que has tomado y cómo te sentiste después?",
          "¿Qué hobby, juego o deporte te gustaría que compartiéramos?",
          "¿Qué te hace sentir orgulloso de ti mismo últimamente, aunque nadie lo haya notado?",
          "¿Cómo era tu relación con tu familia cuando eras adolescente y qué ha cambiado?",
          "¿Qué película o serie te ha marcado y qué parte de ti se reflejó en ella?",
          "¿En qué momentos del día o de la semana te sientes más cerca de mí?",
          "¿Qué te preocupa del dinero, del trabajo o de los estudios y no sueles contar?",
          "Si pudiéramos mudarnos a cualquier ciudad por un año, ¿cuál elegirías y por qué?",
          "¿Qué tradición nuestra te gustaría crear: un viaje anual, una cena especial, una carta de aniversario?",
        ],
      },
      {
        id: "temas-para-hablar-por-whatsapp",
        heading: "Temas para hablar con tu novio o novia por WhatsApp",
        intro:
          "Por mensaje funcionan mejor las preguntas cortas, que se pueden responder con un audio, una foto o dos líneas. Alterna ligeras y profundas para que el chat no se vuelva una rutina de «¿ya comiste?».",
        groups: [
          {
            title: "Para empezar la conversación",
            items: [
              "Mándale una foto de lo que tienes frente a ti y pregúntale qué ve ella o él ahora mismo.",
              "«Tres palabras para describir tu día. Yo empiezo.»",
              "«Si hoy pudieras teletransportarte a cualquier lugar, ¿a dónde irías?»",
              "Comparte una canción y pide que te mande otra que le haya gustado esta semana.",
            ],
          },
          {
            title: "Para reír juntos",
            items: [
              "«Pelea con dos opciones: ¿vivir sin música o sin pantallas por un mes?»",
              "Manda un meme y pregunta cuál de los dos es el personaje de la imagen.",
              "«¿Cuál es la peor cita de tu vida? Cuéntame con todos los detalles.»",
              "Juega a ¿qué preferirías? con un [juego de qué preferirías](/es/would-you-rather) y guarden las respuestas más divertidas.",
            ],
          },
          {
            title: "Para acercarse (cuando hay tiempo para responder con calma)",
            items: [
              "«¿Qué es algo que sientes que no te he preguntado todavía?»",
              "«¿Qué recuerdo mío o nuestro te vino hoy a la cabeza?»",
              "«¿Qué necesitas esta semana de mí, aunque no sepas cómo pedirlo?»",
              "Recibe una pregunta al día con la [pregunta diaria para parejas](/es/pregunta-diaria-pareja) y respóndanla cada uno por su lado antes de comparar.",
            ],
          },
        ],
        outro:
          "Un consejo: no conviertan el chat en un interrogatorio. Si una pregunta merece una conversación larga, propón seguirla por llamada o en persona.",
      },
      {
        id: "temas-profundos-con-tu-pareja",
        heading: "Temas profundos con tu pareja, por niveles",
        intro:
          "Los temas de conversación profundos funcionan mejor cuando se avanza por niveles: primero lo seguro, después lo vulnerable y al final lo que de verdad define la relación. No saltes de nivel si la otra persona no está lista.",
        groups: [
          {
            title: "Nivel 1: conocerse mejor",
            items: [
              "¿Qué te hace sentir más tú mismo o tú misma?",
              "¿Qué valoras más en una amistad y en una pareja?",
              "¿Qué es lo que más te gusta de cómo nos comunicamos?",
            ],
          },
          {
            title: "Nivel 2: emociones y miedos",
            items: [
              "¿Cuándo te sentiste más solo o sola, y qué te habría gustado que alguien dijera?",
              "¿Qué inseguridad te cuesta más admitir en una relación?",
              "¿Qué cosa te cuesta perdonar y qué te ayuda a soltarla?",
            ],
          },
          {
            title: "Nivel 3: el futuro de los dos",
            items: [
              "¿Cómo imaginas que repartiríamos las tareas, el dinero y el tiempo libre viviendo juntos?",
              "¿Qué esperas de nuestra relación en cinco años y qué estás dispuesto o dispuesta a cambiar para llegar ahí?",
              "¿Qué te gustaría que nunca dejáramos de hacer, pase lo que pase?",
            ],
          },
        ],
        outro:
          "Para más preguntas de este tipo, tienes la colección de [preguntas profundas para tu pareja](/es/topics/deep-questions-to-ask-your-partner) y las [preguntas profundas](/es/preguntas-profundas) del generador.",
      },
      {
        id: "como-usar-estos-temas",
        heading: "Cómo usar estos temas de conversación en pareja",
        ordered: true,
        items: [
          "Elijan un momento sin prisa y sin pantallas: una cena, un paseo o antes de dormir. Evita abrir un tema delicado cuando alguno está cansado.",
          "Túrnense para escoger el tema. Quien pregunta responde también: así nadie se siente interrogado.",
          "Pregunta una vez más. Un «¿y por qué te sientes así?» suele abrir más que la pregunta original.",
          "Escucha antes de aconsejar. Muchas veces la otra persona solo quiere que la entiendas, no que le resuelvas nada.",
          "Si un tema genera tensión, déjenlo para otro día. Anótenlo y retómenlo con calma.",
          "Cierra con algo positivo: una cosa que aprendiste de la otra persona hoy.",
        ],
      },
      {
        id: "cuando-no-sabes-de-que-hablar",
        heading: "No sé de qué hablar con mi pareja: ideas según la situación",
        groups: [
          {
            title: "Relación nueva (primeros meses)",
            items: [
              "Hablen de gustos, familia, trabajo o estudios y de lo que cada uno hace en su tiempo libre. Si estás en las primeras citas, mira las [conversaciones para una primera cita](/es/topics/first-date-conversation-topics).",
            ],
          },
          {
            title: "Relación de años (rutina)",
            items: [
              "Recuerden juntos las primeras veces: su primer viaje, la primera discusión que resolvieron, su primera casa. Después hablen de lo que quieren vivir por primera vez.",
            ],
          },
          {
            title: "Relación a distancia",
            items: [
              "Elijan una pregunta por videollamada, vean la misma serie a la vez o jueguen a [esto o aquello](/es/this-or-that) para saber qué prefiere cada uno.",
            ],
          },
          {
            title: "Cuando quieren jugar en lugar de hablar",
            items: [
              "Prueben las [preguntas para una noche de juegos en pareja](/es/topics/couples-game-night-questions) o las rondas de [quién es más probable para parejas](/es/topics/quien-es-mas-probable-parejas).",
            ],
          },
        ],
        outro:
          "¿Buscas ideas que no sean solo de pareja, sino para amigos, familia o el trabajo? Entra a [más temas de conversación](/es/conversation).",
      },
    ],
    faq: [
      {
        question: "¿De qué puedo hablar con mi novia por WhatsApp?",
        answer:
          "Alterna tres tipos de mensajes: ligeros (una foto, una canción, un meme), curiosos (una pregunta corta sobre su día o un recuerdo) y de cercanía (cómo se siente o qué necesita esta semana). Evita las preguntas muy largas y deja las conversaciones difíciles para una llamada.",
      },
      {
        question: "¿Qué temas de conversación puedo tener con mi novio cuando ya no sé qué decir?",
        answer:
          "Prueba con recuerdos compartidos, planes que aún no han hecho y preguntas sobre cosas que nunca has preguntado, como qué le gustaría aprender o qué tradición quiere crear contigo. También sirve cambiar el escenario: una caminata o cocinar juntos suele soltar la conversación.",
      },
      {
        question: "¿Qué temas de conversación profundos puedo hablar con mi pareja?",
        answer:
          "Los más comunes son sueños y miedos, cómo se sienten amados, qué esperan del futuro, cómo manejan los conflictos y qué valores comparten. Avanza por niveles y no presiones: si alguien no se siente listo para un tema, pasa a otro y vuelve más tarde.",
      },
      {
        question: "¿Qué temas se deben evitar al inicio de una relación?",
        answer:
          "No hay temas prohibidos, pero conviene dejar para más adelante las comparaciones con ex parejas, las exigencias de futuro muy concretas y los asuntos de dinero muy detallados. Empieza por gustos, familia, trabajo y planes, y profundiza a medida que se genera confianza.",
      },
      {
        question: "¿Cuál es la diferencia entre temas de conversación y preguntas para parejas?",
        answer:
          "Un tema es un área amplia para hablar (viajes, familia, sueños). Una pregunta es una forma concreta de abrir ese tema. En esta página encontrarás ambas: listas por temas y preguntas listas para leer en voz alta.",
      },
    ],
    tryNext: [
      { href: "/es/pregunta-diaria-pareja", label: "Pregunta diaria para parejas", emoji: "💞" },
      { href: "/es/would-you-rather", label: "¿Qué preferirías?", emoji: "🤔" },
      { href: "/es/this-or-that", label: "Esto o aquello", emoji: "⚖️" },
      { href: "/es/topics/couples-game-night-questions", label: "Noche de juegos en pareja", emoji: "🎲" },
    ],
  },

  // ---------------------------------------------------------------------------
  "controversial-topics-to-discuss": {
    blocks: [
      {
        id: "que-hace-polemico-un-tema",
        heading: "Qué hace que un tema sea polémico o debatible",
        intro:
          "«Polémico», «controversial» y «debatible» se usan casi como sinónimos, pero no todo tema que incomoda sirve para debatir. Un buen tema polémico cumple tres criterios:",
        items: [
          "No hay una respuesta única aceptada por todos: personas informadas y razonables pueden llegar a conclusiones distintas.",
          "Hay algo importante en juego: derechos, salud, dinero, seguridad o valores.",
          "Se puede discutir con argumentos y datos, no solo con insultos o creencias imposibles de comprobar.",
        ],
        ordered: true,
      },
      {
        id: "temas-polemicos-actuales",
        heading: "Temas polémicos actuales para debatir",
        intro:
          "Preguntas para abrir un debate hoy. Todas se pueden defender a favor o en contra; lo importante es traer ejemplos y fuentes.",
        groups: [
          {
            title: "Tecnología y vida digital",
            items: [
              "¿Debería existir una edad mínima legal para abrir cuentas en redes sociales?",
              "¿Quién es responsable cuando una inteligencia artificial comete un error: la empresa, el usuario o el programador?",
              "¿Es aceptable que los empleadores revisen las redes sociales de los candidatos?",
              "¿Deberían los trabajos remotos ser un derecho cuando el puesto lo permite?",
            ],
          },
          {
            title: "Sociedad y convivencia",
            items: [
              "¿Debe la libertad de expresión tener límites cuando se trata de discursos de odio?",
              "¿Deberían los espacios públicos tener cámaras de vigilancia para reducir el delito?",
              "¿Es justo que existan cuotas para garantizar la representación de ciertos grupos?",
              "¿Deberían legalizarse o regularse las apuestas deportivas en línea?",
            ],
          },
          {
            title: "Medio ambiente y consumo",
            items: [
              "¿Deberían prohibirse los plásticos de un solo uso aunque suban los precios?",
              "¿Es ético comer carne si existen alternativas vegetales accesibles?",
              "¿Quién debe pagar más por el cambio climático: los países ricos, las grandes empresas o cada persona?",
            ],
          },
          {
            title: "Educación y trabajo",
            items: [
              "¿Debería eliminarse la tarea para llevar a casa en la educación básica?",
              "¿Debería existir una semana laboral de cuatro días?",
              "¿Deberían los exámenes estandarizados decidir el acceso a la universidad?",
            ],
          },
        ],
      },
      {
        id: "temas-controversiales-para-jovenes-y-clase",
        heading: "Temas controversiales para debatir en clase y entre jóvenes",
        intro:
          "Si el grupo es de secundaria o preparatoria, elige temas cercanos a su vida y evita los que puedan ser dolorosos para alguien en el aula. Estos suelen funcionar bien:",
        items: [
          "¿Deberían los celulares estar prohibidos durante toda la jornada escolar?",
          "¿El uniforme escolar limita la expresión personal o reduce las diferencias entre estudiantes?",
          "¿Las notas miden realmente cuánto aprendes?",
          "¿Debería el voto ser obligatorio?",
          "¿Está bien que los influencers ganen dinero promocionando productos sin avisar claramente que es publicidad?",
          "¿Es justo que los videojuegos sean considerados un deporte?",
        ],
        outro:
          "Para más ideas con formato de clase, abre los [temas de debate para estudiantes](/es/topics/debate-topics-for-students) y los [temas para adolescentes](/es/topics/conversation-topics-for-teens).",
      },
      {
        id: "como-debatir-sin-pelear",
        heading: "Cómo debatir un tema polémico paso a paso",
        ordered: true,
        items: [
          "Acuerden reglas antes de empezar: se critica la idea, no a la persona; nadie interrumpe; cada intervención tiene un tiempo.",
          "Definan los términos. Si se debate sobre «censura» o «libertad», aclaren qué significa para ustedes.",
          "Asigna posturas al azar, aunque no sean las que cada uno piensa. Defender lo contrario obliga a entender al otro.",
          "Cada lado presenta dos o tres argumentos con un ejemplo o un dato.",
          "Hagan una ronda de repreguntas: «¿qué evidencia tienes?» y «¿qué pasaría si…?».",
          "Cierren con una votación de cómo cambió la opinión de cada uno. Cambiar de idea no es perder.",
        ],
        outro:
          "Si buscas una ronda más estructurada, usa el [generador de temas de debate](/es/debate) o el [generador de argumentos](/es/argument-generator).",
      },
      {
        id: "temas-debatibles-ligeros",
        heading: "Temas debatibles ligeros para calentar",
        intro:
          "Antes de entrar en temas delicados, calienta con debates sin carga emocional. Sirven para practicar los turnos y la forma de argumentar.",
        items: [
          "¿Es un perro mejor mascota que un gato?",
          "¿Se debería poner piña en la pizza?",
          "¿Es mejor ahorrar para viajar o para comprar una casa?",
          "¿Es mejor leer el libro antes de ver la película o al revés?",
          "¿Son mejores las vacaciones en la playa o en la montaña?",
          "¿Hay que dormir con la ventana abierta o cerrada?",
        ],
        outro:
          "Más preguntas para abrir debates ligeros en [preguntas de dilemas morales](/es/dilemas-morales) y [preguntas filosóficas](/es/preguntas-filosoficas).",
      },
    ],
    faq: [
      {
        question: "¿Cuáles son los temas polémicos más actuales para debatir?",
        answer:
          "Los más frecuentes hoy giran en torno a redes sociales y edad mínima, inteligencia artificial y trabajo, libertad de expresión, medio ambiente y consumo, semana laboral de cuatro días y exámenes estandarizados. Elige uno con datos recientes para que el debate no dependa solo de opiniones.",
      },
      {
        question: "¿Es lo mismo un tema polémico que un tema controversial?",
        answer:
          "En la práctica sí: ambos hablan de asuntos sobre los que hay desacuerdo. «Polémico» se usa más en España y México; «controversial» es muy común en América Latina; «debatible» enfatiza que se puede discutir con argumentos.",
      },
      {
        question: "¿Cómo elijo un tema polémico para un debate en grupo?",
        answer:
          "Elige un tema que divida al grupo casi por la mitad. Una votación rápida previa ayuda a saberlo. Evita los temas que puedan herir a alguien presente y empieza con los más ligeros si es la primera vez que debaten.",
      },
      {
        question: "¿Qué temas polémicos puedo debatir sin generar conflicto?",
        answer:
          "Los temas que no tocan identidades personales, como el uso del celular en clase, la semana laboral de cuatro días o los plásticos de un solo uso, suelen permitir un debate respetuoso. Define reglas claras y usa turnos de palabra.",
      },
    ],
    tryNext: [
      { href: "/es/debate", label: "Temas de debate", emoji: "⚔️" },
      { href: "/es/argument-generator", label: "Generador de argumentos", emoji: "🧠" },
      { href: "/es/dilemas-morales", label: "Dilemas morales", emoji: "⚖️" },
      { href: "/es/preguntas-filosoficas", label: "Preguntas filosóficas", emoji: "🌌" },
    ],
  },

  // ---------------------------------------------------------------------------
  "public-speaking-topics-for-beginners": {
    blocks: [
      {
        id: "temas-de-oratoria-por-duracion",
        heading: "Temas de oratoria según la duración",
        intro:
          "Un ritmo cómodo ronda las 120 a 150 palabras por minuto, así que un discurso de 1 minuto son unas 130 palabras y uno de 5 minutos, unas 650. Elige un tema que quepa en el tiempo que tienes.",
        groups: [
          {
            title: "Para 1 minuto (una sola idea)",
            items: [
              "El mejor consejo que me han dado.",
              "Un objeto que siempre llevo conmigo.",
              "Por qué vale la pena madrugar (o no).",
              "Mi lugar favorito de la ciudad.",
            ],
          },
          {
            title: "Para 2 o 3 minutos (idea + ejemplo)",
            items: [
              "Un error que me enseñó algo importante.",
              "Cómo preparar mi comida favorita en tres pasos.",
              "Por qué la lectura cambió mi forma de ver las cosas.",
              "Un hábito pequeño que mejoró mi semana.",
            ],
          },
          {
            title: "Para 5 minutos (dos ideas + historia)",
            items: [
              "Cómo aprender algo nuevo sin miedo a equivocarse.",
              "Lo que los videojuegos enseñan sobre la perseverancia.",
              "Por qué deberíamos aprender primeros auxilios en la escuela.",
              "La importancia de dormir bien para estudiar mejor.",
            ],
          },
        ],
      },
      {
        id: "temas-para-oratoria-juvenil-y-escolar",
        heading: "Temas para oratoria juvenil y concursos escolares",
        intro:
          "En concursos de oratoria se valora que el tema tenga una postura clara, un ejemplo cercano y una frase final memorable. Estos temas lo permiten:",
        items: [
          "Mi voz importa: por qué los jóvenes debemos participar en las decisiones de la escuela.",
          "El valor de la honestidad cuando nadie te está mirando.",
          "Las redes sociales: ¿nos acercan o nos aíslan?",
          "Qué significa ser un buen amigo.",
          "El poder de la constancia: aprender algo cada día.",
          "Cuidar el agua, un compromiso de todos.",
          "Mi mayor miedo y cómo lo estoy enfrentando.",
          "Lo que aprendí de un fracaso.",
        ],
        outro:
          "Si necesitas un tema distinto cada vez, usa el [generador de temas para discursos](/es/speech) o el [generador de temas para exponer](/es/generador-de-temas-para-exponer).",
      },
      {
        id: "temas-para-exponer-faciles",
        heading: "Temas para exponer fáciles (para clase o trabajo)",
        intro:
          "Para una exposición, lo fácil es elegir algo que ya conoces y que se pueda explicar con imágenes. Algunas ideas:",
        items: [
          "Cómo funciona una aplicación que usas todos los días.",
          "La historia de un deporte o de un videojuego.",
          "Cómo elegir una buena contraseña y proteger tus cuentas.",
          "Un animal poco conocido de tu región.",
          "Los beneficios de caminar cada día.",
          "Qué hace un buen equipo de trabajo.",
          "Cómo ahorrar con un presupuesto sencillo.",
          "Cinco datos curiosos de un país que quieras visitar.",
        ],
        outro:
          "Mira también las [ideas de presentación para la escuela](/es/topics/presentation-ideas-for-school) y los [temas de discurso para universitarios](/es/topics/speech-topics-for-college-students).",
      },
      {
        id: "estructura-de-un-discurso-corto",
        heading: "Cómo estructurar un discurso corto en tres pasos",
        ordered: true,
        items: [
          "Apertura (primeros 20 a 30 segundos): una pregunta, un dato sorprendente o una historia breve. Evita empezar con «hola, me llamo… y voy a hablar de…».",
          "Desarrollo: dos ideas máximo, cada una con un ejemplo concreto. Si no cabe en el tiempo, quita una idea, no hables más rápido.",
          "Cierre: repite tu idea principal con otras palabras y termina con una frase para recordar o una invitación a la acción.",
          "Ensaya en voz alta con un cronómetro y grábate. Con tres ensayos se nota la diferencia.",
        ],
        outro:
          "Para practicar sin preparación, usa los [temas para discursos improvisados](/es/impromptu-speech-topics) o el generador de [Table Topics](/es/table-topics-generator).",
      },
      {
        id: "ideas-de-apertura",
        heading: "Ideas de apertura para empezar tu discurso",
        items: [
          "Una pregunta: «¿Cuántas veces dejaste de hacer algo por miedo a equivocarte?».",
          "Un dato: «Hablar en público es uno de los miedos más frecuentes, y se puede entrenar».",
          "Una escena: «Eran las siete de la mañana y yo estaba frente a la puerta del salón sin atreverme a entrar».",
          "Una afirmación fuerte: «Nadie nace sabiendo hablar en público».",
        ],
      },
    ],
    faq: [
      {
        question: "¿Qué temas puedo usar para una oratoria de 5 minutos?",
        answer:
          "Elige un tema que te permita contar una historia y defender una idea: un aprendizaje personal, un hábito que te cambió, un problema de tu comunidad o una habilidad que enseñas paso a paso. Prepara dos ideas con un ejemplo cada una, más una apertura y un cierre.",
      },
      {
        question: "¿Cómo elijo un tema libre y corto para hablar?",
        answer:
          "Parte de algo que ya sabes explicar en una frase: un objeto, una experiencia o una opinión. Si lo puedes resumir en una oración, cabrá en uno o dos minutos. Evita temas demasiado amplios como «la tecnología» y baja a algo concreto como «cómo uso el teléfono para estudiar».",
      },
      {
        question: "¿Cuántas palabras necesito para un discurso de 1, 2 o 5 minutos?",
        answer:
          "Con un ritmo normal de 120 a 150 palabras por minuto, son unas 130 palabras para 1 minuto, 260 a 300 para 2 minutos y entre 600 y 750 para 5 minutos. Si hablas con pausas o muestras diapositivas, calcula un poco menos.",
      },
      {
        question: "¿Cuál es la diferencia entre oratoria y exposición?",
        answer:
          "La oratoria busca persuadir o inspirar con la palabra, usualmente con una postura personal. La exposición explica un tema con datos y apoyo visual. En una clase puedes combinar ambas: informar primero y terminar con tu opinión.",
      },
    ],
    tryNext: [
      { href: "/es/speech", label: "Temas para discursos", emoji: "🎤" },
      { href: "/es/impromptu-speech-topics", label: "Discurso improvisado", emoji: "⏱️" },
      { href: "/es/table-topics-generator", label: "Table Topics", emoji: "🗣️" },
      { href: "/es/generador-de-temas-para-exponer", label: "Temas para exponer", emoji: "📊" },
    ],
  },

  // ---------------------------------------------------------------------------
  "conversation-topics-for-teens": {
    blocks: [
      {
        id: "temas-para-debatir-entre-jovenes",
        heading: "Temas para debatir entre jóvenes, por categoría",
        intro:
          "Estas preguntas están pensadas para adolescentes de secundaria y preparatoria. Elijan una, voten a favor o en contra y expliquen su razón.",
        groups: [
          {
            title: "Redes y tecnología",
            items: [
              "¿Debería prohibirse el celular durante las clases?",
              "¿Los influencers son un buen ejemplo a seguir?",
              "¿Cuánto tiempo de pantalla es demasiado?",
              "¿Es peligroso compartir nuestra vida en redes?",
            ],
          },
          {
            title: "Escuela y futuro",
            items: [
              "¿Es necesario ir a la universidad para tener un buen trabajo?",
              "¿Debería la escuela empezar más tarde por la mañana?",
              "¿Deberían enseñar educación financiera como materia obligatoria?",
              "¿Los exámenes son la mejor forma de evaluar?",
            ],
          },
          {
            title: "Amistad y convivencia",
            items: [
              "¿Qué se puede hacer cuando alguien es excluido del grupo?",
              "¿Es mejor tener pocos amigos cercanos o muchos conocidos?",
              "¿Es correcto contar el secreto de un amigo para ayudarle?",
              "¿Dónde está el límite entre una broma y el bullying?",
            ],
          },
          {
            title: "Sociedad y mundo",
            items: [
              "¿Los adolescentes deberían poder votar a los 16 años?",
              "¿Qué puede hacer una persona joven por el medio ambiente?",
              "¿La inteligencia artificial ayuda o perjudica a los estudiantes?",
              "¿Los videojuegos son una pérdida de tiempo o una forma de aprender?",
            ],
          },
        ],
        outro:
          "Si quieres más temas con este formato, abre los [temas de debate para estudiantes](/es/topics/debate-topics-for-students) y los [temas controversiales para debatir](/es/topics/controversial-topics-to-discuss).",
      },
      {
        id: "temas-de-interes-para-adolescentes",
        heading: "Temas de interés para adolescentes para conversar",
        intro:
          "Para charlas más relajadas, entre amigos o con la familia, estos temas funcionan mejor que un debate formal.",
        items: [
          "La serie, la banda o el videojuego que no puedes dejar de recomendar.",
          "Qué harías si por un día fueras el director de tu escuela.",
          "El mejor consejo que has recibido y de quién.",
          "Un lugar al que quieres viajar cuando seas independiente.",
          "Qué habilidad te gustaría dominar en un año.",
          "Algo que te dé orgullo y que pocas personas sepan.",
          "Qué te gustaría que los adultos entendieran de tu generación.",
          "Cómo imaginas tu vida a los 25 años.",
        ],
      },
      {
        id: "temas-para-exponer-adolescentes",
        heading: "Temas interesantes para exponer en la escuela",
        items: [
          "El impacto de las redes sociales en la salud mental.",
          "Cómo funcionan los algoritmos que recomiendan videos.",
          "Energías renovables: ¿podemos vivir sin petróleo?",
          "Historia de los videojuegos y su efecto en la cultura.",
          "Cómo detectar noticias falsas.",
          "Profesiones que existirán dentro de diez años.",
          "Por qué dormir bien mejora el rendimiento escolar.",
          "El deporte como herramienta para la convivencia.",
        ],
        outro:
          "Para preparar la exposición, usa el [generador de temas para exponer](/es/generador-de-temas-para-exponer) y las [ideas de presentación para la escuela](/es/topics/presentation-ideas-for-school).",
      },
      {
        id: "consejos-para-conversar-con-adolescentes",
        heading: "Seis consejos para hablar con un adolescente",
        ordered: true,
        items: [
          "Elige el momento: en el auto, caminando o cocinando suelen funcionar mejor que frente a frente.",
          "Empieza por lo que le interesa a él o ella, no por lo que te preocupa a ti.",
          "Haz preguntas abiertas («¿qué te pareció…?») en lugar de las que se contestan con sí o no.",
          "Acepta opiniones distintas sin corregir de inmediato. Pregunta «¿por qué piensas eso?».",
          "Comparte tus propias experiencias, incluidos tus errores. Un adulto vulnerable genera confianza.",
          "Si se cierra, no insistas. Deja la puerta abierta: «cuando quieras hablar, aquí estoy».",
        ],
        outro:
          "Más preguntas de uso general en [temas de conversación para todas las edades](/es/conversation) y [rompehielos para grupos](/es/icebreaker).",
      },
    ],
    faq: [
      {
        question: "¿Cuáles son temas interesantes para exponer para adolescentes?",
        answer:
          "Funcionan bien los temas que mezclan lo cotidiano con algo que aprender: redes sociales y salud mental, cómo funcionan los algoritmos, energías renovables, noticias falsas, historia de los videojuegos o profesiones del futuro. Elige uno con imágenes o ejemplos para que sea fácil de explicar.",
      },
      {
        question: "¿Cómo organizo un debate de adolescentes en clase?",
        answer:
          "Elige un tema que divida al grupo, forma dos equipos, da 10 minutos para preparar argumentos y establece turnos de dos minutos por intervención. Cierra con una votación y una reflexión sobre qué argumento fue más convincente y por qué.",
      },
      {
        question: "¿Qué temas de interés tienen los adolescentes?",
        answer:
          "Suelen interesarles la música, los videojuegos, las series, las redes sociales, la amistad, los deportes, el futuro profesional y los temas de justicia y medio ambiente. Parte de lo que consumen y pregunta por qué les gusta.",
      },
      {
        question: "¿Cuáles son temas de debate adecuados para jóvenes?",
        answer:
          "Los mejores son los cercanos y sin carga emocional extrema: uso del celular en clase, horario escolar, educación financiera, voto a los 16, influencers y medio ambiente. Evita los temas que puedan incomodar a alguien del grupo sin reglas claras.",
      },
    ],
    tryNext: [
      { href: "/es/conversation", label: "Temas de conversación", emoji: "💬" },
      { href: "/es/debate", label: "Temas de debate", emoji: "⚔️" },
      { href: "/es/icebreaker", label: "Rompehielos", emoji: "🧊" },
      { href: "/es/this-or-that", label: "Esto o aquello", emoji: "⚖️" },
    ],
  },

  // ---------------------------------------------------------------------------
  "couples-game-night-questions": {
    blocks: [
      {
        id: "como-jugar-preguntas-en-pareja",
        heading: "Cómo jugar un juego de preguntas en pareja, paso a paso",
        ordered: true,
        items: [
          "Elijan un lugar tranquilo y dejen los teléfonos a un lado. Una bebida y algo de picar ayudan.",
          "Decidan el formato: una sola persona lee, o se turnan. Pueden sacar la pregunta al azar con la [ruleta](/es/spin-the-wheel) o elegirla por categoría.",
          "Cada uno responde; después se intercambian los roles. Quien lee también responde.",
          "Si quieren competir, den un punto por cada acierto en «¿cuánto me conoces?». Si no, no hay ganador: el premio es lo que descubren.",
          "Usen la regla del pase: cada persona puede saltarse una pregunta por noche sin dar explicaciones.",
          "Al final, cada uno dice la respuesta que más le sorprendió del otro.",
        ],
      },
      {
        id: "variantes-del-juego",
        heading: "Variantes del juego de preguntas para parejas",
        groups: [
          {
            title: "21 preguntas",
            items: [
              "Cada uno hace 21 preguntas al otro, alternando. Valen todas, desde las divertidas hasta las profundas.",
            ],
          },
          {
            title: "Tarjetas por categorías",
            items: [
              "Escriban preguntas en papelitos y sepárenlas en ligeras, curiosas y profundas. Saquen una de cada una por turno.",
            ],
          },
          {
            title: "Con puntos",
            items: [
              "Antes de responder, el otro apuesta qué contestará su pareja. Quien acierta suma un punto. Al final, el perdedor cocina o escoge la película.",
            ],
          },
          {
            title: "Verdad o reto suave",
            items: [
              "Mezcla preguntas con retos de ternura: un abrazo de 20 segundos, una canción o un mensaje de amor. Mira el [verdad o reto](/es/truth-or-dare) para ideas.",
            ],
          },
        ],
      },
      {
        id: "preguntas-para-jugar-a-distancia",
        heading: "Preguntas para jugar en pareja a distancia (videollamada)",
        intro:
          "Para parejas que viven en ciudades distintas, las preguntas funcionan mejor si invitan a mostrar y contar cosas del entorno de cada uno.",
        items: [
          "Enséñame el rincón de tu casa donde pasas más tiempo y cuéntame por qué.",
          "¿Qué es lo primero que haremos cuando nos veamos?",
          "¿Qué objeto tuyo me gustaría tener conmigo hasta que nos veamos?",
          "Cuéntame tres cosas pequeñas que hiciste hoy y me encantaría haber visto.",
          "¿Cuál es el plan de viaje que más quieres hacer conmigo?",
          "¿Qué tradición podríamos crear solo nosotros dos, aunque estemos lejos?",
          "Enséñame tu foto favorita nuestra y dime qué recuerdas de ese día.",
          "¿Qué canción pondrías de fondo para nuestro reencuentro?",
        ],
      },
      {
        id: "preguntas-para-novios-extra",
        heading: "Preguntas extra para novios: ¿cuánto me conoces?",
        intro:
          "Para añadir a la ronda de preguntas de la lista principal. Cada uno responde sobre el otro y luego se comprueban las respuestas.",
        items: [
          "¿Cuál es mi comida favorita cuando tengo un mal día?",
          "¿Qué película podría ver cien veces?",
          "¿Cuál es mi mayor miedo?",
          "¿Qué cosa me pone de mal humor al instante?",
          "¿Cuál fue el regalo que más me ha gustado recibir?",
          "¿Cómo me gusta pasar un domingo libre?",
          "¿Qué detalle de nuestra primera cita recuerdo mejor?",
          "¿Qué lugar sueño con visitar?",
          "¿Cómo me gusta que me despierten?",
          "¿Qué cualidad mía admiro menos que los demás? (la que yo creo que tengo y no se nota)",
        ],
        outro:
          "Si prefieren un juego de grupo con pareja incluida, pasen a [quién es más probable para parejas](/es/topics/quien-es-mas-probable-parejas) o al [yo nunca nunca](/es/never-have-i-ever).",
      },
      {
        id: "mas-ideas-para-la-cita",
        heading: "Otras formas de convertir las preguntas en una cita",
        items: [
          "Cena en casa con una pregunta por plato: entrada ligera, plato fuerte profundo y postre con deseos.",
          "Picnic con el tarro de preguntas: cada uno saca una pregunta y la responde mientras comen.",
          "Viaje en auto: una pregunta por cada kilómetro 20 o por cada canción.",
          "Cita en una cafetería: una pregunta por cada café; el último es para decirse algo bonito.",
        ],
        outro:
          "Si buscan temas para hablar más allá del juego, entra a los [temas de conversación para parejas](/es/topics/conversation-starters-for-couples) y a la [pregunta diaria para parejas](/es/pregunta-diaria-pareja).",
      },
    ],
    faq: [
      {
        question: "¿Qué juegos de preguntas puedo jugar con mi novia o mi novio?",
        answer:
          "Los más fáciles son «¿cuánto me conoces?», «esto o aquello», «¿qué preferirías?», 21 preguntas y verdad o reto suave. Todos se juegan con preguntas por turnos, sin material, y se pueden adaptar a una noche en casa, a un viaje o a una videollamada.",
      },
      {
        question: "¿Cuántas preguntas se necesitan para un juego de parejas?",
        answer:
          "Para una noche tranquila bastan entre 15 y 25 preguntas. Si quieres una sesión más larga, prepara una lista de unas 50 y elige por categorías: ligeras al inicio, divertidas en el medio y profundas al final.",
      },
      {
        question: "¿Se puede jugar a un juego de preguntas en pareja a distancia?",
        answer:
          "Sí. Por videollamada funcionan bien las preguntas sobre el entorno de cada uno, los planes para cuando se vean y los recuerdos compartidos. También pueden usar la misma lista y responder a la vez por mensaje de voz.",
      },
      {
        question: "¿Qué preguntas son buenas para una primera noche de juegos en pareja?",
        answer:
          "Empieza con preguntas ligeras y divertidas (gustos, anécdotas, hipotéticos) y deja las profundas para el final. Así la conversación se calienta sin presión y nadie se siente interrogado.",
      },
    ],
    tryNext: [
      { href: "/es/pregunta-diaria-pareja", label: "Pregunta diaria para parejas", emoji: "💞" },
      { href: "/es/would-you-rather", label: "¿Qué preferirías?", emoji: "🤔" },
      { href: "/es/truth-or-dare", label: "Verdad o reto", emoji: "🎲" },
      { href: "/es/topics/quien-es-mas-probable-parejas", label: "Quién es más probable: parejas", emoji: "👉" },
    ],
  },

  // ---------------------------------------------------------------------------
  "debate-topics-for-students": {
    blocks: [
      {
        id: "temas-de-debate-por-nivel",
        heading: "Temas de debate por nivel educativo",
        intro:
          "Un buen tema de debate se ajusta a la edad del grupo. Aquí tienes propuestas por nivel; úsalas como punto de partida y adapta la redacción.",
        groups: [
          {
            title: "Primaria alta (10 a 12 años)",
            items: [
              "¿Deberían los niños tener tareas para la casa?",
              "¿Es mejor tener mascota en casa o en el campo?",
              "¿Debería el recreo ser más largo?",
              "¿Los videojuegos son buenos o malos para estudiar?",
            ],
          },
          {
            title: "Secundaria",
            items: [
              "¿Deberían los celulares estar permitidos en clase?",
              "¿Es justo que las notas definan tu futuro?",
              "¿El uniforme debería ser obligatorio?",
              "¿Hay que obligar a los estudiantes a hacer servicio comunitario?",
            ],
          },
          {
            title: "Preparatoria y universidad",
            items: [
              "¿La educación superior debería ser gratuita?",
              "¿Debe regularse la inteligencia artificial en los trabajos escolares?",
              "¿Es ético usar herramientas de IA para estudiar?",
              "¿El voto debería ser obligatorio para los jóvenes mayores de 18 años?",
            ],
          },
        ],
      },
      {
        id: "argumentos-a-favor-y-en-contra",
        heading: "Ejemplos de argumentos a favor y en contra",
        intro:
          "Para que tu equipo no se quede sin ideas, aquí tienes tres temas con argumentos de ambos lados. Úsalos como modelo para escribir los tuyos.",
        groups: [
          {
            title: "¿Deberían prohibirse los celulares en el colegio?",
            items: [
              "A favor: reducen las distracciones, mejoran la atención y evitan el acoso por mensajes durante la jornada.",
              "En contra: son una herramienta de consulta y de comunicación de emergencia; enseñar a usarlos bien es mejor que prohibirlos.",
            ],
          },
          {
            title: "¿Debería eliminarse la tarea para la casa?",
            items: [
              "A favor: deja tiempo para descansar, jugar y estar en familia; no todos los estudiantes tienen las mismas condiciones en casa.",
              "En contra: ayuda a consolidar lo aprendido y desarrolla hábitos de estudio y responsabilidad.",
            ],
          },
          {
            title: "¿Es la IA una ayuda o una trampa para estudiar?",
            items: [
              "A favor: sirve como tutor, ayuda a entender temas difíciles y ahorra tiempo en tareas mecánicas.",
              "En contra: puede sustituir el esfuerzo de pensar, dar respuestas incorrectas y fomentar el plagio.",
            ],
          },
        ],
      },
      {
        id: "roles-y-tiempos",
        heading: "Roles y tiempos para un debate escolar",
        intro: "Un esquema sencillo para 6 a 8 estudiantes por equipo, en unos 30 a 40 minutos:",
        ordered: true,
        items: [
          "Presentación del tema y de las posturas (3 minutos): el docente lee la pregunta y asigna a favor o en contra.",
          "Preparación en equipo (8 minutos): cada grupo escribe tres argumentos y un ejemplo para cada uno.",
          "Primer turno (2 minutos por equipo): exposición de argumentos sin interrupciones.",
          "Réplica (2 minutos por equipo): cada lado responde a lo que escuchó.",
          "Preguntas cruzadas (5 minutos): preguntas cortas al equipo contrario.",
          "Cierre (1 minuto por equipo): resumen y postura final.",
          "Votación y reflexión (5 minutos): ¿qué argumento convenció más y por qué?",
        ],
        outro:
          "Para elegir un tema al azar, usa el [generador de temas de debate](/es/debate); si el grupo es adolescente, mira los [temas para adolescentes](/es/topics/conversation-topics-for-teens).",
      },
      {
        id: "como-elegir-un-tema",
        heading: "Cómo elegir un tema de debate que funcione en clase",
        items: [
          "Que se pueda defender por ambos lados con argumentos y datos.",
          "Que esté al alcance de la edad y la información del grupo.",
          "Que no ataque a personas concretas ni a identidades.",
          "Que divida al grupo casi por la mitad: una votación rápida antes lo confirma.",
          "Que se conecte con lo que viven: escuela, tecnología, convivencia o el barrio.",
        ],
        outro:
          "Cuando quieran subir de nivel, pasa a los [temas controversiales para debatir](/es/topics/controversial-topics-to-discuss) o a los [dilemas éticos](/es/topics/ethical-dilemma-questions).",
      },
    ],
    faq: [
      {
        question: "¿Qué temas se pueden debatir en clase?",
        answer:
          "Cualquier tema que tenga posturas razonables a favor y en contra y sea adecuado para la edad: uso del celular, tareas, uniformes, exámenes, redes sociales, inteligencia artificial, medio ambiente, deporte escolar o convivencia. Evita los temas que puedan herir a personas del grupo.",
      },
      {
        question: "¿Cuál es la diferencia entre un tema de debate y un tema de discusión?",
        answer:
          "Un tema de debate plantea una pregunta con dos posturas claras que se defienden con argumentos y turnos. Un tema de discusión es más abierto: se comparten opiniones sin buscar convencer ni ganar.",
      },
      {
        question: "¿Cómo se arma un debate escolar con equipos?",
        answer:
          "Divide la clase en dos equipos y asigna las posturas al azar. Da tiempo para preparar tres argumentos, haz turnos de exposición y réplica con cronómetro, deja un momento de preguntas cruzadas y termina con una votación y una reflexión.",
      },
      {
        question: "¿Qué temas de debate interesantes puedo proponer a mis estudiantes?",
        answer:
          "Los que más enganchan suelen ser los más cercanos: celulares en clase, horarios escolares, IA para estudiar, tareas, redes sociales y videojuegos. Pídeles que propongan temas y vótenlos: se implican más cuando el tema es suyo.",
      },
    ],
    tryNext: [
      { href: "/es/debate", label: "Generador de debate", emoji: "⚔️" },
      { href: "/es/argument-generator", label: "Generador de argumentos", emoji: "🧠" },
      { href: "/es/dilemas-morales", label: "Dilemas morales", emoji: "⚖️" },
      { href: "/es/this-or-that", label: "Esto o aquello", emoji: "🎯" },
    ],
  },
};

// ---------------------------------------------------------------------------
// /es/conversation: extra guide (situation-based topics) for "temas de conversación".
export interface ConversationGuide {
  blocks: ExtraBlock[];
  faq: { question: string; answer: string }[];
}

export const ES_CONVERSATION_GUIDE: ConversationGuide = {
  blocks: [
    {
      id: "temas-de-conversacion-por-situacion",
      heading: "Temas de conversación por situación: lista rápida",
      intro:
        "Si ahora mismo necesitas algo para decir, elige tu situación y copia el tema. Cada lista tiene preguntas listas para usar; el generador de arriba te da más.",
      groups: [
        {
          title: "Temas para hablar con amigos",
          items: [
            "¿Cuál es la anécdota más vergonzosa que recuerdas de la escuela?",
            "¿Qué serie o videojuego recomendarías sin pensarlo dos veces?",
            "¿A qué lugar nos escapamos el próximo fin de semana?",
            "¿Qué haríamos si nos ganáramos un viaje para dos hoy mismo?",
            "¿Cuál es la mejor decisión que tomaste este año?",
            "¿Qué canción te devuelve a otra época de tu vida?",
          ],
        },
        {
          title: "Temas interesantes para hablar con cualquier persona",
          items: [
            "¿Qué aprendiste últimamente que te sorprendió?",
            "¿Qué trabajo harías si no importara el dinero?",
            "¿Cuál es el mejor consejo que te han dado?",
            "¿Qué lugar te hizo cambiar tu forma de ver el mundo?",
            "Si pudieras cenar con una persona del pasado, ¿quién sería?",
            "¿Qué tradición de tu familia es única?",
          ],
        },
        {
          title: "Temas de conversación por chat o WhatsApp",
          items: [
            "«¿Qué estás escuchando hoy?»",
            "«Foto de lo que estás viendo ahora mismo y adivino dónde estás.»",
            "«¿Qué preferirías: playa o montaña?»",
            "«Cuéntame lo mejor y lo peor de tu semana.»",
            "«Recomiéndame algo para ver este fin de semana.»",
            "«Tres palabras para describir tu día.»",
          ],
        },
        {
          title: "Temas random para hablar (hipotéticos)",
          items: [
            "Si pudieras tener un superpoder aburrido pero útil, ¿cuál sería?",
            "¿Qué comida tendrías que comer todos los días durante un año?",
            "Si pudieras volver a cualquier año, ¿a cuál irías y a qué lo dedicarías?",
            "¿Qué animal sería tu mascota ideal si el tamaño no importara?",
            "¿Qué inventarías para hacer más fácil el día a día?",
            "Si te dieran una isla, ¿qué harías con ella?",
          ],
        },
        {
          title: "Temas en la mesa o en una reunión familiar",
          items: [
            "¿Cuál es el plato que nos hace sentir en casa?",
            "¿Qué historia de la familia te gustaría que se contara más?",
            "¿Qué lugar de tu infancia recuerdas con más cariño?",
            "¿Qué tradición querrías heredarle a tus hijos o sobrinos?",
          ],
        },
        {
          title: "Temas en el trabajo o con compañeros",
          items: [
            "¿Qué proyecto reciente te ha ilusionado?",
            "¿Qué herramienta te ha cambiado la forma de trabajar?",
            "¿Qué haces los lunes para arrancar con energía?",
            "¿Qué libro, podcast o curso recomiendas?",
          ],
        },
      ],
      outro:
        "¿Hablas con tu novia o con tu novio? Tienes una lista aparte de [temas para hablar con tu pareja](/es/topics/conversation-starters-for-couples), con apartados para WhatsApp, temas profundos y preguntas por nivel.",
    },
    {
      id: "como-elegir-un-tema-de-conversacion",
      heading: "Cómo elegir un tema de conversación y mantenerlo vivo",
      ordered: true,
      items: [
        "Observa el contexto: no es lo mismo una reunión de trabajo que una sobremesa. Escoge un tema que encaje con el lugar y las personas.",
        "Empieza por lo que tienen en común: el lugar donde están, el evento, una situación reciente o un interés compartido.",
        "Haz preguntas abiertas que empiecen con «qué», «cómo» o «por qué», no preguntas de sí o no.",
        "Tira del hilo: toma una palabra de lo que dijo la otra persona y pregunta por ella.",
        "Comparte algo tuyo después de preguntar. Una conversación es un intercambio, no un examen.",
        "Si el tema se agota, cambia con suavidad: «hablando de eso, me acordé de…».",
        "Acepta los silencios: no todos los silencios son incómodos. A veces solo piensan.",
      ],
    },
    {
      id: "temas-de-conversacion-que-evitar",
      heading: "Temas de conversación que conviene evitar con desconocidos",
      items: [
        "Política y religión, salvo que la otra persona abra el tema.",
        "Dinero, sueldos y deudas.",
        "Salud personal o aspecto físico de alguien.",
        "Comparaciones con otras personas o con exparejas.",
        "Chismes y críticas a terceros: generan desconfianza.",
      ],
      outro:
        "Si quieres debatir temas delicados con respeto, usa los [temas controversiales para debatir](/es/topics/controversial-topics-to-discuss) con reglas claras.",
    },
    {
      id: "mas-temas-de-conversacion",
      heading: "Más listas de temas de conversación",
      items: [
        "[Temas de conversación para adolescentes](/es/topics/conversation-topics-for-teens): charla y debate para jóvenes.",
        "[Temas de conversación para parejas](/es/topics/conversation-starters-for-couples): para novios y esposos.",
        "[Temas de conversación divertidos](/es/topics/funny-conversation-topics): para reír con amigos.",
        "[Preguntas para una primera cita](/es/topics/first-date-conversation-topics): para empezar con buen pie.",
        "[Preguntas para conocer a alguien](/es/topics/get-to-know-you-questions-for-adults): adultos y compañeros.",
        "[Preguntas profundas](/es/preguntas-profundas): cuando quieras ir más allá de lo superficial.",
      ],
    },
  ],
  faq: [
    {
      question: "¿Cuáles son buenos temas de conversación para empezar con alguien que no conozco?",
      answer:
        "Parte del contexto: el lugar, el evento o algo que ven en común. Después pregunta por trabajo o estudios, viajes recientes, comida, series o planes del fin de semana. Evita temas muy personales o delicados hasta que haya confianza.",
    },
    {
      question: "¿Qué temas puedo hablar por chat con una persona?",
      answer:
        "Por chat funcionan los temas ligeros y las preguntas cortas: música, series, planes, recomendaciones y preguntas del tipo «¿qué preferirías?». Si el tema se vuelve profundo, propón seguir por llamada.",
    },
    {
      question: "¿Qué temas random puedo usar para romper un silencio?",
      answer:
        "Los hipotéticos y los de recuerdos funcionan muy bien: superpoderes, viajes en el tiempo, comida favorita, el mejor viaje de tu vida o una anécdota graciosa. Dan pie a historias, no a respuestas de una palabra.",
    },
    {
      question: "¿Cuál es la diferencia entre un tema de conversación y un tema de debate?",
      answer:
        "Un tema de conversación busca conocer a la otra persona y compartir. Un tema de debate plantea una pregunta con posturas opuestas que se defienden con argumentos. Para lo segundo tienes el generador de temas de debate.",
    },
  ],
};
