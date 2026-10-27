// Agent's own property table, rendered by app/Dashboard/properties/page.tsx
import { prisma } from '../lib/prisma';
import type { Prisma } from '../generated/prisma';
import type { ImageAsset } from '../lib/propertySchema';
import { PLACEHOLDER_IMAGE } from '../lib/constants';
import { DAY_MS, LISTING_TTL_DAYS } from '../lib/config';
import Link from 'next/link';
import Image from 'next/image';
import { Copy, Edit, Eye, Heart, PlusCircle, Ticket } from 'lucide-react';
import { DeletePropertyButton } from '../components/DeletePropertyButton';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { SearchInput } from '../components/SearchInput';
import { confirmListing } from '../Dashboard/properties/actions';
import { auth } from '@clerk/nextjs/server';

async function getProperties(agentId: string, searchTerm?: string) {
  const whereClause: Prisma.PropertyWhereInput = {
    agentId,
    ...(searchTerm && {
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { address: { contains: searchTerm, mode: 'insensitive' } },
      ],
    }),
  };

  return prisma.property.findMany({
    where: whereClause,
    orderBy: { postedAt: 'desc' },
    include: {
      _count: { select: { favourite: true, orders: { where: { status: 'completed' } } } },
    },
  });
}

type Row = Awaited<ReturnType<typeof getProperties>>[number];

function statusOf(p: Row, now: number) {
  const daysLeft = Math.ceil((p.confirmedAt.getTime() + LISTING_TTL_DAYS * DAY_MS - now) / DAY_MS);
  if (p.rentedAt) return { label: 'Rented', tone: 'bg-brand-100 text-brand-800', needsConfirm: false };
  if (daysLeft <= 0) return { label: 'Expired – hidden', tone: 'bg-red-100 text-red-700', needsConfirm: true };
  if (!p.isAvailable) return { label: 'Reserved', tone: 'bg-accent-100 text-accent-800', needsConfirm: false };
  if (daysLeft <= 7) return { label: `Expires in ${daysLeft}d`, tone: 'bg-amber-100 text-amber-800', needsConfirm: true };
  return { label: 'Active', tone: 'bg-green-100 text-green-800', needsConfirm: false };
}

export default async function PropertiesListPage({ search }: { search?: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthenticated');

  const searchTerm = search ?? '';
  const properties = await getProperties(userId, searchTerm);
  const now = Date.now();

  return (
    <DashboardLayout
      currentPage="properties"
      headerTitle="Manage Properties"
      headerSubtitle={`Listings stay public for ${LISTING_TTL_DAYS} days after you last confirmed or edited them.`}
    >
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Search by title or address..." />
        <Link href="/Dashboard/add-property" className="btn btn-primary">
          <PlusCircle size={18} />
          Add Property
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Property</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">Price</th>
              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Performance</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {properties.length > 0 ? (
              properties.map((prop) => {
                const status = statusOf(prop, now);
                return (
                  <tr key={prop.id}>
                    <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            className="h-10 w-10 rounded-md object-cover"
                            src={(prop.images as ImageAsset[] | null)?.[0]?.url || PLACEHOLDER_IMAGE}
                            alt={prop.title}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ml-4">
                          <Link href={`/properties/${prop.id}`} className="font-medium text-gray-900 hover:text-brand-700">{prop.title}</Link>
                          <div className="text-gray-500">{prop.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.tone}`}>{status.label}</span>
                      {status.needsConfirm && (
                        <form action={confirmListing.bind(null, prop.id)} className="mt-2">
                          <button type="submit" className="btn btn-primary btn-sm">Still available</button>
                        </form>
                      )}
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 md:table-cell">
                      Nle{Number(prop.price).toLocaleString()}
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-600 lg:table-cell">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1" title="Page views"><Eye size={14} />{prop.viewCount}</span>
                        <span className="flex items-center gap-1" title="Saved by tenants"><Heart size={14} />{prop._count.favourite}</span>
                        <span className="flex items-center gap-1" title="Paid reservations"><Ticket size={14} />{prop._count.orders}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end gap-4">
                        <Link href={`/Dashboard/add-property?from=${prop.id}`} className="text-gray-500 hover:text-brand-700" title="Duplicate">
                          <Copy size={18} />
                        </Link>
                        <Link href={`/Dashboard/properties/${prop.id}/edit`} className="text-brand-600 hover:text-brand-800" title="Edit Property">
                          <Edit size={18} />
                        </Link>
                        <DeletePropertyButton propertyId={prop.id} />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  {searchTerm ? <>No properties found for &quot;{searchTerm}&quot;.</> : 'You have no properties yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
