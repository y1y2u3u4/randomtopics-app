export type WorkshopCopy = { title: string; intro: string; example: string; steps: string[]; checks: string[]; next: string };
export const topicWorkshops: Record<string, { topicId: string; en: WorkshopCopy; es: WorkshopCopy }> = {
  "writing/philosophy": {
    "topicId": "t052",
    "en": {
      "title": "Turn “a life well-lived” into an argument",
      "intro": "Use this prompt for a short reflective essay. The task is to choose a defensible standard, not to summarize every philosophy or tell the reader how to live.",
      "example": "Mara receives a promotion on the same day she misses a promise to a friend. If success is measured only by achievement, it is an excellent day. If reliability matters too, the verdict changes. Which standard should the essay defend?",
      "steps": [
        "Define one term: choose achievement, pleasure, care or integrity, and explain what would count as evidence of it in this invented case.",
        "Build three paragraphs: state your criterion, test Mara’s choice against it, then give the strongest objection. A counterexample should challenge your rule, not just describe someone you dislike.",
        "Finish by narrowing your claim. For example, achievement may contribute to a good life without making every sacrifice worthwhile. Make clear which part is your argument and which part needs a source."
      ],
      "checks": [
        "Can a reader tell what would make you revise your criterion?",
        "Have you distinguished your view from a named philosopher’s view, rather than attributing your own sentence to them?"
      ],
      "next": "Try a second draft in which the missed promise is trivial, then one in which it is serious. If your conclusion never changes, explain why."
    },
    "es": {
      "title": "Convierte «una vida bien vivida» en un argumento",
      "intro": "Usa este tema para un ensayo reflexivo breve. El objetivo es elegir un criterio defendible, no resumir toda la filosofía ni decirle al lector cómo debe vivir.",
      "example": "Mara recibe un ascenso el mismo día que incumple una promesa a una amiga. Si el éxito se mide solo por los logros, es un día excelente. Si también cuenta la confianza, el juicio cambia. ¿Qué criterio debería defender el ensayo?",
      "steps": [
        "Define un término: logro, placer, cuidado o integridad. Explica qué serviría como prueba de ese valor en este caso inventado.",
        "Construye tres párrafos: presenta tu criterio, aplícalo a la decisión de Mara y formula la objeción más fuerte. Un contraejemplo debe poner a prueba tu regla, no limitarse a describir a alguien que te cae mal.",
        "Termina delimitando tu afirmación. Por ejemplo, los logros pueden contribuir a una buena vida sin justificar cualquier sacrificio. Distingue tu argumento de las afirmaciones que requieren una fuente."
      ],
      "checks": [
        "¿El lector puede reconocer qué te haría revisar tu criterio?",
        "¿Has distinguido tu opinión de la de un filósofo concreto, sin atribuirle frases tuyas?"
      ],
      "next": "Escribe otra versión en la que la promesa incumplida sea trivial y una tercera en la que sea importante. Si tu conclusión no cambia, explica por qué."
    }
  },
  "writing/psychology": {
    "topicId": "t068",
    "en": {
      "title": "Write about nostalgia without turning a memory into proof",
      "intro": "A familiar song or object can anchor a personal essay. Separate the remembered scene, your present interpretation and any broader psychological claim.",
      "example": "The song lasted three minutes. By the second chorus, I had remembered the kitchen wallpaper but forgotten every argument we had in that room. This invented opening gives the narrator a concrete memory and a reason to question it.",
      "steps": [
        "Spend the first paragraph on one sensory detail and one action. Do not open with a general claim that everybody experiences nostalgia in the same way.",
        "Use the middle paragraph to introduce a mismatch: what does the narrator remember vividly, and what do they know is missing? Offer two possible explanations without diagnosing the narrator.",
        "Choose a personal ending or an evidence-based ending. A personal ending can revise the narrator’s interpretation. A research ending needs a traceable study, its participants and its limits; an anecdote alone cannot establish a psychological effect."
      ],
      "checks": [
        "Are scene, interpretation and research clearly distinguishable?",
        "Have you removed invented studies, diagnostic labels and claims about what all readers must feel?"
      ],
      "next": "Use another prompt from this collection to change the subject to attention, habits, memory or belonging while keeping the same scene-versus-claim discipline."
    },
    "es": {
      "title": "Escribe sobre la nostalgia sin convertir un recuerdo en una prueba",
      "intro": "Una canción o un objeto familiar pueden iniciar un ensayo personal. Separa la escena recordada, tu interpretación actual y cualquier afirmación psicológica más amplia.",
      "example": "La canción duró tres minutos. En el segundo estribillo ya recordaba el papel de la cocina, pero había olvidado todas las discusiones que tuvimos allí. Este comienzo inventado ofrece un recuerdo concreto y un motivo para cuestionarlo.",
      "steps": [
        "Dedica el primer párrafo a un detalle sensorial y una acción. No empieces afirmando que todas las personas sienten la nostalgia de la misma manera.",
        "Introduce después un contraste: ¿qué recuerda el narrador con claridad y qué sabe que falta? Propón dos explicaciones posibles sin diagnosticarlo.",
        "Elige un final personal o basado en pruebas. El primero puede revisar la interpretación del narrador. El segundo necesita un estudio localizable, sus participantes y sus límites; una anécdota no demuestra por sí sola un efecto psicológico."
      ],
      "checks": [
        "¿Se distinguen claramente la escena, la interpretación y la investigación?",
        "¿Has eliminado estudios inventados, etiquetas diagnósticas y afirmaciones sobre lo que todo lector debe sentir?"
      ],
      "next": "Elige otro tema de esta colección sobre atención, hábitos, memoria o pertenencia, manteniendo la distinción entre escena y afirmación."
    }
  },
  "speech/politics": {
    "topicId": "t257",
    "en": {
      "title": "Build a two-minute speech about compulsory voting",
      "intro": "Use the question as a policy exercise. Explain what you mean by a voting requirement before defending or opposing it; attendance, registration and casting a valid vote are different possible rules.",
      "example": "My proposal concerns attending an election, not forcing a voter to support a candidate. I will judge it by participation, freedom and the burden of enforcement. This sample opening defines a proposal; it is not a statement of any country’s current law.",
      "steps": [
        "0:00–0:20: define the proposed rule and the people it would affect. State one position in a single sentence.",
        "0:20–1:00: give your strongest reason and one sourced example. Check an official election authority for the actual rule, exemptions and date before describing a real country.",
        "1:00–1:40: explain the strongest objection, such as freedom not to participate or unequal enforcement burdens. Answer the objection without claiming opponents are uninformed.",
        "1:40–2:00: name the trade-off and return to your criterion. End with one conclusion rather than a new statistic."
      ],
      "checks": [
        "Did you distinguish a proposal from a current legal requirement?",
        "Can a listener repeat your claim, one reason and one limitation after two minutes?"
      ],
      "next": "Practise once with the timer. On the second attempt, keep the same topic and shorten only the least useful example. Recording and AI feedback are optional."
    },
    "es": {
      "title": "Prepara un discurso de dos minutos sobre el voto obligatorio",
      "intro": "Trata la pregunta como un ejercicio de política pública. Antes de defenderla o rechazarla, define la obligación: acudir, inscribirse y emitir un voto válido son reglas posibles distintas.",
      "example": "Mi propuesta se refiere a acudir a una elección, no a obligar a apoyar a un candidato. La evaluaré según la participación, la libertad y la carga de hacerla cumplir. Este inicio define una propuesta; no describe la legislación vigente de ningún país.",
      "steps": [
        "0:00–0:20: define la regla propuesta y a quién afectaría. Expresa una postura en una sola frase.",
        "0:20–1:00: presenta tu razón principal y un ejemplo documentado. Antes de hablar de un país real, comprueba la regla, sus excepciones y la fecha en la autoridad electoral oficial.",
        "1:00–1:40: explica la objeción más fuerte, como la libertad de no participar o una carga desigual al aplicar la norma. Respóndela sin descalificar a quienes discrepan.",
        "1:40–2:00: reconoce la contrapartida y vuelve a tu criterio. Termina con una conclusión, no con una estadística nueva."
      ],
      "checks": [
        "¿Has distinguido una propuesta de una obligación legal vigente?",
        "¿Una persona puede repetir tu postura, una razón y un límite después de escucharte dos minutos?"
      ],
      "next": "Practica una vez con el temporizador. En el segundo intento, conserva el tema y acorta solo el ejemplo menos útil. La grabación y los comentarios de IA son opcionales."
    }
  },
  "debate/technology": {
    "topicId": "t482",
    "en": {
      "title": "Turn right to repair into a debatable motion",
      "intro": "A broad technology headline is not yet a fair debate. Fix the product, obligation and exceptions so both sides argue about the same proposal.",
      "example": "Motion: manufacturers of consumer devices should supply independent repairers with replacement parts and service manuals. Before starting, agree whether safety-critical devices and security-sensitive information are excluded.",
      "steps": [
        "Proposition: connect access to repair with an outcome, such as repair cost or usable product life. Show why the specified obligation would improve that outcome; do not assume every broken device is repairable.",
        "Opposition: identify a concrete cost, safety risk or information-security concern, then propose a narrower alternative. “Companies will dislike it” is not enough to establish a public harm.",
        "Evidence round: compare an actual warranty, a repair quotation and a parts-availability policy for the same kind of device. Record dates and sources. These examples test the argument; three examples do not measure an entire industry."
      ],
      "checks": [
        "Would both teams describe the same rule and exceptions?",
        "Does each rebuttal address the other side’s mechanism rather than merely repeat its own preference?"
      ],
      "next": "Give each side two minutes, then require each team to restate the strongest opposing argument before its rebuttal. Judge the clarity of the trade-off, not confidence or volume."
    },
    "es": {
      "title": "Convierte el derecho a reparar en una moción debatible",
      "intro": "Un titular tecnológico amplio todavía no es un debate equilibrado. Define el producto, la obligación y las excepciones para que ambos equipos discutan la misma propuesta.",
      "example": "Moción: los fabricantes de dispositivos de consumo deberían proporcionar repuestos y manuales de servicio a reparadores independientes. Antes de empezar, acuerda si quedan excluidos los aparatos críticos para la seguridad y la información sensible.",
      "steps": [
        "A favor: relaciona el acceso a la reparación con un resultado, como el coste o la vida útil. Explica por qué la obligación propuesta lo mejoraría; no supongas que cualquier aparato averiado puede repararse.",
        "En contra: identifica un coste concreto o un riesgo de seguridad y plantea una alternativa más limitada. Que a una empresa no le guste la propuesta no demuestra por sí solo un perjuicio público.",
        "Ronda de pruebas: compara una garantía real, un presupuesto de reparación y una política de disponibilidad de piezas para el mismo tipo de aparato. Anota fechas y fuentes. Tres ejemplos ayudan a poner a prueba el argumento, pero no representan toda una industria."
      ],
      "checks": [
        "¿Los dos equipos describirían la misma regla y sus excepciones?",
        "¿Cada réplica responde al razonamiento rival en vez de repetir la preferencia propia?"
      ],
      "next": "Da dos minutos a cada equipo y pide que resuma el mejor argumento contrario antes de responder. Evalúa la claridad de las contrapartidas, no la seguridad al hablar ni el volumen."
    }
  },
  "conversation/philosophy": {
    "topicId": "t052",
    "en": {
      "title": "Discuss a good life without ranking the people in the room",
      "intro": "This is a reflective conversation, not a test with a correct answer. Begin with ordinary experiences before inviting abstract definitions; everyone may pass or use an invented example.",
      "example": "Opening: “What made an ordinary day feel worthwhile to you recently?” A participant might mention finishing a difficult job, helping someone or enjoying a quiet hour. Those answers offer different criteria without requiring private life stories.",
      "steps": [
        "Ask for the reason behind one example: was the important part the result, the effort, the relationship or the feeling? Let the speaker name it rather than supply a label for them.",
        "Change one feature of an invented case. Would the same activity still matter if nobody noticed it? If it brought no pleasure? Keep the question about the criterion, not about judging someone’s choices.",
        "Close by asking each person to name one idea they now understand better. Agreement is optional. Do not turn a philosophical disagreement into advice about someone’s health, family or grief."
      ],
      "checks": [
        "Did everyone have a genuine option to pass?",
        "Can you describe another person’s criterion in words they would accept?"
      ],
      "next": "For a new group, use a light conversation instead of starting with mortality or painful personal experiences. Change the generator’s depth filter to match the setting."
    },
    "es": {
      "title": "Habla de una buena vida sin clasificar a las personas del grupo",
      "intro": "Es una conversación reflexiva, no un examen con una respuesta correcta. Empieza por experiencias cotidianas antes de pedir definiciones abstractas; cualquiera puede pasar o usar un ejemplo inventado.",
      "example": "Inicio: «¿Qué hizo que un día corriente te pareciera valioso recientemente?». Alguien puede mencionar acabar un trabajo difícil, ayudar a otra persona o disfrutar de una hora tranquila. Son criterios distintos que no exigen contar intimidades.",
      "steps": [
        "Pregunta por la razón de un ejemplo: ¿importó el resultado, el esfuerzo, la relación o la sensación? Deja que quien habla lo explique sin imponerle una etiqueta.",
        "Cambia un detalle de un caso inventado. ¿La actividad seguiría siendo valiosa si nadie la viera? ¿Y si no produjera placer? Pregunta por el criterio, no por el valor de las decisiones de una persona.",
        "Termina pidiendo a cada participante una idea que ahora comprenda mejor. No hace falta llegar a un acuerdo. No conviertas una diferencia filosófica en consejos sobre salud, familia o duelo."
      ],
      "checks": [
        "¿Todo el mundo tuvo una opción real de pasar?",
        "¿Puedes explicar el criterio de otra persona con palabras que ella aceptaría?"
      ],
      "next": "Con un grupo nuevo, empieza con una conversación ligera en lugar de hablar de mortalidad o experiencias dolorosas. Ajusta el filtro de profundidad al contexto."
    }
  },
  "conversation/science": {
    "topicId": "t002",
    "en": {
      "title": "Turn a question about dreams into a question you could investigate",
      "intro": "You do not need a scientific explanation ready before talking. Practise separating an observation, an interpretation and a question that would need evidence.",
      "example": "“I remember a dream more clearly when I write it down” is a personal observation. “Writing causes more dreams” is a different claim. Ask what would let you distinguish better recall from a change in dreaming.",
      "steps": [
        "Start with an optional, non-sensitive example: remembering a setting, a sound or no dream at all. Nobody needs to recount a disturbing dream.",
        "Propose two explanations for the observation. Decide what you would need to compare, and what else might change between the two situations. A small personal diary would not establish a result for everyone.",
        "End with an unanswered question and a source to check, such as a university sleep-research explainer or the original study it cites. Dream symbols are not a reliable basis for diagnosing someone in the group."
      ],
      "checks": [
        "Have you marked what is remembered, what is guessed and what is sourced?",
        "Did you ask what evidence could contradict the favourite explanation?"
      ],
      "next": "Use the same observation-versus-explanation structure with another science topic. Keep uncertain claims as questions instead of filling the gap with an invented fact."
    },
    "es": {
      "title": "Convierte una pregunta sobre sueños en algo que puedas investigar",
      "intro": "No necesitas conocer una explicación científica antes de conversar. Practica la distinción entre observación, interpretación y pregunta que necesitaría pruebas.",
      "example": "«Recuerdo mejor un sueño cuando lo escribo» es una observación personal. «Escribir hace que sueñe más» es otra afirmación. Pregunta cómo distinguirías una mejora del recuerdo de un cambio en los sueños.",
      "steps": [
        "Empieza con un ejemplo opcional y no sensible: recordar un lugar, un sonido o no recordar ningún sueño. Nadie tiene que contar un sueño angustiante.",
        "Propón dos explicaciones de la observación. Decide qué compararías y qué otras cosas podrían cambiar entre ambas situaciones. Un pequeño diario personal no demostraría un resultado general.",
        "Termina con una pregunta pendiente y una fuente que consultar, como una explicación de un centro universitario de investigación del sueño o el estudio original citado. No uses símbolos de sueños para diagnosticar a alguien del grupo."
      ],
      "checks": [
        "¿Has señalado qué se recuerda, qué se supone y qué procede de una fuente?",
        "¿Has preguntado qué prueba podría contradecir la explicación preferida?"
      ],
      "next": "Aplica la misma estructura a otro tema científico. Mantén las afirmaciones inciertas como preguntas en lugar de inventar datos para llenar los huecos."
    }
  },
  "writing/science": {
    "topicId": "t007",
    "en": {
      "title": "Write a science explanation from one observation",
      "intro": "Use music-induced chills as a question to explore, not as permission to invent a biological explanation. Choose whether you are writing a personal scene or a researched explainer.",
      "example": "The strings stopped, and a single voice entered. I felt a shiver before I could name the song. This invented opening describes a sensation; it does not establish what caused it or how often it happens.",
      "steps": [
        "Draft a short scene using sound, timing and a physical observation. Label imagined details as part of the scene rather than evidence from an experiment.",
        "For an explainer, turn “Why does music give us chills?” into a narrower question: what did one study measure, in whom, and under which listening conditions? Read the methods and results before relying on a headline.",
        "Outline the piece as observation → proposed explanation → evidence → limitation. Distinguish a reported association from a demonstrated cause. If you have no source yet, leave a research note rather than invent a citation."
      ],
      "checks": [
        "Could a reader trace each scientific claim to its source?",
        "Have you avoided treating your narrator’s reaction as universal?"
      ],
      "next": "Rewrite the opening for someone who has never had this reaction. The explanation should remain understandable without requiring the reader to share the experience."
    },
    "es": {
      "title": "Escribe una explicación científica a partir de una observación",
      "intro": "Usa los escalofríos al escuchar música como pregunta, no como permiso para inventar una explicación biológica. Decide si escribirás una escena personal o un texto de divulgación documentado.",
      "example": "Las cuerdas se callaron y entró una sola voz. Sentí un escalofrío antes de reconocer la canción. Este inicio inventado describe una sensación; no demuestra qué la causó ni con qué frecuencia ocurre.",
      "steps": [
        "Escribe una escena breve con sonido, tiempo y una observación física. Presenta los detalles imaginados como parte de la escena, no como resultados experimentales.",
        "Para divulgar, concreta la pregunta: ¿qué midió un estudio, en qué personas y en qué condiciones de escucha? Lee los métodos y los resultados antes de depender de un titular.",
        "Organiza el texto como observación → explicación propuesta → pruebas → límites. Distingue una asociación descrita de una causa demostrada. Si falta una fuente, deja una nota de investigación en lugar de inventar una cita."
      ],
      "checks": [
        "¿El lector puede localizar la fuente de cada afirmación científica?",
        "¿Has evitado presentar la reacción del narrador como universal?"
      ],
      "next": "Reescribe el comienzo para alguien que nunca haya sentido esa reacción. La explicación debe entenderse sin exigir que el lector comparta la experiencia."
    }
  },
  "debate/science": {
    "topicId": "t003",
    "en": {
      "title": "Separate a Mars feasibility claim from a funding decision",
      "intro": "“Could we terraform Mars within 100 years?” contains both a timescale and a scientific claim. A classroom debate can examine uncertainty without pretending to settle planetary science.",
      "example": "Motion: public space funding should prioritize studying Mars with robotic missions over a century-long terraforming programme. This is a proposed funding priority, not a prediction that terraforming is possible or impossible.",
      "steps": [
        "Agree on the scope: which public budget, which research goals and what “terraforming” would mean. Do not let one side defend a small experiment while the other attacks complete planetary transformation.",
        "For the priority side, compare nearer-term research questions and opportunity costs. For the opposing side, explain what long-horizon research could teach and why those benefits justify the uncertainty. Each side needs a mechanism, not a slogan.",
        "Build an evidence sheet with a space agency’s current Mars overview, a published research paper and the date of each claim. Separate observed conditions from modelled scenarios and from your own forecast. Uncertainty is a limit to discuss, not a blank cheque for invented numbers."
      ],
      "checks": [
        "Are both teams debating the same funding choice?",
        "Have you labelled facts, model assumptions and predictions separately?"
      ],
      "next": "After the debate, identify one new piece of evidence that would change your priority. A conditional conclusion is stronger than claiming certainty you cannot support."
    },
    "es": {
      "title": "Separa la viabilidad de transformar Marte de una decisión de financiación",
      "intro": "«¿Podríamos terraformar Marte en 100 años?» incluye un plazo y una afirmación científica. Un debate puede examinar la incertidumbre sin pretender resolver la ciencia planetaria.",
      "example": "Moción: la financiación espacial pública debería priorizar el estudio de Marte con misiones robóticas frente a un programa de terraformación de un siglo. Es una prioridad propuesta, no una predicción de que la terraformación sea posible o imposible.",
      "steps": [
        "Acuerda el alcance: qué presupuesto, qué objetivos y qué significaría «terraformar». No dejes que un equipo defienda un pequeño experimento mientras el otro critica una transformación planetaria completa.",
        "Quien defienda esa prioridad debe comparar preguntas de investigación más próximas y costes de oportunidad. La otra parte debe explicar qué enseñaría la investigación a largo plazo y por qué compensa la incertidumbre. Ambos necesitan un razonamiento, no un eslogan.",
        "Prepara una hoja de pruebas con la información actual sobre Marte de una agencia espacial, un artículo científico y la fecha de cada afirmación. Separa condiciones observadas, escenarios modelizados y predicciones propias. La incertidumbre no autoriza a inventar cifras."
      ],
      "checks": [
        "¿Ambos equipos debaten la misma decisión de financiación?",
        "¿Has separado hechos, supuestos del modelo y predicciones?"
      ],
      "next": "Al terminar, identifica una prueba nueva que cambiaría tu prioridad. Una conclusión condicional es más sólida que una certeza que no puedes justificar."
    }
  }
};
