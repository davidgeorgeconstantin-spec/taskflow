'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState, type FormEvent } from 'react';

export function AddCardForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle('');
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {open ? (
        <motion.form key="form" onSubmit={submit} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <textarea
            autoFocus
            rows={2}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) submit(e);
              if (e.key === 'Escape') setOpen(false);
            }}
            placeholder="What needs to be done?"
            className="w-full resize-none rounded-xl border border-indigo-300 bg-white p-2.5 text-sm outline-none ring-4 ring-indigo-100"
          />
          <div className="mt-2 flex gap-2">
            <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white">Add card</button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-200">
              Cancel
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button key="btn" onClick={() => setOpen(true)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-500 hover:bg-slate-200/70">
          + Add a card
        </motion.button>
      )}
    </AnimatePresence>
  );
}
