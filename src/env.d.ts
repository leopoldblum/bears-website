/// <reference types="astro/client" />

// Plain `tsc --noEmit` doesn't resolve Astro's component compiler, so bare TS
// can't find the `.astro` modules we re-export from barrel files. This shim
// lets `tsc` type-check those imports; real typing comes from `astro check`
// which understands each component's props.
declare module '*.astro' {
  const component: (_props: Record<string, unknown>) => unknown;
  export default component;
}
