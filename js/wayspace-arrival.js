/* One scroll-linked composition, confined to the Wayspace arrival. */
(() => {
  const arrival = document.getElementById('wayspaceArrival');
  const button = document.getElementById('arrivalMotion');
  if (!arrival || !button) return;

  const layers = [...arrival.querySelectorAll('[data-depth-y]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wideScreen = window.matchMedia('(min-width: 800px)');
  let paused = false;
  let frame = 0;
  let start = 0;
  let distance = 1;
  let active = false;

  function paint() {
    frame = 0;
    if (!active) return;
    const progress = Math.max(0, Math.min(1, (window.scrollY - start) / distance));
    layers.forEach(layer => {
      const x = progress * Number(layer.dataset.depthX || 0);
      const y = progress * Number(layer.dataset.depthY);
      layer.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    });
  }

  function requestPaint() {
    if (active && !frame) frame = window.requestAnimationFrame(paint);
  }

  function configure() {
    const eligible = wideScreen.matches && !reducedMotion.matches;
    active = eligible && !paused;
    button.hidden = !eligible;
    button.textContent = paused ? 'Enable artwork motion' : 'Pause artwork';
    window.cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener('scroll', requestPaint);
    if (!active) {
      layers.forEach(layer => layer.style.removeProperty('transform'));
      return;
    }
    const rect = arrival.getBoundingClientRect();
    start = Math.max(0, rect.top + window.scrollY - window.innerHeight * 0.5);
    distance = Math.max(rect.height, window.innerHeight * 0.75);
    window.addEventListener('scroll', requestPaint, { passive: true });
    requestPaint();
  }

  button.addEventListener('click', () => {
    paused = !paused;
    configure();
  });
  reducedMotion.addEventListener('change', configure);
  wideScreen.addEventListener('change', configure);
  window.addEventListener('resize', configure, { passive: true });
  window.addEventListener('pageshow', configure);
  document.fonts.ready.then(configure);
  configure();
})();
