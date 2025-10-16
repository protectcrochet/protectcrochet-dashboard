// /components/FollowUpBadge.tsx
'use client'

import { useTransition } from 'react'
import { bumpFollowUp } from '@/app/dashboard/actions'

function diffDays(dateStr?: string | null) {
  if (!dateStr) return null
  const target = new Date(dateStr).getTime()
  const now = Date.now()
  const ms = target - now
  return Math.floor(ms / (1000*60*60*24))
}

export default function FollowUpBadge({ caseId, followUpAt }: { caseId: string, followUpAt?: string | null }) {
  const [pending, startTransition] = useTransition()
  const days = diffDays(followUpAt)
  let color = '#9CA3AF' // gray
  let label = 'Sin seguimiento'
  if (days !== null) {
    if (days < 0) { color = '#ef4444'; label = `Vencido ${Math.abs(days)}d`; }
    else if (days <= 2) { color = '#f59e0b'; label = `${days}d`; }
    else if (days <= 7) { color = '#22c55e'; label = `${days}d`; }
    else { color = '#3b82f6'; label = `${days}d`; }
  }

  return (
    <div className="flex items-center gap-2">
      <span
        title={followUpAt ? new Date(followUpAt).toLocaleString() : 'Sin follow_up_at'}
        style={{ background: color, color: 'white', padding: '2px 8px', borderRadius: 999, fontSize: 12 }}
      >
        {label}
      </span>
      <button
        onClick={() => startTransition(async () => { await bumpFollowUp(caseId, 7) })}
        className="text-xs border rounded-md px-2 py-1 hover:bg-slate-50 disabled:opacity-60"
        disabled={pending}
        title="Reprogramar +7 días"
      >
        +7 días
      </button>
    </div>
  )
}
