// app/search/page.tsx
export default async function SearchPage({ searchParams }: any) {
  const q = typeof searchParams?.q === 'string' ? searchParams.q : ''
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Búsqueda</h1>
      <p className="text-sm opacity-70">Término: {q || '—'}</p>
      {/* Resultados */}
    </main>
  )
}
