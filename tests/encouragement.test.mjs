import test from 'node:test';
import assert from 'node:assert/strict';
import {encouragements,pickEncouragement} from '../dist/src/encouragement.js';

test('frases originales con identificadores y textos distintos',()=>{
  assert.equal(encouragements.length,20);
  assert.equal(new Set(encouragements.map(q=>q.id)).size,20);
  assert.equal(new Set(encouragements.map(q=>q.text)).size,20);
  assert.ok(encouragements.every(q=>q.text.length>30));
});
test('cada frase anterior queda excluida de la siguiente selección',()=>{
  for(const previous of encouragements)for(const n of [0,.25,.5,.75,.999999]){
    const next=pickEncouragement(previous.id,()=>n);
    assert.notEqual(next.id,previous.id);assert.ok(encouragements.includes(next));
  }
});
test('la selección puede alcanzar todas las frases y admite un historial vacío',()=>{
  assert.deepEqual(new Set(Array.from({length:20},(_,i)=>pickEncouragement(null,()=>i/20).id)),new Set(encouragements.map(q=>q.id)));
  assert.ok(pickEncouragement('identificador-antiguo',()=>1));
  assert.ok(pickEncouragement(null,()=>NaN));
});
