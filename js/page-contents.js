/* The frozen "On this page" bar: sits just under the site nav, whatever
   height the nav has, and marks the section the reader is in. */
(() => {
  const bar = document.querySelector('.page-contents.is-sticky');
  const nav = document.querySelector('.site-nav');
  if (!bar) return;

  const setNavHeight = () => {
    if (nav) document.documentElement.style.setProperty('--site-nav-h', `${nav.offsetHeight}px`);
  };
  setNavHeight();
  window.addEventListener('resize', setNavHeight);

  const links = [...bar.querySelectorAll('a[href^="#"]')];
  const targets = links
    .map(link => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);
  if (!targets.length) return;

  // The section in view is the last heading that has passed under the bar.
  const mark = () => {
    const line = bar.getBoundingClientRect().bottom + Math.min(160, window.innerHeight / 4);
    let current = null;
    targets.forEach(t => { if (t.getBoundingClientRect().top <= line) current = t; });
    links.forEach(link => {
      const on = current && link.getAttribute('href') === `#${current.id}`;
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    // On a phone the bar scrolls sideways; keep the marked link in view
    // without touching the page's own scroll.
    const active = links.find(l => l.hasAttribute('aria-current'));
    if (active && active !== lastActive && bar.scrollWidth > bar.clientWidth) {
      bar.scrollLeft = active.offsetLeft - bar.offsetLeft - 16;
    }
    lastActive = active;
  };
  let lastActive = null;
  let queued = false;
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; mark(); });
  }, { passive: true });
  mark();
})();
