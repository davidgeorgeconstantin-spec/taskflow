import type { Metadata } from 'next';
import { AuthForm } from '@/features/auth/AuthForm';

export const metadata: Metadata = { title: 'Log in' };

export default function LoginPage() {
  return (
    <main className="grid min-h-[80vh] place-items-center px-4">
      <AuthForm mode="login" />
    </main>
  );
}
