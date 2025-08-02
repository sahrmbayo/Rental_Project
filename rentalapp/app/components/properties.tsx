// Example of how to use the button in a property list page
import Layout from '../Dashboard/Layout';
import { PrismaClient } from '../generated/prisma';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import { DeletePropertyButton } from './DeletePropertyButton'; // Adjust the import path as necessary

const prisma = new PrismaClient();

async function getProperties() {
  return await prisma.property.findMany({
    orderBy: { postedAt: 'desc' },
  });
}

export default async function PropertiesListPage() {
  const properties = await getProperties();

  return (
    <Layout>
    <div>
      <h1>Manage Properties</h1>
      <div className="space-y-4">
        {properties.map((prop) => (
          <div key={prop.id} className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h3 className="font-bold">{prop.title}</h3>
              <p className="text-sm text-gray-500">{prop.address}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/Dashboard/properties/${prop.id}/edit`} className="text-blue-600 hover:text-blue-800" title="Edit Property">
                <Edit size={20} />
              </Link>
              <DeletePropertyButton propertyId={prop.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
    </Layout>
  );
}