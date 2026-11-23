'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { seedDemoBoard } from '@/features/boards/boardStore';
import { useAuth } from './AuthProvider';
import { AuthError } from './authService';

const DEMO = { name: 'Demo User', email: 'demo@taskflow.dev', password: 'demo1234' };

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(action: () => Promise<unknown>) {
    setLoading(true);
    setError(null);
    try {
      await action();
      router.push('/app/');
    } catch (e) {
      setError(e instanceof AuthError ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (mode === 'signup' && form.name.trim().length < 2) return setError('Please enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Please enter a valid email.');
    if (form.password.length < 8) return setError('Password must have at least 8 characters.');
    run(() => (mode === 'login' ? signIn(form.email, form.password) : signUp(form.name, form.email, form.password)));
  }

  /** Logs in as the demo user (creates it + example boards the first time). */
  function tryDemo() {
    run(async () => {
      try {
        await signIn(DEMO.email, DEMO.password);
      } catch {
        const user = await signUp(DEMO.name, DEMO.email, DEMO.password);
        seedDemoBoard(user.id);
      }
    });
  }

  const fields = mode === 'signup' ? (['name', 'email', 'password'] as const) : (['email', 'password'] as const);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-indigo-900/5">
      <h1 className="text-2xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
      <p className="mt-1 text-sm text-slate-500">{mode === 'login' ? 'Log in to see your boards.' : 'Free, no credit card. Data stays in your browser.'}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        {fields.map((f, i) => (
          <motion.label key={f} className="block" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
            <span className="text-sm font-medium capitalize text-slate-700">{f}</span>
            <input
              type={f === 'password' ? 'password' : f === 'email' ? 'email' : 'text'}
              autoComplete={f === 'password' ? (mode === 'login' ? 'current-password' : 'new-password') : f}
              value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </motion.label>
        ))}
        <AnimatePresence>
          {error && (
            <motion.p role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <Button type="submit" loading={loading} className="w-full">
          {mode === 'login' ? 'Log in' : 'Sign up'}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
      </div>
      <Button variant="secondary" className="w-full" onClick={tryDemo} disabled={loading}>
        ✨ Try the demo account
      </Button>
      <p className="mt-6 text-center text-sm text-slate-500">
        {mode === 'login' ? (
          <>No account? <Link className="font-semibold text-indigo-600" href="/signup/">Sign up</Link></>
        ) : (
          <>Already have an account? <Link className="font-semibold text-indigo-600" href="/login/">Log in</Link></>
        )}
      </p>
    </motion.div>
  );
}
