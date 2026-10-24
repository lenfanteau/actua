import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';

export function createStaticServer({root=path.resolve('dist'),basePath='/'}={}) {
  if(!basePath||!basePath.startsWith('/')||!basePath.endsWith('/')||/[?#\\]/.test(basePath)||basePath.includes('..')||basePath.includes('//'))throw Error('La ruta base debe tener el formato /actua/ o /.');
  root=path.resolve(root);
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.txt':'text/plain; charset=utf-8'};
  return http.createServer(async(req,res)=>{
    try {
      if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'}).end();return;}
      const url=new URL(req.url,'http://localhost'),pathname=decodeURIComponent(url.pathname);
      if(basePath!=='/'&&pathname===basePath.slice(0,-1)){res.writeHead(301,{'Location':basePath+url.search}).end();return;}
      if(!pathname.startsWith(basePath)){res.writeHead(404).end('No encontrado');return;}
      const relative=pathname.slice(basePath.length)||'index.html',file=path.resolve(root,relative);
      if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
      if(!(await stat(file)).isFile()){res.writeHead(404).end('No encontrado');return;}
      const data=await readFile(file);
      res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':data.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});
      res.end(req.method==='HEAD'?undefined:data);
    }catch{res.writeHead(404).end('No encontrado');}
  });
}
