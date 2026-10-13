import { ORGS, clientData, currentUser } from '@/modules/app/dpdp/mock/clients';
import { useStoredSet } from '@/modules/app/ui/storedSet';
import { demoPath } from '@/modules/app/dpdp/routes';
import { parseDisplayDate } from '@/modules/app/dpdp/time';
import type { AuditEntry } from '@/modules/app/dpdp/types';

/**
 * The inbox: what other people changed or said on your clients' records — an
 * owner attesting a task, a request logged, a finding raised, a comment on a
 * thread you are in. Your own changes are not news, so they are left out.
 * Derived from each client's audit trail and comments; a live app reads the
 * same two feeds. Time-critical clocks stay in the bell (attention.ts).
 */

export type InboxItem = {
  id: string;
  org: string;
  client: string;
  kind: 'change' | 'comment';
  at: string;
  who: string;
  ref: string;
  title: string;
  /** The comment's text, or the record the change was made on. */
  detail?: string;
  change?: AuditEntry['change'];
  internal?: boolean;
  href: string;
};

/** Where a record reference lives in a client's console. */
export function hrefForRef(org: string, ref: string) {
  if (/^DSR-/.test(ref)) return demoPath(org, 'dsr');
  if (/^G-\d/.test(ref)) return demoPath(org, 'gaps');
  if (/^T-\d/.test(ref)) return demoPath(org, 'tasks');
  if (/^INC-/.test(ref)) return demoPath(org, 'breach');
  if (/^(PA-\d|RoPA)/.test(ref)) return demoPath(org, 'ropa');
  if (/^(CW|RX)-/.test(ref)) return demoPath(org, 'consent');
  if (ref === 'Inbox') return demoPath(org, 'intake');
  return demoPath(org);
}

const time = (at: string) => parseDisplayDate(at)?.getTime() ?? 0;

/** Every inbox item across the portfolio, newest first. */
export function inboxItems(): InboxItem[] {
  const out: InboxItem[] = [];
  for (const o of ORGS) {
    const d = clientData(o.slug);
    for (const e of d.audit.filter((x) => x.who !== currentUser.name)) {
      out.push({
        id: `${o.slug}:a:${e.at}:${e.ref}`, org: o.slug, client: o.name, kind: 'change', at: e.at, who: e.who,
        ref: e.ref, title: e.what, change: e.change, href: hrefForRef(o.slug, e.ref),
      });
    }
    for (const c of d.comments.filter((x) => x.who !== currentUser.name)) {
      out.push({
        id: `${o.slug}:c:${c.id}`, org: o.slug, client: o.name, kind: 'comment', at: c.at, who: c.who,
        ref: c.ref, title: `Commented on ${c.ref}`, detail: c.text, internal: c.visibility === 'internal',
        href: hrefForRef(o.slug, c.ref),
      });
    }
  }
  return out.sort((a, b) => time(b.at) - time(a.at));
}

/**
 * New since the last visit: the mock treats anything in the four days before
 * the newest item as unread until opened (a live app keeps a read marker per
 * person). Read ids are kept per viewer — see `INBOX_READ`.
 */
export function unreadByDefault(items: InboxItem[]) {
  const newest = items.length ? time(items[0].at) : 0;
  return new Set(items.filter((i) => time(i.at) >= newest - 4 * 86_400_000).map((i) => i.id));
}

/** localStorage key for the inbox items this viewer has read. */
export const INBOX_READ = 'ds-console-inbox-read';

/** The unread items, for the sidebar's count — live as items are read. */
export function useUnreadInbox() {
  const read = useStoredSet(INBOX_READ);
  const items = inboxItems();
  const fresh = unreadByDefault(items);
  return items.filter((i) => fresh.has(i.id) && !read.has(i.id));
}
