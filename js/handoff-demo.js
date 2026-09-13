/* Reveal a recorded example. All content remains readable without JavaScript. */
(() => {
  const demo = document.getElementById('handoff-demo');
  if (!demo) return;
  const steps = [...demo.querySelectorAll('.handoff-step')];
  const panels = [...demo.querySelectorAll('.handoff-panel')];

  function selectStep(selected) {
    steps.forEach(step => step.setAttribute('aria-pressed', String(step === selected)));
    panels.forEach(panel => { panel.hidden = panel.id !== selected.getAttribute('aria-controls'); });
  }

  steps.forEach(step => step.addEventListener('click', () => selectStep(step)));
  selectStep(steps[0]);
  demo.querySelector('.handoff-steps').hidden = false;
  demo.classList.add('is-interactive');

  const copy = document.getElementById('copyHandoff');
  const status = document.getElementById('handoffCopyStatus');
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    const parts = [...demo.querySelectorAll('.handoff-note > div')].map(part =>
      `${part.querySelector('dt').textContent}\n${part.querySelector('dd').textContent}`
    );
    const note = ['Website handoff example: September 12, 2026 checkpoint', ...parts].join('\n\n');
    try {
      await navigator.clipboard.writeText(note);
      status.textContent = 'Note copied.';
    } catch {
      status.textContent = 'Select the note above to copy it manually.';
    }
  });
})();
