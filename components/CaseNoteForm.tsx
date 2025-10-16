'use client';

import { useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addCaseNoteForm } from '@/app/dashboard/actions';

export default function CaseNoteForm({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <form
      action={(fd) => {
        start(async () => {
          fd.set('id', id);
          const res = await addCaseNoteForm(fd);
          if (res.ok) {
            // Limpia el textarea de forma segura con ref (sin optional chaining a la izquierda)
            if (textareaRef.current) textareaRef.current.value = '';
            router.refresh();
          } else {
            alert(res.error || 'Error');
          }
        });
      }}
      style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}
    >
      <textarea
        ref={textareaRef}
        id="note-msg"
        name="message"
        placeholder="Escribe una nota…"
        disabled={pending}
        style={{
          borderRadius: 8,
          border: '1px solid #1f2937',
          background: 'transparent',
          color: '#e5e7eb',
          padding: 10,
          minHeight: 64,
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
        {pending ? 'Agregando…' : 'Agregar'}
      </button>
    </form>
  );
}
