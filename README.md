# ACTÚA — GitHub Pages

Versión 1.4.0 publicada el 24 de octubre de 2026. Código original reutilizado. El sitio anterior de Sites no se ha modificado.

**Aplicación:** https://lenfanteau.github.io/actua/

**Repositorio público:** https://github.com/lenfanteau/actua

**Primera publicación comprobada:** https://github.com/lenfanteau/actua/actions/runs/40071136401

Las 54 pruebas pasaron en GitHub Actions. Se comprobaron evaluación, simulación, progreso tras recarga y 32 vistas adaptables en la URL publicada. Los 30 archivos originales de contenido, lógica, interfaz e imágenes se recibieron por HTTPS con huellas idénticas. Ver `reports/publication.json`, `reports/live-browser-qa.json` y `reports/live-asset-integrity.json`.

## Ejecutar en tu computadora

Requiere Node.js 24 recomendado. No hay dependencias que instalar.

Desde esta carpeta:

```powershell
node scripts/build.mjs
node --test tests/*.test.mjs
node scripts/check-pages.mjs
node scripts/verify-migration.mjs
node scripts/serve.mjs --base /actua/
```

Abre http://127.0.0.1:4173/actua/ . Para detener la vista previa, Ctrl+C. Si el puerto está ocupado, en PowerShell usa `$env:PORT='4190'` antes de iniciarla.

También están disponibles `npm run build`, `npm test`, `npm run check:pages` y `npm run start:pages`. No se necesita `npm install`.

## Configuración de publicación

El repositorio **público** `lenfanteau/actua` ya está creado y Pages usa **GitHub Actions**, con HTTPS obligatorio. Su código, imágenes y documentación son visibles. Las instrucciones siguientes son una referencia para una instalación nueva; no vuelvas a crear el repositorio existente.

1. Crear un repositorio vacío llamado `actua` en la cuenta autorizada, sin añadir archivos iniciales.
2. Desde esta carpeta, revisar `git status`, crear el primer commit y conectar exclusivamente este repositorio independiente:

La carpeta de trabajo está conectada a `origin` y sigue `main`. Para trabajar desde otro equipo, se recomienda `git clone https://github.com/lenfanteau/actua.git`. El ZIP no incluye metadatos Git; para una instalación nueva en otro repositorio, inicializa Git antes de configurar su remoto.

```powershell
git add .
git commit -m "Preparar ACTÚA para GitHub Pages"
git remote add origin https://github.com/lenfanteau/actua.git
git push -u origin main
```

Git puede solicitar identidad de autor y autenticación de GitHub. Usar el inicio de sesión normal; no pegar tokens en archivos ni en comandos. No cambiar el remoto del proyecto original.

3. En GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. En **Actions**, ejecutar **Publicar ACTÚA en GitHub Pages → Run workflow** sobre `main` si el primer envío ocurrió antes de configurar Pages.
5. Esperar a que `build` y `deploy` terminen correctamente. Abrir la URL que devuelve el trabajo `deploy` y comprobar navegación, recarga, imágenes, evaluación y simulación en computadora y teléfono real.

El workflow comprueba sintaxis, ejecuta las 54 pruebas y audita los archivos antes de publicar únicamente `dist/`. Usa el token temporal de GitHub Actions; no requiere guardar una clave personal. Las solicitudes de cambio comprueban el proyecto sin desplegar.

## Actualizar

Editar los archivos fuente dentro de `dist/`, ejecutar compilación y pruebas, revisar los cambios y enviarlos a `main`. GitHub Actions publicará automáticamente la versión que pase los controles. `dist/sw.js` se genera durante la compilación y no se edita ni se versiona manualmente.

En una copia clonada, después de revisar y comprobar los cambios:

```powershell
git add .
git commit -m "Describir la actualización de ACTÚA"
git push origin main
```

`verify:migration` demuestra la igualdad con el original en esta entrega. No forma parte del workflow: una actualización legítima del contenido debe poder cambiar sus huellas. Conservar el informe original como evidencia, no sobrescribirlo para ocultar diferencias.

## Rutas, datos y límites

- HTML, CSS y JavaScript nativos; sin React, Vite, Next.js ni servidor de aplicación. No se necesita backend para las funciones actuales.
- Mantener rutas con `#/`, recursos relativos y barra final `/actua/`. Permiten abrir enlaces y recargar sin reglas especiales de servidor. No reemplazar estas rutas por rutas limpias sin preparar otra estrategia.
- El progreso se guarda en el navegador. **Los datos guardados en Sites no se trasladan automáticamente al nuevo dominio.** La app permite exportar JSON de respaldo, pero actualmente no tiene importación. Las actividades en curso se reinician al recargar, como en la versión original; las ya terminadas permanecen guardadas.
- La instalación y caché dependen del soporte del navegador y de una primera carga correcta. El nuevo service worker limita sus cachés y peticiones a su propia carpeta para no interferir con otros proyectos del mismo dominio.
- No se añadieron servicios de terceros, claves, cuentas ni una base de datos. Si en el futuro se solicita sincronización entre dispositivos, deberá diseñarse y autorizarse por separado.
- La comprobación adaptable se hizo en navegador a 320, 390, 768 y 1280 píxeles. No sustituye una prueba en un teléfono físico ni la comprobación de la URL publicada.

Ver [auditoría técnica](docs/MIGRACION.md), [pruebas del navegador](reports/browser-qa.json), [pruebas automatizadas](reports/automated-tests.txt) e [integridad del original](reports/integrity.txt).

Documentación oficial: [workflow de Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) y [configurar el origen de publicación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
