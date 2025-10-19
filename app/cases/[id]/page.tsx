// app/cases/[id]/page.tsx
import { Metadata } from 'next'
import { PromiseParams, SearchParams } from '@/types/compat'

export async function generateMetadata(
  { params }: { params: PromiseParams<{ id: string }>; searchParams?: SearchParams }
): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Caso ${id} · ProtectCrochet`,
    description: 'Detalle del caso registrado en ProtectCrochet.',
  }
}

export default async function CasePage(
  { params }: { params: PromiseParams<{ id: string }>; searchParams?: SearchParams }
) {
  const { id } = await params

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Caso {id}</h1>
      </div>

      <section className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6">
        <p className="text-neutral-700 dark:text-neutral-300">
          Aquí se mostrará la información del caso con ID: <strong>{id}</strong>.
        </p>
      </section>
    </main>
  )
}
