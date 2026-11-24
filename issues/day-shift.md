# Investigate one-day date shifts and invite delivery before booking

**Report count: 5 distinct reports** in ticket #4471's supplied 2026-10-04 export.
These are not demonstrated month/day swaps. Keep this investigation separate
from the parser and booking-v3 hint fixes. It is provisional: split again if
investigation establishes multiple mechanisms. No timezone root cause is confirmed.

## All five reports

- R-41202: kettle.books, email, 2026-04-02 — "Invite says Tuesday 12 May. Calendar
  says Monday 11 May. My client turned up on the Monday. We had coffee."
- R-41209: alder.physio, app, 2026-04-06 — "Every booking in June is one day off.
  Only June. Why only June."
- R-41236: nine.lanterns, app, 2026-04-20 — "The invite arrived before I made the
  booking. I would like to know how."
- R-41344: pale.harbour, email, 2026-06-12 — "Client in Lisbon got Tuesday. Client
  in Toronto got Monday. Same meeting. We held it twice."
- R-41620: lantern.row, email, 2026-10-04 — "Tuesday 6 October showed as Monday.
  I moved it myself. I have stopped reporting these but my colleague says it helps you."

## Why the existing classification is insufficient

`desk-notes.json` flags these IDs. `causeOf` assigns them parser because it only
sees tenant and channel. Their bodies do not show month/day inversion; a tenant's
locale cannot prove their root cause. All five were intake-tagged parser, which
likewise is not proof. Remove their IDs from the parser count to avoid double counting.

## Investigation and acceptance criteria

- Collect original booking, invite and calendar timestamps with timezone IDs,
  offsets, date-only values and event/delivery identifiers.
- Reproduce Lisbon/Toronto boundaries, June/DST transitions and date-only conversions.
- Trace R-41236's booking creation and delivery events separately; do not assume
  its reported ordering has the same cause as a one-day shift.
- Distinguish expected local display of one instant from an actual changed booking day.
- Establish a mechanism before claiming a fix; split the issue if causes differ.
- Add regression tests for each confirmed mechanism and link the original IDs.

Scope is the export, not today's queue. Source: report JSON and desk notes.
See the signed review page and `evidence/analysis.json`, group `day-shift`.
