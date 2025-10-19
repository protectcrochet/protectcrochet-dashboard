// app/patterns/[id]/page.tsx
import { Metadata } from 'next'
import { PromiseParams, SearchParams } from '@/types/compat'

export async function generateMetadata(
  { params }: { params: PromiseParams<{ id: string }>; searchParams?: SearchParams }
): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Patrón ${id} · ProtectCrochet`,
    description: 'Detalle del patrón.',
  }
}

export default async function PatternPage(
  { params }: { params: PromiseParams<{ id: string }>; searchParams?: SearchParams }
) {
  const { id } = await params

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Patrón {id}</h1>
      <section className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6">
        <p className="text-neutral-700 dark:text-neutral-300">
          Aquí se mostrará la información del patrón con ID: <strong>{id}</strong>.
        </p>
      </section>
    </main>
  )
}
 