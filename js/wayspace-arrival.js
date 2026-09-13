/* Independent artwork motion. Scrolling never sets animation progress. */
(() => {
  const arrival = document.getElementById('wayspaceArrival');
  const button = document.getElementById('arrivalMotion');
  if (!arrival || !button) return;

  const scene = arrival.querySelector('.ws-scene');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wideScreen = window.matchMedia('(min-width: 800px) and (hover: hover) and (pointer: fine)');
  let paused = false;
  let visible = false;

  function configure() {
    const eligible = wideScreen.matches && !reducedMotion.matches;
    arrival.classList.toggle('is-animated', eligible);
    arrival.classList.toggle('is-playing', eligible && !paused && visible && !document.hidden);
    button.hidden = !eligible;
    button.textContent = paused ? 'Resume artwork' : 'Pause artwork';
  }

  // Visibility only suspends the clock when the artwork cannot be seen.
  // It never changes the positions or restarts a paused animation.
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    configure();
  });
  observer.observe(scene);

  button.addEventListener('click', () => {
    paused = !paused;
    configure();
  });
  reducedMotion.addEventListener('change', configure);
  wideScreen.addEventListener('change', configure);
  document.addEventListener('visibilitychange', configure);
  window.addEventListener('pageshow', configure);
  configure();
})();
