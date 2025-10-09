'use client';
import Link from 'next/link';

interface BackButtonProps {
  variant?: 'home' | 'properties'; // choose button type
}

export default function BackToHomeButton({ variant = 'home' }: BackButtonProps) {
  const label = variant === 'properties' ? '← Back to Properties' : '← Back to Home';
  const href = variant === 'properties' ? '/properties' : '/';

  return (
    <div className="mt-12 flex justify-center">
      <Link
        href={href}
        className="rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
      >
        {label}
      </Link>
    </div>
  );
}
