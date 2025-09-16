import { Building2, Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-7 w-7 text-blue-500" />
              <span className="text-xl font-semibold text-white">SL Rentals</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Your trusted partner for finding rental properties across Sierra Leone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/properties" className="hover:text-white">Browse Properties</Link></li>
              <li><Link href="#" className="hover:text-white">For Agents</Link></li>
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Connect With Us</h3>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} SL Rentals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
