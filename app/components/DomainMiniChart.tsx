// /components/DomainMiniChart.tsx
'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

export default function DomainMiniChart({
  data,
}: {
  data: { source_domain: string; total: number }[]
}) {
  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-slate-500">
        No hay datos de dominios aún.
      </div>
    )
  }

  // Limitamos a top 8 para que sea más legible
  const chartData = data.slice(0, 8).map((d) => ({
    name: d.source_domain?.replace(/^www\./, '') || '(sin dominio)',
    total: d.total,
  }))

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            angle={-20}
            textAnchor="end"
            interval={0}
            height={50}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            allowDecimals={false}
            width={40}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value} casos`, 'Total']}
          />
          <Bar dataKey="total" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
