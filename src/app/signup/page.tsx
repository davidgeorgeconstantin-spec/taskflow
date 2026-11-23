import type { Metadata } from 'next';
import { AuthForm } from '@/features/auth/AuthForm';

export const metadata: Metadata = { title: 'Sign up' };

export default function SignupPage() {
  return (
    <main className="grid min-h-[80vh] place-items-center px-4">
      <AuthForm mode="signup" />
    </main>
  );
}
