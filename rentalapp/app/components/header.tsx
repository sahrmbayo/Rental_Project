'use client';

import { Building2, Heart, User, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Building2 className="text-blue-600 w-6 h-6" />
        <span className="font-semibold text-lg text-gray-800">SL Rentals</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center space-x-6 text-sm text-gray-700">
        <Link href="#">Browse Properties</Link>
        <Link href="#">For Agents</Link>
        <Link href="#">Cities</Link>
        <Link href="#">Contact</Link>
        <div className="flex items-center space-x-1">
          <Heart className="w-4 h-4" />
          <Link href="#">Saved</Link>
        </div>
      </nav>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button className="flex items-center px-3 py-1.5 border rounded-full text-sm hover:bg-gray-100">
          <Plus className="w-4 h-4 mr-1" />
          List Property
        </button>
        <button className="flex items-center px-4 py-1.5 rounded-full text-white bg-gradient-to-r from-blue-500 to-pink-500 text-sm hover:opacity-90">
          <User className="w-4 h-4 mr-2" />
          Sign In
        </button>
      </div>
    </header>
  );
}
