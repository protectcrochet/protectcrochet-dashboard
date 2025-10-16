export default function DashboardPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Panel ProtectCrochet ✅</h1>
      <p style={{ color: '#555' }}>
        ¡La ruta <code>/dashboard</code> está activa!
      </p>
      <p>
        Prueba también un caso:{" "}
        <a href="/dashboard/cases/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa">
          /dashboard/cases/aaaaaaaa-...
        </a>
      </p>
    </main>
  );
}
