// components/ScoutList.tsx
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import SourceBadge from '@/components/SourceBadge'
import type { CaseScout, ScoutSource } from '@/types/case-scouts'

const ALL_SOURCES: ScoutSource[] = [
  'etsy',
  'pinterest',
  'google',
  'maxella',
  'vk',
  'facebook',
  'instagram',
  'tiktok',
  'other',
]

export default function ScoutList({
  rows,
  promoteAction,
}: {
  rows: CaseScout[]
  // Server Action recibida como prop desde un Server Component
  promoteAction: (formData: FormData) => Promise<{ ok: boolean; error?: string } | { ok: boolean }>
}) {
  const [q, setQ] = useState('')
  const [enabled, setEnabled] = useState<Record<ScoutSource, boolean>>(
    () =>
      ALL_SOURCES.reduce((acc, s) => {
        acc[s] = true
        return acc
      }, {} as Record<ScoutSource, boolean>)
  )

  const toggle = (s: ScoutSource) =>
    setEnabled((prev) => ({ ...prev, [s]: !prev[s] }))

  const clearFilters = () => {
    setEnabled(ALL_SOURCES.reduce((acc, s) => ({ ...acc, [s]: true }), {} as Record<ScoutSource, boolean>))
    setQ('')
  }

  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase()
    const passSource = (s: ScoutSource) => enabled[s]
    const passQuery = (r: CaseScout) => {
      if (!qn) return true
      return (
        r.keyword?.toLowerCase().includes(qn) ||
        r.title?.toLowerCase().includes(qn) ||
        r.url?.toLowerCase().includes(qn)
      )
    }
    return (rows || []).filter((r) => passSource(r.source) && passQuery(r))
  }, [rows, enabled, q])

  if (!rows?.length) {
    return (
      <div className="rounded-2xl border p-4 text-sm text-slate-600">
        No hay búsquedas guardadas aún. Realiza una búsqueda en{' '}
        <Link href="/search" className="underline">
          /search
        </Link>{' '}
        y usa “Guardar en Scout”.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* 🔍 Toolbar de filtros */}
      <div className="rounded-2xl border p-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Buscador */}
          <div className="flex-1 flex gap-2 items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filtrar por keyword, título o URL…"
              className="w-full md:max-w-sm rounded-xl border px-3 py-2 text-sm"
            />
            <button
              onClick={clearFilters}
              className="rounded-xl border px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
            >
              Limpiar filtros
            </button>
          </div>

          {/* Checkboxes de fuentes */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-3 gap-y-2">
            {ALL_SOURCES.map((s) => (
              <label key={s} className="inline-flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={enabled[s]}
                  onChange={() => toggle(s)}
                  className="h-3.5 w-3.5"
                />
                <SourceBadge source={s} />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 🧮 Contador de resultados */}
      <div className="text-sm text-slate-500 flex justify-between items-center px-1">
        <span>
          Mostrando <b>{filtered.length}</b> de {rows.length} resultados
        </span>
        {q && (
          <span className="italic text-slate-400">
            Filtro activo: “{q}”
          </span>
        )}
      </div>

      {/* 📋 Tabla */}
      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Fecha</th>
              <th className="px-3 py-2 text-left">Keyword</th>
              <th className="px-3 py-2 text-left">Fuente</th>
              <th className="px-3 py-2 text-left">Título</th>
              <th className="px-3 py-2 text-left">URL</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2 whitespace-nowrap">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="px-3 py-2">{r.keyword}</td>
                <td className="px-3 py-2">
                  <SourceBadge source={r.source} />
                </td>
                <td className="px-3 py-2 truncate max-w-[280px]" title={r.title || ''}>
                  {r.title || '—'}
                </td>
                <td className="px-3 py-2">
                  {r.url ? (
                    <a href={r.url} target="_blank" className="underline">
                      Abrir
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  {/* ✅ Usamos la Server Action pasada por props */}
                  <form action={promoteAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-xl border px-3 py-1 text-xs hover:bg-slate-50">
                      Promover a caso
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-sm text-slate-500" colSpan={7}>
                  No hay resultados con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
