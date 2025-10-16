// /components/CaseTimeline.tsx
export type TimelineItem = {
  id: string
  created_at: string
  event: string
  message?: string | null
  meta?: any
}

export default function CaseTimeline({ items }: { items: TimelineItem[] }) {
  if (!items?.length) {
    return <div className="text-sm text-slate-500">Sin eventos aún.</div>
  }
  return (
    <ol className="relative border-s border-slate-200 pl-4 space-y-4">
      {items.map((it) => (
        <li key={it.id} className="ml-2">
          <div className="absolute -left-1 w-2 h-2 rounded-full bg-slate-400 mt-2"></div>
          <div className="text-xs text-slate-500">{new Date(it.created_at).toLocaleString()}</div>
          <div className="text-sm font-medium">{it.event}</div>
          {it.message ? <div className="text-sm text-slate-700">{it.message}</div> : null}
          {it.meta ? <pre className="bg-slate-50 text-xs p-2 rounded border border-slate-200 mt-1 overflow-x-auto">{JSON.stringify(it.meta, null, 2)}</pre> : null}
        </li>
      ))}
    </ol>
  )
}
