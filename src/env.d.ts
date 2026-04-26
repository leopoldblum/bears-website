/// <reference types="astro/client" />

// Injected at build time by `vite.define` in astro.config.mjs (see ADMIN_BUILD
// branch). Lets pages/middleware branch on which deploy variant they're in
// without consulting process.env at runtime (Cloudflare Workers don't expose
// it reliably).
interface ImportMetaEnv {
  readonly ADMIN_BUILD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Plain `tsc --noEmit` doesn't resolve Astro's component compiler, so bare TS
// can't find the `.astro` modules we re-export from barrel files. This shim
// lets `tsc` type-check those imports; real typing comes from `astro check`
// which understands each component's props.
declare module '*.astro' {
  const component: (_props: Record<string, unknown>) => unknown;
  export default component;
}
