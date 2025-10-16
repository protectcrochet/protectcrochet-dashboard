type Props = {
  title: string
  value: number | string
  subtitle?: string
  trend?: string
}

export default function StatCard({ title, value, subtitle, trend }: Props) {
  return (
    <div className="rounded-2xl border border-gray-800 p-4 bg-gray-950/40">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-gray-500">{subtitle}</div>
      {trend && (
        <div className="mt-3 inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded-lg">
          <span aria-hidden>{trend}</span>
          <span>Tendencia</span>
        </div>
      )}
    </div>
  )
}
