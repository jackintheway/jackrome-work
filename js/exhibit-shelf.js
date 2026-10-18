/* The exhibit shelf: pick a tile and its exhibit opens below.
   Without JavaScript every exhibit shows, stacked. A link to anything
   inside an exhibit (#handoff-demo, #graft-demo) opens that exhibit first. */
(() => {
  const shelf = document.querySelector('.exhibit-shelf');
  if (!shelf) return;
  const tiles = [...shelf.querySelectorAll('.shelf-tile')];
  const panels = [...shelf.querySelectorAll('.shelf-panel')];
  if (!tiles.length) return;

  function open(tile) {
    tiles.forEach(t => t.setAttribute('aria-pressed', String(t === tile)));
    panels.forEach(panel => { panel.hidden = panel.id !== tile.getAttribute('aria-controls'); });
  }

  function tileForHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id && document.getElementById(id);
    const panel = target && target.closest('.shelf-panel');
    return panel && tiles.find(t => t.getAttribute('aria-controls') === panel.id);
  }

  tiles.forEach(tile => tile.addEventListener('click', () => open(tile)));
  shelf.querySelector('.shelf-tiles').hidden = false;
  shelf.classList.add('is-interactive');

  const linked = tileForHash();
  open(linked || tiles[0]);
  if (linked) document.getElementById(decodeURIComponent(location.hash.slice(1))).scrollIntoView();

  window.addEventListener('hashchange', () => {
    const tile = tileForHash();
    if (!tile) return;
    open(tile);
    document.getElementById(decodeURIComponent(location.hash.slice(1))).scrollIntoView();
  });
})();
