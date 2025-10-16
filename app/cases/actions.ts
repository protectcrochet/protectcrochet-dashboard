// /app/cases/actions.ts
'use server'

import { supabaseServer } from '@/lib/supabase/server'

export async function sendManualReminder(caseId: string) {
  const sb = await supabaseServer()

  const { data: c, error } = await sb.from('cases')
    .select('id, title, contact_email, source_domain, follow_up_at, account_id')
    .eq('id', caseId)
    .single()
  if (error || !c) return { ok: false, error: error?.message || 'Case not found' }
  if (!c.contact_email) return { ok: false, error: 'El caso no tiene contact_email' }

  // Simple email via Resend API using fetch from server (Node/Edge). You can also proxy via /api route.
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const NOTIFY_FROM = process.env.NOTIFY_FROM || 'notifications@protectcrochet.test'
  const NOTIFY_REPLY_TO = process.env.NOTIFY_REPLY_TO || 'support@protectcrochet.test'
  if (!RESEND_API_KEY) return { ok: false, error: 'Falta RESEND_API_KEY en el entorno' }

  const html = `
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI">
    <h2>Recordatorio manual de seguimiento</h2>
    <p>Se solicita seguimiento para este caso:</p>
    <ul>
      <li><strong>Título:</strong> ${c.title ?? 'Caso sin título'}</li>
      <li><strong>Dominio:</strong> ${c.source_domain ?? 'sitio'}</li>
      <li><strong>Follow-up:</strong> ${c.follow_up_at ? new Date(c.follow_up_at).toLocaleString() : 'N/A'}</li>
    </ul>
  </div>`

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [c.contact_email],
      subject: 'Recordatorio manual de seguimiento – ProtectCrochet',
      html,
      reply_to: NOTIFY_REPLY_TO
    })
  })
  if (!r.ok) {
    const t = await r.text()
    return { ok: false, error: `Resend error ${r.status}: ${t}` }
  }

  await sb.from('case_log').insert({
    case_id: c.id,
    event: 'follow_up_notice_sent_manual',
    message: 'Recordatorio manual enviado desde el dashboard',
    meta: { manual: true }
  })

  return { ok: true, error: null }
}
