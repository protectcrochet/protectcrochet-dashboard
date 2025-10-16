// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Panel ProtectCrochet ✅</h1>
      <p style={{ color: '#9ca3af' }}>La ruta /dashboard ya debería renderizar sin auth.</p>
      <p>
        Probar caso: <a href="/dashboard/cases/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa">/dashboard/cases/…</a>
      </p>
    </main>
  );
}

