// app/admin/ReservedCount.tsx
import { prisma } from '../lib/prisma';
import { RESERVATION_FEE_NLE } from '../lib/config';

export default async function ReservedCount() {
  const count = await prisma.order.count({ where: { status: 'completed' } });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <p className="text-sm text-gray-500">Total reserved</p>
        <p className="text-3xl font-bold text-gray-900">{count.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Total Revenue</p>
        <p className="text-3xl font-bold text-gray-900">Nle{(count * RESERVATION_FEE_NLE).toLocaleString()}</p>
        <p className="text-xs text-gray-400">At the current fee of NLe {RESERVATION_FEE_NLE}</p>
      </div>
    </div>
  );
}
