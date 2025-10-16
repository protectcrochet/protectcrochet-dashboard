import { supabaseServer } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function CasesPage() {
  const sb = await supabaseServer()
  const { data, error } = await sb
    .from('case_scouts')
    .select('id, title, url, domain, source, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>
  }

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--pc-brand)]">Scouting guardado</h1>
      {(!data || data.length === 0) ? (
        <div className="text-[var(--pc-muted)]">Aún no hay registros.</div>
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <div key={r.id} className="border border-[var(--pc-border)] rounded-lg p-4 bg-white">
              <div className="flex justify-between">
                <div className="font-medium">{r.title || 'Sin título'}</div>
                <span className="text-xs text-[var(--pc-muted)]">{r.source}</span>
              </div>
              <div className="text-sm text-[var(--pc-muted)]">{r.domain || '—'}</div>
              {r.url && (
                <a href={r.url} target="_blank" className="text-[var(--pc-brand)] text-sm underline">
                  {r.url}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
    