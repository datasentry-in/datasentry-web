import Link from 'next/link';

/** The marketing site — where the DataSentry wordmark always leads. */
export const BRAND_URL = 'https://datasentry.in';

type Size = 'sm' | 'md' | 'lg';
const TYPE: Record<Size, { font: string; rule: number; offset: number }> = {
  sm: { font: 'text-[13px]', rule: 2.5, offset: 3 },
  md: { font: 'text-[14.5px]', rule: 3, offset: 4 },
  lg: { font: 'text-[18px]', rule: 4, offset: 5 },
};

/**
 * DataSentry's two-colour type lockup, shared by the product name and the
 * company wordmark: the first word in brand blue #009FE3, the second in ink
 * with a solid yellow #FFED00 rule beneath it — yellow text would vanish on
 * white, so yellow is the rule, as it frames the logo. A logotype, so the blue
 * is the brand's own, not the darker UI accent.
 */
function TwoTone({ first, second, size }: { first: string; second: string; size: Size }) {
  const t = TYPE[size];
  return (
    <span className={`${t.font} whitespace-nowrap font-bold leading-none tracking-[-0.025em]`}>
      <span className="text-[var(--ds-brand)]">{first}</span>{' '}
      <span
        className="text-[var(--ds-brand-ink)] underline decoration-[var(--ds-brand-yellow)]"
        style={{ textDecorationThickness: t.rule, textUnderlineOffset: t.offset, textDecorationSkipInk: 'none' }}
      >
        {second}
      </span>
    </span>
  );
}

/** The company wordmark: "Data Sentry", in the same type as "DPDP Console". */
export function Wordmark({ size = 'sm' }: { size?: Size }) {
  return (
    <span role="img" aria-label="Data Sentry">
      <TwoTone first="Data" second="Sentry" size={size} />
    </span>
  );
}

/** The wordmark as a link to datasentry.in. */
export function BrandLink({ size = 'sm' }: { size?: Size }) {
  return (
    <a href={BRAND_URL} aria-label="Data Sentry — datasentry.in" className="inline-flex transition-opacity hover:opacity-80">
      <Wordmark size={size} />
    </a>
  );
}

/**
 * The product lockup: the product name, and who powers it — the Data Sentry
 * wordmark, set in the same two-colour type. Used wherever the console names
 * itself, so it is never in doubt which system this is.
 */
export function ProductLockup({
  size = 'sm', byline = true, layout = 'stack', href,
}: { size?: 'sm' | 'lg'; byline?: boolean; layout?: 'stack' | 'row'; href?: string }) {
  const lg = size === 'lg';
  const name = <TwoTone first="DPDP" second="Console" size={lg ? 'lg' : 'md'} />;
  // The product name and the maker are separate links: the name goes home
  // inside the console (`href`), the wordmark goes to datasentry.in.
  const title = href ? <Link href={href}>{name}</Link> : name;
  const by = byline && (
    <span className="flex items-center gap-1.5">
      <span className="text-[11px] font-medium leading-none text-[var(--ds-text-3)]">Powered by</span>
      <BrandLink size={lg ? 'md' : 'sm'} />
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
