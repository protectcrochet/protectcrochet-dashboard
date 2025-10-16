'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const TABS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'open', label: 'Abiertos' },
  { key: 'review', label: 'En revisión' },
  { key: 'closed', label: 'Cerrados' },
];

export default function DashboardStatusTabs() {
  const router = useRouter();
  const sp = useSearchParams();

  const active = sp.get('status') ?? 'all';

  const setStatus = (key: string) => {
    const p = new URLSearchParams(Array.from(sp.entries()));
    if (key === 'all') p.delete('status');
    else p.set('status', key);
    p.set('page', '1');
    router.push(`/dashboard?${p.toString()}`);
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      {TABS.map((t) => {
        const isActive = active === t.key || (active === null && t.key === 'all');
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => setStatus(t.key)}
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
