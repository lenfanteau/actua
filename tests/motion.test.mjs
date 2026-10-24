import test from 'node:test';
import assert from 'node:assert/strict';
import {motionAllowed,mountMotion} from '../dist/src/motion.js';
import {sanitizeState,freshState} from '../dist/src/engine.js';

test('el movimiento requiere preferencia activa y respeta la reducción del sistema',()=>{
  assert.equal(motionAllowed(true,false),true);
  assert.equal(motionAllowed(false,false),false);
  assert.equal(motionAllowed(true,true),false);
  assert.equal(motionAllowed(false,true),false);
});

test('las preferencias antiguas conservan progreso y reciben la opción de movimiento',()=>{
  const state=freshState();delete state.settings.motion;state.completed.rcp='2026-10-23';
  const result=sanitizeState(state);assert.equal(result.settings.motion,true);assert.equal(result.completed.rcp,'2026-10-23');
  result.settings.motion=false;assert.equal(sanitizeState(result).settings.motion,false);
});

test('pausar cancela la animación activa y desconecta la observación de la vista',()=>{
  const previousDocument=globalThis.document,previousObserver=globalThis.IntersectionObserver;
  let observed,disconnects=0,started=0,cancelled=0;
  const element={animate(){started++;return {cancel(){cancelled++;},finished:new Promise(()=>{})};}};
  globalThis.document={documentElement:{dataset:{}}};
  globalThis.IntersectionObserver=class {constructor(callback){observed=callback;} observe(){} unobserve(){} disconnect(){disconnects++;}};
  try {
    mountMotion({querySelectorAll:()=>[element]},{enabled:true,viewKey:'test-view'});
    observed([{isIntersecting:false,target:element}]);assert.equal(started,0);
    observed([{isIntersecting:true,target:element}]);assert.equal(started,1);
    mountMotion({querySelectorAll:()=>[element]},{enabled:false,viewKey:'test-view'});
    assert.equal(cancelled,1);assert.equal(disconnects,1);assert.equal(document.documentElement.dataset.motion,'off');
  } finally {globalThis.document=previousDocument;globalThis.IntersectionObserver=previousObserver;}
});
