'use client'

import { useEffect, useMemo, useState } from 'react'
import CasesFilters from './CasesFilters'

type CaseRow = {
  id: string
  created_at: string
  title: string
  status: string
  domain: string | null
}

export default function CasesView({
  initialStatus = null,
  initialQ = '',
  initialFrom = '',
  initialTo = '',
}: {
  initialStatus?: string | null
  initialQ?: string
  initialFrom?: string
  initialTo?: string
}) {
  const [rows, setRows] = useState<CaseRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // 🔹 estados con valores iniciales desde searchParams
  const [status, setStatus] = useState<string | null>(initialStatus)
  const [q, setQ] = useState<string>(initialQ)
  const [from, setFrom] = useState<string>(initialFrom)  // YYYY-MM-DD
  const [to, setTo] = useState<string>(initialTo)        // YYYY-MM-DD
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])

  function buildExportUrl() {
    const url = new URL('/api/export/cases', window.location.origin)
    if (status) url.searchParams.set('status', status)
    if (q.trim()) url.searchParams.set('q', q.trim())
    if (from) url.searchParams.set('from', from)
    if (to) url.searchParams.set('to', to)
    return url.toString()
  }

  async function fetchData() {
    setLoading(true)
    try {
      const resp = await fetch('/api/cases/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: status || null,
          q: q?.trim() || null,
          from: from || null,
          to: to || null,
          page,
          limit,
        }),
      })
      const data = await resp.json()
      if (data.ok) {
        setRows(data.rows)
        setTotal(data.total)
      } else {
        console.error('Search error:', data.error)
        setRows([]); setTotal(0)
      }
    } catch (e) {
      console.error(e)
      setRows([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q, from, to, page, limit])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <CasesFilters
          status={status}
          onStatusChange={(v) => { setStatus(v); setPage(1) }}
          q={q}
          onQChange={(v) => { setQ(v); setPage(1) }}
          from={from}
          to={to}
          onFromChange={(v) => { setFrom(v); setPage(1) }}
          onToChange={(v) => { setTo(v); setPage(1) }}
        />

        <a href={buildExportUrl()} className="rounded-lg border border-gray-800 px-3 py-2 text-sm hover:bg-gray-900/60" download>
          Exportar CSV
        </a>
      </div>

      <div className="rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="text-left px-4 py-3">Fecha</th>
              <th className="text-left px-4 py-3">Título</th>
              <th className="text-left px-4 py-3">Dominio</th>
              <th className="text-left px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">Cargando…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">Sin resultados</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-900/50">
                  <td className="px-4 py-3">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3">{r.domain ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-lg px-2 py-1 text-xs ${
                      r.status === 'open'
                        ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-900/40 text-slate-300 border border-slate-700'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-gray-400">
          Página {page} de {totalPages} — {total} resultados
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-lg bg-gray-900 border border-gray-800 px-2 py-1 text-sm"
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }}
          >
            {[10, 20, 50].map(n => <option key={n} value={n}>{n}/página</option>)}
          </select>
          <button
            className="rounded-lg border border-gray-800 px-3 py-1 text-sm disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >Anterior</button>
          <button
            className="rounded-lg border border-gray-800 px-3 py-1 text-sm disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >Siguiente</button>
        </div>
      </div>
    </div>
  )
}
