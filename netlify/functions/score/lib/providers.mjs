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

     anthropic  the real provider, through the official SDK with
                structured outputs. Retries are off so the function's
                own deadlines are the only timing that applies. The
                model is pinned by AUDIT_MODEL, defaulting to the one
                the spec names; verify availability in the pilot.

   Both return plain data. Respondent text is data, never instructions. */

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { CLASSIFIER_SYSTEM, classifierUserMessage, FOLLOWUP_SYSTEM, followupUserMessage, PROMPT_VERSION } from "./prompts.mjs";

export { PROMPT_VERSION };

export class ProviderError extends Error {
  constructor(code, message) {
    super(message || code);
    this.code = code;
  }
}

const FOLLOWUP_TYPES = ["inputs", "outputs", "steps", "handoff", "none"];

export const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

/* ---------------- mock ---------------- */

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

/* ---------------- anthropic ---------------- */

const ClassifierOutput = z.object({
  level: z.number().int().min(0).max(3),
  excerpt: z.string().max(200),
});

const FollowupOutput = z.object({
  type: z.enum(["inputs", "outputs", "steps", "handoff", "none"]),
});

function mapError(err) {
  // Most specific first. Connection errors are a subclass of APIError in
  // this SDK, so they are checked before the general case.
  if (err instanceof ProviderError) return err;
  if (err instanceof Anthropic.RateLimitError) return new ProviderError("rate_limited", "Provider rate limit");
  if (err instanceof Anthropic.AuthenticationError) return new ProviderError("auth", "Provider credential rejected");
  if (err instanceof Anthropic.NotFoundError) return new ProviderError("model_not_found", "Model not available");
  if (err instanceof Anthropic.APIConnectionTimeoutError) return new ProviderError("timeout", "Provider deadline exceeded");
  if (err instanceof Anthropic.APIConnectionError) return new ProviderError("connection", "Provider unreachable");
  if (err instanceof Anthropic.APIError) return new ProviderError("api_" + (err.status || "error"), err.type || "Provider error");
  return new ProviderError("error", String(err && err.message));
}

export function createAnthropicProviders(env, opts) {
  const model = (env && env.AUDIT_MODEL) || DEFAULT_MODEL;
  // No apiKey here on purpose: the SDK reads ANTHROPIC_API_KEY from the
  // environment. The value never passes through application code.
  const client = new Anthropic({ maxRetries: 0, ...(opts && opts.clientOptions) });
  const usage = { calls: 0, input_tokens: 0, output_tokens: 0 };

  async function parse(params, timeoutMs) {
    usage.calls += 1;
    const response = await client.messages.parse(params, { timeout: timeoutMs });
    if (response.usage) {
      usage.input_tokens += response.usage.input_tokens || 0;
      usage.output_tokens += response.usage.output_tokens || 0;
    }
    if (response.stop_reason === "refusal") throw new ProviderError("refusal", "Provider declined the request");
    if (response.stop_reason === "max_tokens") throw new ProviderError("truncated", "Provider output truncated");
    if (!response.parsed_output) throw new ProviderError("invalid_output", "Provider output did not match the schema");
    return response;
  }

  return {
    name: "anthropic",
    model,
    usage,
    async followup(q5) {
      try {
        const response = await parse({
          model,
          max_tokens: 128,
          temperature: 0,
          system: FOLLOWUP_SYSTEM,
          messages: [{ role: "user", content: followupUserMessage(q5) }],
          output_config: { format: zodOutputFormat(FollowupOutput) },
        }, 2500);
        return { type: response.parsed_output.type, model: response.model };
      } catch (err) {
        throw mapError(err);
      }
    },
    async classify(q5, followupQuestion, followupAnswer) {
      try {
        const response = await parse({
          model,
          max_tokens: 256,
          temperature: 0,
          system: CLASSIFIER_SYSTEM,
          messages: [{ role: "user", content: classifierUserMessage(q5, followupQuestion, followupAnswer) }],
          output_config: { format: zodOutputFormat(ClassifierOutput) },
        }, 5000);
        const out = response.parsed_output;
        return { level: out.level, excerpt: out.excerpt, model: response.model };
      } catch (err) {
        throw mapError(err);
      }
    },
  };
}

export function createProviders(env) {
  const which = (env.AUDIT_PROVIDER || "").toLowerCase();
  if (which === "mock") return createMockProviders();
  if (which === "anthropic") return createAnthropicProviders(env);
  throw new ProviderError("provider_not_configured", "Set AUDIT_PROVIDER to mock or anthropic.");
}
