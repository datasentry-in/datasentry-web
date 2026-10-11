# CLAUDE.md

DataSentry's website (datasentry.in) and the DPDP Console mock, in one Next.js 16
App Router codebase. No backend, no database, no tests. Product scope lives in
`docs/dpdp-mvp-scope.md`.

## Commands

```bash
npm run dev          # dev server
npm run build        # production build — run before every commit
npx tsc --noEmit     # type-check
npx eslint <paths>   # lint the files you changed
```

`src/modules/web/components/CookieConsent.tsx` has two pre-existing lint errors,
so `npx eslint src` fails on files you did not touch. Lint changed paths instead.

## Structure: two modules, one codebase

```
src/app/                 routes only — keep page files thin
  layout.tsx             shared <html>: fonts, Google Analytics
  globals.css            Tailwind + marketing theme
  (web)/                 datasentry.in/*      route group, no URL segment; cookie banner
  app/                   datasentry.in/app/*  product layout: console.css, noindex
    dpdp-demo/           the clickable DPDP mock
src/modules/web/         marketing components
src/modules/app/ui/      console design system: ui.tsx, Brand.tsx, console.css
src/modules/app/dpdp/    the DPDP product
  components/            shell, sign-in, data map, countdowns, discovery interview
  types.ts, statute.ts   domain types and statutory dates — real, reused by a live app
  routes.ts              DEMO_BASE + demoPath()
  mock/                  illustrative data; the only part a live app replaces
```

- **Web and app don't import each other.** Shared needs go through the root layout.
- **The live app** goes at `src/app/app/dpdp/` (→ `/app/dpdp`), beside `dpdp-demo/`, reusing
  `@/modules/app` and swapping `dpdp/mock` for a real data layer.
- **Links inside the mock use `demoPath(...)`**, never a hard-coded `/app/dpdp-demo`.
- `/demo` 308-redirects to `/app/dpdp-demo` (`next.config.ts`).

## Console design system (`src/modules/app/ui`)

- **Tokens** are CSS variables on `.demo-root` in `console.css` (`--ds-*`). Use them, not
  raw hex, in components.
- **Type roles**: `ds-display` (tight Inter headlines), `ds-label` (DM Mono uppercase
  labels, column heads), `ds-figure` (DM Mono tabular numbers). Every headline number is
  `ds-figure`. Tailwind's `font-mono` does **not** work inside `.demo-root` — a font reset
  outranks it — so use these classes.
- **Colour carries meaning only**: red = overdue/unlawful, amber = needs attention,
  green = settled, blue = the one primary action. Everything else is grey.
- **Radius**: the marketing `globals.css` forces `border-radius: 0 !important` on every
  element. `console.css` restores the Tailwind `rounded-*` scale inside `.demo-root`; add
  any new radius class there or it renders square.
- **Brand**: `Wordmark` (the DATA|SENTRY logo) and `ProductLockup` ("DPDP Console by
  [wordmark]") in `Brand.tsx`. There is no square "DS" mark — it was removed on purpose.

## Rules that are easy to break

- **No frozen dates.** Pages are prerendered, so anything time-dependent (countdowns,
  "last sign-in") renders client-side after mount — `setTimeout`/`setInterval` or
  `useSyncExternalStore` — to avoid hydration mismatches. Read the real clock.
- **`react-hooks/set-state-in-effect` is enforced.** Don't call `setState` synchronously
  in an effect body; set it from a timer callback or use `useSyncExternalStore`.
- **Respect reduced motion.** Animated visuals render their settled state when
  `prefers-reduced-motion: reduce` is set.
- **Model fills fields; the rule engine draws conclusions.** Copy and UI in the mock keep
  that line: AI-suggested content carries provenance; findings cite a provision.
- **Statutory citations need Gazette verification** before any generated document is
  relied on (see the scope doc).

## Gotchas

- **Stale CSS in dev.** Turbopack sometimes keeps serving an old CSS chunk after an
  in-place edit to `globals.css`/`console.css`. Check the served chunk
  (`curl` the `_next/static/...css` and grep for your change); restart `npm run dev` if
  it is stale. Don't trust the browser alone.
- **Hidden tabs throttle `requestAnimationFrame`** to ~1 fps, so canvas animations look
  frozen in a background preview pane. That's the browser, not the code.
- After moving routes, delete `.next/types` before `tsc` — stale generated types
  reference the old paths.

## Shipping

- `main` deploys to production (datasentry.in) via Vercel. Merging a PR puts it live.
- Commit to a branch and open a PR to `main`; run `npm run build` first.
