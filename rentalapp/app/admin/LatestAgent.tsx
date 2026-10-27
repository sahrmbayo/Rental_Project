// app/admin/LatestAgents.tsx
import { clerkClient } from '@clerk/nextjs/server';
import { ShieldCheck } from 'lucide-react';
import { prisma } from '../lib/prisma';

async function getLatestAgents() {
  const agents = await prisma.agent.findMany({
    orderBy: { id: 'desc' },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isVerified: true,
    },
  });

  if (agents.length === 0) return [];
  const { data: users } = await (await clerkClient()).users.getUserList({
    userId: agents.map((a) => a.id),
    limit: agents.length,
  });
  const banned = new Map(users.map((u) => [u.id, u.banned]));
  return agents.map((a) => ({ ...a, banned: banned.get(a.id) ?? false }));
}

export default async function LatestAgents() {
  const agents = await getLatestAgents();

  return (
    <ul className="divide-y">
      {agents.map((a) => (
        <li key={a.id} className="flex items-center justify-between py-3">
          <div>
            <p className="flex items-center gap-1 font-medium text-gray-900">
              {a.name}
              {a.isVerified && <ShieldCheck size={14} className="text-brand-600" aria-label="Verified" />}
            </p>
            <p className="text-sm text-gray-500">{a.email}</p>
          </div>
          <div className="flex gap-2">
            <form action="/api/admin/toggle-verified" method="POST">
              <input type="hidden" name="id" value={a.id} />
              <button
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  a.isVerified ? 'bg-gray-100 text-gray-700' : 'bg-brand-50 text-brand-700'
                }`}
              >
                {a.isVerified ? 'Unverify' : 'Verify'}
              </button>
            </form>
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