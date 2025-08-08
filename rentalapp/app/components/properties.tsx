import { PrismaClient } from '../generated/prisma'; // Assumes Prisma client is in node_modules/@prisma/client
import Link from 'next/link';
import Image from 'next/image';
import { Edit, PlusCircle } from 'lucide-react';

// --- IMPORTANT: Adjust these import paths to match YOUR project structure ---
import { DeletePropertyButton } from '../components/DeletePropertyButton';
import DashboardLayout from '../Dashboard/DashboardLayout'; // A common place for a shared layout

// --- Data Fetching (Server-Side) ---
const prisma = new PrismaClient();
async function getProperties() {
  // Make sure your database has a `postedAt` field or change the orderBy field
  return await prisma.property.findMany({
    orderBy: { postedAt: 'desc' },
  });
}

// --- Main Page Component (Server Component) ---
export default async function PropertiesListPage() {
  const properties = await getProperties();

  return (
    <DashboardLayout
      currentPage="properties"
      headerTitle="Manage Properties"
      headerSubtitle="View, edit, or delete your property listings."
    >
      <div className="flex justify-end">
        <Link href="/Dashboard/add-property" className="mb-6 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
          <PlusCircle size={18} />
          Add Property
        </Link>
      </div>

      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Property</th>
                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Status</th>
                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Price</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {properties.map((prop) => (
                    <tr key={prop.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image
                              className="h-10 w-10 rounded-md object-cover"
                              src={prop.imageUrl || 'https://placehold.co/40x40/E0E7FF/4F46E5?text=Img'}
                              alt="Property Image"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{prop.title}</div>
                            <div className="text-gray-500">{prop.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">${Number(prop.price).toLocaleString()}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center justify-end gap-4">
                          <Link href={`/dashboard/properties/${prop.id}/edit`} className="text-blue-600 hover:text-blue-800" title="Edit Property">
                            <Edit size={18} />
                          </Link>
                          <DeletePropertyButton propertyId={prop.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
