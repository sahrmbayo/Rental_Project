'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X } from 'lucide-react';
import {
  HomeIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser
} from "@clerk/nextjs";
import Logo from './Logo';

export default function Header() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: '/properties', label: 'Browse Properties', icon: HomeIcon, show: true },
    { href: '/Dashboard', label: 'For Agents', icon: BuildingOfficeIcon, show: role === 'admin' },
    { href: '/reservations', label: 'Reservations', icon: ClipboardDocumentListIcon, show: !!user },
    { href: '/about', label: 'About Us', icon: InformationCircleIcon, show: true },
    { href: '/contact', label: 'Contact Us', icon: EnvelopeIcon, show: role !== 'admin' },
  ].filter((l) => l.show);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-2 transition-colors ${
                isActive(l.href) ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/saved"
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 transition-colors ${
              isActive('/saved') ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Heart className="h-4 w-4" />
            Saved
          </Link>
        </nav>

        {/* Desktop Actions & Auth */}
        <div className="hidden items-center gap-3 md:flex">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-ghost">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn btn-primary">Get Started</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          className="rounded-full p-2 text-gray-700 hover:bg-gray-100 md:hidden"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute w-full border-b border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-4 p-6">
          <nav className="flex flex-col gap-1">
            {[...links, { href: '/saved', label: 'Saved', icon: Heart, show: true }].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl p-3 text-base font-medium transition-colors ${
                  isActive(l.href) ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <l.icon className="h-6 w-6 opacity-70" />
                <span>{l.label}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-200" />

          <div className="flex flex-col gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn btn-outline w-full">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-primary w-full">Get Started</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">My Account</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
