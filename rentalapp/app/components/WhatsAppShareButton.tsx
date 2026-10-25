'use client';

import type { MouseEvent } from 'react';
import { Share2 } from 'lucide-react';

type Props = { property: { id: string; title: string; price: number } };

const WhatsAppShareButton = ({ property }: Props) => {
  const handleShare = (e: MouseEvent) => {
    // Prevent the parent <Link> from navigating
    e.stopPropagation();
    e.preventDefault();

    const propertyUrl = `${window.location.origin}/properties/${property.id}`;
    const formattedPrice = `Nle${Number(property.price).toLocaleString()}`;
    const message = `Check out this property I found!\n\n*${property.title}*\nPrice: ${formattedPrice}/Yr\n\nSee more details here:\n${propertyUrl}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 z-10"
      aria-label="Share on WhatsApp"
    >
      <Share2 size={18} className="text-gray-800 dark:text-gray-300" />
    </button>
  );
};

export default WhatsAppShareButton;
