import { render } from 'svelte/server';

const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });

export function renderPages() {
  return Object.entries(pages).map(([path, mod]) => {
    const result = render(mod.default);
    const route = path.replace('/src/routes/', '').replace('/+page.svx', '');
    return { route, html: `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/style.css">${result.head}</head><body>${result.body}<script type="module" src="/assets/client.js"></script></body></html>\n` };
  });
}
