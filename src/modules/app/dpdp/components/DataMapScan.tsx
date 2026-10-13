'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

/**
 * The sign-in visual: a data map of a typical ITES client's systems, scanned.
 *
 * Each row is a system people recognise — the ATS, the HRMS, payroll, the
 * biometric reader, the marketing list, the client's VDI — with where it is
 * hosted and how many records it holds. Its dots are those records, newest on
 * the left. A scan sweeps across every system at once and resolves each record
 * by the rule that governs it; when the scan completes, each system shows its
 * verdict and the provision behind it.
 *
 * The dots are a sample; the counters below are each system's stated record
 * count split by its rule, so the totals read as a real engagement would.
 * Classification is seeded — identical on every load and resize.
 */

type Cls = 0 | 1 | 2; // kept, exempt, erase
type Tone = 'kept' | 'exempt' | 'erase';

type System = {
  id: string;
  name: string;
  holds: string;
  region: 'IN' | 'US';
  records: number;
  icon: ReactNode;
  pick: (age: number, r: number) => Cls;
  verdict: { tone: Tone; text: string; cite: string };
  marker?: { at: number; label: string };
};

const I = {
  ats: (
    <>
      <rect x="2.5" y="5" width="11" height="8" rx="1.5" />
      <path d="M6 5V3.5h4V5M2.5 8.5h11" />
    </>
  ),
  hrms: (
    <>
      <circle cx="6" cy="6" r="2.2" />
      <path d="M2.5 13c.4-2 1.8-3 3.5-3s3.1 1 3.5 3" />
      <circle cx="11.2" cy="6.6" r="1.7" />
      <path d="M10.8 10c1.5.1 2.5 1 2.8 2.6" />
    </>
  ),
  payroll: <path d="M4.5 3.5h7M4.5 6.2h7M6.2 3.5c2.4 0 3.4 1.2 3.4 2.6S8.6 8.8 6.2 8.8H5L10 13" />,
  bio: (
    <>
      <path d="M4.8 12.8c-.7-1.4-1-2.9-1-4.3a4.2 4.2 0 0 1 8.4 0c0 1 .1 2 .5 3" />
      <path d="M8 13c-.6-1.3-.9-2.8-.9-4.5a.9.9 0 0 1 1.8 0c0 2 .5 3.6 1.4 4.8" />
      <path d="M6.2 8.5c0 1.7.3 3.2.9 4.5" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="4" width="11" height="8.5" rx="1.5" />
      <path d="M3 5l5 4 5-4" />
    </>
  ),
  vdi: (
    <>
      <rect x="2" y="3" width="12" height="8" rx="1.2" />
      <path d="M6 13.5h4M8 11v2.5" />
    </>
  ),
};

const SYSTEMS: System[] = [
  {
    id: 'ats', name: 'Zoho Recruit', holds: 'Candidate CVs', region: 'IN', records: 6431, icon: I.ats,
    pick: (a, r) => (a < 0.18 ? 0 : r < 0.9 ? 2 : 0),
    verdict: { tone: 'erase', text: 'Erase after 180 days', cite: 's.8(7)' },
    marker: { at: 0.18, label: '180 D' },
  },
  {
    id: 'hrms', name: 'Keka HR', holds: 'Employee files', region: 'IN', records: 1186, icon: I.hrms,
    pick: (a, r) => (a < 0.62 ? 0 : r < 0.5 ? 2 : 0),
    verdict: { tone: 'kept', text: 'Keep — employment use', cite: 's.7(i)' },
  },
  {
    id: 'payroll', name: 'Zoho Payroll', holds: 'Salary, PF & TDS', region: 'IN', records: 18520, icon: I.payroll,
    pick: (a, r) => (a > 0.9 && r < 0.75 ? 2 : 0),
    verdict: { tone: 'kept', text: 'Keep 8 years — statute', cite: 'EPF · IT Act' },
    marker: { at: 0.9, label: '8 YRS' },
  },
  {
    id: 'bio', name: 'Matrix COSEC', holds: 'Fingerprint templates', region: 'IN', records: 1104, icon: I.bio,
    pick: (a, r) => (a < 0.34 ? 0 : r < 0.92 ? 2 : 0),
    verdict: { tone: 'erase', text: 'Erase on exit', cite: 's.8(7)' },
  },
  {
    id: 'mail', name: 'Mailchimp', holds: 'Alumni mailing list', region: 'US', records: 1340, icon: I.mail,
    pick: (_a, r) => (r < 0.2 ? 0 : 2),
    verdict: { tone: 'erase', text: 'No basis — consent or erase', cite: 's.6' },
  },
  {
    id: 'vdi', name: 'Client VDI', holds: 'Customer tickets', region: 'US', records: 48210, icon: I.vdi,
    pick: (_a, r) => (r < 0.95 ? 1 : 0),
    verdict: { tone: 'exempt', text: 'Exempt — offshore contract', cite: 's.17(1)(d)' },
  },
];

const TOTAL = SYSTEMS.reduce((n, s) => n + s.records, 0);

// Timeline, in milliseconds.
const RESET = 700;
const SCAN = 5200;
const HOLD = 2600;
const FADE = 700;
const CYCLE = RESET + SCAN + HOLD + FADE;
const SETTLED = RESET + SCAN + HOLD / 2;

const C = {
  blue: '#009FE3',
  red: '#d92d20',
  idle: '#dde0e5',
  ring: '#c3c7ce',
  muted: '#8b8f98',
  mark: '#b4b9c1',
};
const MONO = '"DM Mono", ui-monospace, SFMono-Regular, monospace';
const DOT_ROWS = 3;
const CANVAS_H = 42;
const DOT_TOP = 13;

function rand(a: number, b: number, c: number) {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

type Dot = { x: number; y: number; cls: Cls; age: number };

/**
 * Each system's record count split by outcome, computed once from a fixed
 * 3 × 160 sample of its rule. The on-screen dots are a coarser sample whose
 * size depends on the viewport, so the counters are scaled to these figures —
 * every screen ends the scan on the same numbers.
 */
const SPLIT: [number, number, number][] = SYSTEMS.map((sys, si) => {
  const n = [0, 0, 0];
  const cols = 160;
  for (let row = 0; row < DOT_ROWS; row++) {
    for (let col = 0; col < cols; col++) {
      n[sys.pick((col + 0.5) / cols, rand(si + 101, row + 1, col + 1))]++;
    }
  }
  const all = DOT_ROWS * cols;
  // Round down, then give the remainder to the largest share so each system's
  // split adds up to exactly its record count.
  const split = [0, 1, 2].map((c) => Math.floor((sys.records * n[c]) / all));
  const largest = split.indexOf(Math.max(...split));
  split[largest] += sys.records - (split[0] + split[1] + split[2]);
  return split as [number, number, number];
});
const FINAL = [0, 1, 2].map((c) => SPLIT.reduce((sum, s) => sum + s[c], 0));

function layoutDots(w: number, sys: System, si: number) {
  const s = w < 260 ? 8 : 9;
  const r = w < 260 ? 2 : 2.3;
  const cols = Math.max(10, Math.floor(w / s));
  const pad = (w - cols * s) / 2;
  const dots: Dot[] = [];
  for (let row = 0; row < DOT_ROWS; row++) {
    for (let col = 0; col < cols; col++) {
      const age = (col + 0.5) / cols;
      dots.push({
        x: pad + col * s + s / 2,
        y: DOT_TOP + row * s + s / 2,
        cls: sys.pick(age, rand(si + 1, row + 1, col + 1)),
        age,
      });
    }
  }
  const n = [0, 0, 0];
  dots.forEach((d) => n[d.cls]++);
  const share = SPLIT[si].map((v, c) => (n[c] ? v / n[c] : 0));
  return { dots, r, share, pad, span: cols * s };
}

const reduceQuery = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia(reduceQuery);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

const toneText: Record<Tone, string> = {
  kept: 'text-[#0077b0]',
  exempt: 'text-[#0077b0]',
  erase: 'text-[#b42318]',
};

function ToneGlyph({ tone }: { tone: Tone }) {
  const cls =
    tone === 'kept' ? 'bg-[#009FE3]' : tone === 'exempt' ? 'border-[1.5px] border-[#009FE3]' : 'bg-[#d92d20]';
  return <span aria-hidden className={`inline-block h-[7px] w-[7px] shrink-0 rounded-full ${cls}`} />;
}

export default function DataMapScan() {
  const areaRef = useRef<HTMLDivElement>(null);
  const hiRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const verdictRefs = useRef<(HTMLElement | null)[]>([]);
  const pendingRefs = useRef<(HTMLElement | null)[]>([]);
  const countRefs = useRef<(HTMLElement | null)[]>([]);
  const statusRef = useRef<HTMLSpanElement>(null);
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia(reduceQuery).matches, () => true);

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    const nf = new Intl.NumberFormat('en-IN');
    // The loop writes straight to the DOM, and only when a value changes.
    const setText = (el: HTMLElement | null | undefined, v: string) => {
      if (el && el.textContent !== v) el.textContent = v;
    };
    const setStyle = (el: HTMLElement | null | undefined, prop: 'opacity' | 'transform', v: string) => {
      if (el && el.style[prop] !== v) el.style[prop] = v;
    };

    let width = area.clientWidth;
    let rows = SYSTEMS.map((s, i) => layoutDots(width, s, i));
    let raf = 0;

    const size = () => {
      width = area.clientWidth;
      rows = SYSTEMS.map((s, i) => layoutDots(width, s, i));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasRefs.current.forEach((c) => {
        if (!c) return;
        c.width = Math.round(width * dpr);
        c.height = Math.round(CANVAS_H * dpr);
        c.style.height = `${CANVAS_H}px`;
        c.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
      });
    };

    const draw = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - RESET) / SCAN));
      const fade = t > RESET + SCAN + HOLD ? (t - RESET - SCAN - HOLD) / FADE : 0;
      const counted = [0, 0, 0];

      SYSTEMS.forEach((sys, si) => {
        const c = canvasRefs.current[si];
        const ctx = c?.getContext('2d');
        if (!ctx) return;
        const { dots, r, share, pad, span } = rows[si];
        ctx.clearRect(0, 0, width, CANVAS_H);

        // Retention limits drawn where they apply: 180 days for CVs, 8 years for payroll.
        if (sys.marker) {
          const x = pad + sys.marker.at * span;
          ctx.strokeStyle = C.mark;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2.5]);
          ctx.beginPath();
          ctx.moveTo(x, DOT_TOP - 1);
          ctx.lineTo(x, CANVAS_H - 1);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.font = `500 8.5px ${MONO}`;
          ctx.fillStyle = C.muted;
          ctx.textBaseline = 'alphabetic';
          ctx.textAlign = sys.marker.at > 0.5 ? 'right' : 'left';
          ctx.fillText(sys.marker.label, sys.marker.at > 0.5 ? x - 3 : x + 3, DOT_TOP - 4);
          ctx.textAlign = 'left';
        }

        for (const d of dots) {
          const at = RESET + d.age * SCAN;
          if (t < RESET || t < at) {
            ctx.fillStyle = C.idle;
            ctx.beginPath();
            ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
            ctx.fill();
            continue;
          }
          counted[d.cls] += share[d.cls];
          const dt = t - at;
          const pop = dt < 240 ? 1 + 0.55 * Math.sin((Math.PI * dt) / 240) : 1;

          if (fade > 0) {
            ctx.globalAlpha = fade;
            ctx.fillStyle = C.idle;
            ctx.beginPath();
            ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
            ctx.fill();
          }
          const base = 1 - fade;

          if (d.cls === 0) {
            ctx.globalAlpha = base;
            ctx.fillStyle = C.blue;
            ctx.beginPath();
            ctx.arc(d.x, d.y, r * pop, 0, Math.PI * 2);
            ctx.fill();
          } else if (d.cls === 1) {
            ctx.globalAlpha = base;
            ctx.strokeStyle = C.blue;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(d.x, d.y, (r - 0.2) * pop, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            // Erased: flashes red, then empties to a faint ring — the record is gone.
            const k = dt < 300 ? 0 : Math.min(1, (dt - 300) / 800);
            if (k < 1) {
              ctx.globalAlpha = base * (1 - k);
              ctx.fillStyle = C.red;
              ctx.beginPath();
              ctx.arc(d.x, d.y, r * pop, 0, Math.PI * 2);
              ctx.fill();
            }
            if (k > 0) {
              ctx.globalAlpha = base * k;
              ctx.strokeStyle = C.ring;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(d.x, d.y, r - 0.3, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
          ctx.globalAlpha = 1;
        }

        // Verdict lands once the scan has crossed every system, a row at a time.
        const shownAt = RESET + SCAN + si * 110;
        const vis = t < shownAt ? 0 : Math.min(1, (t - shownAt) / 260) * (1 - fade);
        setStyle(verdictRefs.current[si * 2], 'opacity', vis.toFixed(2));
        setStyle(verdictRefs.current[si * 2 + 1], 'opacity', vis.toFixed(2));
        setStyle(pendingRefs.current[si], 'opacity', (1 - vis).toFixed(2));
      });

      // The scan: a yellow highlighter behind the dots, an ink rule in front.
      const scanning = t >= RESET && t <= RESET + SCAN + 100;
      // Track the dots exactly: they sit inside a centred span, not edge to edge.
      const x = rows[0].pad + p * rows[0].span;
      setStyle(hiRef.current, 'opacity', scanning ? '1' : '0');
      setStyle(lineRef.current, 'opacity', scanning ? '1' : '0');
      setStyle(hiRef.current, 'transform', `translateX(${(x - 48).toFixed(1)}px)`);
      setStyle(lineRef.current, 'transform', `translateX(${x.toFixed(1)}px)`);

      const done = t > RESET + SCAN;
      const totals = done ? FINAL : counted;
      setText(countRefs.current[0], nf.format(Math.round(totals[0])));
      setText(countRefs.current[1], nf.format(Math.round(totals[1])));
      setText(countRefs.current[2], nf.format(Math.round(totals[2])));
      setText(
        statusRef.current,
        t < RESET
          ? `Connecting to ${SYSTEMS.length} systems`
          : done
            ? `Scan complete · ${SYSTEMS.length} systems · ${nf.format(TOTAL)} records`
            : `Scanning ${SYSTEMS.length} systems · ${Math.round(p * 100)}%`,
      );
    };

    size();
    let start = 0;
    const loop = (now: number) => {
      if (!start) start = now;
      draw((now - start) % CYCLE);
      raf = requestAnimationFrame(loop);
    };
    if (reduced) draw(SETTLED);
    else raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      size();
      if (reduced) draw(SETTLED);
    });
    ro.observe(area);
    document.fonts?.ready.then(() => {
      if (reduced) draw(SETTLED);
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced]);

  const grid =
    'grid grid-cols-[var(--sys)_minmax(0,1fr)] gap-x-4 @xl:grid-cols-[var(--sys)_minmax(0,1fr)_var(--out)]';

  return (
    <div className="@container min-w-0">
      <div className="relative [--og:0rem] [--out:0rem] [--sys:7.75rem] @xl:[--og:1rem] @xl:[--out:11rem] @xl:[--sys:13rem]">
        {/* Column heads */}
        <div className={`${grid} ds-label border-b border-[var(--ds-border)] pb-2 text-[var(--ds-text-3)]`}>
          <span>System</span>
          <span className="flex justify-between">
            <span>Records · newest</span>
            <span>oldest →</span>
          </span>
          <span className="hidden @xl:block">Outcome</span>
        </div>

        {/* Scan layer: highlighter behind the dots, rule in front */}
        <div
          className="pointer-events-none absolute bottom-0 top-[1.6rem] overflow-hidden"
          style={{ left: 'calc(var(--sys) + 1rem)', right: 'calc(var(--out) + var(--og))' }}
          aria-hidden
        >
          <div
            ref={hiRef}
            className="absolute inset-y-0 left-0 w-12 opacity-0"
            style={{ background: 'linear-gradient(90deg, rgba(255,237,0,0), rgba(255,237,0,0.5))' }}
          />
        </div>

        <ul>
          {SYSTEMS.map((s, i) => (
            <li key={s.id} className={`${grid} items-center border-b border-[var(--ds-border)] py-2.5 last:border-b-0`}>
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--ds-border)] bg-[var(--ds-subtle)] text-[var(--ds-text-2)] @xl:flex">
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {s.icon}
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[12.5px] font-medium leading-tight text-[var(--ds-text)]">
                    <span className="truncate">{s.name}</span>
                    <span
                      className={`ds-mono shrink-0 rounded border px-1 text-[9px] leading-[14px] ${
                        s.region === 'US'
                          ? 'border-[var(--ds-warn-border)] text-[var(--ds-warn)]'
                          : 'border-[var(--ds-border)] text-[var(--ds-text-3)]'
                      }`}
                      title={s.region === 'US' ? 'Hosted outside India — cross-border transfer' : 'Hosted in India'}
                    >
                      {s.region}
                    </span>
                  </p>
                  <p className="mt-0.5 truncate text-[11.5px] leading-tight text-[var(--ds-text-3)]">
                    {s.holds} · <span className="tnum">{s.records.toLocaleString('en-IN')}</span>
                  </p>
                  {/* On a phone the verdict sits under the system name */}
                  <p
                    ref={(el) => {
                      verdictRefs.current[i * 2 + 1] = el;
                    }}
                    className={`mt-1 flex items-center gap-1 text-[11px] font-medium opacity-0 @xl:hidden ${toneText[s.verdict.tone]}`}
                  >
                    <ToneGlyph tone={s.verdict.tone} />
                    {s.verdict.text}
                  </p>
                </div>
              </div>

              <div ref={i === 0 ? areaRef : undefined} className="relative min-w-0">
                <canvas
                  ref={(el) => {
                    canvasRefs.current[i] = el;
                  }}
                  className="relative z-[1] block w-full"
                  aria-hidden
                />
              </div>

              <div className="relative hidden min-w-0 @xl:block">
                <p
                  ref={(el) => {
                    pendingRefs.current[i] = el;
                  }}
                  className="ds-label absolute inset-0 flex items-center text-[var(--ds-text-3)]"
                >
                  Scanning…
                </p>
                <div
                  ref={(el) => {
                    verdictRefs.current[i * 2] = el;
                  }}
                  className="opacity-0"
                >
                  <p className={`flex items-center gap-1.5 text-[12px] font-medium leading-tight ${toneText[s.verdict.tone]}`}>
                    <ToneGlyph tone={s.verdict.tone} />
                    {s.verdict.text}
                  </p>
                  <p className="ds-figure mt-0.5 pl-[13px] text-[10.5px] text-[var(--ds-text-3)]">{s.verdict.cite}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div
          className="pointer-events-none absolute bottom-0 top-[1.6rem] z-[2]"
          style={{ left: 'calc(var(--sys) + 1rem)', right: 'calc(var(--out) + var(--og))' }}
          aria-hidden
        >
          <div ref={lineRef} className="absolute inset-y-0 -left-[0.75px] w-[1.5px] bg-[var(--ds-text)] opacity-0" />
        </div>
      </div>

      {/* Totals, weighted by each system's record count */}
      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-[var(--ds-border)] pt-4">
        {[
          { label: 'Kept', note: 'basis on record', tone: 'kept' as Tone },
          { label: 'Exempt', note: 's.17(1)(d) offshore', tone: 'exempt' as Tone },
          { label: 'Erased', note: 'purpose served', tone: 'erase' as Tone },
        ].map((k, i) => (
          <div key={k.label} className="min-w-0">
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--ds-text)]">
              <ToneGlyph tone={k.tone} />
              {k.label}
            </p>
            <p
              ref={(el) => {
                countRefs.current[i] = el;
              }}
              className="ds-figure mt-2 text-[26px] leading-none tracking-[-0.02em] text-[var(--ds-text)] sm:text-[28px]"
            >
              0
            </p>
            <p className="mt-1.5 text-[11.5px] leading-snug text-[var(--ds-text-3)]">{k.note}</p>
          </div>
        ))}
      </div>

      <p className="ds-label mt-4 text-[var(--ds-text-3)]">
        <span ref={statusRef}>Connecting to {SYSTEMS.length} systems</span>
      </p>
    </div>
  );
}
