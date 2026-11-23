'use client';

import { MotionConfig } from 'motion/react';
import { AuthProvider } from '@/features/auth/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>{children}</AuthProvider>
    </MotionConfig>
  );
}
