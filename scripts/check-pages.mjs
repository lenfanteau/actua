import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
async function walk(dir){const all=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())all.push(...await walk(p));else all.push(p);}return all;}
const files=await walk('dist');
const index=await readFile('dist/index.html','utf8');
for(const [,url] of index.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if(url.startsWith('#')||/^(?:https?:|tel:)/.test(url))continue;
  assert.ok(url.startsWith('./'),'Recurso de entrada no relativo: '+url);
  await readFile('dist/'+url.slice(2));
}
const manifest=JSON.parse(await readFile('dist/manifest.webmanifest','utf8'));
assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');
const forbidden=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bgithub_pat_[A-Za-z0-9_]{40,}\b/,/\bsk-(?:proj-)?[A-Za-z0-9_-]{35,}\b/];
for(const file of files.filter(p=>/\.(?:js|html|css|json|webmanifest)$/.test(p))){
  const text=await readFile(file,'utf8');
  assert.ok(!/chatgpt\.site|git\.chatgpt-team\.site|siwc_bypass|OAI-Sites-Authorization/.test(text),'Dependencia de alojamiento anterior: '+file);
  for(const pattern of forbidden)assert.ok(!pattern.test(text),'Posible credencial detectada; revisar '+file);
}
for(const file of files.filter(p=>p.endsWith('.js')&&!p.endsWith('sw.js'))){
  const text=await readFile(file,'utf8');
  for(const [,local] of text.matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g)){
    await readFile(new URL(local,new URL('../'+file,import.meta.url)));
  }
}
console.log(`Pages: ${files.length} archivos; recursos relativos, manifiesto, imports y revisión básica de credenciales correctos. Sin dependencias de Sites en dist.`);
