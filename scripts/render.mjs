import { mkdir, writeFile, cp } from 'node:fs/promises';
import { renderPages } from '../.build/pages.mjs';

await mkdir('rendered/assets', { recursive: true });
await cp('.build-client', 'rendered/assets', { recursive: true });
for (const { route, html } of renderPages()) {
  await mkdir(`rendered/${route}`, { recursive: true });
  await writeFile(`rendered/${route}/index.html`, html);
  console.log(`Rendered /${route}`);
}
