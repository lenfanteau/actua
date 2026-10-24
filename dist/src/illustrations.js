import {
  artImage,
  scenarioArt
} from './media.js';
export function icon(name, cls = '') {
  const paths = {
    heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8M3 12h5l2-4 4 8 2-4h5',
    air: 'M4 8h11a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M4 17h6a2 2 0 1 1-2 2',
    drop: 'M12 2S4 10 4 15a8 8 0 0 0 16 0c0-5-8-13-8-13ZM8 15a4 4 0 0 0 4 4',
    flame: 'M12 2c2 6-4 6-1 11 2-1 3-3 3-5 5 4 7 7 4 11-3 5-11 4-13-1C2 11 8 9 12 2Z',
    person: 'M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 22v-4a8 8 0 0 1 16 0v4',
    shield: 'm12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6ZM8 12l3 3 5-6',
    home: 'm3 10 9-8 9 8v12h-6v-8H9v8H3Z',
    flag: 'M4 22V3c5-5 11 5 16 0v12c-5 5-11-5-16 0',
    grid: 'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z',
    book: 'M3 3h7l2 2 2-2h7v17h-7l-2 2-2-2H3ZM12 5v17',
    play: 'm8 4 13 8-13 8Z',
    chart: 'M4 3v18h18M8 16v-5M13 16V7M18 16v-8',
    phone: 'M5 2 2 5c0 9 8 17 17 17l3-3-5-5-3 3-7-7 3-3Z',
    source: 'M14 3H4v18h16V9ZM14 3v6h6M8 13h8M8 17h6',
    arrow: 'M4 12h16M14 6l6 6-6 6',
    check: 'm5 12 4 4L20 5',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
    menu: 'M3 5h18M3 12h18M3 19h18',
    sun: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 1v3M12 20v3M1 12h3M20 12h3',
    download: 'M12 2v13m-5-5 5 5 5-5M3 17v5h18v-5',
    info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 11v6M12 7v1'
  };
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]??paths.shield}"/></svg>`;
}
export function heroArt(key='hero',caption='Aprender en comunidad.<br><strong>Prepararnos en equipo.</strong>') {
  return `<figure class="hero-visual">${artImage(key,'hero-photo',true)}<figcaption><span aria-hidden="true">✦</span> ${caption}</figcaption></figure>`;
}
export function sceneArt(id) {
  const key = scenarioArt[id];
  return `<figure class="scene-visual">${artImage(key,'scene-photo',true)}<figcaption>Escenario ficticio · La situación se describe en el texto</figcaption></figure>`;
}
