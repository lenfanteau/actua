// Nodos correctos y de repaso: una elección modifica la ruta, nunca un desenlace clínico.
const option = (text, correct, feedback, next) => ({
  text,
  correct,
  feedback,
  next
});
const node = (title, text, options) => ({
  title,
  text,
  options
});

function scenario(id, title, subtitle, icon, module, setting, steps) {
  const nodes = {};
  steps.forEach((s, i) => {
    const next = i === steps.length - 1 ? 'end' : `step${i+1}`;
    nodes[`step${i}`] = node(s[0], s[1], [option(s[2], true, s[4], next), option(s[3], false, s[5], `review${i}`)]);
    nodes[`review${i}`] = node('Pausa para razonar', s[5], [option(s[2], true, s[4], next), option('Volver a observar el caso', false, 'Relee las señales y vuelve a elegir.', `step${i}`)]);
  });
  return {
    id,
    title,
    subtitle,
    icon,
    module,
    setting,
    age: 'adult',
    start: 'step0',
    nodes,
    coreSteps: steps.length
  };
}
export const scenarios = [
  scenario('deporte', 'Un colapso en la cancha', 'Reconoce señales, activa ayuda y conoce el DEA.', 'heart', 'rcp', 'cancha', [
    ['Observa el entorno', 'Una persona adulta se desploma. Hay cables de un equipo de sonido cerca.', 'Comprobar que acercarse sea seguro', 'Acercarme sin mirar', 'La seguridad del lugar es la primera condición para ayudar.', 'Revisa peligros antes de acercarte; evita un segundo accidente.'],
    ['Interpreta las señales', 'El lugar es seguro. La persona no responde y solo jadea.', 'Sospechar paro y activar emergencias; pedir un DEA', 'Considerar que jadea porque está recuperándose', 'Falta de respuesta y jadeos requieren la ruta de posible paro.', 'Los jadeos son respiración anormal; no indican una recuperación segura.'],
    ['Prioriza la respuesta', 'Ya se ha activado ayuda. Recuerda tu nivel de formación.', 'Iniciar RCP; seguir al operador y las indicaciones del DEA', 'Esperar pasivamente hasta ver una ambulancia', 'El algoritmo lego integra ayuda, RCP y DEA; el dispositivo indica qué hacer.', 'La espera pasiva retrasa las acciones iniciales recomendadas.']
  ]),
  scenario('comedor', 'Una decisión en el comedor', 'Distingue tos eficaz y obstrucción grave.', 'air', 'atragantamiento', 'comedor', [
    ['Reconoce una tos eficaz', 'Un adulto tose con fuerza y puede hablar mientras come.', 'Animar a toser y vigilar cambios', 'Aplicar de inmediato compresiones abdominales', 'La respuesta inicial con tos eficaz es animar a toser y observar.', 'La secuencia para obstrucción grave no se usa automáticamente con tos eficaz.'],
    ['Detecta el cambio', 'Ahora no puede hablar y la tos es débil. Sigue consciente.', 'Reconocer gravedad y activar emergencias', 'Dar agua para que pase el alimento', 'La incapacidad de hablar y la tos débil indican posible obstrucción grave.', 'Dar agua no es la respuesta del algoritmo a una obstrucción grave.'],
    ['Recuerda la guía de 2025', 'Es un adulto consciente con obstrucción grave, sin excepción descrita.', 'Alternar 5 golpes en espalda y 5 compresiones abdominales', 'Introducir los dedos sin ver el objeto', 'Es la secuencia AHA 2025; se aprende físicamente con capacitación.', 'Evita barridos a ciegas. La técnica debe aprenderse con un instructor.'],
    ['Si deja de responder', 'La narración cambia: la persona ya no responde.', 'Iniciar RCP por compresiones y mantener la ayuda activada', 'Continuar las maniobras de pie', 'La pérdida de respuesta cambia la ruta a RCP.', 'El algoritmo cambia cuando el adulto deja de responder.']
  ]),
  scenario('cocina', 'Un incidente en casa', 'Revisa el entorno y una quemadura térmica.', 'flame', 'quemaduras', 'cocina', [
    ['Primero, el entorno', 'Se derramó una bebida caliente sobre el brazo de un adulto. Hay líquido en el suelo.', 'Evitar el riesgo de resbalar y acercarme de forma segura', 'Correr sin mirar', 'La ayuda empieza por la seguridad de quienes participan.', 'Un suelo peligroso puede ocasionar otra lesión.'],
    ['Elige un recurso', 'El entorno ya es seguro. Hay un grifo con agua limpia.', 'Usar agua corriente limpia y fresca', 'Cubrir con mantequilla', 'El agua es el recurso de enfriamiento de la guía consultada.', 'Los remedios caseros no reemplazan el enfriamiento recomendado.'],
    ['Reconoce la alarma', 'En otro momento del caso, se describe humo y dificultad para respirar.', 'Activar emergencias sin esperar a acabar el ejercicio', 'Esperar a que finalice un tiempo de enfriamiento', 'La dificultad respiratoria tras humo exige atención urgente.', 'No demores la ayuda por completar un tiempo o una actividad.']
  ]),
  scenario('escolar', 'Una caída en el colegio', 'Comunica y evita agravar una posible lesión.', 'shield', 'caidas', 'escuela', [
    ['Reconoce peligros', 'Un adulto del colegio cayó cerca de una escalera mojada.', 'Evitar el paso por la zona y avisar a responsables', 'Reunir a todos en la escalera', 'La seguridad y la comunicación evitan nuevos incidentes.', 'No aumentes el riesgo reuniendo personas en una zona peligrosa.'],
    ['Escucha las señales', 'La persona responde y dice que le duele el cuello.', 'No pedir que se levante y buscar ayuda', 'Hacerla caminar para probar', 'La sospecha de lesión de cuello exige evitar movimientos innecesarios.', 'No se comprueba una lesión obligando a caminar.'],
    ['Límite de la aplicación', 'El responsable activa los servicios correspondientes.', 'Seguir el plan institucional y la orientación del servicio', 'Usar el resultado de la app como diagnóstico', 'ACTÚA organiza conocimientos; no diagnostica ni dirige la atención.', 'El resultado educativo no es un diagnóstico.']
  ]),
  scenario('herida', 'Un sangrado que preocupa', 'Identifica las prioridades del sangrado externo.', 'drop', 'hemorragias', 'taller', [
    ['Observa', 'Una persona adulta presenta sangre que fluye continuamente de una herida.', 'Reconocer posible gravedad y activar ayuda', 'Ignorarlo si todavía habla', 'El flujo continuo puede ser potencialmente mortal.', 'Poder hablar no descarta la gravedad del sangrado.'],
    ['Protégete', 'El entorno es seguro y hay guantes y material limpio.', 'Usar barrera y presión directa firme', 'Tocar la sangre sin protección disponible', 'La protección y presión directa forman parte de la respuesta inicial.', 'Usa barreras disponibles y medidas dentro de tu formación.'],
    ['Límites de formación', 'Alguien ofrece un torniquete que nunca has usado.', 'Seguir al operador; reconocer que su técnica requiere capacitación', 'Afirmar que este cuestionario ya me capacitó', 'Una actividad web no acredita una técnica física.', 'La formación práctica específica es necesaria; el puntaje no la sustituye.']
  ]),
  scenario('preparar', 'Antes del simulacro', 'Encuentra pendientes del plan escolar.', 'flag', 'simulacros', 'escuela', [
    ['Elige el contexto', 'Se prepara un ejercicio de sismo en la escuela.', 'Consultar el plan aprobado y a los responsables', 'Inventar una ruta en el momento', 'El ejercicio debe responder a los peligros locales y al plan institucional.', 'Las rutas no se improvisan desde una aplicación.'],
    ['Revisa la organización', 'Nadie sabe quién comunica las novedades a las brigadas.', 'Definir responsables antes del ejercicio', 'Marcar todo como completo', 'Los roles y la comunicación deben quedar acordados.', 'Un checklist sin acuerdos reales no refleja preparación.'],
    ['Aprende de la práctica', 'El ejercicio supervisado terminó y se detectaron obstáculos.', 'Registrar mejoras y revisarlas con la institución', 'Declarar seguridad certificada por la app', 'El registro permite identificar actividades pendientes.', 'ACTÚA no emite una evaluación oficial de seguridad.']
  ])
];
export const byScenario = id => scenarios.find(s => s.id === id);
