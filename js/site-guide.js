import {createGuideSearch} from './guide-search.js';

let dialog, input, results, status, examples, foot, search, pending, opener, debounce;
const EMAIL = 'mailto:jackintheway@gmail.com?subject=Question%20from%20jackrome.work';

function element(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function bookTitle(el, text) {
  // Descriptions are source text, never HTML supplied by a query or an index.
  const parts = text.split('A Course in Miracles');
  parts.forEach((part, i) => {
    if (i) el.append(element('em', '', 'A Course in Miracles'));
    el.append(document.createTextNode(part));
  });
}

function emailLink() {
  const link = element('a', 'guide-email', 'Email me');
  link.href = EMAIL;
  return link;
}

function safeDestination(value) {
  const url = new URL(value, location.origin);
  if (url.origin !== location.origin || !value.startsWith('/') || value.startsWith('//')) return null;
  return url.pathname + url.search + url.hash;
}

function render() {
  clearTimeout(debounce);
  if (!search) return;
  const query = input.value.trim();
  results.replaceChildren();
  foot.hidden = false;
  examples.hidden = Boolean(query);
  if (!query) {
    status.textContent = 'Choose an example or describe what you need.';
    return;
  }
  const matches = search(query);
  if (!matches.length) {
    foot.hidden = true;
    status.textContent = 'I couldn’t find a close match here.';
    const note = element('p', 'guide-empty', 'Try emailing me. I’d be happy to talk with you about it.');
    results.append(note, emailLink());
    return;
  }
  status.textContent = matches.length === 1 ? 'A place to start:' : 'A few places to start:';
  const list = element('ul', 'guide-results-list');
  matches.forEach(match => {
    const href = safeDestination(match.url);
    if (!href) return;
    const li = element('li', 'guide-result');
    const link = element('a', 'guide-result-link');
    link.href = href;
    link.append(element('span', 'guide-result-kind', match.category));
    const title = element('span', 'guide-result-title');
    bookTitle(title, match.title);
    const arrow = element('span', 'guide-result-arrow', '→');
    arrow.setAttribute('aria-hidden', 'true');
    title.append(arrow);
    link.append(title);
    if (match.description) {
      const summary = element('span', 'guide-result-description');
      bookTitle(summary, match.description);
      link.append(summary);
    }
    link.addEventListener('click', () => dialog.close());
    li.append(link);
    list.append(li);
  });
  results.append(list);
}

function loadIndex() {
  if (search) return Promise.resolve();
  if (pending) return pending;
  status.textContent = 'Loading the site guide…';
  pending = fetch('/js/guide-index.json', {credentials: 'omit'})
    .then(response => {
      if (!response.ok) throw new Error('Guide index unavailable');
      return response.json();
    }).then(documents => {
      search = createGuideSearch(documents.filter(d => safeDestination(d.url)));
      render();
    }).catch(() => {
      foot.hidden = true;
      status.textContent = 'The site guide couldn’t load.';
      results.replaceChildren(element('p', 'guide-empty', 'You can still explore from the menu or email me.'));
      const retry = element('button', 'guide-example', 'Try again');
      retry.type = 'button';
      retry.addEventListener('click', () => { results.replaceChildren(); loadIndex(); });
      results.append(retry, emailLink());
    }).finally(() => { pending = null; });
  return pending;
}

function build() {
  dialog = element('dialog', 'site-guide');
  dialog.id = 'siteGuide';
  dialog.setAttribute('aria-labelledby', 'guideTitle');
  const head = element('div', 'guide-heading');
  const title = element('h2', '', 'Find something');
  title.id = 'guideTitle';
  const close = element('button', 'guide-close', 'Close');
  close.type = 'button';
  close.addEventListener('click', () => dialog.close());
  head.append(title, close);
  const body = element('div', 'guide-body');
  const form = element('form', 'guide-form');
  const label = element('label', 'guide-label', 'What are you looking for?');
  label.htmlFor = 'guideQuery';
  input = element('input', 'guide-input');
  input.id = 'guideQuery';
  input.type = 'search';
  input.maxLength = 240;
  input.autocomplete = 'off';
  input.setAttribute('enterkeyhint', 'search');
  input.setAttribute('aria-describedby', 'guideHint');
  input.placeholder = 'A question, a topic, or a title';
  input.autofocus = true;
  const hint = element('p', 'guide-hint', 'Search my pages, projects, and creative work.');
  hint.id = 'guideHint';
  form.append(label, input, hint);
  form.addEventListener('submit', event => { event.preventDefault(); render(); });
  input.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(render, 180); });
  examples = element('div', 'guide-examples');
  examples.append(element('p', '', 'Try asking:'));
  ['Help our nonprofit with AI', 'Built with Codex', 'Lyrics from Wayspace'].forEach(text => {
    const button = element('button', 'guide-example', text);
    button.type = 'button';
    button.addEventListener('click', () => { input.value = text; input.focus(); render(); });
    examples.append(button);
  });
  status = element('p', 'guide-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  results = element('div', 'guide-results');
  foot = element('p', 'guide-foot');
  foot.append(document.createTextNode('Prefer to ask me? '), emailLink());
  body.append(form, examples, status, results, foot);
  dialog.append(head, body);
  dialog.addEventListener('keydown', event => {
    // A search input can consume Escape to clear its value first.
    // Here Escape consistently dismisses the guide on the first press.
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    clearTimeout(debounce);
    document.documentElement.classList.remove('guide-is-open');
    opener?.setAttribute('aria-expanded', 'false');
    opener?.focus();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  document.body.append(dialog);
}

export function openGuide(trigger) {
  if (!dialog) build();
  opener = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  document.documentElement.classList.add('guide-is-open');
  if (!dialog.open) dialog.showModal();
  input.focus();
  loadIndex();
}
