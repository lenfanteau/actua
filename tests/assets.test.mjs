import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {artwork,moduleArt,scenarioArt} from '../dist/src/media.js';
import {modules} from '../dist/src/data/content.js';
import {scenarios} from '../dist/src/data/scenarios.js';
test('cada módulo usa una ilustración existente con texto alternativo',()=>{for(const module of modules){assert.ok(artwork[moduleArt[module.id]]);assert.ok(artwork[moduleArt[module.id]].alt.length>20);}});
test('diez archivos de imagen reales en formato WebP y sin enlaces externos',async()=>{assert.equal(Object.keys(artwork).length,10);for(const art of Object.values(artwork)){assert.ok(art.src.startsWith('./assets/images/'));const file=await readFile(new URL('../dist/'+art.src.slice(2),import.meta.url));assert.equal(file.toString('ascii',0,4),'RIFF');assert.equal(file.toString('ascii',8,12),'WEBP');assert.ok(file.length>10000);}});

test('ocho módulos y seis escenarios tienen una imagen distinta dentro de su colección',()=>{assert.equal(new Set(modules.map(m=>artwork[moduleArt[m.id]].src)).size,8);assert.equal(new Set(scenarios.map(s=>artwork[scenarioArt[s.id]].src)).size,6);});

test('las imágenes de hemorragias y atragantamiento corresponden a sus temas',()=>{assert.equal(moduleArt.hemorragias,scenarioArt.herida);assert.match(artwork[moduleArt.hemorragias].alt,/guantes.*gasa/);assert.equal(moduleArt.atragantamiento,scenarioArt.comedor);assert.match(artwork[moduleArt.atragantamiento].alt,/garganta/);});
test('el tema nuevo está vinculado y el ejercicio contiene controles en ambos sentidos',async()=>{const index=await readFile(new URL('../dist/index.html',import.meta.url),'utf8'),main=await readFile(new URL('../dist/src/main.js',import.meta.url),'utf8');assert.match(index,/href="\.\/theme\.css"/);assert.match(main,/data-direction="-1"/);assert.match(main,/data-direction="1"/);assert.match(main,/Reiniciar actividad/);});
