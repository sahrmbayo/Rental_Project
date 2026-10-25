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
      className={`btn btn-sm ${
        isFav ? 'bg-accent-50 text-accent-600 ring-1 ring-accent-200' : 'btn-ghost ring-1 ring-gray-200'
      }`}
    >
      <Heart size={16} className={isFav ? 'fill-current' : ''} />
      {isFav ? 'Saved' : 'Save'}
    </button>
  );
}