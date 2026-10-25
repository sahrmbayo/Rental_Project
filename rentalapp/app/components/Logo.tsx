import Link from 'next/link';
import { SITE_NAME } from '../lib/constants';

type LogoProps = {
  /** `light` is for dark backgrounds such as the footer. */
  tone?: 'dark' | 'light';
  size?: 'sm' | 'md';
  href?: string;
};

export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-brand-600" />
      <circle cx="23" cy="9.5" r="3.5" className="fill-accent-400" />
      <path
        d="M7 16.5 16 9l9 7.5"
        fill="none"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 15.5V24h12v-8.5" fill="none" stroke="white" strokeWidth="2.6" strokeLinejoin="round" />
      <rect x="14" y="18.5" width="4" height="5.5" rx="1" fill="white" />
    </svg>
  );
}

export default function Logo({ tone = 'dark', size = 'md', href = '/' }: LogoProps) {
  const text = size === 'sm' ? 'text-lg' : 'text-xl';
  const mark = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';

  return (
    <Link href={href} className="flex items-center gap-2" aria-label={`${SITE_NAME} home`}>
      <LogoMark className={mark} />
      <span className={`${text} font-extrabold tracking-tight ${tone === 'light' ? 'text-white' : 'text-gray-900'}`}>
        Salone<span className="text-accent-500">Rent</span>
      </span>
    </Link>
  );
}
