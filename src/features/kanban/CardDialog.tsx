'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
import type { Card, LabelColor } from '@/types';
import { LABELS } from './labels';

interface Props {
  card: Card | null;
  onClose: () => void;
  onChange: (patch: Partial<Card>) => void;
  onDelete: () => void;
}

export function CardDialog({ card, onClose, onChange, onDelete }: Props) {
  const toggleLabel = (l: LabelColor) => card && onChange({ labels: card.labels.includes(l) ? card.labels.filter((x) => x !== l) : [...card.labels, l] });

  return (
    <Modal open={!!card} onClose={onClose} title="Edit card">
      {card && (
        <div className="space-y-4">
          <input value={card.title} onChange={(e) => onChange({ title: e.target.value })} className="w-full rounded-xl px-2 py-1 text-xl font-bold outline-none focus:bg-slate-50" aria-label="Title" />
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Labels</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(LABELS) as LabelColor[]).map((l) => {
                const active = card.labels.includes(l);
                return (
                  <motion.button
                    key={l}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleLabel(l)}
                    className={cn('rounded-full px-3 py-1 text-xs font-semibold transition', LABELS[l].className, active ? 'ring-2 ring-current' : 'opacity-50 hover:opacity-100')}
                  >
                    {active && '✓ '}
                    {LABELS[l].name}
                  </motion.button>
                );
              })}
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Due date</span>
            <input type="date" value={card.dueDate ?? ''} onChange={(e) => onChange({ dueDate: e.target.value || null })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Description</span>
            <textarea rows={4} value={card.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Add more details…" className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400" />
          </label>
          <div className="flex justify-between pt-2">
            <Button variant="ghost" className="text-rose-600 hover:bg-rose-50" onClick={onDelete}>
              Delete card
            </Button>
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
