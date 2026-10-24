# ACTÚA — GitHub Pages

Versión 1.4.0 preparada el 24 de octubre de 2026. Código original reutilizado; publicación pendiente de autorización. El sitio actual de Sites no se ha modificado.

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

## Publicar, después de la autorización

Destino propuesto: repositorio **público** `lenfanteau/actua`. Su código, imágenes y documentación serán visibles. URL esperada: https://lenfanteau.github.io/actua/ . Esta dirección no se presenta como publicada.

1. Crear un repositorio vacío llamado `actua` en la cuenta autorizada, sin añadir archivos iniciales.
2. Desde esta carpeta, revisar `git status`, crear el primer commit y conectar exclusivamente este repositorio independiente:

La carpeta de trabajo ya tiene Git inicializado en `main`, sin remoto. Si descomprimiste el ZIP, que no incluye metadatos Git, ejecuta primero `git init --initial-branch=main`.

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
