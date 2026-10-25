'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { saveAgentPhone } from '../action/saveAgentPhone';

export function PhoneModal() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (done) return null;

  const save = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const result = await saveAgentPhone({ phone });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success('Phone number saved');
      setDone(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow m-5">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Add your phone number</h2>
        <p className="mb-4 text-sm text-gray-600">Please make sure you add <strong>+232</strong> for us to reach you</p>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+232..."
          className="w-full rounded border px-3 py-2 text-gray-600"
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={save}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}