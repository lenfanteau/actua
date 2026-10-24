export const STORAGE_KEY = 'actua:v1';
export const freshState = () => ({
  schema: 1,
  completed: {},
  attempts: [],
  scenarios: [],
  checks: {
    escolar: [],
    familiar: []
  },
  custom: {
    escolar: [],
    familiar: []
  },
  plans: {
    escolar: {},
    familiar: {}
  },
  drills: [],
  settings: {
    large: false,
    motion: true
  },
  reviewQueue: []
});
export function sanitizeState(raw) {
  const base = freshState();
  if (!raw || raw.schema !== 1) return base;
  const object = v => v && typeof v === 'object' && !Array.isArray(v);
  for (const key of ['completed', 'checks', 'custom', 'plans', 'settings'])
    if (object(raw[key])) base[key] = {
      ...base[key],
      ...raw[key]
    };
  for (const key of ['attempts', 'scenarios', 'drills', 'reviewQueue'])
    if (Array.isArray(raw[key])) base[key] = raw[key].filter(object).slice(-1000);
  for (const kind of ['escolar', 'familiar']) {
    base.checks[kind] = Array.isArray(base.checks[kind]) ? base.checks[kind].filter(Number.isInteger) : [];
    base.custom[kind] = Array.isArray(base.custom[kind]) ? base.custom[kind].filter(x => typeof x === 'string').slice(0, 30).map(x => x.slice(0, 180)) : [];
    if (!object(base.plans[kind])) base.plans[kind] = {};
  }
  base.settings.large = base.settings.large === true;
  base.settings.motion = base.settings.motion !== false;
  return base;
}
export function loadState(storage) {
  try {
    return {
      state: sanitizeState(JSON.parse(storage.getItem(STORAGE_KEY))),
      persistent: true
    };
  } catch {
    return {
      state: freshState(),
      persistent: false
    };
  }
}
export function saveState(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
export function evaluateQuestion(question, index) {
  return {
    correct: question.answer === index,
    explanation: question.explanation
  };
}
export function recordAttempt(state, module, answers, questions, now = new Date().toISOString()) {
  const valid = questions.filter(q => Number.isInteger(answers[q.id]));
  const correct = valid.filter(q => q.answer === answers[q.id]).length;
  const attempt = {
    id: globalThis.crypto?.randomUUID?.() ?? `${now}-${state.attempts.length}`,
    module,
    date: now,
    correct,
    total: valid.length,
    errors: valid.filter(q => q.answer !== answers[q.id]).map(q => q.id),
    level: Math.max(1, ...valid.map(q => q.level))
  };
  state.attempts.push(attempt);
  state.attempts = state.attempts.slice(-1000);
  // Completion records participation in all questions, not medical competence.
  if (valid.length === questions.length && questions.length > 0) state.completed[module] = now;
  return attempt;
}
export function nextNode(scenario, nodeId, choice) {
  const node = scenario.nodes[nodeId];
  if (!node || !node.options[choice]) throw new Error('Decisión inexistente');
  const option = node.options[choice];
  if (option.next !== 'end' && !scenario.nodes[option.next]) throw new Error('Destino inexistente');
  return option;
}
export function metrics(state, modules) {
  const total = state.attempts.reduce((n, a) => n + (Number(a.total) || 0), 0),
    correct = state.attempts.reduce((n, a) => n + (Number(a.correct) || 0), 0);
  const completed = modules.filter(m => state.completed[m.id]).length;
  return {
    completed,
    total,
    correct,
    percent: total ? Math.round(correct / total * 100) : 0,
    progress: Math.round(completed / modules.length * 100)
  };
}
export function recommend(state, modules, now = Date.now()) {
  return modules.map(m => {
    const last = state.attempts.filter(a => a.module === m.id).at(-1);
    const age = last ? (now - Date.parse(last.date)) / 86400000 : Infinity;
    const ratio = last && last.total ? last.correct / last.total : 0;
    const priority = !last ? 2 : ratio < 0.75 ? 0 : age >= 7 ? 1 : 3;
    return {
      ...m,
      reason: !last ? 'Comienza este recorrido' : ratio < 0.75 ? 'Repasa las decisiones que te costaron' : age >= 7 ? 'Es momento de un repaso' : 'Prueba preguntas de aplicación',
      priority,
      level: ratio >= 0.75 ? 2 : 1
    };
  }).sort((a, b) => a.priority - b.priority);
}
export function selectQuestions(module, state) {
  const last = state.attempts.filter(a => a.module === module.id).at(-1);
  const advance = last && last.total && last.correct / last.total >= 0.75;
  const base = [...module.questions],
    challenge = module.challengeQuestions ?? [];
  if (!last) return base;
  const pool = [...base, ...challenge];
  const errors = pool.filter(q => last.errors?.includes(q.id));
  const preferred = advance ? [...challenge, ...base.filter(q => q.level === 2), ...base] : base;
  return [...new Map([...errors, ...preferred].map(q => [q.id, q])).values()].slice(0, 4);
}
export function scenarioSummary(history) {
  const first = new Map();
  for (const h of history)
    if (h.node.startsWith('step') && !first.has(h.node)) first.set(h.node, h);
  const decisions = [...first.values()];
  return {
    explored: decisions.length,
    correct: decisions.filter(h => h.correct).length,
    additional: history.length - decisions.length
  };
}
export function validateGraph(scenario) {
  const seen = new Set();
  const visit = id => {
    if (id === 'end' || seen.has(id)) return;
    seen.add(id);
    const n = scenario.nodes[id];
    if (!n) throw new Error(`Nodo ausente: ${id}`);
    if (!n.options.some(o => o.correct)) throw new Error(`Sin salida correcta: ${id}`);
    for (const o of n.options) visit(o.next);
  };
  visit(scenario.start);
  if (seen.size !== Object.keys(scenario.nodes).length) throw new Error('Nodos inaccesibles');
  return true;
}
