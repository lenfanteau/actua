import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {readFile} from 'node:fs/promises';
import {createStaticServer} from '../scripts/static-server.mjs';

test('sitio servido bajo /actua/: entrada, módulos, imágenes, PWA y recarga de rutas hash',async t=>{
  const server=createStaticServer({basePath:'/actua/'});server.listen(0,'127.0.0.1');await once(server,'listening');
  t.after(()=>new Promise(resolve=>server.close(resolve)));
  const origin='http://127.0.0.1:'+server.address().port;
  const redirect=await fetch(origin+'/actua',{redirect:'manual'});assert.equal(redirect.status,301);assert.equal(redirect.headers.get('location'),'/actua/');
  for(const route of ['','#/leccion/rcp','#/caso/comedor','#/evaluacion/hemorragias','#/contactos']){
    const response=await fetch(origin+'/actua/'+route);assert.equal(response.status,200);assert.match(await response.text(),/src="\.\/src\/main\.js"/);
  }
  for(const [resource,type] of [['src/main.js','javascript'],['assets/images/bleeding.webp','image/webp'],['manifest.webmanifest','manifest'],['sw.js','javascript']]){
    const response=await fetch(origin+'/actua/'+resource);assert.equal(response.status,200);assert.ok(response.headers.get('content-type').includes(type));
  }
  assert.equal((await fetch(origin+'/src/main.js')).status,404);
  assert.equal((await fetch(origin+'/otro/')).status,404);
  assert.equal((await fetch(origin+'/actua/no-existe.js')).status,404);
});

test('recursos de entrada y manifiesto resuelven dentro de la ruta del repositorio',async()=>{
  const base=new URL('https://example.github.io/actua/'),html=await readFile('dist/index.html','utf8');
  for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    if(url.startsWith('#'))continue;
    assert.ok(new URL(url,base).pathname.startsWith('/actua/'));
  }
  const manifest=JSON.parse(await readFile('dist/manifest.webmanifest','utf8'));
  assert.equal(new URL(manifest.start_url,base).pathname,'/actua/');
  assert.equal(new URL(manifest.scope,base).pathname,'/actua/');
});
