import { readFileSync, readdirSync } from 'node:fs';

const data = new URL('../src/lib/data/', import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, data), 'utf8'));
export const reports = read('reports-4471.json');
export const notes = read('desk-notes.json');
export const tenants = new Map(readdirSync(new URL('tenants/', data)).map((file) => {
  const tenant = read(`tenants/${file}`);
  return [tenant.handle, tenant];
}));
export const tenantOf = (r) => tenants.get(r.tenant);
