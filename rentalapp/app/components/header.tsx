'use client';

import { useState } from 'react';
import { Building2, Heart, Menu, X} from 'lucide-react';
import {
  HomeIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  HeartIcon,
  BuildingOfficeIcon, // For "For Agents"
  XMarkIcon, // For the close button
} from '@heroicons/react/24/outline';
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
          <Link href="/about" className="hover:text-blue-600">About Us</Link>
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
              <button className="rounded-full px-4 py-2 text-sm border border-blue-600 text-center font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100 hover:shadow-sm">
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
            <Link href="/properties"
            className="flex items-center space-x-3 rounded-lg p-3 text-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(false)}>
            <HomeIcon className="h-6 w-6 text-gray-500" />
            <span>Browse Properties</span>
            </Link>

            {role === 'admin' ? (
              <Link href="/Dashboard" 
              className="flex items-center space-x-3 rounded-lg p-3 text-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}>
               <BuildingOfficeIcon className="h-6 w-6 text-gray-500" />
              <span>For Agents</span>
                </Link>
            ) : null}

            <Link href="/about"
            className="flex items-center space-x-3 rounded-lg p-3 text-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors" 
            onClick={() => setIsMenuOpen(false)}>
            <InformationCircleIcon className="h-6 w-6 text-gray-500" />
            <span>About Us</span>
            </Link>

            <Link href="/contact" className="flex items-center space-x-3 rounded-lg p-3 text-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
              <EnvelopeIcon className="h-6 w-6 text-gray-500" />
              <span>Contact</span>
            </Link>

            <Link href="/saved" className="flex items-center space-x-3 rounded-lg p-3 text-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
              <Heart className="h-6 w-6 text-gray-500" />
              <span>Saved</span>
            </Link>
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6"></div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full rounded-lg border border-pink-600 py-3 text-center font-medium text-pink-600 transition-all duration-200 hover:bg-pink-50 hover:shadow-sm">
                Sign In
              </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 py-3 text-center font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg hover:opacity-90">
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
