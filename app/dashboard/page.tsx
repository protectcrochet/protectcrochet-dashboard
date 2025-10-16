import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'
import StatCard from '@/components/StatCard'
import MetricsChart from '@/components/MetricsChart'

export const metadata = {
  title: 'Dashboard — ProtectCrochet',
  description: 'Panel de control con métricas y casos recientes',
}

export default async function DashboardPage() {
  const sb = await supabaseServer()

  // 🔹 Totales de los últimos 30 días
  let totals = { open_cases: 0, closed_cases: 0, new_patterns: 0, domains: 0 }
  try {
    const { data, error } = await sb.rpc('get_dashboard_metrics_30d')
    if (!error && Array.isArray(data) && data[0]) {
      const row = data[0] as any
      totals = {
        open_cases: Number(row.open_cases ?? 0),
        closed_cases: Number(row.closed_cases ?? 0),
        new_patterns: Number(row.new_patterns ?? 0),
        domains: Number(row.domains ?? 0),
      }
    }
  } catch {
    // valores por defecto
  }

  // 🔹 Serie de métricas 30d
  let series: Array<{ day: string; open_cases: number; closed_cases: number; new_patterns: number }> = []
  try {
    const { data, error } = await sb.rpc('get_dashboard_timeseries_30d')
    if (!error && Array.isArray(data)) {
      series = data.map((d: any) => ({
        day: d.day,
        open_cases: Number(d.open_cases ?? 0),
        closed_cases: Number(d.closed_cases ?? 0),
        new_patterns: Number(d.new_patterns ?? 0),
      }))
    }
  } catch {}

  return (
    <main className="min-h-dvh p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Resumen</h1>

      {/* 🔹 Tarjetas con navegación */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/cases?status=open" className="block">
          <StatCard
            title="Casos abiertos"
            value={totals.open_cases}
            subtitle="Últimos 30 días"
            trend="▲"
          />
        </Link>

        <Link href="/dashboard/cases?status=closed" className="block">
          <StatCard
            title="Casos cerrados"
            value={totals.closed_cases}
            subtitle="Últimos 30 días"
            trend="—"
          />
        </Link>

        <Link href="/dashboard/cases?q=pattern" className="block">
          <StatCard
            title="Patrones nuevos"
            value={totals.new_patterns}
            subtitle="Últimos 30 días"
            trend="+"
          />
        </Link>

        <Link href="/dashboard/cases" className="block">
          <StatCard
            title="Dominios"
            value={totals.domains}
            subtitle="Últimos 30 días"
            trend="~"
          />
        </Link>
      </section>

      {/* 🔹 Gráficas */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 p-4 bg-gray-950/40">
          <h2 className="text-lg font-semibold mb-3">Casos por día (30d)</h2>
          <MetricsChart
            data={series}
            lines={[
              { dataKey: 'open_cases', name: 'Abiertos' },
              { dataKey: 'closed_cases', name: 'Cerrados' },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-gray-800 p-4 bg-gray-950/40">
          <h2 className="text-lg font-semibold mb-3">Patrones nuevos por día (30d)</h2>
          <MetricsChart
            data={series}
            lines={[
              { dataKey: 'new_patterns', name: 'Patrones' },
            ]}
          />
        </div>
      </section>
    </main>
  )
}
