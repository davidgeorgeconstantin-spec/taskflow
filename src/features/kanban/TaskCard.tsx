import { cn } from '@/lib/cn';
import type { Card } from '@/types';
import { dueStatus, LABELS } from './labels';

interface Props {
  card: Card;
  dragging?: boolean;
  onClick?: () => void;
}

/** Pure presentational card (no drag logic) — reused in the list and in the drag overlay. */
export function TaskCard({ card, dragging, onClick }: Props) {
  const due = dueStatus(card.dueDate);
  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-grab rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing',
        dragging && 'shadow-2xl ring-2 ring-indigo-400',
      )}
    >
      {card.labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {card.labels.map((l) => (
            <span key={l} className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', LABELS[l].className)}>
              {LABELS[l].name}
            </span>
          ))}
        </div>
      )}
      <p className="text-sm font-medium leading-snug">{card.title}</p>
      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
        {card.dueDate && (
          <span className={cn(due === 'overdue' && 'font-semibold text-rose-600', due === 'today' && 'font-semibold text-amber-600')}>
            📅 {new Date(card.dueDate + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        )}
        {card.description && <span title="Has description">📝</span>}
      </div>
    </div>
  );
}
