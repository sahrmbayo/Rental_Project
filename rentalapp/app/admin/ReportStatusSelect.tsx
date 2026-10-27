'use client';

import { useTransition } from 'react';
import { toast } from 'react-hot-toast';
import { setListingReportStatus, setReservationIssueStatus } from './actions';
import { REPORT_STATUSES } from '../lib/reasons';

export default function ReportStatusSelect({
  id,
  status,
  kind,
}: {
  id: string;
  status: string;
  kind: 'listing' | 'reservation';
}) {
  const [pending, startTransition] = useTransition();

  const update = (next: string) =>
    startTransition(async () => {
      try {
        await (kind === 'listing' ? setListingReportStatus(id, next) : setReservationIssueStatus(id, next));
      } catch {
        toast.error('Could not update status');
      }
    });

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => update(e.target.value)}
      className="rounded-full border border-gray-300 px-2 py-1 text-xs"
    >
      {REPORT_STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
