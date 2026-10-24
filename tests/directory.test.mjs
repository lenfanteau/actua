import test from 'node:test';
import assert from 'node:assert/strict';
import {emergencyContacts,filterContacts,contactDirectoryText,CONTACTS_VERIFIED} from '../dist/src/data/emergencies.js';
import {filterModules,startModes} from '../dist/src/discovery.js';
import {modules} from '../dist/src/data/content.js';

test('directorio: ocho números únicos con institución, alcance y fuente oficial',()=>{
  assert.deepEqual(emergencyContacts.map(c=>c.number).sort(),['100','105','106','110','113','115','116','118']);
  assert.equal(new Set(emergencyContacts.map(c=>c.number)).size,8);
  for(const c of emergencyContacts){assert.ok(c.institution);assert.ok(c.description);assert.ok(c.note);assert.equal(new URL(c.source).hostname,'www.gob.pe');}
  assert.match(CONTACTS_VERIFIED,/^\d{4}-\d{2}-\d{2}$/);
});
test('las tres centrales prioritarias y la orientación están diferenciadas',()=>{
  assert.deepEqual(emergencyContacts.filter(c=>c.primary).map(c=>c.number),['106','116','105']);
  assert.deepEqual(filterContacts('','orientacion').map(c=>c.number),['100','113']);
  assert.match(emergencyContacts.find(c=>c.number==='106').note,/localidad/);
  assert.match(emergencyContacts.find(c=>c.number==='113').note,/emergencia médica.*106/);
});
test('búsqueda de contactos por número, acentos e institución y combinación con filtros',()=>{
  assert.equal(filterContacts('116')[0].name,'Bomberos');
  assert.equal(filterContacts('policia').length,2);
  assert.equal(filterContacts('violencia','orientacion')[0].number,'100');
  assert.equal(filterContacts('MINISTERIO DE SALUD').length,2);
  assert.equal(filterContacts('116','orientacion').length,0);
  assert.equal(filterContacts('inexistente').length,0);
});
test('el directorio descargable conserva todos los números y sus referencias',()=>{
  const text=contactDirectoryText();assert.match(text,/Consulta de fuentes/);
  for(const c of emergencyContacts){assert.ok(text.includes(c.number+' · '+c.name));assert.ok(text.includes(c.source));}
});
test('filtros educativos combinan categoría y texto sin alterar el banco',()=>{
  assert.equal(filterModules(modules,'','auxilios').length,6);
  assert.equal(filterModules(modules,'','preparacion').length,2);
  assert.equal(filterModules(modules,'PREVENCION','preparacion')[0].id,'prevencion');
  assert.equal(filterModules(modules,'quemaduras','preparacion').length,0);
  assert.equal(modules.length,8);
});
test('tres entradas de Inicio tienen una ruta y una imagen reales',()=>{
  assert.deepEqual(Object.keys(startModes),['aprender','practicar','preparar']);
  for(const mode of Object.values(startModes)){assert.ok(['aprende','simulador','preparacion'].includes(mode.route));assert.ok(mode.image);assert.ok(mode.action);}
});
