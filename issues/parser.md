# Shared date parser treats day-first tenant dates as month-first

**Report count: 374 distinct reports** in ticket #4471's supplied 2026-10-04 export.
This is a snapshot, not a claim about the current live queue. Count by report ID,
not export row; full membership is in `evidence/analysis.json`, group `parser`.

## Problem and evidence

The shared parser reads every date month first even when a tenant writes day first
(`src/lib/kb/causes.ts`, `dayFirst`, `causeOf`). The tenant directory is authoritative
for tenant settings; `meta.browserLocale` and `meta.intakeTag` are intake guesses.

- R-41200, harbour.dental, app: "Our 7 April reminder went out on 4 July."
- R-41201 corrects its example to 4 July becoming 7 April. Keep both reports;
  do not treat subject similarity or a correction as a duplicate ID.
- The old classifier counts 379 as parser; five anomalous reports are excluded
  here and tracked separately. They do not demonstrate month/day transposition.
- Of these 374 reports, 351 were tagged parser and 23 hint. Tags are not causes.

## Reproduce and expected behaviour

With a day-first tenant such as harbour.dental (en-GB, booking-v2), submit 07/04/2026
as 7 April through the affected app/email path. The exported logic describes it
being read as July 4. It must remain April 7. This is a reproduction derived from
the exported logic and reports, not a claim that a live production test ran.

## Acceptance criteria

- Parse dates with the tenant's explicit convention, or use an unambiguous date representation.
- Cover app/email and booking-v2 form paths, including mismatched browser locale.
- Test ambiguous dates, days above 12, invalid dates and month-first controls.
- Do not mark the booking-v3 hint issue or one-day investigation fixed by this change.

No shipped fix is shown by the export. Source: `src/lib/data/reports-4471.json`,
`src/lib/data/tenants/`, `src/lib/kb/causes.ts`. Recompute with `npm run analyze`.
