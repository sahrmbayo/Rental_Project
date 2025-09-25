// app/admin/LatestProperties.tsx
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function getLatestProps() {
  return prisma.property.findMany({
    orderBy: { postedAt: 'desc' },
    take: 10,
    select: { id: true, title: true, city: true, price: true, isAvailable: true },
  });
}

export default async function LatestProperties() {
  const props = await getLatestProps();

  return (
    <ul className="divide-y">
      {props.map((p) => (
        <li key={p.id} className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-gray-900">{p.title}</p>
            <p className="text-sm text-gray-500">{p.city} · NLe{p.price.toLocaleString()}</p>
          </div>
          <form action="/admin/toggle-property" method="POST">
            <input type="hidden" name="id" value={p.id} />
            <button
              type="submit"
              className={`rounded px-3 py-1 text-xs font-medium ${
                p.isAvailable ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}
            >
              {p.isAvailable ? 'Block' : 'Unblock'}
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}