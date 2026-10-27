'use client';

import { useState, useTransition } from 'react';
import { Flag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { reportListing } from '../action/reportListing';
import { REPORT_REASONS } from '../lib/reasons';

export default function ReportListingButton({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<keyof typeof REPORT_REASONS>('wrong-info');
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  const submit = () =>
    startTransition(async () => {
      const res = await reportListing(propertyId, reason, message);
      if (res.ok) {
        toast.success('Thanks – our team will review this listing.');
        setOpen(false);
        setMessage('');
      } else {
        toast.error(res.error);
      }
    });

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-ghost btn-sm text-gray-500">
        <Flag size={14} /> Report listing
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900">Report this listing</h2>
            <p className="mt-1 text-sm text-gray-500">Tell us what&apos;s wrong. Reports are anonymous to the agent.</p>
            <div className="mt-4 space-y-2">
              {Object.entries(REPORT_REASONS).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === value}
                    onChange={() => setReason(value as keyof typeof REPORT_REASONS)}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  {label}
                </label>
              ))}
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Optional details"
              className="mt-4 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={submit} disabled={pending} className="btn btn-danger">
                {pending ? 'Sending…' : 'Send report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
