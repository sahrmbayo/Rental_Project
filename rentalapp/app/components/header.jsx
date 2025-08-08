'use client';

import { useState } from 'react';
import { Building2, Heart, User, Plus, Menu, X } from 'lucide-react';
import Link from 'next/link';
import {  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton } from "@clerk/nextjs";

export default function Header() {

  // State to manage whether the mobile menu is open or closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  

  return (
    <header className="relative bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-800">SL Rentals</span>
        </Link>

        {/* Desktop Navigation & Actions */}
        <div className="hidden items-center space-x-8 md:flex m-auto">
          {/* Navigation Links */}
          <nav className="flex items-center justify-center space-x-6 text-sm text-gray-700">
            <Link href="#" className="hover:text-blue-600">Browse Properties</Link>
            <Link href="#" className="hover:text-blue-600">For Agents</Link>
            <Link href="#" className="hover:text-blue-600">Cities</Link>
            <Link href="#" className="hover:text-blue-600">Contact</Link>
            <Link href="#" className="flex items-center space-x-1 hover:text-blue-600">
              <Heart className="h-4 w-4" />
              <span>Saved</span>
            </Link>
          </nav>

          {/* Action Buttons */}
          
        </div>
        <div className=" hidden md:flex items-center space-x-4">
          <SignedOut>
              <SignInButton />
              <SignUpButton>
            <button  className="flex items-center rounded-full bg-gradient-to-r from-blue-500 to-pink-500 px-4 py-1.5 text-sm text-white hover:opacity-90">
              <User className="mr-2 h-4 w-4" />
              Sign In
            </button>
            </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="h-6 w-6" /> // Close icon
            ) : (
              <Menu className="h-6 w-6" /> // Hamburger icon
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="absolute w-full flex-col space-y-4 bg-white p-6 md:hidden">
          {/* Navigation Links */}
          <nav className="flex flex-col space-y-4 text-gray-700">
            <Link href="#">Browse Properties</Link>
            <Link href="#">For Agents</Link>
            <Link href="#">Cities</Link>
            <Link href="#">Contact</Link>
            <Link href="#" className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>Saved</span>
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
            <button className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-pink-500 px-4 py-1.5 text-sm text-white hover:opacity-90">
              <User className="mr-2 h-4 w-4" />
              Sign In
            </button>
            </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}