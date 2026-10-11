/**
 * Brand assets for the console, matching the marketing site's lockup
 * (src/components/Logo.tsx): DATA reversed out of the blue block, SENTRY in
 * ink, with the yellow rule from the logo frame.
 */

export function Wordmark({ className = 'h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 560 118" role="img" aria-label="DataSentry" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="557" height="115" fill="#ffffff" stroke="var(--ds-brand-yellow)" strokeWidth="3" />
      <rect x="1.5" y="1.5" width="232" height="115" fill="var(--ds-brand)" />
      <text
        x="116" y="74" textAnchor="middle" fill="#ffffff"
        fontFamily="Montserrat, Inter, sans-serif" fontWeight="700" fontSize="56" letterSpacing="7"
      >
        DATA
      </text>
      <text
        x="396" y="74" textAnchor="middle" fill="var(--ds-brand-ink)"
        fontFamily="Montserrat, Inter, sans-serif" fontWeight="800" fontSize="56" letterSpacing="-1"
      >
        SENTRY
      </text>
    </svg>
  );
}

/**
 * The product lockup: the product name, and who makes it — the
 * DataSentry wordmark itself, not a plain-text label. Used wherever the
 * console names itself, so it is never in doubt which system this is.
 */
export function ProductLockup({
  size = 'sm', byline = true, layout = 'stack',
}: { size?: 'sm' | 'lg'; byline?: boolean; layout?: 'stack' | 'row' }) {
  const lg = size === 'lg';
  const name = (
    <span
      className={`${lg ? 'text-[18px]' : 'text-[14.5px]'} font-semibold leading-none tracking-[-0.025em] text-[var(--ds-text)]`}
    >
      DPDP Console
    </span>
  );
  const by = byline && (
    <span className="flex items-center gap-1.5">
      <span className="ds-label leading-none text-[var(--ds-text-3)]">by</span>
      <Wordmark className={lg ? 'h-5 w-auto' : 'h-[15px] w-auto'} />
    </span>
  );

  // Row: name and maker at either end, for a full-width strip.
  if (layout === 'row') {
    return (
      <span className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {name}
        {by}
      </span>
    );
  }
  return (
    <span className="inline-flex flex-col">
      {name}
      {by && <span className="mt-1.5">{by}</span>}
    </span>
  );
}
