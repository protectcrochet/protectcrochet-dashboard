// app/dashboard/cases/[id]/page.tsx
import { Metadata } from 'next'
import { PromiseParams, SearchParams } from '@/types/compat'

export async function generateMetadata(
  { params }: { params: PromiseParams<{ id: string }>; searchParams?: SearchParams }
): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Dashboard · Caso ${id} · ProtectCrochet`,
    description: 'Detalle del caso dentro del dashboard.',
  }
}

export default async function DashboardCasePage(
  { params }: { params: PromiseParams<{ id: string }>; searchParams?: SearchParams }
) {
  const { id } = await params

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard · Caso {id}</h1>
      </div>

      <section className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6">
        <p className="text-neutral-700 dark:text-neutral-300">
          Vista del caso <strong>{id}</strong> dentro del dashboard.
        </p>
      </section>
    </main>
  )
}
