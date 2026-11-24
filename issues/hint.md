# booking-v3 date hint says MM/DD/YYYY while the form reads day-first

**Report count: 33 distinct reports** in ticket #4471's supplied 2026-10-04 export.
Membership is in `evidence/analysis.json`, group `hint`. This is an export snapshot,
not the live queue. Count each report ID once.

## Problem and evidence

`DATE_HINT['booking-v3']` is `MM/DD/YYYY`. For a day-first tenant, the form reads the
tenant's order instead. A user following the field's instructions can book the
wrong date even after the separate shared-parser issue is repaired.

- R-41230: copper.studio, form, tenant es-ES/booking-v3; 6 January became 1 June.
- R-41241: alder.physio, form, tenant de-DE/booking-v3, browser en-US; 6 August
  became 8 June. Browser locale is not the tenant's convention.
- R-41251: pale.harbour, form, tenant pt-PT/booking-v3; 7 January became 1 July.
- 15 were intake-tagged parser and 18 hint; derive cause from tenant/form/channel.

## Reproduce and expected behaviour

Open the booking-v3 date form for alder.physio and follow its MM/DD/YYYY hint for
6 August: enter 08/06/2026. The exported logic describes day-first interpretation
as 8 June. Hint, validation and parsing must agree on the tenant's date convention.
This reproduction follows the exported logic; no live production test is claimed.

## Acceptance criteria

- Generate the hint from the same tenant-aware format used for validation/parsing.
- Test alder.physio, copper.studio and pale.harbour with mismatched browser locales.
- Following the displayed hint must preserve the intended date end to end.
- Keep the shared-parser work and one-day investigation separate.

Source: `src/lib/kb/causes.ts`, `src/lib/data/tenants/`, report JSON.
No fix or deployment is demonstrated. Recompute with `npm run analyze`.
