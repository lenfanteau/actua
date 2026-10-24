// Actividad educativa de ordenamiento; nunca evalúa una maniobra física.
export const orderCards = [{
  id: 0,
  title: 'Reconocer con seguridad',
  text: 'Comprobar seguridad y reconocer falta de respuesta y respiración anormal.',
  icon: 'shield'
}, {
  id: 1,
  title: 'Pedir ayuda',
  text: 'Activar emergencias y pedir un DEA.',
  icon: 'phone'
}, {
  id: 2,
  title: 'Comenzar la respuesta',
  text: 'Iniciar RCP según la formación.',
  icon: 'heart'
}];
export const initialOrder = () => [2, 0, 1];
export function isOrder(ids) {
  return Array.isArray(ids) && ids.length === 3 && new Set(ids).size === 3 && ids.every(id => orderCards.some(card => card.id === id));
}
export function moveOrder(ids, id, targetIndex) {
  if (!isOrder(ids) || !ids.includes(id) || !Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= ids.length) return [...ids];
  const next = ids.filter(value => value !== id);
  next.splice(targetIndex, 0, id);
  return next;
}
export function evaluateOrder(ids) {
  if (!isOrder(ids)) return {
    correct: false,
    positions: [],
    correctCount: 0
  };
  const positions = ids.map((id, index) => id === index);
  return {
    correct: positions.every(Boolean),
    positions,
    correctCount: positions.filter(Boolean).length
  };
}
export function decisionNumber(node, total) {
  const match = /^(?:step|review)(\d+)$/.exec(node);
  return match ? Math.min(Number(match[1]) + 1, total) : 1;
}
