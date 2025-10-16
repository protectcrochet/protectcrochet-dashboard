// /app/scouts/page.tsx
import { supabaseServer } from '@/lib/supabase/server'
import { convertScout } from './actions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ScoutsPage() {
  const sb = await supabaseServer()

  const { data, error } = await sb
    .from('case_scouts')
    .select('id, title, url, source, status, created_at, detected_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-8 text-red-600">
        Error cargando scouts: {error.message}
      </div>
    )
  }

  const rows = data ?? []

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--pc-brand)]">
        Scouts guardados
      </h1>

      {rows.length === 0 ? (
        <div className="text-[var(--pc-muted)]">Aún no hay registros en scouting.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="border border-[var(--pc-border)] rounded-xl bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    {r.title || 'Sin título'}
                  </div>
                  <div className="text-sm text-[var(--pc-muted)]">
                    {r.source} ·{' '}
                    {(r.created_at || r.detected_at)
                      ? new Date(r.created_at ?? r.detected_at).toLocaleString()
                      : '—'}
                  </div>
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      className="text-[var(--pc-brand)] text-sm underline break-all"
                    >
                      {r.url}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      (r.status || '').toLowerCase() === 'reviewed'
                        ? 'bg-[var(--pc-surface)] text-[var(--pc-muted)]'
                        : 'bg-[var(--pc-brand)]/10 text-[var(--pc-brand)]'
                    }`}
                  >
                    {r.status || 'new'}
                  </span>

                  <form action={convertScout}>
                    <input type="hidden" name="scoutId" value={r.id} />
                    <button
                      type="submit"
                      className="px-3 py-1 border border-[var(--pc-brand)] rounded-lg text-[var(--pc-brand)] hover:bg-[var(--pc-surface)]"
                      disabled={(r.status || '').toLowerCase() === 'reviewed'}
                    >
                      {(r.status || '').toLowerCase() === 'reviewed'
                        ? 'Convertido'
                        : 'Convertir en caso'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
