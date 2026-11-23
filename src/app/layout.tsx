import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppHeader } from '@/components/layout/AppHeader';
import { Providers } from '@/components/layout/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'TaskFlow — Kanban boards', template: '%s · TaskFlow' },
  description: 'Kanban boards with accounts and drag & drop. A learning project built with Next.js, dnd-kit and Motion.',
  icons: { icon: '/taskflow/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <Providers>
          <AppHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
