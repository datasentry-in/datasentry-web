import { clientTheme } from '@/modules/app/dpdp/mock/clients';

/**
 * A client's square mark — their initials on their brand colour. Stands in
 * for an uploaded logo, which a live app would show here instead.
 */
export default function ClientMark({ slug, size = 20 }: { slug: string; size?: 20 | 24 | 32 }) {
  const t = clientTheme(slug);
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center font-bold text-white ${size === 32 ? 'rounded-md' : 'rounded'}`}
      style={{ width: size, height: size, background: t.accent, fontSize: size === 32 ? 12 : size === 24 ? 10 : 9, letterSpacing: '0.02em' }}
    >
      {t.initials}
    </span>
  );
}
