import type { ReactNode } from 'react';

/**
 * Nav icons — 16px, 1.5 stroke, drawn on a 16-unit grid so they sit on the
 * same optical line as 13px Inter. Inline rather than an icon package: the
 * console needs a dozen, and they inherit `currentColor`.
 */

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const ICONS = {
  overview: (
    <Svg>
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </Svg>
  ),
  discovery: (
    <Svg>
      <path d="M3 3.5h10v7H8l-3 2.5v-2.5H3z" />
      <path d="M6 6.2h4M6 8.2h2.5" />
    </Svg>
  ),
  ropa: (
    <Svg>
      <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
      <path d="M2.5 6h11M2.5 9.5h11M6.5 6v7.5" />
    </Svg>
  ),
  flows: (
    <Svg>
      <circle cx="4" cy="4" r="1.6" />
      <circle cx="12" cy="8" r="1.6" />
      <circle cx="4" cy="12" r="1.6" />
      <path d="M5.5 4.6 10.5 7.4M5.5 11.4l5-2.8" />
    </Svg>
  ),
  gaps: (
    <Svg>
      <path d="M3.5 13.5V2.5" />
      <path d="M3.5 3h8l-1.6 2.7 1.6 2.8h-8" />
    </Svg>
  ),
  consent: (
    <Svg>
      <path d="M4 2.5h5.5L12 5v8.5H4z" />
      <path d="M9.5 2.5V5H12" />
      <path d="m6 9.5 1.3 1.3L10 8" />
    </Svg>
  ),
  dsr: (
    <Svg>
      <path d="M2.5 4.5h11v8h-11z" />
      <path d="m2.5 4.5 5.5 4.5 5.5-4.5" />
    </Svg>
  ),
  breach: (
    <Svg>
      <path d="M8 2 13.5 4v4c0 3-2.4 5-5.5 6-3.1-1-5.5-3-5.5-6V4z" />
      <path d="M8 5.5v3M8 10.7v.1" />
    </Svg>
  ),
  evidence: (
    <Svg>
      <path d="M2.5 5h11v8.5h-11z" />
      <path d="M4 5V3.5h8V5" />
      <path d="M6 8.5h4" />
    </Svg>
  ),
  intake: (
    <Svg>
      <path d="M2.5 9.5h3l1 2h3l1-2h3" />
      <path d="M4 3.5h8l1.5 6v4h-11v-4z" />
    </Svg>
  ),
  walkthrough: (
    <Svg>
      <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" />
      <circle cx="8" cy="8" r="2" />
    </Svg>
  ),
  tasks: (
    <Svg>
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
      <path d="m5.5 8 1.8 1.8L10.8 6.3" />
    </Svg>
  ),
  checkIn: (
    <Svg>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
    </Svg>
  ),
  back: (
    <Svg>
      <path d="M10 3.5 5.5 8l4.5 4.5" />
    </Svg>
  ),
} as const;

export type IconName = keyof typeof ICONS;
