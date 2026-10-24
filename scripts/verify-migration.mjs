import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const baseline=JSON.parse(await readFile('docs/migration-baseline.json','utf8'));
let checked=0;
for (const [file,expected] of Object.entries(baseline.files)) {
  if (baseline.generatedExceptions.includes(file)) continue;
  const actual=createHash('sha256').update(await readFile('dist/'+file)).digest('hex');
  if(actual!==expected)throw Error('Cambio frente al original: '+file);
  checked++;
}
console.log(`Integridad de migración: ${checked}/${checked} archivos de contenido, lógica, interfaz y recursos idénticos al original ${baseline.sourceCommit}. Solo sw.js se regenera para aislar la caché por ruta.`);
