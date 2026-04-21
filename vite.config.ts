import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

/** Project root (directory containing this file), not `process.cwd()`. */
const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, root, '');
  const bridgedDevSeedPassword =
    mode === 'development'
      ? (fileEnv.VITE_DEV_SEED_PASSWORD || fileEnv.DEV_SEED_PASSWORD || '').trim()
      : '';

  return {
    /** Ensures `.env.local` is loaded from the app root even if `npm run dev` uses another cwd. */
    envDir: root,
    define: {
      /** Dev-only: empty string in production builds. See `getDevSeedPassword()` in DevAccountSwitcher. */
      __APP_DEV_SEED_PASSWORD__: JSON.stringify(bridgedDevSeedPassword),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(root, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  };
});
