import { Suspense } from 'react';
import PropertiesListPage from '../../components/properties';
import Spinner from '../../components/Spinner';

// A skeleton component for a better loading experience
function PropertiesLoadingSkeleton() {
  // You can customize this with a more detailed UI skeleton if you like
  return (
    <div className="flex items-center justify-center flex-col p-8 text-gray-700 text-lg w-full min-h-screen bg-gray-50 rounded-lg">
      <p>Loading properties...</p>
      <div className='mt-4 w-50 h-50 bg-blend-darkening animate-spin m-auto'>
        <Spinner size="lg" />
      </div>
      
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
    <div>
      {/* Suspense provides a fallback while the async component loads */}
      <Suspense fallback={<PropertiesLoadingSkeleton />}>
        {/* We pass the searchParams down to the component that uses them */}
        <PropertiesListPage searchParams={searchParams} />
      </Suspense>
    </div>
  );
}