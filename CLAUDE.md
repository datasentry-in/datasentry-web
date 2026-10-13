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
      (console)/         consultant console — sign-in gate + DemoShell; inbox, assigned, [org]/<module>
      (public)/p/[org]/  client-branded public pages: privacy centre, request, incident report
src/modules/web/         marketing components
src/modules/app/ui/      console design system: ui.tsx, Brand.tsx, Icons.tsx, console.css
src/modules/app/dpdp/    the DPDP product
  components/            shell, sign-in, data map, countdowns, discovery interview, command palette
  types.ts               every domain type, incl. ClientData (the shape a live data layer returns)
  statute.ts             statutory dates and the data principal's rights — real, reused by a live app
  routeData.ts           loadClient(params) — resolves a route's client or 404s; orgParams for static params
  sla.ts                 responseWindow / lateRequests — the one live calculation of request deadlines
  score.ts               readiness score bands (colour, verdict)
  nav.ts                 modules and intake pages — the sidebar, ⌘K palette and shortcuts all read it
  attention.ts           what needs attention, derived from register/clocks/tasks — bell, overview, palette
  workStatus.ts          finding/task/request statuses and severities → WorkRow glyphs (with hover labels)
  inbox.ts               the inbox: others' changes and comments across clients; unread state per viewer
  assigned.ts            the consultant's work across clients (requests, intimations, reviews, check-ins…)
  routes.ts              DEMO_BASE + demoPath()
  time.ts                IST formatting; parseDisplayDate/relativeTo for "due in 3 days"
  useNow.ts              the real clock (shared per tick rate), null while hydrating
  mock/                  illustrative data; the only part a live app replaces
    clients.ts           the facade: ORGS (with counts computed from data), findOrg/getOrg, clientData,
                         clientTheme, currentUser, TEAM, auditFor, personFor, publicCentre
    quadrant.ts, meridian.ts  per-client datasets; Northstar's lives in data.ts
```

- **Web and app don't import each other.** Shared needs go through the root layout.
- **The live app** goes at `src/app/app/dpdp/` (→ `/app/dpdp`), beside `dpdp-demo/`, reusing
  `@/modules/app` and swapping `dpdp/mock` for a real data layer.
- **Only `mock/clients.ts` imports `mock/data.ts`.** Everything else goes through the facade, and
  types come from `types.ts`. Client pages start `const { org, d } = await loadClient(params);` —
  static params live once in `[org]/layout.tsx` with `dynamicParams = false`, so an unknown client
  is a 404, never Northstar. Counts on `Org` are computed from the client's data (one source of
  truth); request lateness is never stored — it is live from `sla.ts` (`RequestsLive.tsx`). Components that
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
  Sections are `space-y-8` apart; prose stops at ~46rem (`p.leading-relaxed`).
- **Stat strips only on the overview and portfolio.** Module pages carry their figures as one row
  of properties under the title (`Facts`/`Fact`; notes on hover).
- **White canvas, hairlines, no shadows.** Grey is for hover, the active nav item, table heads
  and disabled inputs — never a surface. `PageHeader` is one title plus one line:
  no eyebrow, no second greyed-out headline. There is no breadcrumb: the header's client switcher
  and the highlighted sidebar item say where you are.
- **Type scale**: 11 / 12 / 13 / 14px for UI, 15px for document body, 17px section headings, 20px
  worklist titles, 30px page titles. Prose paragraphs are 14px. No half-pixel sizes.
- **Nav icons** live in `Icons.tsx` (inline SVG, 16px, `currentColor`).
- **Flag things with the accent bar, never a tinted box.** `.ds-bar` / `.ds-bar-<tone>` in
  `console.css` is a plain hairline card (the same frame as a plain `Card`) with a 2px coloured bar
  inset on the left. `Callout` (bar + title + action), `Card tone=…` and `DemoNote` all use it, so the
  frame is never added by hand — don't wrap a `.ds-bar` in `Box` or another border. No pink/amber/blue
  panels, no coloured borders on cards.
- **Labels inside a page body** use `ds-meta` (sentence case). `ds-label` (mono uppercase) is for
  table column heads and the brand only.
- **People and dates**: `Person`/`Avatar` (neutral grey initials) for owners; `When` for due dates
  and event times — exact date in the prerendered HTML, relative after mount, red only when overdue.
  One date per row: the relative form, with the exact date on hover (detail panels may show both).
- **The sidebar speaks the statute.** Modules and intake pages map one-to-one to DPDP compliance
  vocabulary (RoPA, notice & consent, data principal requests, breach register, evidence pack…). Never
  merge, hide or rename them into generic product terms. Cross-cutting views (Inbox, Assigned to me) sit in their
  own section above "Modules" and name every item in the same vocabulary.
- **Across clients comes first.** Inbox (`g i`) and Assigned to me (`g m`) sit at the console root, above the
  modules in the sidebar, which is on every page and never drops the modules. Inbox = what *others* changed or said (audit trail +
  comments); running clocks stay in the bell. Assigned to me = the consultant's side; owners' work is Tasks.
  The sidebar counts unread inbox items and late work only. Read state is per viewer (`ui/storedSet.ts`).
- **New pages or alerts** go in `nav.ts` / `attention.ts`; the sidebar, bell, ⌘K
  palette and `g`-then-key shortcuts (`Shortcuts.tsx`, `?` lists them) pick them up.
- **Overlays** use `Dialog` / `Sheet`, both on `useOverlay`: portal into `.demo-root` (the header's
  backdrop blur traps `position: fixed`), focus in, Tab trapped, focus restored, Escape ignored when an
  inner control already handled it (`preventDefault`). Menus use `useClosable` (Escape, focus return).
  Confirmations use `useToast()`.
- **Layering**: `ui/` is generic and never imports `dpdp/`. Domain chips (`SeverityTag`,
  `ProvenanceTag`, `BasisTag`) live in `dpdp/components/Tags.tsx`; `ScoreBlock` in `dpdp/components`.
- **No dead buttons**: `Button` is a link (`as="link"`) or a real `<button>`. An action the mock
  shows but does not perform is a `MockButton`, which says so when clicked.
- **Zero is never flagged**: `Stat`/`Fact` drop the tone dot for a value of 0.
- **Owners**: `personFor(owners, role)` gives `Person` props; never re-implement `owners[r] ?? r`.
- **Histories** render through `ui/Timeline` (`AuditTimeline` for audit entries).
- **One shape for a work item** (`ui/WorkRow.tsx`): findings, tasks, requests and the overview worklist
  are all `WorkRow`s — priority · ID · status · title · labels · due · owner. Status and severity are
  glyphs (`StatusIcon`, `PriorityIcon`), not pills; owners are an `OwnerAvatar` with name and role on
  hover (`ds-tip`); titles stay on one line; due is one relative date. `WorkList` is a size container:
  rows lay out by the list's width (two lines on a phone). Group with `WorkGroup`. Registers with many
  columns (RoPA) stay tables.
- **Row actions** (e.g. `RemindButton`) appear on hover: `ds-row` on the row, `ds-row-link` on its
  main link (it stretches over the row), `ds-row-actions` on the buttons. Always visible on touch. In a
  `WorkRow` they float in over the end of the labels, so they take no width until shown.
- **Empty lists** render `EmptyState` with what it means, never a blank panel.
- **Records open beside their list** in a `Sheet` (`ui/Sheet.tsx`), laid out as an issue view (after
  Jira): `meta` is the key line (ID · client · module), then the title, then `actions` — a `StatusButton`
  first (with a menu where the status can change here), then the record's actions. The body is a
  `SheetDetails` box of `SheetField` label/value rows, `SheetSection`s (Description, Evidence…; linked
  records in a `SheetList`), and `SheetActivity` last with `SheetTab`s (Comments, History). RoPA, the gap
  report, tasks (with the attest form), requests and the data flow map all use it.
- **Two page types (70/30).** *Worklists* (gap report, tasks, DSR desk, RoPA) are Linear-style: a
  compact `ListHeader` (title, what the list is behind an info button, one line of context), then the
  list — no paragraph of explanation, no `NextStep`, no properties row that repeats the view counts.
  *Documents* (the overview, notices, the Board intimation) are Notion-style with `PageHeader`.
  Pages a client's staff use are guided.
- **Lists are worklists**: `useTableView` (`ui/useTableView.ts`) keeps saved views with counts, search,
  field filters, order and grouping; `FilterBar` (`ui/FilterBar.tsx`) draws them in one bar — views on
  the left; + Filter (field, then value; active filters as removable chips), search and `DisplayMenu`
  (grouping, ordering) on the right. Anything narrower than a saved view — one owner, one status — is a
  filter, not a view. Register tables (RoPA) keep `SortHead` chevrons.
- **Lists answer the keyboard** (`ui/useListKeys.ts`): `j`/`k` (↓/↑ inside the list) move focus row
  to row, Enter opens, `x` selects (the gutter checkbox does too) and `BulkBar` floats in with the bulk
  actions, `s` changes status (a `Menu` under the row; for tasks it opens the attest sheet), Escape clears.
  Right-click opens the row's `Menu` (`ui/Menu.tsx`: `useMenu().openAt` / `openBelow`). `Shortcuts` listens
  in the capture phase and claims the `g` sequence keys, so a list never acts on "g s"; lists ignore
  `defaultPrevented` keys, typing, and anything pressed while a dialog, sheet or menu is open. Pass the
  `WorkList` a `ref` and give rows a `rowId` (WorkRow defaults it to `id`).
- **Edits happen in place** (RoPA lawful basis and retention): the row turns consultant-reviewed, an
  audit entry records old → new (`Change`), and a toast says what the rule engine does with it.
- **`NextStep` lives on the overview only**, in yellow, with a button named for the action ("Draft the
  Board intimation", not "Open breach register"). A module's own action sits where its object is (the
  Board intimation button is in the breach clock card).
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
- **Plain language first, citation second**: say what is wrong in words, then the provision —
  "no one named to handle complaints (s.13)", never "s.13 breach". `CiteLink` is quiet grey text on a
  hairline underline, blue only on hover: blue belongs to the primary action.
- **The data flow map** (`DataFlowMap.tsx`, data in `FLOW_NODES`/`FLOW_EDGES`) draws three trust
  boundaries (own systems · third parties in India · outside India) with the India border; every node
  carries its kind, region and safeguard (DPA / no DPA / terms only / statutory / exempt), every flow
  its data and lawful basis. Name data categories as they are — the DPDP Act has no "sensitive
  personal data" class, so never label anything sensitive.
- **Data flow maps — the standard (decided 13 Oct 2026).** A map is a *graph derived from the register*
  (discovery → RoPA → nodes and flows, with the rule engine's findings attached), laid out by ELK and drawn
  with React Flow — never hand-placed, never authored as diagram text. Edits by prompt are typed operations on
  the register (add/update/remove a system or flow), previewed with the rule engine's consequences, audited
  old → new; the map re-lays itself out. Mermaid/D2 only ever come *out* of the graph as generated exports
  (post-MVP). Today: `[org]/flows/elk` (`DataFlowElk.tsx`) — `elkjs` layered, trust zones as nested groups
  pinned by partition, orthogonal routing, sized labels, two passes (the second keeps the first's order and
  stacks each zone from the top) — while `[org]/flows` still shows the hand-placed `DataFlowMap.tsx`, which it
  is to replace. Gaps: `flowNodes`/`flowEdges` in the mock are still written by hand beside the RoPA rather
  than derived from it; ELK should run in a web worker; elkjs is EPL-2.0 — check before shipping.
- **Motion** (tokens and keyframes at the end of `console.css`): quick, subtle, transform/opacity only,
  ease-out in and faster out, all off under reduced motion. Every page eases in (`ds-page-in`: title,
  then body 40ms behind, a 4px rise over `--ds-dur-page` 200ms — keep it that short). Headline numbers
  pop in (`ds-num-in`) and live values fade in over their skeleton (`ds-fade-in`) on the first page of
  a visit only; after that the page is `ds-settled` (`ui/useSettled.ts`). Overlays and menus
  exit before unmounting (`data-state="closing"`; `useClosable` for menus, Dialog/Sheet handle their own),
  menus grow from their corner (`ds-origin-tr/tl`), `ViewTabs` slides one pill, accordions use
  `ds-collapse`. Never `transition: all`.
- **The audit trail** (`AUDIT` in mock data) records field changes as old → new, never "record updated".
- **Known debt**: dates in the mock are display strings ("15 Nov 2026") re-parsed with
  `parseDisplayDate`; a live data layer should store ISO dates and format at render.
- **The DataSentry wordmark links to datasentry.in** (`BrandLink`); "DPDP Console" links home.
- **Shell layout**: header = "DPDP Console" (a cell as wide as the sidebar; the pipe after it sits on the
  sidebar's border line) + `ClientSwitcher` (`ClientMark`, client name, phase,
  details and the other clients) + search, alerts, account. `Sidebar` is the left rail on every page,
  always the same shape: "Across clients", then a client's modules and intake pages — the client in view, or
  outside one (portfolio, Inbox, Assigned to me) the last client opened (`LAST_CLIENT`), named in the "Modules"
  heading; it is sticky, and the footer sits inside the content column (not under the whole row) so on
  a page shorter than the sidebar it never slides up under the header; collapsible to icons (`[`,
  state in localStorage via `ui/prefs.ts`), "Powered by DataSentry" at its foot.
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
