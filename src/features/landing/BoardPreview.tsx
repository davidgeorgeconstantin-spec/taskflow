'use client';

import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

const TASKS = ['Design homepage', 'Write tests', 'Fix login bug', 'Deploy to Vercel'];
const COLS = ['To do', 'Doing', 'Done'];

/** Auto-playing mini board: a card moves to the next column every 1.6s (shared layout animation). */
export function BoardPreview() {
  const reduce = useReducedMotion();
  const [positions, setPositions] = useState([0, 0, 1, 2]);

  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = setInterval(() => {
      setPositions((p) => {
        const next = [...p];
        const idx = i % next.length;
        next[idx] = ((next[idx] ?? 0) + 1) % 3;
        i++;
        return next;
      });
    }, 1600);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <LayoutGroup>
      <div className="grid grid-cols-3 gap-3 rounded-3xl border border-white/60 bg-white/70 p-4 shadow-2xl shadow-indigo-900/10 backdrop-blur">
        {COLS.map((col, c) => (
          <div key={col} className="min-h-56 rounded-2xl bg-slate-100 p-2.5">
            <p className="mb-2 px-1 text-xs font-bold text-slate-500">{col}</p>
            <div className="space-y-2">
              {TASKS.map((t, i) =>
                positions[i] === c ? (
                  <motion.div key={t} layoutId={t} transition={{ type: 'spring', stiffness: 260, damping: 26 }} className="rounded-xl bg-white p-2.5 text-xs font-medium shadow-sm">
                    <span className={`mb-1 block h-1.5 w-8 rounded-full ${['bg-rose-400', 'bg-sky-400', 'bg-amber-400', 'bg-emerald-400'][i]}`} />
                    {t}
                  </motion.div>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>
    </LayoutGroup>
  );
}
