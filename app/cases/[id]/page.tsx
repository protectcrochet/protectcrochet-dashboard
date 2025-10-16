// /app/cases/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CasePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  const sb = await supabaseServer()

  // Cargar el caso
  const { data: c, error } = await sb
    .from('cases')
    .select('id, title, url, domain, status, priority, created_at, description')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    // Si prefieres, puedes mostrar un bloque de error en lugar de lanzar
    throw new Error('Error cargando caso: ' + error.message)
  }
  if (!c) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--pc-brand)]">
          {c.title || 'Caso sin título'}
        </h1>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg bg-[var(--pc-brand)] text-white hover:bg-[var(--pc-brand-dark)]"
        >
          Volver al dashboard
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-[var(--pc-border)] rounded-xl bg-white p-4">
          <div className="text-sm text-[var(--pc-muted)]">Dominio</div>
          <div className="font-medium">{c.domain || '—'}</div>
        </div>
        <div className="border border-[var(--pc-border)] rounded-xl bg-white p-4">
          <div className="text-sm text-[var(--pc-muted)]">Estado</div>
          <div className="font-medium capitalize">{c.status || 'open'}</div>
        </div>
        <div className="border border-[var(--pc-border)] rounded-xl bg-white p-4">
          <div className="text-sm text-[var(--pc-muted)]">Prioridad</div>
          <div className="font-medium">{c.priority || 'medium'}</div>
        </div>
        <div className="border border-[var(--pc-border)] rounded-xl bg-white p-4">
          <div className="text-sm text-[var(--pc-muted)]">Creado</div>
          <div className="font-medium">
            {c.created_at ? new Date(c.created_at as any).toLocaleString() : '—'}
          </div>
        </div>
      </div>

      <div className="border border-[var(--pc-border)] rounded-xl bg-white p-4 space-y-2">
        <div className="text-sm text-[var(--pc-muted)]">URL</div>
        {c.url ? (
          <a
            href={c.url}
            target="_blank"
            className="text-[var(--pc-brand)] underline break-all"
          >
            {c.url}
          </a>
        ) : (
          <div>—</div>
        )}
      </div>

      <div className="border border-[var(--pc-border)] rounded-xl bg-white p-4 space-y-2">
        <div className="text-sm text-[var(--pc-muted)]">Descripción</div>
        <div className="whitespace-pre-wrap">{(c as any).description || '—'}</div>
      </div>
    </div>
  )
}
