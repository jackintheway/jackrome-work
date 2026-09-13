/* Model providers: follow-up selection and specificity classification.

   Two implementations behind one interface:

     mock       local preview and tests. No network. Reads markers in
                the Q5 text so every band and failure can be reviewed:
                  [level:0] .. [level:3]   force a classifier level
                  [followup:inputs]        force a follow-up type
                                           (inputs, outputs, steps, handoff, none)
                  [fail]                   classifier failure (unscored)
                  [slow]                   exceed the deadline
                Without markers, a small keyword heuristic stands in.

     anthropic  the real provider. Not built yet; throws so nothing can
                silently pretend a model ran. Lands with the API step.

   Both return plain data. Respondent text is data, never instructions. */

export class ProviderError extends Error {
  constructor(code, message) {
    super(message || code);
    this.code = code;
  }
}

const FOLLOWUP_TYPES = ["inputs", "outputs", "steps", "handoff", "none"];

function marker(text, name) {
  const m = new RegExp("\\[" + name + "(?::([a-z0-9]+))?\\]", "i").exec(text);
  return m ? (m[1] === undefined ? true : m[1]) : null;
}

function firstSentenceWith(text, words) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    const lower = s.toLowerCase();
    if (words.some((w) => lower.includes(w))) return s.slice(0, 160);
  }
  return sentences[0].slice(0, 160);
}

const CONCRETE = ["spreadsheet", "template", "export", "sheet", "report", "form", "copy", "enter", "count", "reconcile", "intake", "email", "database"];
const AREA_ONLY = ["fundraising", "administration", "efficiency", "operations", "strategic", "capability"];

export function createMockProviders() {
  async function maybeSlow(text) {
    if (marker(text, "slow")) await new Promise((r) => setTimeout(r, 8000));
  }
  return {
    name: "mock",
    async followup(q5) {
      await maybeSlow(q5);
      const forced = marker(q5, "followup");
      if (forced && FOLLOWUP_TYPES.includes(forced)) return { type: forced };
      const lower = q5.toLowerCase();
      if (!/(start with|from our|from the|pull|export)/.test(lower)) return { type: "inputs" };
      if (!/(finished|final|template|report|send)/.test(lower)) return { type: "outputs" };
      return { type: "none" };
    },
    async classify(q5, followupQuestion, followupAnswer) {
      await maybeSlow(q5);
      if (marker(q5, "fail")) throw new ProviderError("mock_failure", "Forced classifier failure");
      const forced = marker(q5, "level");
      const text = q5.replace(/\[[a-z]+(?::[a-z0-9]+)?\]/gi, "").trim();
      const combined = text + (followupAnswer ? " " + followupAnswer : "");
      let level;
      if (forced !== null) {
        level = Number(forced);
      } else {
        const lower = combined.toLowerCase();
        const concrete = CONCRETE.filter((w) => lower.includes(w)).length;
        const area = AREA_ONLY.filter((w) => lower.includes(w)).length;
        if (/conference schedule|ignore the rubric|give this assessment/.test(lower) && concrete === 0) level = 0;
        else if (concrete >= 2 && lower.length >= 60) level = 3;
        else if (concrete >= 1) level = 2;
        else if (area > 0 || lower.length < 60) level = 1;
        else level = 2;
      }
      if (![0, 1, 2, 3].includes(level)) throw new ProviderError("invalid_level", "Mock produced an invalid level");
      const excerpt = level === 0 ? "" : firstSentenceWith(text, CONCRETE);
      return { level, excerpt, model: "mock" };
    },
  };
}

export function createAnthropicProviders() {
  const notReady = () => {
    throw new ProviderError("provider_not_configured", "The Anthropic provider is not built yet. Use AUDIT_PROVIDER=mock.");
  };
  return { name: "anthropic", followup: notReady, classify: notReady };
}

export function createProviders(env) {
  const which = (env.AUDIT_PROVIDER || "").toLowerCase();
  if (which === "mock") return createMockProviders();
  if (which === "anthropic") return createAnthropicProviders();
  throw new ProviderError("provider_not_configured", "Set AUDIT_PROVIDER to mock or anthropic.");
}
