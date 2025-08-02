// components/DeletePropertyButton.tsx

'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react'; 

export function DeletePropertyButton({ propertyId }: { propertyId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    // Simple browser confirmation
    if (!confirm('Are you sure you want to permanently delete this property?')) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Property deleted!');
        router.refresh(); 
      } else {
        const data = await response.json();
        alert(`Failed to delete: ${data.message}`);
      }
    } catch (error) {
      console.error('Delete action failed:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:text-red-800" title="Delete Property">
      <Trash2 size={20} />
    </button>
  );
}