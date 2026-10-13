import { demoPath } from '@/modules/app/dpdp/routes';
import { Button, PageHeader } from '@/modules/app/ui/ui';

/**
 * A module that is built from the register, for a client still in discovery:
 * say what it will hold, why it is empty, and the one thing that fills it.
 * With `title`, it renders as the whole page (header and all).
 */
export default function ModulePending({ org, what, title }: { org: { slug: string; name: string }; what: string; title?: string }) {
  const body = (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-[var(--ds-border-strong)] px-6 py-14 text-center">
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-[var(--ds-text-3)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 5h16v14H4z" />
        <path d="M8 9h8M8 13h5" />
      </svg>
      <p className="mt-3 text-[14px] font-semibold">Starts after discovery</p>
      <p className="mt-1 max-w-md text-[14px] leading-relaxed text-[var(--ds-text-2)]">
        {what} is built from the register, and the register is built from the discovery interview — which has
        not started yet. Nothing here is guessed or carried over from another client.
      </p>
      <div className="mt-5">
        <Button as="link" variant="primary" href={demoPath(org.slug, 'discovery')}>Start the interview</Button>
      </div>
    </div>
  );
  if (!title) return body;
  return (
    <div className="space-y-8">
      <PageHeader title={title} sub={org.name} />
      {body}
    </div>
  );
}
