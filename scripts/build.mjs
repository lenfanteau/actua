import {
  readdir,
  readFile,
  writeFile
} from 'node:fs/promises';
import {
  spawnSync
} from 'node:child_process';
import {
  createHash
} from 'node:crypto';
import path from 'node:path';
async function walk(dir) {
  const all = [];
  for (const e of await readdir(dir, {
      withFileTypes: true
    })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) all.push(...await walk(p));
    else all.push(p);
  }
  return all;
}
const files = await walk('dist');
for (const f of files.filter(f => f.endsWith('.js') && !f.endsWith('sw.js'))) {
  const r = spawnSync(process.execPath, ['--check', f], {
    encoding: 'utf8'
  });
  if (r.status !== 0) throw Error(r.stderr);
}
const hash = createHash('sha256');
for (const f of files.filter(f => !f.endsWith('sw.js')).sort()) hash.update(await readFile(f));
const version = hash.digest('hex').slice(0, 12),
  assets = ['./', ...files.filter(f => !f.endsWith('sw.js')).map(f => './' + path.relative('dist', f).replaceAll('\\', '/'))];
const worker = `// Generado por scripts/build.mjs: caché versionada por contenido, sin datos personales.
const SCOPE=new URL(self.registration.scope);
const PREFIX='actua-'+encodeURIComponent(SCOPE.pathname)+'-';
const CACHE=PREFIX+'${version}';
const ASSETS=${JSON.stringify(assets)};
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==SCOPE.origin||!url.pathname.startsWith(SCOPE.pathname))return;
// Red primero: la caché es respaldo. No se almacenan respuestas HTML de autenticación.
event.respondWith(fetch(event.request).then(response=>{if(response.ok&&!response.redirected){const isScript=/\\.js$/.test(url.pathname),validType=!isScript||/javascript/.test(response.headers.get('content-type')||'');if(validType){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});}}return response;}).catch(()=>caches.match(event.request,{cacheName:CACHE}).then(cached=>cached||(event.request.mode==='navigate'?caches.match('./',{cacheName:CACHE}):Response.error()))));});
`;
await writeFile('dist/sw.js', worker);
console.log(`Build verificado · ${files.length} archivos · caché ${version}`);
