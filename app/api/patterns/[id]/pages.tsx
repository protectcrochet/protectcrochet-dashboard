import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseServerRSC } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page({
  params
}: {
  params: { id: string }
}) {
  const sb = supabaseServerRSC()
  const { data: pattern, error } = await sb
    .from('patterns')
    .select('id,title,created_at')
    .eq('id', params.id)
    .maybeSingle()

  if (error) throw error
  if (!pattern) notFound()

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Patrón</h1>
        <Link href="/dashboard" className="text-sm underline">Volver al dashboard</Link>
      </div>
      <div className="rounded-xl border border-[var(--pc-border)] bg-white p-4">
        <div className="text-sm text-[var(--pc-muted)]">ID</div>
        <div className="font-mono">{pattern.id}</div>
        <div className="text-sm text-[var(--pc-muted)] mt-4">Título</div>
        <div className="font-medium">{pattern.title ?? 'Sin título'}</div>
      </div>
    </main>
  )
}
