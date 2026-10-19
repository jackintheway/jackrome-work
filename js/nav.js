/* Nav toggle.
   Below 1081px the link row collapses behind a button. Above it the
   button is display:none and none of this runs to any visible effect.

   The panel is a class on the existing .nav-links, not a separate
   element, so there is one set of links in the markup and one place a
   link can be wrong. */
(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  // One shared entry point also reaches lyric pages and the 404 page.
  const find = document.createElement('button');
  find.type = 'button';
  find.className = 'nav-find';
  find.textContent = 'Find something';
  find.setAttribute('aria-haspopup', 'dialog');
  find.setAttribute('aria-expanded', 'false');
  toggle.before(find);
  find.addEventListener('click', async function () {
    setOpen(false);
    find.disabled = true;
    try {
      const guide = await import('/js/site-guide.js');
      document.getElementById('guideLoadError')?.remove();
      find.disabled = false;
      guide.openGuide(find);
    } catch (_) {
      if (!document.getElementById('guideLoadError')) {
        const message = document.createElement('p');
        message.id = 'guideLoadError';
        message.className = 'guide-load-error';
        message.setAttribute('role', 'status');
        message.textContent = 'The guide couldn’t load. Try again, or explore from the menu.';
        links.parentNode.append(message);
      }
    } finally {
      find.disabled = false;
    }
  });

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    links.classList.toggle("is-open", open);
  }

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  toggle.addEventListener("click", function () {
    setOpen(!isOpen());
  });

  // Escape closes and returns the focus to the button that opened it,
  // rather than leaving it stranded inside a panel that is now gone.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // A tap anywhere outside the nav closes it. Taps inside are left
  // alone so following a link is not intercepted.
  document.addEventListener("click", function (e) {
    if (!isOpen()) return;
    if (e.target.closest(".site-nav")) return;
    setOpen(false);
  });

  // Widening the window past the breakpoint hides the button while
  // leaving is-open set, which strands the class and shows the panel
  // again the next time it narrows. Clear it on the way through.
  var wide = window.matchMedia("(min-width: 1081px)");
  var onChange = function (e) {
    if (e.matches) setOpen(false);
  };
  if (wide.addEventListener) {
    wide.addEventListener("change", onChange);
  } else {
    wide.addListener(onChange);
  }
})();

/* Contents bar.
   Standing rule (Jack, 2026-10-18): any "On this page" bar freezes just
   under the site nav while the reader scrolls, so they can jump anywhere
   from anywhere. This keeps the bar under the nav whatever the nav's
   height, and underlines the section in view. Runs on every page that
   has a .page-contents bar; the freezing itself is in css/site.css. */
(function () {
  "use strict";

  var bar = document.querySelector(".page-contents");
  var nav = document.querySelector(".site-nav");
  if (!bar) return;

  // Both heights feed the scroll margin, so a jumped-to heading lands
  // just below the bar instead of under it.
  function setNavHeight() {
    var root = document.documentElement.style;
    if (nav) root.setProperty("--site-nav-h", nav.getBoundingClientRect().height + "px");
    root.setProperty("--page-contents-h", bar.getBoundingClientRect().height + "px");
    showMore();
  }

  // A bar too long for the screen fades at the edge that has more to it.
  function showMore() {
    var more = bar.scrollWidth - bar.clientWidth - bar.scrollLeft > 2;
    bar.classList.toggle("has-more", more);
  }
  bar.addEventListener("scroll", showMore, { passive: true });
  setNavHeight();
  window.addEventListener("resize", setNavHeight);
  // The nav can change height after first paint (the web font arriving,
  // the menu wrapping), so measure again whenever either bar changes size.
  if (window.ResizeObserver) {
    var watch = new ResizeObserver(setNavHeight);
    if (nav) watch.observe(nav);
    watch.observe(bar);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setNavHeight);

  var links = Array.prototype.slice.call(bar.querySelectorAll('a[href^="#"]'));
  var targets = links
    .map(function (link) { return document.getElementById(link.getAttribute("href").slice(1)); })
    .filter(Boolean);
  if (!targets.length) return;

  var lastActive = null;

  // The section in view is the last heading that has passed under the bar.
  function mark() {
    var line = bar.getBoundingClientRect().bottom + Math.min(160, window.innerHeight / 4);
    var current = null;
    targets.forEach(function (t) { if (t.getBoundingClientRect().top <= line) current = t; });
    var active = null;
    links.forEach(function (link) {
      if (current && link.getAttribute("href") === "#" + current.id) {
        link.setAttribute("aria-current", "true");
        active = link;
      } else {
        link.removeAttribute("aria-current");
      }
    });
    // On a phone the bar scrolls sideways; keep the marked link in view
    // without touching the page's own scroll.
    if (active && active !== lastActive && bar.scrollWidth > bar.clientWidth) {
      bar.scrollLeft = active.offsetLeft - bar.offsetLeft - 16;
    }
    lastActive = active;
  }

  var queued = false;
  window.addEventListener("scroll", function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; mark(); });
  }, { passive: true });
  mark();
})();
