'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { BellPlus, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { saveSearch } from '../action/savedSearches';
import type { PropertySearchParams } from '../lib/listings';

export default function SaveSearchButton({ params }: { params: PropertySearchParams }) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    if (!isSignedIn) {
      toast('Sign in to get alerts for new listings');
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    startTransition(async () => {
      const res = await saveSearch(params);
      if (res.ok) {
        setSaved(true);
        toast.success("Saved – we'll email you when new listings match");
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <button onClick={onClick} disabled={pending || saved} className="btn btn-outline btn-sm">
      {saved ? <Check size={14} /> : <BellPlus size={14} />}
      {saved ? 'Alert saved' : 'Email me new matches'}
    </button>
  );
}
