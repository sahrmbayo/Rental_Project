// app/saved/RemoveButton.tsx
'use client';
import { useTransition } from 'react';
import { Heart } from 'lucide-react';
import { removeFavorite } from '../action/favourite';

export default function RemoveButton({ propertyId }: { propertyId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await removeFavorite(propertyId);
        })
      }
      disabled={isPending}
      className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
      aria-label="Remove from saved"
      title="Remove"
    >
      <Heart size={14} className="fill-red-500 text-red-500" />
    </button>
  );
}