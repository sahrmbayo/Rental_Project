import { Suspense } from 'react';
import PropertiesListPage from '../../components/properties';

// A skeleton component for a better loading experience
function PropertiesLoadingSkeleton() {
  // You can customize this with a more detailed UI skeleton if you like
  return (
    <div className="text-center p-8 text-gray-500">
      <p>Loading properties...</p>
    </div>
  );
}

// The Page component receives searchParams from Next.js
export default function PropertiesPage({
  searchParams,
}: {
  searchParams?: { search?: string };
}) {
  return (
    <div className="container mx-auto p-4">
      {/* Suspense provides a fallback while the async component loads */}
      <Suspense fallback={<PropertiesLoadingSkeleton />}>
        {/* We pass the searchParams down to the component that uses them */}
        <PropertiesListPage searchParams={searchParams} />
      </Suspense>
    </div>
  );
}