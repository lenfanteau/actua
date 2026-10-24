export const startModes = {
  aprender:{label:'Aprender',icon:'book',image:'hero',title:'Aprende hoy.<br>Prepárate para <em>actuar.</em>',text:'Descubre señales importantes, comprende las decisiones y construye conocimientos a tu ritmo.',route:'aprende',action:'Explorar los módulos',secondary:'simulador',secondaryAction:'Practicar un caso',caption:'Conocer es el primer paso.<br><strong>Aprender también es cuidarnos.</strong>'},
  practicar:{label:'Practicar',icon:'play',image:'scenarios',title:'Observa la situación.<br>Elige tu <em>siguiente paso.</em>',text:'Entra en una historia ficticia, toma decisiones y descubre el fundamento de cada respuesta.',route:'simulador',action:'Elegir una simulación',secondary:'progreso',secondaryAction:'Ver mi progreso',caption:'Una situación. Varias decisiones.<br><strong>Un espacio para aprender.</strong>'},
  preparar:{label:'Organizarme',icon:'flag',image:'preparedness',title:'Un plan comienza<br>con pequeños <em>acuerdos.</em>',text:'Organiza tu lista de preparación, acuerda responsabilidades y registra lo que necesitan mejorar.',route:'preparacion',action:'Construir mi plan',secondary:'prevencion',secondaryAction:'Explorar prevención',caption:'Prepararnos se hace en equipo.<br><strong>Empieza con tu próximo acuerdo.</strong>'}
};
export function filterModules(modules,query='',category='todos') {
  const normalize=text=>String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();
  return modules.filter(m=>(category==='todos'||(['prevencion','simulacros'].includes(m.id)?category==='preparacion':category==='auxilios'))&&normalize(m.id+' '+m.title+' '+m.subtitle).includes(normalize(query)));
}
