import {createStaticServer} from './static-server.mjs';
const baseIndex=process.argv.indexOf('--base');
const basePath=baseIndex>=0?process.argv[baseIndex+1]:'/';
const port=Number(process.env.PORT||4173);
const server=createStaticServer({basePath});
server.listen(port,'127.0.0.1',()=>console.log(`ACTÚA local: http://127.0.0.1:${port}${basePath} · PID ${process.pid}`));
