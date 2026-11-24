import { mkdir, writeFile } from 'node:fs/promises';
import { reports, notes, tenantOf } from './data.mjs';
import { findings } from '../src/lib/kb/investigation.ts';
import { uniqueById } from '../src/lib/kb/causes.ts';

const groups = findings(reports, tenantOf, notes.oneDayMove);
const summary = {
  scope: 'Supplied 2026-10-04 export; not live queue counts',
  rows: reports.length,
  unique: uniqueById(reports).length,
  groups: groups.map(({ reports: members, ...g }) => ({
    ...g,
    ids: members.map((r) => r.id),
    evidence: members.slice(0, 3).map((r) => ({ ...r, resolvedTenant: tenantOf(r) })),
  })),
};
await mkdir('evidence', { recursive: true });
await writeFile('evidence/analysis.json', JSON.stringify(summary, null, 2) + '\n');
for (const g of groups) console.log(`${g.cause}: ${g.count} reports (${g.first} through ${g.last})`);
