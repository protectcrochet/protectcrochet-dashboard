// /app/dashboard/client/page.tsx
import { supabaseRSC } from '@/lib/supabase/rsc'
import { readSearchParams, pick } from '@/app/(utils)/read-sp'

type CaseRow = {
  id: string
  title: string | null
  status: 'new' | 'in_progress' | 'closed' | string
  created_at: string
  pattern_id: string
}

function fmt(date: string | null) {
  if (!date) return '—'
  try { return new Date(date).toLocaleString() } catch { return date }
}

export default async function ClientPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await readSearchParams(searchParams)
  const status = pick(sp, 'status').trim()

  const sb = supabaseRSC()
  const { data: role } = await sb.rpc('get_my_role').catch(() => ({ data: 'client' }))

  const { data: rows = [] } = await sb
    .from('cases')
    .select('id,title,status,created_at,pattern_id')
    .order('created_at', { ascending: false })
    .limit(50)

  let cases = rows as CaseRow[]
  if (status) cases = cases.filter(c => (c.status ?? '').toLowerCase() === status.toLowerCase())

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mis Casos</h1>
        <span className="text-sm text-gray-500">Rol: {role}</span>
      </header>

      <div className="bg-white border rounded-2xl p-4 grid md:grid-cols-4 gap-3">
        <form className="contents">
          <select name="status" defaultValue={status} className="border rounded-lg px-3 py-2 w-full">
            <option value="">Todos</option>
            <option value="new">Abierto</option>
            <option value="in_progress">En proceso</option>
            <option value="closed">Cerrado</option>
          </select>
          <button className="mt-2 md:mt-0 md:col-span-3 bg-blue-600 text-white rounded-lg px-4 py-2">Filtrar</button>
        </form>

        <div className="md:col-span-4 pt-3 border-t">
          <a className="inline-block bg-gray-900 text-white rounded-lg px-3 py-2 text-sm" href={`/api/export/cases?${new URLSearchParams({ status }).toString()}`} target="_blank">
            Exportar mis Casos (CSV)
          </a>
        </div>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="[&>th]:text-left [&>th]:py-3 [&>th]:px-3">
              <th>Título</th><th>Estatus</th><th>Patrón</th><th>Creado</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2">{c.title ?? '—'}</td>
                <td className="px-3 py-2 capitalize">{c.status ?? 'new'}</td>
                <td className="px-3 py-2">{c.pattern_id}</td>
                <td className="px-3 py-2">{fmt(c.created_at)}</td>
              </tr>
            ))}
            {cases.length === 0 && (<tr><td colSpan={4} className="px-3 py-6 text-center text-gray-500">Sin casos por ahora</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
