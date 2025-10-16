type PageProps = { params: { id: string } };

export default function CaseDetail({ params }: PageProps) {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Caso #{params.id}</h1>
      <p style={{ color: '#555' }}>
        Ruta dinámica funcionando (<code>/dashboard/cases/[id]</code>).
      </p>
    </main>
  );
}
