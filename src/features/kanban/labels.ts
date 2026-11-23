import type { LabelColor } from '@/types';

export const LABELS: Record<LabelColor, { name: string; className: string }> = {
  red: { name: 'Urgent', className: 'bg-rose-100 text-rose-700' },
  amber: { name: 'Design', className: 'bg-amber-100 text-amber-700' },
  green: { name: 'Done-ish', className: 'bg-emerald-100 text-emerald-700' },
  blue: { name: 'Docs', className: 'bg-sky-100 text-sky-700' },
  violet: { name: 'Feature', className: 'bg-violet-100 text-violet-700' },
};

export function dueStatus(date: string | null) {
  if (!date) return null;
  const today = new Date().toISOString().slice(0, 10);
  if (date < today) return 'overdue';
  if (date === today) return 'today';
  return 'later';
}
