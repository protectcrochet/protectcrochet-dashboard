'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateCaseStatusForm } from '@/app/dashboard/actions';

const OPTIONS = [
  { key: 'open', label: 'Abierto' },
  { key: 'review', label: 'En revisión' },
  { key: 'closed', label: 'Cerrado' },
];

export default function CaseStatusSelect({
  id,
  value,
}: { id: string; value: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <form
      action={(fd) => {
        start(async () => {
          fd.set('id', id);
          // @ts-ignore - value set by select on submit
          const res = await updateCaseStatusForm(fd);
          if (res.ok) router.refresh();
          else alert(res.error || 'Error');
        });
      }}
    >
      <select
        name="status"
        defaultValue={value}
        disabled={pending}
        style={{
          borderRadius: 8,
          border: '1px solid #1f2937',
          background: 'transparent',
          color: '#e5e7eb',
          padding: '8px 10px',
          fontSize: 13,
        }}
      >
        {OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
      </select>
      <button
        type="submit"
        disabled={pending}
        style={{
          marginLeft: 8,
          borderRadius: 8,
          border: '1px solid #1f2937',
          background: pending ? '#374151' : '#111827',
          color: '#fff',
          padding: '8px 12px',
          fontSize: 13,
          cursor: pending ? 'not-allowed' : 'pointer',
        }}
      >
        {pending ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
