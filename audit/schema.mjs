/* Shared answer schema for the Workflow Audit Readiness Assessment.

   One file, imported by both the browser (audit.js) and the serverless
   function (netlify/functions/score). The browser uses it for guidance
   and early validation; the function enforces it. Keeping them in one
   place means a limit cannot drift between the two.

   Nothing here is secret: enums, lengths, and field names. Scoring
   weights, the classifier prompt, and storage live in the function.

   Enum values are stable machine names, separate from visible labels.
   Changing a label in the HTML never changes what is stored or scored. */

export const SCHEMA_VERSION = "audit-answers-1";

export const ENUMS = {
  staff: ["under_5", "5_19", "20_50", "over_50", "unknown"],
  frequency: ["daily", "weekly", "monthly", "quarterly", "few_per_year", "unknown"],
  effort: ["under_15m", "15m_under_1h", "1h_under_4h", "4h_plus", "unknown"],
  scope_context: ["main", "several", "unknown"],
  people: ["one", "2_5", "6_plus", "unknown"],
  stall: ["waiting", "chasing", "blank_page", "cleanup", "redoing", "elsewhere", "no_stall", "unknown"],
  repeatability: ["same", "similar", "different", "unknown"],
  sources: ["yes", "some", "unknown"],
  sensitivity: ["yes", "no", "unknown"],
  decision: ["you", "director", "leadership", "board", "other", "unknown"],
  preference: ["ourselves", "someone_else", "not_considered"],
  followup_type: ["inputs", "outputs", "steps", "handoff", "fallback"],
};

// Stall options that cannot be combined with anything else.
export const STALL_EXCLUSIVE = ["no_stall", "unknown"];

export const LIMITS = {
  org: { min: 1, max: 150 },
  website: { min: 0, max: 500 },
  name: { min: 1, max: 150 },
  role: { min: 1, max: 150 },
  q5: { min: 40, max: 2000 },
  followup_answer: { min: 0, max: 1000 },
  effort_note: { min: 0, max: 300 },
  stall_other: { min: 1, max: 500 },
  q10: { min: 1, max: 1000 },
  q12: { min: 1, max: 1000 },
  q13: { min: 0, max: 1000 },
  decision_other: { min: 1, max: 150 },
  q16: { min: 1, max: 1500 },
  email: { min: 3, max: 254 },
};

// Which fields belong to which stage, for the browser's per-stage
// validation and the review panel. The function validates all at once.
export const STAGES = [
  { id: 1, title: "Context", fields: ["org", "website", "name", "role", "staff"] },
  { id: 2, title: "The work", fields: ["q5", "followup", "frequency", "effort", "effort_note", "scope_context", "people", "helpers"] },
  { id: 3, title: "Where it breaks", fields: ["stall", "stall_other", "q10", "repeatability"] },
  { id: 4, title: "What's already there", fields: ["q12", "sources", "q13", "sensitivity"] },
  { id: 5, title: "Readiness and review", fields: ["decision", "decision_other", "q16", "preference", "email"] },
];

export const TOP_LEVEL_FIELDS = [
  "org", "website", "name", "role", "staff",
  "q5", "followup", "frequency", "effort", "effort_note", "scope_context", "people", "helpers",
  "stall", "stall_other", "q10", "repeatability",
  "q12", "sources", "q13", "sensitivity",
  "decision", "decision_other", "q16", "preference", "email",
];

// Plain-language names for error messages. Match the visible labels.
export const FIELD_NAMES = {
  org: "your organization's name",
  website: "the website",
  name: "your name",
  role: "your role",
  staff: "how many people are on staff",
  q5: "the task description",
  followup: "the added detail",
  frequency: "how often it happens",
  effort: "how much staff time goes into one round",
  effort_note: "the time note",
  scope_context: "whether this is the main task or one of several",
  people: "how many people usually work on it",
  stall: "where it usually stalls",
  stall_other: "where else it stalls",
  q10: "what happens when the usual person is out",
  repeatability: "whether the output is the same shape each time",
  q12: "the tools your team already uses",
  sources: "whether you know where the information comes from",
  q13: "what happened when someone tried AI",
  sensitivity: "whether the work touches personal or confidential information",
  decision: "who decides",
  decision_other: "who else decides",
  q16: "what your team would do with the hours",
  preference: "whether you'd rather run it yourselves or have someone run it",
  email: "your email address",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isString(v) {
  return typeof v === "string";
}

function trimmedLength(v) {
  return isString(v) ? v.trim().length : 0;
}

function lengthMessage(field, limit) {
  const name = FIELD_NAMES[field] || field;
  if (limit.min > 1) {
    return "Write at least " + limit.min + " characters for " + name + ".";
  }
  return "Keep " + name + " to " + limit.max + " characters or fewer.";
}

function checkText(errors, answers, field, required) {
  const limit = LIMITS[field];
  const value = answers[field];
  if (value === undefined || value === null || value === "") {
    if (required) errors.push({ field, message: "Enter " + FIELD_NAMES[field] + "." });
    return;
  }
  if (!isString(value)) {
    errors.push({ field, message: "Enter " + FIELD_NAMES[field] + " as text." });
    return;
  }
  const len = trimmedLength(value);
  if (required && len < limit.min) {
    errors.push({ field, message: len === 0 ? "Enter " + FIELD_NAMES[field] + "." : lengthMessage(field, limit) });
    return;
  }
  if (value.length > limit.max) {
    errors.push({ field, message: "Keep " + FIELD_NAMES[field] + " to " + limit.max + " characters or fewer." });
  }
}

function checkEnum(errors, answers, field, message) {
  const value = answers[field];
  if (!ENUMS[field].includes(value)) {
    errors.push({ field, message: message || "Choose " + FIELD_NAMES[field] + "." });
  }
}

/* Accept a bare domain by adding https:// for validation only. The
   entered string is what gets stored. Only http and https are allowed.
   The URL is never fetched. */
export function normalizeWebsite(value) {
  if (!isString(value) || value.trim() === "") return "";
  let candidate = value.trim();
  if (!/^[a-z][a-z0-9+.-]*:/i.test(candidate)) candidate = "https://" + candidate;
  let parsed;
  try {
    parsed = new URL(candidate);
  } catch (_) {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  if (!parsed.hostname || !parsed.hostname.includes(".")) return null;
  return parsed.href;
}

/* Validate a full answer snapshot. Returns { errors, normalized }.
   errors is an array of { field, message }, in stage order.
   normalized holds the values scoring uses; the original strings are
   kept untouched on the snapshot itself. */
export function validateAnswers(answers) {
  const errors = [];
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return { errors: [{ field: "form", message: "Answers are missing." }], normalized: null };
  }
  for (const key of Object.keys(answers)) {
    if (!TOP_LEVEL_FIELDS.includes(key)) {
      errors.push({ field: key, message: "Unexpected field." });
    }
  }

  // Stage 1
  checkText(errors, answers, "org", true);
  checkText(errors, answers, "website", false);
  const websiteNormalized = normalizeWebsite(answers.website);
  if (websiteNormalized === null) {
    errors.push({ field: "website", message: "Enter the website as a web address, like example.org." });
  }
  checkText(errors, answers, "name", true);
  checkText(errors, answers, "role", true);
  checkEnum(errors, answers, "staff");

  // Stage 2
  checkText(errors, answers, "q5", true);
  const followup = answers.followup;
  if (followup !== undefined && followup !== null) {
    if (typeof followup !== "object" || Array.isArray(followup)) {
      errors.push({ field: "followup", message: "The added detail is malformed." });
    } else {
      for (const key of Object.keys(followup)) {
        if (!["type", "answer", "revision"].includes(key)) {
          errors.push({ field: "followup", message: "Unexpected follow-up field." });
        }
      }
      if (!ENUMS.followup_type.includes(followup.type)) {
        errors.push({ field: "followup", message: "The follow-up type is not recognized." });
      }
      if (!isString(followup.answer) || followup.answer.trim().length === 0) {
        errors.push({ field: "followup", message: "The added detail is empty. Remove it or write something." });
      } else if (followup.answer.length > LIMITS.followup_answer.max) {
        errors.push({ field: "followup", message: "Keep the added detail to " + LIMITS.followup_answer.max + " characters or fewer." });
      }
      if (!Number.isInteger(followup.revision) || followup.revision < 0) {
        errors.push({ field: "followup", message: "The follow-up revision is not recognized." });
      }
    }
  }
  checkEnum(errors, answers, "frequency");
  checkEnum(errors, answers, "effort");
  checkText(errors, answers, "effort_note", false);
  checkEnum(errors, answers, "scope_context", "Choose whether this is the main task, one of several, or something you're not sure about.");
  checkEnum(errors, answers, "people");
  if (typeof answers.helpers !== "boolean") {
    errors.push({ field: "helpers", message: "The volunteers or contractors answer is missing." });
  }

  // Stage 3
  const stall = answers.stall;
  if (!Array.isArray(stall) || stall.length === 0) {
    errors.push({ field: "stall", message: "Choose at least one answer for where it usually stalls." });
  } else {
    const bad = stall.filter((v) => !ENUMS.stall.includes(v));
    const unique = new Set(stall);
    if (bad.length || unique.size !== stall.length) {
      errors.push({ field: "stall", message: "One of the stall answers is not recognized." });
    } else {
      const exclusive = stall.filter((v) => STALL_EXCLUSIVE.includes(v));
      if (exclusive.length && stall.length > 1) {
        errors.push({ field: "stall", message: "“It doesn't usually stall” and “Not sure” can't be combined with other answers." });
      }
    }
    if (stall.includes("elsewhere")) {
      checkText(errors, answers, "stall_other", true);
    } else if (answers.stall_other !== undefined && answers.stall_other !== "") {
      errors.push({ field: "stall_other", message: "Remove the “somewhere else” description or choose that option." });
    }
  }
  checkText(errors, answers, "q10", true);
  checkEnum(errors, answers, "repeatability");

  // Stage 4
  checkText(errors, answers, "q12", true);
  checkEnum(errors, answers, "sources");
  checkText(errors, answers, "q13", false);
  checkEnum(errors, answers, "sensitivity");

  // Stage 5
  checkEnum(errors, answers, "decision");
  if (answers.decision === "other") {
    checkText(errors, answers, "decision_other", true);
  } else if (answers.decision_other !== undefined && answers.decision_other !== "") {
    errors.push({ field: "decision_other", message: "Remove the “someone else” description or choose that option." });
  }
  checkText(errors, answers, "q16", true);
  checkEnum(errors, answers, "preference");
  if (!isString(answers.email) || answers.email.trim().length === 0) {
    errors.push({ field: "email", message: "Enter your email address." });
  } else if (answers.email.length > LIMITS.email.max || !EMAIL_RE.test(answers.email.trim())) {
    errors.push({ field: "email", message: "Enter your email address in the form name@example.org." });
  }

  const normalized = errors.length
    ? null
    : {
        website: websiteNormalized || "",
        email: answers.email.trim().toLowerCase(),
        frequency: answers.frequency,
        effort: answers.effort,
        repeatability: answers.repeatability,
        decision: answers.decision,
        sources: answers.sources,
        sensitivity: answers.sensitivity,
        scope_context: answers.scope_context,
        preference: answers.preference,
        stall: [...answers.stall].sort(),
      };
  return { errors, normalized };
}

/* Errors for one stage only, in the order the fields appear. */
export function errorsForStage(errors, stageId) {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) return [];
  return errors
    .filter((e) => stage.fields.includes(e.field))
    .sort((a, b) => stage.fields.indexOf(a.field) - stage.fields.indexOf(b.field));
}
