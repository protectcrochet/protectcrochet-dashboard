export default function DomainMiniChart({
  domain,
  count,
}: {
  domain: string
  count: number
}) {
  return (
    <div className="rounded-2xl border p-4 text-center">
      <div className="text-sm text-slate-500 mb-1">{domain}</div>
      <div className="text-xl font-semibold">{count}</div>
    </div>
  )
}