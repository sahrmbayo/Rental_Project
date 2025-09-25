// File: components/WhatsAppShareButton.jsx

'use client';

import { Share2 } from 'lucide-react';

const WhatsAppShareButton = ({ property }) => {
  const handleShare = (e) => {
    // This is crucial to prevent the parent <Link> from navigating
    e.stopPropagation();
    e.preventDefault();

    // Get the website's base URL (works on localhost and live domain)
    const baseUrl = window.location.origin;
    
    // Create the full URL to the property's detail page
    const propertyUrl = `${baseUrl}/properties/${property.id}`;

    // Format the price consistently with your card
    const formattedPrice = `Nle${Number(property.price).toLocaleString()}`;

    // Create the share message
    const message = `Check out this property I found!\n\n*${property.title}*\nPrice: ${formattedPrice}/Yr\n\nSee more details here:\n${propertyUrl}`;

    // Encode the message for the URL and create the final WhatsApp link
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    // Open the link in a new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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