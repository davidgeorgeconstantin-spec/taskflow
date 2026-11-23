'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { BoardPreview } from '@/features/landing/BoardPreview';

const FEATURES = [
  { icon: '🔐', title: 'Accounts', text: 'Sign up, log in, protected pages. Each user sees only their own boards.' },
  { icon: '🖱️', title: 'Drag & drop', text: 'Move cards between columns with mouse, touch or keyboard (dnd-kit).' },
  { icon: '🏷️', title: 'Labels & due dates', text: 'Color labels, due dates with overdue warnings, descriptions.' },
  { icon: '💾', title: 'Saved automatically', text: 'State in Zustand, persisted to localStorage on every change.' },
];

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
        <div aria-hidden="true" className="absolute -top-24 left-1/3 -z-10 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl" />
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
            Learning project · Next.js + dnd-kit
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Organize work in <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">flowing boards</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-5 max-w-lg text-lg text-slate-600">
            A Kanban app with accounts, drag & drop, labels and due dates. Try it with the demo account — no sign-up needed.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-8 flex gap-3">
            <Link href="/signup/" className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:-translate-y-0.5 hover:bg-indigo-500">
              Get started
            </Link>
            <Link href="/login/" className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold transition hover:-translate-y-0.5">
              Try the demo
            </Link>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.92, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 18 }}>
          <BoardPreview />
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.li
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-slate-200 bg-white p-6"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{f.text}</p>
            </motion.li>
          ))}
        </ul>
      </section>
    </main>
  );
}
