// app/admin/ReservedCount.tsx
import { prisma } from '../lib/prisma';

async function getReservedCount() {
  return prisma.order.count({ where: { status: 'completed' } });
}

export default async function ReservedCount() {
  const count = await getReservedCount();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div>
      <p className="text-sm text-gray-500">Total reserved</p>
      <p className="text-3xl font-bold text-gray-900">{count.toLocaleString()}</p>
    </div>
    <div>
      <p className="text-sm text-gray-500">Total Revenue</p>
      <p className="text-3xl font-bold text-gray-900">Nle{(count*50).toLocaleString()}</p>
    </div>
    </div>
  );
}