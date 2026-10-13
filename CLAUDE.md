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
  nav.ts                 modules and intake pages — the sidebar, ⌘K palette and shortcuts all read it
  attention.ts           what needs attention, derived from register/clocks/tasks — bell, overview, palette
  routes.ts              DEMO_BASE + demoPath()
  time.ts                IST formatting; parseDisplayDate/relativeTo for "due in 3 days"
  useNow.ts              the real clock, null until mounted
  mock/                  illustrative data; the only part a live app replaces
    clients.ts           clientData(slug) — every page reads a client's data through this
    quadrant.ts, meridian.ts  per-client datasets; Northstar's lives in data.ts
```

- **Web and app don't import each other.** Shared needs go through the root layout.
- **The live app** goes at `src/app/app/dpdp/` (→ `/app/dpdp`), beside `dpdp-demo/`, reusing
  `@/modules/app` and swapping `dpdp/mock` for a real data layer.
- **Pages read a client's data through `clientData(org.slug)`** (`mock/clients.ts`), never a
  dataset constant — that is how Northstar's data stopped leaking onto other clients. Components that
  show records take an `org` prop. A client still in discovery has `registerBuilt: false`: modules
  built from the register render `ModulePending`, never another client's data.
- **Links inside the mock use `demoPath(...)`**, never a hard-coded `/app/dpdp-demo`. Public pages are
  `demoPath('p', org, ...)`; they sit outside the sign-in gate and are white-labelled by overriding the
  `--ds-accent*` tokens with the client's colour (`CLIENT_THEME`).
- `/demo` 308-redirects to `/app/dpdp-demo` (`next.config.ts`).

## Console design system (`src/modules/app/ui`)

- **Tokens** are CSS variables on `.demo-root` in `console.css` (`--ds-*`). Use them, not
  raw hex, in components.
- **Type roles**: one typeface. `ds-display` (tight Inter headlines), `ds-figure` (Inter with
  tabular figures — every headline number), `ds-id` (DM Mono — record IDs like PA-01, G-06, and
  nothing else). `ds-label` is sentence case inside table heads; its mono uppercase voice survives
  only on the sign-in screen (`.ds-signin`), which keeps its signed-off look. Tailwind's
  `font-mono` does **not** work inside `.demo-root` — a font reset outranks it.
- **Pages read like documents (Notion).** A `Panel` that holds an object you work in (table, row
  list, map) is `flush` and framed; any other `Panel` is a heading over content with no frame.
  Sections are `space-y-8` apart; prose stops at ~46rem (`p.leading-relaxed`, `.ds-prose`).
- **Stat strips only on the overview and portfolio.** Module pages carry their figures as one row
  of properties under the title (`Facts`/`Fact`; notes on hover).
- **White canvas, hairlines, no shadows.** Grey is for hover, the active nav item, table heads
  and disabled inputs — never a surface. `PageHeader` is one title plus one line:
  no eyebrow, no second greyed-out headline. There is no breadcrumb: the header's client switcher
  and the highlighted sidebar item say where you are.
- **Type scale**: 11 / 12 / 13 / 14px for UI, 15px for document body, 17px section headings, 30px
  page titles. Prose paragraphs are 14px. No half-pixel sizes.
- **Nav icons** live in `Icons.tsx` (inline SVG, 16px, `currentColor`).
- **Flag things with the accent bar, never a tinted box.** `Callout` (2px bar + title + action;
  `boxed` sets it in a plain hairline card for page-level alerts), `Card tone=…` and `DemoNote` all
  use the `.ds-bar` / `.ds-bar-<tone>` classes in `console.css`. No pink/amber/blue panels, no
  coloured borders on cards.
- **Labels inside a page body** use `ds-meta` (sentence case). `ds-label` (mono uppercase) is for
  table column heads and the brand only.
- **People and dates**: `Person`/`Avatar` (neutral grey initials) for owners; `When` for due dates
  and event times — exact date in the prerendered HTML, relative after mount, red only when overdue.
- **New pages or alerts** go in `nav.ts` / `attention.ts`; the sidebar, bell, ⌘K
  palette and `g`-then-key shortcuts (`Shortcuts.tsx`, `?` lists them) pick them up.
- **Overlays** use `Dialog` (`ui/Dialog.tsx`), which portals into `.demo-root` — the header's
  backdrop blur traps `position: fixed`. Confirmations use `useToast()` (`ui/Toast.tsx`).
- **Row actions** (e.g. `RemindButton`) appear on hover: `ds-row` on the row, `ds-row-link` on its
  main link (it stretches over the row), `ds-row-actions` on the buttons. Always visible on touch.
- **Empty lists** render `EmptyState` with what it means, never a blank panel.
- **Records open beside their list** in a `Sheet` (`ui/Sheet.tsx`) — details, linked findings and the
  `AuditTimeline` — so the list keeps its place. RoPA and the gap report do this today.
- **Lists are worklists**: `useTableView` (`ui/useTableView.ts`) gives saved views with counts
  (`ViewTabs`), a filter box (`FilterInput`) and sortable heads (`SortHead`).
- **Edits happen in place** (RoPA lawful basis and retention): the row turns consultant-reviewed, an
  audit entry records old → new (`Change`), and a toast says what the rule engine does with it.
- **One `NextStep` per page at most**, in yellow, with a button named for the action ("Draft the
  Board intimation", not "Open breach register").
- **Show change, not just status**: `TrendChart` for the score at each review (time-scaled, month labels, values on hover), `SlaBar` for a request's
  response window, the draining bar in `Countdown`. Values the browser fills in show a `Skeleton`
  until mounted.
- **Presenter mode** (account menu; `ui/prefs.ts`, `PRESENTER`) shows or hides every `DemoNote`.
  Design notes are for walkthroughs; a client demo runs with them off.
- **Comments** (`Discussion.tsx`, `COMMENTS`/`PEOPLE` in mock) sit on records — side panels and
  documents — with @mentions and a per-comment *Internal* / *Shared with client* switch.
- **Documents are pages** (`DocumentPage.tsx`): properties, sections with provenance (editing an
  AI-drafted section marks it reviewed), comments and versions beside the text, and a sign-off flow
  (draft → approver signs off → sent; locked once sent). The Board intimation is the first:
  `[org]/breach/intimation`.
- **Plain language first, citation second**: say what is wrong in words, then the provision as a
  chip or in brackets — "no one named to handle complaints (s.13)", never "s.13 breach".
- **The data flow map** (`DataFlowMap.tsx`, data in `FLOW_NODES`/`FLOW_EDGES`) draws three trust
  boundaries (own systems · third parties in India · outside India) with the India border; every node
  carries its kind, region and safeguard (DPA / no DPA / terms only / statutory / exempt), every flow
  its data and lawful basis. Name data categories as they are — the DPDP Act has no "sensitive
  personal data" class, so never label anything sensitive.
- **The audit trail** (`AUDIT` in mock data) records field changes as old → new, never "record updated".
- **The DataSentry wordmark links to datasentry.in** (`BrandLink`); "DPDP Console" links home.
- **Shell layout**: header = "DPDP Console" (a cell as wide as the sidebar; the pipe after it sits on the
  sidebar's border line) + `ClientSwitcher` (`ClientMark`, client name, phase,
  details and the other clients) + search, alerts, account. Inside a client, `Sidebar` is the left
  rail: collapsible to icons (`[`, state in localStorage via `sidebarState.ts`), "Powered by
  DataSentry" at its foot. Pages without a sidebar carry "Powered by" in the footer.
- **Overview order**: next step → "What needs doing" (one worklist) → "Where things stand" (score,
  headline figures, module cards) → context (role determination, recent activity). Action before status.
- **Colour carries meaning only, and stays calm**: red = overdue/unlawful, amber = needs attention,
  green = settled, blue = the one primary action. A stat or property that is bad gets a *dot*, not
  red text; aim for one red thing per page. The header carries no alert chip — the bell holds it.
- **Radius**: the marketing `globals.css` forces `border-radius: 0 !important` on every
  element. `console.css` restores the Tailwind `rounded-*` scale inside `.demo-root`; add
  any new radius class there or it renders square.
- **Brand colours** are blue `#009FE3` and yellow `#FFED00`. Yellow is never text (it vanishes on
  white): it is a highlight — the rule under "Console" and "Sentry", the design-note bar.
- **Brand**: one two-colour type lockup (`TwoTone` in `Brand.tsx`) for both names — first word in
  brand blue, second in ink with the yellow rule beneath. `ProductLockup` sets "DPDP Console"; `Wordmark`
  / `BrandLink` set "Data Sentry" (title case, two words) and link to datasentry.in. There is no square
  "DS" mark and no image logo inside the console.
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
