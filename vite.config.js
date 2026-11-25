import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// JSX goes through src/brand, which swaps every typed "LML" for the wordmark SVG.
export default defineConfig({
  plugins: [react({ jsxImportSource: 'lml-brand' })],
  resolve: { alias: { 'lml-brand': fileURLToPath(new URL('./src/brand', import.meta.url)) } }
});
