import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="py-32 text-center">
      <p className="text-7xl font-black text-indigo-600">404</p>
      <Link href="/" className="mt-6 inline-block font-semibold text-indigo-600">← Home</Link>
    </main>
  );
}
