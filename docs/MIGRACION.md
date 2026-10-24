# Auditoría de migración — 2026-10-24

Estado: preparado localmente, sin publicación ni cambios en configuración externa. Cuenta consultada en modo lectura: `lenfanteau`. No se encontró un repositorio `lenfanteau/actua` accesible mediante la conexión (respuesta 404); esto no garantiza disponibilidad del nombre si existe uno privado fuera del acceso de la conexión.

## Origen e integridad

Se reutilizó la carpeta original `actua`, versión 1.4.0, commit `07000d989005ed9450bf0cd7ce39ff27b54b73b2`. Se creó una copia independiente en `github-pages/actua`, sin copiar historial Git, configuración privada de Sites ni credenciales. El original conserva su alojamiento y su repositorio.

Las huellas SHA-256 de los 30 archivos públicos de interfaz, contenido, imágenes y lógica coinciden exactamente con el original. La excepción deliberada es `sw.js`, generado para aislar la caché por carpeta. El inventario original está en `migration-baseline.json` y se comprueba con `scripts/verify-migration.mjs`.

## Compatibilidad

| Elemento | Hallazgo y preparación |
|---|---|
| Framework | HTML, CSS y módulos JavaScript nativos; no requiere exportación de React/Next ni Vite |
| Dependencias | Sin paquetes de ejecución ni instalación; Node prepara caché, verifica sintaxis y ejecuta pruebas |
| Backend | No hay componentes de servidor, cuentas ni base de datos remota para las funciones actuales |
| Dependencia de Sites | Ninguna API privada, identidad de usuario o almacenamiento exclusivo en el código público |
| Navegación | Hash `#/` preservado; recargas solicitan siempre el documento de `/actua/` |
| Archivos | Rutas relativas; manifest con `start_url` y `scope` relativos; imágenes locales |
| Progreso | `localStorage`, separado por origen; no se puede leer el guardado del dominio anterior |
| Simulaciones | Seis casos para adultos, rutas de repaso y resúmenes intactos |
| Evaluaciones | Ocho módulos, banco de 48 preguntas; cuatro por intento, adaptación y repaso intactos |
| Preparación | Listas, acuerdos y registros guardados localmente; exportación JSON sin importación |
| Fuentes | Referencias y fechas originales preservadas; monitor manual de fuentes solo para desarrollo |
| Caché | Prefijo derivado de `registration.scope`; no borra cachés ajenas ni intercepta otros proyectos del mismo dominio |
| Despliegue | Actions en `main`, permisos mínimos por trabajo, artefacto solo `dist/` |

## Validación

54 pruebas automatizadas aprobadas: banco y lógica original, persistencia, simulaciones, motivación, navegación HTTP bajo `/actua/` y aislamiento de caché. Auditoría de 31 archivos públicos aprobada. La revisión de patrones de credenciales y dependencias privadas no encontró coincidencias; no equivale a una auditoría formal de seguridad.

En navegador: ocho evaluaciones finalizadas con 32 respuestas; seis simulaciones y una ruta con error y repaso; progreso y checklist 7/7 conservados después de recargar; ocho números distintos con enlaces telefónicos, sin realizar llamadas. Se revisaron ocho pantallas en cuatro tamaños (32 vistas), sin desbordamientos horizontales ni imágenes rotas detectadas. No se registraron errores ni advertencias de consola durante esos recorridos. Evidencias: `../reports/browser-qa.json`, `desktop.png` y `mobile.png` en el paquete de entrega.

Los informes y las pruebas no validan profesionalmente procedimientos médicos ni cambian las afirmaciones educativas del original. La migración no alteró información médica.

## Pendientes de autorización y verificación posterior

Crear/subir repositorio público, activar Pages y ejecutar el workflow en GitHub. Después comprobar la URL real, HTTPS, instalación/caché y funcionamiento en un teléfono físico. El workflow está preparado, pero no se ha ejecutado en GitHub. La lógica de caché tiene pruebas automatizadas; no se hizo un ensayo completo de desconexión de red en navegador.

No se necesita alternativa de backend para esta versión. Añadir sincronización, acceso de alumnos o datos centralizados sería un proyecto adicional con decisiones de privacidad, almacenamiento y costos que hoy no aplican.

## Referencias de infraestructura

- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://github.com/actions/checkout
- https://github.com/actions/setup-node
- https://github.com/actions/configure-pages
- https://github.com/actions/upload-pages-artifact
- https://github.com/actions/deploy-pages

Se comprobaron las referencias oficiales usadas: checkout v7, setup-node v7, configure-pages v5, upload-pages-artifact v4 y deploy-pages v4.
