// app/admin/LatestAgents.tsx
import { clerkClient } from '@clerk/clerk-sdk-node';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function getLatestAgents() {
  const agents = await prisma.agent.findMany({
    orderBy: { id: 'desc' },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      
    },
  });

  return Promise.all(
    agents.map(async (a) => {
      const user = await clerkClient.users.getUser(a.id);
      return { ...a, banned: user.banned ?? false };
    })
  );
}

export default async function LatestAgents() {
  const agents = await getLatestAgents();

  return (
    <ul className="divide-y">
      {agents.map((a) => (
        <li key={a.id} className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-gray-900">{a.name}</p>
            <p className="text-sm text-gray-500">{a.email}</p>
          </div>
          <div className="flex gap-2">
           <form action="/admin/toggle-agent" method="POST">
              <input type="hidden" name="id" value={a.id} />
              <button
                className={`rounded px-3 py-1 text-xs font-medium ${
                  a.banned ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {a.banned ? 'Re-instate' : 'Ban'}
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}