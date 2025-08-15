// import { MapPin, Bed, Bath, Home } from 'lucide-react';
// import Header from '../components/header'; // Adjust path if needed

// // --- Reusable Skeleton Card Component ---
// // This mimics the layout of your PropertyCard but with animated placeholders
// const PropertyCardSkeleton = () => (
//   <div className="group overflow-hidden rounded-xl border bg-white shadow-sm">
//     <div className="relative h-56 w-full animate-pulse bg-gray-200"></div>
//     <div className="p-4">
//       <div className="h-7 w-1/3 animate-pulse rounded-md bg-gray-300"></div>
//       <div className="mt-2 h-6 w-3/4 animate-pulse rounded-md bg-gray-200"></div>
//       <div className="mt-2 h-5 w-1/2 animate-pulse rounded-md bg-gray-200"></div>
//       <div className="mt-4 flex items-center space-x-4 border-t pt-4">
//         <div className="h-5 w-1/4 animate-pulse rounded-md bg-gray-200"></div>
//         <div className="h-5 w-1/4 animate-pulse rounded-md bg-gray-200"></div>
//         <div className="h-5 w-1/4 animate-pulse rounded-md bg-gray-200"></div>
//       </div>
//     </div>
//   </div>
// );

// // --- Main Loading Component ---
// export default function Loading() {
//   return (
//     <>
//       <Header />
//       <main className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-7xl">
//           {/* Page Header */}
//           <div className="text-center">
//             <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//               Loading Properties...
//             </h1>
//             <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
//               Please wait while we fetch the latest listings for you.
//             </p>
//           </div>

//           {/* Skeleton Grid */}
//           <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//             {/* Display 6 skeleton cards as a placeholder */}
//             <PropertyCardSkeleton />
//             <PropertyCardSkeleton />
//             <PropertyCardSkeleton />
//             <PropertyCardSkeleton />
//             <PropertyCardSkeleton />
//             <PropertyCardSkeleton />
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }
