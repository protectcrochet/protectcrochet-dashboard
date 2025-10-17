cat > 'app/cases/[id]/page.tsx' <<'TSX'
export default async function CaseDetailPage({ params }: any) {
  const id = params?.id as string

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Caso {id}</h1>
      <p className="mt-2 text-gray-500">Detalle del caso {id}</p>
    </main>
  )
}
TSX
