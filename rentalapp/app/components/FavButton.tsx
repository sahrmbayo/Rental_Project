'use client';
import { useOptimistic, startTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavorite } from '../action/favourite';

export default function FavButton({
  propertyId,
  initial,
}: {
  propertyId: string;
  initial: boolean;
}) {
  const [isFav, setOptimistic] = useOptimistic(initial, (_, next: boolean) => next);

  async function handleClick() {
    startTransition(() => {
      setOptimistic(!isFav); // <- now inside transition
    });
    await toggleFavorite(propertyId);
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
        isFav ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
      }`}
    >
      <Heart size={16} className={isFav ? 'fill-current' : ''} />
      {isFav ? 'Saved' : 'Save'}
    </button>
  );
}