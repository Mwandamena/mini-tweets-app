import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@twitter-ds/tokens': resolve(__dirname, '../../packages/tokens/src/index.ts'),
      '@twitter-ds/theme':  resolve(__dirname, '../../packages/theme/src/index.ts'),
      '@twitter-ds/ui':     resolve(__dirname, '../../packages/ui/src/index.ts'),
    },
  },
});
