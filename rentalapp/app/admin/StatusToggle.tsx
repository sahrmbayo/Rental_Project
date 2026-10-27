'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

const STATUSES = ['pending', 'reviewed', 'approved', 'rejected'];

export default function StatusToggle({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);

  async function updateStatus(newStatus: string) {
    if (newStatus === 'rejected' && !confirm('Rejecting deletes this application. Continue?')) return;

    const previous = status;
    setStatus(newStatus);
    const res = await fetch('/api/agent-applications/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    }).catch(() => null);

    if (!res?.ok) {
      setStatus(previous);
      const data = await res?.json().catch(() => null);
      toast.error(data?.message || 'Could not update application');
      return;
    }

    const { result } = await res.json().catch(() => ({}));
    if (result === 'promoted') toast.success('Approved – they are now a verified agent');
    else if (result === 'invited') toast.success('Approved – an invitation email was sent');
  }

  return (
    <select
      value={status}
      onChange={(e) => updateStatus(e.target.value)}
      className={`text-xs uppercase px-2 py-1 rounded border ${
        status === 'approved'
          ? 'bg-green-50 text-green-700 border-green-300'
          : status === 'rejected'
          ? 'bg-red-50 text-red-700 border-red-300'
          : status === 'reviewed'
          ? 'bg-accent-50 text-accent-700 border-accent-300'
          : 'bg-gray-100 text-gray-700 border-gray-300'
      }`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
