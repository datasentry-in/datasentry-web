import { scoreTone, scoreVerdict } from '@/modules/app/dpdp/score';
import TrendChart from '@/modules/app/ui/TrendChart';

/**
 * The readiness score as the first, double-width cell of a stat strip: the
 * number and verdict, and beside it the score at every review so far. A
 * single review shows as a baseline instead of a chart.
 */
export default function ScoreBlock({
  score, trend, history = [],
}: { score: number; trend: string; history?: { at: number; value: number; label: string }[] }) {
  const fg = scoreTone(score);
  const verdict = scoreVerdict(score);
  return (
    <div className="flex min-w-0 flex-col gap-3 bg-[var(--ds-panel)] px-4 py-3.5 sm:flex-row sm:items-stretch sm:gap-5">
      <div className="shrink-0 sm:w-36">
        <p className="text-[12px] font-medium leading-snug text-[var(--ds-text-2)]">Readiness score</p>
        <p className="mt-1.5 flex items-baseline gap-1 leading-none">
          <span className="ds-figure ds-num-in text-[24px] tracking-[-0.03em] text-[var(--ds-text)] sm:text-[26px]">{score}</span>
          <span className="ds-figure text-[12px] text-[var(--ds-text-3)]">/ 100</span>
        </p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--ds-subtle-2)]">
          <div className="h-full rounded-full" style={{ width: `${score}%`, background: fg }} />
        </div>
        <p className="mt-1.5 text-[12px] font-medium" style={{ color: fg }}>{verdict}</p>
        <p className="text-[12px] leading-snug text-[var(--ds-text-3)]">{trend}</p>
      </div>
      <div className="min-w-0 flex-1 sm:border-l sm:border-[var(--ds-border)] sm:pl-4">
        {history.length > 1 ? (
          <>
            <p className="mb-1 text-[12px] text-[var(--ds-text-3)]">At each review</p>
            <TrendChart points={history} color="var(--ds-accent)" label={`Readiness score at each review: ${history.map((h) => `${h.label} ${h.value}`).join(', ')}`} />
          </>
        ) : (
          <p className="flex h-full items-center text-[12px] leading-relaxed text-[var(--ds-text-3)]">
            Baseline — the trend starts at the next review.
          </p>
        )}
      </div>
    </div>
  );
}
