// /app/dashboard/Tabs.tsx
'use client'

import { useMemo, useState } from 'react'

export type CaseItem = {
  id: string
  title: string | null
  url: string | null
  domain: string | null
  status: string | null
  priority: string | null
  created_at?: string | null
}

type Props = {
  cases: CaseItem[]
}

type TabKey = 'open' | 'closed' | 'all'

function normalizeStatus(s?: string | null) {
  // Ajusta aquí los mapeos de estados a “abierto/cerrado” según tu esquema real
  const v = (s || '').toLowerCase()
  const closed = ['closed', 'resolved', 'removed', 'archived', 'done']
  if (closed.includes(v)) return 'closed'
  return 'open'
}

export default function Tabs({ cases }: Props) {
  const [active, setActive] = useState<TabKey>('open')
  const [q, setQ] = useState('')

  const counts = useMemo(() => {
    let open = 0
    let closed = 0
    for (const c of cases) {
      if (normalizeStatus(c.status) === 'closed') closed++
      else open++
    }
    return { open, closed, all: cases.length }
  }, [cases])

  const filtered = useMemo(() => {
    const base =
      active === 'all'
        ? cases
        : cases.filter((c) => normalizeStatus(c.status) === active)

    const query = q.trim().toLowerCase()
    if (!query) return base

    return base.filter((c) => {
      return (
        (c.title || '').toLowerCase().includes(query) ||
        (c.domain || '').toLowerCase().includes(query) ||
        (c.url || '').toLowerCase().includes(query)
      )
    })
  }, [cases, active, q])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActive('open')}
          className={`px-3 py-2 rounded-lg border ${
            active === 'open'
              ? 'bg-[var(--pc-brand)] text-white border-[var(--pc-brand)]'
              : 'bg-white text-[var(--pc-text)] border-[var(--pc-border)]'
          }`}
        >
          Abiertos ({counts.open})
        </button>
        <button
          onClick={() => setActive('closed')}
          className={`px-3 py-2 rounded-lg border ${
            active === 'closed'
              ? 'bg-[var(--pc-brand)] text-white border-[var(--pc-brand)]'
              : 'bg-white text-[var(--pc-text)] border-[var(--pc-border)]'
          }`}
        >
          Cerrados ({counts.closed})
        </button>
        <button
          onClick={() => setActive('all')}
          className={`px-3 py-2 rounded-lg border ${
            active === 'all'
              ? 'bg-[var(--pc-brand)] text-white border-[var(--pc-brand)]'
              : 'bg-white text-[var(--pc-text)] border-[var(--pc-border)]'
          }`}
        >
          Todos ({counts.all})
        </button>

        <div className="ml-auto flex-1 min-w-[240px] max-w-sm">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, dominio o URL…"
            className="w-full bg-white border border-[var(--pc-border)] rounded-lg p-2.5"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-[var(--pc-muted)]">No hay casos para esta vista.</div>
      ) : (
        <div className="overflow-x-auto border border-[var(--pc-border)] rounded-xl bg-white">
          <table className="min-w-full border-collapse">
            <thead className="bg-[var(--pc-surface)]">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--pc-text)]">Título</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--pc-text)]">Dominio</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--pc-text)]">Estado</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--pc-text)]">Prioridad</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--pc-text)]">Creado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-[var(--pc-border)] hover:bg-[var(--pc-surface)]">
                  <td className="px-4 py-2 text-sm">
                    {c.url ? (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--pc-brand)] underline"
                      >
                        {c.title || 'Sin título'}
                      </a>
                    ) : (
                      c.title || 'Sin título'
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">{c.domain || '—'}</td>
                  <td className="px-4 py-2 text-sm capitalize">{c.status || 'nuevo'}</td>
                  <td className="px-4 py-2 text-sm">{c.priority || 'media'}</td>
                  <td className="px-4 py-2 text-sm">
                    {c.created_at ? new Date(c.created_at).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
