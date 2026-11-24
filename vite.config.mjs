import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ isSsrBuild }) => ({
  resolve: { alias: { '#lib': fileURLToPath(new URL('./src/lib', import.meta.url)) } },
  plugins: [
    ...mdsvex({
      extensions: ['.svx'],
      templates: { runbook: fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url)) },
      select_template: (_id, metadata) => metadata.layout,
    }),
    svelte({ extensions: ['.svelte', '.svx'] }),
  ],
  build: isSsrBuild ? {
    outDir: '.build',
    rollupOptions: { output: { entryFileNames: 'pages.mjs' } },
  } : {
    outDir: '.build-client',
    cssCodeSplit: false,
    rollupOptions: {
      input: 'scripts/client.mjs',
      output: { entryFileNames: 'client.js', assetFileNames: '[name][extname]' },
    },
  },
}));
