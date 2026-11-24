# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 investigation

This repository contains the supplied export plus a signed review. Nothing here
claims an independently verified production fix. Snapshot counts are not live queue counts.

| Work | Distinct reports | GitHub issue |
| --- | ---: | --- |
| Shared month-first parser | 374 | [#1](https://github.com/piotrwasko/megadev-s01e03/issues/1) |
| booking-v3 hint conflicts with tenant parsing | 33 | [#2](https://github.com/piotrwasko/megadev-s01e03/issues/2) |
| One-day shifts / premature invite; root cause unconfirmed | 5 | [#3](https://github.com/piotrwasko/megadev-s01e03/issues/3) |

427 exported rows contain 412 distinct IDs. The existing classifier's 379 parser
reports include five anomalous bodies; the review does not hide these in a parser
fix. It also does not claim that all five share a proven root cause.

- [Signed review source](src/routes/kb/incidents/4471-review/+page.svx)
- [Rendered review HTML](rendered/kb/incidents/4471-review/index.html)
- [Browser screenshot](evidence/4471-review.png)
- [Computed membership and evidence](evidence/analysis.json)
- [Proposed decision 0002](src/routes/kb/decisions/0002-dedupe-by-evidence/+page.svx)

The HTML is actual Svelte server rendering, not a manually transcribed mock-up.
Client assets hydrate the exported interactive controls. Serve the `rendered/`
directory at the web root to use links, styles and interactions. GitHub's file
viewer shows the HTML source rather than hosting the website; no public website
deployment is claimed or required for this repository artifact.

### Rebuild and check

Requires Node.js 24 or newer. After approving package downloads in a fresh setup:

```sh
npm ci
npm test
npm run analyze
npm run build
python3 -m http.server 8763 --bind 127.0.0.1 --directory rendered
```

Open `http://127.0.0.1:8763/kb/incidents/4471-review/`. The new page displays
computed counts, existing charts and explorer, and a desk reference derived from
its frontmatter signature. The accepted 0001 decision remains untouched.

### Evidence limits

The export ends on 4 October. Revalidate against the desk's current views before
using it as today's operational state. The received/merged timeline distinguishes
arrival from desk processing; a July merge spike does not date the onset of a bug.
Reproduction steps in the issues are derived from the export, not live product tests.

### Engineering update after first submission

The course's live desk update reports #4471 closed 5 October: parser fixed by
`fix(dates): parse dd/mm for eu locales`; hint won't fix because booking-v3 was
retired. Accordingly #1 is closed **completed**, #2 **not planned**. Issue #3
remains an open investigation; the update does not prove its symptoms resolved.
See [update provenance](evidence/engineering-update.md).
