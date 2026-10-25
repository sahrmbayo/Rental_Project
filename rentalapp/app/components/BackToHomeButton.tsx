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
        className="btn btn-outline"
      >
        {label}
      </Link>
    </div>
  );
}
