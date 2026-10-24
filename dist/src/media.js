export const artwork = {
  hero: {
    src: './assets/images/hero.webp',
    alt: 'Estudiantes y un instructor aprenden juntos con una tableta y materiales de preparación.'
  },
  training: {
    src: './assets/images/training.webp',
    alt: 'Un instructor y dos estudiantes conversan junto a un maniquí de entrenamiento, sin realizar maniobras.'
  },
  preparedness: {
    src: './assets/images/preparedness.webp',
    alt: 'Personas organizan una mochila y revisan un plano como parte de su preparación.'
  },
  scenarios: {
    src: './assets/images/court-collapse.webp',
    alt: 'Un adulto está tendido en la cancha; dos personas observan el entorno y solicitan ayuda por teléfono.'
  },
  bleeding: {
    src: './assets/images/bleeding.webp',
    alt: 'Una persona con guantes presiona una gasa sobre el antebrazo de un adulto mientras otra pide ayuda.'
  },
  choking: {
    src: './assets/images/choking.webp',
    alt: 'Un adulto lleva una mano a la garganta durante el almuerzo y una compañera observa sus señales.'
  },
  burns: {
    src: './assets/images/burns.webp',
    alt: 'Una adulta enfría el antebrazo bajo agua corriente en el fregadero de una cocina.'
  },
  fainting: {
    src: './assets/images/fainting.webp',
    alt: 'Una adulta está tumbada en una colchoneta tras sentirse mal, acompañada mientras se solicita ayuda.'
  },
  falls: {
    src: './assets/images/falls.webp',
    alt: 'Un adulto permanece en el descansillo de una escalera tras una caída; una persona lo acompaña y otra llama.'
  },
  drill: {
    src: './assets/images/drill.webp',
    alt: 'Estudiantes y docentes caminan de forma ordenada hacia el punto de reunión durante un simulacro escolar.'
  }
};
export const moduleArt = {
  rcp: 'training',
  atragantamiento: 'choking',
  hemorragias: 'bleeding',
  quemaduras: 'burns',
  desmayos: 'fainting',
  caidas: 'falls',
  prevencion: 'preparedness',
  simulacros: 'drill'
};
export const scenarioArt = {
  deporte: 'scenarios',
  comedor: 'choking',
  cocina: 'burns',
  escolar: 'falls',
  herida: 'bleeding',
  preparar: 'drill'
};
export function artImage(key, className = '', eager = false) {
  const a = artwork[key] ?? artwork.hero;
  return `<img class="${className}" src="${a.src}" alt="${a.alt}" width="1536" height="1024" loading="${eager?'eager':'lazy'}" decoding="async" ${eager?'fetchpriority="high"':''}>`;
}
export function lessonCover(id) {
  return `<figure class="lesson-cover">${artImage(moduleArt[id],'',true)}<figcaption>Ilustración del contexto · Revisa las decisiones y sus fundamentos en el módulo.</figcaption></figure>`;
}
