import test from 'node:test';
import assert from 'node:assert/strict';
import {
  freshState,
  sanitizeState,
  loadState,
  saveState,
  recordAttempt,
  nextNode,
  metrics,
  recommend,
  selectQuestions,
  validateGraph,
  scenarioSummary
} from '../dist/src/engine.js';
import {
  modules
} from '../dist/src/data/content.js';
import {
  sources
} from '../dist/src/data/sources.js';
import {
  scenarios
} from '../dist/src/data/scenarios.js';
test('ocho módulos con cuatro preguntas, objetivos y trazabilidad válidos', () => {
  assert.equal(modules.length, 8);
  for (const m of modules) {
    assert.ok(m.sections.length >= 8);
    assert.equal(m.questions.length, 4);
    assert.ok(m.version);
    assert.equal(m.age, 'adult');
    assert.ok(m.verified);
    for (const id of m.sources) assert.ok(sources.some(s => s.id === id));
    for (const q of m.questions) {
      assert.ok(q.answer >= 0 && q.answer < q.options.length);
      assert.ok(q.explanation);
    }
  }
});
for (const s of scenarios) {
  test(`grafo válido y ruta correcta completa: ${s.id}`, () => {
    assert.ok(validateGraph(s));
    let id = s.start,
      count = 0;
    while (id !== 'end') {
      const n = s.nodes[id];
      id = nextNode(s, id, n.options.findIndex(o => o.correct)).next;
      count++;
      assert.ok(count < 20);
    }
    assert.equal(count, s.coreSteps);
  });
  test(`decisión errónea abre repaso y puede volver a la ruta: ${s.id}`, () => {
    const wrong = nextNode(s, s.start, 1);
    assert.equal(wrong.correct, false);
    assert.match(wrong.next, /review/);
    const remedy = nextNode(s, wrong.next, 0);
    assert.equal(remedy.correct, true);
    assert.notEqual(remedy.next, s.start);
  });
}
test('evaluación parcial no completa módulo y evaluación completa registra puntuación real', () => {
  const s = freshState(),
    m = modules[0];
  recordAttempt(s, m.id, {
    r1: 1
  }, m.questions);
  assert.equal(s.completed[m.id], undefined);
  const answers = Object.fromEntries(m.questions.map(q => [q.id, q.answer]));
  const a = recordAttempt(s, m.id, answers, m.questions);
  assert.equal(a.correct, 4);
  assert.ok(s.completed.rcp);
  assert.equal(metrics(s, modules).total, 5);
});
test('errores se priorizan y aciertos desbloquean preguntas nuevas de aplicación', () => {
  const s = freshState(),
    m = modules[0];
  recordAttempt(s, m.id, {
    r1: 0,
    r2: 0,
    r3: 1,
    r4: 1
  }, m.questions);
  assert.equal(selectQuestions(m, s)[0].id, 'r1');
  recordAttempt(s, m.id, Object.fromEntries(m.questions.map(q => [q.id, q.answer])), m.questions);
  const qs = selectQuestions(m, s);
  assert.equal(qs[0].level, 3);
  assert.equal(qs.length, 4);
  assert.ok(qs.some(q => q.id === 'r5'));
});
test('volver sobre un nodo no infla puntuación ni progreso del escenario', () => {
  const history = [{
    node: 'step0',
    correct: false
  }, {
    node: 'review0',
    correct: false
  }, {
    node: 'step0',
    correct: true
  }, {
    node: 'step1',
    correct: true
  }];
  assert.deepEqual(scenarioSummary(history), {
    explored: 2,
    correct: 1,
    additional: 2
  });
});
test('ruta adaptativa prioriza repaso por errores y luego por tiempo', () => {
  const s = freshState(),
    m = modules[0],
    now = Date.parse('2026-10-23');
  recordAttempt(s, m.id, {
    r1: 0,
    r2: 0,
    r3: 0,
    r4: 0
  }, m.questions, '2026-10-22');
  assert.equal(recommend(s, modules, now)[0].id, 'rcp');
  s.attempts = [];
  recordAttempt(s, m.id, Object.fromEntries(m.questions.map(q => [q.id, q.answer])), m.questions, '2026-10-01');
  assert.match(recommend(s, modules, now)[0].reason, /repaso/);
});
test('almacenamiento disponible persiste y recupera datos', () => {
  let value = null;
  const storage = {
    getItem: () => value,
    setItem: (k, v) => value = v
  };
  const s = freshState();
  s.checks.escolar = [1, 2];
  s.drills.push({
    id: 'test',
    place: 'Patio'
  });
  assert.ok(saveState(storage, s));
  assert.deepEqual(loadState(storage).state, s);
});
test('almacenamiento denegado o corrupto no rompe la aplicación', () => {
  const denied = {
    getItem() {
      throw Error('denied');
    },
    setItem() {
      throw Error('denied');
    }
  };
  assert.equal(loadState(denied).persistent, false);
  assert.equal(saveState(denied, freshState()), false);
  assert.equal(loadState({
    getItem: () => '{broken'
  }).state.schema, 1);
  assert.deepEqual(sanitizeState({
    schema: 7
  }), freshState());
});
test('edad pediátrica no tiene nodos procedimentales publicados', () => {
  assert.ok(scenarios.every(s => s.age === 'adult'));
  assert.ok(modules.every(m => m.age === 'adult'));
});
test('fechas desconocidas se conservan como nulas y enlaces son HTTPS oficiales', () => {
  for (const s of sources) {
    assert.ok(s.url.startsWith('https://'));
    assert.ok(s.verified);
    assert.ok(s.updated === null || /^\d{4}-\d{2}-\d{2}$/.test(s.updated));
  }
});
test('nodo inválido falla de forma explícita', () => {
  assert.throws(() => nextNode(scenarios[0], 'missing', 0));
  assert.throws(() => nextNode(scenarios[0], scenarios[0].start, 99));
});
test('banco completo: 48 identificadores únicos y respuestas de transferencia válidas', () => {
  const all = modules.flatMap(m => [...m.questions, ...m.challengeQuestions]);
  assert.equal(all.length, 48);
  assert.equal(new Set(all.map(q => q.id)).size, 48);
  for (const q of all) {
    assert.ok(q.options[q.answer]);
    assert.ok(q.explanation);
  }
});
