'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import { useMemo } from 'react'

type SeriesPoint = { day: string; [key: string]: number | string }
type LineDef = { dataKey: string; name?: string }

export default function MetricsChart({
  data,
  lines,
}: {
  data: SeriesPoint[]
  lines: LineDef[]
}) {
  // Formato de fecha corto (DD/MM) para el eje X
  const formatted = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        dayLabel: new Date(d.day as string).toLocaleDateString(undefined, {
          day: '2-digit',
          month: '2-digit',
        }),
      })),
    [data]
  )

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dayLabel" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: '#0B0F14', border: '1px solid #1f2937', color: '#E6EDF3' }}
            labelFormatter={(_, payload) => {
              const raw = payload?.[0]?.payload?.day as string | undefined
              return raw ?? ''
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {lines.map((l) => (
            <Line
              key={l.dataKey}
              type="monotone"
              dataKey={l.dataKey}
              name={l.name ?? l.dataKey}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
