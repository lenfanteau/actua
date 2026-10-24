// Motion never delays an action or hides content. System preference wins.
let observer = null;
let previousView = null;
const running = new Set();
const media = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

export function motionAllowed(enabled = true, reduced = media?.matches ?? false) {
  return enabled !== false && !reduced;
}

export function mountMotion(root, { enabled = true, viewKey = '' } = {}) {
  observer?.disconnect();
  for (const animation of running) animation.cancel();
  running.clear();
  const allowed = motionAllowed(enabled);
  document.documentElement.dataset.motion = allowed ? 'on' : 'off';
  const newView = viewKey !== previousView;
  previousView = viewKey;
  if (!allowed || !root || typeof IntersectionObserver !== 'function') return;
  const selector = newView
    ? '.page-heading, .welcome, .hero, .emergency-strip, .directory-banner, .service-card, .stats-row, .module-card, .scenario-card, .lesson-cover, .lesson-section, .panel, .question-panel, .age-panel, .result-panel, .timeline article, .how>div'
    : '.feedback, .result-panel';
  const elements = [...root.querySelectorAll(selector)];
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (typeof entry.target.animate !== 'function') continue;
      const animation = entry.target.animate([
        { opacity: .65, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 440, delay: Math.min(elements.indexOf(entry.target) % 4 * 65, 195), easing: 'cubic-bezier(.2,.7,.2,1)' });
      running.add(animation);
      animation.finished.then(() => running.delete(animation)).catch(() => running.delete(animation));
    }
  }, { threshold: .08 });
  for (const element of elements) observer.observe(element);
}

media?.addEventListener('change', () => {
  document.documentElement.dataset.motion = motionAllowed(document.querySelector('[data-action="motion"]')?.getAttribute('aria-pressed') !== 'false') ? 'on' : 'off';
  if (media.matches) {
    observer?.disconnect();
    for (const animation of running) animation.cancel();
    running.clear();
  }
});
