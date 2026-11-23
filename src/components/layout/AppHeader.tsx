'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useAuth } from '@/features/auth/AuthProvider';
import { asset } from '@/lib/paths';

export function AppHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link href={user ? '/app/' : '/'} className="flex items-center gap-2 font-bold">
          <motion.img src={asset('/favicon.svg')} alt="" className="h-8 w-8" whileHover={{ rotate: 8, scale: 1.1 }} />
          TaskFlow
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">{user.name}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
            <button
              onClick={() => {
                signOut();
                router.push('/');
              }}
              className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
            >
              Log out
            </button>
          </div>
        ) : (
          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link href="/login/" className="rounded-lg px-3 py-2 hover:bg-slate-100">Log in</Link>
            <Link href="/signup/" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">Sign up</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
