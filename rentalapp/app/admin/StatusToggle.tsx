'use client';

import { useState } from 'react';

export default function StatusToggle({ id, currentStatus }: { id: string; currentStatus: string }) {
  const statuses = ['pending', 'reviewed', 'approved', 'rejected'];
  const [status, setStatus] = useState(currentStatus);

  async function updateStatus(newStatus: string) {
    setStatus(newStatus); // instant color
    await fetch(`${window.location.origin}/api/agent-applications/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
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
          ? 'bg-blue-50 text-blue-700 border-blue-300'
          : 'bg-gray-100 text-gray-700 border-gray-300'
      }`}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}