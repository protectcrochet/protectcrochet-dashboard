// ================================================================
// FILE: app/dashboard/components/CasesTable.tsx
// Tabla de Casos para el Dashboard (export default)
// ================================================================
'use client'

type CaseRow = {
  id: string
  title: string
  status: string | null
  created_at: string
}

export default function CasesTable({ rows }: { rows: CaseRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left border-b">
            <th className="py-2 px-4">Título</th>
            <th className="py-2 px-4">Estatus</th>
            <th className="py-2 px-4">Creado</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows?.length ? (
            rows.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{r.title ?? '—'}</td>
                <td className="py-2 px-4">{r.status ?? 'open'}</td>
                <td className="py-2 px-4">
                  {new Date(r.created_at).toLocaleString('es-MX')}
                </td>
                <td className="py-2 px-4">
                  <a
                    href={`/dashboard/cases/${r.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Ver
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center text-gray-500">
                No hay casos registrados aún.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
