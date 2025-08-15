'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud } from 'lucide-react';
import Spinner from './Spinner'; // Assuming you have a Spinner component

export default function PublishButton({ propertyId, listingFee }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePublish = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Call your API route to create the Monime checkout session
      const response = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: propertyId,
          amount: listingFee, // e.g., 50000
          currency: 'SLL',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the API returns an error, display it
        throw new Error(data.error || 'Failed to start payment process.');
      }

      // If the API call is successful, it will return a redirectUrl
      if (data.redirectUrl) {
        // Redirect the user to the Monime checkout page
        router.push(data.redirectUrl);
      } else {
        throw new Error('Could not retrieve payment URL.');
      }

    } catch (err) {
      setError(err.message);
      setIsLoading(false); // Stop loading if there's an error
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handlePublish}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
      >
        {isLoading ? (
          <>
            <Spinner size="h-4 w-4" />
            <span>Redirecting...</span>
          </>
        ) : (
          <>
            <UploadCloud size={14} />
            <span>Pay</span>
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
