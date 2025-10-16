// ================================================================
// FILE: app/dashboard/components/ScoutsTable.tsx
// Componente tabla de Scouts con botón para crear caso desde detección
// ================================================================
'use client'

import { useState, useTransition } from 'react'
import { createCaseFromScoutAction } from '@/app/dashboard/actions'

type ScoutRow = {
  id: string
  source?: string | null
  domain?: string | null
  url?: string | null
}

export default function ScoutsTable({ rows, patternId }: { rows: ScoutRow[]; patternId: string }) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const onCreateCase = (scoutId: string) => {
    setPendingId(scoutId)
    startTransition(async () => {
      const res = await createCaseFromScoutAction(patternId, scoutId)
      setPendingId(null)
      if (res.ok) alert('✅ Caso creado correctamente')
      else alert(`❌ Error: ${res.error}${res.detail ? ` — ${res.detail}` : ''}`)
    })
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b bg-gray-100">
            <th className="py-2 px-4">Fuente</th>
            <th className="py-2 px-4">Dominio</th>
            <th className="py-2 px-4">URL</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{r.source ?? '—'}</td>
              <td className="py-2 px-4">{r.domain ?? '—'}</td>
              <td className="py-2 px-4">
                {r.url ? (
                  <a className="underline" href={r.url} target="_blank" rel="noreferrer">
                    {r.url}
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td className="py-2 px-4">
                <button
                  className="px-3 py-1 rounded-lg border"
                  disabled={isPending && pendingId === r.id}
                  onClick={() => onCreateCase(r.id)}
                >
                  {isPending && pendingId === r.id ? 'Creando…' : 'Crear caso desde detección'}
                </button>
              </td>
            </tr>
          ))}
          {(!rows || rows.length === 0) && (
            <tr>
              <td className="py-4 text-center text-gray-500" colSpan={4}>
                No hay detecciones pendientes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
