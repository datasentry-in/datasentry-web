<!--
Status: scope agreed. An interactive mock of these modules is built at /demo
(see PR #1). The product application itself has not been started.
The "Technical approach" and "Verification" sections below describe the app
to be built, not the mock — the mock has no backend.
-->

# DataSentry DPDP Platform — Lean MVP Scope for ITES SMBs

## Context

India's DPDP Act substantive obligations commence **13 May 2027** (DPDP Rules 2025, G.S.R. 846(E), notified 13 Nov 2025; Rules 3 and 5–16, 22–23 at the 18-month mark). The Consent Manager framework (Rule 4) commences earlier, **13 Nov 2026**. As of today (10 Oct 2026) that leaves ~7 months to the main deadline, and SMB enquiry volume is rising now.

Existing DPDP SaaS (ConsentPro, IDfy Privy, and similar) is priced and scoped for enterprises — USD 3,000+/yr, built around cookie consent and large-scale data discovery. A 50–500 employee ITES firm has a far smaller real scope and cannot absorb that cost. DataSentry already sells GRC advisory to exactly this segment; the gap is a lightweight tool that turns a DPDP engagement into a repeatable, evidence-producing product.

**The outcome this scopes:** a consultant-operated, multi-client DPDP platform whose MVP is register-and-evidence-first (not integration-first), targeting HR operations as the beachhead, shippable to paying clients by Jan–Feb 2027.

**Codebase position:** `/home/user/datasentry-web` is a static Next.js 16 marketing site — no DB, auth, API routes, or tests. It contributes brand and design assets only. The product is a **separate application** (confirmed decision).

---

## Scoping corrections that shaped this plan

These change the module list versus the original three-module idea. Each is a legal-basis point, not a preference.

1. **Consent is the wrong primary basis for employee data.** DPDP s.7(i) makes processing "for the purposes of employment, or those related to safeguarding the employer from loss or liability" a *legitimate use* — payroll, attendance, performance, statutory filings need no consent. The employee-side requirement is a **defensible basis register**, not a consent engine. Narrow consent applies only to genuine exceptions: optional wellness/insurance programmes, dependant data, employee images in marketing, voluntary diversity data, alumni communications, and monitoring beyond a security purpose. Commentary is split on whether s.7(i) survives the end of employment, so ex-employee processing must carry its own basis (usually statutory retention).

2. **Candidates are the real consent use case and the highest-value feature.** s.7(i) does not cleanly cover a person who is not yet an employee, so pre-employment screening needs notice + consent; the BGV vendor is a Processor requiring a DPA. The dominant real-world exposure in ITES is the **indefinitely retained resume database** — s.8(7) requires erasure once purpose is served. Candidate consent + a talent-pool retention clock is cheap to build and will surface in essentially every assessment.

3. **Role is per processing activity, not per department.** For its own marketing leads, website visitors, vendor contacts, CCTV and visitor logs, the company is a Data Fiduciary whichever department owns the activity. The genuine scope reducer is **s.17(1)(d)**: processing personal data of data principals *outside* India under a contract with a person outside India is exempt from most substantive obligations — i.e. classic offshore ITES delivery work. Reasonable security safeguards and processor contracts still apply, and commentary differs on the interaction with s.16 cross-border rules, so the exemption must be recorded per activity with its contract evidence, never assumed wholesale. This is the honest and compelling sales message: *your offshore delivery work is largely exempt; your HR data is not.*

4. **Never position the product as a "Consent Manager."** A registered Consent Manager must be an Indian company with ≥₹2 crore net worth (Schedule I Part A), registered with the Board, under Rule 4 from 13 Nov 2026. This product is a **consent management tool used by a Data Fiduciary**. Mislabelling is a regulatory misrepresentation risk. Consent Manager API interoperability is explicitly out of scope.

5. **Breach notification belongs in MVP** (added to the original module list). Rule 7 has no severity threshold: affected data principals without delay, Board within 72 hours of awareness. It sits in the ₹200 crore penalty tier under s.8(6), and no SMB has a runbook. As a register + countdown + notification template generator it is ~2 weeks of work — the best consequence-to-effort ratio in the product. Grievance redressal (s.13) is likewise mandatory and reuses the DSR engine.

> All statutory references above are drawn from secondary commentary and should be verified against the Gazette text of the Act and the DPDP Rules 2025 before any generated notice or policy template ships to a client. Treat **primary-source verification of every rule and template as a release gate for R1**, not a follow-up task.

---

## Confirmed product decisions

| Decision | Choice |
|---|---|
| Discovery depth | AI-backed adaptive questionnaire. No system integrations in MVP; close the coverage gap with evidence-file upload + parsing. |
| Tenancy / GTM | Consultant-led multi-client console. One consultant login, many client orgs, cross-client dashboard. Client staff get scoped logins. |
| Codebase | Separate Next.js app (`app.datasentry.in`), sharing the marketing site's design tokens. |
| R1 modules | Scope & Role Register + RoPA; Evidence & Audit Pack + policy generator; Candidate & employee consent + breach register. |
| DSR desk | Split — thin intake in R1, full statutory-retention engine in R2 (see below). |

### Resolving the DSR complexity concern

The complexity you flagged is real, and it is concentrated in one place: **lawfully part-refusing an erasure request**. An ex-employee asking for erasure cannot be fully honoured, because PF/ESIC records, Form 16 and income-tax records, POSH/ICC proceedings records, and Shops & Establishments registers all carry statutory retention. Getting that matrix right per state and per record type is genuine legal research, and wrong output is professional-liability exposure.

So split it:

- **R1 — thin DSR intake (low complexity, ~1.5 weeks).** Public branded intake page, request typing (access / correction / erasure / grievance / nomination), identity verification, assignment to an owner, SLA clock, status log, manual response composition and closure. The consultant or client HR answers the request using their own judgement; the platform tracks and evidences it. This alone discharges the s.13 grievance mechanism obligation and produces the audit trail.
- **R2 — statutory retention engine.** The Indian retention matrix, automated conflict detection on erasure requests, and cited part-refusal letter generation. Build it once the matrix has been researched and legally reviewed; it then becomes the hardest-to-copy IP in the product, since no global tool carries Indian statutory retention.

This keeps R1 shippable without betting the first release on the hardest legal content.

---

## Module scope

### M1 — Scope & Role Register (the "Data Discovery" module)

**Output artefacts:** a signed-off Record of Processing Activities, a data-flow map, and a prioritised gap report. These are already the consultant deliverable, which is why this module leads.

**RoPA row shape** — one row per processing activity:
activity name, department, purpose, data categories (itemised, not category labels — Rule 3 requires item-level description), data principal class (employee / candidate / ex-employee / dependant / vendor contact / website visitor / client end-user), systems involved, **role** (Fiduciary / Processor / s.17(1)(d) exempt), **lawful basis** (s.7(i) legitimate use / consent / other legitimate use / exempt), retention period and trigger, processors and sub-processors with DPA status, cross-border destinations, and security measures.

**Pre-seeded ITES HR domain pack** — canonical activities with sensible defaults: recruitment & ATS, pre-employment BGV, offer & onboarding, payroll, PF/ESIC/PT/IT statutory filings, attendance & biometric, performance management, L&D, group insurance & dependants, POSH/ICC records, exit & full-and-final, alumni, CCTV, visitor logs, IT monitoring & DLP, client-project access provisioning, vendor & contractor management.

**Adaptive AI question engine** — the differentiator, and the piece needing the most care:

- Seed intake: domain, headcount, states of operation, systems in use, offshore-client exposure, departments in scope.
- The model selects relevant activities from the domain pack, proposes activities *not* in the pack from the client's free-text description, generates branching follow-up questions to fill missing RoPA fields, and normalises free-text answers into structured rows.
- **Hard architectural constraint: the model fills fields; a deterministic rule engine draws conclusions.** Role determination, basis determination and gap findings run as a versioned rule set over the structured RoPA — not as model output. An LLM asserting "this is a legitimate use under s.7(i)" is unreviewable hallucinated legal advice and puts professional liability on DataSentry. This separation is what makes the output defensible, and it is also what lets you cite a provision against every finding.
- **Provenance per field**: `ai_suggested` → `consultant_reviewed` → `client_confirmed`, each with actor and timestamp. Nothing reaches an evidence pack without consultant review. This is both the audit trail and the liability shield.
- Domain packs are data, not code, so adding BFSI-adjacent, healthcare or edtech packs later needs no engineering.

**Gap rule engine** — 40–60 deterministic, versioned rules, each citing a provision and emitting a remediation task with owner and due date. Examples: candidate data retained beyond stated purpose with no erasure trigger; processor engaged with no DPA on record; cross-border transfer with no contractual basis; activity with no lawful basis selected; consent-based activity with no notice version linked; no grievance contact published; dependant/minor data with no guardian consent (s.9).

**Data-flow map** — derived automatically from RoPA edges (system → system, system → processor, system → country) and rendered as a graph. No separate authoring step.

**Reaching connector-grade coverage without connectors — evidence upload + parsing:**
A questionnaire captures *declared* state. The findings that persuade clients come from *observed* state. Bridge it with one-click exports the client can already produce, uploaded and reconciled against the RoPA:

| Uploaded export | Findings it unlocks |
|---|---|
| Google Workspace / M365 user list | Active accounts for departed employees; orphaned mailboxes |
| Google Drive / SharePoint sharing report | HR folders shared externally or org-wide; over-permissioned access |
| HRMS employee roster (Keka / Zoho People / greytHR / Darwinbox) | Headcount reconciliation; records for long-exited staff |
| ATS candidate export | Actual resume volume and age distribution vs declared retention — usually the single biggest finding |
| Payroll vendor report | Undeclared processor; undeclared data categories |

This is CSV/XLSX parsing plus reconciliation rules — parser cost, not integration cost — and it keeps "no system integration in MVP" true. Real connectors become a Phase 2 upgrade path on the same reconciliation engine.

### M2 — Notice & Consent (deliberately narrow)

- **Candidate consent at application**: hosted consent page plus embeddable widget and a POST API for ATS integration. Itemised purposes (screening, BGV, talent-pool retention for N months, sharing with a named client for project staffing), each separately acceptable. Version-pinned notice snapshot.
- **Notice builder** meeting Rule 3: standalone presentation, plain language, item-level data description with per-item purpose, and links for consent withdrawal, rights exercise and Board complaint. Versioned and immutable once published.
- **Language**: s.5(3)/s.6(3) give the data principal the option of English or any Eighth Schedule language. Build the localisation slot from day one (notice content keyed by language code, fallback to English). Ship English + Hindi + 2–3 regional languages matched to client locations; add on request. Do **not** retrofit this later.
- **Employee exception consents** only, at onboarding and renewable: wellness/insurance opt-ins, dependant data, image/marketing use, voluntary diversity data, alumni communications.
- **Immutable consent ledger** — append-only: principal, purpose set, notice version, timestamp, IP/user-agent, language, artefact hash. This is the evidence that matters in a Board enquiry.
- **Withdrawal that actually does something.** Most tools stop at recording withdrawal. s.8(7) requires erasure on withdrawal or when the purpose is served, so withdrawal must emit an **erasure task** with owner, affected systems (from the RoPA) and SLA. Same for retention-clock expiry: the talent-pool timer firing creates a purge task, not just a flag.
- **Dependant/minor data (s.9)**: flag the activity, capture guardian attestation, surface it as a gap. Do not attempt verifiable parental-consent verification in MVP.

### M3 — DSR & Grievance Desk (thin in R1)

- Branded public intake page per client org (subdomain or path-scoped).
- Request types: access/summary (s.11), correction/completion/updating/erasure (s.12), grievance (s.13), nomination (s.14).
- Identity verification calibrated to ex-employees: employee ID + date of birth + last working day + email on record, with optional document upload.
- Workflow: triage → assign → gather (checklist auto-generated from the RoPA, so M1 directly feeds M3) → compose → approve → deliver → close. SLA clock with escalation.
- **Nomination register (s.14)** — almost nobody builds this; cheap, and a visible completeness signal in an assessment.
- Deferred to R2: statutory retention matrix, automated erasure-conflict detection, cited part-refusal letter generation.

### M4 — Breach & Incident Register

- Incident register with severity triage and an awareness timestamp that starts a visible **72-hour countdown** to Board intimation.
- Generated artefacts: initial Board intimation, detailed 72-hour Board report, affected-principal notification. Rule 7 requires principals to be informed without delay and the Board within 72 hours; sources differ on whether the principal-notice duty is universal or harm-triggered, so default to notifying and record the reasoning when not.
- Evidence attachments, remediation actions, post-incident report, and a closed-incident archive for the evidence pack.

### M5 — Evidence & Audit Pack + Policy Generator

This is what justifies the price and what a client's board or a Board of India query actually asks for.

- **One-click compliance file (PDF + ZIP)**: RoPA, role determination memo with per-activity reasoning, data-flow map, notice set with versions, consent ledger extract, DSR log with SLA performance, grievance register, nomination register, breach register, processor/DPA register, retention schedule, training log, policy set, and the gap report with remediation status.
- **Policy generator**, grounded in the client's own RoPA answers: employee privacy notice, candidate privacy notice, website privacy notice, retention & erasure policy, DSR SOP, breach response SOP, processor DPA template, grievance mechanism and DPO/contact designation note, and a s.17(1)(d) applicability memo for offshore delivery work.
- Every document carries generation timestamp, source RoPA version, and reviewer attribution. Exports are immutable and hash-stamped.
- **Templates are legally reviewed artefacts, not generated prose.** The model assembles from reviewed clause libraries and fills client specifics; it does not draft novel legal language.

### Cross-cutting (thin but non-negotiable)

- **Consultant console**: one login across many client orgs, cross-client dashboard (readiness score, open gaps, DSR SLA breaches, breach clocks running), client switcher, white-label client-facing pages.
- **RBAC — four roles only**: Consultant Admin, Org Admin/DPO, HR Processor, Read-only Auditor. Enforce tenant isolation at the database layer (row-level security), not in application code.
- **Append-only audit log** on every mutation, hash-chained for tamper evidence. Non-optional: it is the product's core evidentiary claim.
- **Data residency in India** — database, object storage and serverless function region all in Mumbai. A DPDP tool that processes Indian employee data abroad is an own-goal in every sales conversation. Note that Vercel function region must be set explicitly; the default is not Mumbai.
- **DataSentry is a Processor for its clients.** The platform needs its own DPA, sub-processor list, security posture page and breach commitment. Dogfooding the product on itself is both correct and a sales asset.

---

## Explicitly out of MVP

| Excluded | Why |
|---|---|
| Cookie consent / website CMP | Commodity, crowded, different buyer (marketing, not HR). The existing `CookieConsent.tsx` with Consent Mode v2 is a Phase 2 head start. |
| Automated DB/file scanning, ML PII classification | Enterprise-grade cost; wasted on a firm whose HR data sits in 6–10 known systems. |
| Registered Consent Manager interoperability | Requires ₹2 crore net worth and Board registration. Not DataSentry's position. |
| DPIA engine, algorithmic audit, annual-audit workflow | Significant Data Fiduciary obligations (Rule 13). The ICP will not be SDFs. |
| Cross-border transfer assessment engine | The s.16 restricted-country list is not yet notified. Record destinations; do not assess. |
| Vendor risk questionnaires at scale / TPRM | Adjacent product. A DPA register is sufficient. |
| SSO/SCIM, SOC 2 | Email OTP + Google is enough for the ICP. An ISO 27001 readiness statement covers the security question initially. |
| Mobile apps | Responsive web is sufficient. |
| All 22 Eighth Schedule languages | Ship the slot, 4–5 languages, add on request. |

---

## Technical approach

### Stack

| Concern | Choice | Note |
|---|---|---|
| App | Next.js 16 App Router + TypeScript, strict | Matches existing site; shared token set |
| Hosting | Vercel, functions pinned to `bom1` | Default region is not Mumbai — set explicitly |
| DB | Postgres on Supabase, **Mumbai region** | Row-level security is the right primitive for tenant isolation |
| ORM | Drizzle | Lighter, pairs well with RLS |
| Auth | Supabase Auth (email OTP + Google) + org membership table | 4 roles |
| Storage | Supabase Storage, Mumbai | Evidence attachments, uploaded exports |
| Jobs | Inngest or Trigger.dev | SLA clocks, 72-hour breach countdown, retention sweeps, email |
| Email | AWS SES `ap-south-1` | Residency consistency over convenience |
| PDF | Headless Chromium HTML→PDF | Brand fidelity with Tailwind; Chromium is already available in this environment |
| AI | Anthropic SDK (`@anthropic-ai/sdk`) | See below |

### AI layer

- **`claude-opus-5-5`** ($4 / $20 per MTok) for adaptive question generation, activity inference from free-text, and policy/notice assembly. Thinking is always on — omit the `thinking` param; `{type: "disabled"}` and `budget_tokens` both return 400. Effort defaults to `medium` on this model, so set `output_config.effort` explicitly (`high` for question generation and policy assembly).
- **`claude-haiku-5-5`** ($0.10 / $0.50) for bulk field normalisation and parsing uploaded exports; step up to **`claude-sonnet-5-5`** ($2 / $10) where judgement is needed. Route the Batch API (50% discount) for non-interactive bulk normalisation.
- **Structured outputs** via `output_config: {format: {...}}` with `messages.parse()`, and `strict: true` on tool definitions. Note: forced `tool_choice` (`any` / `tool`) returns 400 on Opus 5.5 — use `auto` with an explicit instruction, or structured outputs.
- **Prompt caching is the main cost lever.** Every question-generation call carries the same statutory corpus (Act ss.5–9, 11–14, 16–17; Rules 3–7, 13; Schedule I) plus the domain pack. Put that in a cached, byte-stable prefix (cache reads $0.20/MTok on Opus 5.5); keep client-specific and per-request content after the last breakpoint. Verify with `usage.cache_read_input_tokens` — a persistent zero means a silent invalidator. With caching, a full discovery run should land in the low tens of rupees, negligible against the price point.
- **Grounding and citation**: retrieval over the statutory corpus so every gap finding and generated clause cites a provision. Never let the model assert a legal conclusion — the rule engine does that.

### Files to create

New application, so the significant surfaces rather than a file list:

- `db/schema/` — Drizzle schema. Core entities: `organisation`, `membership`, `processing_activity` (the RoPA row), `data_category`, `system`, `processor`, `notice` + `notice_version`, `consent_record` (append-only), `consent_purpose`, `dsr_request` + `dsr_event`, `nomination`, `incident` + `incident_event`, `remediation_task`, `evidence_export`, `uploaded_artefact`, `audit_log` (append-only, hash-chained), `domain_pack`, `gap_rule`, `gap_finding`.
- `lib/rules/` — deterministic role, basis and gap rule engines, versioned. Pure functions over RoPA rows; fully unit-testable, and the highest-value test target in the codebase.
- `lib/ai/` — Anthropic client, cached statutory-corpus prefix builder, question-generation and normalisation flows, structured-output schemas.
- `lib/retention/` — R2: statutory retention matrix and conflict detection.
- `app/(console)/` — consultant console, client switcher, cross-client dashboard.
- `app/(org)/[orgSlug]/` — per-client module routes.
- `app/(public)/[orgSlug]/` — unauthenticated intake: consent pages, DSR intake, grievance form.
- `app/api/` — consent capture API for ATS integration, webhooks.
- `components/` — port the token set from `src/app/globals.css` in the marketing repo; build the **data table / grid** that does not exist in either repo and that every module needs.

**Reused from `datasentry-web`:** the Tailwind v4 `@theme inline` token set and brutalist shadow scale (`src/app/globals.css`), the page scaffold pattern (`src/app/privacy-policy/page.tsx` is the cleanest example), the modal patterns (`src/components/CookieConsent.tsx`, `src/app/contact/page.tsx`), `src/components/Breadcrumb.tsx`, and `stitch_screens/08_dashboard.html` as the console's visual target. Note the global `border-radius: 0 !important` override will flatten any third-party UI kit. Do **not** carry over the `dangerouslySetInnerHTML` HTML-in-template-string content pattern from the policy pages — tenant-specific generated content through that path is an XSS vector.

---

## Release plan

Working back from clients needing something usable by Jan–Feb 2027.

**R0 — Foundation + Scope Register (6–8 weeks)**
Tenancy, auth, RBAC, RLS, audit log, consultant console shell, data table component. M1 complete: adaptive questionnaire, ITES domain pack, rule engines, data-flow map, gap report. M5 v1: evidence pack and policy generator.
*Sellable on its own as a paid DPDP Readiness Assessment.*

**R1 — Operate (6–8 weeks)**
M3 thin DSR + grievance + nomination, public intake pages, SLA engine. M4 breach register with 72-hour countdown and notification templates. Evidence upload + reconciliation parsers. Primary-source legal verification pass over every rule and template — a release gate, not a follow-up.

**R2 — Consent + Retention depth (6 weeks)**
M2 candidate consent capture, consent ledger, withdrawal→erasure tasking, employee exception consents, notice localisation. Statutory retention matrix and cited part-refusal generation.

**Phase 2 (post-May 2027)**
Real system connectors on the reconciliation engine, cookie consent/CMP, additional domain packs, DPIA module for clients that grow into SDF status.

---

## Commercial frame

- **Price band**: ₹60,000–₹1,50,000/yr (~USD 700–1,800) by headcount tier — decisively under the USD 3,000 enterprise floor, which is the whole premise.
- **Consultant bundle**: per-client-org pricing with partner margin. Implementation and assessment fees stay with the consultant; the platform takes subscription only. This is what makes consultants distribute it.
- **Land with the Readiness Assessment** (M1 + gap report + evidence pack). It is the lead magnet, the consulting hook, and the thing R0 already delivers.

---

## Verification

**R0 acceptance — run end to end:**
1. Create a consultant account; create two client orgs. Confirm RLS isolation directly: query as org A's role and assert zero rows from org B. Attempt cross-org access by ID manipulation and confirm denial.
2. Complete the adaptive questionnaire for a synthetic 200-person ITES firm with offshore US clients. Assert the generated RoPA contains the expected HR activities, that offshore delivery activities are marked s.17(1)(d) exempt **with contract evidence recorded**, and that HR activities are marked Fiduciary with s.7(i) basis.
3. Confirm every AI-populated field carries `ai_suggested` provenance and that no field reaches an evidence export without a `consultant_reviewed` or `client_confirmed` stamp. This is the liability control — test it as such.
4. Assert the gap report fires the expected findings on a deliberately defective input (resumes with no retention trigger, processor with no DPA, activity with no basis). Rule engine gets unit tests per rule; snapshot-test the full report.
5. Generate the evidence pack; verify PDF renders, hash stamps are present, and the RoPA version referenced matches.
6. Confirm model call behaviour: `usage.cache_read_input_tokens` is non-zero on the second and subsequent question-generation calls; structured outputs parse without retry; no forced `tool_choice` anywhere.

**R1 acceptance:**
7. Submit a DSR from the public intake page as a simulated ex-employee; verify identity challenge, owner assignment, SLA clock, escalation on breach, and audit-log entries for every transition.
8. Open an incident; verify the 72-hour countdown starts from the awareness timestamp (not creation), that both Board artefacts and the principal notification generate, and that the countdown survives a server restart (clock in the job scheduler, not in memory).
9. Upload a Google Drive sharing report and an ATS export for the synthetic org; assert reconciliation findings (external HR folder share, resume age distribution exceeding declared retention) appear in the gap report.
10. Legal verification gate: every statutory citation in every rule and template checked against the Gazette text of the Act and DPDP Rules 2025. Record sign-off per rule.

**R2 acceptance:**
11. Capture candidate consent via hosted page and via API; withdraw consent; assert an erasure task is created with the correct affected systems drawn from the RoPA. Advance the talent-pool retention clock past expiry and assert a purge task fires.
12. Submit an ex-employee erasure request against an org with payroll and POSH records; assert the part-refusal letter cites the correct statutory retention grounds and that non-retained data is marked for erasure.

**Standing commands:** `npm run lint`, `npx tsc --noEmit`, and the unit suite (to be established — the marketing repo has no tests; the rule engines are the first thing that needs them).
