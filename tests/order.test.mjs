import test from 'node:test';
import assert from 'node:assert/strict';
import {
  orderCards,
  initialOrder,
  isOrder,
  moveOrder,
  evaluateOrder,
  decisionNumber
} from '../dist/src/order.js';
test('orden inicial tiene tres tarjetas distintas y plantea una secuencia para resolver', () => {
  assert.equal(orderCards.length, 3);
  assert.ok(isOrder(initialOrder()));
  assert.equal(evaluateOrder(initialOrder()).correct, false);
});
test('subir y bajar permiten completar la secuencia sin perder ni duplicar tarjetas', () => {
  let ids = initialOrder();
  ids = moveOrder(ids, 0, 0);
  ids = moveOrder(ids, 1, 1);
  assert.deepEqual(ids, [0, 1, 2]);
  assert.equal(evaluateOrder(ids).correct, true);
  ids = moveOrder(ids, 0, 2);
  assert.deepEqual(ids, [1, 2, 0]);
  assert.ok(isOrder(ids));
});
test('movimiento directo por arrastre respeta las posiciones de destino', () => {
  assert.deepEqual(moveOrder([2, 0, 1], 2, 2), [0, 1, 2]);
  assert.deepEqual(moveOrder([0, 1, 2], 2, 0), [2, 0, 1]);
});
test('no aceptar destinos ni identificadores externos', () => {
  const ids = initialOrder();
  assert.deepEqual(moveOrder(ids, 99, 1), ids);
  assert.deepEqual(moveOrder(ids, 2, -1), ids);
  assert.deepEqual(moveOrder(ids, 2, 3), ids);
  assert.equal(isOrder([0, 0, 1]), false);
});
test('resultado indica qué posiciones están bien y se invalida tras modificar el orden', () => {
  const ids = [0, 2, 1],
    result = evaluateOrder(ids);
  assert.deepEqual(result.positions, [true, false, false]);
  assert.equal(result.correctCount, 1);
  assert.equal(result.correct, false);
  assert.equal(evaluateOrder([0, 1, 2]).correct, true);
  assert.equal(evaluateOrder(moveOrder([0, 1, 2], 1, 2)).correct, false);
});
test('reiniciar devuelve un arreglo nuevo con las tres tarjetas iniciales', () => {
  const a = initialOrder();
  a.reverse();
  assert.deepEqual(initialOrder(), [2, 0, 1]);
});
test('contador del escenario depende del nodo actual y no de decisiones ya registradas', () => {
  assert.equal(decisionNumber('step0', 3), 1);
  assert.equal(decisionNumber('step1', 3), 2);
  assert.equal(decisionNumber('review1', 3), 2);
  assert.equal(decisionNumber('step2', 3), 3);
});
