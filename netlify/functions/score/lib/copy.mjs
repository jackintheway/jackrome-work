/* Fixed public copy: follow-up questions, band copy, observations,
   breakdown labels. Every visitor-facing sentence the function returns
   comes from here. No free text from a visitor or a model is ever
   interpolated. Source: BUILD-SPEC.md sections 4 and 6, COPY-CATALOGUE.md.

   Sentences marked (draft) are generated copy Jack has approved in
   behavior but not yet reviewed word by word in context. */

export const TEMPLATE_VERSION = "audit-copy-1";

export const BOOKING_URL = "https://calendly.com/jackintheway/chat-with-jack-rome";

export const FOLLOWUP_QUESTIONS = {
  inputs: "What information do you start with, and where does it come from?",
  outputs: "What do you need to have finished when this task is done?",
  steps: "What are the main steps between starting this task and finishing it?",
  handoff: "Who passes the work to someone else, and what do they pass along?",
  fallback: "What information goes into this task, and what comes out when it's finished?",
};

export const BAND_COPY = {
  starting_point: {
    headline: "There's a clear starting point here.",
    paragraph: "You've described a task with a recurring pattern. We can talk through the task and what we'd need to check before changing how it's done.",
  },
  needs_narrowing: {
    headline: "There's a task here worth looking at more closely.",
    paragraph: "Your answers give us a place to begin. A conversation can help fill in the details and work out what an audit would cover.",
  },
  early_conversation: {
    headline: "Worth a conversation before anything gets scoped.",
    paragraph: "We may need to spend some time describing the work together. You're welcome to start there.",
  },
  unscored: {
    headline: "Your answers are saved.",
    paragraph: "The automatic assessment wasn't available this time. You can still book a conversation about the work you've described.",
  },
};

export const LOW_SPECIFICITY_HEADLINE = "A little more detail would help.";

export const MISSED_BAND_REASON = {
  specificity: "The task description still needs narrowing.",
  repeatability: "The output varies enough that we'd need to understand the pattern.",
};

const FREQUENCY_WORDS = {
  daily: "daily",
  weekly: "weekly",
  monthly: "monthly",
  quarterly: "quarterly",
  few_per_year: "a few times a year",
};

const EFFORT_WORDS = {
  under_15m: "under 15 minutes",
  "15m_under_1h": "15 minutes to under 1 hour",
  "1h_under_4h": "1 to under 4 hours",
  "4h_plus": "4 hours or more",
};

function dataObservation(sensitivity) {
  if (sensitivity === "yes") return "You said this work touches personal or confidential information.";
  if (sensitivity === "unknown") return "You weren't sure whether this work touches personal or confidential information.";
  return null;
}

function effortObservation(frequency, effort) {
  const f = FREQUENCY_WORDS[frequency];
  const e = EFFORT_WORDS[effort];
  if (f && e) return "You said this task happens " + f + " and takes " + e + " of your team's working time each round.";
  if (!f && e) return "You weren't sure how often this task happens. You estimated " + e + " of working time per round.";
  if (f && !e) return "You said this task happens " + f + ", but weren't sure how much working time it takes.";
  return "You weren't sure how often this task happens or how much working time it takes.";
}

function repeatabilityObservation(repeatability) {
  if (repeatability === "same") return "You said the output has the same shape each round.";
  if (repeatability === "similar") return "You said the output has a similar shape, with some variation each round.";
  if (repeatability === "different") return "You said the output has a different shape each round.";
  return "You weren't sure how much the output changes from one round to the next.";
}

/* Exactly two observations. Data first when it applies, then effort;
   otherwise effort then repeatability. */
export function observations(n) {
  const data = dataObservation(n.sensitivity);
  if (data) return [data, effortObservation(n.frequency, n.effort)];
  return [effortObservation(n.frequency, n.effort), repeatabilityObservation(n.repeatability)];
}

export const METHODOLOGY = "This score reflects the answers you gave about one workflow. It helps prepare an audit conversation. AI suitability, costs, and any possible savings would need a closer look. Unknown answers mean there is more to find out.";

export const DIMENSION_LABELS = {
  A: "Workflow detail",
  B: "Recurrence and staff effort",
  C: "Repeatability",
  D: "Decision path identified",
  E: "Information and data awareness",
};

export const BOOKING_CONTEXT = "We'll have 45 minutes to talk about what you're trying to do, where you're getting stuck, and whether I can help.";

/* Assemble the public result from a scoring outcome and normalized
   answers. This is everything the browser is allowed to see. */
export function assembleResult(scoring, n) {
  const band = scoring.band;
  let headline = BAND_COPY[band].headline;
  if (band === "needs_narrowing" && scoring.level !== null && scoring.level <= 1) {
    headline = LOW_SPECIFICITY_HEADLINE;
  }
  const max = { A: 35, B: 25, C: 20, D: 10, E: 10 };
  const breakdown = ["A", "B", "C", "D", "E"].map((k) => ({
    key: k,
    label: DIMENSION_LABELS[k],
    points: scoring.dimensions[k],
    max: max[k],
    note: k === "A" && scoring.dimensions[k] === null ? "Not assessed" : null,
  }));
  return {
    status: band === "unscored" ? "unscored" : "scored",
    score: scoring.total,
    band,
    headline,
    paragraph: BAND_COPY[band].paragraph,
    reason: scoring.reason ? MISSED_BAND_REASON[scoring.reason] : null,
    observations: observations(n),
    breakdown,
    methodology: METHODOLOGY,
    booking_url: BOOKING_URL,
    booking_context: BOOKING_CONTEXT,
  };
}
