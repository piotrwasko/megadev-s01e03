import { causeOf, uniqueById, type Report, type Tenant } from './causes.ts';

export type Finding = 'parser' | 'hint' | 'day-shift' | 'unplaced';

// The desk's tenant classifier cannot explain these report bodies. Keep the
// observed symptom separate; this is not a confirmed timezone diagnosis.
export function reviewedCause(r: Report, tenant: Tenant | undefined, anomalyIds: readonly string[]): Finding {
  if (anomalyIds.includes(r.id)) return 'day-shift';
  return causeOf(r, tenant) ?? 'unplaced';
}

export function findings(reports: Report[], tenantOf: (r: Report) => Tenant | undefined, anomalyIds: readonly string[]) {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === 4471);
  return ['parser', 'hint', 'day-shift', 'unplaced'].map((cause) => {
    const members = merged.filter((r) => reviewedCause(r, tenantOf(r), anomalyIds) === cause);
    const dates = members.map((r) => r.receivedAt.slice(0, 10)).sort();
    return { cause, reports: members, count: members.length, first: dates[0], last: dates.at(-1) };
  }).filter((g) => g.count > 0);
}
