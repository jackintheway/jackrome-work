import MiniSearch from './vendor/minisearch/minisearch.js';

// Common question scaffolding should not make an unrelated page look relevant.
const STOP = new Set(('a an the and or but if in on at to of for from with without about ' +
  'i im me my we our us you your he his him it its is are was were be been do does did ' +
  'can could would should will have has had how what where when why who which ' +
  'want wants need needs looking look find show tell please some something anything ' +
  'help jack rome website site page pages built make makes use using get start started much').split(' '));
const WORDS = {
  editing: 'edit', editor: 'edit', editors: 'edit', edited: 'edit',
  editting: 'edit',
  training: 'train', teaching: 'teach', learning: 'learn',
  lyrics: 'lyric', words: 'lyric', songs: 'song', albums: 'album',
  videos: 'video', podcasts: 'podcast', cases: 'case', studies: 'study',
  nonprofits: 'nonprofit', 'non-profit': 'nonprofit',
  automated: 'automation', automate: 'automation', automating: 'automation',
  pricing: 'price', costs: 'cost', charges: 'charge', fees: 'fee'
};

export function tokens(value) {
  const words = String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/non-profit/g, 'nonprofit').replace(/artificial intelligence/g, 'ai')
    .replace(/['’]s\b/g, '').replace(/['’]/g, '').match(/[a-z0-9]+/g) || [];
  return [...new Set(words.filter(w => w.length > 1 && !STOP.has(w)).map(w => WORDS[w] || w))];
}

export function createGuideSearch(documents) {
  const byId = new Map(documents.map(d => [d.id, d]));
  const search = new MiniSearch({
    fields: ['title', 'keywords', 'description', 'text'],
    tokenize: tokens,
    processTerm: term => term,
    searchOptions: {boost: {title: 6, keywords: 4, description: 2, text: 0.35}}
  });
  search.addAll(documents);
  return function find(query) {
    // Rates and current availability are not published here. Do not mistake
    // "charge" for "change" or offer a past project as a booking answer.
    if (/\b(pric(?:e|es|ing)|costs?|charg(?:e|es|ing)|fees?|rates?|availab(?:le|ility)|next (?:week|month)|tomorrow)\b/i.test(query)) return [];
    if (/^(?:hi|hello|hey|thanks|thank you)[!.\s]*$/i.test(query.trim())) return [];
    const words = tokens(String(query).slice(0, 240));
    if (!words.length) return [];
    const minimum = Math.ceil(words.length * 0.65);
    const found = search.search(words.join(' '), {
      combineWith: 'OR', prefix: false,
      fuzzy: term => term.length >= 6 ? 0.15 : false
    }).filter(result => new Set(result.queryTerms).size >= minimum);
    // Field scores rank matches; coverage rejects questions we only partly cover.
    // A score is not a probability and is never shown as model confidence.
    const ranked = found.map(result => {
      const doc = byId.get(result.id);
      const titleTerms = tokens(doc.title);
      const titleMatches = words.filter(w => titleTerms.includes(w)).length;
      return {doc, score: result.score * (1 + titleMatches / words.length)};
    }).sort((a, b) => b.score - a.score);
    const seen = new Set();
    return ranked.filter(item => {
      if (item.score < ranked[0].score * 0.30 || seen.has(item.doc.url)) return false;
      const path = item.doc.url.split(/[?#]/)[0];
      if ([...seen].some(url => url.split(/[?#]/)[0] === path ||
          (item.doc.url === path && path !== '/' && url.startsWith(path + '/')))) return false;
      seen.add(item.doc.url);
      return true;
    }).slice(0, 3).map(item => item.doc);
  };
}
