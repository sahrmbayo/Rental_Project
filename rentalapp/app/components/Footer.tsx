'use client';
import { Facebook, Instagram } from 'lucide-react';
import { AiFillTikTok } from "react-icons/ai";
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";
import { SITE_NAME } from '../lib/constants';
import Logo from './Logo';

export default function Footer() {
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

  const socials = [
    { href: 'https://www.facebook.com/share/19RtLwTEvQ/', label: 'Facebook', icon: <Facebook size={18} /> },
    { href: 'https://vm.tiktok.com/ZMHvjHEBs2GmX-l8fmq/', label: 'TikTok', icon: <AiFillTikTok size={18} /> },
    { href: 'https://www.instagram.com/salone.rent?igsh=MXh0eWNxNncxbXBtNw==', label: 'Instagram', icon: <Instagram size={18} /> },
  ];

  return (
    <footer className="bg-brand-950 text-brand-100/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo tone="light" />
            <p className="mt-4 text-sm text-brand-100/70">
              Your trusted partner for finding rental properties across Sierra Leone.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-300">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/properties" className="hover:text-white">Browse Properties</Link></li>
              {role === 'admin' ? (
                <li><Link href="/Dashboard" className="hover:text-white">For Agents</Link></li>
              ) : (
                <li><Link href="/apply-as-agent" className="hover:text-white">Become an Agent</Link></li>
              )}
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              {role !== 'admin' ? (
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              ) : null}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-300">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-300">Connect With Us</h3>
            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-accent-500"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-center text-sm text-brand-100/60">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
