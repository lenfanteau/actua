// Original ACTÚA messages. Selected locally; no external requests or attribution.
export const encouragements = [
  'Cada paso que das hoy suma a lo que podrás comprender mañana.',
  'La constancia crece con decisiones pequeñas, repetidas con intención.',
  'Aprender también es darte permiso para volver a intentarlo.',
  'Tu curiosidad puede convertirse en un hábito de cuidado.',
  'No necesitas saberlo todo para seguir aprendiendo.',
  'Lo que hoy repasas puede convertirse mañana en una idea más clara.',
  'Prepararte empieza con algo sencillo: dedicar un momento a aprender.',
  'Cada pregunta que te haces abre una oportunidad para comprender mejor.',
  'El progreso también está en reconocer lo que quieres repasar.',
  'Una pausa para aprender también es una forma de avanzar.',
  'Los pequeños aprendizajes se vuelven grandes cuando los cuidas con constancia.',
  'Siempre puedes dar un nuevo paso, a tu propio ritmo.',
  'Aprender con atención es una manera de cuidarte y pensar en los demás.',
  'Tu esfuerzo de hoy merece un momento de reconocimiento.',
  'Comprender una decisión vale el tiempo que dedicas a pensarla.',
  'La preparación se construye paso a paso, también en equipo.',
  'Volver a practicar puede mostrarte algo que antes no habías visto.',
  'Cada oportunidad de aprender cuenta, incluso cuando necesitas otro intento.',
  'La confianza se cultiva con preguntas, práctica y ganas de seguir aprendiendo.',
  'Lleva contigo la curiosidad: siempre queda algo valioso por descubrir.'
].map((text,index)=>({id:'actua-'+(index+1),text}));

export function pickEncouragement(previousId=null, random=Math.random) {
  const options=encouragements.filter(item=>item.id!==previousId);
  const value=random();
  const index=Number.isFinite(value)?Math.max(0,Math.min(options.length-1,Math.floor(value*options.length))):0;
  return options[index];
}
