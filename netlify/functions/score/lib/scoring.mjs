/* Scoring rubric, version workflow-readiness-1.

   Deterministic arithmetic over normalized answers plus one classifier
   level. Mirrors check_scoring.py in the preparation package exactly;
   if the two ever disagree, the spec (BUILD-SPEC.md section 5) decides.

   The score is not a secret, but it is server-side so the client can
   never supply it. Nothing here estimates savings, hours, or money. */

export const RUBRIC_VERSION = "workflow-readiness-1";

export const SPECIFICITY = { 0: 0, 1: 11, 2: 23, 3: 35 };
export const FREQUENCY = { daily: 10, weekly: 8, monthly: 5, quarterly: 3, few_per_year: 1, unknown: 0 };
export const EFFORT = { under_15m: 1, "15m_under_1h": 5, "1h_under_4h": 10, "4h_plus": 15, unknown: 0 };
export const REPEATABILITY = { same: 20, similar: 12, different: 4, unknown: 0 };
export const DECISION = { you: 10, director: 10, leadership: 10, board: 10, other: 10, unknown: 0 };
export const SOURCES = { yes: 5, some: 3, unknown: 0 };
export const SENSITIVITY = { yes: 5, no: 5, unknown: 0 };

export const MAX = { A: 35, B: 25, C: 20, D: 10, E: 10 };

export function bandFor(total, level, repeatability) {
  if (level === null || level === undefined) return "unscored";
  if (total >= 70 && level >= 2 && (repeatability === "same" || repeatability === "similar")) {
    return "starting_point";
  }
  return total >= 40 ? "needs_narrowing" : "early_conversation";
}

/* level: integer 0..3, or null when the classifier failed.
   n: the normalized answers from the shared schema. */
export function score(level, n) {
  const A = level === null || level === undefined ? null : SPECIFICITY[level];
  const B = FREQUENCY[n.frequency] + EFFORT[n.effort];
  const C = REPEATABILITY[n.repeatability];
  const D = DECISION[n.decision];
  const E = SOURCES[n.sources] + SENSITIVITY[n.sensitivity];
  const total = A === null ? null : A + B + C + D + E;
  const band = bandFor(total, A === null ? null : level, n.repeatability);

  // Why a score of 70 or more still missed the highest band, if it did.
  // Specificity wins when both apply, per the spec.
  let reason = null;
  if (band === "needs_narrowing" && total !== null && total >= 70) {
    if (level < 2) reason = "specificity";
    else reason = "repeatability";
  }

  return {
    rubric_version: RUBRIC_VERSION,
    level: A === null ? null : level,
    dimensions: { A, B, C, D, E },
    total,
    band,
    reason,
  };
}

/* Review flags for Jack. Guidance for his read, never public. */
export function flags(n, level, classifierStatus, summaryStatus) {
  const out = [];
  if (n.sensitivity === "yes") out.push({ code: "sensitive_yes", label: "Personal or confidential data mentioned" });
  if (n.sensitivity === "unknown") out.push({ code: "sensitive_unknown", label: "Data sensitivity unknown" });
  if (n.sources === "unknown") out.push({ code: "sources_unknown", label: "Information sources unknown" });
  if (n.decision === "board") out.push({ code: "decision_board", label: "Collective decision process; discuss it without assuming delay" });
  if (n.decision === "unknown") out.push({ code: "decision_unknown", label: "Decision path unknown" });
  if (n.preference === "someone_else") out.push({ code: "prefers_support", label: "Prefers ongoing operational support; discuss service fit" });
  if (n.effort === "under_15m") out.push({ code: "brief_task", label: "Brief task per round. Consider frequency and burden; not a paid-work rejection" });
  if (n.scope_context === "main") out.push({ code: "scope_main", label: "Focused request. Does not establish there are no other useful tasks" });
  if (n.scope_context === "several") out.push({ code: "scope_several", label: "Broader work mentioned. Extent and relationship of the other tasks unknown" });
  if (n.scope_context === "unknown") out.push({ code: "scope_unknown", label: "Wider scope unknown" });
  if (classifierStatus !== "ok") out.push({ code: "classifier_failed", label: "Classifier unavailable or invalid; manual assessment needed" });
  else if (level <= 1) out.push({ code: "needs_clarification", label: "Task needs clarification" });
  if (summaryStatus && summaryStatus !== "acknowledged") out.push({ code: "summary_" + summaryStatus, label: "Summary notification " + summaryStatus + "; operator reconciliation needed" });

  // Private review prompts for the brief-task combinations (PAID-FIT.md).
  if (n.effort === "under_15m" && n.scope_context === "main") {
    out.push({ code: "review_prompt", label: "Check whether the scope supports the paid audit or whether a smaller next step would be enough" });
  }
  if (n.effort === "under_15m" && n.scope_context === "several") {
    out.push({ code: "review_prompt", label: "Ask what the other tasks are and whether they belong in one audit" });
  }
  return out;
}
