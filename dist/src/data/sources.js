export const VERIFIED = '2026-10-23';
const source = (id, institution, title, year, updated, url, access = 'Lectura directa') => ({
  id,
  institution,
  title,
  year,
  updated,
  url,
  access,
  verified: VERIFIED
});
export const sources = [
  source('aha25', 'American Heart Association', '2025 Guidelines · Part 7: Adult Basic Life Support', 2025, null, 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-basic-life-support'),
  source('bls', 'American Heart Association', '2025 · Simplified Adult Basic Life Support (Lay Rescuer)', 2025, null, 'https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-BLS-Adult-Lay-Rescuer-250514.pdf?sc_lang=en'),
  source('fbao', 'American Heart Association', '2025 · Adult Foreign-Body Airway Obstruction Algorithm', 2025, null, 'https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-BLS-Adult-FBAO-250630.pdf?sc_lang=en'),
  source('fa24', 'American Heart Association / American Red Cross', '2024 Guidelines for First Aid', 2024, null, 'https://cpr.heart.org/en/resuscitation-science/2024-first-aid-guidelines'),
  source('heart', 'American Heart Association', 'Heart Attack and Sudden Cardiac Arrest Differences', null, null, 'https://www.heart.org/en/health-topics/heart-attack/about-heart-attacks/heart-attack-or-sudden-cardiac-arrest-how-are-they-different'),
  source('bleed', 'American Red Cross', 'Bleeding (Life-Threatening External)', null, null, 'https://www.redcross.org/take-a-class/resources/learn-first-aid/bleeding-life-threatening-external', 'Texto oficial indexado'),
  source('burn', 'American Red Cross', 'Burns: Types, Symptoms, and How To Help', null, null, 'https://www.redcross.org/take-a-class/resources/learn-first-aid/burns', 'Texto oficial indexado'),
  source('steps', 'American Red Cross', 'First Aid Steps', null, null, 'https://www.redcross.org/take-a-class/first-aid/performing-first-aid/first-aid-steps', 'Texto oficial indexado'),
  source('family', 'INDECI', 'Cómo elaborar tu Plan Familiar de Emergencia', null, '2024-01-14', 'https://www.gob.pe/10165-plan-familiar-de-emergencia', 'Índice oficial; apertura bloqueada HTTP 418'),
  source('ready', 'INDECI', 'Familia Preparada', 2024, '2024-10-21', 'https://www.gob.pe/66386-prepararse-ante-una-emergencia-o-desastre-con-la-aplicacion-familia-preparada-de-indeci', 'Índice oficial; apertura bloqueada HTTP 418'),
  source('minedu', 'Ministerio de Educación del Perú', 'Comunidad educativa lista para primer Simulacro Nacional Multipeligro 2026', 2026, '2026-05-26', 'https://www.gob.pe/institucion/minedu/noticias/1397312-comunidad-educativa-lista-para-participar-en-primer-simulacro-nacional-multipeligro-2026-este-29-de-mayo', 'Índice oficial; apertura bloqueada HTTP 418'),
  source('phones', 'Presidencia del Consejo de Ministros', 'Teléfonos de emergencia', null, '2024-01-14', 'https://www.gob.pe/547-telefonos-de-emergencia', 'Índice oficial; apertura bloqueada HTTP 418'),
  source('samu', 'Ministerio de Salud del Perú', 'Solicitar atención médica en caso de emergencia — SAMU', null, '2023-12-13', 'https://www.gob.pe/1013-solicitar-atencion-medida-en-caso-de-emergencia.samu', 'Índice oficial; apertura bloqueada HTTP 418'),
  source('samu26', 'Ministerio de Salud del Perú', 'SAMU: atención de emergencias en Lima Metropolitana, 2026', 2026, '2026-05-15', 'https://www.gob.pe/institucion/minsa/noticias/1392460-ministerio-de-salud-a-traves-del-samu-supera-las-77-mil-llamadas-de-emergencia-en-lo-que-va-del-2026', 'Índice oficial; apertura bloqueada HTTP 418'),
  source('arequipa', 'Gobierno Regional de Arequipa', 'SAMU Arequipa: balance 2025', 2026, '2026-01-04', 'https://www.gob.pe/institucion/regionarequipa/noticias/1327036-samu-arequipa-cierra-el-2025-consolidado-como-pilar-fundamental-en-la-atencion-de-emergencias-prehospitalarias', 'Índice oficial; apertura bloqueada HTTP 418'),
  source('fire', 'Cuerpo General de Bomberos Voluntarios del Perú', 'App Bomberos 116 · Central nacional', null, null, 'https://www.bomberosperu.gob.pe/sgo/comunicado_app/WEB/index.html')
];
export const bySource = id => sources.find(s => s.id === id);
export const conflicts = [{
  title: 'Enfriamiento de quemaduras',
  text: 'AHA / Cruz Roja 2024 y la página de American Red Cross indican 5–20 minutos. Otras instituciones usan al menos 20 minutos. ACTÚA sigue la familia AHA / American Red Cross, con agua corriente limpia y fresca y vigilancia del enfriamiento corporal. No presenta una duración universal. El uso de hielo y los casos extensos requieren especial cautela y revisión humana.'
}, {
  title: 'Cobertura de SAMU 106',
  text: 'La lista PCM actualizada en 2024 no incluye todas las regiones con operación documentada en 2026, como Arequipa. No se usa como lista exhaustiva ni se promete envío de ambulancia en cualquier lugar.'
}, {
  title: 'Edad y ámbito del contenido',
  text: 'AHA considera signos de pubertad para su algoritmo adulto. Este piloto restringe los procedimientos a la categoría adulta seleccionada; las rutas de niños y lactantes permanecen bloqueadas. No traduce automáticamente pautas entre edades.'
}];
