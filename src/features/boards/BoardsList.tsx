'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useState, type FormEvent } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import { cn } from '@/lib/cn';
import { BOARD_COLORS, useBoardStore } from './boardStore';

export function BoardsList() {
  const { user } = useAuth();
  const allBoards = useBoardStore((s) => s.boards);
  const { createBoard, deleteBoard } = useBoardStore();
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(BOARD_COLORS[1]!);

  // Each user only sees their own boards (like Row Level Security in Supabase).
  const boards = Object.values(allBoards)
    .filter((b) => b.ownerId === user?.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!user || !title.trim()) return;
    createBoard(user.id, title.trim(), color);
    setTitle('');
  }

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">
        Hi {user?.name.split(' ')[0]} 👋
      </motion.h1>
      <p className="mt-1 text-slate-500">Your boards</p>

      <motion.ul layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence>
          {boards.map((b, i) => {
            const count = Object.keys(b.cards).length;
            return (
              <motion.li key={b.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.05 } }} exit={{ opacity: 0, scale: 0.85 }} whileHover={{ y: -6 }} className="group relative">
                <Link href={`/app/board/?id=${b.id}`} className={cn('block h-36 rounded-3xl bg-gradient-to-br p-5 text-white shadow-lg', b.color)}>
                  <p className="text-lg font-bold">{b.title}</p>
                  <p className="mt-1 text-sm text-white/80">
                    {b.columns.length} columns · {count} cards
                  </p>
                </Link>
                <button onClick={() => confirm(`Delete board "${b.title}"?`) && deleteBoard(b.id)} aria-label="Delete board" className="absolute right-3 top-3 rounded-full bg-black/20 px-2 text-white opacity-0 transition group-hover:opacity-100">
                  ✕
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
        <motion.li layout>
          <form onSubmit={onCreate} className="flex h-36 flex-col justify-between rounded-3xl border-2 border-dashed border-slate-300 bg-white p-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New board name…" className="rounded-lg px-1 py-1 font-semibold outline-none" />
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {BOARD_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setColor(c)} aria-label="Board color" className={cn('h-6 w-6 rounded-full bg-gradient-to-br', c, color === c && 'ring-2 ring-slate-900 ring-offset-2')} />
                ))}
              </div>
              <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40" disabled={!title.trim()}>
                Create
              </button>
            </div>
          </form>
        </motion.li>
      </motion.ul>
    </div>
  );
}
