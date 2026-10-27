'use client';

import { useState, useTransition } from 'react';
import { toast } from 'react-hot-toast';
import { Star } from 'lucide-react';
import { reportReservationIssue, submitReview } from '../action/reservations';
import { ISSUE_REASONS } from '../lib/reasons';

export function StarRating({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= Math.round(value) ? 'fill-accent-400 text-accent-400' : 'text-gray-300'} />
      ))}
    </span>
  );
}

export function ReviewForm({ orderId }: { orderId: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [pending, startTransition] = useTransition();

  const submit = () =>
    startTransition(async () => {
      const res = await submitReview(orderId, rating, comment);
      if (res.ok) toast.success('Thanks for rating the agent!');
      else toast.error(res.error);
    });

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">How was the agent?</p>
      <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            className="rounded-full p-0.5 transition hover:scale-110"
          >
            <Star size={26} className={n <= (hover || rating) ? 'fill-accent-400 text-accent-400' : 'text-gray-300'} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        maxLength={1000}
        placeholder="Optional: tell other tenants about your experience"
        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
      <button onClick={submit} disabled={pending || rating === 0} className="btn btn-primary btn-sm">
        {pending ? 'Saving…' : 'Submit rating'}
      </button>
    </div>
  );
}

export function IssueForm({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<keyof typeof ISSUE_REASONS>('no-response');
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50">
        Report a problem
      </button>
    );
  }

  const submit = () =>
    startTransition(async () => {
      const res = await reportReservationIssue(orderId, reason, message);
      if (res.ok) {
        toast.success("Thanks – we'll look into it and get back to you.");
        setOpen(false);
      } else {
        toast.error(res.error);
      }
    });

  return (
    <div className="space-y-3 rounded-xl border border-red-200 bg-red-50/50 p-4">
      <p className="text-sm font-semibold text-gray-800">Report a problem with this reservation</p>
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value as keyof typeof ISSUE_REASONS)}
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
      >
        {Object.entries(ISSUE_REASONS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        maxLength={5000}
        placeholder="What happened?"
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
      />
      <div className="flex gap-2">
        <button onClick={submit} disabled={pending} className="btn btn-danger btn-sm">
          {pending ? 'Sending…' : 'Send report'}
        </button>
        <button onClick={() => setOpen(false)} className="btn btn-ghost btn-sm">Cancel</button>
      </div>
    </div>
  );
}
