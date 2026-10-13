import type { WorkPriority, WorkStatus } from '@/modules/app/ui/WorkRow';
import type { Dsr, FulfilmentTask, GapStatus, Severity } from './types';

/**
 * Each record's own statuses in the console's one work vocabulary (`WorkRow`),
 * with the label a glyph carries on hover. Lateness is not a stored status for
 * findings or requests: lists pass `late` from the live clock (sla.ts, When).
 */

export const FINDING_STATUS: Record<GapStatus, WorkStatus> = { Open: 'todo', 'In progress': 'progress', Resolved: 'done' };

export const TASK_STATUS: Record<FulfilmentTask['status'], WorkStatus> = {
  Open: 'todo', Overdue: 'overdue', Attested: 'done', Retained: 'kept',
};
export const TASK_LABEL: Record<FulfilmentTask['status'], string> = {
  Open: 'Open — awaiting the owner',
  Overdue: 'Overdue — escalated',
  Attested: 'Attested by the owner — not machine-verified',
  Retained: 'Kept on a statutory ground',
};

export const REQUEST_STATUS: Record<Dsr['status'], WorkStatus> = {
  New: 'todo', 'In progress': 'progress', 'Awaiting client': 'waiting', Closed: 'done',
};

export const SEVERITY_PRIORITY: Record<Severity, WorkPriority> = { High: 'high', Medium: 'medium', Low: 'low' };
