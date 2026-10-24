import {
  VERIFIED
} from './sources.js';
import {
  challenges
} from './challenges.js';
const q = (id, prompt, options, answer, explanation, level = 1) => ({
  id,
  prompt,
  options,
  answer,
  explanation,
  level
});
const m = (id, title, subtitle, icon, color, minutes, sources, sections, questions) => ({
  id,
  title,
  subtitle,
  icon,
  color,
  minutes,
  sources,
  sections,
  questions,
  age: 'adult',
  version: '1.0.0',
  verified: VERIFIED,
  objective: subtitle
});
export const modules = [
  m('rcp', 'RCP y DEA', 'Reconoce señales de un posible paro cardíaco y comprende las decisiones iniciales.', 'heart', 'coral', 8, ['aha25', 'bls', 'heart'], [
    ['Comprender', 'El paro cardíaco interrumpe el bombeo de sangre. El infarto afecta el flujo hacia el músculo cardíaco; ambos necesitan atención urgente.'],
    ['Reconocer señales', 'En un adulto, falta de respuesta y respiración ausente o anormal, incluidos jadeos, hacen sospechar paro. El ciudadano no debe perder tiempo buscando el pulso.'],
    ['Entorno y ayuda', 'Comprueba que acercarte sea seguro. Activa el sistema de emergencias y pide un DEA; el operador puede orientar.'],
    ['Compresiones: concepto', 'La guía adulta indica el centro del pecho, 100–120 compresiones por minuto, al menos 5 cm evitando superar 6 cm, con expansión completa. Aprende la técnica con un instructor y un maniquí.'],
    ['Según tu formación', 'Si no tienes entrenamiento, la RCP solo con compresiones es una opción para el adulto con sospecha de paro. Quien está entrenado y puede hacerlo añade ventilaciones según su capacitación.'],
    ['Conocer el DEA', 'Enciende el DEA y sigue sus indicaciones. Nadie debe tocar a la persona durante el análisis o la descarga. Reanuda RCP cuando lo indique.'],
    ['Evitar errores', 'Los jadeos no son respiración normal. No practiques compresiones sobre personas sanas. Esta pantalla no mide profundidad ni calidad física.'],
    ['Caso para pensar', 'Una persona adulta se desploma y solo jadea. Identifica las señales y revisa la activación de ayuda antes de pasar al escenario deportivo.']
  ], [
    q('r1', 'Un adulto no responde y solo jadea. ¿Qué debes sospechar?', ['Un descanso normal', 'Un posible paro cardíaco', 'Que puede continuar jugando'], 1, 'Falta de respuesta y jadeos son señales de alarma; no equivalen a respiración normal.'),
    q('r2', '¿Qué ayuda debes activar?', ['Servicios de emergencia y un DEA', 'Solo una encuesta', 'Esperar a que termine la clase'], 0, 'Activa emergencias y solicita un DEA. Sigue la orientación del operador.'),
    q('r3', 'Durante el análisis del DEA, ¿qué es correcto?', ['Mantener contacto físico', 'Nadie toca a la persona', 'Retirar siempre los parches'], 1, 'El análisis y la descarga requieren que nadie toque a la persona.', 2),
    q('r4', '¿La web puede acreditar la profundidad real de tus compresiones?', ['Sí, con clics rápidos', 'No; hace falta práctica supervisada', 'Sí, con la cámara apagada'], 1, 'Un cuestionario digital evalúa conocimientos; no mide una técnica física.')
  ]),
  m('atragantamiento', 'Atragantamiento', 'Distingue una tos eficaz de los signos de obstrucción grave en adultos.', 'air', 'amber', 7, ['aha25', 'fbao'], [
    ['Comprender', 'Una obstrucción dificulta el paso del aire. La respuesta depende de la gravedad y de si la persona permanece consciente.'],
    ['Si la tos es eficaz', 'Anima a toser y observa si aparecen signos de gravedad. No uses la secuencia para obstrucción grave mientras la tos siga siendo eficaz.'],
    ['Reconocer gravedad', 'Tos débil o ausente, imposibilidad de hablar, cambio de color, alteración de conciencia o ausencia de respiración son señales de obstrucción grave.'],
    ['Adulto consciente: AHA 2025', 'Activa emergencias. La secuencia es cinco golpes en la espalda seguidos de cinco compresiones abdominales; se repite hasta expulsión o pérdida de respuesta. La técnica física requiere formación práctica.'],
    ['Excepciones importantes', 'En embarazo avanzado o si no puedes rodear el abdomen, la guía sustituye las compresiones abdominales por torácicas. No aplica esta ruta a lactantes.'],
    ['Si deja de responder', 'Inicia RCP empezando por compresiones y activa ayuda si aún no se hizo. Al abrir la vía aérea para ventilaciones, retira solo un objeto visible.'],
    ['Evitar errores', 'No hagas barridos digitales a ciegas. No practiques golpes o compresiones sobre personas sanas.'],
    ['Caso para pensar', 'Durante una comida, una persona deja de hablar y su tos es débil. El caso del comedor te permite diferenciar esta situación de una tos eficaz.']
  ], [
    q('a1', 'Una persona adulta tose con fuerza y puede hablar. ¿Qué corresponde?', ['Animar a toser y observar', 'Dar agua a la fuerza', 'Hacer un barrido a ciegas'], 0, 'Con tos eficaz se anima a toser y se vigila la aparición de gravedad.'),
    q('a2', '¿Qué señal sugiere obstrucción grave?', ['Hablar con normalidad', 'Tos fuerte y eficaz', 'No poder hablar y tos débil'], 2, 'La incapacidad de hablar y la tos débil son señales de gravedad.'),
    q('a3', '¿Qué secuencia incluye AHA 2025 para el adulto consciente con obstrucción grave?', ['Solo esperar', '5 golpes en espalda y 5 compresiones abdominales', 'Dar de beber'], 1, 'AHA 2025 alterna estas dos acciones hasta la expulsión o pérdida de respuesta.', 2),
    q('a4', '¿Se retira un objeto que no puedes ver introduciendo los dedos?', ['Sí, siempre', 'No; evita barridos a ciegas'], 1, 'Solo se retira un objeto visible; un barrido a ciegas puede empeorar la obstrucción.', 2)
  ]),
  m('hemorragias', 'Hemorragias', 'Identifica sangrado peligroso y las prioridades iniciales de seguridad.', 'drop', 'coral', 6, ['bleed', 'fa24'], [
    ['Comprender', 'El sangrado externo es visible. Un flujo continuo o a chorros puede ser potencialmente mortal.'],
    ['Proteger', 'Revisa el entorno, obtén consentimiento si es posible y evita contacto directo con sangre usando barreras disponibles.'],
    ['Señales de alarma', 'Sangrado abundante o continuo, palidez, piel fría y alteración de la respuesta requieren ayuda urgente.'],
    ['Respuesta inicial', 'Activa emergencias ante sangrado grave. Aplica presión directa firme y sostenida sobre la herida con un apósito o material limpio.'],
    ['Objetos incrustados', 'No retires un objeto incrustado. La presión se aplica alrededor del objeto y se busca atención médica.'],
    ['Límite de este módulo', 'Torniquetes y empaquetamiento de heridas necesitan capacitación específica; aquí no se enseña su colocación.'],
    ['Evitar errores', 'No retrases la ayuda para completar actividades. No extraigas objetos incrustados ni ignores cambios de conciencia.'],
    ['Caso para pensar', 'Una herida sangra de forma continua. Prioriza protección, ayuda profesional y control inicial dentro de tu formación.']
  ], [
    q('h1', '¿Qué flujo es una señal de alarma?', ['Continuo o a chorros', 'Una marca seca antigua'], 0, 'El flujo continuo o a chorros puede indicar sangrado potencialmente mortal.'),
    q('h2', '¿Cuál es una medida inicial para el sangrado externo grave?', ['Presión directa firme con material limpio y activar ayuda', 'Esperar sin avisar', 'Lavar durante media hora antes de avisar'], 0, 'Presión directa y activación de emergencias son prioridades.'),
    q('h3', '¿Qué haces con un objeto incrustado?', ['Extraerlo', 'Dejarlo y pedir atención', 'Moverlo para examinar debajo'], 1, 'No se retira el objeto; puede agravar el sangrado.', 2),
    q('h4', '¿Completar este módulo enseña a colocar cualquier torniquete?', ['Sí', 'No; requiere capacitación específica'], 1, 'El contenido digital no acredita la técnica de torniquetes.')
  ]),
  m('quemaduras', 'Quemaduras', 'Reconoce riesgos térmicos y distingue medidas útiles de remedios peligrosos.', 'flame', 'amber', 6, ['burn', 'fa24'], [
    ['Comprender', 'El calor, químicos y electricidad pueden producir quemaduras. Este recorrido se limita a educación inicial sobre quemaduras térmicas.'],
    ['Proteger', 'Aleja el riesgo solo si es seguro. No te acerques a una fuente eléctrica activa ni te expongas a químicos.'],
    ['Enfriar', 'AHA / American Red Cross contemplan agua corriente limpia y fresca durante 5–20 minutos para quemaduras térmicas. Vigila el enfriamiento del cuerpo, especialmente en lesiones extensas.'],
    ['Retirar con cuidado', 'Retira ropa o joyas cercanas si no están adheridas a la lesión. No desprendas material pegado.'],
    ['Señales de alarma', 'Lesión profunda, extensa o en cara, manos, pies o genitales necesita evaluación pronta. Dificultad respiratoria o sospecha de inhalación de humo exige emergencias.'],
    ['Evitar errores', 'No apliques mantequilla ni remedios caseros. No uses hielo directo. No revientes ampollas ni intentes limpiar una lesión grave.'],
    ['Diferencias entre guías', 'La duración óptima no tiene consenso internacional. No conviertas un tiempo de enfriamiento en razón para demorar atención urgente.'],
    ['Caso para pensar', 'Se derrama una bebida caliente sobre el antebrazo de un adulto. Revisa primero el entorno y el enfriamiento seguro, sin remedios caseros.']
  ], [
    q('q1', '¿Qué recurso aparece en la guía para enfriar una quemadura térmica?', ['Mantequilla', 'Agua corriente limpia y fresca', 'Hielo directo'], 1, 'El enfriamiento con agua es la medida descrita por AHA / American Red Cross.'),
    q('q2', 'La ropa está pegada a la lesión. ¿Debes arrancarla?', ['Sí', 'No'], 1, 'No desprendas la ropa adherida.'),
    q('q3', '¿Qué situación exige activar emergencias?', ['Dificultad para respirar tras humo', 'Solo querer terminar el curso'], 0, 'La sospecha de lesión por inhalación necesita atención urgente.', 2),
    q('q4', '¿Todas las guías recomiendan exactamente el mismo tiempo?', ['Sí', 'No; hay diferencias documentadas'], 1, 'ACTÚA registra la diferencia entre recomendaciones; no presenta una duración universal.', 2)
  ]),
  m('desmayos', 'Desmayos y pérdida de respuesta', 'Diferencia el mareo inicial de una pérdida de respuesta que necesita ayuda.', 'person', 'lavender', 6, ['fa24', 'steps', 'bls'], [
    ['Comprender', 'Un desmayo es una pérdida breve de conciencia. No se debe asumir que toda pérdida de respuesta es un desmayo simple.'],
    ['Antes de caer', 'Mareo, sudoración, palidez o cambios visuales pueden preceder un desmayo. Ayuda a adoptar una posición segura, sentado o acostado.'],
    ['Señales de alarma', 'Si ocurre pérdida de conciencia, empeora o reaparece el malestar, activa emergencias. Dolor de pecho o síntomas de ictus requieren atención urgente.'],
    ['Si no responde', 'Comprueba la respiración. Si no respira normalmente o solo jadea, sigue la ruta de sospecha de paro y solicita ayuda.'],
    ['Si respira normalmente', 'Solicita ayuda y vigila la respuesta y la respiración. La posición de recuperación requiere valorar lesiones; no se aplica automáticamente ante posible trauma.'],
    ['Evitar errores', 'No obligues a incorporarse. No interpretes jadeos como recuperación ni des por hecho que no existe lesión.'],
    ['Límite del contenido', 'La aplicación no identifica la causa de un desmayo ni reemplaza una evaluación clínica.'],
    ['Caso para pensar', 'Una persona dice sentirse mareada. Ayudarla a sentarse con seguridad es diferente de tratar a alguien que ya no responde.']
  ], [
    q('d1', 'Alguien está mareado antes de caer. ¿Qué opción es más segura?', ['Hacerle correr', 'Ayudar a sentarse o acostarse de forma segura', 'Obligarlo a estar de pie'], 1, 'Una posición segura reduce el riesgo de lesión por caída.'),
    q('d2', '¿Toda pérdida de respuesta es un desmayo simple?', ['Sí', 'No'], 1, 'No se debe asumir la causa; revisa respuesta y respiración.'),
    q('d3', 'No responde y solo jadea. ¿Qué ruta corresponde?', ['Sospecha de paro y activar ayuda', 'Esperar a terminar una actividad'], 0, 'La respiración anormal con falta de respuesta requiere la ruta de paro.', 2),
    q('d4', '¿Se aplica una posición de recuperación sin valorar lesiones?', ['Sí', 'No'], 1, 'El posible trauma modifica las precauciones de posición.', 2)
  ]),
  m('caidas', 'Accidentes y caídas', 'Identifica peligros y precauciones ante posibles lesiones de cabeza, cuello o espalda.', 'shield', 'lavender', 5, ['steps', 'fa24'], [
    ['Comprender', 'Una caída puede causar lesiones que no se ven a simple vista. El contexto importa y la web no determina su gravedad.'],
    ['Seguridad del lugar', 'Busca peligros antes de aproximarte. Evita que otra persona se lesione y pide apoyo.'],
    ['Señales de alarma', 'Falta de respuesta, respiración anormal o sangrado grave necesitan ayuda urgente. Dolor de cuello o espalda tras una caída exige cautela y valoración.'],
    ['Acción inicial', 'No pidas moverse a quien pueda tener lesión de cabeza, cuello o columna. Activa ayuda y sigue la orientación de emergencias.'],
    ['Prioridades', 'La atención depende de lo encontrado y de tu formación. Si deja de respirar normalmente, es necesaria la ruta de paro cardíaco.'],
    ['Evitar errores', 'No intentes enderezar una extremidad ni obligues a caminar para comprobar si hay lesión.'],
    ['Prevención del entorno', 'Revisa obstáculos y rutas de paso como parte del plan de preparación; acuerda mejoras con responsables.'],
    ['Caso para pensar', 'Tras una caída, una persona se queja del cuello. Mantén el entorno seguro y pide ayuda sin invitarla a levantarse.']
  ], [
    q('c1', '¿Qué revisas antes de acercarte?', ['La seguridad del lugar', 'El resultado del cuestionario'], 0, 'La seguridad del entorno evita nuevas lesiones.'),
    q('c2', 'Dolor de cuello después de caer. ¿Qué evitas?', ['Pedir ayuda', 'Pedir que se levante para probar', 'Mantener el lugar seguro'], 1, 'No pidas moverse ante sospecha de lesión de cabeza, cuello o columna.'),
    q('c3', '¿La ausencia de sangre descarta una lesión seria?', ['Sí', 'No'], 1, 'La gravedad no se determina solo por una lesión visible.', 2),
    q('c4', 'No responde y no respira normalmente. ¿Qué necesitas?', ['Ruta de paro y ayuda urgente', 'Una foto para el registro'], 0, 'La falta de respuesta y respiración normal exige una respuesta urgente.', 2)
  ]),
  m('prevencion', 'Prevenir también es actuar', 'Convierte la preparación familiar en acuerdos y acciones concretas.', 'home', 'mint', 5, ['family', 'ready'], [
    ['Identificar', 'Recorre los espacios con sus responsables e identifica riesgos, lugares seguros y rutas.'],
    ['Organizar', 'Asigna roles y acuerda un punto de reunión y formas de comunicación con la familia.'],
    ['Reducir riesgos', 'Fija muebles altos y repisas y mantén salidas despejadas según el plan familiar de INDECI.'],
    ['Preparar recursos', 'Decide quién lleva la mochila y revisa los recursos del hogar; adapta el plan a las necesidades de las personas.'],
    ['Colegio y deporte', 'Conoce las instrucciones del lugar y a sus responsables. La preparación debe responder a los riesgos identificados.'],
    ['Evitar errores', 'Un checklist completo no garantiza seguridad. No inventes rutas sin aprobación de los responsables.'],
    ['Revisar', 'Mantén el plan actualizado. Usa la sección Preparación para registrar acuerdos y pendientes.'],
    ['Caso para pensar', 'La salida tiene cajas acumuladas y nadie conoce el punto de reunión. Registra ambos pendientes y acuerda mejoras.']
  ], [
    q('p1', '¿Qué se debe mantener libre?', ['Salidas y rutas', 'Solo el escritorio'], 0, 'INDECI recomienda mantener las salidas libres de obstáculos.'),
    q('p2', '¿Quién decide rutas escolares?', ['Una IA sin conocer el lugar', 'Los responsables del plan institucional', 'El azar'], 1, 'Las rutas deben corresponder al plan y a las indicaciones institucionales.'),
    q('p3', '¿Qué hace útil un plan familiar?', ['Roles, riesgos, rutas y revisión', 'Solo un título bonito'], 0, 'La preparación requiere acuerdos aplicables y revisión.', 2),
    q('p4', '¿Un checklist al 100% garantiza seguridad?', ['Sí', 'No'], 1, 'Es un registro educativo de actividades, no una garantía.', 2)
  ]),
  m('simulacros', 'Simulacros y preparación', 'Planifica ejercicios escolares según los riesgos y las instrucciones institucionales.', 'flag', 'mint', 5, ['minedu', 'ready'], [
    ['Objetivo', 'El simulacro permite practicar lo previsto y encontrar mejoras en la organización.'],
    ['Peligros del territorio', 'Un ejercicio multipeligro debe corresponder a los peligros locales; no todas las escuelas tienen el mismo escenario.'],
    ['Organización', 'Identifica brigadas, responsables, rutas señalizadas y puntos de reunión con la institución.'],
    ['Antes del ejercicio', 'Conoce las instrucciones, los medios de comunicación y los materiales acordados. Revisa necesidades de accesibilidad.'],
    ['Tipos de registro', 'Puedes documentar sismo, incendio o accidente escolar. La ejecución física se hace bajo supervisión institucional.'],
    ['Después del ejercicio', 'Anota observaciones y aspectos por mejorar. El registro de ACTÚA es educativo; no constituye una inspección oficial.'],
    ['Evitar errores', 'No improvises evacuaciones ni uses la app como sustituto de un plan aprobado.'],
    ['Caso para pensar', 'Un grupo desconoce a su responsable de comunicación. Añade el pendiente y revísalo antes del siguiente ejercicio.']
  ], [
    q('s1', '¿El mismo escenario sirve para todas las localidades?', ['Sí', 'No; depende de los peligros locales'], 1, 'Los ejercicios deben responder a los peligros del territorio.'),
    q('s2', '¿Para qué se anotan observaciones?', ['Para identificar mejoras', 'Para certificar seguridad automáticamente'], 0, 'El registro ayuda a revisar acuerdos y actividades.'),
    q('s3', '¿Qué organización se debe conocer?', ['Brigadas, responsables y rutas señalizadas', 'Solo el puntaje'], 0, 'La preparación institucional incluye esos elementos.', 2),
    q('s4', '¿Quién supervisa el ejercicio real?', ['La institución y sus responsables', 'El motor de preguntas'], 0, 'La app no dirige acciones físicas ni reemplaza el plan.', 2)
  ])
];
export const byModule = id => modules.find(m => m.id === id);
for (const module of modules) module.challengeQuestions = challenges[module.id] ?? [];
export const checklistDefaults = {
  escolar: ['Conocemos las rutas aprobadas', 'Identificamos las salidas y zonas seguras', 'Acordamos el punto de reunión', 'Definimos responsables y brigadas', 'Revisamos medios de comunicación', 'Preparamos materiales', 'Revisamos instrucciones y accesibilidad'],
  familiar: ['Identificamos riesgos del hogar', 'Acordamos zonas seguras y rutas', 'Asignamos roles familiares', 'Acordamos comunicación y reunión', 'Revisamos mochila y recursos', 'Fijamos muebles y liberamos salidas', 'Revisamos necesidades de apoyo']
};
