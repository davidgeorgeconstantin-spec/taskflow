'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/features/auth/AuthProvider';
import { RequireAuth } from '@/features/auth/RequireAuth';
import { useBoardStore } from '@/features/boards/boardStore';
import { KanbanBoard } from '@/features/kanban/KanbanBoard';
import { cn } from '@/lib/cn';

/** Board page. The id is in the query string (?id=…) because a static export can't pre-build user-created URLs. */
function BoardView() {
  const id = useSearchParams().get('id');
  const { user } = useAuth();
  const board = useBoardStore((s) => (id ? s.boards[id] : undefined));

  if (!board || board.ownerId !== user?.id) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold">Board not found</p>
        <Link href="/app/" className="mt-4 inline-block text-indigo-600">
          ← Back to boards
        </Link>
      </div>
    );
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={cn('mb-6 rounded-3xl bg-gradient-to-r p-6 text-white', board.color)}>
        <Link href="/app/" className="text-sm text-white/80 hover:text-white">
          ← All boards
        </Link>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{board.title}</h1>
        <p className="text-sm text-white/80">Drag cards between columns · double-click a column title to rename · click a card to edit</p>
      </motion.div>
      <KanbanBoard board={board} />
    </>
  );
}

export default function BoardPage() {
  return (
    <RequireAuth>
      <main className="mx-auto max-w-7xl px-5 py-8">
        <Suspense>
          <BoardView />
        </Suspense>
      </main>
    </RequireAuth>
  );
}
