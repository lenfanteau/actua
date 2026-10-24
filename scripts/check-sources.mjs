import {
  sources
} from '../dist/src/data/sources.js';
import {
  mkdir,
  readFile,
  writeFile
} from 'node:fs/promises';
import {
  createHash
} from 'node:crypto';
let baseline = {};
try {
  baseline = JSON.parse(await readFile('reports/source-baseline.json', 'utf8'));
} catch {}
const result = [];
// Este monitor solo propone revisión. Un error de acceso nunca confirma ausencia de cambios.
for (let i = 0; i < sources.length; i += 4) {
  await Promise.all(sources.slice(i, i + 4).map(async s => {
    try {
      const r = await fetch(s.url, {
        signal: AbortSignal.timeout(18000),
        headers: {
          'User-Agent': 'ACTUA-SourceReview/1.0'
        }
      });
      if (!r.ok) throw Error(`HTTP ${r.status}`);
      const body = Buffer.from(await r.arrayBuffer()),
        hash = createHash('sha256').update(body).digest('hex');
      result.push({
        id: s.id,
        url: s.url,
        status: baseline[s.id]?.hash === hash ? 'sin-cambio-de-huella' : baseline[s.id] ? 'cambio-por-revisar' : 'linea-base-nueva-por-revisar',
        hash,
        http: r.status,
        etag: r.headers.get('etag'),
        lastModified: r.headers.get('last-modified'),
        note: 'Una huella diferente puede ser solo navegación o diseño; requiere inspección humana.'
      });
    } catch (e) {
      result.push({
        id: s.id,
        url: s.url,
        status: 'acceso-no-verificable',
        error: e.message
      });
    }
  }));
}
await mkdir('reports', {
  recursive: true
});
const report = {
  checked: new Date().toISOString(),
  policy: 'No modifica contenidos. Todo cambio requiere revisión humana antes de incorporarse.',
  results: result
};
await writeFile('reports/source-monitor.json', JSON.stringify(report, null, 2));
if (process.argv.includes('--accept-baseline')) {
  const updated = {
    ...baseline
  };
  for (const r of result)
    if (r.hash) updated[r.id] = {
      hash: r.hash,
      checked: report.checked
    };
  await writeFile('reports/source-baseline.json', JSON.stringify(updated, null, 2));
}
console.log(JSON.stringify(report, null, 2));
