// /components/RemindNowButton.tsx
'use client'

import { useTransition, useState } from 'react'
import { sendManualReminder } from '@/app/cases/actions'

export default function RemindNowButton({ caseId }: { caseId: string }) {
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => start(async () => {
          const res = await sendManualReminder(caseId)
          setMsg(res.ok ? 'Enviado ✅' : `Error: ${res.error}`)
        })}
        disabled={pending}
        className="text-xs border rounded-md px-2 py-1 hover:bg-slate-50 disabled:opacity-60"
        title="Enviar recordatorio ahora"
      >
        Enviar recordatorio
      </button>
      {msg ? <span className="text-xs text-slate-500">{msg}</span> : null}
    </div>
  )
}
