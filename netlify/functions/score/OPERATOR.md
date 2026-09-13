# Running the assessment: operator notes

For Jack. How to read submissions, what to do when something didn't
arrive, how to turn the model off, and what the retention promise
requires each month. No secrets in this file; the repo is public.

## Where things live

- Canonical record: Netlify Blobs, store `audit-submissions-production`,
  one immutable JSON per submission under `records/<id>`, plus a small
  `status/<id>` side record for the summary email state.
- Reading copy: the Netlify Forms submission named
  `workflow-audit-summary`, which sends the notification email. Summary
  fields first, every answer verbatim below.
- Deploy previews use `audit-submissions-preview`, never production.

## Environment variables (names only)

Set in Netlify, scoped to Functions. Values never go in the repo.

| Name | Meaning |
| --- | --- |
| `ANTHROPIC_API_KEY` | key from the `audit-jackrome` workspace; its own key, not the pilot's |
| `AUDIT_PROVIDER` | `anthropic` in production; `mock` only for local preview |
| `AUDIT_MODEL` | optional override of the pinned model |
| `AUDIT_STORE` | `blobs` |
| `AUDIT_NOTIFIER` | `forms` |
| `AUDIT_FORMS_ORIGIN` | `https://jackrome.work` (the site's own origin; never derived from a request) |
| `AUDIT_SUMMARY_KEY` | random secret for the summary signature |
| `AUDIT_SUMMARY_KEY_VERSION` | `1`; bump when rotating, keep old values for verification |
| `AUDIT_ALLOWED_ORIGINS` | `https://audit.jackrome.work,https://jackrome.work` |
| `AI_ENABLED` | `true`; set `false` to stop all model calls |

## Reading a submission

The email is the daily path. It carries flags first, then who, score,
band, dimensions, then every answer verbatim. It is a reading copy.

The exact record, including Q16 with its original whitespace, comes
from the export tool. In your own terminal:

```
export NETLIFY_SITE_ID=...
export NETLIFY_AUTH_TOKEN=...
node tools/audit-export.mjs
```

Exports land in `_private/exports/<timestamp>/`, gitignored. One JSON
(exact) and one Markdown (readable) per record.

## When an email didn't arrive

The record is still there. Netlify's spam filter may have held the
summary: check Forms, then the spam list, in the Netlify dashboard.
Then run the reconciliation to see which records never got an
acknowledged summary:

```
node tools/audit-export.mjs --reconcile
```

A summary can be resent by hand from the export; two emails for one
record is possible, one record for one submission is guaranteed.

## Trusting a summary

Every summary carries a signature over its scannable fields. To check
one, save its fields as JSON and run:

```
export AUDIT_SUMMARY_KEY=...
node tools/audit-export.mjs --verify summary.json
```

An unsigned or badly signed summary is not a result. The Blobs record is.

## Turning the model off

Set `AI_ENABLED` to `false` in Netlify and redeploy. Submissions keep
being saved as unscored, visitors see "Your answers are saved" with the
booking link, and the follow-up button offers the fixed question. The
Anthropic workspace's $10 monthly limit is the hard ceiling on spend.

## Retention, monthly

The privacy notice promises deletion of unconverted records within
about 90 days, at a monthly review. Each month:

1. Export, read, and note any record older than 90 days that has not
   become client work.
2. Delete its Blobs record and status entry, its Forms submission in
   the Netlify dashboard, the notification email in Gmail, and any
   local export.
3. Records that became client work move under the client agreement.

Nothing deletes automatically in v1.

## Keys

- The Anthropic key `audit-netlify` expires 2027-09-19 at 7 pm ET. A
  lapsed key means unscored results, not lost submissions. Create the
  replacement in the same workspace and update the Netlify variable.
- Rotate `AUDIT_SUMMARY_KEY` by adding a new version, not replacing;
  old summaries verify against the old version.
