import test from 'node:test';
import assert from 'node:assert/strict';
import {
  readFile
} from 'node:fs/promises';
import vm from 'node:vm';
const code = await readFile(new URL('../dist/sw.js', import.meta.url), 'utf8');

function harness({
  online = false,
  cacheHit = 'cached-response'
} = {}) {
  const events = {},
    deleted = [],
    saved = [];
  const scope = {
    URL,
    Promise,
    Response: {
      error: () => 'network-error'
    },
    fetch: async () => {
      if (!online) throw Error('offline');
      return {
        ok: true,
        redirected: false,
        headers: {
          get: () => 'text/javascript'
        },
        clone: () => 'copy'
      };
    },
    caches: {
      open: async () => ({
        addAll: async a => saved.push(...a),
        put: async () => {}
      }),
      keys: async () => ['actua-%2Factua%2F-old', 'actua-%2Fotra%2F-old', 'actua-old', 'another-application'],
      delete: async k => deleted.push(k),
      match: async () => cacheHit
    },
    self: {
      registration: {scope:'https://example.test/actua/'},
      location: {
        origin: 'https://example.test'
      },
      clients: {
        claim: async () => {}
      },
      addEventListener: (n, f) => events[n] = f
    }
  };
  vm.runInNewContext(code, scope);
  return {
    events,
    deleted,
    saved
  };
}
test('PWA instala los recursos de contenido y preguntas de transferencia', async () => {
  const h = harness();
  let done;
  h.events.install({
    waitUntil: p => done = p
  });
  await done;
  assert.ok(h.saved.includes('./src/data/challenges.js'));
  assert.ok(h.saved.includes('./index.html'));
});
test('PWA ofrece respuesta cacheada cuando falla la red', async () => {
  const h = harness();
  let result;
  h.events.fetch({
    request: {
      url: 'https://example.test/actua/src/main.js',
      method: 'GET',
      mode: 'cors'
    },
    respondWith: p => result = p
  });
  assert.equal(await result, 'cached-response');
});
test('PWA no intercepta llamadas ni fuentes externas', () => {
  const h = harness();
  let called = false;
  h.events.fetch({
    request: {
      url: 'https://www.gob.pe/547',
      method: 'GET'
    },
    respondWith: () => called = true
  });
  assert.equal(called, false);
});
test('PWA solo elimina la caché de este proyecto y conserva otros sitios del mismo dominio', async () => {
  const h = harness();
  let done;
  h.events.activate({
    waitUntil: p => done = p
  });
  await done;
  assert.deepEqual(h.deleted, ['actua-%2Factua%2F-old']);
});

test('PWA no intercepta otro proyecto alojado bajo el mismo dominio',()=>{
  const h=harness();let called=false;
  h.events.fetch({request:{url:'https://example.test/otro/index.html',method:'GET'},respondWith:()=>called=true});
  assert.equal(called,false);
});
