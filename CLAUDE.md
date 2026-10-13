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
      (console)/         consultant console — sign-in gate + DemoShell; [org]/<module>
      (public)/p/[org]/  client-branded public pages: privacy centre, request, incident report
src/modules/web/         marketing components
src/modules/app/ui/      console design system: ui.tsx, Brand.tsx, Icons.tsx, console.css
src/modules/app/dpdp/    the DPDP product
  components/            shell, sign-in, data map, countdowns, discovery interview, command palette
  types.ts, statute.ts   domain types, statutory dates and the data principal's rights — real, reused by a live app
  nav.ts                 modules and intake pages — the sidebar, breadcrumb and ⌘K palette all read it
  attention.ts           what needs attention, derived from register/clocks/tasks — bell, overview, palette
  routes.ts              DEMO_BASE + demoPath()
  time.ts                IST formatting; parseDisplayDate/relativeTo for "due in 3 days"
  useNow.ts              the real clock, null until mounted
  mock/                  illustrative data; the only part a live app replaces
```

- **Web and app don't import each other.** Shared needs go through the root layout.
- **The live app** goes at `src/app/app/dpdp/` (→ `/app/dpdp`), beside `dpdp-demo/`, reusing
  `@/modules/app` and swapping `dpdp/mock` for a real data layer.
- **Links inside the mock use `demoPath(...)`**, never a hard-coded `/app/dpdp-demo`. Public pages are
  `demoPath('p', org, ...)`; they sit outside the sign-in gate and are white-labelled by overriding the
  `--ds-accent*` tokens with the client's colour (`CLIENT_THEME`).
- `/demo` 308-redirects to `/app/dpdp-demo` (`next.config.ts`).

## Console design system (`src/modules/app/ui`)

- **Tokens** are CSS variables on `.demo-root` in `console.css` (`--ds-*`). Use them, not
  raw hex, in components.
- **Type roles**: `ds-display` (tight Inter headlines), `ds-label` (DM Mono uppercase
  labels, column heads), `ds-figure` (DM Mono tabular numbers). Every headline number is
  `ds-figure`. Tailwind's `font-mono` does **not** work inside `.demo-root` — a font reset
  outranks it — so use these classes.
- **White canvas, hairlines, no shadows.** Grey is for hover, the active nav item, table heads
  and disabled inputs — never a surface. Stats sit in one strip (`gap-px` grid on a
  border-coloured background), not as separate cards. `PageHeader` is one title plus one line:
  no eyebrow, no second greyed-out headline — the breadcrumb says where you are.
- **Type scale**: 11 / 12 / 13 / 14px plus the display size. No half-pixel sizes.
- **Nav icons** live in `Icons.tsx` (inline SVG, 16px, `currentColor`).
- **Flag things with the accent bar, never a tinted box.** `Callout` (2px bar + title + action;
  `boxed` sets it in a plain hairline card for page-level alerts), `Card tone=…` and `DemoNote` all
  use the `.ds-bar` / `.ds-bar-<tone>` classes in `console.css`. No pink/amber/blue panels, no
  coloured borders on cards.
- **Labels inside a page body** use `ds-meta` (sentence case). `ds-label` (mono uppercase) is for
  table column heads and the brand only.
- **People and dates**: `Person`/`Avatar` (neutral grey initials) for owners; `When` for due dates
  and event times — exact date in the prerendered HTML, relative after mount, red when overdue,
  amber within a week.
- **New pages or alerts** go in `nav.ts` / `attention.ts`; the sidebar, breadcrumb, bell and ⌘K
  palette pick them up. Overlays that must escape the header portal into `.demo-root` (the
  header's backdrop blur traps `position: fixed`).
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
- **No integrations and no file imports in MVP** (`docs/dpdp-mvp-scope.md`, "Data intake without
  integrations"). Don't add upload, export or connector flows to the mock. Every fact is *declared*
  (interview, check-in), *observed* (consultant walkthrough) or *attested* (owner, on a task) — label it
  with `BasisTag`, and never present an attestation as verified.
- **Timestamps from user actions** use `time.ts` inside event handlers, never during render.
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
