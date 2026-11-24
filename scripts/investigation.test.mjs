import test from 'node:test';
import assert from 'node:assert/strict';
import { reports, notes, tenantOf, tenants } from './data.mjs';
import { causeOf, uniqueById } from '../src/lib/kb/causes.ts';
import { findings } from '../src/lib/kb/investigation.ts';

test('export overlaps contain identical copies, and unique reports reconcile', () => {
  const seen = new Map();
  for (const r of reports) {
    if (seen.has(r.id)) assert.deepEqual(r, seen.get(r.id));
    seen.set(r.id, r);
  }
  assert.equal(reports.length, 427);
  assert.equal(seen.size, 412);
  const groups = findings(reports, tenantOf, notes.oneDayMove);
  assert.deepEqual(Object.fromEntries(groups.map((g) => [g.cause, g.count])), {
    parser: 374, hint: 33, 'day-shift': 5,
  });
  const ids = groups.flatMap((g) => g.reports.map((r) => r.id));
  assert.equal(new Set(ids).size, 412);
});

test('tenant settings and channel, not browser locale or intake tag, drive form distinction', () => {
  const r = reports.find((r) => r.id === 'R-41241');
  assert.equal(r.meta.browserLocale, 'en-US');
  assert.equal(tenantOf(r).locale, 'de-DE');
  assert.equal(causeOf(r, tenantOf(r)), 'hint');
  assert.equal(causeOf({ ...r, channel: 'app' }, tenantOf(r)), 'parser');
  assert.equal(causeOf(r, undefined), null);
  assert.equal(causeOf(r, { ...tenants.get(r.tenant), locale: 'en-US' }), null);
});

test('five anomaly IDs exist and are never counted twice', () => {
  const ids = new Set(uniqueById(reports).map((r) => r.id));
  assert.equal(new Set(notes.oneDayMove).size, 5);
  for (const id of notes.oneDayMove) assert.ok(ids.has(id));
  const anomalies = findings(reports, tenantOf, notes.oneDayMove).find((g) => g.cause === 'day-shift');
  assert.deepEqual(new Set(anomalies.reports.map((r) => r.id)), new Set(notes.oneDayMove));
});
