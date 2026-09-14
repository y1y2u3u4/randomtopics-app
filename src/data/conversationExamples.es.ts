import type { Topic } from "./types";

// Editorial starters complement the random pool; displaying one is not a generation.
const starters = [
  ["¿Qué pequeño plan te ha alegrado una semana normal?", "¿Qué lo hizo especial?", "¿Con quién te gustaría repetirlo?"],
  ["¿Qué lugar cercano recomendarías a alguien que acaba de llegar?", "¿Qué se puede hacer allí sin gastar mucho?", "¿Cuál es el mejor momento para visitarlo?"],
  ["¿Qué comida te recuerda a una persona querida?", "¿Quién la preparaba?", "¿Has intentado hacerla tú?"],
  ["¿Qué canción pondrías para empezar un viaje con amigos?", "¿Qué recuerdo tienes de esa canción?", "¿Quién elegiría una canción completamente distinta?"],
  ["¿Qué habilidad cotidiana te gustaría aprender de otra persona?", "¿Qué primer paso podrías probar esta semana?", "¿Qué podrías enseñarle tú a cambio?"],
  ["¿Qué película o serie te hizo cambiar de opinión sobre un personaje?", "¿Qué escena te hizo verlo de otra manera?", "Sin contar el final, ¿a quién se la recomendarías?"],
  ["¿Qué costumbre de tu familia te gustaría conservar?", "¿Cómo empezó esa costumbre?", "¿Cómo la adaptarías a tu vida actual?"],
  ["¿Qué harías con una tarde libre y el teléfono apagado?", "¿Preferirías compañía o estar a solas?", "¿Qué parte de ese plan podrías hacer hoy?"],
  ["¿Qué detalle te ayuda a sentirte bienvenido en un grupo nuevo?", "¿Recuerdas una vez en que alguien lo hizo por ti?", "¿Cómo podríamos hacerlo aquí?"],
  ["¿Qué objeto sencillo llevarías a una isla para entretenerte?", "¿Qué usos inesperados le encontrarías?", "¿Cambiarías tu elección si fueras con amigos?"],
  ["¿Qué consejo entendiste mejor con el paso del tiempo?", "¿Qué experiencia te ayudó a entenderlo?", "¿En qué situación no lo aplicarías?"],
  ["¿Qué pregunta te gustaría que te hicieran más a menudo?", "¿Qué te permite contar esa pregunta?", "¿Te gustaría responderla ahora o prefieres pasar?"],
] as const;

export const conversationExamplesEs: Topic[] = starters.map(([text, ...talkingPoints], index) => ({
  id: `es-conversation-example-${index + 1}`,
  text,
  talkingPoints: [...talkingPoints],
  category: "relationships",
  modes: ["conversation"],
  depth: "light",
}));
