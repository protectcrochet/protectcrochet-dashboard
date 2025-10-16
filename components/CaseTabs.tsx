'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const TABS = [
  { key: 'details', label: 'Detalles' },
  { key: 'evidence', label: 'Evidencias' },
  { key: 'actions', label: 'Acciones' },
  { key: 'history', label: 'Historial' },
];

export default function CaseTabs() {
  const router = useRouter();
  const sp = useSearchParams();
  const active = sp.get('tab') ?? 'details';

  const setTab = (key: string) => {
    const p = new URLSearchParams(Array.from(sp.entries()));
    p.set('tab', key);
    router.push(`?${p.toString()}`);
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      {TABS.map(t => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #1f2937',
              background: isActive ? '#111827' : 'transparent',
              color: isActive ? '#fff' : '#e5e7eb',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
