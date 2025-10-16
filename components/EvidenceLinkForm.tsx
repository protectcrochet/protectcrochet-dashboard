'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addEvidenceLinkForm } from '@/app/dashboard/actions';

export default function EvidenceLinkForm({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <form
      action={(fd) => {
        start(async () => {
          fd.set('id', id);
          const res = await addEvidenceLinkForm(fd);
          if (res.ok) router.refresh();
          else alert(res.error || 'Error');
        });
      }}
      style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}
    >
      <input
        name="url"
        placeholder="https://enlace-de-evidencia…"
        disabled={pending}
        style={{
          borderRadius: 8,
          border: '1px solid #1f2937',
          background: 'transparent',
          color: '#e5e7eb',
          padding: '8px 10px',
          fontSize: 13,
        }}
      />
      <button
        type="submit"
        disabled={pending}
        style={{
          borderRadius: 8,
          border: '1px solid #1f2937',
          background: pending ? '#374151' : '#111827',
          color: '#fff',
          padding: '8px 12px',
          fontSize: 13,
          height: 40,
          alignSelf: 'start',
          cursor: pending ? 'not-allowed' : 'pointer',
        }}
      >
        {pending ? 'Guardando…' : 'Agregar'}
      </button>
    </form>
  );
}
