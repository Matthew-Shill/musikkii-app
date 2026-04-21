/// <reference types="vite/client" />

/** Injected in `vite.config.ts`; always `''` in production. */
declare const __APP_DEV_SEED_PASSWORD__: string;

declare module '*.svg' {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Local dev only: shared password for seeded test users + DevAccountSwitcher (never set in prod). */
  readonly VITE_DEV_SEED_PASSWORD?: string;
}
