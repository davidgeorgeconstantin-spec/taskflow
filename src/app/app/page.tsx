'use client';

import { RequireAuth } from '@/features/auth/RequireAuth';
import { BoardsList } from '@/features/boards/BoardsList';

export default function DashboardPage() {
  return (
    <RequireAuth>
      <main className="mx-auto max-w-7xl px-5 py-10">
        <BoardsList />
      </main>
    </RequireAuth>
  );
}
