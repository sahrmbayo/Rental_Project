'use client';

import { useState } from 'react';
import { Building2, Heart, Menu, X } from 'lucide-react';
import Link from 'next/link';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser
} from "@clerk/nextjs";

export default function Header() {
  const {user} = useUser();
  const role = user?.publicMetadata?.role as string | undefined;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // Use z-index to ensure the header is above other page content
    <header className="sticky top-0 bg-white/85 backdrop-blur-xs shadow-sm z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-800">SL Rentals</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center justify-center space-x-6 text-sm text-gray-700 md:flex">
          <Link href="/properties" className="hover:text-blue-600">Browse Properties</Link>
          
          {role === 'admin' ? (
            <Link href="/Dashboard" className="hover:text-blue-600">For Agents</Link>
          ) : null}
          <Link href="#" className="hover:text-blue-600">Cities</Link>
          {role !== 'admin' ? (
            <Link href="/contact" className="hover:text-blue-600">Contact Us</Link>
          ) : null}

          <Link href="/saved" className="flex items-center space-x-1 hover:text-blue-600">
            <Heart className="h-4 w-4" />
            <span>Saved</span>
          </Link>
        </nav>

        {/* Desktop Actions & Auth */}
        <div className="hidden items-center space-x-4 md:flex">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-gray-100 bg-gradient-to-r from-blue-600 to-pink-500 hover:opacity-90 transition-all shadow-md">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="flex items-center rounded-full bg-gradient-to-r from-pink-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-all shadow-md">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            {/* This renders Clerk's default user button */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? (
              <X className="h-7 w-7 text-blue-600" /> // Close icon
            ) : (
              <Menu className="h-7 w-7 text-blue-600" /> // Hamburger icon
            )}
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Overlay with Animation --- */}
      <div
        className={`absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-4 p-6">
          {/* Navigation Links */}
          <nav className="flex flex-col space-y-4 text-lg text-gray-700">
            <Link href="/properties" onClick={() => setIsMenuOpen(false)}>Browse Properties</Link>
            {role === 'admin' ? (
              <Link href="/Dashboard" onClick={() => setIsMenuOpen(false)}>For Agents</Link>
            ) : null}
            <Link href="#" onClick={() => setIsMenuOpen(false)}>Cities</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <Link href="/saved" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <Heart className="h-5 w-5" />
              <span>Saved</span>
            </Link>
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6"></div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-80 rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 py-2 text-center font-medium text-white hover:opacity-90 transition-all shadow-md">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 py-2 text-center font-medium text-white hover:opacity-90 transition-all shadow-md">
                  Sign Up
                </button>
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
