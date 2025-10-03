// app/admin/ContactSubmissions.tsx
'use client';

import { useState, useEffect } from 'react';

interface ContactSubmission {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  reasonType: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/contact/submissions');
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
  try {
    await fetch(`/api/contact/submissions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchSubmissions(); // Refresh the list
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'issue': return 'bg-red-100 text-red-800';
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'feedback': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-4">Loading contact messages...</div>;

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Contact Messages
        </h2>
        <span className="text-sm text-gray-500">
          {submissions.length} total messages
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((submission) => (
              <tr key={submission.id} className={submission.status === 'new' ? 'bg-blue-50' : ''}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{submission.id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {submission.customerName}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {submission.customerEmail}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {submission.customerPhone || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReasonColor(submission.reasonType)}`}>
                    {submission.reasonType}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 max-w-md">
                  <div className="truncate" title={submission.message}>
                    {submission.message}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <select
                    value={submission.status}
                    onChange={(e) => updateStatus(submission.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(submission.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => alert(`Full Message:\n\n${submission.message}\n\nFrom: ${submission.customerName}\nEmail: ${submission.customerEmail}\nPhone: ${submission.customerPhone || 'Not provided'}`)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {submissions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No contact messages yet
          </div>
        )}
      </div>
    </div>
  );
}