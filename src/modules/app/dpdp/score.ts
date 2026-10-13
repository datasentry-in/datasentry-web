/** Readiness score bands — the one place a score becomes a colour and a verdict. */
export const scoreTone = (score: number) =>
  score < 40 ? 'var(--ds-danger)' : score < 70 ? 'var(--ds-warn)' : 'var(--ds-ok)';

export const scoreVerdict = (score: number) =>
  score < 40 ? 'Not ready' : score < 70 ? 'Partially ready' : 'Substantially ready';
