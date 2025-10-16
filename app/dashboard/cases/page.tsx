import CasesView from '@/components/CasesView'

export const metadata = {
  title: 'Casos — ProtectCrochet',
}

export default function CasesPage({
  searchParams,
}: {
  searchParams?: { status?: string; q?: string; from?: string; to?: string }
}) {
  return (
    <main className="min-h-dvh p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Casos</h1>
      <CasesView
        initialStatus={searchParams?.status ?? null}
        initialQ={searchParams?.q ?? ''}
        initialFrom={searchParams?.from ?? ''}
        initialTo={searchParams?.to ?? ''}
      />
    </main>
  )
}
