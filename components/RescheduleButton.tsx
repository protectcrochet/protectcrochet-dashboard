'use client';

import { useState, useTransition } from 'react';
import { rescheduleFollowUpForm } from '@/app/dashboard/actions';

export default function RescheduleButton({
  id,
  days = 7,
  label = '+7 días',
}: { id: string; days?: number; label?: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <form
      action={(fd) => {
        setMsg(null);
        start(async () => {
          fd.set('id', id);
          fd.set('days', String(days));
          const res = await rescheduleFollowUpForm(fd);
          setMsg(res.ok ? 'Reprogramado' : (res.error ?? 'Error'));
        });
      }}
      style={{ display: 'inline' }}
    >
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: '4px 10px',
          borderRadius: 999,
          background: pending ? '#374151' : '#111827',
          color: '#fff',
          border: '1px solid #1f2937',
          fontSize: 12,
          cursor: pending ? 'not-allowed' : 'pointer',
        }}
      >
        {pending ? '...' : label}
      </button>
      {msg && (
        <span style={{ marginLeft: 8, fontSize: 12, color: '#9ca3af' }}>
          {msg}
        </span>
      )}
    </form>
  );
}
