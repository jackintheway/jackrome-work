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
