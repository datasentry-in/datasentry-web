import Link from 'next/link';

/** The marketing site — where the DataSentry wordmark always leads. */
export const BRAND_URL = 'https://datasentry.in';

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
 * The product lockup: the product name, and who powers it — the
 * DataSentry wordmark itself, not a plain-text label. Used wherever the
 * console names itself, so it is never in doubt which system this is.
 */
/** The wordmark as a link to datasentry.in. */
export function BrandLink({ className = 'h-[15px] w-auto' }: { className?: string }) {
  return (
    <a href={BRAND_URL} aria-label="DataSentry — datasentry.in" className="inline-flex transition-opacity hover:opacity-80">
      <Wordmark className={className} />
    </a>
  );
}

export function ProductLockup({
  size = 'sm', byline = true, layout = 'stack', href,
}: { size?: 'sm' | 'lg'; byline?: boolean; layout?: 'stack' | 'row'; href?: string }) {
  const lg = size === 'lg';
  const name = (
    <span
      className={`${lg ? 'text-[18px]' : 'text-[14.5px]'} whitespace-nowrap font-bold leading-none tracking-[-0.025em]`}
    >
      {/* DataSentry's two colours: blue #009FE3 and yellow #FFED00. Yellow text
          would vanish on white, so — like the rule framing the logo — it is a
          solid underline beneath "Console". A logotype, so the blue is the
          brand's own, not the darker UI accent. */}
      <span className="text-[var(--ds-brand)]">DPDP</span>{' '}
      <span
        className="text-[var(--ds-brand-ink)] underline decoration-[var(--ds-brand-yellow)]"
        style={{ textDecorationThickness: lg ? 4 : 3, textUnderlineOffset: lg ? 5 : 4, textDecorationSkipInk: 'none' }}
      >
        Console
      </span>
    </span>
  );
  // The product name and the maker are separate links: the name goes home
  // inside the console (`href`), the wordmark goes to datasentry.in.
  const title = href ? <Link href={href}>{name}</Link> : name;
  const by = byline && (
    <span className="flex items-center gap-1.5">
      <span className="text-[11px] font-medium leading-none text-[var(--ds-text-3)]">Powered by</span>
      <BrandLink className={lg ? 'h-5 w-auto' : 'h-[15px] w-auto'} />
    </span>
  );

  // Row: name and maker at either end, for a full-width strip.
  if (layout === 'row') {
    return (
      <span className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {title}
        {by}
      </span>
    );
  }
  return (
    <span className="inline-flex flex-col">
      {title}
      {by && <span className="mt-1.5">{by}</span>}
    </span>
  );
}
