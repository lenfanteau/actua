import {
  modules,
  byModule,
  checklistDefaults
} from './data/content.js';
import {
  sources,
  bySource,
  conflicts,
  VERIFIED
} from './data/sources.js';
import {
  scenarios,
  byScenario
} from './data/scenarios.js';
import {
  freshState,
  loadState,
  saveState,
  metrics,
  recommend,
  selectQuestions,
  recordAttempt,
  nextNode,
  scenarioSummary
} from './engine.js';
import {
  icon,
  heroArt,
  sceneArt
} from './illustrations.js';
import {
  orderCards,
  initialOrder,
  moveOrder,
  evaluateOrder,
  decisionNumber
} from './order.js';
import {
  artImage,
  moduleArt,
  scenarioArt,
  lessonCover
} from './media.js';
import { mountMotion } from './motion.js';
import { emergencyContacts, contactCategories, CONTACTS_VERIFIED, filterContacts, contactDirectoryText } from './data/emergencies.js';
import { startModes, filterModules } from './discovery.js';
import { pickEncouragement } from './encouragement.js';
const APP_VERSION = '1.4.0';
let orderEncouragement=null;
const checkEncouragements={escolar:null,familiar:null};
let startMode='aprender', learnCategory='todos', contactQuery='', contactCategory='todos', contactToolsOpen=false;
let orderIds = initialOrder(),
  orderResult = null,
  orderDrag = null;
const $ = s => document.querySelector(s);

function focusView(selector) {
  const target = document.querySelector(selector) || document.querySelector('#main');
  target.tabIndex = -1;
  target.focus({
    preventScroll: true
  });
  target.scrollIntoView({
    block: 'nearest',
    behavior: 'instant'
  });
}
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
} [c]));
let storage;
try {
  storage = window.localStorage;
} catch {
  storage = {
    getItem() {
      throw Error();
    },
    setItem() {
      throw Error();
    }
  };
}
let {
  state,
  persistent
} = loadState(storage);
let quiz = null,
  sim = null,
  filter = '',
  checkKind = 'escolar',
  mobileMenu = false;
const routes = [
  ['inicio', 'Inicio', 'grid'],
  ['aprende', 'Aprende', 'book'],
  ['simulador', 'Simulador', 'play'],
  ['preparacion', 'Preparación', 'flag'],
  ['prevencion', 'Prevención', 'shield'],
  ['progreso', 'Mi progreso', 'chart'],
  ['contactos', 'Emergencias Perú', 'phone'],
  ['fuentes', 'Fuentes y rigor', 'source']
];

function persist() {
  persistent = saveState(storage, state);
  if (!persistent) notify('No se pudo guardar. Los cambios durarán solo durante esta sesión.');
}

function notify(text) {
  $('#notice').textContent = text;
  setTimeout(() => {
    $('#notice').textContent = '';
  }, 5000);
}

function link(route, text, cls = 'btn', ico = 'arrow') {
  return `<a class="${cls}" href="#/${route}">${text}${ico?icon(ico):''}</a>`;
}

function button(action, text, cls = 'btn', extra = '') {
  return `<button class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
}

function header(kicker, title, text = '', action = '') {
  return `<div class="page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1>${text?`<p class="lead">${text}</p>`:''}</div>${action}</div>`;
}

function safety() {
  return `<div class="safety">${icon('info')}<div><strong>Aprende y practica con responsabilidad</strong><p>Aprender aquí no certifica habilidades prácticas. No practiques maniobras sobre personas sanas. En una emergencia real, busca ayuda profesional sin completar actividades.</p></div></div>`;
}

function nextEncouragement() {
  const phrase=pickEncouragement(state.settings.lastEncouragement);
  state.settings.lastEncouragement=phrase.id;
  return phrase;
}

function encouragementCard(phrase) {
  if (!phrase) return '';
  return `<aside class="encouragement" aria-label="Un impulso para seguir" data-phrase="${esc(phrase.id)}"><span class="encouragement-spark" aria-hidden="true">✦</span><div><p class="eyebrow">UN PASO MÁS EN TU CAMINO</p><blockquote>${esc(phrase.text)}</blockquote><small>ACTÚA · Sigue aprendiendo a tu ritmo.</small></div></aside>`;
}

function sourcePanel(ids) {
  return `<details class="source-panel"><summary>${icon('source')} Fuentes y versión del contenido</summary><p>ACTÚA ${APP_VERSION} · Contenido v1.0.0 · Verificación documental: ${VERIFIED}</p>${ids.map(id=>{const s=bySource(id);return `<p><a target="_blank" rel="noopener noreferrer" href="${s.url}">${esc(s.institution)} · ${esc(s.title)} ↗</a><br><small>Publicación: ${s.year??'año no visible'} · Actualización: ${s.updated??'no informada'} · ${esc(s.access)}</small></p>`;}).join('')}</details>`;
}

function moduleCard(m, i = 0) {
  const done = state.completed[m.id];
  return `<a class="module-card" href="#/leccion/${m.id}"><div class="module-image">${artImage(moduleArt[m.id])}<span class="image-badge">${icon(m.icon)}</span></div><div class="module-top"><span class="tile-icon ${m.color}">${icon(m.icon)}</span><span class="tag">${done?'✓ Recorrido realizado':`${m.minutes} min aprox.`}</span></div><p class="eyebrow">${String(modules.findIndex(item=>item.id===m.id)+1).padStart(2,'0')} / ${m.id==='prevencion'||m.id==='simulacros'?'PREPARACIÓN':'PRIMEROS AUXILIOS · ADULTOS'}</p><h3>${m.title}</h3><p>${m.subtitle}</p><div class="card-foot"><span>${done?'Volver a repasar':'Explorar módulo'}</span>${icon('arrow')}</div></a>`;
}

function scenarioCard(s) {
  return `<a href="#/caso/${s.id}" class="scenario-card"><div class="scenario-image">${artImage(scenarioArt[s.id])}</div><span class="tile-icon mint">${icon(s.icon)}</span><div><span class="eyebrow">${s.coreSteps} DECISIONES + RUTAS DE REPASO</span><h3>${s.title}</h3><p>${s.subtitle}</p></div>${icon('arrow')}</a>`;
}

function home() {
  const met = metrics(state, modules),
    next = recommend(state, modules)[0], mode = startModes[startMode];
  return `
<div class="welcome"><div><p class="eyebrow">TU ESPACIO PARA APRENDER Y PREPARARTE</p><h1>Un poco de preparación.<br>Una gran diferencia.</h1></div><span class="peru">● Hecho para aprender en Perú</span></div>
<section class="hero fresh-hero" data-start-mode="${startMode}"><div class="hero-copy"><span class="pill">UN ESPACIO. MUCHAS FORMAS DE PREPARARTE.</span><div class="start-switch" role="group" aria-label="Elige cómo empezar">${Object.entries(startModes).map(([key,m])=>button('start-mode',icon(m.icon)+m.label,'start-choice',`data-mode="${key}" aria-pressed="${startMode===key}"`)).join('')}</div><div class="hero-message" aria-live="polite"><h2>${mode.title}</h2><p>${mode.text}</p></div><div class="actions">${link(mode.route,mode.action,'btn primary')}${link(mode.secondary,mode.secondaryAction,'btn secondary','arrow')}</div><div class="hero-note">${icon('shield')} Sin registro · A tu ritmo · Con fuentes oficiales</div></div>${heroArt(mode.image,mode.caption)}</section>
<div class="stats-row"><div>${icon('book')}<strong>8</strong><span>Módulos educativos</span></div><div>${icon('play')}<strong>6</strong><span>Escenarios interactivos</span></div><div>${icon('chart')}<strong>${met.completed}/8</strong><span>Recorridos realizados</span></div><div>${icon('source')}<strong>2025 / 2024</strong><span>Guías AHA de referencia</span></div></div>
<div class="home-columns"><section><div class="section-heading"><div><p class="eyebrow">PASO A PASO, CON CONFIANZA</p><h2>Tu siguiente aprendizaje</h2></div>${link('aprende','Ver todos','text-link','arrow')}</div><div class="module-grid home-modules">${modules.slice(0,3).map(moduleCard).join('')}</div></section><aside class="journey"><span class="tile-icon mint">${icon('chart')}</span><h3>Tu preparación comienza aquí</h3><p>Cada recorrido es una oportunidad para aprender.</p><div class="progress-label"><strong>Avance educativo</strong><span>${met.progress}%</span></div><progress value="${met.progress}" max="100">${met.progress}%</progress><p class="small">${met.completed} de 8 recorridos realizados</p>${link(`leccion/${next.id}`,met.completed?'Continuar mi ruta':'Dar el primer paso','btn secondary')}<small>El progreso refleja actividades digitales, no competencia médica.</small></aside></div>
<section class="practice-banner"><div><span class="eyebrow">DEL CONOCIMIENTO A LAS DECISIONES</span><h2>¿Qué harías en esta situación?</h2><p>Practica en un entorno ficticio, con espacio para equivocarte y aprender.</p></div>${link('caso/deporte?demo=1','Probar una demo breve','btn primary','play')}</section>
<section class="how"><div><span>01</span><h3>Explora</h3><p>Comprende las señales y los límites de tu actuación.</p></div><div><span>02</span><h3>Decide</h3><p>Elige una respuesta y conoce su fundamento.</p></div><div><span>03</span><h3>Prepárate</h3><p>Repasa tus pendientes y organiza un plan.</p></div></section>${safety()}`;
}

function learn() {
  const list = filterModules(modules, filter, learnCategory);
  return `${header('CONOCIMIENTO QUE TE ACOMPAÑA','Aprende, paso a paso.','Recorridos breves con conceptos, señales de alarma, actividades y fuentes.')}<div class="toolbar"><label class="search">Buscar un módulo<input id="search" type="search" placeholder="RCP, quemaduras, preparación…" value="${esc(filter)}"></label><span class="tag">Contenido procedimental para adultos</span></div><div class="discovery-bar"><div class="filter-chips" role="group" aria-label="Filtrar módulos">${[['todos','Todos'],['auxilios','Primeros auxilios'],['preparacion','Prevención y planes']].map(([key,label])=>button('learn-category',label,'filter-chip',`data-category="${key}" aria-pressed="${learnCategory===key}"`)).join('')}</div><span class="result-count" role="status">${list.length} módulos</span></div><div class="module-grid">${list.map(moduleCard).join('')||'<p>No encontramos módulos con ese término.</p>'}</div>${safety()}`;
}

function lesson(id) {
  const m = byModule(id);
  if (!m) return notFound();
  return `${header('APRENDE / '+(['prevencion','simulacros'].includes(m.id)?'PREPARACIÓN':'ADULTOS'),m.title,m.subtitle,link('aprende','Todos los módulos','btn secondary','book'))}<div class="lesson-layout"><article class="lesson">${lessonCover(id)}<div class="lesson-meta"><span class="tile-icon ${m.color}">${icon(m.icon)}</span><span>${m.minutes} min aprox. · Versión ${m.version}</span></div><p><strong>Objetivo:</strong> ${m.objective}</p>${m.sections.map(([title,text],i)=>`<section class="lesson-section"><span class="step-no">${String(i+1).padStart(2,'0')}</span><div><h2>${title}</h2><p>${text}</p></div></section>`).join('')}${id==='rcp'?orderActivity():''}${sourcePanel(m.sources)}</article><aside class="sticky-panel"><p class="eyebrow">APRENDE A TU RITMO</p><h3>Comprueba lo aprendido</h3><p>Cuatro preguntas, retroalimentación por decisión y recomendaciones de repaso.</p>${link('evaluacion/'+id,'Iniciar evaluación','btn primary','play')}<p class="small">Completar la evaluación registra participación, incluso si necesitas repasar.</p>${link('caso/'+(scenarios.find(s=>s.module===id)?.id??'preparar'),'Practicar un caso','btn secondary','play')}<hr><p class="small">Verificación documental: ${m.verified}. Consulta las referencias del módulo.</p></aside></div>${safety()}`;
}

function orderActivity() {
  return `<section class="order-activity" aria-labelledby="order-title"><div class="activity-heading"><span class="tile-icon cobalt">${icon('flag')}</span><div><p class="eyebrow">TU TURNO · RETO DE SECUENCIA</p><h2 id="order-title">Ordena las decisiones iniciales</h2></div></div><p class="activity-instruction">Cambia la posición de las tarjetas con <strong>Subir</strong> y <strong>Bajar</strong>. En computadora también puedes arrastrarlas.</p><ol id="order-list" aria-label="Secuencia de decisiones para ordenar">${orderIds.map((id,index)=>{const card=orderCards.find(card=>card.id===id),right=orderResult?.positions[index];return `<li data-order="${id}" draggable="false" tabindex="-1" class="order-card ${orderResult?(right?'is-correct':'needs-review'):''}" aria-posinset="${index+1}" aria-setsize="3"><span class="order-position" aria-label="Posición ${index+1}">${index+1}</span><div class="order-card-copy"><h3>${card.title}</h3><p>${card.text}</p>${orderResult?`<span class="order-card-status">${right?'✓ En su lugar':'↔ Revisa su posición'}</span>`:''}</div><div class="order-controls"><button class="order-control" data-action="order-move" data-id="${id}" data-direction="-1" aria-label="Subir: ${card.title}" ${index===0?'disabled':''}>↑ <span>Subir</span></button><button class="order-control" data-action="order-move" data-id="${id}" data-direction="1" aria-label="Bajar: ${card.title}" ${index===2?'disabled':''}>↓ <span>Bajar</span></button></div><span class="drag-handle" aria-hidden="true">⠿</span></li>`;}).join('')}</ol><div class="activity-actions">${button('check-order','Comprobar orden','btn primary')}${button('reset-order','Reiniciar actividad','btn secondary')}</div><div id="order-feedback" class="${orderResult?'feedback '+(orderResult.correct?'positive':'review'):''}" role="status" aria-live="polite" aria-atomic="true">${orderResult?(orderResult.correct?'<strong>✓ ¡Buen razonamiento!</strong><p>La secuencia coincide con el módulo: reconocer con seguridad, activar ayuda e iniciar RCP según la formación.</p>':`<strong>↔ Puedes seguir ajustando</strong><p>${orderResult.correctCount} de 3 tarjetas están en su lugar. Revisa primero el entorno y las señales; después, la activación de ayuda y el inicio de RCP. Mueve las tarjetas y vuelve a comprobar.</p>`):''}</div>${orderResult?.correct?encouragementCard(orderEncouragement):''}<p class="activity-note">${icon('info')} Es un ejercicio de decisiones. No mide ni sustituye la práctica física de RCP.</p></section>`;
}

function refreshOrder(focusId = null, direction = null) {
  const section = document.querySelector('.order-activity');
  if (!section) return;
  section.outerHTML = orderActivity();
  if (focusId !== null) {
    const card = document.querySelector(`[data-order="${focusId}"]`);
    const button = card?.querySelector(`[data-direction="${direction}"]:not(:disabled)`) || card?.querySelector('button:not(:disabled)');
    (button || card)?.focus({
      preventScroll: true
    });
  }
}

function moveActivity(id, index, direction = null) {
  orderIds = moveOrder(orderIds, id, index);
  orderResult = null;
  orderEncouragement = null;
  refreshOrder(id, direction);
  notify('Tarjeta movida a la posición ' + (orderIds.indexOf(id) + 1) + '.');
}

function quizPage(id) {
  const m = byModule(id);
  if (!m) return notFound();
  if (!quiz || quiz.module !== id) {
    quiz = {
      module: id,
      questions: selectQuestions(m, state),
      index: 0,
      answers: {},
      selected: null,
      result: null
    };
  }
  if (quiz.result) {
    const a = quiz.result;
    return `${header('EVALUACIÓN / RESULTADO','Un paso más en tu aprendizaje.')}<section class="result-panel"><span class="result-number">${a.correct}<small> / ${a.total}</small></span><h2>Respuestas correctas en este intento</h2><p>${a.correct===a.total?'Has reconocido todas las decisiones de este recorrido.':'Revisa las explicaciones y vuelve a intentarlo a tu ritmo.'}</p><p>Participación educativa registrada. No equivale a certificación ni acredita capacidad para intervenir.</p>${encouragementCard(quiz.encouragement)}<div class="actions">${button('retry-quiz','Repetir evaluación','btn primary',`data-id="${id}"`)}${link('progreso','Ver mi progreso','btn secondary','chart')}</div></section>${quiz.questions.map(q=>`<details class="answer-review"><summary>${quiz.answers[q.id]===q.answer?'✓':'↻'} ${q.prompt}</summary><p>Tu respuesta: ${esc(q.options[quiz.answers[q.id]])}</p><p><strong>Respuesta esperada:</strong> ${q.options[q.answer]}</p><p>${q.explanation}</p></details>`).join('')}${sourcePanel(m.sources)}`;
  }
  const q = quiz.questions[quiz.index],
    answered = quiz.selected !== null;
  return `${header('EVALUACIÓN / '+m.title,'Cada decisión enseña.','Sin límite de tiempo. Puedes consultar el módulo y volver a intentarlo.')}<section class="question-panel"><div class="progress-label"><strong>Pregunta ${quiz.index+1} de ${quiz.questions.length}</strong><span>${q.level>=2?'Aplicación':'Fundamentos'}</span></div><progress value="${quiz.index}" max="${quiz.questions.length}"></progress><h2>${q.prompt}</h2><div class="options">${q.options.map((o,i)=>`<button class="option ${answered?(i===q.answer?'correct':i===quiz.selected?'incorrect':''):''}" data-action="answer" data-index="${i}" ${answered?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${o}${answered&&i===q.answer?'<strong> ✓ Esperada</strong>':''}</button>`).join('')}</div>${answered?`<div class="feedback ${q.answer===quiz.selected?'positive':'review'}" role="status"><strong>${q.answer===quiz.selected?'✓ Decisión adecuada':'↻ Una oportunidad de repaso'}</strong><p>${q.explanation}</p></div>${button('next-question',quiz.index===quiz.questions.length-1?'Ver resultado':'Siguiente pregunta','btn primary')}`:'<p class="small">Selecciona una respuesta para conocer el fundamento.</p>'}</section>${sourcePanel(m.sources)}`;
}

function simulator() {
  return `${header('PRÁCTICA CON SENTIDO','Una situación. Varias decisiones.','Historias ficticias con rutas de repaso. Se evalúa el razonamiento, nunca un desenlace clínico.',link('caso/deporte?demo=1','Demo guiada','btn primary','play'))}<div class="scenario-grid">${scenarios.map(scenarioCard).join('')}</div><div class="info-box">${icon('info')} Casos educativos para adultos, con explicaciones en cada decisión. Practica a tu ritmo, sin cuenta regresiva.</div>${safety()}`;
}

function casePage(id, demo) {
  const s = byScenario(id);
  if (!s) return notFound();
  if (!sim || sim.id !== id || sim.demo !== demo) sim = {
    id,
    demo,
    age: null,
    node: s.start,
    history: [],
    feedback: null,
    done: false,
    saved: false
  };
  if (!sim.age) return `${header('SIMULACIÓN / '+(demo?'DEMO GUIADA':'COMENZAR'),s.title,s.subtitle)}<section class="age-panel"><span class="tile-icon mint">${icon('play')}</span><h2>Simulación para adultos</h2><p>Recorre una situación ficticia, elige tu respuesta y descubre el fundamento de cada decisión. Sin límite de tiempo.</p>${button('age',icon('play')+'Comenzar simulación','btn primary','data-age="adult"')}</section>${sourcePanel(byModule(s.module).sources)}`;
  if (sim.done) {
    const summary = scenarioSummary(sim.history),
      correct = summary.correct;
    return `${header('SIMULACIÓN / RESULTADO','Tus decisiones, explicadas.')}<section class="result-panel"><span class="tile-icon mint">${icon('flag')}</span><h2>Has recorrido ${s.title.toLowerCase()}</h2><p>${correct} de ${s.coreSteps} decisiones iniciales adecuadas. ${summary.additional} decisiones adicionales de repaso.</p><p>Este resultado describe el aprendizaje digital. No predice supervivencia ni acredita habilidades físicas.</p>${encouragementCard(sim.encouragement)}<div class="actions">${button('retry-case','Volver a practicar','btn primary',`data-id="${id}"`)}${link('progreso','Mi progreso','text-link','chart')}</div></section><div class="timeline">${sim.history.map((h,i)=>`<article><span>${i+1}</span><div><h3>${esc(h.title)}</h3><p>Elegiste: ${esc(h.choice)}</p><p><strong>${h.correct?'✓ Decisión adecuada':'↻ Repaso necesario'}</strong> · ${esc(h.feedback)}</p></div></article>`).join('')}</div>${sourcePanel(byModule(s.module).sources)}`;
  }
  const n = s.nodes[sim.node],
    count = scenarioSummary(sim.history).explored;
  return `${header('SIMULACIÓN / ADULTOS'+(demo?' / DEMO GUIADA':''),s.title)}<div class="case-layout"><section class="case-main">${sceneArt(s.id)}<div class="question-panel"><div class="progress-label"><span class="tag">${sim.node.startsWith('review')?'RUTA DE REPASO':'DECISIÓN '+decisionNumber(sim.node,s.coreSteps)+' / '+s.coreSteps}</span><span>Sin límite de tiempo</span></div><div class="decision-track" aria-label="Decisión ${decisionNumber(sim.node,s.coreSteps)} de ${s.coreSteps}">${Array.from({length:s.coreSteps},(_,i)=>`<span class="${i<count?'is-visited':''} ${i===decisionNumber(sim.node,s.coreSteps)-1?'is-current':''}" aria-hidden="true">${i+1}</span>`).join('')}</div><h2>${n.title}</h2><p class="narrative">${n.text}</p><div class="options">${n.options.map((o,i)=>`<button class="option ${sim.feedback&&sim.feedback.index===i?(o.correct?'correct':'incorrect'):''}" data-action="decide" data-index="${i}" ${sim.feedback?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${o.text}</button>`).join('')}</div>${sim.feedback?`<div class="feedback ${sim.feedback.correct?'positive':'review'}" role="status"><strong>${sim.feedback.correct?'✓ Fundamento':'↻ Revisa esta decisión'}</strong><p>${sim.feedback.feedback}</p></div>${button('continue-case',sim.feedback.next==='end'?'Ver mi razonamiento':'Continuar el caso','btn primary')}`:''}</div></section><aside class="sticky-panel"><span class="tile-icon mint">${icon('play')}</span><h3>Practica el razonamiento</h3><p>Una elección que necesita repaso abre una ruta adicional para reconsiderar las señales.</p><progress value="${count}" max="${s.coreSteps}"></progress><p class="small">${count} de ${s.coreSteps} situaciones principales exploradas</p>${demo?'<div class="demo-tip"><strong>Recorrido de feria</strong><p>Selecciona, lee el fundamento, continúa y muestra el resumen. Después abre los contactos.</p></div>':''}${link('leccion/'+s.module,'Consultar el módulo','text-link','book')}</aside></div>${sourcePanel(byModule(s.module).sources)}`;
}

function preparation() {
  const items = [...checklistDefaults[checkKind], ...state.custom[checkKind]],
    checked = state.checks[checkKind],
    plan = state.plans[checkKind],
    count = items.filter((_, i) => checked.includes(i)).length;
  return `${header('ORGANIZA LOS SIGUIENTES PASOS','Prepararse es un trabajo en equipo.','Registra acuerdos educativos y revisa pendientes con los responsables. No sustituye el plan aprobado.',button('print','Imprimir reporte','btn secondary'))}<div class="tabs" role="group" aria-label="Tipo de plan">${['escolar','familiar'].map(kind=>button('check-kind',kind==='escolar'?'Plan escolar':'Plan familiar',`tab ${kind===checkKind?'active':''}`,`data-kind="${kind}" aria-pressed="${kind===checkKind}"`)).join('')}</div><div class="prepare-grid"><section class="panel"><div class="section-heading"><h2>Lista de preparación</h2><strong id="check-count">${count}/${items.length}</strong></div><progress id="check-progress" value="${count}" max="${items.length}"></progress><div class="checklist">${items.map((text,i)=>`<label><input type="checkbox" data-check="${i}" ${checked.includes(i)?'checked':''}><span>${esc(text)}</span></label>`).join('')}</div><form id="custom-check" class="inline-form"><label>Actividad adicional<input name="activity" required maxlength="180" placeholder="Añadir un acuerdo…"></label><button class="btn secondary" type="submit">Añadir</button></form><p class="small">El porcentaje refleja casillas marcadas, no una evaluación oficial de seguridad.</p><div id="check-encouragement" role="status" aria-live="polite">${count===items.length&&items.length?encouragementCard(checkEncouragements[checkKind]):''}</div></section><section class="panel"><h2>Acuerdos del plan ${checkKind}</h2><p>Registra solo indicaciones revisadas por los responsables. Evita nombres personales y ubicaciones privadas.</p><form id="plan-form"><label>Ruta acordada<input name="route" maxlength="240" value="${esc(plan.route)}" placeholder="Descripción general de la ruta aprobada"></label><label>Punto de reunión<input name="meeting" maxlength="200" value="${esc(plan.meeting)}"></label><label>Responsable (rol, sin nombre)<input name="role" maxlength="120" value="${esc(plan.role)}" placeholder="Coordinación de brigada"></label><label>Estado del acuerdo<select name="status"><option value="borrador" ${plan.status!=='revisado'?'selected':''}>Borrador pendiente</option><option value="revisado" ${plan.status==='revisado'?'selected':''}>Revisado por responsables (declarado por usuario)</option></select></label><label>Comunicación y apoyos<textarea name="notes" maxlength="800">${esc(plan.notes)}</textarea></label><button class="btn primary" type="submit">Guardar acuerdos localmente</button></form></section></div><section class="panel"><h2>Registro de ejercicios</h2><p>Documenta prácticas supervisadas. No incluyas datos de pacientes ni de menores.</p><form id="drill-form" class="form-grid"><label>Tipo<select name="type"><option>Sismo</option><option>Incendio</option><option>Accidente escolar</option></select></label><label>Fecha<input name="date" type="date" required></label><label>Lugar general<input name="place" maxlength="160" placeholder="Patio del colegio" required></label><label>Observaciones<textarea name="observations" maxlength="1200" required></textarea></label><label>Aspectos por mejorar<textarea name="improve" maxlength="1200" required></textarea></label><div><button class="btn primary" type="submit">Guardar ejercicio</button></div></form><div class="drill-list">${state.drills.length?state.drills.slice().reverse().map(d=>`<article><span class="tag">${esc(d.type)} · ${esc(d.date)}</span><h3>${esc(d.place)}</h3><p>${esc(d.observations)}</p><p><strong>Mejoras:</strong> ${esc(d.improve)}</p>${button('remove-drill','Eliminar este registro','mini',`data-id="${esc(d.id)}"`)}</article>`).join(''):'<p class="empty">Todavía no has guardado ejercicios.</p>'}</div></section>${sourcePanel(['family','ready','minedu'])}`;
}

function prevention() {
  return `${header('PREVENIR TAMBIÉN ES ACTUAR','Menos pendientes. Más preparación.','Identifica riesgos y convierte los acuerdos en acciones concretas.')}<div class="prevention-grid">${[['home','En casa','Revisa muebles, salidas y los acuerdos del plan familiar.'],['book','En el colegio','Conoce rutas aprobadas, brigadas y responsables de comunicación.'],['shield','En espacios compartidos','Identifica peligros y comunica las mejoras a los responsables.'],['flag','En familia','Acuerda roles, recursos y un punto de reunión.']].map(([i,t,p])=>`<article class="panel"><span class="tile-icon mint">${icon(i)}</span><h2>${t}</h2><p>${p}</p>${link('preparacion','Revisar mi plan','text-link')}</article>`).join('')}</div><section class="practice-banner"><div><h2>¿Ya sabes qué revisar?</h2><p>Explora el módulo y comprueba tus decisiones con cuatro preguntas.</p></div>${link('leccion/prevencion','Aprender prevención','btn primary','book')}</section>${sourcePanel(['family','ready','minedu'])}`;
}

function progress() {
  const met = metrics(state, modules),
    recs = recommend(state, modules);
  return `${header('TU RUTA, A TU RITMO','Cada actividad cuenta.','Tu historial vive en este navegador. No se sincroniza; puede perderse al borrar los datos o cambiar de dispositivo.',button('export','Exportar mis datos','btn secondary'))}<div class="stats-row"><div><strong>${met.completed}/8</strong><span>Recorridos realizados</span></div><div><strong>${met.total}</strong><span>Preguntas contestadas</span></div><div><strong>${met.percent}%</strong><span>Aciertos educativos</span></div><div><strong>${state.scenarios.length}</strong><span>Escenarios completados</span></div></div><div class="info-box">${icon('info')} Estas métricas describen actividades y conocimientos dentro de ACTÚA. No certifican habilidades prácticas ni capacidad de respuesta médica.</div><div class="prepare-grid"><section class="panel"><h2>Tu ruta recomendada</h2><p>Se priorizan errores del último intento, repasos después de siete días y temas por explorar.</p>${recs.slice(0,4).map(m=>`<a href="#/leccion/${m.id}" class="recommendation"><span class="tile-icon ${m.color}">${icon(m.icon)}</span><span><strong>${m.title}</strong><small>${m.reason}</small></span>${icon('arrow')}</a>`).join('')}</section><section class="panel"><h2>Competencias educativas</h2>${modules.map(m=>{const a=state.attempts.filter(a=>a.module===m.id).at(-1);return `<div class="competence"><strong>${m.title}</strong><span>${a?`${a.correct}/${a.total} en último intento`:'Por explorar'}</span><progress value="${a?.correct??0}" max="${a?.total||4}"></progress></div>`;}).join('')}</section></div><section class="panel"><h2>Insignias de participación</h2><div class="badges">${[[met.completed>0,'Primer recorrido'],[met.completed>=6,'Explorador de primeros auxilios'],[!!state.completed.simulacros,'Preparación escolar'],[!!state.completed.prevencion,'Aprendizaje preventivo']].map(([ok,t])=>`<div class="badge ${ok?'earned':''}">${icon(ok?'check':'flag')}<strong>${t}</strong><small>${ok?'Obtenida por participación':'Por descubrir'}</small></div>`).join('')}</div></section><section class="panel"><h2>Historial de evaluaciones</h2>${state.attempts.length?`<div class="table-wrap"><table><thead><tr><th>Módulo</th><th>Fecha</th><th>Respuestas correctas</th></tr></thead><tbody>${state.attempts.slice(-20).reverse().map(a=>`<tr><td>${esc(byModule(a.module)?.title??a.module)}</td><td>${esc(new Date(a.date).toLocaleString('es-PE'))}</td><td>${a.correct}/${a.total}</td></tr>`).join('')}</tbody></table></div>`:'<p class="empty">Tu primera evaluación aparecerá aquí.</p>'}</section><section class="panel"><h2>Privacidad y preferencias</h2><p>No pedimos cuentas, ubicación, datos médicos ni nombres de pacientes. Los datos de actividad permanecen en tu dispositivo; el alojamiento puede mantener sus propios registros técnicos de acceso.</p><label class="switch"><input type="checkbox" id="large-text" ${state.settings.large?'checked':''}> Texto más grande</label><div class="actions">${button('print','Imprimir reporte educativo','btn secondary')}${button('reset-request','Borrar mis datos de ACTÚA','btn danger')}</div><div id="reset-confirm"></div></section>`;
}

function contactCard(c) {
  return `<article class="service-card ${c.primary?'priority-service':''}" data-contact="${c.number}"><div class="service-top"><span class="tile-icon ${c.color}">${icon(c.icon)}</span><span class="service-label">${c.label}</span></div><div class="service-identity"><strong class="service-number">${c.number}</strong><div><h3>${c.name}</h3><p>${c.institution}</p></div></div><p class="service-description">${c.description}</p><p class="service-note">${c.note}</p><a class="btn ${c.primary?'primary':'secondary'}" href="tel:${c.number}" aria-label="Llamar a ${c.name} al ${c.number}">${icon('phone')} Llamar al ${c.number}</a><details class="contact-source"><summary>Fuente oficial y fecha</summary><a href="${c.source}" target="_blank" rel="noopener noreferrer">${c.sourceTitle} ↗</a><p>Consulta: ${CONTACTS_VERIFIED}</p></details></article>`;
}

function contacts() {
  const list=filterContacts(contactQuery,contactCategory), urgent=list.filter(c=>c.primary), others=list.filter(c=>!c.primary);
  return `${header('CONTACTOS ESENCIALES / PERÚ','Emergencias Perú.','Contactos oficiales para pedir ayuda y recibir orientación.')}<nav class="quick-numbers directory-quick" aria-label="Números prioritarios">${emergencyContacts.filter(c=>c.primary).map(c=>`<a href="tel:${c.number}" aria-label="Llamar a ${c.name} al ${c.number}"><span>${icon(c.icon)}${c.name}</span><strong>${c.number}</strong></a>`).join('')}</nav><p class="directory-intro">Tocar «Llamar» abre la función telefónica de tu dispositivo. ACTÚA no inicia llamadas automáticas, no conecta con operadores ni envía unidades.</p><details class="directory-tools" id="contact-tools" ${contactToolsOpen?'open':''}><summary>Buscar o filtrar contactos <span>${list.length} disponibles</span></summary><div><label class="search">Buscar por número, institución o situación<input type="search" id="contact-search" value="${esc(contactQuery)}" placeholder="106, Bomberos, violencia…"></label><div class="filter-chips" role="group" aria-label="Filtrar contactos">${contactCategories.map(([key,label])=>button('contact-category',label,'filter-chip',`data-category="${key}" aria-pressed="${contactCategory===key}"`)).join('')}</div><p class="result-count" role="status">${list.length} ${list.length===1?'contacto disponible':'contactos disponibles'}</p></div></details>${urgent.length?`<section class="directory-section"><div class="section-heading"><div><p class="eyebrow">CENTRALES DE EMERGENCIA</p><h2>Para solicitar ayuda inmediata</h2></div></div><div class="directory-grid">${urgent.map(contactCard).join('')}</div></section>`:''}${others.length?`<section class="directory-section"><div class="section-heading"><div><p class="eyebrow">SEGÚN LO QUE NECESITES</p><h2>Otros servicios que conviene conocer</h2></div></div><div class="directory-grid">${others.map(contactCard).join('')}</div></section>`:''}${!list.length?'<div class="empty panel"><h2>No encontramos ese contacto</h2><p>Prueba con otro número o selecciona «Todos».</p></div>':''}<section class="panel call-guide"><div><span class="tile-icon mint">${icon('info')}</span><h2>Al comunicar una emergencia</h2><p>Indica la ubicación o una referencia, explica qué ocurrió y sigue las instrucciones del operador. Usa las líneas con responsabilidad.</p></div><div><h3>Elige la línea adecuada</h3><p>La Línea 113 ofrece orientación en salud y la Línea 100 atención ante violencia. Una emergencia médica corresponde al 106; el peligro policial inmediato, al 105.</p><p class="small">La cobertura operativa de SAMU depende de la localidad. Los números de serenazgo cambian según el distrito; consulta a tu municipalidad.</p></div></section><div class="directory-bottom">${button('save-contacts',icon('download')+'Guardar directorio','btn secondary')}${button('print','Imprimir esta vista','btn secondary')}<p class="small">Directorio verificado documentalmente el ${CONTACTS_VERIFIED}. Cada tarjeta enlaza su fuente oficial.</p></div>`;
}

function science() {
  return `${header('TRANSPARENCIA POR DISEÑO','Fuentes y rigor científico.','Puedes comprobar de dónde procede cada contenido, su versión y la fecha de consulta.')}<div class="review-status"><span class="tile-icon amber">${icon('source')}</span><div><h2>Cada aprendizaje tiene una referencia</h2><p>Consulta las guías oficiales que sustentan los módulos. Verificación documental: ${VERIFIED}. Las fuentes, sus fechas y las diferencias entre recomendaciones permanecen disponibles para que puedas revisarlas.</p></div></div><section class="panel"><h2>Registro de módulos</h2><div class="table-wrap"><table><thead><tr><th>Módulo / versión</th><th>Fuentes</th><th>Verificación documental</th></tr></thead><tbody>${modules.map(m=>`<tr><td><a href="#/leccion/${m.id}">${m.title}</a><br><small>v${m.version}</small></td><td>${m.sources.map(id=>bySource(id).institution).filter((v,i,a)=>a.indexOf(v)===i).join(' · ')}</td><td>${m.verified}</td></tr>`).join('')}</tbody></table></div></section><section class="panel"><h2>Biblioteca de referencias</h2><p>«No informada» significa que la fuente consultada no mostró una fecha de modificación. No equivale a la fecha de consulta.</p>${sources.map(s=>`<details class="reference"><summary>${s.institution} · ${s.title}</summary><p>Publicación: ${s.year??'año no visible'} · Última actualización disponible: ${s.updated??'no informada'}<br>Última verificación: ${s.verified}<br>Método: ${s.access}</p><a href="${s.url}" target="_blank" rel="noopener noreferrer">Consultar documento oficial ↗</a></details>`).join('')}</section><section class="panel"><h2>Diferencias y límites documentados</h2>${conflicts.map(c=>`<details class="reference"><summary>${c.title}</summary><p>${c.text}</p></details>`).join('')}<p>Las páginas gob.pe no se pudieron abrir directamente (HTTP 418). Se consultaron textos indexados oficiales. La guía detallada MINEDU 2026 localizada devolvió 403 y no se utilizó para redactar procedimientos.</p></section><section class="panel"><h2>Mantenimiento y propuestas de revisión</h2><p>El código incluye un monitor manual de enlaces y huellas de contenido. Crea un reporte de cambios y errores para revisión; no cambia ninguna recomendación médica. No hay monitor automático en este sitio estático.</p><form id="review-form"><label>Fuente<select name="source">${sources.map(s=>`<option value="${s.id}">${s.institution} · ${s.title}</option>`).join('')}</select></label><label>Observación para revisar (solo en este dispositivo)<textarea name="note" required maxlength="1000" placeholder="Describe el cambio y dónde lo encontraste. No incluyas datos médicos personales."></textarea></label><button class="btn secondary" type="submit">Añadir a mi cola local de revisión</button></form>${state.reviewQueue.length?`<h3>Cola local · sin enviar</h3>${state.reviewQueue.map(r=>`<div class="queue-item"><strong>${esc(bySource(r.source)?.title)}</strong><p>${esc(r.note)}</p><small>${esc(r.date)} · Pendiente. No enviada a un profesional.</small></div>`).join('')}`:'<p class="small">No hay observaciones locales.</p>'}</section><section class="about"><h2>Una idea para aprender y preparar a la comunidad.</h2><p>Un espacio abierto para que estudiantes, docentes y familias aprendan a reconocer situaciones y organizar su preparación.</p><div class="ods"><span><b>3</b> SALUD Y BIENESTAR</span><span><b>4</b> EDUCACIÓN DE CALIDAD</span></div><p>ACTÚA contribuye a la educación preventiva y al acceso a recursos de aprendizaje. No se ha estudiado su efecto sobre resultados clínicos ni reducción de mortalidad.</p></section>`;
}

function notFound() {
  return `${header('PÁGINA NO ENCONTRADA','Volvamos a un lugar conocido.')} ${link('inicio','Ir al inicio','btn primary')}`;
}

function render() {
  const [path, query = ''] = (location.hash.slice(2) || 'inicio').split('?'), [route, id] = path.split('/');
  const demo = new URLSearchParams(query).get('demo') === '1';
  let html;
  try {
    html = route === 'inicio' ? home() : route === 'aprende' ? learn() : route === 'leccion' ? lesson(id) : route === 'evaluacion' ? quizPage(id) : route === 'simulador' ? simulator() : route === 'caso' ? casePage(id, demo) : route === 'preparacion' ? preparation() : route === 'prevencion' ? prevention() : route === 'progreso' ? progress() : route === 'contactos' ? contacts() : route === 'fuentes' ? science() : notFound();
  } catch (error) {
    console.error(error);
    html = header('ERROR DE VISTA', 'No se pudo abrir esta actividad.', 'Vuelve al inicio y repite el recorrido.') + link('inicio', 'Ir al inicio');
  }
  const active = route === 'leccion' || route === 'evaluacion' ? 'aprende' : route === 'caso' ? 'simulador' : route;
  document.body.classList.toggle('large', state.settings.large);
  $('#app').innerHTML = `<aside class="sidebar ${mobileMenu?'open':''}" aria-label="Menú principal"><a class="brand" href="#/inicio"><img src="./assets/icon.svg" alt="" width="38" height="38"><span>ACTÚA<small>APRENDE. PREPÁRATE. ACTÚA.</small></span></a><p class="nav-caption">TU CENTRO DE APRENDIZAJE</p><nav>${routes.filter(([r])=>r!=='contactos').map(([r,t,i])=>`<a href="#/${r}" ${r===active?'aria-current="page"':''}>${icon(i)}${t}${r===active?'<span class="nav-dot"></span>':''}</a>`).join('')}</nav><div class="sidebar-bottom"><div class="pilot"><span class="status-dot"></span> PILOTO EDUCATIVO <small>v1.4 · Aprende a tu ritmo</small></div></div></aside><div class="shell"><header class="topbar">${button('menu',icon('menu')+'<span class="sr-only">Abrir o cerrar menú</span>','menu-btn','aria-expanded="'+mobileMenu+'"')}<div class="breadcrumb">Mi espacio <span>/</span> <strong>${routes.find(r=>r[0]===active)?.[1]??(route==='contactos'?'Contactos de emergencia':'ACTÚA')}</strong></div><div class="top-actions">${button('motion','<span aria-hidden="true">✦</span><span class="motion-label">Animaciones</span><span class="motion-state">'+(state.settings.motion?'Sí':'No')+'</span>','motion-toggle','aria-pressed="'+state.settings.motion+'" aria-label="Animaciones: '+(state.settings.motion?'activadas. Desactivar':'desactivadas. Activar')+'" title="Las animaciones respetan el movimiento reducido de tu dispositivo"')}<span class="connection ${navigator.onLine?'':'offline'}">● <span>${navigator.onLine?'Aprende a tu ritmo':'Sin conexión · revisa las fechas'}</span></span><a href="#/contactos" class="quick-emergency" ${route==='contactos'?'aria-current="page"':''} aria-label="Ver números de emergencia del Perú">${icon('phone')}<span>Emergencias</span></a><a class="avatar" aria-label="Ver mi progreso" href="#/progreso">A</a></div></header><main id="main" data-page="${active}" tabindex="-1">${!persistent?'<div class="storage-warning" role="alert">Almacenamiento no disponible. El progreso solo se mantiene durante esta sesión.</div>':''}${!navigator.onLine?'<div class="storage-warning">Contenido almacenado sin conexión: puede estar desactualizado. Verifica fuentes cuando recuperes conexión.</div>':''}${html}</main><footer><span>ACTÚA · Aprende hoy. Prepárate para actuar.</span><a href="#/fuentes">Fuentes y fechas · ${VERIFIED}</a><span>Hecho para aprender, sin registro.</span></footer></div>`;
  mountMotion($('#main'), { enabled: state.settings.motion, viewKey: path + ':' + (route==='inicio'?startMode:route==='aprende'?learnCategory:route==='contactos'?contactCategory:'') + ':' + (quiz ? quiz.index + ':' + !!quiz.result : sim ? sim.node + ':' + sim.done + ':' + sim.age : '') });
  document.title = `${route==='leccion'?byModule(id)?.title:routes.find(r=>r[0]===active)?.[1]??'Contactos'} · ACTÚA`;
}

function goNextQuiz() {
  if (quiz.index < quiz.questions.length - 1) {
    quiz.index++;
    quiz.selected = null;
  } else {
    quiz.result = recordAttempt(state, quiz.module, quiz.answers, quiz.questions);
    quiz.encouragement = nextEncouragement();
    persist();
  }
  render();
  focusView('.question-panel h2, .result-panel h2');
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (e.target.closest('.skip')) {
    e.preventDefault();
    document.querySelector('#main').focus();
    return;
  }
  if (!el) return;
  const action = el.dataset.action;
  if (action === 'start-mode' && startModes[el.dataset.mode]) {
    startMode=el.dataset.mode; render(); document.querySelector(`[data-mode="${startMode}"]`).focus({preventScroll:true}); return;
  }
  if (action === 'learn-category') {
    learnCategory=el.dataset.category; render(); document.querySelector(`[data-action="learn-category"][data-category="${learnCategory}"]`).focus({preventScroll:true}); return;
  }
  if (action === 'contact-category') {
    contactCategory=el.dataset.category; contactToolsOpen=true; render(); document.querySelector(`[data-action="contact-category"][data-category="${contactCategory}"]`).focus({preventScroll:true}); return;
  }
  if (action === 'save-contacts') {
    const blob=new Blob([contactDirectoryText()],{type:'text/plain;charset=utf-8'}), url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url; a.download='ACTUA-contactos-Peru.txt'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),2000); return;
  }
  if (action === 'motion') {
    state.settings.motion = !state.settings.motion;
    persist();
    render();
    document.querySelector('[data-action="motion"]').focus({preventScroll:true});
    return;
  }
  if (action === 'menu') {
    mobileMenu = !mobileMenu;
    render();
    return;
  }
  if (action === 'answer' && quiz && quiz.selected === null) {
    quiz.selected = Number(el.dataset.index);
    quiz.answers[quiz.questions[quiz.index].id] = quiz.selected;
    render();
    focusView('.feedback');
  }
  if (action === 'next-question' && quiz && quiz.selected !== null) goNextQuiz();
  if (action === 'retry-quiz') {
    quiz = null;
    render();
  }
  if (action === 'age' && sim && el.dataset.age === 'adult') {
    sim.age = 'adult';
    render();
    focusView('.question-panel h2');
  }
  if (action === 'decide' && sim && !sim.feedback) {
    const s = byScenario(sim.id),
      index = Number(el.dataset.index),
      o = nextNode(s, sim.node, index);
    sim.feedback = {
      ...o,
      index
    };
    sim.history.push({
      node: sim.node,
      title: s.nodes[sim.node].title,
      choice: o.text,
      correct: o.correct,
      feedback: o.feedback
    });
    render();
    focusView('.feedback');
  }
  if (action === 'continue-case' && sim?.feedback) {
    if (sim.feedback.next === 'end') {
      sim.done = true;
      if (!sim.saved) {
        sim.encouragement = nextEncouragement();
        state.scenarios.push({
          id: sim.id,
          date: new Date().toISOString(),
          decisions: sim.history.map(h => ({
            node: h.node,
            correct: h.correct
          }))
        });
        state.scenarios = state.scenarios.slice(-1000);
        sim.saved = true;
        persist();
      }
    } else sim.node = sim.feedback.next;
    sim.feedback = null;
    render();
    focusView('.question-panel h2, .result-panel h2');
  }
  if (action === 'retry-case') {
    sim = null;
    render();
  }
  if (action === 'check-kind') {
    checkKind = el.dataset.kind;
    render();
  }
  if (action === 'order-move') {
    const id = Number(el.dataset.id),
      direction = Number(el.dataset.direction);
    moveActivity(id, orderIds.indexOf(id) + direction, direction);
  }
  if (action === 'check-order') {
    orderResult = evaluateOrder(orderIds);
    if (orderResult.correct && !orderEncouragement) { orderEncouragement=nextEncouragement(); persist(); }
    refreshOrder();
    focusView('#order-feedback');
  }
  if (action === 'reset-order') {
    orderIds = initialOrder();
    orderResult = null;
    orderEncouragement = null;
    refreshOrder(orderIds[0], 1);
    notify('Actividad reiniciada. Puedes ordenar las tres tarjetas otra vez.');
  }
  if (action === 'print') window.print();
  if (action === 'export') {
    const blob = new Blob([JSON.stringify({
        app: 'ACTÚA',
        version: APP_VERSION,
        exported: new Date().toISOString(),
        ...state
      }, null, 2)], {
        type: 'application/json'
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = url;
    a.download = 'ACTUA-progreso-educativo.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    notify('Datos exportados. El archivo contiene tus registros locales.');
  }
  if (action === 'reset-request') {
    $('#reset-confirm').innerHTML = `<div class="feedback review"><p>Se borrarán progreso, planes, ejercicios y observaciones de este navegador. Esta acción no se puede deshacer.</p>${button('reset-confirm','Confirmar borrado local','btn danger')} ${button('reset-cancel','Cancelar','btn secondary')}</div>`;
  }
  if (action === 'reset-cancel') $('#reset-confirm').innerHTML = '';
  if (action === 'reset-confirm') {
    state = freshState();
    quiz = null;
    sim = null;
    persist();
    render();
    notify('Se borraron los datos locales de ACTÚA.');
  }
  if (action === 'remove-drill') {
    state.drills = state.drills.filter(d => d.id !== el.dataset.id);
    persist();
    render();
    notify('Registro eliminado.');
  }
});
document.addEventListener('toggle', e => { if (e.target.id === 'contact-tools') contactToolsOpen=e.target.open; },true);

document.addEventListener('input', e => {
  if (e.target.id === 'contact-search') {
    contactQuery=e.target.value; contactToolsOpen=true; const position=e.target.selectionStart; render(); $('#contact-search').focus(); $('#contact-search').setSelectionRange(position,position); return;
  }
  if (e.target.id === 'search') {
    filter = e.target.value;
    const start = e.target.selectionStart;
    render();
    $('#search').focus();
    $('#search').setSelectionRange(start, start);
  }
});
document.addEventListener('change', e => {
  if (e.target.dataset.check !== undefined) {
    const index = Number(e.target.dataset.check),
      set = new Set(state.checks[checkKind]),
      items = checklistDefaults[checkKind].length + state.custom[checkKind].length,
      wasComplete = set.size === items;
    e.target.checked ? set.add(index) : set.delete(index);
    state.checks[checkKind] = [...set];
    if (set.size === items && items > 0 && !wasComplete) checkEncouragements[checkKind]=nextEncouragement();
    else if (set.size < items) checkEncouragements[checkKind]=null;
    persist();
    $('#check-count').textContent = `${set.size}/${items}`;
    $('#check-progress').value = set.size;
    $('#check-encouragement').innerHTML=set.size===items?encouragementCard(checkEncouragements[checkKind]):'';
  }
  if (e.target.id === 'large-text') {
    state.settings.large = e.target.checked;
    persist();
    document.body.classList.toggle('large', e.target.checked);
  }
});
document.addEventListener('submit', e => {
  const f = e.target;
  if (!['custom-check', 'plan-form', 'drill-form', 'review-form'].includes(f.id)) return;
  e.preventDefault();
  const data = Object.fromEntries(new FormData(f));
  for (const k in data) data[k] = String(data[k]).trim();
  if (f.id === 'custom-check') {
    if (!data.activity) return;
    if (state.custom[checkKind].length >= 30) {
      notify('Máximo de 30 actividades adicionales por plan.');
      return;
    }
    state.custom[checkKind].push(data.activity.slice(0, 180));
  }
  if (f.id === 'plan-form') state.plans[checkKind] = {
    route: data.route.slice(0, 240),
    meeting: data.meeting.slice(0, 200),
    role: data.role.slice(0, 120),
    status: data.status === 'revisado' ? 'revisado' : 'borrador',
    notes: data.notes.slice(0, 800)
  };
  if (f.id === 'drill-form') {
    if (!data.date || !data.place || !data.observations || !data.improve) return;
    state.drills.push({
      id: crypto.randomUUID(),
      type: data.type,
      date: data.date,
      place: data.place.slice(0, 160),
      observations: data.observations.slice(0, 1200),
      improve: data.improve.slice(0, 1200)
    });
  }
  if (f.id === 'review-form') {
    if (!data.note) return;
    state.reviewQueue.push({
      source: data.source,
      note: data.note.slice(0, 1000),
      date: new Date().toISOString(),
      status: 'pendiente'
    });
  }
  persist();
  render();
  notify('Guardado en este navegador.');
});
window.addEventListener('hashchange', () => {
  mobileMenu = false;
  quiz = null;
  sim = null;
  render();
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
  $('#main').focus({
    preventScroll: true
  });
});
window.addEventListener('online', render);
window.addEventListener('offline', render);
render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {
  notify('No se pudo activar la caché sin conexión. La aplicación sigue disponible con internet.');
});

function clearOrderDrag(){orderDrag=null;document.querySelectorAll('.dragging,.drop-target').forEach(item=>item.classList.remove('dragging','drop-target'));}
document.addEventListener('pointerdown',event=>{
  const card=event.target.closest?.('#order-list [data-order]');
  if(!card||event.target.closest('button')||event.button!==0)return;
  if(event.pointerType==='touch'&&!event.target.closest('.drag-handle'))return;
  orderDrag={id:Number(card.dataset.order),pointerId:event.pointerId,x:event.clientX,y:event.clientY,active:false,targetIndex:orderIds.indexOf(Number(card.dataset.order))};
  card.setPointerCapture?.(event.pointerId);
  event.preventDefault();
});
document.addEventListener('pointermove',event=>{
  if(!orderDrag||event.pointerId!==orderDrag.pointerId)return;
  if(!orderDrag.active&&Math.hypot(event.clientX-orderDrag.x,event.clientY-orderDrag.y)<7)return;
  orderDrag.active=true;
  document.querySelector(`[data-order="${orderDrag.id}"]`)?.classList.add('dragging');
  const destination=document.elementFromPoint(event.clientX,event.clientY)?.closest('#order-list [data-order]');
  document.querySelectorAll('.drop-target').forEach(item=>item.classList.remove('drop-target'));
  if(destination){orderDrag.targetIndex=orderIds.indexOf(Number(destination.dataset.order));destination.classList.add('drop-target');}
});
document.addEventListener('pointerup',event=>{
  if(!orderDrag||event.pointerId!==orderDrag.pointerId)return;
  const drag=orderDrag;clearOrderDrag();
  if(drag.active)moveActivity(drag.id,drag.targetIndex);
});
document.addEventListener('pointercancel',clearOrderDrag);
window.addEventListener('blur',clearOrderDrag);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && mobileMenu) {
    mobileMenu = false;
    render();
    document.querySelector(".menu-btn")?.focus();
  }
});
