'use client';

import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/cn';

interface Props extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
}

export function Button({ variant = 'primary', loading, className, children, disabled, ...props }: Props) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60',
        variant === 'primary' && 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500',
        variant === 'secondary' && 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
        variant === 'ghost' && 'text-slate-600 hover:bg-slate-100',
        className,
      )}
      {...props}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
      {children as React.ReactNode}
    </motion.button>
  );
}
