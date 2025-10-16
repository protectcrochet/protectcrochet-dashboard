'use client'

export default function CasesFilters({
  status, onStatusChange,
  q, onQChange,
  from, to, onFromChange, onToChange,
}: {
  status: string | null
  onStatusChange: (v: string | null) => void
  q: string
  onQChange: (v: string) => void
  from: string
  to: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1">Estado</label>
        <select
          className="rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-sm"
          value={status ?? ''}
          onChange={(e) => onStatusChange(e.target.value || null)}
        >
          <option value="">Todos</option>
          <option value="open">Abierto</option>
          <option value="closed">Cerrado</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1">Buscar</label>
        <input
          className="rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-sm"
          placeholder="título o dominio…"
          value={q}
          onChange={(e) => onQChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1">Desde</label>
        <input
          type="date"
          className="rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-sm"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1">Hasta</label>
        <input
          type="date"
          className="rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-sm"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
        />
      </div>
    </div>
  )
}
