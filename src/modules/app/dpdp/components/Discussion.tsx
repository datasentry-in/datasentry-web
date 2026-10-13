'use client';

import { ORGS, TEAM, clientData, currentUser } from '@/modules/app/dpdp/mock/clients';
import { useRef, useState } from 'react';
import type { RecordComment } from '@/modules/app/dpdp/types';
import { formatIstShort } from '@/modules/app/dpdp/time';
import { useToast } from '@/modules/app/ui/Toast';
import { Avatar } from '@/modules/app/ui/ui';
import When from './When';

/**
 * A record's discussion: comments with @mentions, each marked internal (the
 * DataSentry team only) or shared with the client's owners. Compliance work
 * is several people's work — consultant, HR, CISO, legal — so it happens on
 * the record, not in email. In the mock, posting notifies no one and says so.
 */

const ME = currentUser.name;
const mentionPattern = (names: string[]) => new RegExp(`@(${names.map((n) => n.replace(/ /g, '\\s')).join('|')})`, 'g');

function Body({ text, names }: { text: string; names: string[] }) {
  const MENTION = mentionPattern(names);
  const parts = text.split(MENTION);
  return (
    <p className="mt-0.5 whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--ds-text)]">
      {parts.map((p, i) =>
        names.includes(p) ? (
          <span key={i} className="rounded bg-[var(--ds-accent-weak)] px-1 font-medium text-[var(--ds-accent-hover)]">@{p}</span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  );
}

function Visibility({ v }: { v: RecordComment['visibility'] }) {
  return v === 'internal' ? (
    <span className="rounded bg-[var(--ds-subtle-2)] px-1.5 py-px text-[11px] font-medium text-[var(--ds-text-2)]">Internal</span>
  ) : (
    <span className="rounded bg-[var(--ds-ok-weak)] px-1.5 py-px text-[11px] font-medium text-[var(--ds-ok)]">Shared with client</span>
  );
}

export default function Discussion({ org, refId }: { org: string; refId: string }) {
  const data = clientData(org);
  const client = ORGS.find((o) => o.slug === org)?.name.split(' ')[0] ?? 'the client';
  const people = [...TEAM.map((p) => ({ ...p, side: 'DataSentry' as const })), ...data.people.map((p) => ({ ...p, side: 'Client' as const }))];
  const names = people.map((p) => p.name);
  const toast = useToast();
  const [added, setAdded] = useState<RecordComment[]>([]);
  const [text, setText] = useState('');
  const [visibility, setVisibility] = useState<RecordComment['visibility']>('shared');
  const [picking, setPicking] = useState<string | null>(null);
  const box = useRef<HTMLTextAreaElement>(null);

  const thread = [...data.comments.filter((c) => c.ref === refId), ...added];
  const suggestions = picking === null ? [] : people.filter((p) => p.name.toLowerCase().startsWith(picking.toLowerCase())).slice(0, 5);

  const onType = (v: string) => {
    setText(v);
    const m = v.slice(0, box.current?.selectionStart ?? v.length).match(/@([A-Za-z]*)$/);
    setPicking(m ? m[1] : null);
  };

  const pick = (name: string) => {
    const caret = box.current?.selectionStart ?? text.length;
    const before = text.slice(0, caret).replace(/@([A-Za-z]*)$/, `@${name} `);
    setText(before + text.slice(caret));
    setPicking(null);
    box.current?.focus();
  };

  const post = () => {
    const body = text.trim();
    if (!body) return;
    setAdded((a) => [...a, { id: `n${a.length}`, ref: refId, who: ME, at: formatIstShort(new Date()), text: body, visibility }]);
    setText('');
    const mentioned = names.filter((n) => body.includes(`@${n}`));
    toast(
      visibility === 'internal' ? 'Internal note added' : `Comment shared with ${client}`,
      mentioned.length ? `${mentioned.join(', ')} would be notified · in this mock nothing is sent` : 'Added to the record’s history',
    );
  };

  return (
    <div className="space-y-4">
      {thread.length === 0 && <p className="text-[13px] text-[var(--ds-text-3)]">No comments yet.</p>}
      {thread.map((c) => (
        <div key={c.id} className="flex gap-2.5">
          <Avatar name={c.who} size={24} />
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px]">
              <span className="font-medium text-[var(--ds-text)]">{c.who}</span>
              <When date={c.at} kind="event" className="text-[var(--ds-text-3)]" />
              <Visibility v={c.visibility} />
            </p>
            <Body text={c.text} names={names} />
          </div>
        </div>
      ))}

      <div className="relative rounded-lg border border-[var(--ds-border)] focus-within:border-[var(--ds-accent)]">
        <textarea
          ref={box}
          rows={2}
          value={text}
          onChange={(e) => onType(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) post();
            if (e.key === 'Escape' && picking !== null) {
              // Close the list only — not the panel around the composer.
              e.preventDefault();
              setPicking(null);
            }
          }}
          placeholder="Comment, or @mention someone…"
          aria-label="Add a comment"
          className="block w-full resize-none rounded-lg px-3 py-2.5 text-[13px] outline-none placeholder:text-[var(--ds-text-3)]"
        />
        {suggestions.length > 0 && (
          <ul className="absolute bottom-full left-2 z-10 mb-1 w-64 overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] py-1 shadow-[var(--ds-shadow-md)]">
            {suggestions.map((p) => (
              <li key={p.name}>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(p.name)} className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left hover:bg-[var(--ds-subtle)]">
                  <Avatar name={p.name} size={20} />
                  <span className="min-w-0">
                    <span className="block text-[13px]">{p.name}</span>
                    <span className="block truncate text-[11px] text-[var(--ds-text-3)]">{p.role} · {p.side === 'DataSentry' ? 'DataSentry' : 'client'}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--ds-border)] px-2 py-1.5">
          <div role="radiogroup" aria-label="Who can see this" className="flex rounded-md bg-[var(--ds-subtle)] p-0.5 text-[12px]">
            {(['shared', 'internal'] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={visibility === v}
                onClick={() => setVisibility(v)}
                className={`rounded px-2 py-0.5 transition-colors ${visibility === v ? 'bg-[var(--ds-panel)] font-medium text-[var(--ds-text)] shadow-[var(--ds-shadow)]' : 'text-[var(--ds-text-3)]'}`}
              >
                {v === 'shared' ? 'Shared with client' : 'Internal'}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={post}
            disabled={!text.trim()}
            className="rounded-md bg-[var(--ds-accent)] px-2.5 py-1 text-[12px] font-medium text-white transition-colors hover:bg-[var(--ds-accent-hover)] disabled:bg-[var(--ds-subtle-2)] disabled:text-[var(--ds-text-3)]"
          >
            Comment <span className="opacity-70">⌘↵</span>
          </button>
        </div>
      </div>
    </div>
  );
}
